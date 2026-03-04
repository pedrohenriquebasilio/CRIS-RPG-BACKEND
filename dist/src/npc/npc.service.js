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
exports.NpcService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NpcService = class NpcService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSimplified(campaignId, data, masterId) {
        await this.verifyCampaignMaster(campaignId, masterId);
        return this.prisma.npc.create({
            data: {
                campaignId,
                nome: data.nome,
                isSimplified: true,
                hpAtual: data.hp,
                hpMax: data.hp,
                energiaAtual: data.energia,
                energiaMax: data.energia,
                bonusAtaque: data.bonusAtaque,
                defesa: data.defesa,
                danoFixo: data.danoFixo,
                tipoDano: data.tipoDano,
            },
        });
    }
    async createFull(campaignId, data, masterId) {
        await this.verifyCampaignMaster(campaignId, masterId);
        return this.prisma.npc.create({
            data: {
                campaignId,
                nome: data.nome,
                isSimplified: false,
                hpAtual: data.hp,
                hpMax: data.hp,
                energiaAtual: data.energia,
                energiaMax: data.energia,
                nivel: data.nivel,
                maestriaBonus: data.maestriaBonus,
                attributes: {
                    create: data.attributes,
                },
            },
            include: { attributes: true },
        });
    }
    async findByCampaign(campaignId) {
        return this.prisma.npc.findMany({
            where: { campaignId },
            include: { attributes: true },
        });
    }
    async findOne(id) {
        const npc = await this.prisma.npc.findUnique({
            where: { id },
            include: { attributes: true },
        });
        if (!npc)
            throw new common_1.NotFoundException('NPC not found');
        return npc;
    }
    async update(id, data, masterId) {
        const npc = await this.prisma.npc.findUnique({
            where: { id },
            include: { campaign: true },
        });
        if (!npc)
            throw new common_1.NotFoundException('NPC not found');
        if (npc.campaign.masterId !== masterId) {
            throw new common_1.ForbiddenException('Only master can update NPCs');
        }
        return this.prisma.npc.update({
            where: { id },
            data,
            include: { attributes: true },
        });
    }
    async delete(id, masterId) {
        const npc = await this.prisma.npc.findUnique({
            where: { id },
            include: { campaign: true },
        });
        if (!npc)
            throw new common_1.NotFoundException('NPC not found');
        if (npc.campaign.masterId !== masterId) {
            throw new common_1.ForbiddenException('Only master can delete NPCs');
        }
        return this.prisma.npc.delete({ where: { id } });
    }
    async verifyCampaignMaster(campaignId, masterId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        if (campaign.masterId !== masterId) {
            throw new common_1.ForbiddenException('Only master can manage NPCs');
        }
        return campaign;
    }
};
exports.NpcService = NpcService;
exports.NpcService = NpcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NpcService);
//# sourceMappingURL=npc.service.js.map