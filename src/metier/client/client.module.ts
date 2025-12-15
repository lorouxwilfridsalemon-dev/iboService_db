import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMetierController } from './client.controller';
import { ClientMetierService } from './client.service';
import { ClientEntity } from '../../database/client/client.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
      TypeClientEntity,
    ]),
  ],
  controllers: [ClientMetierController],
  providers: [ClientMetierService],
  exports: [ClientMetierService],
})
export class ClientMetierModule {}



