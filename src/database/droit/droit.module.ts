import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DroitEntity } from './droit.entity';
import { DroitService } from './droit.service';
import { DroitController } from './droit.controller';


@Module({
  imports: [TypeOrmModule.forFeature([DroitEntity])],
  controllers: [DroitController],
  providers: [DroitService],
  exports: [DroitService],
})
export class DroitModule {}
