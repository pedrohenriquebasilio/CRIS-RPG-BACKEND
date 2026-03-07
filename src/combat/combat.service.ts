import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RollService } from '../roll/roll.service';
import { GameGateway } from '../gateway/game.gateway';
import { CombatState, TipoDano } from '@prisma/client';

@Injectable()
export class CombatService {
  constructor(
    private prisma: PrismaService,
    private rollService: RollService,
    private gateway: GameGateway,
  ) {}

  async createCombat(campaignId: string, masterId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.masterId !== masterId) throw new ForbiddenException('Only master can create combat');

    // Check no active combat
    const existing = await this.prisma.combat.findFirst({
      where: {
        campaignId,
        state: { notIn: ['IDLE', 'COMBAT_FINISHED'] },
      },
    });
    if (existing) throw new BadRequestException('There is already an active combat');

    const combat = await this.prisma.combat.create({
      data: {
        campaignId,
        state: CombatState.COMBAT_CREATED,
      },
    });

    await this.prisma.campaign.update({
      where: { id: campaignId },
      data: { isActiveCombat: true },
    });

    this.gateway.emitToCampaign(campaignId, 'combatCreated', combat);
    return combat;
  }

  async addParticipant(
    combatId: string,
    data: { characterId?: string; npcId?: string },
    masterId: string,
  ) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    if (combat.state !== CombatState.COMBAT_CREATED) {
      throw new BadRequestException('Cannot add participants after initiative has been rolled');
    }

    if (!data.characterId && !data.npcId) {
      throw new BadRequestException('Must provide either characterId or npcId');
    }

    let hpAtual = 0;
    let energiaAtual = 0;

    if (data.characterId) {
      const character = await this.prisma.character.findUnique({
        where: { id: data.characterId },
      });
      if (!character) throw new NotFoundException('Character not found');
      hpAtual = character.hpAtual;
      energiaAtual = character.energiaAtual;
    } else if (data.npcId) {
      const npc = await this.prisma.npc.findUnique({ where: { id: data.npcId } });
      if (!npc) throw new NotFoundException('NPC not found');
      hpAtual = npc.hpAtual;
      energiaAtual = npc.energiaAtual;
    }

    return this.prisma.combatParticipant.create({
      data: {
        combatId,
        characterId: data.characterId,
        npcId: data.npcId,
        hpAtual,
        energiaAtual,
        ordem: 0,
      },
      include: {
        character: true,
        npc: true,
      },
    });
  }

  async rollInitiative(combatId: string, masterId: string) {
    const combat = await this.getCombatForMaster(combatId, masterId);
    const results = await this.rollService.rollInitiative(combatId);
    const state = await this.getCombatState(combatId);
    this.gateway.emitCombatUpdate(combat.campaignId, state);
    return { results, message: 'Initiative rolled successfully' };
  }

  async startRound(combatId: string, masterId: string) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    if (combat.state === CombatState.INITIATIVE_ROLLED) {
      await this.prisma.combat.update({
        where: { id: combatId },
        data: { state: CombatState.ROUND_ACTIVE, currentTurnIndex: 0 },
      });
    } else if (combat.state === CombatState.ROUND_FINISHED) {
      await this.prisma.combat.update({
        where: { id: combatId },
        data: {
          state: CombatState.ROUND_ACTIVE,
          roundNumber: { increment: 1 },
          currentTurnIndex: 0,
        },
      });
      // Decrement conditions
      await this.decrementConditions(combatId);
    } else {
      throw new BadRequestException('Cannot start round in current combat state');
    }

    return this.getCombatState(combatId);
  }

  async nextTurn(combatId: string, masterId: string) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    if (combat.state !== CombatState.ROUND_ACTIVE) {
      throw new BadRequestException('No active round');
    }

    const participants = await this.prisma.combatParticipant.findMany({
      where: { combatId, isDefeated: false },
      orderBy: { ordem: 'asc' },
    });

    const nextIndex = combat.currentTurnIndex + 1;

    if (nextIndex >= participants.length) {
      // Round finished
      await this.prisma.combat.update({
        where: { id: combatId },
        data: { state: CombatState.ROUND_FINISHED },
      });
    } else {
      await this.prisma.combat.update({
        where: { id: combatId },
        data: { currentTurnIndex: nextIndex },
      });
    }

    return this.getCombatState(combatId);
  }

  async skipTurn(combatId: string, masterId: string) {
    return this.nextTurn(combatId, masterId);
  }

  async reorderParticipant(
    combatId: string,
    participantId: string,
    newOrder: number,
    masterId: string,
  ) {
    await this.getCombatForMaster(combatId, masterId);

    return this.prisma.combatParticipant.update({
      where: { id: participantId },
      data: { ordem: newOrder },
    });
  }

  async applyDamage(
    combatId: string,
    participantId: string,
    damage: number,
    tipoDano: TipoDano,
    masterId: string,
    source?: string,
  ) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    const participant = await this.prisma.combatParticipant.findUnique({
      where: { id: participantId },
      include: {
        character: true,
        npc: true,
      },
    });
    if (!participant) throw new NotFoundException('Participant not found');

    const newHp = Math.max(0, participant.hpAtual - damage);
    const targetName = participant.character?.nome || participant.npc?.nome || 'Unknown';

    await this.prisma.combatParticipant.update({
      where: { id: participantId },
      data: {
        hpAtual: newHp,
        isDefeated: newHp === 0,
      },
    });

    // Log it
    const damageLog = await this.prisma.combatLog.create({
      data: {
        combatId,
        campaignId: combat.campaignId,
        actor: source || 'Mestre',
        actionType: 'DAMAGE',
        target: targetName,
        total: damage,
        details: { tipoDano, hpRestante: newHp },
      },
    });
    if (damageLog.campaignId) this.gateway.emitCombatLog(damageLog.campaignId, damageLog);

    const result = { participantId, damage, hpRestante: newHp, isDefeated: newHp === 0 };
    const combatState = await this.getCombatState(combatId);
    this.gateway.emitCombatUpdate(combatState!.campaign?.id || combatId, combatState);
    return result;
  }

  async applyCondition(
    combatId: string,
    participantId: string,
    conditionId: string,
    masterId: string,
  ) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    const condition = await this.prisma.condition.findUnique({ where: { id: conditionId } });
    if (!condition) throw new NotFoundException('Condition not found');

    const participant = await this.prisma.combatParticipant.findUnique({
      where: { id: participantId },
      include: { character: true, npc: true },
    });
    if (!participant) throw new NotFoundException('Participant not found');

    const result = await this.prisma.participantCondition.create({
      data: {
        participantId,
        conditionId,
        rodadasRestantes: condition.duracaoRodadas,
      },
      include: { condition: true },
    });

    const targetName = participant.character?.nome || participant.npc?.nome || 'Unknown';
    const condLog = await this.prisma.combatLog.create({
      data: {
        combatId,
        campaignId: combat.campaignId,
        actor: 'Mestre',
        actionType: 'CONDITION',
        target: targetName,
        details: {
          conditionId,
          conditionNome: condition.nome,
          duracaoRodadas: condition.duracaoRodadas,
        },
      },
    });
    if (condLog.campaignId) this.gateway.emitCombatLog(condLog.campaignId, condLog);

    return result;
  }

  async forceTest(
    combatId: string,
    characterId: string,
    skillId: string,
    masterId: string,
  ) {
    await this.getCombatForMaster(combatId, masterId);
    const rollService = this.rollService;
    return rollService.rollSkill(skillId, characterId, combatId);
  }

  async finishCombat(combatId: string, masterId: string) {
    const combat = await this.getCombatForMaster(combatId, masterId);

    await this.prisma.combat.update({
      where: { id: combatId },
      data: {
        state: CombatState.COMBAT_FINISHED,
        finishedAt: new Date(),
      },
    });

    await this.prisma.campaign.update({
      where: { id: combat.campaignId },
      data: { isActiveCombat: false },
    });

    this.gateway.emitToCampaign(combat.campaignId, 'combatFinished', { combatId });
    return { message: 'Combat finished', combatId };
  }

  async getCombatState(combatId: string) {
    return this.prisma.combat.findUnique({
      where: { id: combatId },
      include: {
        campaign: { select: { id: true, masterId: true } },
        participants: {
          include: {
            character: { include: { attributes: true } },
            npc: { include: { attributes: true } },
            conditions: { include: { condition: true } },
          },
          orderBy: { ordem: 'asc' },
        },
        logs: { orderBy: { timestamp: 'desc' }, take: 100 },
      },
    });
  }

  async getCombatLogs(combatId: string) {
    return this.prisma.combatLog.findMany({
      where: { combatId },
      orderBy: { timestamp: 'asc' },
    });
  }

  private async getCombatForMaster(combatId: string, masterId: string) {
    const combat = await this.prisma.combat.findUnique({
      where: { id: combatId },
      include: { campaign: true },
    });
    if (!combat) throw new NotFoundException('Combat not found');
    if (combat.campaign.masterId !== masterId) {
      throw new ForbiddenException('Only master can perform this action');
    }
    return combat;
  }

  private async decrementConditions(combatId: string) {
    const participants = await this.prisma.combatParticipant.findMany({
      where: { combatId },
      include: { conditions: true },
    });

    for (const p of participants) {
      for (const pc of p.conditions) {
        if (pc.rodadasRestantes <= 1) {
          await this.prisma.participantCondition.delete({ where: { id: pc.id } });
        } else {
          await this.prisma.participantCondition.update({
            where: { id: pc.id },
            data: { rodadasRestantes: { decrement: 1 } },
          });
        }
      }
    }
  }
}
