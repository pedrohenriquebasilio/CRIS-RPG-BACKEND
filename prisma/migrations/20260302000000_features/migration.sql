-- AlterEnum: add new ActionType values
ALTER TYPE "ActionType" ADD VALUE IF NOT EXISTS 'ATAQUE';
ALTER TYPE "ActionType" ADD VALUE IF NOT EXISTS 'DEFESA';
ALTER TYPE "ActionType" ADD VALUE IF NOT EXISTS 'CD_TEST';
ALTER TYPE "ActionType" ADD VALUE IF NOT EXISTS 'DANO';

-- AlterTable Character: add isMob column
ALTER TABLE "Character" ADD COLUMN "isMob" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable Weapon
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "skillId" TEXT,
    "damageDice" TEXT NOT NULL,
    "damageType" "TipoDano" NOT NULL,
    "threatRange" INTEGER NOT NULL DEFAULT 20,
    "criticalMultiplier" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- AlterTable CombatLog: add campaignId column (nullable)
ALTER TABLE "CombatLog" ADD COLUMN "campaignId" TEXT;

-- Populate campaignId from combat for existing records
UPDATE "CombatLog" SET "campaignId" = (
    SELECT "campaignId" FROM "Combat" WHERE "Combat"."id" = "CombatLog"."combatId"
);

-- Make combatId nullable (drop old FK, alter column, re-add as nullable FK)
ALTER TABLE "CombatLog" DROP CONSTRAINT "CombatLog_combatId_fkey";
ALTER TABLE "CombatLog" ALTER COLUMN "combatId" DROP NOT NULL;

-- AddForeignKey for Weapon
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey for CombatLog (updated)
ALTER TABLE "CombatLog" ADD CONSTRAINT "CombatLog_combatId_fkey" FOREIGN KEY ("combatId") REFERENCES "Combat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CombatLog" ADD CONSTRAINT "CombatLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
