import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, masterId: string) {
    return this.prisma.campaign.create({
      data: { name, masterId },
      include: { master: { select: { id: true, email: true, role: true } } },
    });
  }

  async findAll(userId?: string, userRole?: string) {
    const mobFilter: Record<string, unknown> = { isActive: true, isMob: true };
    if (userRole !== 'MASTER' && userId) {
      mobFilter.userId = userId;
    }

    return this.prisma.campaign.findMany({
      include: {
        master: { select: { id: true, email: true } },
        _count: { select: { characters: { where: { isActive: true } } } },
        characters: {
          where: mobFilter,
          include: {
            specialization: { select: { nome: true } },
            attributes: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        master: { select: { id: true, email: true } },
        characters: {
          where: { isActive: true },
          include: {
            user: { select: { id: true, email: true } },
            specialization: true,
            origemRelacao: true,
            attributes: true,
          },
        },
        npcs: true,
        combats: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async getInviteInfo(inviteCode: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { inviteCode },
      include: {
        master: { select: { id: true, email: true } },
        _count: { select: { characters: { where: { isActive: true } } } },
      },
    });
    if (!campaign) throw new NotFoundException('Invalid invite code');
    return {
      id: campaign.id,
      name: campaign.name,
      master: campaign.master,
      playerCount: campaign._count.characters,
      inviteCode: campaign.inviteCode,
    };
  }

  async joinByInviteCode(inviteCode: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { inviteCode },
      include: { master: { select: { id: true, email: true } } },
    });
    if (!campaign) throw new NotFoundException('Invalid invite code');
    return campaign;
  }

  async getActiveCombat(campaignId: string) {
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

  async approveCharacter(campaignId: string, characterId: string, masterId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.masterId !== masterId) throw new ForbiddenException('Only master can approve');

    return this.prisma.character.update({
      where: { id: characterId },
      data: { isApproved: true },
    });
  }

  // Master Shield: returns all logs for a campaign (combat + out-of-combat), sorted by timestamp
  async getCampaignLogs(campaignId: string, masterId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.masterId !== masterId) throw new ForbiddenException('Only master can view campaign logs');

    return this.prisma.combatLog.findMany({
      where: { campaignId },
      orderBy: { timestamp: 'desc' },
      take: 500,
      include: {
        combat: { select: { id: true, state: true, roundNumber: true } },
      },
    });
  }

  // Returns logs for a specific combat
  async getCombatLogs(campaignId: string, combatId: string) {
    return this.prisma.combatLog.findMany({
      where: { campaignId, combatId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
