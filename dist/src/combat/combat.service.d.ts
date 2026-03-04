import { PrismaService } from '../prisma/prisma.service';
import { RollService } from '../roll/roll.service';
import { GameGateway } from '../gateway/game.gateway';
import { TipoDano } from '@prisma/client';
export declare class CombatService {
    private prisma;
    private rollService;
    private gateway;
    constructor(prisma: PrismaService, rollService: RollService, gateway: GameGateway);
    createCombat(campaignId: string, masterId: string): Promise<{
        id: string;
        createdAt: Date;
        campaignId: string;
        state: import("@prisma/client").$Enums.CombatState;
        roundNumber: number;
        currentTurnIndex: number;
        finishedAt: Date | null;
    }>;
    addParticipant(combatId: string, data: {
        characterId?: string;
        npcId?: string;
    }, masterId: string): Promise<{
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
    rollInitiative(combatId: string, masterId: string): Promise<{
        results: any[];
        message: string;
    }>;
    startRound(combatId: string, masterId: string): Promise<({
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
    nextTurn(combatId: string, masterId: string): Promise<({
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
    skipTurn(combatId: string, masterId: string): Promise<({
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
    reorderParticipant(combatId: string, participantId: string, newOrder: number, masterId: string): Promise<{
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
    applyDamage(combatId: string, participantId: string, damage: number, tipoDano: TipoDano, masterId: string, source?: string): Promise<{
        participantId: string;
        damage: number;
        hpRestante: number;
        isDefeated: boolean;
    }>;
    applyCondition(combatId: string, participantId: string, conditionId: string, masterId: string): Promise<{
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
    forceTest(combatId: string, characterId: string, skillId: string, masterId: string): Promise<{
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
    finishCombat(combatId: string, masterId: string): Promise<{
        message: string;
        combatId: string;
    }>;
    getCombatState(combatId: string): Promise<({
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
    getCombatLogs(combatId: string): Promise<{
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
    private getCombatForMaster;
    private decrementConditions;
}
