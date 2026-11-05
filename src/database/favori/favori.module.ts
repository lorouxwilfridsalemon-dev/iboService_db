import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriEntity } from './favori.entity';
import { FavoriService } from './favori.service';
import { FavoriController } from './favori.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriEntity])],
  controllers: [FavoriController],
  providers: [FavoriService],
  exports: [FavoriService],
})
export class FavoriModule {}

