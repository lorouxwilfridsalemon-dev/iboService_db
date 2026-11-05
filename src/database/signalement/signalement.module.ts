import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignalementEntity } from './signalement.entity';
import { SignalementService } from './signalement.service';
import { SignalementController } from './signalement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SignalementEntity])],
  controllers: [SignalementController],
  providers: [SignalementService],
  exports: [SignalementService],
})
export class SignalementModule {}

