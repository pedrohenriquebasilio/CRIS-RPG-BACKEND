-- Add descricao field to Weapon and WeaponTemplate
ALTER TABLE "Weapon" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';
ALTER TABLE "WeaponTemplate" ADD COLUMN "descricao" TEXT NOT NULL DEFAULT '';
