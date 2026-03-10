import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.item.findMany({
      orderBy: [{ isSystem: 'desc' }, { nome: 'asc' }],
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, email: true } } },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async create(data: {
    nome: string;
    descricao?: string;
    tipo?: string;
    peso?: number;
    valor?: number;
    userId: string;
  }) {
    return this.prisma.item.create({
      data: {
        nome: data.nome.trim(),
        descricao: data.descricao?.trim() ?? '',
        tipo: data.tipo ?? 'misc',
        peso: data.peso ?? 0,
        valor: data.valor ?? 0,
        createdById: data.userId,
      },
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async update(
    id: string,
    userId: string,
    userRole: Role,
    data: Partial<{ nome: string; descricao: string; tipo: string; peso: number; valor: number }>,
  ) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    const isOwner = item.createdById === userId;
    const isMaster = userRole === Role.MASTER;
    if (!isOwner && !isMaster) {
      throw new ForbiddenException('Only the creator or a master can edit this item');
    }

    const update: Record<string, any> = {};
    if (data.nome      !== undefined) update.nome      = data.nome.trim();
    if (data.descricao !== undefined) update.descricao = data.descricao.trim();
    if (data.tipo      !== undefined) update.tipo      = data.tipo;
    if (data.peso      !== undefined) update.peso      = data.peso;
    if (data.valor     !== undefined) update.valor     = data.valor;

    return this.prisma.item.update({
      where: { id },
      data: update,
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    const isOwner = item.createdById === userId;
    const isMaster = userRole === Role.MASTER;
    if (!isOwner && !isMaster) {
      throw new ForbiddenException('Only the creator or a master can delete this item');
    }

    await this.prisma.item.delete({ where: { id } });
    return { deleted: true };
  }
}
