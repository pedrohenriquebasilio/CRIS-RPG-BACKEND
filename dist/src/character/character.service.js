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
exports.CharacterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CharacterService = class CharacterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: data.campaignId } });
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        const isMob = data.isMob ?? false;
        if (isMob && data.requestingUserRole !== client_1.Role.MASTER) {
            throw new common_1.ForbiddenException('Only master can create mob characters');
        }
        if (!isMob) {
            const existing = await this.prisma.character.findFirst({
                where: {
                    campaignId: data.campaignId,
                    userId: data.userId,
                    isMob: false,
                    isActive: true,
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Player already has a character in this campaign');
            }
        }
        let hpMax = 6;
        let energiaMax = 3;
        if (data.specializationId) {
            const specialization = await this.prisma.specialization.findUnique({
                where: { id: data.specializationId },
            });
            if (!specialization)
                throw new common_1.NotFoundException('Specialization not found');
            hpMax = specialization.hpPorNivel;
            energiaMax = specialization.energiaPorNivel;
        }
        const attrs = data.attributes ?? {};
        const character = await this.prisma.character.create({
            data: {
                campaignId: data.campaignId,
                userId: data.userId,
                nome: data.nome,
                specializationId: data.specializationId ?? null,
                isMob,
                hpMax,
                hpAtual: hpMax,
                energiaMax,
                energiaAtual: energiaMax,
                isApproved: isMob,
                attributes: {
                    create: {
                        FOR: attrs.FOR ?? 0,
                        AGI: attrs.AGI ?? 0,
                        VIG: attrs.VIG ?? 0,
                        INT: attrs.INT ?? 0,
                        PRE: attrs.PRE ?? 0,
                    },
                },
            },
            include: {
                attributes: true,
                specialization: true,
                skills: { include: { skill: true } },
                aptitudes: { include: { aptitude: true } },
                techniques: true,
                weapons: { include: { skill: true } },
            },
        });
        return character;
    }
    async findByCampaign(campaignId) {
        return this.prisma.character.findMany({
            where: { campaignId, isActive: true },
            include: {
                user: { select: { id: true, email: true } },
                specialization: true,
                origemRelacao: true,
                attributes: true,
                skills: { include: { skill: true } },
                aptitudes: { include: { aptitude: true } },
                techniques: true,
                weapons: { include: { skill: true } },
            },
        });
    }
    async findOne(id) {
        const character = await this.prisma.character.findUnique({
            where: { id, isActive: true },
            include: {
                user: { select: { id: true, email: true } },
                specialization: {
                    include: { abilities: true },
                },
                origemRelacao: true,
                attributes: true,
                skills: { include: { skill: true } },
                aptitudes: { include: { aptitude: true } },
                techniques: true,
                weapons: { include: { skill: true } },
            },
        });
        if (!character)
            throw new common_1.NotFoundException('Character not found');
        return character;
    }
    async addSkill(characterId, skillId, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        return this.prisma.characterSkill.upsert({
            where: { characterId_skillId: { characterId, skillId } },
            update: {},
            create: { characterId, skillId },
            include: { skill: true },
        });
    }
    async trainSkill(characterId, skillId, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        const cs = await this.prisma.characterSkill.findUnique({
            where: { characterId_skillId: { characterId, skillId } },
        });
        if (!cs)
            throw new common_1.NotFoundException('Skill not added to character');
        return this.prisma.characterSkill.update({
            where: { characterId_skillId: { characterId, skillId } },
            data: { treinada: true },
            include: { skill: true },
        });
    }
    async addAptitude(characterId, aptitudeId, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        if (character.pendingAptidaoSlots <= 0) {
            throw new common_1.BadRequestException('No available aptitude slots');
        }
        const existing = await this.prisma.characterAptitude.findUnique({
            where: { characterId_aptitudeId: { characterId, aptitudeId } },
        });
        if (existing)
            throw new common_1.ConflictException('Aptitude already acquired');
        const aptitude = await this.prisma.aptitude.findUnique({ where: { id: aptitudeId } });
        if (!aptitude)
            throw new common_1.NotFoundException('Aptitude not found');
        const prerequisites = aptitude.prerequisitos;
        if (prerequisites.length > 0) {
            const owned = await this.prisma.characterAptitude.findMany({
                where: { characterId, aptitudeId: { in: prerequisites } },
            });
            if (owned.length < prerequisites.length) {
                throw new common_1.BadRequestException('Missing aptitude prerequisites');
            }
        }
        const [result] = await this.prisma.$transaction([
            this.prisma.characterAptitude.create({
                data: { characterId, aptitudeId, adquiridaNoNivel: character.nivel },
                include: { aptitude: true },
            }),
            this.prisma.character.update({
                where: { id: characterId },
                data: { pendingAptidaoSlots: { decrement: 1 } },
            }),
        ]);
        return result;
    }
    async addTechnique(characterId, techniqueData, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        if (techniqueData.nivel > character.nivel) {
            throw new common_1.BadRequestException('Technique level cannot exceed character level');
        }
        return this.prisma.technique.create({
            data: {
                characterId,
                nome: techniqueData.nome,
                nivel: techniqueData.nivel,
                custoEnergia: techniqueData.custoEnergia,
                atributoBase: techniqueData.atributoBase,
                descricaoLivre: techniqueData.descricaoLivre,
                tipoDano: techniqueData.tipoDano,
            },
        });
    }
    async updateTechnique(characterId, techniqueId, data, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        return this.prisma.technique.update({
            where: { id: techniqueId },
            data,
        });
    }
    async addWeapon(characterId, weaponData, userId) {
        const character = await this.checkOwnership(characterId, userId);
        await this.checkNotInActiveCombat(character.campaignId, userId);
        return this.prisma.weapon.create({
            data: {
                characterId,
                nome: weaponData.nome,
                skillId: weaponData.skillId,
                damageDice: weaponData.damageDice,
                damageType: weaponData.damageType,
                threatRange: weaponData.threatRange ?? 20,
                criticalMultiplier: weaponData.criticalMultiplier ?? 2,
            },
            include: { skill: true },
        });
    }
    async updateWeapon(characterId, weaponId, data, userId) {
        await this.checkOwnership(characterId, userId);
        return this.prisma.weapon.update({
            where: { id: weaponId },
            data,
            include: { skill: true },
        });
    }
    async deleteWeapon(characterId, weaponId, userId) {
        await this.checkOwnership(characterId, userId);
        return this.prisma.weapon.delete({ where: { id: weaponId } });
    }
    async distributeAttribute(characterId, attribute, userId) {
        const character = await this.checkOwnership(characterId, userId);
        if (character.pendingAtributoPoints <= 0) {
            throw new common_1.BadRequestException('No available attribute points');
        }
        const attrs = await this.prisma.characterAttribute.findUnique({
            where: { characterId },
        });
        const currentVal = attrs[attribute];
        const maxVal = 5 + Math.floor(character.nivel / 2);
        if (currentVal >= maxVal) {
            throw new common_1.BadRequestException(`Attribute ${attribute} is at maximum for current level`);
        }
        const [attrs2] = await this.prisma.$transaction([
            this.prisma.characterAttribute.update({
                where: { characterId },
                data: { [attribute]: { increment: 1 } },
            }),
            this.prisma.character.update({
                where: { id: characterId },
                data: { pendingAtributoPoints: { decrement: 1 } },
            }),
        ]);
        return attrs2;
    }
    async grantXp(characterId, amount, masterId, combatId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { campaign: true },
        });
        if (!character)
            throw new common_1.NotFoundException('Character not found');
        if (character.campaign.masterId !== masterId) {
            throw new common_1.ForbiddenException('Only master can grant XP');
        }
        const updated = await this.prisma.character.update({
            where: { id: characterId },
            data: { xpAtual: { increment: amount } },
        });
        if (combatId) {
            await this.prisma.combatLog.create({
                data: {
                    combatId,
                    campaignId: character.campaignId,
                    actor: 'Mestre',
                    actionType: 'XP',
                    target: character.nome,
                    details: { xpAmount: amount, newTotal: updated.xpAtual },
                },
            });
        }
        return this.checkLevelUp(characterId, masterId, combatId);
    }
    async checkLevelUp(characterId, masterId, combatId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { specialization: true },
        });
        if (!character)
            throw new common_1.NotFoundException('Character not found');
        const nextLevel = character.nivel + 1;
        const nextProg = await this.prisma.levelProgression.findUnique({
            where: { level: nextLevel },
        });
        if (!nextProg || character.xpAtual < nextProg.xpRequired) {
            return character;
        }
        const spec = character.specialization;
        const updates = {
            nivel: nextLevel,
            hpMax: { increment: spec ? spec.hpPorNivel : 0 },
            hpAtual: { increment: spec ? spec.hpPorNivel : 0 },
            energiaMax: { increment: spec ? spec.energiaPorNivel : 0 },
            energiaAtual: { increment: spec ? spec.energiaPorNivel : 0 },
            pendingAptidaoSlots: { increment: 1 },
        };
        if (nextProg.ganhoAtributo) {
            updates.pendingAtributoPoints = { increment: 1 };
        }
        if (nextProg.ganhoMaestria) {
            updates.maestriaBonus = { increment: 1 };
        }
        await this.prisma.character.update({
            where: { id: characterId },
            data: updates,
        });
        if (combatId) {
            await this.prisma.combatLog.create({
                data: {
                    combatId,
                    campaignId: character.campaignId,
                    actor: character.nome,
                    actionType: 'LEVELUP',
                    details: { nivelAnterior: character.nivel, novoNivel: nextLevel },
                },
            });
        }
        return this.checkLevelUp(characterId, masterId, combatId);
    }
    async deactivate(characterId, requestingUserId) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId, isActive: true },
            include: { campaign: true },
        });
        if (!character)
            throw new common_1.NotFoundException('Character not found');
        const user = await this.prisma.user.findUnique({ where: { id: requestingUserId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMaster = user.role === client_1.Role.MASTER && character.campaign.masterId === requestingUserId;
        const isOwner = character.userId === requestingUserId;
        if (!isMaster && !isOwner) {
            throw new common_1.ForbiddenException('Not authorized to delete this character');
        }
        return this.prisma.character.update({
            where: { id: characterId },
            data: { isActive: false },
            select: { id: true, nome: true, isActive: true },
        });
    }
    async updateNome(characterId, userId, nome) {
        await this.checkOwnership(characterId, userId);
        return this.prisma.character.update({
            where: { id: characterId },
            data: { nome: nome.trim() },
            select: { id: true, nome: true },
        });
    }
    async updateStats(characterId, userId, data) {
        await this.checkOwnership(characterId, userId);
        const update = {};
        if (data.hpAtual !== undefined)
            update.hpAtual = data.hpAtual;
        if (data.hpMax !== undefined)
            update.hpMax = data.hpMax;
        if (data.energiaAtual !== undefined)
            update.energiaAtual = data.energiaAtual;
        if (data.energiaMax !== undefined)
            update.energiaMax = data.energiaMax;
        if (data.maestriaBonus !== undefined)
            update.maestriaBonus = data.maestriaBonus;
        return this.prisma.character.update({
            where: { id: characterId },
            data: update,
            select: { id: true, hpAtual: true, hpMax: true, energiaAtual: true, energiaMax: true, maestriaBonus: true },
        });
    }
    async updateAttributes(characterId, userId, attrs) {
        await this.checkOwnership(characterId, userId);
        const data = {};
        if (attrs.FOR !== undefined)
            data.FOR = attrs.FOR;
        if (attrs.AGI !== undefined)
            data.AGI = attrs.AGI;
        if (attrs.VIG !== undefined)
            data.VIG = attrs.VIG;
        if (attrs.INT !== undefined)
            data.INT = attrs.INT;
        if (attrs.PRE !== undefined)
            data.PRE = attrs.PRE;
        return this.prisma.characterAttribute.update({
            where: { characterId },
            data,
        });
    }
    async updateSkillByName(characterId, skillName, userId, data) {
        await this.checkOwnership(characterId, userId);
        const skill = await this.prisma.skill.findFirst({ where: { nome: skillName } });
        if (!skill)
            throw new common_1.NotFoundException(`Skill not found: ${skillName}`);
        const pontos = data.pontosInvestidos ?? 0;
        const treinada = data.treinada !== undefined ? data.treinada : pontos > 0;
        return this.prisma.characterSkill.upsert({
            where: { characterId_skillId: { characterId, skillId: skill.id } },
            update: { treinada, pontosInvestidos: pontos },
            create: { characterId, skillId: skill.id, treinada, pontosInvestidos: pontos },
            include: { skill: true },
        });
    }
    async updateClassOrigin(characterId, userId, data) {
        await this.checkOwnership(characterId, userId);
        const attrBonuses = { FOR: 0, AGI: 0, VIG: 0, INT: 0, PRE: 0 };
        const specId = data.specializationId;
        const origId = data.origemId;
        if (specId) {
            const spec = await this.prisma.specialization.findUnique({ where: { id: specId } });
            if (!spec)
                throw new common_1.NotFoundException('Specialization not found');
            const bonus = spec.bonusAtributos;
            for (const key of Object.keys(attrBonuses)) {
                attrBonuses[key] += bonus[key] ?? 0;
            }
        }
        else {
            const char = await this.prisma.character.findUnique({
                where: { id: characterId },
                include: { specialization: true },
            });
            if (char?.specialization) {
                const bonus = char.specialization.bonusAtributos;
                for (const key of Object.keys(attrBonuses)) {
                    attrBonuses[key] += bonus[key] ?? 0;
                }
            }
        }
        if (origId) {
            const origem = await this.prisma.origem.findUnique({ where: { id: origId } });
            if (!origem)
                throw new common_1.NotFoundException('Origem not found');
            const bonus = origem.bonusAtributos;
            for (const key of Object.keys(attrBonuses)) {
                attrBonuses[key] += bonus[key] ?? 0;
            }
        }
        else {
            const char = await this.prisma.character.findUnique({
                where: { id: characterId },
                include: { origemRelacao: true },
            });
            if (char?.origemRelacao) {
                const bonus = char.origemRelacao.bonusAtributos;
                for (const key of Object.keys(attrBonuses)) {
                    attrBonuses[key] += bonus[key] ?? 0;
                }
            }
        }
        const updateData = {};
        if (specId)
            updateData.specializationId = specId;
        if (origId)
            updateData.origemId = origId;
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: { specialization: true },
        });
        const resolvedSpecId = specId ?? character?.specializationId;
        if (resolvedSpecId) {
            const spec = await this.prisma.specialization.findUnique({ where: { id: resolvedSpecId } });
            if (spec && character) {
                updateData.hpMax = spec.hpPorNivel * character.nivel;
                updateData.energiaMax = spec.energiaPorNivel * character.nivel;
                if (character.hpAtual > updateData.hpMax)
                    updateData.hpAtual = updateData.hpMax;
                if (character.energiaAtual > updateData.energiaMax)
                    updateData.energiaAtual = updateData.energiaMax;
            }
        }
        await this.prisma.character.update({
            where: { id: characterId },
            data: updateData,
        });
        await this.prisma.characterAttribute.update({
            where: { characterId },
            data: attrBonuses,
        });
        return this.findOne(characterId);
    }
    async checkOwnership(characterId, userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const character = await this.prisma.character.findUnique({
            where: { id: characterId, isActive: true },
            include: { campaign: true },
        });
        if (!character)
            throw new common_1.NotFoundException('Character not found');
        if (user.role === client_1.Role.MASTER && character.campaign.masterId === userId) {
            return character;
        }
        if (character.userId !== userId) {
            throw new common_1.ForbiddenException('Not your character');
        }
        return character;
    }
    async checkNotInActiveCombat(campaignId, userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.role === client_1.Role.MASTER)
            return;
        const activeCombat = await this.prisma.combat.findFirst({
            where: {
                campaignId,
                state: { notIn: ['IDLE', 'COMBAT_FINISHED'] },
            },
        });
        if (activeCombat) {
            throw new common_1.ForbiddenException('Cannot edit character during active combat');
        }
    }
};
exports.CharacterService = CharacterService;
exports.CharacterService = CharacterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CharacterService);
//# sourceMappingURL=character.service.js.map