import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class TalentoService {
  constructor(private prisma: PrismaService) {}

  // ── Catálogo global ───────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.talento.findMany({
      orderBy: [{ isSystem: 'desc' }, { nome: 'asc' }],
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const talento = await this.prisma.talento.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, email: true } } },
    });
    if (!talento) throw new NotFoundException('Talento not found');
    return talento;
  }

  async create(data: {
    nome: string;
    tipo?: string;
    custo?: string;
    alcance?: string;
    duracao?: string;
    descricao?: string;
    damageDice?: string;
    atributoBase?: string;
    userId: string;
  }) {
    return this.prisma.talento.create({
      data: {
        nome:         data.nome.trim(),
        tipo:         data.tipo         ?? 'ativa',
        custo:        data.custo        ?? 'nenhum',
        alcance:      data.alcance      ?? 'pessoal',
        duracao:      data.duracao      ?? 'imediato',
        descricao:    data.descricao?.trim() ?? '',
        damageDice:   data.damageDice   ?? null,
        atributoBase: data.atributoBase ?? null,
        createdById:  data.userId,
      },
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async update(
    id: string,
    userId: string,
    userRole: Role,
    data: Partial<{
      nome: string; tipo: string; custo: string; alcance: string;
      duracao: string; descricao: string; damageDice: string | null; atributoBase: string | null;
    }>,
  ) {
    const talento = await this.prisma.talento.findUnique({ where: { id } });
    if (!talento) throw new NotFoundException('Talento not found');

    if (talento.createdById !== userId && userRole !== Role.MASTER) {
      throw new ForbiddenException('Only the creator or a master can edit this talento');
    }

    const update: Record<string, any> = {};
    if (data.nome         !== undefined) update.nome         = data.nome.trim();
    if (data.tipo         !== undefined) update.tipo         = data.tipo;
    if (data.custo        !== undefined) update.custo        = data.custo;
    if (data.alcance      !== undefined) update.alcance      = data.alcance;
    if (data.duracao      !== undefined) update.duracao      = data.duracao;
    if (data.descricao    !== undefined) update.descricao    = data.descricao.trim();
    if (data.damageDice   !== undefined) update.damageDice   = data.damageDice;
    if (data.atributoBase !== undefined) update.atributoBase = data.atributoBase;

    return this.prisma.talento.update({
      where: { id },
      data: update,
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const talento = await this.prisma.talento.findUnique({ where: { id } });
    if (!talento) throw new NotFoundException('Talento not found');

    if (talento.createdById !== userId && userRole !== Role.MASTER) {
      throw new ForbiddenException('Only the creator or a master can delete this talento');
    }

    await this.prisma.talento.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Vínculo com personagem ─────────────────────────────────────────────────

  async addToCharacter(characterId: string, talentoId: string, userId: string, userRole: Role) {
    await this.checkCharacterAccess(characterId, userId, userRole);

    const talento = await this.prisma.talento.findUnique({ where: { id: talentoId } });
    if (!talento) throw new NotFoundException('Talento not found');

    const existing = await this.prisma.characterTalento.findUnique({
      where: { characterId_talentoId: { characterId, talentoId } },
    });
    if (existing) throw new ConflictException('Character already has this talento');

    return this.prisma.characterTalento.create({
      data: { characterId, talentoId },
      include: { talento: true },
    });
  }

  async removeFromCharacter(characterId: string, talentoId: string, userId: string, userRole: Role) {
    await this.checkCharacterAccess(characterId, userId, userRole);

    const link = await this.prisma.characterTalento.findUnique({
      where: { characterId_talentoId: { characterId, talentoId } },
    });
    if (!link) throw new NotFoundException('Talento not found on this character');

    await this.prisma.characterTalento.delete({ where: { id: link.id } });
    return { deleted: true };
  }

  private async checkCharacterAccess(characterId: string, userId: string, userRole: Role) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId, isActive: true },
      include: { campaign: true },
    });
    if (!character) throw new NotFoundException('Character not found');

    const isMaster = userRole === Role.MASTER && character.campaign.masterId === userId;
    const isOwner  = character.userId === userId;
    if (!isMaster && !isOwner) throw new ForbiddenException('Not your character');
  }
}
