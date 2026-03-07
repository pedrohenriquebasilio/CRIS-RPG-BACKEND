-- Add maestriaInicial to Specialization (number of free-choice skill training slots granted by the class)
ALTER TABLE "Specialization" ADD COLUMN "maestriaInicial" INTEGER NOT NULL DEFAULT 2;
