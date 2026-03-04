import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinCampaign(client: Socket, data: {
        campaignId: string;
    }): Promise<void>;
    handleLeaveCampaign(client: Socket, data: {
        campaignId: string;
    }): Promise<void>;
    emitToCampaign(campaignId: string, event: string, data: any): void;
    emitCombatUpdate(campaignId: string, combatData: any): void;
    emitCombatLog(campaignId: string, logEntry: any): void;
    emitLevelUp(campaignId: string, characterData: any): void;
    emitCharacterUpdate(campaignId: string, characterData: any): void;
    emitMasterShieldUpdate(campaignId: string, shieldData: any): void;
}
