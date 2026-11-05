


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '../../database/message/message.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { MessageMetierController } from './message-metier.controller';
import { MessageMetierService } from './message-metier.service';
import { MessageModule } from '../../database/message/message.module';
import { NotificationMetierModule } from '../notification/notification-metier.module';
// ✅ AJOUT : la passerelle WebSocket pour le temps réel.
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, AnnonceEntity]),
    MessageModule,
    NotificationMetierModule,
  ],
  controllers: [MessageMetierController],
  providers: [MessageMetierService, MessagesGateway],
  exports: [MessageMetierService],
})
export class MessageMetierModule {}