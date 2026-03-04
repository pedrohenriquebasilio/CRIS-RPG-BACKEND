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
exports.TechniqueTemplateController = void 0;
const common_1 = require("@nestjs/common");
const technique_template_service_1 = require("./technique-template.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDto {
    nome;
    nivel;
    atributoBase;
    custoEnergia;
    tipoDano;
    cd;
    descricaoLivre;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateDto.prototype, "nivel", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Atributo),
    __metadata("design:type", String)
], CreateDto.prototype, "atributoBase", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateDto.prototype, "custoEnergia", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TipoDano),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDto.prototype, "tipoDano", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDto.prototype, "cd", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDto.prototype, "descricaoLivre", void 0);
let TechniqueTemplateController = class TechniqueTemplateController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    delete(id) {
        return this.service.delete(id);
    }
};
exports.TechniqueTemplateController = TechniqueTemplateController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TechniqueTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDto, Object]),
    __metadata("design:returntype", void 0)
], TechniqueTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechniqueTemplateController.prototype, "delete", null);
exports.TechniqueTemplateController = TechniqueTemplateController = __decorate([
    (0, common_1.Controller)('technique-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [technique_template_service_1.TechniqueTemplateService])
], TechniqueTemplateController);
//# sourceMappingURL=technique-template.controller.js.map