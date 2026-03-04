import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CombatService } from './combat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role, TipoDano } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsEnum, IsBoolean } from 'class-validator';

export class CreateCombatDto {
  @IsString()
  campaignId: string;
}

export class AddParticipantDto {
  @IsString()
  @IsOptional()
  characterId?: string;

  @IsString()
  @IsOptional()
  npcId?: string;
}

export class ApplyDamageDto {
  @IsInt()
  damage: number;

  @IsEnum(TipoDano)
  tipoDano: TipoDano;

  @IsString()
  @IsOptional()
  source?: string;
}

export class ApplyConditionDto {
  @IsString()
  conditionId: string;
}

export class ForceTestDto {
  @IsString()
  characterId: string;

  @IsString()
  skillId: string;
}

export class ReorderParticipantDto {
  @IsInt()
  newOrder: number;
}

@Controller('combats')
@UseGuards(JwtAuthGuard)
export class CombatController {
  constructor(private combatService: CombatService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  create(@Body() dto: CreateCombatDto, @CurrentUser() user: any) {
    return this.combatService.createCombat(dto.campaignId, user.id);
  }

  @Get(':id')
  getState(@Param('id') id: string) {
    return this.combatService.getCombatState(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.combatService.getCombatLogs(id);
  }

  @Post(':id/participants')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  addParticipant(
    @Param('id') id: string,
    @Body() dto: AddParticipantDto,
    @CurrentUser() user: any,
  ) {
    return this.combatService.addParticipant(id, dto, user.id);
  }

  @Post(':id/initiative')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  rollInitiative(@Param('id') id: string, @CurrentUser() user: any) {
    return this.combatService.rollInitiative(id, user.id);
  }

  @Post(':id/round/start')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  startRound(@Param('id') id: string, @CurrentUser() user: any) {
    return this.combatService.startRound(id, user.id);
  }

  @Post(':id/round/next-turn')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  nextTurn(@Param('id') id: string, @CurrentUser() user: any) {
    return this.combatService.nextTurn(id, user.id);
  }

  @Post(':id/round/skip')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  skipTurn(@Param('id') id: string, @CurrentUser() user: any) {
    return this.combatService.skipTurn(id, user.id);
  }

  @Patch(':id/participants/:participantId/reorder')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  reorderParticipant(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
    @Body() dto: ReorderParticipantDto,
    @CurrentUser() user: any,
  ) {
    return this.combatService.reorderParticipant(id, participantId, dto.newOrder, user.id);
  }

  @Post(':id/participants/:participantId/damage')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  applyDamage(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
    @Body() dto: ApplyDamageDto,
    @CurrentUser() user: any,
  ) {
    return this.combatService.applyDamage(id, participantId, dto.damage, dto.tipoDano, user.id, dto.source);
  }

  @Post(':id/participants/:participantId/conditions')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  applyCondition(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
    @Body() dto: ApplyConditionDto,
    @CurrentUser() user: any,
  ) {
    return this.combatService.applyCondition(id, participantId, dto.conditionId, user.id);
  }

  @Post(':id/force-test')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  forceTest(
    @Param('id') id: string,
    @Body() dto: ForceTestDto,
    @CurrentUser() user: any,
  ) {
    return this.combatService.forceTest(id, dto.characterId, dto.skillId, user.id);
  }

  @Post(':id/finish')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  finish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.combatService.finishCombat(id, user.id);
  }
}
