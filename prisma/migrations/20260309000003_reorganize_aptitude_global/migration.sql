-- Reorganize Aptitude to be global (not player-specific)
-- Remove characterId from Aptitude and keep CharacterAptitude as junction table

ALTER TABLE "Aptitude" DROP COLUMN IF EXISTS "characterId";
ALTER TABLE "Aptitude" ADD COLUMN "prerequisitoAptidaoId" TEXT;
ALTER TABLE "Aptitude" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'buff';
ALTER TABLE "Aptitude" ADD COLUMN "cooldown" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Aptitude" ADD COLUMN "criadoPorUserId" TEXT;
ALTER TABLE "Aptitude" ADD COLUMN "isSystem" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Aptitude" ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update CharacterAptitude to add missing fields
ALTER TABLE "CharacterAptitude" ADD COLUMN "ativo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CharacterAptitude" ADD COLUMN "cooldownRestante" INTEGER NOT NULL DEFAULT 0;

-- Add foreign key for prerequisitoAptidaoId
ALTER TABLE "Aptitude" ADD CONSTRAINT "Aptitude_prerequisitoAptidaoId_fkey" FOREIGN KEY ("prerequisitoAptidaoId") REFERENCES "Aptitude"("id") ON DELETE SET NULL;
