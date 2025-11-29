import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchatEntity } from './achat.entity';
import { AchatService } from './achat.service';
import { AchatController } from './achat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AchatEntity])],
  controllers: [AchatController],
  providers: [AchatService],
  exports: [AchatService],
})
export class AchatModule {}

