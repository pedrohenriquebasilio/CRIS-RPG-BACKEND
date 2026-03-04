import { Module } from '@nestjs/common';
import { NpcService } from './npc.service';
import { NpcController } from './npc.controller';

@Module({
  providers: [NpcService],
  controllers: [NpcController],
  exports: [NpcService],
})
export class NpcModule {}
