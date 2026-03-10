import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getInventory(characterId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId, isActive: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    return this.prisma.inventoryItem.findMany({
      where: { characterId },
      include: { item: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addItem(
    characterId: string,
    userId: string,
    userRole: Role,
    data: { itemId: string; quantidade?: number; equipado?: boolean; notas?: string },
  ) {
    await this.checkAccess(characterId, userId, userRole);

    const item = await this.prisma.item.findUnique({ where: { id: data.itemId } });
    if (!item) throw new NotFoundException('Item not found');

    const quantidade = data.quantidade ?? 1;
    if (quantidade < 1) throw new BadRequestException('Quantidade must be at least 1');

    const existing = await this.prisma.inventoryItem.findUnique({
      where: { characterId_itemId: { characterId, itemId: data.itemId } },
    });

    if (existing) {
      // Stack quantities instead of throwing conflict
      return this.prisma.inventoryItem.update({
        where: { id: existing.id },
        data: { quantidade: existing.quantidade + quantidade },
        include: { item: true },
      });
    }

    return this.prisma.inventoryItem.create({
      data: {
        characterId,
        itemId: data.itemId,
        quantidade,
        equipado: data.equipado ?? false,
        notas: data.notas ?? '',
      },
      include: { item: true },
    });
  }

  async updateInventoryItem(
    characterId: string,
    inventoryItemId: string,
    userId: string,
    userRole: Role,
    data: { quantidade?: number; equipado?: boolean; notas?: string },
  ) {
    await this.checkAccess(characterId, userId, userRole);

    const invItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });
    if (!invItem || invItem.characterId !== characterId) {
      throw new NotFoundException('Inventory item not found');
    }
    if (data.quantidade !== undefined && data.quantidade < 1) {
      throw new BadRequestException('Quantidade must be at least 1');
    }

    const update: Record<string, any> = {};
    if (data.quantidade !== undefined) update.quantidade = data.quantidade;
    if (data.equipado   !== undefined) update.equipado   = data.equipado;
    if (data.notas      !== undefined) update.notas      = data.notas.trim();

    return this.prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: update,
      include: { item: true },
    });
  }

  async removeItem(
    characterId: string,
    inventoryItemId: string,
    userId: string,
    userRole: Role,
  ) {
    await this.checkAccess(characterId, userId, userRole);

    const invItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });
    if (!invItem || invItem.characterId !== characterId) {
      throw new NotFoundException('Inventory item not found');
    }

    await this.prisma.inventoryItem.delete({ where: { id: inventoryItemId } });
    return { deleted: true };
  }

  private async checkAccess(characterId: string, userId: string, userRole: Role) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId, isActive: true },
      include: { campaign: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    const isMaster = userRole === Role.MASTER && character.campaign.masterId === userId;
    const isOwner  = character.userId === userId;

    if (!isMaster && !isOwner) {
      throw new ForbiddenException('Not authorized to manage this inventory');
    }
  }
}
