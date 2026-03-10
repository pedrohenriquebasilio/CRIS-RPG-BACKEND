import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { TalentoService } from './talento.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';

export class CreateTalentoDto {
  @IsString()
  nome: string;

  @IsString() @IsOptional() tipo?: string;
  @IsString() @IsOptional() custo?: string;
  @IsString() @IsOptional() alcance?: string;
  @IsString() @IsOptional() duracao?: string;
  @IsString() @IsOptional() descricao?: string;
  @IsString() @IsOptional() damageDice?: string;
  @IsString() @IsOptional() atributoBase?: string;
}

export class UpdateTalentoDto {
  @IsString() @IsOptional() nome?: string;
  @IsString() @IsOptional() tipo?: string;
  @IsString() @IsOptional() custo?: string;
  @IsString() @IsOptional() alcance?: string;
  @IsString() @IsOptional() duracao?: string;
  @IsString() @IsOptional() descricao?: string;
  @IsString() @IsOptional() damageDice?: string | null;
  @IsString() @IsOptional() atributoBase?: string | null;
}

@Controller('talentos')
@UseGuards(JwtAuthGuard)
export class TalentoController {
  constructor(private talentoService: TalentoService) {}

  // ── Catálogo global ────────────────────────────────────────────────────────

  @Get()
  findAll() {
    return this.talentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talentoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTalentoDto, @CurrentUser() user: any) {
    return this.talentoService.create({ ...dto, userId: user.id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTalentoDto,
    @CurrentUser() user: any,
  ) {
    return this.talentoService.update(id, user.id, user.role, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.talentoService.remove(id, user.id, user.role);
  }

  // ── Vínculo com personagem ─────────────────────────────────────────────────

  @Post('character/:characterId/:talentoId')
  addToCharacter(
    @Param('characterId') characterId: string,
    @Param('talentoId') talentoId: string,
    @CurrentUser() user: any,
  ) {
    return this.talentoService.addToCharacter(characterId, talentoId, user.id, user.role);
  }

  @Delete('character/:characterId/:talentoId')
  removeFromCharacter(
    @Param('characterId') characterId: string,
    @Param('talentoId') talentoId: string,
    @CurrentUser() user: any,
  ) {
    return this.talentoService.removeFromCharacter(characterId, talentoId, user.id, user.role);
  }
}
