-- Fix hpBase for Restringido specialization
UPDATE "Specialization" SET "hpBase" = 16 WHERE "nome" = 'Restringido';
