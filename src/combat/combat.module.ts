import { Module } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { RollModule } from '../roll/roll.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [RollModule, GatewayModule],
  providers: [CombatService],
  controllers: [CombatController],
  exports: [CombatService],
})
export class CombatModule {}
