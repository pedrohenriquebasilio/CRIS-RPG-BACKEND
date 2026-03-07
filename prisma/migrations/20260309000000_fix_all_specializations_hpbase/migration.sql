-- Fix all hpBase values for specializations based on game rules
UPDATE "Specialization" SET "hpBase" = 12 WHERE "nome" = 'Lutador';
UPDATE "Specialization" SET "hpBase" = 12 WHERE "nome" = 'Especialista em Combate';
UPDATE "Specialization" SET "hpBase" = 10 WHERE "nome" = 'Especialista em Técnica';
UPDATE "Specialization" SET "hpBase" = 10 WHERE "nome" = 'Controlador';
UPDATE "Specialization" SET "hpBase" = 10 WHERE "nome" = 'Suporte';
UPDATE "Specialization" SET "hpBase" = 16 WHERE "nome" = 'Restringido';
