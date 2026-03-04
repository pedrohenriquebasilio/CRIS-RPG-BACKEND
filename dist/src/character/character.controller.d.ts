import { CharacterService } from './character.service';
import { Atributo, TipoDano } from '@prisma/client';
export declare class CreateCharacterDto {
    campaignId: string;
    nome: string;
    specializationId?: string;
    attributes?: {
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
    };
    isMob?: boolean;
}
export declare class AddTechniqueDto {
    nome: string;
    nivel: number;
    custoEnergia: number;
    atributoBase: Atributo;
    descricaoLivre: string;
    tipoDano?: string;
}
export declare class AddWeaponDto {
    nome: string;
    skillId?: string;
    damageDice: string;
    damageType: TipoDano;
    threatRange?: number;
    criticalMultiplier?: number;
}
export declare class GrantXpDto {
    amount: number;
    combatId?: string;
}
export declare class DistributeAttributeDto {
    attribute: Atributo;
}
export declare class UpdateStatsDto {
    hpAtual?: number;
    hpMax?: number;
    energiaAtual?: number;
    energiaMax?: number;
    maestriaBonus?: number;
}
export declare class UpdateAttributesDto {
    FOR?: number;
    AGI?: number;
    VIG?: number;
    INT?: number;
    PRE?: number;
}
export declare class UpdateClassOriginDto {
    specializationId?: string;
    origemId?: string;
}
export declare class UpdateSkillDto {
    treinada?: boolean;
    pontosInvestidos?: number;
    skillName?: string;
}
export declare class CharacterController {
    private characterService;
    constructor(characterService: CharacterService);
    create(dto: CreateCharacterDto, user: any): Promise<{
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
    addSkill(id: string, skillId: string, user: any): Promise<{
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
    trainSkill(id: string, skillId: string, user: any): Promise<{
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
    addAptitude(id: string, aptitudeId: string, user: any): Promise<{
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
    addTechnique(id: string, dto: AddTechniqueDto, user: any): Promise<{
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
    updateTechnique(id: string, techniqueId: string, data: any, user: any): Promise<{
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
    addWeapon(id: string, dto: AddWeaponDto, user: any): Promise<{
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
    updateWeapon(id: string, weaponId: string, data: any, user: any): Promise<{
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
    deleteWeapon(id: string, weaponId: string, user: any): Promise<{
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
    deactivate(id: string, user: any): Promise<{
        id: string;
        nome: string;
        isActive: boolean;
    }>;
    distributeAttribute(id: string, dto: DistributeAttributeDto, user: any): Promise<{
        id: string;
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
        characterId: string;
    }>;
    updateNome(id: string, nome: string, user: any): Promise<{
        id: string;
        nome: string;
    }>;
    updateStats(id: string, dto: UpdateStatsDto, user: any): Promise<{
        id: string;
        hpAtual: number;
        hpMax: number;
        energiaAtual: number;
        energiaMax: number;
        maestriaBonus: number;
    }>;
    updateAttributes(id: string, dto: UpdateAttributesDto, user: any): Promise<{
        id: string;
        FOR: number;
        AGI: number;
        VIG: number;
        INT: number;
        PRE: number;
        characterId: string;
    }>;
    updateClassOrigin(id: string, dto: UpdateClassOriginDto, user: any): Promise<{
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
    updateSkillByName(id: string, dto: UpdateSkillDto, user: any): Promise<{
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
    grantXp(id: string, dto: GrantXpDto, user: any): Promise<any>;
}
