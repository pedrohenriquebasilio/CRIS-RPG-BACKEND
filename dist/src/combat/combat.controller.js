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
exports.CombatController = exports.ReorderParticipantDto = exports.ForceTestDto = exports.ApplyConditionDto = exports.ApplyDamageDto = exports.AddParticipantDto = exports.CreateCombatDto = void 0;
const common_1 = require("@nestjs/common");
const combat_service_1 = require("./combat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateCombatDto {
    campaignId;
}
exports.CreateCombatDto = CreateCombatDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCombatDto.prototype, "campaignId", void 0);
class AddParticipantDto {
    characterId;
    npcId;
}
exports.AddParticipantDto = AddParticipantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "characterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "npcId", void 0);
class ApplyDamageDto {
    damage;
    tipoDano;
    source;
}
exports.ApplyDamageDto = ApplyDamageDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ApplyDamageDto.prototype, "damage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TipoDano),
    __metadata("design:type", String)
], ApplyDamageDto.prototype, "tipoDano", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyDamageDto.prototype, "source", void 0);
class ApplyConditionDto {
    conditionId;
}
exports.ApplyConditionDto = ApplyConditionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplyConditionDto.prototype, "conditionId", void 0);
class ForceTestDto {
    characterId;
    skillId;
}
exports.ForceTestDto = ForceTestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForceTestDto.prototype, "characterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForceTestDto.prototype, "skillId", void 0);
class ReorderParticipantDto {
    newOrder;
}
exports.ReorderParticipantDto = ReorderParticipantDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ReorderParticipantDto.prototype, "newOrder", void 0);
let CombatController = class CombatController {
    combatService;
    constructor(combatService) {
        this.combatService = combatService;
    }
    create(dto, user) {
        return this.combatService.createCombat(dto.campaignId, user.id);
    }
    getState(id) {
        return this.combatService.getCombatState(id);
    }
    getLogs(id) {
        return this.combatService.getCombatLogs(id);
    }
    addParticipant(id, dto, user) {
        return this.combatService.addParticipant(id, dto, user.id);
    }
    rollInitiative(id, user) {
        return this.combatService.rollInitiative(id, user.id);
    }
    startRound(id, user) {
        return this.combatService.startRound(id, user.id);
    }
    nextTurn(id, user) {
        return this.combatService.nextTurn(id, user.id);
    }
    skipTurn(id, user) {
        return this.combatService.skipTurn(id, user.id);
    }
    reorderParticipant(id, participantId, dto, user) {
        return this.combatService.reorderParticipant(id, participantId, dto.newOrder, user.id);
    }
    applyDamage(id, participantId, dto, user) {
        return this.combatService.applyDamage(id, participantId, dto.damage, dto.tipoDano, user.id, dto.source);
    }
    applyCondition(id, participantId, dto, user) {
        return this.combatService.applyCondition(id, participantId, dto.conditionId, user.id);
    }
    forceTest(id, dto, user) {
        return this.combatService.forceTest(id, dto.characterId, dto.skillId, user.id);
    }
    finish(id, user) {
        return this.combatService.finishCombat(id, user.id);
    }
};
exports.CombatController = CombatController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCombatDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "getState", null);
__decorate([
    (0, common_1.Get)(':id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Post)(':id/participants'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddParticipantDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Post)(':id/initiative'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "rollInitiative", null);
__decorate([
    (0, common_1.Post)(':id/round/start'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "startRound", null);
__decorate([
    (0, common_1.Post)(':id/round/next-turn'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "nextTurn", null);
__decorate([
    (0, common_1.Post)(':id/round/skip'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "skipTurn", null);
__decorate([
    (0, common_1.Patch)(':id/participants/:participantId/reorder'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('participantId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ReorderParticipantDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "reorderParticipant", null);
__decorate([
    (0, common_1.Post)(':id/participants/:participantId/damage'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('participantId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ApplyDamageDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "applyDamage", null);
__decorate([
    (0, common_1.Post)(':id/participants/:participantId/conditions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('participantId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ApplyConditionDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "applyCondition", null);
__decorate([
    (0, common_1.Post)(':id/force-test'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ForceTestDto, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "forceTest", null);
__decorate([
    (0, common_1.Post)(':id/finish'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CombatController.prototype, "finish", null);
exports.CombatController = CombatController = __decorate([
    (0, common_1.Controller)('combats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [combat_service_1.CombatService])
], CombatController);
//# sourceMappingURL=combat.controller.js.map