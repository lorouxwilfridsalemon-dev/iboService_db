import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeClientEntity } from './type_client.entity';
import { TypeClientService } from './type_client.service';
import { TypeClientController } from './type_client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeClientEntity])],
  controllers: [TypeClientController],
  providers: [TypeClientService],
  exports: [TypeClientService],
})
export class TypeClientModule {}

