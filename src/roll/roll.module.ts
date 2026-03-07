import { Module } from '@nestjs/common';
import { RollService } from './roll.service';
import { RollController } from './roll.controller';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  providers: [RollService],
  controllers: [RollController],
  exports: [RollService],
})
export class RollModule {}
