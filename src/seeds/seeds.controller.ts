import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('seeds')
@UseGuards(JwtAuthGuard)
export class SeedsController {
  constructor(private prisma: PrismaService) {}

  @Get('specializations')
  getSpecializations() {
    return this.prisma.specialization.findMany({ include: { abilities: true } });
  }

  @Get('skills')
  getSkills() {
    return this.prisma.skill.findMany();
  }

  @Get('aptitudes')
  getAptitudes() {
    return this.prisma.aptitude.findMany();
  }

  @Get('conditions')
  getConditions() {
    return this.prisma.condition.findMany();
  }

  @Get('level-progression')
  getLevelProgression() {
    return this.prisma.levelProgression.findMany({ orderBy: { level: 'asc' } });
  }

  @Get('weapon-templates')
  getWeaponTemplates() {
    return this.prisma.weaponTemplate.findMany({ orderBy: { categoria: 'asc' } });
  }

  @Get('origens')
  getOrigens() {
    return this.prisma.origem.findMany({ orderBy: { nome: 'asc' } });
  }
}
