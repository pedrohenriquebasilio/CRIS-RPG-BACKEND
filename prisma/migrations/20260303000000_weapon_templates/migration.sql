-- CreateTable WeaponTemplate
CREATE TABLE "WeaponTemplate" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "damageDice" TEXT NOT NULL,
    "tipoDano" TEXT NOT NULL,
    "distancia" TEXT NOT NULL,
    "duasMaos" BOOLEAN NOT NULL DEFAULT false,
    "requiresMarcial" BOOLEAN NOT NULL DEFAULT false,
    "regraEspecial" TEXT,
    "threatRange" INTEGER NOT NULL DEFAULT 20,
    "criticalMultiplier" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "WeaponTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeaponTemplate_nome_key" ON "WeaponTemplate"("nome");
