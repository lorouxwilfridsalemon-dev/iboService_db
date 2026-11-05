import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristiqueEntity } from './caracteristique.entity';
import { CaracteristiqueService } from './caracteristique.service';
import { CaracteristiqueController } from './caracteristique.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaracteristiqueEntity])],
  controllers: [CaracteristiqueController],
  providers: [CaracteristiqueService],
  exports: [CaracteristiqueService],
})
export class CaracteristiqueModule {}

