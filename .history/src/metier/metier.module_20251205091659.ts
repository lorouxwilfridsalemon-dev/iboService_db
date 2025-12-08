import { EventsModule } from './gateways/events.module';
import { Module } from '@nestjs/common';
import { FilesModule } from './../files/files.module';
import { VenteMetierModule } from './vente/vente.module';
import { EtatMetierModule } from './etat/etat.module';

@Module({
    imports: [
        // Config
        EventsModule,
        FilesModule,
        VenteMetierModule,
        EtatMetierModule,
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class MetierModule {}

