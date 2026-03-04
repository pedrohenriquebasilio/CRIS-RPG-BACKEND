import { PrismaService } from '../prisma/prisma.service';
export declare class SpecializationsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string): Promise<{
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
        _count: {
            characters: number;
        };
    } & {
        bonusAtributos: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        nome: string;
        hpPorNivel: number;
        energiaPorNivel: number;
        habilidadesTreinadas: string[];
    }>;
    getAbilities(id: string, nivel?: string): Promise<{
        id: string;
        nome: string;
        nivelRequerido: number;
        tipo: string;
        custo: string;
        alcance: string;
        duracao: string;
        descricao: string;
        specializationId: string;
    }[]>;
    getAbilitiesAtLevel(id: string, nivel: string): Promise<{
        id: string;
        nome: string;
        nivelRequerido: number;
        tipo: string;
        custo: string;
        alcance: string;
        duracao: string;
        descricao: string;
        specializationId: string;
    }[]>;
}
