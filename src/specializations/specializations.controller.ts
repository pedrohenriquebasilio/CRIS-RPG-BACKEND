import { Controller, Get, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('specializations')
@UseGuards(JwtAuthGuard)
export class SpecializationsController {
  constructor(private prisma: PrismaService) {}

  // GET /specializations
  // Lista todas as especializações com suas habilidades
  @Get()
  findAll() {
    return this.prisma.specialization.findMany({
      include: {
        abilities: { orderBy: { nivelRequerido: 'asc' } },
      },
      orderBy: { nome: 'asc' },
    });
  }

  // GET /specializations/:id
  // Uma especialização completa com habilidades
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const spec = await this.prisma.specialization.findUnique({
      where: { id },
      include: {
        abilities: { orderBy: { nivelRequerido: 'asc' } },
        _count: { select: { characters: true } },
      },
    });
    if (!spec) throw new NotFoundException('Specialization not found');
    return spec;
  }

  // GET /specializations/:id/abilities
  // Habilidades de uma especialização, com filtro opcional por nível
  // ?nivel=3 → retorna abilities do nível 3 ou abaixo
  @Get(':id/abilities')
  async getAbilities(
    @Param('id') id: string,
    @Query('nivel') nivel?: string,
  ) {
    const spec = await this.prisma.specialization.findUnique({ where: { id } });
    if (!spec) throw new NotFoundException('Specialization not found');

    const where: any = { specializationId: id };
    if (nivel) {
      where.nivelRequerido = { lte: parseInt(nivel, 10) };
    }

    return this.prisma.specializationAbility.findMany({
      where,
      orderBy: { nivelRequerido: 'asc' },
    });
  }

  // GET /specializations/:id/abilities/at-level/:nivel
  // Habilidades desbloqueadas exatamente em um nível específico
  @Get(':id/abilities/at-level/:nivel')
  async getAbilitiesAtLevel(
    @Param('id') id: string,
    @Param('nivel') nivel: string,
  ) {
    const spec = await this.prisma.specialization.findUnique({ where: { id } });
    if (!spec) throw new NotFoundException('Specialization not found');

    return this.prisma.specializationAbility.findMany({
      where: { specializationId: id, nivelRequerido: parseInt(nivel, 10) },
      orderBy: { nivelRequerido: 'asc' },
    });
  }
}
