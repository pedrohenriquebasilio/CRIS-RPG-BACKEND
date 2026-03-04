-- CreateTable
CREATE TABLE "Origem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bonusAtributos" JSONB NOT NULL DEFAULT '{"FOR":0,"AGI":0,"VIG":0,"INT":0,"PRE":0}',
    "habilidadesTreinadas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    CONSTRAINT "Origem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Origem_nome_key" ON "Origem"("nome");

-- AlterTable Specialization
ALTER TABLE "Specialization"
  ADD COLUMN "bonusAtributos" JSONB NOT NULL DEFAULT '{"FOR":0,"AGI":0,"VIG":0,"INT":0,"PRE":0}',
  ADD COLUMN "habilidadesTreinadas" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable Character
ALTER TABLE "Character" ADD COLUMN "origemId" TEXT;
ALTER TABLE "Character" ADD CONSTRAINT "Character_origemId_fkey"
  FOREIGN KEY ("origemId") REFERENCES "Origem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
