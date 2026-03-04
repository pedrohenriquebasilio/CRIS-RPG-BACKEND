import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Atributo } from '@prisma/client';

@Injectable()
export class RollService {
  constructor(private prisma: PrismaService) {}

  roll1d20(): number {
    return Math.floor(Math.random() * 20) + 1;
  }

  rollDice(diceString: string): number {
    // Parses strings like "3d6", "1d20", "2d8+5", "1d4-1"
    const match = diceString.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!match) throw new BadRequestException(`Invalid dice string: ${diceString}`);
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    let total = modifier;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  }

  applyCritical(damage: number, multiplier: number): number {
    return damage * multiplier;
  }

  private getAttrValue(attrs: any, atributo: Atributo): number {
    return attrs[atributo as string] ?? 1;
  }

  private async getCampaignIdFromCombat(combatId: string): Promise<string | null> {
    const combat = await this.prisma.combat.findUnique({
      where: { id: combatId },
      select: { campaignId: true },
    });
    return combat?.campaignId ?? null;
  }

  async calculateCD(characterId: string, attribute: Atributo): Promise<number> {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { attributes: true },
    });
    if (!character || !character.attributes) {
      throw new NotFoundException('Character or attributes not found');
    }
    const attrVal = this.getAttrValue(character.attributes, attribute);
    return 10 + attrVal + character.maestriaBonus;
  }

  async rollAttribute(
    characterId: string,
    attribute: Atributo,
    combatId?: string,
    campaignId?: string,
  ) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { attributes: true },
    });
    if (!character || !character.attributes) {
      throw new NotFoundException('Character or attributes not found');
    }

    const attrVal = this.getAttrValue(character.attributes, attribute);
    const dice = this.roll1d20();
    const total = dice + attrVal;

    const resolvedCampaignId = campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);

    let wasOutOfTurn = false;
    let log: any = null;

    if (combatId) {
      const combat = await this.prisma.combat.findUnique({
        where: { id: combatId },
        include: { participants: { orderBy: { ordem: 'asc' } } },
      });
      if (combat && (combat.state === 'ROUND_ACTIVE' || combat.state === 'ROUND_FINISHED')) {
        const currentParticipant = combat.participants[combat.currentTurnIndex];
        wasOutOfTurn = currentParticipant?.characterId !== characterId;
      }
    }

    if (combatId || resolvedCampaignId) {
      log = await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: resolvedCampaignId,
          actor: character.nome,
          actionType: 'SKILL',
          diceResult: dice,
          total,
          wasOutOfTurn,
          details: { attribute, attrVal, type: 'attribute_roll' },
        },
      });
    }

    return { characterId, attribute, dice, attrVal, total, wasOutOfTurn, log };
  }

  async rollSkill(skillId: string, characterId: string, combatId?: string, campaignId?: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { attributes: true },
    });
    if (!character || !character.attributes) {
      throw new NotFoundException('Character or attributes not found');
    }

    const skill = await this.prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) throw new NotFoundException('Skill not found');

    const charSkill = await this.prisma.characterSkill.findUnique({
      where: { characterId_skillId: { characterId, skillId } },
    });

    const attrVal = this.getAttrValue(character.attributes, skill.atributoBase);
    const maestria = charSkill?.treinada && skill.permiteMaestria
      ? character.maestriaBonus
      : 0;

    const dice = this.roll1d20();
    const total = dice + attrVal + maestria;

    const resolvedCampaignId = campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);

    let log: any = null;
    if (combatId || resolvedCampaignId) {
      let wasOutOfTurn = false;
      if (combatId) {
        const combat = await this.prisma.combat.findUnique({
          where: { id: combatId },
          include: { participants: { orderBy: { ordem: 'asc' } } },
        });
        if (combat && (combat.state === 'ROUND_ACTIVE' || combat.state === 'ROUND_FINISHED')) {
          const currentParticipant = combat.participants[combat.currentTurnIndex];
          wasOutOfTurn = currentParticipant?.characterId !== characterId;
        }
      }

      log = await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: resolvedCampaignId,
          actor: character.nome,
          actionType: 'SKILL',
          diceResult: dice,
          total,
          wasOutOfTurn,
          details: {
            skillId,
            skillNome: skill.nome,
            atributo: skill.atributoBase,
            attrVal,
            maestria,
          },
        },
      });
    }

    return {
      characterId,
      skillId,
      skillNome: skill.nome,
      atributo: skill.atributoBase,
      dice,
      attrVal,
      maestria,
      total,
      log,
    };
  }

  async rollTechnique(
    techniqueId: string,
    actorId: string,
    targetId?: string,
    combatId?: string,
    campaignId?: string,
  ) {
    const technique = await this.prisma.technique.findUnique({
      where: { id: techniqueId },
      include: { character: { include: { attributes: true } } },
    });
    if (!technique) throw new NotFoundException('Technique not found');

    const character = technique.character;
    if (!character.attributes) throw new NotFoundException('Character attributes not found');

    let participantEnergia = character.energiaAtual;
    let participantId: string | null = null;

    if (combatId) {
      const participant = await this.prisma.combatParticipant.findFirst({
        where: { combatId, characterId: character.id },
      });
      if (participant) {
        participantEnergia = participant.energiaAtual;
        participantId = participant.id;
      }
    }

    if (participantEnergia < technique.custoEnergia) {
      throw new BadRequestException('Insufficient energy to use this technique');
    }

    if (participantId) {
      await this.prisma.combatParticipant.update({
        where: { id: participantId },
        data: { energiaAtual: { decrement: technique.custoEnergia } },
      });
    } else {
      await this.prisma.character.update({
        where: { id: character.id },
        data: { energiaAtual: { decrement: technique.custoEnergia } },
      });
    }

    const attrVal = this.getAttrValue(character.attributes, technique.atributoBase);
    const dice = this.roll1d20();
    const total = dice + attrVal + character.maestriaBonus;

    let targetCD: number | null = null;
    let targetInfo: any = null;

    if (targetId) {
      const targetChar = await this.prisma.character.findUnique({
        where: { id: targetId },
        include: { attributes: true },
      });
      if (targetChar && targetChar.attributes) {
        const targetAttr = this.getAttrValue(targetChar.attributes, technique.atributoBase);
        targetCD = 10 + targetAttr + targetChar.maestriaBonus;
        targetInfo = { id: targetId, nome: targetChar.nome, cd: targetCD };
      } else {
        const targetNpc = await this.prisma.npc.findUnique({
          where: { id: targetId },
          include: { attributes: true },
        });
        if (targetNpc) {
          if (targetNpc.isSimplified) {
            targetCD = targetNpc.defesa;
          } else if (targetNpc.attributes) {
            const targetAttr = this.getAttrValue(targetNpc.attributes, technique.atributoBase);
            targetCD = 10 + targetAttr + targetNpc.maestriaBonus;
          }
          targetInfo = { id: targetId, nome: targetNpc.nome, cd: targetCD };
        }
      }
    }

    const success = targetCD !== null ? total >= targetCD : null;

    let wasOutOfTurn = false;
    let log: any = null;

    const resolvedCampaignId = campaignId ?? character.campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);

    if (combatId) {
      const combat = await this.prisma.combat.findUnique({
        where: { id: combatId },
        include: { participants: { orderBy: { ordem: 'asc' } } },
      });
      if (combat && (combat.state === 'ROUND_ACTIVE' || combat.state === 'ROUND_FINISHED')) {
        const currentParticipant = combat.participants[combat.currentTurnIndex];
        wasOutOfTurn = currentParticipant?.characterId !== character.id;
      }
    }

    if (combatId || resolvedCampaignId) {
      log = await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: resolvedCampaignId,
          actor: character.nome,
          actionType: 'TECHNIQUE',
          diceResult: dice,
          total,
          target: targetInfo?.nome,
          wasOutOfTurn,
          details: {
            techniqueId,
            techniqueNome: technique.nome,
            atributo: technique.atributoBase,
            custoEnergia: technique.custoEnergia,
            attrVal,
            maestria: character.maestriaBonus,
            targetCD,
            success,
          },
        },
      });
    }

    return {
      techniqueId,
      techniqueNome: technique.nome,
      actor: character.nome,
      dice,
      attrVal,
      maestria: character.maestriaBonus,
      total,
      custoEnergia: technique.custoEnergia,
      target: targetInfo,
      success,
      wasOutOfTurn,
      log,
    };
  }

  async rollInitiative(combatId: string) {
    const combat = await this.prisma.combat.findUnique({
      where: { id: combatId },
      include: {
        participants: {
          include: {
            character: { include: { attributes: true } },
            npc: { include: { attributes: true } },
          },
        },
      },
    });
    if (!combat) throw new NotFoundException('Combat not found');

    const updates: any[] = [];
    const results: any[] = [];

    for (const participant of combat.participants) {
      let agiVal = 1;
      let name = 'Unknown';

      if (participant.character) {
        agiVal = participant.character.attributes?.AGI ?? 1;
        name = participant.character.nome;
      } else if (participant.npc) {
        if (participant.npc.isSimplified) {
          agiVal = participant.npc.bonusAtaque;
        } else {
          agiVal = participant.npc.attributes?.AGI ?? 1;
        }
        name = participant.npc.nome;
      }

      const dice = this.roll1d20();
      const initiative = dice + agiVal;

      updates.push(
        this.prisma.combatParticipant.update({
          where: { id: participant.id },
          data: { initiative },
        }),
      );

      results.push({ participantId: participant.id, name, dice, agiVal, initiative });
    }

    await this.prisma.$transaction(updates);

    results.sort((a, b) => b.initiative - a.initiative);
    const orderUpdates = results.map((r, index) =>
      this.prisma.combatParticipant.update({
        where: { id: r.participantId },
        data: { ordem: index },
      }),
    );
    await this.prisma.$transaction(orderUpdates);

    await this.prisma.combat.update({
      where: { id: combatId },
      data: { state: 'INITIATIVE_ROLLED', currentTurnIndex: 0 },
    });

    return results;
  }

  async rollOpposed(
    attackerId: string,
    defenderId: string,
    atkAttr?: Atributo,
    defAttr?: Atributo,
    combatId?: string,
    campaignId?: string,
  ) {
    const attacker = await this.prisma.character.findUnique({
      where: { id: attackerId },
      include: { attributes: true },
    });
    const defender = await this.prisma.character.findUnique({
      where: { id: defenderId },
      include: { attributes: true },
    });

    if (!attacker || !attacker.attributes) throw new NotFoundException('Attacker not found');
    if (!defender || !defender.attributes) throw new NotFoundException('Defender not found');

    const attackAttribute = atkAttr ?? Atributo.PRE;
    const defenseAttribute = defAttr ?? Atributo.PRE;

    const attAttr = this.getAttrValue(attacker.attributes, attackAttribute);
    const defAttrVal = this.getAttrValue(defender.attributes, defenseAttribute);

    const attDice = this.roll1d20();
    const defDice = this.roll1d20();
    const attTotal = attDice + attAttr + attacker.maestriaBonus;
    const defTotal = defDice + defAttrVal + defender.maestriaBonus;

    const attackerWins = attTotal > defTotal;

    const resolvedCampaignId = campaignId ?? attacker.campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);

    let log: any = null;
    if (combatId || resolvedCampaignId) {
      log = await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: resolvedCampaignId,
          actor: attacker.nome,
          actionType: 'DEFESA',
          diceResult: attDice,
          total: attTotal,
          target: defender.nome,
          details: {
            type: 'opposed',
            attackAttribute,
            defenseAttribute,
            attacker: { dice: attDice, total: attTotal },
            defender: { dice: defDice, total: defTotal },
            attackerWins,
          },
        },
      });
    }

    return {
      attacker: { id: attackerId, nome: attacker.nome, dice: attDice, total: attTotal, attribute: attackAttribute },
      defender: { id: defenderId, nome: defender.nome, dice: defDice, total: defTotal, attribute: defenseAttribute },
      attackerWins,
      log,
    };
  }

  async rollWeaponAttack(
    characterId: string,
    weaponId: string,
    targetId?: string,
    combatId?: string,
    campaignId?: string,
  ) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { attributes: true },
    });
    if (!character || !character.attributes) {
      throw new NotFoundException('Character or attributes not found');
    }

    const weapon = await this.prisma.weapon.findUnique({
      where: { id: weaponId },
      include: { skill: true },
    });
    if (!weapon) throw new NotFoundException('Weapon not found');
    if (weapon.characterId !== characterId) {
      throw new BadRequestException('Weapon does not belong to this character');
    }

    // Determine attack attribute from associated skill, default FOR
    const attackAttr = weapon.skill?.atributoBase ?? Atributo.FOR;
    const attrVal = this.getAttrValue(character.attributes, attackAttr);

    const naturalRoll = this.roll1d20();
    const attackTotal = naturalRoll + attrVal + character.maestriaBonus;

    // Check critical threshold (natural roll, not total)
    const isCritical = naturalRoll >= weapon.threatRange;

    // Roll damage
    const baseDamage = this.rollDice(weapon.damageDice);
    const finalDamage = isCritical
      ? this.applyCritical(baseDamage, weapon.criticalMultiplier)
      : baseDamage;

    // Calculate target defense
    let targetInfo: any = null;
    let attackerWins: boolean | null = null;

    if (targetId) {
      const targetChar = await this.prisma.character.findUnique({
        where: { id: targetId },
        include: { attributes: true },
      });
      if (targetChar && targetChar.attributes) {
        const defDice = this.roll1d20();
        // Default defense attribute: AGI
        const defAttrVal = this.getAttrValue(targetChar.attributes, Atributo.AGI);
        const defTotal = defDice + defAttrVal + targetChar.maestriaBonus;
        attackerWins = attackTotal > defTotal;
        targetInfo = {
          id: targetId,
          nome: targetChar.nome,
          defDice,
          defTotal,
          defAttribute: 'AGI',
        };
      } else {
        const targetNpc = await this.prisma.npc.findUnique({
          where: { id: targetId },
          include: { attributes: true },
        });
        if (targetNpc) {
          if (targetNpc.isSimplified) {
            attackerWins = attackTotal >= targetNpc.defesa;
            targetInfo = { id: targetId, nome: targetNpc.nome, defTotal: targetNpc.defesa };
          } else if (targetNpc.attributes) {
            const defDice = this.roll1d20();
            const defAttrVal = targetNpc.attributes.AGI;
            const defTotal = defDice + defAttrVal + targetNpc.maestriaBonus;
            attackerWins = attackTotal > defTotal;
            targetInfo = { id: targetId, nome: targetNpc.nome, defDice, defTotal };
          }
        }
      }
    }

    let wasOutOfTurn = false;
    const resolvedCampaignId = campaignId ?? character.campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);

    if (combatId) {
      const combat = await this.prisma.combat.findUnique({
        where: { id: combatId },
        include: { participants: { orderBy: { ordem: 'asc' } } },
      });
      if (combat && (combat.state === 'ROUND_ACTIVE' || combat.state === 'ROUND_FINISHED')) {
        const currentParticipant = combat.participants[combat.currentTurnIndex];
        wasOutOfTurn = currentParticipant?.characterId !== characterId;
      }
    }

    let log: any = null;
    if (combatId || resolvedCampaignId) {
      // Log attack action
      log = await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: resolvedCampaignId,
          actor: character.nome,
          actionType: 'ATAQUE',
          diceResult: naturalRoll,
          total: attackTotal,
          target: targetInfo?.nome,
          wasOutOfTurn,
          details: {
            weaponId,
            weaponNome: weapon.nome,
            attackAttribute: attackAttr,
            attrVal,
            maestria: character.maestriaBonus,
            isCritical,
            threatRange: weapon.threatRange,
            criticalMultiplier: weapon.criticalMultiplier,
            baseDamage,
            finalDamage,
            damageType: weapon.damageType,
            attackerWins,
            target: targetInfo,
          },
        },
      });
    }

    return {
      characterId,
      weaponId,
      weaponNome: weapon.nome,
      attackAttribute: attackAttr,
      naturalRoll,
      attackTotal,
      isCritical,
      threatRange: weapon.threatRange,
      criticalMultiplier: weapon.criticalMultiplier,
      baseDamage,
      finalDamage,
      damageType: weapon.damageType,
      target: targetInfo,
      attackerWins,
      wasOutOfTurn,
      log,
    };
  }
}
