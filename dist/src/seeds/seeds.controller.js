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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SeedsController = class SeedsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getSpecializations() {
        return this.prisma.specialization.findMany({ include: { abilities: true } });
    }
    getSkills() {
        return this.prisma.skill.findMany();
    }
    getAptitudes() {
        return this.prisma.aptitude.findMany();
    }
    getConditions() {
        return this.prisma.condition.findMany();
    }
    getLevelProgression() {
        return this.prisma.levelProgression.findMany({ orderBy: { level: 'asc' } });
    }
    getWeaponTemplates() {
        return this.prisma.weaponTemplate.findMany({ orderBy: { categoria: 'asc' } });
    }
    getOrigens() {
        return this.prisma.origem.findMany({ orderBy: { nome: 'asc' } });
    }
};
exports.SeedsController = SeedsController;
__decorate([
    (0, common_1.Get)('specializations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getSpecializations", null);
__decorate([
    (0, common_1.Get)('skills'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getSkills", null);
__decorate([
    (0, common_1.Get)('aptitudes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getAptitudes", null);
__decorate([
    (0, common_1.Get)('conditions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getConditions", null);
__decorate([
    (0, common_1.Get)('level-progression'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getLevelProgression", null);
__decorate([
    (0, common_1.Get)('weapon-templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getWeaponTemplates", null);
__decorate([
    (0, common_1.Get)('origens'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeedsController.prototype, "getOrigens", null);
exports.SeedsController = SeedsController = __decorate([
    (0, common_1.Controller)('seeds'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedsController);
//# sourceMappingURL=seeds.controller.js.map