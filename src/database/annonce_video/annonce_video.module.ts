import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceVideoEntity } from './annonce_video.entity';
import { AnnonceVideoService } from './annonce_video.service';
import { AnnonceVideoController } from './annonce_video.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnnonceVideoEntity])],
  controllers: [AnnonceVideoController],
  providers: [AnnonceVideoService],
  exports: [AnnonceVideoService],
})
export class AnnonceVideoModule {}

