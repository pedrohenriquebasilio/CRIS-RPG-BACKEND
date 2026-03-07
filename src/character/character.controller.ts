import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Atributo, Role, TipoDano } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  campaignId: string;

  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  specializationId?: string;

  @IsObject()
  @IsOptional()
  attributes?: {
    FOR: number;
    AGI: number;
    VIG: number;
    INT: number;
    PRE: number;
  };

  @IsBoolean()
  @IsOptional()
  isMob?: boolean;
}

export class AddTechniqueDto {
  @IsString()
  nome: string;

  @IsInt()
  @Min(0)
  @Max(5)
  nivel: number;

  @IsInt()
  @Min(0)
  custoEnergia: number;

  @IsEnum(Atributo)
  atributoBase: Atributo;

  @IsString()
  @IsOptional()
  descricaoLivre: string = '';

  @IsEnum(['FISICO', 'ENERGETICO', 'MENTAL', 'ESPIRITUAL'])
  @IsOptional()
  tipoDano?: string;
}

export class AddWeaponDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  skillId?: string;

  @IsString()
  damageDice: string;

  @IsEnum(TipoDano)
  damageType: TipoDano;

  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  threatRange?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  criticalMultiplier?: number;

  @IsString()
  @IsOptional()
  descricao?: string;
}

export class GrantXpDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @IsOptional()
  combatId?: string;
}

export class DistributeAttributeDto {
  @IsEnum(Atributo)
  attribute: Atributo;
}

export class AddAbilityDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  custo?: string;

  @IsString()
  @IsOptional()
  alcance?: string;

  @IsString()
  @IsOptional()
  duracao?: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}

export class UpdateStatsDto {
  @IsInt() @Min(0) @IsOptional() hpAtual?: number;
  @IsInt() @Min(1) @IsOptional() hpMax?: number;
  @IsInt() @Min(0) @IsOptional() energiaAtual?: number;
  @IsInt() @Min(1) @IsOptional() energiaMax?: number;
  @IsInt() @Min(1) @IsOptional() maestriaBonus?: number;
}

export class UpdateAttributesDto {
  @IsInt() @Min(0) @Max(10) @IsOptional() FOR?: number;
  @IsInt() @Min(0) @Max(10) @IsOptional() AGI?: number;
  @IsInt() @Min(0) @Max(10) @IsOptional() VIG?: number;
  @IsInt() @Min(0) @Max(10) @IsOptional() INT?: number;
  @IsInt() @Min(0) @Max(10) @IsOptional() PRE?: number;
}

export class UpdateClassOriginDto {
  @IsString() @IsOptional() specializationId?: string;
  @IsString() @IsOptional() origemId?: string;
}

export class UpdateSkillDto {
  @IsBoolean() @IsOptional() treinada?: boolean;
  @IsInt() @Min(0) @Max(20) @IsOptional() pontosInvestidos?: number;
  @IsString() @IsOptional() skillName?: string;
}

@Controller('characters')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Post()
  create(@Body() dto: CreateCharacterDto, @CurrentUser() user: any) {
    return this.characterService.create({
      campaignId: dto.campaignId,
      userId: user.id,
      nome: dto.nome,
      specializationId: dto.specializationId,
      attributes: dto.attributes,
      isMob: dto.isMob,
      requestingUserRole: user.role,
    });
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.characterService.findByCampaign(campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(id);
  }

  @Post(':id/skills/:skillId')
  addSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.addSkill(id, skillId, user.id);
  }

  @Patch(':id/skills/:skillId/train')
  trainSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.trainSkill(id, skillId, user.id);
  }

  @Post(':id/aptitudes/:aptitudeId')
  addAptitude(
    @Param('id') id: string,
    @Param('aptitudeId') aptitudeId: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.addAptitude(id, aptitudeId, user.id);
  }

  @Post(':id/techniques')
  addTechnique(
    @Param('id') id: string,
    @Body() dto: AddTechniqueDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.addTechnique(id, dto, user.id);
  }

  @Patch(':id/techniques/:techniqueId')
  updateTechnique(
    @Param('id') id: string,
    @Param('techniqueId') techniqueId: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateTechnique(id, techniqueId, data, user.id);
  }

  @Post(':id/weapons')
  addWeapon(
    @Param('id') id: string,
    @Body() dto: AddWeaponDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.addWeapon(id, dto, user.id);
  }

  @Patch(':id/weapons/:weaponId')
  updateWeapon(
    @Param('id') id: string,
    @Param('weaponId') weaponId: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateWeapon(id, weaponId, data, user.id);
  }

  @Delete(':id/weapons/:weaponId')
  deleteWeapon(
    @Param('id') id: string,
    @Param('weaponId') weaponId: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.deleteWeapon(id, weaponId, user.id);
  }

  @Delete(':id')
  deactivate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.characterService.deactivate(id, user.id);
  }

  @Post(':id/attributes/distribute')
  distributeAttribute(
    @Param('id') id: string,
    @Body() dto: DistributeAttributeDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.distributeAttribute(id, dto.attribute, user.id);
  }

  @Patch(':id/nome')
  updateNome(
    @Param('id') id: string,
    @Body('nome') nome: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateNome(id, user.id, nome);
  }

  // ── Player self-service updates ──────────────────────────────────────────

  @Patch(':id/stats')
  updateStats(
    @Param('id') id: string,
    @Body() dto: UpdateStatsDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateStats(id, user.id, dto);
  }

  @Patch(':id/attributes')
  updateAttributes(
    @Param('id') id: string,
    @Body() dto: UpdateAttributesDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateAttributes(id, user.id, dto);
  }

  // PATCH /characters/:id/class-origin  { specializationId?, origemId? }
  @Patch(':id/class-origin')
  updateClassOrigin(
    @Param('id') id: string,
    @Body() dto: UpdateClassOriginDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.updateClassOrigin(id, user.id, dto);
  }

  // PATCH /characters/:id/skills/by-name  { skillName, treinada?, pontosInvestidos? }
  @Patch(':id/skills/by-name')
  updateSkillByName(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
    @CurrentUser() user: any,
  ) {
    if (!dto.skillName) throw new Error('skillName is required');
    return this.characterService.updateSkillByName(id, dto.skillName, user.id, {
      treinada: dto.treinada,
      pontosInvestidos: dto.pontosInvestidos,
    });
  }

  @Post(':id/abilities')
  addAbility(
    @Param('id') id: string,
    @Body() dto: AddAbilityDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.addAbility(id, dto, user.id);
  }

  @Delete(':id/abilities/:abilityId')
  deleteAbility(
    @Param('id') id: string,
    @Param('abilityId') abilityId: string,
    @CurrentUser() user: any,
  ) {
    return this.characterService.deleteAbility(id, abilityId, user.id);
  }

  @Post(':id/xp')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  grantXp(
    @Param('id') id: string,
    @Body() dto: GrantXpDto,
    @CurrentUser() user: any,
  ) {
    return this.characterService.grantXp(id, dto.amount, user.id, dto.combatId);
  }
}
