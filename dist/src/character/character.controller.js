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
exports.CharacterController = exports.UpdateSkillDto = exports.UpdateClassOriginDto = exports.UpdateAttributesDto = exports.UpdateStatsDto = exports.DistributeAttributeDto = exports.GrantXpDto = exports.AddWeaponDto = exports.AddTechniqueDto = exports.CreateCharacterDto = void 0;
const common_1 = require("@nestjs/common");
const character_service_1 = require("./character.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateCharacterDto {
    campaignId;
    nome;
    specializationId;
    attributes;
    isMob;
}
exports.CreateCharacterDto = CreateCharacterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCharacterDto.prototype, "specializationId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCharacterDto.prototype, "attributes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCharacterDto.prototype, "isMob", void 0);
class AddTechniqueDto {
    nome;
    nivel;
    custoEnergia;
    atributoBase;
    descricaoLivre = '';
    tipoDano;
}
exports.AddTechniqueDto = AddTechniqueDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTechniqueDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], AddTechniqueDto.prototype, "nivel", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AddTechniqueDto.prototype, "custoEnergia", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    __metadata("design:type", String)
], AddTechniqueDto.prototype, "atributoBase", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddTechniqueDto.prototype, "descricaoLivre", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['FISICO', 'ENERGETICO', 'MENTAL', 'ESPIRITUAL']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddTechniqueDto.prototype, "tipoDano", void 0);
class AddWeaponDto {
    nome;
    skillId;
    damageDice;
    damageType;
    threatRange;
    criticalMultiplier;
}
exports.AddWeaponDto = AddWeaponDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddWeaponDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddWeaponDto.prototype, "skillId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddWeaponDto.prototype, "damageDice", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TipoDano),
    __metadata("design:type", String)
], AddWeaponDto.prototype, "damageType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddWeaponDto.prototype, "threatRange", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddWeaponDto.prototype, "criticalMultiplier", void 0);
class GrantXpDto {
    amount;
    combatId;
}
exports.GrantXpDto = GrantXpDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GrantXpDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GrantXpDto.prototype, "combatId", void 0);
class DistributeAttributeDto {
    attribute;
}
exports.DistributeAttributeDto = DistributeAttributeDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    __metadata("design:type", String)
], DistributeAttributeDto.prototype, "attribute", void 0);
class UpdateStatsDto {
    hpAtual;
    hpMax;
    energiaAtual;
    energiaMax;
    maestriaBonus;
}
exports.UpdateStatsDto = UpdateStatsDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "hpAtual", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "hpMax", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "energiaAtual", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "energiaMax", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStatsDto.prototype, "maestriaBonus", void 0);
class UpdateAttributesDto {
    FOR;
    AGI;
    VIG;
    INT;
    PRE;
}
exports.UpdateAttributesDto = UpdateAttributesDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttributesDto.prototype, "FOR", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttributesDto.prototype, "AGI", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttributesDto.prototype, "VIG", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttributesDto.prototype, "INT", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateAttributesDto.prototype, "PRE", void 0);
class UpdateClassOriginDto {
    specializationId;
    origemId;
}
exports.UpdateClassOriginDto = UpdateClassOriginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClassOriginDto.prototype, "specializationId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateClassOriginDto.prototype, "origemId", void 0);
class UpdateSkillDto {
    treinada;
    pontosInvestidos;
    skillName;
}
exports.UpdateSkillDto = UpdateSkillDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSkillDto.prototype, "treinada", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSkillDto.prototype, "pontosInvestidos", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSkillDto.prototype, "skillName", void 0);
let CharacterController = class CharacterController {
    characterService;
    constructor(characterService) {
        this.characterService = characterService;
    }
    create(dto, user) {
        return this.characterService.create({
            campaignId: dto.campaignId,
            userId: user.id,
            nome: dto.nome,
            specializationId: dto.specializationId,
            attributes: dto.attributes,
            isMob: dto.isMob,
            requestingUserRole: user.role,
        });
    }
    findByCampaign(campaignId) {
        return this.characterService.findByCampaign(campaignId);
    }
    findOne(id) {
        return this.characterService.findOne(id);
    }
    addSkill(id, skillId, user) {
        return this.characterService.addSkill(id, skillId, user.id);
    }
    trainSkill(id, skillId, user) {
        return this.characterService.trainSkill(id, skillId, user.id);
    }
    addAptitude(id, aptitudeId, user) {
        return this.characterService.addAptitude(id, aptitudeId, user.id);
    }
    addTechnique(id, dto, user) {
        return this.characterService.addTechnique(id, dto, user.id);
    }
    updateTechnique(id, techniqueId, data, user) {
        return this.characterService.updateTechnique(id, techniqueId, data, user.id);
    }
    addWeapon(id, dto, user) {
        return this.characterService.addWeapon(id, dto, user.id);
    }
    updateWeapon(id, weaponId, data, user) {
        return this.characterService.updateWeapon(id, weaponId, data, user.id);
    }
    deleteWeapon(id, weaponId, user) {
        return this.characterService.deleteWeapon(id, weaponId, user.id);
    }
    deactivate(id, user) {
        return this.characterService.deactivate(id, user.id);
    }
    distributeAttribute(id, dto, user) {
        return this.characterService.distributeAttribute(id, dto.attribute, user.id);
    }
    updateNome(id, nome, user) {
        return this.characterService.updateNome(id, user.id, nome);
    }
    updateStats(id, dto, user) {
        return this.characterService.updateStats(id, user.id, dto);
    }
    updateAttributes(id, dto, user) {
        return this.characterService.updateAttributes(id, user.id, dto);
    }
    updateClassOrigin(id, dto, user) {
        return this.characterService.updateClassOrigin(id, user.id, dto);
    }
    updateSkillByName(id, dto, user) {
        if (!dto.skillName)
            throw new Error('skillName is required');
        return this.characterService.updateSkillByName(id, dto.skillName, user.id, {
            treinada: dto.treinada,
            pontosInvestidos: dto.pontosInvestidos,
        });
    }
    grantXp(id, dto, user) {
        return this.characterService.grantXp(id, dto.amount, user.id, dto.combatId);
    }
};
exports.CharacterController = CharacterController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCharacterDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('campaign/:campaignId'),
    __param(0, (0, common_1.Param)('campaignId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "findByCampaign", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/skills/:skillId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('skillId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "addSkill", null);
__decorate([
    (0, common_1.Patch)(':id/skills/:skillId/train'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('skillId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "trainSkill", null);
__decorate([
    (0, common_1.Post)(':id/aptitudes/:aptitudeId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('aptitudeId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "addAptitude", null);
__decorate([
    (0, common_1.Post)(':id/techniques'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddTechniqueDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "addTechnique", null);
__decorate([
    (0, common_1.Patch)(':id/techniques/:techniqueId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('techniqueId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateTechnique", null);
__decorate([
    (0, common_1.Post)(':id/weapons'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddWeaponDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "addWeapon", null);
__decorate([
    (0, common_1.Patch)(':id/weapons/:weaponId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('weaponId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateWeapon", null);
__decorate([
    (0, common_1.Delete)(':id/weapons/:weaponId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('weaponId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "deleteWeapon", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/attributes/distribute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DistributeAttributeDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "distributeAttribute", null);
__decorate([
    (0, common_1.Patch)(':id/nome'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('nome')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateNome", null);
__decorate([
    (0, common_1.Patch)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStatsDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateStats", null);
__decorate([
    (0, common_1.Patch)(':id/attributes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAttributesDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateAttributes", null);
__decorate([
    (0, common_1.Patch)(':id/class-origin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateClassOriginDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateClassOrigin", null);
__decorate([
    (0, common_1.Patch)(':id/skills/by-name'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSkillDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "updateSkillByName", null);
__decorate([
    (0, common_1.Post)(':id/xp'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.MASTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GrantXpDto, Object]),
    __metadata("design:returntype", void 0)
], CharacterController.prototype, "grantXp", null);
exports.CharacterController = CharacterController = __decorate([
    (0, common_1.Controller)('characters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [character_service_1.CharacterService])
], CharacterController);
//# sourceMappingURL=character.controller.js.map