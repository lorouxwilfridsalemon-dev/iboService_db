import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeEntity } from './employe.entity';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeEntity])],
  controllers: [EmployeController],
  providers: [EmployeService],
  exports: [EmployeService],
})
export class EmployeModule {}
