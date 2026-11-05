import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriEntity } from '../../database/favori/favori.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { FavoriMetierController } from './favori-metier.controller';
import { FavoriMetierService } from './favori-metier.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriEntity, AnnonceEntity])],
  controllers: [FavoriMetierController],
  providers: [FavoriMetierService],
  exports: [FavoriMetierService],
})
export class FavoriMetierModule {}