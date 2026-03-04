-- CreateTable
CREATE TABLE "TechniqueTemplate" (
    "id"             TEXT NOT NULL,
    "nome"           TEXT NOT NULL,
    "nivel"          INTEGER NOT NULL DEFAULT 1,
    "tipoDano"       "TipoDano",
    "cd"             INTEGER,
    "atributoBase"   "Atributo" NOT NULL,
    "custoEnergia"   INTEGER NOT NULL DEFAULT 0,
    "descricaoLivre" TEXT NOT NULL DEFAULT '',
    "isSystem"       BOOLEAN NOT NULL DEFAULT false,
    "createdById"    TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechniqueTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TechniqueTemplate" ADD CONSTRAINT "TechniqueTemplate_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
