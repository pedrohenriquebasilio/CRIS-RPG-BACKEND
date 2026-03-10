import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  IsString, IsOptional, IsNumber, Min, IsIn,
} from 'class-validator';

export const ITEM_TIPOS = ['misc', 'consumivel', 'equipamento', 'quest', 'material'] as const;

export class CreateItemDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  @IsIn(ITEM_TIPOS)
  tipo?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  peso?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;
}

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  @IsIn(ITEM_TIPOS)
  tipo?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  peso?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;
}

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto, @CurrentUser() user: any) {
    return this.itemService.create({ ...dto, userId: user.id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @CurrentUser() user: any,
  ) {
    return this.itemService.update(id, user.id, user.role, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.itemService.remove(id, user.id, user.role);
  }
}
