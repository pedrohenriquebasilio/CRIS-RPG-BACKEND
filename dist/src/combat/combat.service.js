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
exports.CombatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const roll_service_1 = require("../roll/roll.service");
const game_gateway_1 = require("../gateway/game.gateway");
const client_1 = require("@prisma/client");
let CombatService = class CombatService {
    prisma;
    rollService;
    gateway;
    constructor(prisma, rollService, gateway) {
        this.prisma = prisma;
        this.rollService = rollService;
        this.gateway = gateway;
    }
    async createCombat(campaignId, masterId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        if (campaign.masterId !== masterId)
            throw new common_1.ForbiddenException('Only master can create combat');
        const existing = await this.prisma.combat.findFirst({
            where: {
                campaignId,
                state: { notIn: ['IDLE', 'COMBAT_FINISHED'] },
            },
        });
        if (existing)
            throw new common_1.BadRequestException('There is already an active combat');
        const combat = await this.prisma.combat.create({
            data: {
                campaignId,
                state: client_1.CombatState.COMBAT_CREATED,
            },
        });
        await this.prisma.campaign.update({
            where: { id: campaignId },
            data: { isActiveCombat: true },
        });
        this.gateway.emitToCampaign(campaignId, 'combatCreated', combat);
        return combat;
    }
    async addParticipant(combatId, data, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        if (combat.state !== client_1.CombatState.COMBAT_CREATED) {
            throw new common_1.BadRequestException('Cannot add participants after initiative has been rolled');
        }
        if (!data.characterId && !data.npcId) {
            throw new common_1.BadRequestException('Must provide either characterId or npcId');
        }
        let hpAtual = 0;
        let energiaAtual = 0;
        if (data.characterId) {
            const character = await this.prisma.character.findUnique({
                where: { id: data.characterId },
            });
            if (!character)
                throw new common_1.NotFoundException('Character not found');
            hpAtual = character.hpAtual;
            energiaAtual = character.energiaAtual;
        }
        else if (data.npcId) {
            const npc = await this.prisma.npc.findUnique({ where: { id: data.npcId } });
            if (!npc)
                throw new common_1.NotFoundException('NPC not found');
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
    async rollInitiative(combatId, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        const results = await this.rollService.rollInitiative(combatId);
        const state = await this.getCombatState(combatId);
        this.gateway.emitCombatUpdate(combat.campaignId, state);
        return { results, message: 'Initiative rolled successfully' };
    }
    async startRound(combatId, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        if (combat.state === client_1.CombatState.INITIATIVE_ROLLED) {
            await this.prisma.combat.update({
                where: { id: combatId },
                data: { state: client_1.CombatState.ROUND_ACTIVE, currentTurnIndex: 0 },
            });
        }
        else if (combat.state === client_1.CombatState.ROUND_FINISHED) {
            await this.prisma.combat.update({
                where: { id: combatId },
                data: {
                    state: client_1.CombatState.ROUND_ACTIVE,
                    roundNumber: { increment: 1 },
                    currentTurnIndex: 0,
                },
            });
            await this.decrementConditions(combatId);
        }
        else {
            throw new common_1.BadRequestException('Cannot start round in current combat state');
        }
        return this.getCombatState(combatId);
    }
    async nextTurn(combatId, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        if (combat.state !== client_1.CombatState.ROUND_ACTIVE) {
            throw new common_1.BadRequestException('No active round');
        }
        const participants = await this.prisma.combatParticipant.findMany({
            where: { combatId, isDefeated: false },
            orderBy: { ordem: 'asc' },
        });
        const nextIndex = combat.currentTurnIndex + 1;
        if (nextIndex >= participants.length) {
            await this.prisma.combat.update({
                where: { id: combatId },
                data: { state: client_1.CombatState.ROUND_FINISHED },
            });
        }
        else {
            await this.prisma.combat.update({
                where: { id: combatId },
                data: { currentTurnIndex: nextIndex },
            });
        }
        return this.getCombatState(combatId);
    }
    async skipTurn(combatId, masterId) {
        return this.nextTurn(combatId, masterId);
    }
    async reorderParticipant(combatId, participantId, newOrder, masterId) {
        await this.getCombatForMaster(combatId, masterId);
        return this.prisma.combatParticipant.update({
            where: { id: participantId },
            data: { ordem: newOrder },
        });
    }
    async applyDamage(combatId, participantId, damage, tipoDano, masterId, source) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        const participant = await this.prisma.combatParticipant.findUnique({
            where: { id: participantId },
            include: {
                character: true,
                npc: true,
            },
        });
        if (!participant)
            throw new common_1.NotFoundException('Participant not found');
        const newHp = Math.max(0, participant.hpAtual - damage);
        const targetName = participant.character?.nome || participant.npc?.nome || 'Unknown';
        await this.prisma.combatParticipant.update({
            where: { id: participantId },
            data: {
                hpAtual: newHp,
                isDefeated: newHp === 0,
            },
        });
        await this.prisma.combatLog.create({
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
        const result = { participantId, damage, hpRestante: newHp, isDefeated: newHp === 0 };
        const combatState = await this.getCombatState(combatId);
        this.gateway.emitCombatUpdate(combatState.campaign?.id || combatId, combatState);
        return result;
    }
    async applyCondition(combatId, participantId, conditionId, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        const condition = await this.prisma.condition.findUnique({ where: { id: conditionId } });
        if (!condition)
            throw new common_1.NotFoundException('Condition not found');
        const participant = await this.prisma.combatParticipant.findUnique({
            where: { id: participantId },
            include: { character: true, npc: true },
        });
        if (!participant)
            throw new common_1.NotFoundException('Participant not found');
        const result = await this.prisma.participantCondition.create({
            data: {
                participantId,
                conditionId,
                rodadasRestantes: condition.duracaoRodadas,
            },
            include: { condition: true },
        });
        const targetName = participant.character?.nome || participant.npc?.nome || 'Unknown';
        await this.prisma.combatLog.create({
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
        return result;
    }
    async forceTest(combatId, characterId, skillId, masterId) {
        await this.getCombatForMaster(combatId, masterId);
        const rollService = this.rollService;
        return rollService.rollSkill(skillId, characterId, combatId);
    }
    async finishCombat(combatId, masterId) {
        const combat = await this.getCombatForMaster(combatId, masterId);
        await this.prisma.combat.update({
            where: { id: combatId },
            data: {
                state: client_1.CombatState.COMBAT_FINISHED,
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
    async getCombatState(combatId) {
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
    async getCombatLogs(combatId) {
        return this.prisma.combatLog.findMany({
            where: { combatId },
            orderBy: { timestamp: 'asc' },
        });
    }
    async getCombatForMaster(combatId, masterId) {
        const combat = await this.prisma.combat.findUnique({
            where: { id: combatId },
            include: { campaign: true },
        });
        if (!combat)
            throw new common_1.NotFoundException('Combat not found');
        if (combat.campaign.masterId !== masterId) {
            throw new common_1.ForbiddenException('Only master can perform this action');
        }
        return combat;
    }
    async decrementConditions(combatId) {
        const participants = await this.prisma.combatParticipant.findMany({
            where: { combatId },
            include: { conditions: true },
        });
        for (const p of participants) {
            for (const pc of p.conditions) {
                if (pc.rodadasRestantes <= 1) {
                    await this.prisma.participantCondition.delete({ where: { id: pc.id } });
                }
                else {
                    await this.prisma.participantCondition.update({
                        where: { id: pc.id },
                        data: { rodadasRestantes: { decrement: 1 } },
                    });
                }
            }
        }
    }
};
exports.CombatService = CombatService;
exports.CombatService = CombatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        roll_service_1.RollService,
        game_gateway_1.GameGateway])
], CombatService);
//# sourceMappingURL=combat.service.js.map