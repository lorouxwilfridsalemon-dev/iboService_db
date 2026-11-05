import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceImageEntity } from './annonce_image.entity';
import { AnnonceImageService } from './annonce_image.service';
import { AnnonceImageController } from './annonce_image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceImageEntity])],
  controllers: [AnnonceImageController],
  providers: [AnnonceImageService],
  exports: [AnnonceImageService],
})
export class AnnonceImageModule {}

