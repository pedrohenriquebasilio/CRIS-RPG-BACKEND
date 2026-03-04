import { PrismaService } from '../prisma/prisma.service';
export declare class SeedsController {
    private prisma;
    constructor(prisma: PrismaService);
    getSpecializations(): import("@prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    getSkills(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        nome: string;
        descricao: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        permiteMaestria: boolean;
    }[]>;
    getAptitudes(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        nome: string;
        descricao: string;
        prerequisitos: import("@prisma/client/runtime/client").JsonValue;
        modificadores: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getConditions(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        nome: string;
        descricao: string;
        duracaoRodadas: number;
        efeitoMecanico: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getLevelProgression(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        level: number;
        xpRequired: number;
        ganhoAtributo: boolean;
        ganhoMaestria: boolean;
    }[]>;
    getWeaponTemplates(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        nome: string;
        damageDice: string;
        categoria: string;
        tipoDano: string;
        distancia: string;
        duasMaos: boolean;
        requiresMarcial: boolean;
        regraEspecial: string | null;
        threatRange: number;
        criticalMultiplier: number;
    }[]>;
    getOrigens(): import("@prisma/client").Prisma.PrismaPromise<{
        bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        nome: string;
        habilidadesTreinadas: string[];
        descricao: string;
    }[]>;
}
