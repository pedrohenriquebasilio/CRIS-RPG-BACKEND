"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RollService = class RollService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    roll1d20() {
        return Math.floor(Math.random() * 20) + 1;
    }
    rollDice(diceString) {
        const match = diceString.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
        if (!match)
            throw new common_1.BadRequestException(`Invalid dice string: ${diceString}`);
        const count = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;
        let total = modifier;
        for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
        }
        return total;
    }
    applyCritical(damage, multiplier) {
        return damage * multiplier;
    }
    getAttrValue(attrs, atributo) {
        return attrs[atributo] ?? 1;
    }
    async getCampaignIdFromCombat(combatId) {
        const combat = await this.prisma.combat.findUnique({
            where: { id: combatId },
            select: { campaignId: true },
        });
        return combat?.campaignId ?? null;
    }
    async calculateCD(characterId, attribute) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { attributes: true },
        });
        if (!character || !character.attributes) {
            throw new common_1.NotFoundException('Character or attributes not found');
        }
        const attrVal = this.getAttrValue(character.attributes, attribute);
        return 10 + attrVal + character.maestriaBonus;
    }
    async rollAttribute(characterId, attribute, combatId, campaignId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { attributes: true },
        });
        if (!character || !character.attributes) {
            throw new common_1.NotFoundException('Character or attributes not found');
        }
        const attrVal = this.getAttrValue(character.attributes, attribute);
        const dice = this.roll1d20();
        const total = dice + attrVal;
        const resolvedCampaignId = campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);
        let wasOutOfTurn = false;
        let log = null;
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
    async rollSkill(skillId, characterId, combatId, campaignId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { attributes: true },
        });
        if (!character || !character.attributes) {
            throw new common_1.NotFoundException('Character or attributes not found');
        }
        const skill = await this.prisma.skill.findUnique({ where: { id: skillId } });
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
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
        let log = null;
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
    async rollTechnique(techniqueId, actorId, targetId, combatId, campaignId) {
        const technique = await this.prisma.technique.findUnique({
            where: { id: techniqueId },
            include: { character: { include: { attributes: true } } },
        });
        if (!technique)
            throw new common_1.NotFoundException('Technique not found');
        const character = technique.character;
        if (!character.attributes)
            throw new common_1.NotFoundException('Character attributes not found');
        let participantEnergia = character.energiaAtual;
        let participantId = null;
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
            throw new common_1.BadRequestException('Insufficient energy to use this technique');
        }
        if (participantId) {
            await this.prisma.combatParticipant.update({
                where: { id: participantId },
                data: { energiaAtual: { decrement: technique.custoEnergia } },
            });
        }
        else {
            await this.prisma.character.update({
                where: { id: character.id },
                data: { energiaAtual: { decrement: technique.custoEnergia } },
            });
        }
        const attrVal = this.getAttrValue(character.attributes, technique.atributoBase);
        const dice = this.roll1d20();
        const total = dice + attrVal + character.maestriaBonus;
        let targetCD = null;
        let targetInfo = null;
        if (targetId) {
            const targetChar = await this.prisma.character.findUnique({
                where: { id: targetId },
                include: { attributes: true },
            });
            if (targetChar && targetChar.attributes) {
                const targetAttr = this.getAttrValue(targetChar.attributes, technique.atributoBase);
                targetCD = 10 + targetAttr + targetChar.maestriaBonus;
                targetInfo = { id: targetId, nome: targetChar.nome, cd: targetCD };
            }
            else {
                const targetNpc = await this.prisma.npc.findUnique({
                    where: { id: targetId },
                    include: { attributes: true },
                });
                if (targetNpc) {
                    if (targetNpc.isSimplified) {
                        targetCD = targetNpc.defesa;
                    }
                    else if (targetNpc.attributes) {
                        const targetAttr = this.getAttrValue(targetNpc.attributes, technique.atributoBase);
                        targetCD = 10 + targetAttr + targetNpc.maestriaBonus;
                    }
                    targetInfo = { id: targetId, nome: targetNpc.nome, cd: targetCD };
                }
            }
        }
        const success = targetCD !== null ? total >= targetCD : null;
        let wasOutOfTurn = false;
        let log = null;
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
    async rollInitiative(combatId) {
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
        if (!combat)
            throw new common_1.NotFoundException('Combat not found');
        const updates = [];
        const results = [];
        for (const participant of combat.participants) {
            let agiVal = 1;
            let name = 'Unknown';
            if (participant.character) {
                agiVal = participant.character.attributes?.AGI ?? 1;
                name = participant.character.nome;
            }
            else if (participant.npc) {
                if (participant.npc.isSimplified) {
                    agiVal = participant.npc.bonusAtaque;
                }
                else {
                    agiVal = participant.npc.attributes?.AGI ?? 1;
                }
                name = participant.npc.nome;
            }
            const dice = this.roll1d20();
            const initiative = dice + agiVal;
            updates.push(this.prisma.combatParticipant.update({
                where: { id: participant.id },
                data: { initiative },
            }));
            results.push({ participantId: participant.id, name, dice, agiVal, initiative });
        }
        await this.prisma.$transaction(updates);
        results.sort((a, b) => b.initiative - a.initiative);
        const orderUpdates = results.map((r, index) => this.prisma.combatParticipant.update({
            where: { id: r.participantId },
            data: { ordem: index },
        }));
        await this.prisma.$transaction(orderUpdates);
        await this.prisma.combat.update({
            where: { id: combatId },
            data: { state: 'INITIATIVE_ROLLED', currentTurnIndex: 0 },
        });
        return results;
    }
    async rollOpposed(attackerId, defenderId, atkAttr, defAttr, combatId, campaignId) {
        const attacker = await this.prisma.character.findUnique({
            where: { id: attackerId },
            include: { attributes: true },
        });
        const defender = await this.prisma.character.findUnique({
            where: { id: defenderId },
            include: { attributes: true },
        });
        if (!attacker || !attacker.attributes)
            throw new common_1.NotFoundException('Attacker not found');
        if (!defender || !defender.attributes)
            throw new common_1.NotFoundException('Defender not found');
        const attackAttribute = atkAttr ?? client_1.Atributo.PRE;
        const defenseAttribute = defAttr ?? client_1.Atributo.PRE;
        const attAttr = this.getAttrValue(attacker.attributes, attackAttribute);
        const defAttrVal = this.getAttrValue(defender.attributes, defenseAttribute);
        const attDice = this.roll1d20();
        const defDice = this.roll1d20();
        const attTotal = attDice + attAttr + attacker.maestriaBonus;
        const defTotal = defDice + defAttrVal + defender.maestriaBonus;
        const attackerWins = attTotal > defTotal;
        const resolvedCampaignId = campaignId ?? attacker.campaignId ?? (combatId ? await this.getCampaignIdFromCombat(combatId) : null);
        let log = null;
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
    async rollWeaponAttack(characterId, weaponId, targetId, combatId, campaignId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { attributes: true },
        });
        if (!character || !character.attributes) {
            throw new common_1.NotFoundException('Character or attributes not found');
        }
        const weapon = await this.prisma.weapon.findUnique({
            where: { id: weaponId },
            include: { skill: true },
        });
        if (!weapon)
            throw new common_1.NotFoundException('Weapon not found');
        if (weapon.characterId !== characterId) {
            throw new common_1.BadRequestException('Weapon does not belong to this character');
        }
        const attackAttr = weapon.skill?.atributoBase ?? client_1.Atributo.FOR;
        const attrVal = this.getAttrValue(character.attributes, attackAttr);
        const naturalRoll = this.roll1d20();
        const attackTotal = naturalRoll + attrVal + character.maestriaBonus;
        const isCritical = naturalRoll >= weapon.threatRange;
        const baseDamage = this.rollDice(weapon.damageDice);
        const finalDamage = isCritical
            ? this.applyCritical(baseDamage, weapon.criticalMultiplier)
            : baseDamage;
        let targetInfo = null;
        let attackerWins = null;
        if (targetId) {
            const targetChar = await this.prisma.character.findUnique({
                where: { id: targetId },
                include: { attributes: true },
            });
            if (targetChar && targetChar.attributes) {
                const defDice = this.roll1d20();
                const defAttrVal = this.getAttrValue(targetChar.attributes, client_1.Atributo.AGI);
                const defTotal = defDice + defAttrVal + targetChar.maestriaBonus;
                attackerWins = attackTotal > defTotal;
                targetInfo = {
                    id: targetId,
                    nome: targetChar.nome,
                    defDice,
                    defTotal,
                    defAttribute: 'AGI',
                };
            }
            else {
                const targetNpc = await this.prisma.npc.findUnique({
                    where: { id: targetId },
                    include: { attributes: true },
                });
                if (targetNpc) {
                    if (targetNpc.isSimplified) {
                        attackerWins = attackTotal >= targetNpc.defesa;
                        targetInfo = { id: targetId, nome: targetNpc.nome, defTotal: targetNpc.defesa };
                    }
                    else if (targetNpc.attributes) {
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
        let log = null;
        if (combatId || resolvedCampaignId) {
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
};
exports.RollService = RollService;
exports.RollService = RollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RollService);
//# sourceMappingURL=roll.service.js.map