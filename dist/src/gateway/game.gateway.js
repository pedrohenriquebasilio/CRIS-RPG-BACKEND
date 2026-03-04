"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GameGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let GameGateway = GameGateway_1 = class GameGateway {
    jwtService;
    prisma;
    server;
    logger = new common_1.Logger(GameGateway_1.name);
    connectedUsers = new Map();
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async handleConnection(client) {
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
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinCampaign(client, data) {
        const user = this.connectedUsers.get(client.id);
        if (!user)
            return;
        const roomName = `campaign:${data.campaignId}`;
        client.join(roomName);
        user.campaignId = data.campaignId;
        this.connectedUsers.set(client.id, user);
        this.logger.log(`User ${user.userId} joined campaign room ${data.campaignId}`);
        client.emit('joinedCampaign', { campaignId: data.campaignId });
    }
    async handleLeaveCampaign(client, data) {
        const roomName = `campaign:${data.campaignId}`;
        client.leave(roomName);
    }
    emitToCampaign(campaignId, event, data) {
        this.server.to(`campaign:${campaignId}`).emit(event, data);
    }
    emitCombatUpdate(campaignId, combatData) {
        this.emitToCampaign(campaignId, 'combatUpdate', combatData);
    }
    emitCombatLog(campaignId, logEntry) {
        this.emitToCampaign(campaignId, 'newCombatLog', logEntry);
    }
    emitLevelUp(campaignId, characterData) {
        this.emitToCampaign(campaignId, 'levelUp', characterData);
    }
    emitCharacterUpdate(campaignId, characterData) {
        this.emitToCampaign(campaignId, 'characterUpdate', characterData);
    }
    emitMasterShieldUpdate(campaignId, shieldData) {
        this.emitToCampaign(campaignId, 'masterShieldUpdate', shieldData);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinCampaign'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleJoinCampaign", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveCampaign'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleLeaveCampaign", null);
exports.GameGateway = GameGateway = GameGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        namespace: '/game',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map