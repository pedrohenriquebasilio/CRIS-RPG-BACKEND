import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoDano } from '@prisma/client';

@Injectable()
export class NpcService {
  constructor(private prisma: PrismaService) {}

  async createSimplified(
    campaignId: string,
    data: {
      nome: string;
      hp: number;
      energia: number;
      bonusAtaque: number;
      defesa: number;
      danoFixo: number;
      tipoDano: TipoDano;
    },
    masterId: string,
  ) {
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

  async createFull(
    campaignId: string,
    data: {
      nome: string;
      hp: number;
      energia: number;
      nivel: number;
      maestriaBonus: number;
      attributes: {
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
      };
    },
    masterId: string,
  ) {
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

  async findByCampaign(campaignId: string) {
    return this.prisma.npc.findMany({
      where: { campaignId },
      include: { attributes: true },
    });
  }

  async findOne(id: string) {
    const npc = await this.prisma.npc.findUnique({
      where: { id },
      include: { attributes: true },
    });
    if (!npc) throw new NotFoundException('NPC not found');
    return npc;
  }

  async update(id: string, data: any, masterId: string) {
    const npc = await this.prisma.npc.findUnique({
      where: { id },
      include: { campaign: true },
    });
    if (!npc) throw new NotFoundException('NPC not found');
    if (npc.campaign.masterId !== masterId) {
      throw new ForbiddenException('Only master can update NPCs');
    }

    return this.prisma.npc.update({
      where: { id },
      data,
      include: { attributes: true },
    });
  }

  async delete(id: string, masterId: string) {
    const npc = await this.prisma.npc.findUnique({
      where: { id },
      include: { campaign: true },
    });
    if (!npc) throw new NotFoundException('NPC not found');
    if (npc.campaign.masterId !== masterId) {
      throw new ForbiddenException('Only master can delete NPCs');
    }

    return this.prisma.npc.delete({ where: { id } });
  }

  private async verifyCampaignMaster(campaignId: string, masterId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.masterId !== masterId) {
      throw new ForbiddenException('Only master can manage NPCs');
    }
    return campaign;
  }
}
