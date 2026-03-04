-- Add rich fields to SpecializationAbility
ALTER TABLE "SpecializationAbility" ADD COLUMN "nome"    TEXT NOT NULL DEFAULT '';
ALTER TABLE "SpecializationAbility" ADD COLUMN "tipo"    TEXT NOT NULL DEFAULT 'ativa';
ALTER TABLE "SpecializationAbility" ADD COLUMN "custo"   TEXT NOT NULL DEFAULT 'nenhum';
ALTER TABLE "SpecializationAbility" ADD COLUMN "alcance" TEXT NOT NULL DEFAULT 'pessoal';
ALTER TABLE "SpecializationAbility" ADD COLUMN "duracao" TEXT NOT NULL DEFAULT 'imediato';
