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
exports.RollController = exports.RollWeaponAttackDto = exports.RollAttributeDto = exports.RollOpposedDto = exports.RollTechniqueDto = exports.RollSkillDto = void 0;
const common_1 = require("@nestjs/common");
const roll_service_1 = require("./roll.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class RollSkillDto {
    skillId;
    characterId;
    combatId;
    campaignId;
}
exports.RollSkillDto = RollSkillDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollSkillDto.prototype, "skillId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollSkillDto.prototype, "characterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollSkillDto.prototype, "combatId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollSkillDto.prototype, "campaignId", void 0);
class RollTechniqueDto {
    techniqueId;
    actorId;
    targetId;
    combatId;
    campaignId;
}
exports.RollTechniqueDto = RollTechniqueDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollTechniqueDto.prototype, "techniqueId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollTechniqueDto.prototype, "actorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollTechniqueDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollTechniqueDto.prototype, "combatId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollTechniqueDto.prototype, "campaignId", void 0);
class RollOpposedDto {
    attackerId;
    defenderId;
    atkAttr;
    defAttr;
    combatId;
    campaignId;
}
exports.RollOpposedDto = RollOpposedDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "attackerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "defenderId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "atkAttr", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "defAttr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "combatId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollOpposedDto.prototype, "campaignId", void 0);
class RollAttributeDto {
    characterId;
    attribute;
    combatId;
    campaignId;
}
exports.RollAttributeDto = RollAttributeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollAttributeDto.prototype, "characterId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    __metadata("design:type", String)
], RollAttributeDto.prototype, "attribute", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollAttributeDto.prototype, "combatId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollAttributeDto.prototype, "campaignId", void 0);
class RollWeaponAttackDto {
    characterId;
    weaponId;
    targetId;
    combatId;
    campaignId;
}
exports.RollWeaponAttackDto = RollWeaponAttackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollWeaponAttackDto.prototype, "characterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollWeaponAttackDto.prototype, "weaponId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollWeaponAttackDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollWeaponAttackDto.prototype, "combatId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RollWeaponAttackDto.prototype, "campaignId", void 0);
let RollController = class RollController {
    rollService;
    constructor(rollService) {
        this.rollService = rollService;
    }
    rollSkill(dto) {
        return this.rollService.rollSkill(dto.skillId, dto.characterId, dto.combatId, dto.campaignId);
    }
    rollTechnique(dto) {
        return this.rollService.rollTechnique(dto.techniqueId, dto.actorId, dto.targetId, dto.combatId, dto.campaignId);
    }
    rollInitiative(combatId) {
        return this.rollService.rollInitiative(combatId);
    }
    rollOpposed(dto) {
        return this.rollService.rollOpposed(dto.attackerId, dto.defenderId, dto.atkAttr, dto.defAttr, dto.combatId, dto.campaignId);
    }
    rollAttribute(dto) {
        return this.rollService.rollAttribute(dto.characterId, dto.attribute, dto.combatId, dto.campaignId);
    }
    rollWeaponAttack(dto) {
        return this.rollService.rollWeaponAttack(dto.characterId, dto.weaponId, dto.targetId, dto.combatId, dto.campaignId);
    }
};
exports.RollController = RollController;
__decorate([
    (0, common_1.Post)('skill'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollSkillDto]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollSkill", null);
__decorate([
    (0, common_1.Post)('technique'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollTechniqueDto]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollTechnique", null);
__decorate([
    (0, common_1.Post)('initiative/:combatId'),
    __param(0, (0, common_1.Param)('combatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollInitiative", null);
__decorate([
    (0, common_1.Post)('opposed'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollOpposedDto]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollOpposed", null);
__decorate([
    (0, common_1.Post)('attribute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollAttributeDto]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollAttribute", null);
__decorate([
    (0, common_1.Post)('weapon-attack'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RollWeaponAttackDto]),
    __metadata("design:returntype", void 0)
], RollController.prototype, "rollWeaponAttack", null);
exports.RollController = RollController = __decorate([
    (0, common_1.Controller)('roll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [roll_service_1.RollService])
], RollController);
//# sourceMappingURL=roll.controller.js.map