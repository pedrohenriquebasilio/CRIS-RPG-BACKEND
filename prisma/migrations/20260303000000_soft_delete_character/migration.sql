-- Soft delete flag for Character
ALTER TABLE "Character" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
