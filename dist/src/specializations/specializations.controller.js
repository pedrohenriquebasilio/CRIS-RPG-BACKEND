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
exports.SpecializationsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SpecializationsController = class SpecializationsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.specialization.findMany({
            include: {
                abilities: { orderBy: { nivelRequerido: 'asc' } },
            },
            orderBy: { nome: 'asc' },
        });
    }
    async findOne(id) {
        const spec = await this.prisma.specialization.findUnique({
            where: { id },
            include: {
                abilities: { orderBy: { nivelRequerido: 'asc' } },
                _count: { select: { characters: true } },
            },
        });
        if (!spec)
            throw new common_1.NotFoundException('Specialization not found');
        return spec;
    }
    async getAbilities(id, nivel) {
        const spec = await this.prisma.specialization.findUnique({ where: { id } });
        if (!spec)
            throw new common_1.NotFoundException('Specialization not found');
        const where = { specializationId: id };
        if (nivel) {
            where.nivelRequerido = { lte: parseInt(nivel, 10) };
        }
        return this.prisma.specializationAbility.findMany({
            where,
            orderBy: { nivelRequerido: 'asc' },
        });
    }
    async getAbilitiesAtLevel(id, nivel) {
        const spec = await this.prisma.specialization.findUnique({ where: { id } });
        if (!spec)
            throw new common_1.NotFoundException('Specialization not found');
        return this.prisma.specializationAbility.findMany({
            where: { specializationId: id, nivelRequerido: parseInt(nivel, 10) },
            orderBy: { nivelRequerido: 'asc' },
        });
    }
};
exports.SpecializationsController = SpecializationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecializationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecializationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/abilities'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('nivel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecializationsController.prototype, "getAbilities", null);
__decorate([
    (0, common_1.Get)(':id/abilities/at-level/:nivel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('nivel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecializationsController.prototype, "getAbilitiesAtLevel", null);
exports.SpecializationsController = SpecializationsController = __decorate([
    (0, common_1.Controller)('specializations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecializationsController);
//# sourceMappingURL=specializations.controller.js.map