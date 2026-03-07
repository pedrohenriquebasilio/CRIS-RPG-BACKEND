import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
