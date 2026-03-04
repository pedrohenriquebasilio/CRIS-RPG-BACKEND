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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CampaignService = class CampaignService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(name, masterId) {
        return this.prisma.campaign.create({
            data: { name, masterId },
            include: { master: { select: { id: true, email: true, role: true } } },
        });
    }
    async findAll() {
        return this.prisma.campaign.findMany({
            include: {
                master: { select: { id: true, email: true } },
                _count: { select: { characters: { where: { isActive: true } } } },
            },
        });
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                master: { select: { id: true, email: true } },
                characters: {
                    where: { isActive: true },
                    include: {
                        user: { select: { id: true, email: true } },
                        specialization: true,
                    },
                },
                npcs: true,
                combats: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        return campaign;
    }
    async getInviteInfo(inviteCode) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { inviteCode },
            include: {
                master: { select: { id: true, email: true } },
                _count: { select: { characters: { where: { isActive: true } } } },
            },
        });
        if (!campaign)
            throw new common_1.NotFoundException('Invalid invite code');
        return {
            id: campaign.id,
            name: campaign.name,
            master: campaign.master,
            playerCount: campaign._count.characters,
            inviteCode: campaign.inviteCode,
        };
    }
    async joinByInviteCode(inviteCode, userId) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { inviteCode },
            include: { master: { select: { id: true, email: true } } },
        });
        if (!campaign)
            throw new common_1.NotFoundException('Invalid invite code');
        return campaign;
    }
    async getActiveCombat(campaignId) {
        return this.prisma.combat.findFirst({
            where: {
                campaignId,
                state: { notIn: ['IDLE', 'COMBAT_FINISHED'] },
            },
            include: {
                participants: {
                    include: {
                        character: { include: { attributes: true } },
                        npc: { include: { attributes: true } },
                        conditions: { include: { condition: true } },
                    },
                    orderBy: { ordem: 'asc' },
                },
                logs: { orderBy: { timestamp: 'desc' }, take: 50 },
            },
        });
    }
    async approveCharacter(campaignId, characterId, masterId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        if (campaign.masterId !== masterId)
            throw new common_1.ForbiddenException('Only master can approve');
        return this.prisma.character.update({
            where: { id: characterId },
            data: { isApproved: true },
        });
    }
    async getCampaignLogs(campaignId, masterId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        if (campaign.masterId !== masterId)
            throw new common_1.ForbiddenException('Only master can view campaign logs');
        return this.prisma.combatLog.findMany({
            where: { campaignId },
            orderBy: { timestamp: 'desc' },
            take: 500,
            include: {
                combat: { select: { id: true, state: true, roundNumber: true } },
            },
        });
    }
    async getCombatLogs(campaignId, combatId) {
        return this.prisma.combatLog.findMany({
            where: { campaignId, combatId },
            orderBy: { timestamp: 'asc' },
        });
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map