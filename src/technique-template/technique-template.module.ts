import { Module } from '@nestjs/common';
import { TechniqueTemplateController } from './technique-template.controller';
import { TechniqueTemplateService } from './technique-template.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TechniqueTemplateController],
  providers: [TechniqueTemplateService],
})
export class TechniqueTemplateModule {}
