import { Module } from '@nestjs/common';
import { SeedsController } from './seeds.controller';

@Module({
  controllers: [SeedsController],
})
export class SeedsModule {}
