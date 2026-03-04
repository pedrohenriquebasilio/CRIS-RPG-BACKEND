import { CampaignService } from './campaign.service';
export declare class CreateCampaignDto {
    name: string;
}
export declare class JoinCampaignDto {
    inviteCode: string;
}
export declare class CampaignController {
    private campaignService;
    constructor(campaignService: CampaignService);
    create(dto: CreateCampaignDto, user: any): Promise<{
        master: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        isActiveCombat: boolean;
        inviteCode: string;
        masterId: string;
    }>;
    findAll(): Promise<({
        _count: {
            characters: number;
        };
        master: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        isActiveCombat: boolean;
        inviteCode: string;
        masterId: string;
    })[]>;
    findOne(id: string): Promise<{
        characters: ({
            specialization: {
                bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
                id: string;
                nome: string;
                hpPorNivel: number;
                energiaPorNivel: number;
                habilidadesTreinadas: string[];
            } | null;
            user: {
                id: string;
                email: string;
            };
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
        })[];
        master: {
            id: string;
            email: string;
        };
        combats: {
            id: string;
            createdAt: Date;
            campaignId: string;
            state: import("@prisma/client").$Enums.CombatState;
            roundNumber: number;
            currentTurnIndex: number;
            finishedAt: Date | null;
        }[];
        npcs: {
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
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        isActiveCombat: boolean;
        inviteCode: string;
        masterId: string;
    }>;
    getActiveCombat(id: string): Promise<({
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
    getCampaignLogs(id: string, user: any): Promise<({
        combat: {
            id: string;
            state: import("@prisma/client").$Enums.CombatState;
            roundNumber: number;
        } | null;
    } & {
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
    })[]>;
    getInviteInfo(code: string): Promise<{
        id: string;
        name: string;
        master: {
            id: string;
            email: string;
        };
        playerCount: number;
        inviteCode: string;
    }>;
    join(dto: JoinCampaignDto, user: any): Promise<{
        master: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        isActiveCombat: boolean;
        inviteCode: string;
        masterId: string;
    }>;
    approveCharacter(id: string, characterId: string, user: any): Promise<{
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
}
