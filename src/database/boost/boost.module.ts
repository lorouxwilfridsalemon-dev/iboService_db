import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoostEntity } from './boost.entity';
import { BoostService } from './boost.service';
import { BoostController } from './boost.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BoostEntity])],
  controllers: [BoostController],
  providers: [BoostService],
  exports: [BoostService],
})
export class BoostModule {}