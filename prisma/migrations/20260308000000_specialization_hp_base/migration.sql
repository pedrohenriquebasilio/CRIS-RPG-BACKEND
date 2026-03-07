-- Add hpBase to Specialization for level-1 starting HP
ALTER TABLE "Specialization" ADD COLUMN "hpBase" INTEGER NOT NULL DEFAULT 0;
