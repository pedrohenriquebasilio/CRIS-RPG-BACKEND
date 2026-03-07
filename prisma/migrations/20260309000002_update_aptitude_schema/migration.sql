-- Update Aptitude table with new fields for player-created aptitudes
ALTER TABLE "Aptitude" ADD COLUMN "characterId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Aptitude" ADD COLUMN "prerequisitoNivel" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Aptitude" ADD COLUMN "prerequisitoAptidaoId" TEXT;
ALTER TABLE "Aptitude" ADD COLUMN "tipo" TEXT NOT NULL DEFAULT 'buff';
ALTER TABLE "Aptitude" ADD COLUMN "cooldown" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Aptitude" ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add foreign keys
ALTER TABLE "Aptitude" DROP CONSTRAINT "Aptitude_pkey" CASCADE;
ALTER TABLE "Aptitude" ADD CONSTRAINT "Aptitude_pkey" PRIMARY KEY ("id");
ALTER TABLE "Aptitude" ADD CONSTRAINT "Aptitude_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE;
ALTER TABLE "Aptitude" ADD CONSTRAINT "Aptitude_prerequisitoAptidaoId_fkey" FOREIGN KEY ("prerequisitoAptidaoId") REFERENCES "Aptitude"("id") ON DELETE SET NULL;

-- Remove old JSON columns
ALTER TABLE "Aptitude" DROP COLUMN IF EXISTS "prerequisitos";
ALTER TABLE "Aptitude" DROP COLUMN IF EXISTS "modificadores";
