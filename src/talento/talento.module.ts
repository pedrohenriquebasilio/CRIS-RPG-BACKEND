import { Module } from '@nestjs/common';
import { TalentoController } from './talento.controller';
import { TalentoService } from './talento.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TalentoController],
  providers: [TalentoService],
  exports: [TalentoService],
})
export class TalentoModule {}
