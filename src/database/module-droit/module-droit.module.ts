import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleDroitEntity } from './module-droit.entity';
import { ModuleDroitService } from './module-droit.service';
import { ModuleDroitController } from './module-droit.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ModuleDroitEntity])],
  controllers: [ModuleDroitController],
  providers: [ModuleDroitService],
  exports: [ModuleDroitService],
})
export class ModuleDroitModule {}
