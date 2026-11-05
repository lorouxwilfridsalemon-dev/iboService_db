import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailImmobilierEntity } from './detail_immobilier.entity';
import { DetailImmobilierService } from './detail_immobilier.service';
import { DetailImmobilierController } from './detail_immobilier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetailImmobilierEntity])],
  controllers: [DetailImmobilierController],
  providers: [DetailImmobilierService],
  exports: [DetailImmobilierService],
})
export class DetailImmobilierModule {}

