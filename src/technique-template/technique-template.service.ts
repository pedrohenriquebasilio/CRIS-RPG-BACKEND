import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Atributo, TipoDano } from '@prisma/client';

export interface CreateTechniqueTemplateDto {
  nome: string;
  nivel: number;
  atributoBase: Atributo;
  custoEnergia?: number;
  tipoDano?: TipoDano | null;
  cd?: number | null;
  descricaoLivre?: string;
}

@Injectable()
export class TechniqueTemplateService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.techniqueTemplate.findMany({
      orderBy: [{ isSystem: 'desc' }, { nivel: 'asc' }, { nome: 'asc' }],
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  create(data: CreateTechniqueTemplateDto, userId: string) {
    return this.prisma.techniqueTemplate.create({
      data: {
        nome: data.nome,
        nivel: data.nivel,
        atributoBase: data.atributoBase,
        custoEnergia: data.custoEnergia ?? 0,
        tipoDano: data.tipoDano ?? null,
        cd: data.cd ?? null,
        descricaoLivre: data.descricaoLivre ?? '',
        isSystem: false,
        createdById: userId,
      },
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  delete(id: string) {
    return this.prisma.techniqueTemplate.delete({ where: { id } });
  }
}
