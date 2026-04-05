import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameMapService {
  constructor(private prisma: PrismaService) {}

  async createMap(campaignId: string, userId: string, width = 30, height = 30) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    if (campaign.masterId !== userId) throw new ForbiddenException('Apenas o mestre pode criar o mapa');

    // Gerar grid vazio (0 = chão, 1 = parede)
    const tiles: number[][] = Array.from({ length: height }, () => Array(width).fill(0));

    return this.prisma.gameMap.upsert({
      where: { campaignId },
      update: { width, height, tiles },
      create: { campaignId, width, height, tiles },
      include: { positions: { include: { character: true, npc: true } } },
    });
  }

  async getMap(campaignId: string) {
    const map = await this.prisma.gameMap.findUnique({
      where: { campaignId },
      include: {
        positions: {
          include: {
            character: { select: { id: true, nome: true, avatarUrl: true, hpAtual: true, hpMax: true, isMob: true } },
            npc: { select: { id: true, nome: true, hpAtual: true, hpMax: true } },
          },
        },
      },
    });
    if (!map) throw new NotFoundException('Mapa não encontrado para esta campanha');
    return map;
  }

  async updateTiles(campaignId: string, userId: string, tiles: number[][]) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    if (campaign.masterId !== userId) throw new ForbiddenException('Apenas o mestre pode editar o mapa');

    return this.prisma.gameMap.update({
      where: { campaignId },
      data: { tiles },
    });
  }

  async placeToken(campaignId: string, userId: string, data: { characterId?: string; npcId?: string; x: number; y: number }) {
    const map = await this.prisma.gameMap.findUnique({ where: { campaignId } });
    if (!map) throw new NotFoundException('Mapa não encontrado');

    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');

    // Apenas o mestre pode mover tokens
    if (campaign.masterId !== userId) {
      throw new ForbiddenException('Apenas o mestre pode mover tokens no mapa');
    }

    // Verificar limites do mapa
    const tiles = map.tiles as number[][];
    if (data.y < 0 || data.y >= tiles.length || data.x < 0 || data.x >= (tiles[0]?.length ?? 0)) {
      throw new ForbiddenException('Posição fora dos limites do mapa');
    }
    // Verificar se é parede
    if (tiles[data.y]?.[data.x] === 1) {
      throw new ForbiddenException('Não é possível mover para uma parede');
    }

    const where = data.characterId
      ? { gameMapId_characterId: { gameMapId: map.id, characterId: data.characterId } }
      : { gameMapId_npcId: { gameMapId: map.id, npcId: data.npcId! } };

    const createData = {
      gameMapId: map.id,
      x: data.x,
      y: data.y,
      ...(data.characterId ? { characterId: data.characterId } : { npcId: data.npcId }),
    };

    return this.prisma.mapPosition.upsert({
      where,
      update: { x: data.x, y: data.y },
      create: createData,
      include: {
        character: { select: { id: true, nome: true, avatarUrl: true, hpAtual: true, hpMax: true, isMob: true } },
        npc: { select: { id: true, nome: true, hpAtual: true, hpMax: true } },
      },
    });
  }

  async removeToken(campaignId: string, userId: string, positionId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.masterId !== userId) throw new ForbiddenException('Apenas o mestre pode remover tokens');

    return this.prisma.mapPosition.delete({ where: { id: positionId } });
  }

  async getPositions(campaignId: string) {
    const map = await this.prisma.gameMap.findUnique({ where: { campaignId } });
    if (!map) return [];

    return this.prisma.mapPosition.findMany({
      where: { gameMapId: map.id },
      include: {
        character: { select: { id: true, nome: true, avatarUrl: true, hpAtual: true, hpMax: true, isMob: true } },
        npc: { select: { id: true, nome: true, hpAtual: true, hpMax: true } },
      },
    });
  }
}
