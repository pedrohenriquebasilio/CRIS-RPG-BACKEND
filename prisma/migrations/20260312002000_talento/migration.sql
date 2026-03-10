-- CreateTable: Talento (catálogo global)
CREATE TABLE "Talento" (
  "id"           TEXT NOT NULL,
  "nome"         TEXT NOT NULL,
  "tipo"         TEXT NOT NULL DEFAULT 'ativa',
  "custo"        TEXT NOT NULL DEFAULT 'nenhum',
  "alcance"      TEXT NOT NULL DEFAULT 'pessoal',
  "duracao"      TEXT NOT NULL DEFAULT 'imediato',
  "descricao"    TEXT NOT NULL DEFAULT '',
  "damageDice"   TEXT,
  "atributoBase" TEXT,
  "isSystem"     BOOLEAN NOT NULL DEFAULT false,
  "createdById"  TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Talento_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CharacterTalento (junção)
CREATE TABLE "CharacterTalento" (
  "id"          TEXT NOT NULL,
  "characterId" TEXT NOT NULL,
  "talentoId"   TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CharacterTalento_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CharacterTalento_characterId_talentoId_key"
  ON "CharacterTalento"("characterId", "talentoId");

-- AddForeignKey: Talento → User
ALTER TABLE "Talento" ADD CONSTRAINT "Talento_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CharacterTalento → Character
ALTER TABLE "CharacterTalento" ADD CONSTRAINT "CharacterTalento_characterId_fkey"
  FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: CharacterTalento → Talento
ALTER TABLE "CharacterTalento" ADD CONSTRAINT "CharacterTalento_talentoId_fkey"
  FOREIGN KEY ("talentoId") REFERENCES "Talento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
