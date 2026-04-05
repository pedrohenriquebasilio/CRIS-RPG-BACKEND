import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { SceneService } from './scene.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('scenes')
@UseGuards(JwtAuthGuard)
export class SceneController {
  constructor(private sceneService: SceneService) {}

  @Post(':campaignId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const dir = './uploads/scenes';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const unique = `scene-${Date.now()}${ext}`;
        cb(null, unique);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new BadRequestException('Apenas imagens são permitidas'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }))
  create(
    @Param('campaignId') campaignId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
    @Body('nome') nome: string,
  ) {
    if (!file) throw new BadRequestException('Arquivo não enviado');
    if (!nome?.trim()) throw new BadRequestException('Nome é obrigatório');
    return this.sceneService.create(campaignId, user.id, nome.trim(), `scenes/${file.filename}`);
  }

  @Get('view/:sceneId')
  getById(@Param('sceneId') sceneId: string) {
    return this.sceneService.getById(sceneId);
  }

  @Get(':campaignId')
  list(@Param('campaignId') campaignId: string) {
    return this.sceneService.list(campaignId);
  }

  @Get(':campaignId/active')
  getActive(@Param('campaignId') campaignId: string) {
    return this.sceneService.getActive(campaignId);
  }

  @Post(':campaignId/activate/:sceneId')
  activate(
    @Param('campaignId') campaignId: string,
    @Param('sceneId') sceneId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.sceneService.activate(campaignId, sceneId, user.id);
  }

  @Post(':campaignId/deactivate')
  deactivate(
    @Param('campaignId') campaignId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.sceneService.deactivate(campaignId, user.id);
  }

  @Delete(':campaignId/:sceneId')
  remove(
    @Param('campaignId') campaignId: string,
    @Param('sceneId') sceneId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.sceneService.remove(campaignId, sceneId, user.id);
  }

  // ── Scene Tokens ──

  @Get('tokens/:sceneId')
  getTokens(@Param('sceneId') sceneId: string) {
    return this.sceneService.getTokens(sceneId);
  }

  @Post('tokens/:sceneId')
  placeToken(
    @Param('sceneId') sceneId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { characterId?: string; npcId?: string; xPct?: number; yPct?: number },
  ) {
    return this.sceneService.placeToken(sceneId, user.id, body);
  }

  @Patch('tokens/:sceneId/:tokenId')
  moveToken(
    @Param('sceneId') sceneId: string,
    @Param('tokenId') tokenId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { xPct: number; yPct: number },
  ) {
    return this.sceneService.moveToken(sceneId, user.id, tokenId, body.xPct, body.yPct);
  }

  @Delete('tokens/:sceneId/:tokenId')
  removeToken(
    @Param('sceneId') sceneId: string,
    @Param('tokenId') tokenId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.sceneService.removeToken(sceneId, user.id, tokenId);
  }
}
