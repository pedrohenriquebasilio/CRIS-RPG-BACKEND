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

  async getById(sceneId: string) {
    const scene = await this.prisma.scene.findUnique({ where: { id: sceneId } });
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
    });
  }
}
