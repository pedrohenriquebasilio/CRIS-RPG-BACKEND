-- CreateTable: Item (catálogo global de itens)
CREATE TABLE "Item" (
  "id"          TEXT NOT NULL,
  "nome"        TEXT NOT NULL,
  "descricao"   TEXT NOT NULL DEFAULT '',
  "tipo"        TEXT NOT NULL DEFAULT 'misc',
  "peso"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "valor"       INTEGER NOT NULL DEFAULT 0,
  "isSystem"    BOOLEAN NOT NULL DEFAULT false,
  "createdById" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable: InventoryItem (itens no inventário de um personagem)
CREATE TABLE "InventoryItem" (
  "id"          TEXT NOT NULL,
  "characterId" TEXT NOT NULL,
  "itemId"      TEXT NOT NULL,
  "quantidade"  INTEGER NOT NULL DEFAULT 1,
  "equipado"    BOOLEAN NOT NULL DEFAULT false,
  "notas"       TEXT NOT NULL DEFAULT '',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- UniqueConstraint: um personagem só pode ter uma entrada por item
CREATE UNIQUE INDEX "InventoryItem_characterId_itemId_key" ON "InventoryItem"("characterId", "itemId");

-- AddForeignKey: Item → User
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: InventoryItem → Character
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_fkey"
  FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: InventoryItem → Item
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey"
  FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
