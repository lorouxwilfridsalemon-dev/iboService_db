import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisEntity } from './avis.entity';
import { AvisService } from './avis.service';
import { AvisController } from './avis.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AvisEntity])],
  controllers: [AvisController],
  providers: [AvisService],
  exports: [AvisService],
})
export class AvisModule {}

