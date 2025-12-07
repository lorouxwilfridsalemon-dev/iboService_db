import { DatabaseModule } from '../../database/database.module';
import { Module } from '@nestjs/common';
import { VisiteMetierController } from './visite.controller';
import { VisiteMetierService } from './visite.service';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [VisiteMetierController],
    providers: [VisiteMetierService],
    exports: [],
})
export class VisiteMetierModule { }
