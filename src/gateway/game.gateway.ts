import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);
  private connectedUsers = new Map<string, { userId: string; role: string; campaignId?: string }>();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, {
        userId: payload.sub,
        role: payload.role,
      });

      this.logger.log(`Client connected: ${client.id} (${payload.email})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCampaign')
  async handleJoinCampaign(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { campaignId: string },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) return;

    const roomName = `campaign:${data.campaignId}`;
    client.join(roomName);

    user.campaignId = data.campaignId;
    this.connectedUsers.set(client.id, user);

    this.logger.log(`User ${user.userId} joined campaign room ${data.campaignId}`);

    client.emit('joinedCampaign', { campaignId: data.campaignId });
  }

  @SubscribeMessage('leaveCampaign')
  async handleLeaveCampaign(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { campaignId: string },
  ) {
    const roomName = `campaign:${data.campaignId}`;
    client.leave(roomName);
  }

  // Emit to entire campaign room
  emitToCampaign(campaignId: string, event: string, data: any) {
    this.server.to(`campaign:${campaignId}`).emit(event, data);
  }

  // Emit combat state update
  emitCombatUpdate(campaignId: string, combatData: any) {
    this.emitToCampaign(campaignId, 'combatUpdate', combatData);
  }

  // Emit new combat log entry
  emitCombatLog(campaignId: string, logEntry: any) {
    this.emitToCampaign(campaignId, 'newCombatLog', logEntry);
  }

  // Emit level up notification
  emitLevelUp(campaignId: string, characterData: any) {
    this.emitToCampaign(campaignId, 'levelUp', characterData);
  }

  // Emit character update
  emitCharacterUpdate(campaignId: string, characterData: any) {
    this.emitToCampaign(campaignId, 'characterUpdate', characterData);
  }

  // Emit master shield update (full combat state for master)
  emitMasterShieldUpdate(campaignId: string, shieldData: any) {
    this.emitToCampaign(campaignId, 'masterShieldUpdate', shieldData);
  }

  // ── Game Map events ──

  @SubscribeMessage('moveToken')
  async handleMoveToken(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { campaignId: string; characterId?: string; npcId?: string; x: number; y: number },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user) return;

    // Verificar permissão: player só move o próprio char, master move qualquer
    if (data.characterId && user.role !== 'MASTER') {
      const char = await this.prisma.character.findUnique({ where: { id: data.characterId } });
      if (!char || char.userId !== user.userId) return;
    }
    if (data.npcId && user.role !== 'MASTER') return;

    const map = await this.prisma.gameMap.findUnique({ where: { campaignId: data.campaignId } });
    if (!map) return;

    // Verificar limites e parede
    const tiles = map.tiles as number[][];
    if (data.y < 0 || data.y >= tiles.length || data.x < 0 || data.x >= (tiles[0]?.length ?? 0)) return;
    if (tiles[data.y]?.[data.x] === 1) return;

    const where = data.characterId
      ? { gameMapId_characterId: { gameMapId: map.id, characterId: data.characterId } }
      : { gameMapId_npcId: { gameMapId: map.id, npcId: data.npcId! } };

    const createData = {
      gameMapId: map.id,
      x: data.x,
      y: data.y,
      ...(data.characterId ? { characterId: data.characterId } : { npcId: data.npcId }),
    };

    try {
      const position = await this.prisma.mapPosition.upsert({
        where,
        update: { x: data.x, y: data.y },
        create: createData,
        include: {
          character: { select: { id: true, nome: true, avatarUrl: true, hpAtual: true, hpMax: true, isMob: true } },
          npc: { select: { id: true, nome: true, hpAtual: true, hpMax: true } },
        },
      });
      this.emitToCampaign(data.campaignId, 'tokenMoved', position);
    } catch {
      this.logger.warn(`Failed to move token for campaign ${data.campaignId}`);
    }
  }

  @SubscribeMessage('placeTile')
  async handlePlaceTile(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { campaignId: string; x: number; y: number; tileType: number },
  ) {
    const user = this.connectedUsers.get(client.id);
    if (!user || user.role !== 'MASTER') return;

    const map = await this.prisma.gameMap.findUnique({ where: { campaignId: data.campaignId } });
    if (!map) return;

    const tiles = (map.tiles as number[][]).map(row => [...row]);
    if (data.y >= 0 && data.y < tiles.length && data.x >= 0 && data.x < (tiles[0]?.length ?? 0)) {
      tiles[data.y][data.x] = data.tileType;
      await this.prisma.gameMap.update({ where: { campaignId: data.campaignId }, data: { tiles } });
      this.emitToCampaign(data.campaignId, 'tileUpdated', { x: data.x, y: data.y, tileType: data.tileType });
    }
  }
}
