import { TechniqueTemplateService, CreateTechniqueTemplateDto } from './technique-template.service';
import { Atributo, TipoDano } from '@prisma/client';
declare class CreateDto implements CreateTechniqueTemplateDto {
    nome: string;
    nivel: number;
    atributoBase: Atributo;
    custoEnergia?: number;
    tipoDano?: TipoDano | null;
    cd?: number | null;
    descricaoLivre?: string;
}
export declare class TechniqueTemplateController {
    private service;
    constructor(service: TechniqueTemplateService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        createdBy: {
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        nome: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        tipoDano: import("@prisma/client").$Enums.TipoDano | null;
        createdAt: Date;
        nivel: number;
        custoEnergia: number;
        descricaoLivre: string;
        cd: number | null;
        isSystem: boolean;
        createdById: string | null;
    })[]>;
    create(dto: CreateDto, user: any): import("@prisma/client").Prisma.Prisma__TechniqueTemplateClient<{
        createdBy: {
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        nome: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        tipoDano: import("@prisma/client").$Enums.TipoDano | null;
        createdAt: Date;
        nivel: number;
        custoEnergia: number;
        descricaoLivre: string;
        cd: number | null;
        isSystem: boolean;
        createdById: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    delete(id: string): import("@prisma/client").Prisma.Prisma__TechniqueTemplateClient<{
        id: string;
        nome: string;
        atributoBase: import("@prisma/client").$Enums.Atributo;
        tipoDano: import("@prisma/client").$Enums.TipoDano | null;
        createdAt: Date;
        nivel: number;
        custoEnergia: number;
        descricaoLivre: string;
        cd: number | null;
        isSystem: boolean;
        createdById: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
export {};
