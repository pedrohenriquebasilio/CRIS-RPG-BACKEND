import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NpcService } from './npc.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role, TipoDano } from '@prisma/client';
import { IsString, IsInt, IsEnum, IsObject, IsOptional } from 'class-validator';

export class CreateSimplifiedNpcDto {
  @IsString()
  campaignId: string;

  @IsString()
  nome: string;

  @IsInt()
  hp: number;

  @IsInt()
  energia: number;

  @IsInt()
  bonusAtaque: number;

  @IsInt()
  defesa: number;

  @IsInt()
  danoFixo: number;

  @IsEnum(TipoDano)
  tipoDano: TipoDano;
}

export class CreateFullNpcDto {
  @IsString()
  campaignId: string;

  @IsString()
  nome: string;

  @IsInt()
  hp: number;

  @IsInt()
  energia: number;

  @IsInt()
  nivel: number;

  @IsInt()
  maestriaBonus: number;

  @IsObject()
  attributes: {
    FOR: number;
    AGI: number;
    VIG: number;
    INT: number;
    PRE: number;
  };
}

@Controller('npcs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MASTER)
export class NpcController {
  constructor(private npcService: NpcService) {}

  @Post('simplified')
  createSimplified(@Body() dto: CreateSimplifiedNpcDto, @CurrentUser() user: any) {
    return this.npcService.createSimplified(dto.campaignId, dto, user.id);
  }

  @Post('full')
  createFull(@Body() dto: CreateFullNpcDto, @CurrentUser() user: any) {
    return this.npcService.createFull(dto.campaignId, dto, user.id);
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.npcService.findByCampaign(campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.npcService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
    return this.npcService.update(id, data, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.npcService.delete(id, user.id);
  }
}
