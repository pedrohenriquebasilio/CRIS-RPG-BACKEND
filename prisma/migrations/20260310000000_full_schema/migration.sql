-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'PLAYER');

-- CreateEnum
CREATE TYPE "Atributo" AS ENUM ('FOR', 'AGI', 'VIG', 'INT', 'PRE');

-- CreateEnum
CREATE TYPE "TipoDano" AS ENUM ('FISICO', 'ENERGETICO', 'MENTAL', 'ESPIRITUAL');

-- CreateEnum
CREATE TYPE "CombatState" AS ENUM ('IDLE', 'COMBAT_CREATED', 'INITIATIVE_ROLLED', 'ROUND_ACTIVE', 'ROUND_FINISHED', 'COMBAT_FINISHED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('TECHNIQUE', 'SKILL', 'DAMAGE', 'CONDITION', 'XP', 'LEVELUP', 'ATAQUE', 'DEFESA', 'CD_TEST', 'DANO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "masterId" TEXT NOT NULL,
    "isActiveCombat" BOOLEAN NOT NULL DEFAULT false,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "origemId" TEXT,
    "specializationId" TEXT,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "xpAtual" INTEGER NOT NULL DEFAULT 0,
    "hpAtual" INTEGER NOT NULL DEFAULT 10,
    "hpMax" INTEGER NOT NULL DEFAULT 10,
    "energiaAtual" INTEGER NOT NULL DEFAULT 5,
    "energiaMax" INTEGER NOT NULL DEFAULT 5,
    "maestriaBonus" INTEGER NOT NULL DEFAULT 2,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isMob" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pendingAptidaoSlots" INTEGER NOT NULL DEFAULT 0,
    "pendingAtributoPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAbility" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ativa',
    "custo" TEXT NOT NULL DEFAULT 'nenhum',
    "alcance" TEXT NOT NULL DEFAULT 'pessoal',
    "duracao" TEXT NOT NULL DEFAULT 'imediato',
    "descricao" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAttribute" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "FOR" INTEGER NOT NULL DEFAULT 1,
    "AGI" INTEGER NOT NULL DEFAULT 1,
    "VIG" INTEGER NOT NULL DEFAULT 1,
    "INT" INTEGER NOT NULL DEFAULT 1,
    "PRE" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CharacterAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "atributoBase" "Atributo" NOT NULL,
    "permiteMaestria" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "treinada" BOOLEAN NOT NULL DEFAULT false,
    "pontosInvestidos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "hpBase" INTEGER NOT NULL DEFAULT 0,
    "hpPorNivel" INTEGER NOT NULL,
    "energiaPorNivel" INTEGER NOT NULL,
    "maestriaInicial" INTEGER NOT NULL DEFAULT 2,
    "bonusAtributos" JSONB NOT NULL DEFAULT '{"FOR":0,"AGI":0,"VIG":0,"INT":0,"PRE":0}',
    "habilidadesTreinadas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Origem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "bonusAtributos" JSONB NOT NULL DEFAULT '{"FOR":0,"AGI":0,"VIG":0,"INT":0,"PRE":0}',
    "habilidadesTreinadas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Origem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecializationAbility" (
    "id" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "nome" TEXT NOT NULL DEFAULT '',
    "nivelRequerido" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ativa',
    "custo" TEXT NOT NULL DEFAULT 'nenhum',
    "alcance" TEXT NOT NULL DEFAULT 'pessoal',
    "duracao" TEXT NOT NULL DEFAULT 'imediato',
    "descricao" TEXT NOT NULL,

    CONSTRAINT "SpecializationAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aptitude" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prerequisitoNivel" INTEGER NOT NULL DEFAULT 1,
    "prerequisitoAptidaoId" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'buff',
    "cooldown" INTEGER NOT NULL DEFAULT 0,
    "criadoPorUserId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aptitude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAptitude" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "aptitudeId" TEXT NOT NULL,
    "adquiridaNoNivel" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "cooldownRestante" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterAptitude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 0,
    "custoEnergia" INTEGER NOT NULL,
    "atributoBase" "Atributo" NOT NULL,
    "descricaoLivre" TEXT NOT NULL DEFAULT '',
    "tipoDano" "TipoDano",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechniqueTemplate" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "tipoDano" "TipoDano",
    "cd" INTEGER,
    "atributoBase" "Atributo" NOT NULL,
    "custoEnergia" INTEGER NOT NULL DEFAULT 0,
    "descricaoLivre" TEXT NOT NULL DEFAULT '',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechniqueTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "skillId" TEXT,
    "damageDice" TEXT NOT NULL,
    "damageType" "TipoDano" NOT NULL,
    "threatRange" INTEGER NOT NULL DEFAULT 20,
    "criticalMultiplier" INTEGER NOT NULL DEFAULT 2,
    "descricao" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "descricao" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WeaponTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelProgression" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "xpRequired" INTEGER NOT NULL,
    "ganhoAtributo" BOOLEAN NOT NULL DEFAULT false,
    "ganhoMaestria" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LevelProgression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combat" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "state" "CombatState" NOT NULL DEFAULT 'IDLE',
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "currentTurnIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Combat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombatParticipant" (
    "id" TEXT NOT NULL,
    "combatId" TEXT NOT NULL,
    "characterId" TEXT,
    "npcId" TEXT,
    "initiative" INTEGER NOT NULL DEFAULT 0,
    "hpAtual" INTEGER NOT NULL,
    "energiaAtual" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "isDefeated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CombatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombatLog" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "combatId" TEXT,
    "actor" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "diceResult" INTEGER,
    "total" INTEGER,
    "target" TEXT,
    "wasOutOfTurn" BOOLEAN NOT NULL DEFAULT false,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CombatLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Npc" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "isSimplified" BOOLEAN NOT NULL DEFAULT false,
    "hpAtual" INTEGER NOT NULL DEFAULT 10,
    "hpMax" INTEGER NOT NULL DEFAULT 10,
    "energiaAtual" INTEGER NOT NULL DEFAULT 5,
    "energiaMax" INTEGER NOT NULL DEFAULT 5,
    "bonusAtaque" INTEGER NOT NULL DEFAULT 0,
    "defesa" INTEGER NOT NULL DEFAULT 10,
    "danoFixo" INTEGER NOT NULL DEFAULT 0,
    "tipoDano" "TipoDano" NOT NULL DEFAULT 'FISICO',
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "maestriaBonus" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "Npc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpcAttribute" (
    "id" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,
    "FOR" INTEGER NOT NULL DEFAULT 1,
    "AGI" INTEGER NOT NULL DEFAULT 1,
    "VIG" INTEGER NOT NULL DEFAULT 1,
    "INT" INTEGER NOT NULL DEFAULT 1,
    "PRE" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "NpcAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "duracaoRodadas" INTEGER NOT NULL,
    "efeitoMecanico" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantCondition" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "rodadasRestantes" INTEGER NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_inviteCode_key" ON "Campaign"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterAttribute_characterId_key" ON "CharacterAttribute"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSkill_characterId_skillId_key" ON "CharacterSkill"("characterId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Origem_nome_key" ON "Origem"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterAptitude_characterId_aptitudeId_key" ON "CharacterAptitude"("characterId", "aptitudeId");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponTemplate_nome_key" ON "WeaponTemplate"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "LevelProgression_level_key" ON "LevelProgression"("level");

-- CreateIndex
CREATE UNIQUE INDEX "NpcAttribute_npcId_key" ON "NpcAttribute"("npcId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "Origem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAbility" ADD CONSTRAINT "CharacterAbility_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAttribute" ADD CONSTRAINT "CharacterAttribute_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecializationAbility" ADD CONSTRAINT "SpecializationAbility_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aptitude" ADD CONSTRAINT "Aptitude_prerequisitoAptidaoId_fkey" FOREIGN KEY ("prerequisitoAptidaoId") REFERENCES "Aptitude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAptitude" ADD CONSTRAINT "CharacterAptitude_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAptitude" ADD CONSTRAINT "CharacterAptitude_aptitudeId_fkey" FOREIGN KEY ("aptitudeId") REFERENCES "Aptitude"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technique" ADD CONSTRAINT "Technique_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechniqueTemplate" ADD CONSTRAINT "TechniqueTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combat" ADD CONSTRAINT "Combat_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombatParticipant" ADD CONSTRAINT "CombatParticipant_combatId_fkey" FOREIGN KEY ("combatId") REFERENCES "Combat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombatParticipant" ADD CONSTRAINT "CombatParticipant_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombatParticipant" ADD CONSTRAINT "CombatParticipant_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "Npc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombatLog" ADD CONSTRAINT "CombatLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombatLog" ADD CONSTRAINT "CombatLog_combatId_fkey" FOREIGN KEY ("combatId") REFERENCES "Combat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Npc" ADD CONSTRAINT "Npc_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcAttribute" ADD CONSTRAINT "NpcAttribute_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "Npc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCondition" ADD CONSTRAINT "ParticipantCondition_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "CombatParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCondition" ADD CONSTRAINT "ParticipantCondition_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

