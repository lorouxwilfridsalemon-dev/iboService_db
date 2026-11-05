import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceEntity } from './annonce.entity';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceEntity])],
  controllers: [AnnonceController],
  providers: [AnnonceService],
  exports: [AnnonceService],
})
export class AnnonceModule {}

