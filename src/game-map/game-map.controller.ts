import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GameMapService } from './game-map.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('game-map')
@UseGuards(JwtAuthGuard)
export class GameMapController {
  constructor(private gameMapService: GameMapService) {}

  @Post(':campaignId')
  createMap(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { width?: number; height?: number },
  ) {
    return this.gameMapService.createMap(campaignId, user.id, body.width, body.height);
  }

  @Get(':campaignId')
  getMap(@Param('campaignId') campaignId: string) {
    return this.gameMapService.getMap(campaignId);
  }

  @Patch(':campaignId/tiles')
  updateTiles(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { tiles: number[][] },
  ) {
    return this.gameMapService.updateTiles(campaignId, user.id, body.tiles);
  }

  @Post(':campaignId/token')
  placeToken(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { characterId?: string; npcId?: string; x: number; y: number },
  ) {
    return this.gameMapService.placeToken(campaignId, user.id, body);
  }

  @Delete(':campaignId/token/:positionId')
  removeToken(
    @Param('campaignId') campaignId: string,
    @Param('positionId') positionId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.gameMapService.removeToken(campaignId, user.id, positionId);
  }

  @Get(':campaignId/positions')
  getPositions(@Param('campaignId') campaignId: string) {
    return this.gameMapService.getPositions(campaignId);
  }
}
