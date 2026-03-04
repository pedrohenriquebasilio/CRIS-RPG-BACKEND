import { PrismaService } from '../prisma/prisma.service';
import { Atributo } from '@prisma/client';
export declare class RollService {
    private prisma;
    constructor(prisma: PrismaService);
    roll1d20(): number;
    rollDice(diceString: string): number;
    applyCritical(damage: number, multiplier: number): number;
    private getAttrValue;
    private getCampaignIdFromCombat;
    calculateCD(characterId: string, attribute: Atributo): Promise<number>;
    rollAttribute(characterId: string, attribute: Atributo, combatId?: string, campaignId?: string): Promise<{
        characterId: string;
        attribute: import("@prisma/client").$Enums.Atributo;
        dice: number;
        attrVal: number;
        total: number;
        wasOutOfTurn: boolean;
        log: any;
    }>;
    rollSkill(skillId: string, characterId: string, combatId?: string, campaignId?: string): Promise<{
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
    rollTechnique(techniqueId: string, actorId: string, targetId?: string, combatId?: string, campaignId?: string): Promise<{
        techniqueId: string;
        techniqueNome: string;
        actor: string;
        dice: number;
        attrVal: number;
        maestria: number;
        total: number;
        custoEnergia: number;
        target: any;
        success: boolean | null;
        wasOutOfTurn: boolean;
        log: any;
    }>;
    rollInitiative(combatId: string): Promise<any[]>;
    rollOpposed(attackerId: string, defenderId: string, atkAttr?: Atributo, defAttr?: Atributo, combatId?: string, campaignId?: string): Promise<{
        attacker: {
            id: string;
            nome: string;
            dice: number;
            total: number;
            attribute: import("@prisma/client").$Enums.Atributo;
        };
        defender: {
            id: string;
            nome: string;
            dice: number;
            total: number;
            attribute: import("@prisma/client").$Enums.Atributo;
        };
        attackerWins: boolean;
        log: any;
    }>;
    rollWeaponAttack(characterId: string, weaponId: string, targetId?: string, combatId?: string, campaignId?: string): Promise<{
        characterId: string;
        weaponId: string;
        weaponNome: string;
        attackAttribute: import("@prisma/client").$Enums.Atributo;
        naturalRoll: number;
        attackTotal: number;
        isCritical: boolean;
        threatRange: number;
        criticalMultiplier: number;
        baseDamage: number;
        finalDamage: number;
        damageType: import("@prisma/client").$Enums.TipoDano;
        target: any;
        attackerWins: boolean | null;
        wasOutOfTurn: boolean;
        log: any;
    }>;
}
