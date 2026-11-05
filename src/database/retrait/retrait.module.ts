import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetraitService } from './retrait.service';
import { RetraitController } from './retrait.controller';
import { RetraitEntity } from './retrait.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RetraitEntity])],
  controllers: [RetraitController],
  providers: [RetraitService],
  exports: [RetraitService],
})
export class RetraitModule {} 