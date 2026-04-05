import { Module } from '@nestjs/common';
import { GameMapController } from './game-map.controller';
import { GameMapService } from './game-map.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GameMapController],
  providers: [GameMapService],
  exports: [GameMapService],
})
export class GameMapModule {}
