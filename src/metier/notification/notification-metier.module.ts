import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../../database/notification/notification.entity';
import { NotificationMetierController } from './notification-metier.controller';
import { NotificationMetierService } from './notification-metier.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationMetierController],
  providers: [NotificationMetierService],
  // ✅ IMPORTANT : exporté pour que ReservationMetierModule (et plus tard
  // PublierMetierModule, un futur MessageMetierModule...) puisse importer
  // ce module et injecter NotificationMetierService pour créer des
  // notifications depuis d'autres fonctionnalités.
  exports: [NotificationMetierService],
})
export class NotificationMetierModule {} 