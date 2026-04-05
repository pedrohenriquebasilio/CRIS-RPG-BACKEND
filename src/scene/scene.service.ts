import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameGateway } from '../gateway/game.gateway';

@Injectable()
export class SceneService {
  constructor(
    private prisma: PrismaService,
    private gateway: GameGateway,
  ) {}

  private async assertMaster(campaignId: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    if (campaign.masterId !== userId) throw new ForbiddenException('Apenas o mestre pode gerenciar cenários');
    return campaign;
  }

  private readonly tokenInclude = {
    character: { select: { id: true, nome: true, avatarUrl: true, hpAtual: true, hpMax: true, isMob: true } },
    npc: { select: { id: true, nome: true, hpAtual: true, hpMax: true } },
  } as const;

  async getById(sceneId: string) {
    const scene = await this.prisma.scene.findUnique({
      where: { id: sceneId },
      include: { tokens: { include: this.tokenInclude } },
    });
    if (!scene) throw new NotFoundException('Cenário não encontrado');
    return scene;
  }

  async create(campaignId: string, userId: string, nome: string, filename: string) {
    await this.assertMaster(campaignId, userId);
    return this.prisma.scene.create({
      data: { campaignId, nome, imageUrl: `/uploads/${filename}` },
    });
  }

  async list(campaignId: string) {
    return this.prisma.scene.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async activate(campaignId: string, sceneId: string, userId: string) {
    await this.assertMaster(campaignId, userId);

    // Desativa todas, ativa a selecionada
    await this.prisma.scene.updateMany({
      where: { campaignId },
      data: { isActive: false },
    });
    const scene = await this.prisma.scene.update({
      where: { id: sceneId },
      data: { isActive: true },
    });

    // Notifica todos na sala da campanha
    this.gateway.emitToCampaign(campaignId, 'sceneActivated', {
      id: scene.id,
      nome: scene.nome,
      imageUrl: scene.imageUrl,
    });

    return scene;
  }

  async deactivate(campaignId: string, userId: string) {
    await this.assertMaster(campaignId, userId);
    await this.prisma.scene.updateMany({
      where: { campaignId },
      data: { isActive: false },
    });

    this.gateway.emitToCampaign(campaignId, 'sceneDeactivated', {});
  }

  async remove(campaignId: string, sceneId: string, userId: string) {
    await this.assertMaster(campaignId, userId);
    return this.prisma.scene.delete({ where: { id: sceneId } });
  }

  async getActive(campaignId: string) {
    return this.prisma.scene.findFirst({
      where: { campaignId, isActive: true },
      include: { tokens: { include: this.tokenInclude } },
    });
  }

  // ── Token management ──

  async placeToken(sceneId: string, userId: string, data: { characterId?: string; npcId?: string; xPct?: number; yPct?: number }) {
    const scene = await this.prisma.scene.findUnique({ where: { id: sceneId } });
    if (!scene) throw new NotFoundException('Cenário não encontrado');
    await this.assertMaster(scene.campaignId, userId);

    const where = data.characterId
      ? { sceneId_characterId: { sceneId, characterId: data.characterId } }
      : { sceneId_npcId: { sceneId, npcId: data.npcId! } };

    const createData = {
      sceneId,
      xPct: data.xPct ?? 50,
      yPct: data.yPct ?? 50,
      ...(data.characterId ? { characterId: data.characterId } : { npcId: data.npcId }),
    };

    const token = await this.prisma.sceneToken.upsert({
      where,
      update: { xPct: data.xPct ?? 50, yPct: data.yPct ?? 50 },
      create: createData,
      include: this.tokenInclude,
    });

    this.gateway.emitToCampaign(scene.campaignId, 'sceneTokenUpdated', token);
    return token;
  }

  async moveToken(sceneId: string, userId: string, tokenId: string, xPct: number, yPct: number) {
    const scene = await this.prisma.scene.findUnique({ where: { id: sceneId } });
    if (!scene) throw new NotFoundException('Cenário não encontrado');
    await this.assertMaster(scene.campaignId, userId);

    const token = await this.prisma.sceneToken.update({
      where: { id: tokenId },
      data: { xPct, yPct },
      include: this.tokenInclude,
    });

    this.gateway.emitToCampaign(scene.campaignId, 'sceneTokenUpdated', token);
    return token;
  }

  async removeToken(sceneId: string, userId: string, tokenId: string) {
    const scene = await this.prisma.scene.findUnique({ where: { id: sceneId } });
    if (!scene) throw new NotFoundException('Cenário não encontrado');
    await this.assertMaster(scene.campaignId, userId);

    await this.prisma.sceneToken.delete({ where: { id: tokenId } });
    this.gateway.emitToCampaign(scene.campaignId, 'sceneTokenRemoved', { tokenId });
  }

  async getTokens(sceneId: string) {
    return this.prisma.sceneToken.findMany({
      where: { sceneId },
      include: this.tokenInclude,
    });
  }
}
