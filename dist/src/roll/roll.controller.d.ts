import { RollService } from './roll.service';
import { Atributo } from '@prisma/client';
export declare class RollSkillDto {
    skillId: string;
    characterId: string;
    combatId?: string;
    campaignId?: string;
}
export declare class RollTechniqueDto {
    techniqueId: string;
    actorId: string;
    targetId?: string;
    combatId?: string;
    campaignId?: string;
}
export declare class RollOpposedDto {
    attackerId: string;
    defenderId: string;
    atkAttr?: Atributo;
    defAttr?: Atributo;
    combatId?: string;
    campaignId?: string;
}
export declare class RollAttributeDto {
    characterId: string;
    attribute: Atributo;
    combatId?: string;
    campaignId?: string;
}
export declare class RollWeaponAttackDto {
    characterId: string;
    weaponId: string;
    targetId?: string;
    combatId?: string;
    campaignId?: string;
}
export declare class RollController {
    private rollService;
    constructor(rollService: RollService);
    rollSkill(dto: RollSkillDto): Promise<{
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
    rollTechnique(dto: RollTechniqueDto): Promise<{
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
    rollOpposed(dto: RollOpposedDto): Promise<{
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
    rollAttribute(dto: RollAttributeDto): Promise<{
        characterId: string;
        attribute: import("@prisma/client").$Enums.Atributo;
        dice: number;
        attrVal: number;
        total: number;
        wasOutOfTurn: boolean;
        log: any;
    }>;
    rollWeaponAttack(dto: RollWeaponAttackDto): Promise<{
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
