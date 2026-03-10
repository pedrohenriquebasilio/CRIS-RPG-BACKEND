import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { IsString, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class AddInventoryItemDto {
  @IsString()
  itemId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantidade?: number;

  @IsBoolean()
  @IsOptional()
  equipado?: boolean;

  @IsString()
  @IsOptional()
  notas?: string;
}

export class UpdateInventoryItemDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantidade?: number;

  @IsBoolean()
  @IsOptional()
  equipado?: boolean;

  @IsString()
  @IsOptional()
  notas?: string;
}

@Controller('characters/:characterId/inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  getInventory(@Param('characterId') characterId: string) {
    return this.inventoryService.getInventory(characterId);
  }

  @Post()
  addItem(
    @Param('characterId') characterId: string,
    @Body() dto: AddInventoryItemDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.addItem(characterId, user.id, user.role, dto);
  }

  @Patch(':inventoryItemId')
  updateItem(
    @Param('characterId') characterId: string,
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: UpdateInventoryItemDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.updateInventoryItem(characterId, inventoryItemId, user.id, user.role, dto);
  }

  @Delete(':inventoryItemId')
  removeItem(
    @Param('characterId') characterId: string,
    @Param('inventoryItemId') inventoryItemId: string,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.removeItem(characterId, inventoryItemId, user.id, user.role);
  }
}
