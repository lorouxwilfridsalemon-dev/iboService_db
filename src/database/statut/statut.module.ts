import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutEntity } from './statut.entity';
import { StatutService } from './statut.service';
import { StatutController } from './statut.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatutEntity])],
  controllers: [StatutController],
  providers: [StatutService],
  exports: [StatutService],
})
export class StatutModule {}
