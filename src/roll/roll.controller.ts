import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RollService } from './roll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Atributo } from '@prisma/client';

export class RollSkillDto {
  @IsString()
  skillId: string;

  @IsString()
  characterId: string;

  @IsString()
  @IsOptional()
  combatId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

export class RollTechniqueDto {
  @IsString()
  techniqueId: string;

  @IsString()
  actorId: string;

  @IsString()
  @IsOptional()
  targetId?: string;

  @IsString()
  @IsOptional()
  combatId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

export class RollOpposedDto {
  @IsString()
  attackerId: string;

  @IsString()
  defenderId: string;

  @IsEnum(Atributo)
  @IsOptional()
  atkAttr?: Atributo;

  @IsEnum(Atributo)
  @IsOptional()
  defAttr?: Atributo;

  @IsString()
  @IsOptional()
  combatId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

export class RollAttributeDto {
  @IsString()
  characterId: string;

  @IsEnum(Atributo)
  attribute: Atributo;

  @IsString()
  @IsOptional()
  combatId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

export class RollWeaponAttackDto {
  @IsString()
  characterId: string;

  @IsString()
  weaponId: string;

  @IsString()
  @IsOptional()
  targetId?: string;

  @IsString()
  @IsOptional()
  combatId?: string;

  @IsString()
  @IsOptional()
  campaignId?: string;
}

@Controller('roll')
@UseGuards(JwtAuthGuard)
export class RollController {
  constructor(private rollService: RollService) {}

  @Post('skill')
  rollSkill(@Body() dto: RollSkillDto) {
    return this.rollService.rollSkill(dto.skillId, dto.characterId, dto.combatId, dto.campaignId);
  }

  @Post('technique')
  rollTechnique(@Body() dto: RollTechniqueDto) {
    return this.rollService.rollTechnique(
      dto.techniqueId,
      dto.actorId,
      dto.targetId,
      dto.combatId,
      dto.campaignId,
    );
  }

  @Post('initiative/:combatId')
  rollInitiative(@Param('combatId') combatId: string) {
    return this.rollService.rollInitiative(combatId);
  }

  @Post('opposed')
  rollOpposed(@Body() dto: RollOpposedDto) {
    return this.rollService.rollOpposed(
      dto.attackerId,
      dto.defenderId,
      dto.atkAttr,
      dto.defAttr,
      dto.combatId,
      dto.campaignId,
    );
  }

  @Post('attribute')
  rollAttribute(@Body() dto: RollAttributeDto) {
    return this.rollService.rollAttribute(
      dto.characterId,
      dto.attribute,
      dto.combatId,
      dto.campaignId,
    );
  }

  @Post('weapon-attack')
  rollWeaponAttack(@Body() dto: RollWeaponAttackDto) {
    return this.rollService.rollWeaponAttack(
      dto.characterId,
      dto.weaponId,
      dto.targetId,
      dto.combatId,
      dto.campaignId,
    );
  }
}
