import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameGateway } from '../gateway/game.gateway';
import { Atributo, Role, TipoDano } from '@prisma/client';

@Injectable()
export class CharacterService {
  constructor(
    private prisma: PrismaService,
    private gateway: GameGateway,
  ) {}

  async create(data: {
    campaignId: string;
    userId: string;
    nome: string;
    specializationId?: string;
    attributes?: Record<string, number>;
    isMob?: boolean;
    requestingUserRole?: Role;
  }) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: data.campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const isMob = data.isMob ?? false;

    // Only master can create mob sheets
    if (isMob && data.requestingUserRole !== Role.MASTER) {
      throw new ForbiddenException('Only master can create mob characters');
    }

    // Enforce 1 character per player per campaign (non-mob only)
    if (!isMob) {
      const existing = await this.prisma.character.findFirst({
        where: {
          campaignId: data.campaignId,
          userId: data.userId,
          isMob: false,
          isActive: true,
        },
      });
      if (existing) {
        throw new ConflictException('Player already has a character in this campaign');
      }
    }

    let hpMax = 6;
    let energiaMax = 3;

    if (data.specializationId) {
      const specialization = await this.prisma.specialization.findUnique({
        where: { id: data.specializationId },
      });
      if (!specialization) throw new NotFoundException('Specialization not found');
      hpMax = specialization.hpBase > 0 ? specialization.hpBase : specialization.hpPorNivel;
      energiaMax = specialization.energiaPorNivel;
    }

    const attrs = data.attributes ?? {};
    const character = await this.prisma.character.create({
      data: {
        campaignId: data.campaignId,
        userId: data.userId,
        nome: data.nome,
        specializationId: data.specializationId ?? null,
        isMob,
        hpMax,
        hpAtual: hpMax,
        energiaMax,
        energiaAtual: energiaMax,
        // Mob sheets auto-approved
        isApproved: isMob,
        attributes: {
          create: {
            FOR: attrs.FOR ?? 0,
            AGI: attrs.AGI ?? 0,
            VIG: attrs.VIG ?? 0,
            INT: attrs.INT ?? 0,
            PRE: attrs.PRE ?? 0,
          },
        },
      },
      include: {
        attributes: true,
        specialization: true,
        skills: { include: { skill: true } },
        aptitudes: { include: { aptitude: true } },
        techniques: true,
        weapons: { include: { skill: true } },
      },
    });

