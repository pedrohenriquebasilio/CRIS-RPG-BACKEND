import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { TechniqueTemplateService, CreateTechniqueTemplateDto } from './technique-template.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { IsString, IsEnum, IsInt, Min, Max, IsOptional, IsNumber } from 'class-validator';
import { Atributo, TipoDano } from '@prisma/client';

class CreateDto implements CreateTechniqueTemplateDto {
  @IsString()
  nome: string;

  @IsInt() @Min(1) @Max(5)
  nivel: number;

  @IsEnum(Atributo)
  atributoBase: Atributo;

  @IsInt() @Min(0) @IsOptional()
  custoEnergia?: number;

  @IsEnum(TipoDano) @IsOptional()
  tipoDano?: TipoDano | null;

  @IsNumber() @Min(1) @IsOptional()
  cd?: number | null;

  @IsString() @IsOptional()
  descricaoLivre?: string;
}

@Controller('technique-templates')
@UseGuards(JwtAuthGuard)
export class TechniqueTemplateController {
  constructor(private service: TechniqueTemplateService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
