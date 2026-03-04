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
}