    return character;
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.character.findMany({
      where: { campaignId, isActive: true },
      include: {
        user: { select: { id: true, email: true } },
        specialization: true,
        origemRelacao: true,
        attributes: true,
        skills: { include: { skill: true } },
        aptitudes: { include: { aptitude: true } },
        techniques: true,
        weapons: { include: { skill: true } },
      },
    });
  }

  async findOne(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id, isActive: true },
      include: {
        user: { select: { id: true, email: true } },
        specialization: {
          include: { abilities: true },
        },
        origemRelacao: true,
        attributes: true,
        skills: { include: { skill: true } },
        aptitudes: { include: { aptitude: true } },
        techniques: true,
        weapons: { include: { skill: true } },
        abilities: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!character) throw new NotFoundException('Character not found');
    return character;
  }

  async addSkill(characterId: string, skillId: string, userId: string) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    return this.prisma.characterSkill.upsert({
      where: { characterId_skillId: { characterId, skillId } },
      update: {},
      create: { characterId, skillId },
      include: { skill: true },
    });
  }

  async trainSkill(characterId: string, skillId: string, userId: string) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    const cs = await this.prisma.characterSkill.findUnique({
      where: { characterId_skillId: { characterId, skillId } },
    });
    if (!cs) throw new NotFoundException('Skill not added to character');

    return this.prisma.characterSkill.update({
      where: { characterId_skillId: { characterId, skillId } },
      data: { treinada: true },
      include: { skill: true },
    });
  }

  async addAptitude(characterId: string, aptitudeId: string, userId: string) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    if (character.pendingAptidaoSlots <= 0) {
      throw new BadRequestException('No available aptitude slots');
    }

    const existing = await this.prisma.characterAptitude.findUnique({
      where: { characterId_aptitudeId: { characterId, aptitudeId } },
    });
    if (existing) throw new ConflictException('Aptitude already acquired');

    const aptitude = await this.prisma.aptitude.findUnique({ where: { id: aptitudeId } });
    if (!aptitude) throw new NotFoundException('Aptitude not found');

    // Check level requirement
    if (character.nivel < aptitude.prerequisitoNivel) {
      throw new BadRequestException(`Character level must be at least ${aptitude.prerequisitoNivel}`);
    }

    // Check previous aptitude requirement
    if (aptitude.prerequisitoAptidaoId) {
      const hasPrereq = await this.prisma.characterAptitude.findUnique({
        where: { characterId_aptitudeId: { characterId, aptitudeId: aptitude.prerequisitoAptidaoId } },
      });
      if (!hasPrereq) {
        throw new BadRequestException('Missing required previous aptitude');
      }
    }

    const [result] = await this.prisma.$transaction([
      this.prisma.characterAptitude.create({
        data: { characterId, aptitudeId, adquiridaNoNivel: character.nivel },
        include: { aptitude: true },
      }),
      this.prisma.character.update({
        where: { id: characterId },
        data: { pendingAptidaoSlots: { decrement: 1 } },
      }),
    ]);

    return result;
  }

  async createAptitude(
    characterId: string,
    data: { nome: string; descricao: string; prerequisitoNivel: number; tipo: string; cooldown: number },
    userId: string,
  ) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    if (character.nivel < data.prerequisitoNivel) {
      throw new BadRequestException(`Character level must be at least ${data.prerequisitoNivel}`);
    }

    // Create global aptitude
    const aptitude = await this.prisma.aptitude.create({
      data: {
        nome: data.nome.trim(),
        descricao: data.descricao.trim(),
        prerequisitoNivel: data.prerequisitoNivel,
        tipo: data.tipo,
        cooldown: data.cooldown,
        criadoPorUserId: userId,
      },
    });

    // Automatically add it to the creating character
    const charAptitude = await this.prisma.characterAptitude.create({
      data: {
        characterId,
        aptitudeId: aptitude.id,
        adquiridaNoNivel: character.nivel,
        ativo: false,
      },
      include: { aptitude: true },
    });

    return charAptitude;
  }

  async toggleAptitude(characterId: string, aptitudeId: string, ativo: boolean, userId: string) {
    const character = await this.checkOwnership(characterId, userId);
    
    const charAptitude = await this.prisma.characterAptitude.findFirst({
      where: { characterId, aptitudeId },
    });
    if (!charAptitude) throw new NotFoundException('Aptitude not found');

    const updated = await this.prisma.characterAptitude.update({
      where: { id: charAptitude.id },
      data: { ativo },
      include: { aptitude: true },
    });

    return updated;
  }

  async deleteAptitude(characterId: string, aptitudeId: string, userId: string) {
    const character = await this.checkOwnership(characterId, userId);
    
    const charAptitude = await this.prisma.characterAptitude.findFirst({
      where: { characterId, aptitudeId },
    });
    if (!charAptitude) throw new NotFoundException('Aptitude not found');

    await this.prisma.characterAptitude.delete({ where: { id: charAptitude.id } });
    return { success: true };
  }

  async addTechnique(
    characterId: string,
    techniqueData: {
      nome: string;
      nivel: number;
      custoEnergia: number;
      atributoBase: Atributo;
      descricaoLivre: string;
      tipoDano?: string;
    },
    userId: string,
  ) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    if (techniqueData.nivel > character.nivel) {
      throw new BadRequestException('Technique level cannot exceed character level');
    }

    return this.prisma.technique.create({
      data: {
        characterId,
        nome: techniqueData.nome,
        nivel: techniqueData.nivel,
        custoEnergia: techniqueData.custoEnergia,
        atributoBase: techniqueData.atributoBase,
        descricaoLivre: techniqueData.descricaoLivre,
        tipoDano: techniqueData.tipoDano as any,
      },
    });
  }

  async updateTechnique(
    characterId: string,
    techniqueId: string,
    data: Partial<{
      nome: string;
      nivel: number;
      custoEnergia: number;
      descricaoLivre: string;
    }>,
    userId: string,
  ) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    return this.prisma.technique.update({
      where: { id: techniqueId },
      data,
    });
  }

  async addWeapon(
    characterId: string,
    weaponData: {
      nome: string;
      skillId?: string;
      damageDice: string;
      damageType: TipoDano;
      threatRange?: number;
      criticalMultiplier?: number;
      descricao?: string;
    },
    userId: string,
  ) {
    const character = await this.checkOwnership(characterId, userId);
    await this.checkNotInActiveCombat(character.campaignId, userId);

    return this.prisma.weapon.create({
      data: {
        characterId,
        nome: weaponData.nome,
        skillId: weaponData.skillId,
        damageDice: weaponData.damageDice,
        damageType: weaponData.damageType,
        threatRange: weaponData.threatRange ?? 20,
        criticalMultiplier: weaponData.criticalMultiplier ?? 2,
        descricao: weaponData.descricao ?? "",
      },
      include: { skill: true },
    });
  }

  async updateWeapon(
    characterId: string,
    weaponId: string,
    data: Partial<{
      nome: string;
      skillId: string;
      damageDice: string;
      damageType: TipoDano;
      threatRange: number;
      criticalMultiplier: number;
    }>,
    userId: string,
  ) {
    await this.checkOwnership(characterId, userId);

    return this.prisma.weapon.update({
      where: { id: weaponId },
      data,
      include: { skill: true },
    });
  }

  async deleteWeapon(characterId: string, weaponId: string, userId: string) {
    await this.checkOwnership(characterId, userId);

    return this.prisma.weapon.delete({ where: { id: weaponId } });
  }

  async distributeAttribute(
    characterId: string,
    attribute: Atributo,
    userId: string,
  ) {
    const character = await this.checkOwnership(characterId, userId);
    if (character.pendingAtributoPoints <= 0) {
      throw new BadRequestException('No available attribute points');
    }

    const attrs = await this.prisma.characterAttribute.findUnique({
      where: { characterId },
    });

    const currentVal = attrs![attribute as keyof typeof attrs] as number;
    const maxVal = 5 + Math.floor(character.nivel / 2);
    if (currentVal >= maxVal) {
      throw new BadRequestException(`Attribute ${attribute} is at maximum for current level`);
    }

    const [attrs2] = await this.prisma.$transaction([
      this.prisma.characterAttribute.update({
        where: { characterId },
        data: { [attribute]: { increment: 1 } },
      }),
      this.prisma.character.update({
        where: { id: characterId },
        data: { pendingAtributoPoints: { decrement: 1 } },
      }),
    ]);

    return attrs2;
  }

  async grantXp(characterId: string, amount: number, masterId: string, combatId?: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { campaign: true },
    });
    if (!character) throw new NotFoundException('Character not found');
    if (character.campaign.masterId !== masterId) {
      throw new ForbiddenException('Only master can grant XP');
    }

    const updated = await this.prisma.character.update({
      where: { id: characterId },
      data: { xpAtual: { increment: amount } },
    });

    if (combatId) {
      await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: character.campaignId,
          actor: 'Mestre',
          actionType: 'XP',
          target: character.nome,
          details: { xpAmount: amount, newTotal: updated.xpAtual },
        },
      });
    }

    return this.checkLevelUp(characterId, masterId, combatId);
  }

  async checkLevelUp(characterId: string, masterId?: string, combatId?: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { specialization: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    const nextLevel = character.nivel + 1;
    const nextProg = await this.prisma.levelProgression.findUnique({
      where: { level: nextLevel },
    });

    if (!nextProg || character.xpAtual < nextProg.xpRequired) {
      return character;
    }

    const spec = character.specialization;
    const updates: any = {
      nivel: nextLevel,
      hpMax: { increment: spec ? spec.hpPorNivel : 0 },
      hpAtual: { increment: spec ? spec.hpPorNivel : 0 },
      energiaMax: { increment: spec ? spec.energiaPorNivel : 0 },
      energiaAtual: { increment: spec ? spec.energiaPorNivel : 0 },
      pendingAptidaoSlots: { increment: 1 },
    };

    if (nextProg.ganhoAtributo) {
      updates.pendingAtributoPoints = { increment: 1 };
    }
    if (nextProg.ganhoMaestria) {
      updates.maestriaBonus = { increment: 1 };
    }

    await this.prisma.character.update({
      where: { id: characterId },
      data: updates,
    });

    if (combatId) {
      await this.prisma.combatLog.create({
        data: {
          combatId,
          campaignId: character.campaignId,
          actor: character.nome,
          actionType: 'LEVELUP',
          details: { nivelAnterior: character.nivel, novoNivel: nextLevel },
        },
      });
    }

    return this.checkLevelUp(characterId, masterId, combatId);
  }

  async deactivate(characterId: string, requestingUserId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId, isActive: true },
      include: { campaign: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    const user = await this.prisma.user.findUnique({ where: { id: requestingUserId } });
    if (!user) throw new NotFoundException('User not found');

    const isMaster = user.role === Role.MASTER && character.campaign.masterId === requestingUserId;
    const isOwner = character.userId === requestingUserId;

    if (!isMaster && !isOwner) {
      throw new ForbiddenException('Not authorized to delete this character');
    }

    return this.prisma.character.update({
      where: { id: characterId },
      data: { isActive: false },
      select: { id: true, nome: true, isActive: true },
    });
  }

  // ── Player self-service updates ──────────────────────────────────────────

  async updateNome(characterId: string, userId: string, nome: string) {
    const character = await this.checkOwnership(characterId, userId);
    const updated = await this.prisma.character.update({
      where: { id: characterId },
      data: { nome: nome.trim() },
      select: { id: true, nome: true },
    });
    this.gateway.emitCharacterUpdate(character.campaignId, { id: characterId, nome: updated.nome });
    return updated;
  }

  async updateStats(
    characterId: string,
    userId: string,
    data: { hpAtual?: number; hpMax?: number; energiaAtual?: number; energiaMax?: number; maestriaBonus?: number },
  ) {
    const character = await this.checkOwnership(characterId, userId);

    const update: Record<string, number> = {};
    if (data.hpAtual !== undefined) update.hpAtual = data.hpAtual;
    if (data.hpMax !== undefined) update.hpMax = data.hpMax;
    if (data.energiaAtual !== undefined) update.energiaAtual = data.energiaAtual;
    if (data.energiaMax !== undefined) update.energiaMax = data.energiaMax;
    if (data.maestriaBonus !== undefined) update.maestriaBonus = data.maestriaBonus;

    const updated = await this.prisma.character.update({
      where: { id: characterId },
      data: update,
      select: { id: true, hpAtual: true, hpMax: true, energiaAtual: true, energiaMax: true, maestriaBonus: true },
    });
    this.gateway.emitCharacterUpdate(character.campaignId, updated);
    return updated;
  }

  async updateAttributes(
    characterId: string,
    userId: string,
    attrs: { FOR?: number; AGI?: number; VIG?: number; INT?: number; PRE?: number },
  ) {
    const character = await this.checkOwnership(characterId, userId);

    const data: Record<string, number> = {};
    if (attrs.FOR !== undefined) data.FOR = attrs.FOR;
    if (attrs.AGI !== undefined) data.AGI = attrs.AGI;
    if (attrs.VIG !== undefined) data.VIG = attrs.VIG;
    if (attrs.INT !== undefined) data.INT = attrs.INT;
    if (attrs.PRE !== undefined) data.PRE = attrs.PRE;

    const updated = await this.prisma.characterAttribute.update({
      where: { characterId },
      data,
    });
    this.gateway.emitCharacterUpdate(character.campaignId, { id: characterId, attributes: updated });
    return updated;
  }

  async updateSkillByName(
    characterId: string,
    skillName: string,
    userId: string,
    data: { treinada?: boolean; pontosInvestidos?: number },
  ) {
    await this.checkOwnership(characterId, userId);

    const skill = await this.prisma.skill.findFirst({ where: { nome: skillName } });
    if (!skill) throw new NotFoundException(`Skill not found: ${skillName}`);

    const pontos = data.pontosInvestidos ?? 0;
    const treinada = data.treinada !== undefined ? data.treinada : pontos > 0;

    return this.prisma.characterSkill.upsert({
      where: { characterId_skillId: { characterId, skillId: skill.id } },
      update: { treinada, pontosInvestidos: pontos },
      create: { characterId, skillId: skill.id, treinada, pontosInvestidos: pontos },
      include: { skill: true },
    });
  }

  async updateClassOrigin(
    characterId: string,
    userId: string,
    data: { specializationId?: string; origemId?: string },
  ) {
    await this.checkOwnership(characterId, userId);

    // Compute additive attribute bonuses from spec + origin
    const attrBonuses = { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 };

    const specId = data.specializationId;
    const origId = data.origemId;

    if (specId) {
      const spec = await this.prisma.specialization.findUnique({ where: { id: specId } });
      if (!spec) throw new NotFoundException('Specialization not found');
      const bonus = spec.bonusAtributos as Record<string, number>;
      for (const key of Object.keys(attrBonuses)) {
        attrBonuses[key as keyof typeof attrBonuses] += bonus[key] ?? 0;
      }
    } else {
      // Keep existing specialization bonuses if not changing
      const char = await this.prisma.character.findUnique({
        where: { id: characterId },
        include: { specialization: true },
      });
      if (char?.specialization) {
        const bonus = char.specialization.bonusAtributos as Record<string, number>;
        for (const key of Object.keys(attrBonuses)) {
          attrBonuses[key as keyof typeof attrBonuses] += bonus[key] ?? 0;
        }
      }
    }

    if (origId) {
      const origem = await this.prisma.origem.findUnique({ where: { id: origId } });
      if (!origem) throw new NotFoundException('Origem not found');
      const bonus = origem.bonusAtributos as Record<string, number>;
      for (const key of Object.keys(attrBonuses)) {
        attrBonuses[key as keyof typeof attrBonuses] += bonus[key] ?? 0;
      }
    } else {
      // Keep existing origem bonuses if not changing
      const char = await this.prisma.character.findUnique({
        where: { id: characterId },
        include: { origemRelacao: true },
      });
      if (char?.origemRelacao) {
        const bonus = char.origemRelacao.bonusAtributos as Record<string, number>;
        for (const key of Object.keys(attrBonuses)) {
          attrBonuses[key as keyof typeof attrBonuses] += bonus[key] ?? 0;
        }
      }
    }

    const updateData: Record<string, any> = {};
    if (specId) updateData.specializationId = specId;
    if (origId) updateData.origemId = origId;

    // Compute hpMax and energiaMax from specialization * nivel
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { specialization: true },
    });

    const resolvedSpecId = specId ?? character?.specializationId;
    if (resolvedSpecId) {
      const spec = await this.prisma.specialization.findUnique({ where: { id: resolvedSpecId } });
      if (spec && character) {
        updateData.hpMax = spec.hpBase > 0
          ? spec.hpBase + spec.hpPorNivel * (character.nivel - 1)
          : spec.hpPorNivel * character.nivel;
        updateData.energiaMax = spec.energiaPorNivel * character.nivel;
        // Clamp current values to new max
        if (character.hpAtual > updateData.hpMax) updateData.hpAtual = updateData.hpMax;
        if (character.energiaAtual > updateData.energiaMax) updateData.energiaAtual = updateData.energiaMax;
        // Apply initial maestria slots from class (only if current is lower)
        if (spec.maestriaInicial > character.maestriaBonus) {
          updateData.maestriaBonus = spec.maestriaInicial;
        }
      }
    }

    await this.prisma.character.update({
      where: { id: characterId },
      data: updateData,
    });

    // Overwrite character attributes with computed bonuses
    await this.prisma.characterAttribute.update({
      where: { characterId },
      data: attrBonuses,
    });

    // Auto-train fixed skills from the selected specialization
    if (specId) {
      const spec = await this.prisma.specialization.findUnique({ where: { id: specId } });
      if (spec && spec.habilidadesTreinadas.length > 0) {
        for (const skillNome of spec.habilidadesTreinadas) {
          const skill = await this.prisma.skill.findFirst({ where: { nome: skillNome } });
          if (!skill) continue;
          await this.prisma.characterSkill.upsert({
            where: { characterId_skillId: { characterId, skillId: skill.id } },
            create: { characterId, skillId: skill.id, treinada: true, pontosInvestidos: 5 },
            update: { treinada: true, pontosInvestidos: 5 },
          });
        }
      }
    }

    return this.findOne(characterId);
  }

  async addAbility(
    characterId: string,
    dto: { nome: string; tipo?: string; custo?: string; alcance?: string; duracao?: string; descricao?: string },
    userId: string,
  ) {
    await this.checkOwnership(characterId, userId);
    return this.prisma.characterAbility.create({
      data: {
        characterId,
        nome: dto.nome,
        tipo: dto.tipo ?? 'ativa',
        custo: dto.custo ?? 'nenhum',
        alcance: dto.alcance ?? 'pessoal',
        duracao: dto.duracao ?? 'imediato',
        descricao: dto.descricao ?? '',
      },
    });
  }

  async deleteAbility(characterId: string, abilityId: string, userId: string) {
    await this.checkOwnership(characterId, userId);
    const ability = await this.prisma.characterAbility.findFirst({
      where: { id: abilityId, characterId },
    });
    if (!ability) throw new NotFoundException('Ability not found');
    await this.prisma.characterAbility.delete({ where: { id: abilityId } });
    return { deleted: true };
  }

  private async checkOwnership(characterId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const character = await this.prisma.character.findUnique({
      where: { id: characterId, isActive: true },
      include: { campaign: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    if (user.role === Role.MASTER && character.campaign.masterId === userId) {
      return character;
    }

    if (character.userId !== userId) {
      throw new ForbiddenException('Not your character');
    }

    return character;
  }

  private async checkNotInActiveCombat(campaignId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === Role.MASTER) return;

    const activeCombat = await this.prisma.combat.findFirst({
      where: {
        campaignId,
        state: { notIn: ['IDLE', 'COMBAT_FINISHED'] },
      },
    });
    if (activeCombat) {
      throw new ForbiddenException('Cannot edit character during active combat');
    }
  }
}
