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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcController = exports.CreateFullNpcDto = exports.CreateSimplifiedNpcDto = void 0;
const common_1 = require("@nestjs/common");
const npc_service_1 = require("./npc.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateSimplifiedNpcDto {
    campaignId;
    nome;
    hp;
    energia;
    bonusAtaque;
    defesa;
    danoFixo;
    tipoDano;
}
exports.CreateSimplifiedNpcDto = CreateSimplifiedNpcDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSimplifiedNpcDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSimplifiedNpcDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSimplifiedNpcDto.prototype, "hp", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSimplifiedNpcDto.prototype, "energia", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSimplifiedNpcDto.prototype, "bonusAtaque", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSimplifiedNpcDto.prototype, "defesa", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSimplifiedNpcDto.prototype, "danoFixo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TipoDano),
    __metadata("design:type", String)
], CreateSimplifiedNpcDto.prototype, "tipoDano", void 0);
class CreateFullNpcDto {
    campaignId;
    nome;
    hp;
    energia;
    nivel;
    maestriaBonus;
    attributes;
}
exports.CreateFullNpcDto = CreateFullNpcDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFullNpcDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFullNpcDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFullNpcDto.prototype, "hp", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFullNpcDto.prototype, "energia", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFullNpcDto.prototype, "nivel", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFullNpcDto.prototype, "maestriaBonus", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFullNpcDto.prototype, "attributes", void 0);
let NpcController = class NpcController {
    npcService;
    constructor(npcService) {
        this.npcService = npcService;
    }
    createSimplified(dto, user) {
        return this.npcService.createSimplified(dto.campaignId, dto, user.id);
    }
    createFull(dto, user) {
        return this.npcService.createFull(dto.campaignId, dto, user.id);
    }
    findByCampaign(campaignId) {
        return this.npcService.findByCampaign(campaignId);
    }
    findOne(id) {
        return this.npcService.findOne(id);
    }
    update(id, data, user) {
        return this.npcService.update(id, data, user.id);
    }
    delete(id, user) {
        return this.npcService.delete(id, user.id);
    }
};
exports.NpcController = NpcController;
__decorate([
    (0, common_1.Post)('simplified'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSimplifiedNpcDto, Object]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "createSimplified", null);
__decorate([
    (0, common_1.Post)('full'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFullNpcDto, Object]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "createFull", null);
__decorate([
    (0, common_1.Get)('campaign/:campaignId'),
    __param(0, (0, common_1.Param)('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "findByCampaign", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NpcController.prototype, "delete", null);
exports.NpcController = NpcController = __decorate([
    (0, common_1.Controller)('npcs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __metadata("design:paramtypes", [npc_service_1.NpcService])
], NpcController);
//# sourceMappingURL=npc.controller.js.map