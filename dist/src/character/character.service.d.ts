import { PrismaService } from '../prisma/prisma.service';
import { Atributo, Role, TipoDano } from '@prisma/client';
export declare class CharacterService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        campaignId: string;
        userId: string;
        nome: string;
        specializationId?: string;
        attributes?: Record<string, number>;
        isMob?: boolean;
        requestingUserRole?: Role;
    }): Promise<{
        specialization: {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            hpPorNivel: number;
            energiaPorNivel: number;
            habilidadesTreinadas: string[];
        } | null;
        weapons: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            } | null;
        } & {
            id: string;
            nome: string;
            damageType: import("@prisma/client").$Enums.TipoDano;
            damageDice: string;
            threatRange: number;
            criticalMultiplier: number;
            createdAt: Date;
            characterId: string;
            skillId: string | null;
        })[];
        attributes: {
            id: string;
            FOR: number;
            AGI: number;
            VIG: number;
            INT: number;
            PRE: number;
            characterId: string;
        } | null;
        skills: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            };
        } & {
            id: string;
            characterId: string;
            skillId: string;
            treinada: boolean;
            pontosInvestidos: number;
        })[];
        aptitudes: ({
            aptitude: {
                id: string;
                nome: string;
                descricao: string;
                prerequisitos: import("@prisma/client/runtime/client").JsonValue;
                modificadores: import("@prisma/client/runtime/client").JsonValue;
            };
        } & {
            id: string;
            characterId: string;
            aptitudeId: string;
            adquiridaNoNivel: number;
        })[];
        techniques: {
            id: string;
            nome: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            tipoDano: import("@prisma/client").$Enums.TipoDano | null;
            createdAt: Date;
            nivel: number;
            characterId: string;
            custoEnergia: number;
            descricaoLivre: string;
        }[];
    } & {
        id: string;
        nome: string;
        specializationId: string | null;
        createdAt: Date;
        isActive: boolean;
        campaignId: string;
        userId: string;
        origemId: string | null;
        nivel: number;
        xpAtual: number;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
        isApproved: boolean;
        isMob: boolean;
        pendingAptidaoSlots: number;
        pendingAtributoPoints: number;
    }>;
    findByCampaign(campaignId: string): Promise<({
        specialization: {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            hpPorNivel: number;
            energiaPorNivel: number;
            habilidadesTreinadas: string[];
        } | null;
        weapons: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            } | null;
        } & {
            id: string;
            nome: string;
            damageType: import("@prisma/client").$Enums.TipoDano;
            damageDice: string;
            threatRange: number;
            criticalMultiplier: number;
            createdAt: Date;
            characterId: string;
            skillId: string | null;
        })[];
        user: {
            id: string;
            email: string;
        };
        attributes: {
            id: string;
            FOR: number;
            AGI: number;
            VIG: number;
            INT: number;
            PRE: number;
            characterId: string;
        } | null;
        origemRelacao: {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            habilidadesTreinadas: string[];
            descricao: string;
        } | null;
        skills: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            };
        } & {
            id: string;
            characterId: string;
            skillId: string;
            treinada: boolean;
            pontosInvestidos: number;
        })[];
        aptitudes: ({
            aptitude: {
                id: string;
                nome: string;
                descricao: string;
                prerequisitos: import("@prisma/client/runtime/client").JsonValue;
                modificadores: import("@prisma/client/runtime/client").JsonValue;
            };
        } & {
            id: string;
            characterId: string;
            aptitudeId: string;
            adquiridaNoNivel: number;
        })[];
        techniques: {
            id: string;
            nome: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            tipoDano: import("@prisma/client").$Enums.TipoDano | null;
            createdAt: Date;
            nivel: number;
            characterId: string;
            custoEnergia: number;
            descricaoLivre: string;
        }[];
    } & {
        id: string;
        nome: string;
        specializationId: string | null;
        createdAt: Date;
        isActive: boolean;
        campaignId: string;
        userId: string;
        origemId: string | null;
        nivel: number;
        xpAtual: number;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
        isApproved: boolean;
        isMob: boolean;
        pendingAptidaoSlots: number;
        pendingAtributoPoints: number;
    })[]>;
    findOne(id: string): Promise<{
        specialization: ({
            abilities: {
                id: string;
                nome: string;
                nivelRequerido: number;
                tipo: string;
                custo: string;
                alcance: string;
                duracao: string;
                descricao: string;
                specializationId: string;
            }[];
        } & {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            hpPorNivel: number;
            energiaPorNivel: number;
            habilidadesTreinadas: string[];
        }) | null;
        weapons: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            } | null;
        } & {
            id: string;
            nome: string;
            damageType: import("@prisma/client").$Enums.TipoDano;
            damageDice: string;
            threatRange: number;
            criticalMultiplier: number;
            createdAt: Date;
            characterId: string;
            skillId: string | null;
        })[];
        user: {
            id: string;
            email: string;
        };
        attributes: {
            id: string;
            FOR: number;
            AGI: number;
            VIG: number;
            INT: number;
            PRE: number;
            characterId: string;
        } | null;
        origemRelacao: {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            habilidadesTreinadas: string[];
            descricao: string;
        } | null;
        skills: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            };
        } & {
            id: string;
            characterId: string;
            skillId: string;
            treinada: boolean;
            pontosInvestidos: number;
        })[];
        aptitudes: ({
            aptitude: {
                id: string;
                nome: string;
                descricao: string;
                prerequisitos: import("@prisma/client/runtime/client").JsonValue;
                modificadores: import("@prisma/client/runtime/client").JsonValue;
            };
        } & {
            id: string;
            characterId: string;
            aptitudeId: string;
            adquiridaNoNivel: number;
        })[];
        techniques: {
            id: string;
            nome: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            tipoDano: import("@prisma/client").$Enums.TipoDano | null;
            createdAt: Date;
            nivel: number;
            characterId: string;
            custoEnergia: number;
            descricaoLivre: string;
        }[];
    } & {
        id: string;
        nome: string;
        specializationId: string | null;
        createdAt: Date;
        isActive: boolean;
        campaignId: string;
        userId: string;
        origemId: string | null;
        nivel: number;
        xpAtual: number;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
        isApproved: boolean;
        isMob: boolean;
        pendingAptidaoSlots: number;
        pendingAtributoPoints: number;
    }>;
    addSkill(characterId: string, skillId: string, userId: string): Promise<{
        skill: {
            id: string;
            nome: string;
            descricao: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            permiteMaestria: boolean;
        };
    } & {
        id: string;
        characterId: string;
        skillId: string;
        treinada: boolean;
        pontosInvestidos: number;
    }>;
    trainSkill(characterId: string, skillId: string, userId: string): Promise<{
        skill: {
            id: string;
            nome: string;
            descricao: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            permiteMaestria: boolean;
        };
    } & {
        id: string;
        characterId: string;
        skillId: string;
        treinada: boolean;
        pontosInvestidos: number;
    }>;
    addAptitude(characterId: string, aptitudeId: string, userId: string): Promise<{
        aptitude: {
            id: string;
            nome: string;
            descricao: string;
            prerequisitos: import("@prisma/client/runtime/client").JsonValue;
            modificadores: import("@prisma/client/runtime/client").JsonValue;
        };
    } & {
        id: string;
        characterId: string;
        aptitudeId: string;
        adquiridaNoNivel: number;
    }>;
    addTechnique(characterId: string, techniqueData: {
        nome: string;
        nivel: number;
        custoEnergia: number;
        atributoBase: Atributo;
        descricaoLivre: string;
        tipoDano?: string;
    }, userId: string): Promise<{
        id: string;
        nome: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        tipoDano: import("@prisma/client").$Enums.TipoDano | null;
        createdAt: Date;
        nivel: number;
        characterId: string;
        custoEnergia: number;
        descricaoLivre: string;
    }>;
    updateTechnique(characterId: string, techniqueId: string, data: Partial<{
        nome: string;
        nivel: number;
        custoEnergia: number;
        descricaoLivre: string;
    }>, userId: string): Promise<{
        id: string;
        nome: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        tipoDano: import("@prisma/client").$Enums.TipoDano | null;
        createdAt: Date;
        nivel: number;
        characterId: string;
        custoEnergia: number;
        descricaoLivre: string;
    }>;
    addWeapon(characterId: string, weaponData: {
        nome: string;
        skillId?: string;
        damageDice: string;
        damageType: TipoDano;
        threatRange?: number;
        criticalMultiplier?: number;
    }, userId: string): Promise<{
        skill: {
            id: string;
            nome: string;
            descricao: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            permiteMaestria: boolean;
        } | null;
    } & {
        id: string;
        nome: string;
        damageType: import("@prisma/client").$Enums.TipoDano;
        damageDice: string;
        threatRange: number;
        criticalMultiplier: number;
        createdAt: Date;
        characterId: string;
        skillId: string | null;
    }>;
    updateWeapon(characterId: string, weaponId: string, data: Partial<{
        nome: string;
        skillId: string;
        damageDice: string;
        damageType: TipoDano;
        threatRange: number;
        criticalMultiplier: number;
    }>, userId: string): Promise<{
        skill: {
            id: string;
            nome: string;
            descricao: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            permiteMaestria: boolean;
        } | null;
    } & {
        id: string;
        nome: string;
        damageType: import("@prisma/client").$Enums.TipoDano;
        damageDice: string;
        threatRange: number;
        criticalMultiplier: number;
        createdAt: Date;
        characterId: string;
        skillId: string | null;
    }>;
    deleteWeapon(characterId: string, weaponId: string, userId: string): Promise<{
        id: string;
        nome: string;
        damageType: import("@prisma/client").$Enums.TipoDano;
        damageDice: string;
        threatRange: number;
        criticalMultiplier: number;
        createdAt: Date;
        characterId: string;
        skillId: string | null;
    }>;
    distributeAttribute(characterId: string, attribute: Atributo, userId: string): Promise<{
        id: string;
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
        characterId: string;
    }>;
    grantXp(characterId: string, amount: number, masterId: string, combatId?: string): Promise<any>;
    checkLevelUp(characterId: string, masterId?: string, combatId?: string): any;
    deactivate(characterId: string, requestingUserId: string): Promise<{
        id: string;
        nome: string;
        isActive: boolean;
    }>;
    updateNome(characterId: string, userId: string, nome: string): Promise<{
        id: string;
        nome: string;
    }>;
    updateStats(characterId: string, userId: string, data: {
        hpAtual?: number;
        hpMax?: number;
        energiaAtual?: number;
        energiaMax?: number;
        maestriaBonus?: number;
    }): Promise<{
        id: string;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
    }>;
    updateAttributes(characterId: string, userId: string, attrs: {
        FOR?: number;
        AGI?: number;
        VIG?: number;
        INT?: number;
        PRE?: number;
    }): Promise<{
        id: string;
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
        characterId: string;
    }>;
    updateSkillByName(characterId: string, skillName: string, userId: string, data: {
        treinada?: boolean;
        pontosInvestidos?: number;
    }): Promise<{
        skill: {
            id: string;
            nome: string;
            descricao: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            permiteMaestria: boolean;
        };
    } & {
        id: string;
        characterId: string;
        skillId: string;
        treinada: boolean;
        pontosInvestidos: number;
    }>;
    updateClassOrigin(characterId: string, userId: string, data: {
        specializationId?: string;
        origemId?: string;
    }): Promise<{
        specialization: ({
            abilities: {
                id: string;
                nome: string;
                nivelRequerido: number;
                tipo: string;
                custo: string;
                alcance: string;
                duracao: string;
                descricao: string;
                specializationId: string;
            }[];
        } & {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            hpPorNivel: number;
            energiaPorNivel: number;
            habilidadesTreinadas: string[];
        }) | null;
        weapons: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            } | null;
        } & {
            id: string;
            nome: string;
            damageType: import("@prisma/client").$Enums.TipoDano;
            damageDice: string;
            threatRange: number;
            criticalMultiplier: number;
            createdAt: Date;
            characterId: string;
            skillId: string | null;
        })[];
        user: {
            id: string;
            email: string;
        };
        attributes: {
            id: string;
            FOR: number;
            AGI: number;
            VIG: number;
            INT: number;
            PRE: number;
            characterId: string;
        } | null;
        origemRelacao: {
            bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            nome: string;
            habilidadesTreinadas: string[];
            descricao: string;
        } | null;
        skills: ({
            skill: {
                id: string;
                nome: string;
                descricao: string;
                atributoBase: import("@prisma/client").$Enums.Atributo;
                permiteMaestria: boolean;
            };
        } & {
            id: string;
            characterId: string;
            skillId: string;
            treinada: boolean;
            pontosInvestidos: number;
        })[];
        aptitudes: ({
            aptitude: {
                id: string;
                nome: string;
                descricao: string;
                prerequisitos: import("@prisma/client/runtime/client").JsonValue;
                modificadores: import("@prisma/client/runtime/client").JsonValue;
            };
        } & {
            id: string;
            characterId: string;
            aptitudeId: string;
            adquiridaNoNivel: number;
        })[];
        techniques: {
            id: string;
            nome: string;
            atributoBase: import("@prisma/client").$Enums.Atributo;
            tipoDano: import("@prisma/client").$Enums.TipoDano | null;
            createdAt: Date;
            nivel: number;
            characterId: string;
            custoEnergia: number;
            descricaoLivre: string;
        }[];
    } & {
        id: string;
        nome: string;
        specializationId: string | null;
        createdAt: Date;
        isActive: boolean;
        campaignId: string;
        userId: string;
        origemId: string | null;
        nivel: number;
        xpAtual: number;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
        isApproved: boolean;
        isMob: boolean;
        pendingAptidaoSlots: number;
        pendingAtributoPoints: number;
    }>;
    private checkOwnership;
    private checkNotInActiveCombat;
}
