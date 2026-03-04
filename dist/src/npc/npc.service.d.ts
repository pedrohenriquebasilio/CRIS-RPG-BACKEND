import { PrismaService } from '../prisma/prisma.service';
import { TipoDano } from '@prisma/client';
export declare class NpcService {
    private prisma;
    constructor(prisma: PrismaService);
    createSimplified(campaignId: string, data: {
        nome: string;
        hp: number;
        energia: number;
        bonusAtaque: number;
        defesa: number;
        danoFixo: number;
        tipoDano: TipoDano;
    }, masterId: string): Promise<{
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
    }>;
    createFull(campaignId: string, data: {
        nome: string;
        hp: number;
        energia: number;
        nivel: number;
        maestriaBonus: number;
        attributes: {
            FOR: number;
            AGI: number;
            VIG: number;
            INT: number;
            PRE: number;
        };
    }, masterId: string): Promise<{
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
    }>;
    findByCampaign(campaignId: string): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, data: any, masterId: string): Promise<{
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
    }>;
    delete(id: string, masterId: string): Promise<{
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
    }>;
    private verifyCampaignMaster;
}
