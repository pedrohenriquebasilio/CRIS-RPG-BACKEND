import { Module } from '@nestjs/common';
import { RollService } from './roll.service';
import { RollController } from './roll.controller';

@Module({
  providers: [RollService],
  controllers: [RollController],
  exports: [RollService],
})
export class RollModule {}
