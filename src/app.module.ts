import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { CharacterModule } from './character/character.module';
import { RollModule } from './roll/roll.module';
import { CombatModule } from './combat/combat.module';
import { NpcModule } from './npc/npc.module';
import { GatewayModule } from './gateway/gateway.module';
import { SeedsModule } from './seeds/seeds.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { TechniqueTemplateModule } from './technique-template/technique-template.module';
import { ItemModule } from './item/item.module';
import { InventoryModule } from './inventory/inventory.module';
import { TalentoModule } from './talento/talento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CampaignModule,
    CharacterModule,
    RollModule,
    CombatModule,
    NpcModule,
    GatewayModule,
    SeedsModule,
    SpecializationsModule,
    TechniqueTemplateModule,
    ItemModule,
    InventoryModule,
    TalentoModule,
  ],
})
export class AppModule {}
