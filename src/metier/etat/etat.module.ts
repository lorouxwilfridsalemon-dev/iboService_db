import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { EtatMetierController } from './etat.controller';
import { EtatMetierService } from './etat.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [EtatMetierController],
    providers: [EtatMetierService],
    exports: [],
})
export class EtatMetierModule { }
