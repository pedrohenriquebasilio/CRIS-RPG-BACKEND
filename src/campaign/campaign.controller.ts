import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  name: string;
}

export class JoinCampaignDto {
  @IsString()
  inviteCode: string;
}

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  create(@Body() dto: CreateCampaignDto, @CurrentUser() user: any) {
    return this.campaignService.create(dto.name, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.campaignService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Get(':id/active-combat')
  getActiveCombat(@Param('id') id: string) {
    return this.campaignService.getActiveCombat(id);
  }

  // Master Shield: global log for a campaign
  @Get(':id/logs')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  getCampaignLogs(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignService.getCampaignLogs(id, user.id);
  }

  // Get campaign info from invite code (no auth required for this endpoint — useful for join page)
  // Note: still behind JwtAuthGuard, frontend should call after login
  @Get('invite/:code')
  getInviteInfo(@Param('code') code: string) {
    return this.campaignService.getInviteInfo(code);
  }

  @Post('join')
  join(@Body() dto: JoinCampaignDto, @CurrentUser() user: any) {
    return this.campaignService.joinByInviteCode(dto.inviteCode, user.id);
  }

  @Patch(':id/characters/:characterId/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  approveCharacter(
    @Param('id') id: string,
    @Param('characterId') characterId: string,
    @CurrentUser() user: any,
  ) {
    return this.campaignService.approveCharacter(id, characterId, user.id);
  }
}
