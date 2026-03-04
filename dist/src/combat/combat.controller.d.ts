import { CombatService } from './combat.service';
import { TipoDano } from '@prisma/client';
export declare class CreateCombatDto {
    campaignId: string;
}
export declare class AddParticipantDto {
    characterId?: string;
    npcId?: string;
}
export declare class ApplyDamageDto {
    damage: number;
    tipoDano: TipoDano;
    source?: string;
}
export declare class ApplyConditionDto {
    conditionId: string;
}
export declare class ForceTestDto {
    characterId: string;
    skillId: string;
}
export declare class ReorderParticipantDto {
    newOrder: number;
}
export declare class CombatController {
    private combatService;
    constructor(combatService: CombatService);
    create(dto: CreateCombatDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }>;
    getState(id: string): Promise<({
        campaign: {
            id: string;
            masterId: string;
        };
        logs: {
            id: string;
            campaignId: string | null;
            timestamp: Date;
            combatId: string | null;
            actor: string;
            actionType: import("@prisma/client").$Enums.ActionType;
            diceResult: number | null;
            total: number | null;
            target: string | null;
            wasOutOfTurn: boolean;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        participants: ({
            character: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    characterId: string;
                } | null;
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
            }) | null;
            npc: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    npcId: string;
                } | null;
            } & {
                id: string;
                nome: string;
                tipoDano: import("@prisma/client").$Enums.TipoDano;
                campaignId: string;
                nivel: number;
                hpAtual: number;
                hpMax: number;
                energiaAtual: number;
                energiaMax: number;
                maestriaBonus: number;
                isSimplified: boolean;
                bonusAtaque: number;
                defesa: number;
                danoFixo: number;
            }) | null;
            conditions: ({
                condition: {
                    id: string;
                    nome: string;
                    descricao: string;
                    duracaoRodadas: number;
                    efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
                };
            } & {
                id: string;
                rodadasRestantes: number;
                appliedAt: Date;
                participantId: string;
                conditionId: string;
            })[];
        } & {
            id: string;
            ordem: number;
            hpAtual: number;
            energiaAtual: number;
            combatId: string;
            characterId: string | null;
            npcId: string | null;
            initiative: number;
            isDefeated: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }) | null>;
    getLogs(id: string): Promise<{
        id: string;
        campaignId: string | null;
        timestamp: Date;
        combatId: string | null;
        actor: string;
        actionType: import("@prisma/client").$Enums.ActionType;
        diceResult: number | null;
        total: number | null;
        target: string | null;
        wasOutOfTurn: boolean;
        details: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    addParticipant(id: string, dto: AddParticipantDto, user: any): Promise<{
        character: {
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
        } | null;
        npc: {
            id: string;
            nome: string;
            tipoDano: import("@prisma/client").$Enums.TipoDano;
            campaignId: string;
            nivel: number;
            hpAtual: number;
            hpMax: number;
            energiaAtual: number;
            energiaMax: number;
            maestriaBonus: number;
            isSimplified: boolean;
            bonusAtaque: number;
            defesa: number;
            danoFixo: number;
        } | null;
    } & {
        id: string;
        ordem: number;
        hpAtual: number;
        energiaAtual: number;
        combatId: string;
        characterId: string | null;
        npcId: string | null;
        initiative: number;
        isDefeated: boolean;
    }>;
    rollInitiative(id: string, user: any): Promise<{
        results: any[];
        message: string;
    }>;
    startRound(id: string, user: any): Promise<({
        campaign: {
            id: string;
            masterId: string;
        };
        logs: {
            id: string;
            campaignId: string | null;
            timestamp: Date;
            combatId: string | null;
            actor: string;
            actionType: import("@prisma/client").$Enums.ActionType;
            diceResult: number | null;
            total: number | null;
            target: string | null;
            wasOutOfTurn: boolean;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        participants: ({
            character: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    characterId: string;
                } | null;
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
            }) | null;
            npc: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    npcId: string;
                } | null;
            } & {
                id: string;
                nome: string;
                tipoDano: import("@prisma/client").$Enums.TipoDano;
                campaignId: string;
                nivel: number;
                hpAtual: number;
                hpMax: number;
                energiaAtual: number;
                energiaMax: number;
                maestriaBonus: number;
                isSimplified: boolean;
                bonusAtaque: number;
                defesa: number;
                danoFixo: number;
            }) | null;
            conditions: ({
                condition: {
                    id: string;
                    nome: string;
                    descricao: string;
                    duracaoRodadas: number;
                    efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
                };
            } & {
                id: string;
                rodadasRestantes: number;
                appliedAt: Date;
                participantId: string;
                conditionId: string;
            })[];
        } & {
            id: string;
            ordem: number;
            hpAtual: number;
            energiaAtual: number;
            combatId: string;
            characterId: string | null;
            npcId: string | null;
            initiative: number;
            isDefeated: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }) | null>;
    nextTurn(id: string, user: any): Promise<({
        campaign: {
            id: string;
            masterId: string;
        };
        logs: {
            id: string;
            campaignId: string | null;
            timestamp: Date;
            combatId: string | null;
            actor: string;
            actionType: import("@prisma/client").$Enums.ActionType;
            diceResult: number | null;
            total: number | null;
            target: string | null;
            wasOutOfTurn: boolean;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        participants: ({
            character: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    characterId: string;
                } | null;
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
            }) | null;
            npc: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    npcId: string;
                } | null;
            } & {
                id: string;
                nome: string;
                tipoDano: import("@prisma/client").$Enums.TipoDano;
                campaignId: string;
                nivel: number;
                hpAtual: number;
                hpMax: number;
                energiaAtual: number;
                energiaMax: number;
                maestriaBonus: number;
                isSimplified: boolean;
                bonusAtaque: number;
                defesa: number;
                danoFixo: number;
            }) | null;
            conditions: ({
                condition: {
                    id: string;
                    nome: string;
                    descricao: string;
                    duracaoRodadas: number;
                    efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
                };
            } & {
                id: string;
                rodadasRestantes: number;
                appliedAt: Date;
                participantId: string;
                conditionId: string;
            })[];
        } & {
            id: string;
            ordem: number;
            hpAtual: number;
            energiaAtual: number;
            combatId: string;
            characterId: string | null;
            npcId: string | null;
            initiative: number;
            isDefeated: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }) | null>;
    skipTurn(id: string, user: any): Promise<({
        campaign: {
            id: string;
            masterId: string;
        };
        logs: {
            id: string;
            campaignId: string | null;
            timestamp: Date;
            combatId: string | null;
            actor: string;
            actionType: import("@prisma/client").$Enums.ActionType;
            diceResult: number | null;
            total: number | null;
            target: string | null;
            wasOutOfTurn: boolean;
            details: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        participants: ({
            character: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    characterId: string;
                } | null;
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
            }) | null;
            npc: ({
                attributes: {
                    id: string;
                    FOR: number;
                    AGI: number;
                    VIG: number;
                    INT: number;
                    PRE: number;
                    npcId: string;
                } | null;
            } & {
                id: string;
                nome: string;
                tipoDano: import("@prisma/client").$Enums.TipoDano;
                campaignId: string;
                nivel: number;
                hpAtual: number;
                hpMax: number;
                energiaAtual: number;
                energiaMax: number;
                maestriaBonus: number;
                isSimplified: boolean;
                bonusAtaque: number;
                defesa: number;
                danoFixo: number;
            }) | null;
            conditions: ({
                condition: {
                    id: string;
                    nome: string;
                    descricao: string;
                    duracaoRodadas: number;
                    efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
                };
            } & {
                id: string;
                rodadasRestantes: number;
                appliedAt: Date;
                participantId: string;
                conditionId: string;
            })[];
        } & {
            id: string;
            ordem: number;
            hpAtual: number;
            energiaAtual: number;
            combatId: string;
            characterId: string | null;
            npcId: string | null;
            initiative: number;
            isDefeated: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }) | null>;
    reorderParticipant(id: string, participantId: string, dto: ReorderParticipantDto, user: any): Promise<{
        id: string;
        ordem: number;
        hpAtual: number;
        energiaAtual: number;
        combatId: string;
        characterId: string | null;
        npcId: string | null;
        initiative: number;
        isDefeated: boolean;
    }>;
    applyDamage(id: string, participantId: string, dto: ApplyDamageDto, user: any): Promise<{
        participantId: string;
        damage: number;
        hpRestante: number;
        isDefeated: boolean;
    }>;
    applyCondition(id: string, participantId: string, dto: ApplyConditionDto, user: any): Promise<{
        condition: {
            id: string;
            nome: string;
            descricao: string;
            duracaoRodadas: number;
            efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
        };
    } & {
        id: string;
        rodadasRestantes: number;
        appliedAt: Date;
        participantId: string;
        conditionId: string;
    }>;
    forceTest(id: string, dto: ForceTestDto, user: any): Promise<{
        characterId: string;
        skillId: string;
        skillNome: string;
        atributo: import("@prisma/client").$Enums.Atributo;
        dice: number;
        attrVal: number;
        maestria: number;
        total: number;
        log: any;
    }>;
    finish(id: string, user: any): Promise<{
        message: string;
        combatId: string;
    }>;
}
