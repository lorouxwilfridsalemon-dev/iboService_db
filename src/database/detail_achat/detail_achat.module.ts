import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailAchatEntity } from './detail_achat.entity';
import { DetailAchatService } from './detail_achat.service';
import { DetailAchatController } from './detail_achat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetailAchatEntity])],
  controllers: [DetailAchatController],
  providers: [DetailAchatService],
  exports: [DetailAchatService],
})
export class DetailAchatModule {}

