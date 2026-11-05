import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalisationEntity } from './localisation.entity';
import { LocalisationService } from './localisation.service';
import { LocalisationController } from './localisation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LocalisationEntity])],
  controllers: [LocalisationController],
  providers: [LocalisationService],
  exports: [LocalisationService],
})
export class LocalisationModule {}

