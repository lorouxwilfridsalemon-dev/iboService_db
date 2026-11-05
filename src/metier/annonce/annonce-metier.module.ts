import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { AnnonceMetierController } from './annonce-metier.controller';
import { AnnonceMetierService } from './annonce-metier.service';
// import { AnnonceEntity } from 'src/database/sous_categories/sous_categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceEntity])],
  controllers: [AnnonceMetierController],
  providers: [AnnonceMetierService],
  exports: [AnnonceMetierService],
})
export class AnnonceMetierModule {}
