import { EventsModule } from './gateways/events.module';
import { Module } from '@nestjs/common';
import { FilesModule } from './../files/files.module';
import { VenteMetierModule } from './vente/vente.module';

@Module({
    imports: [
        // Config
        EventsModule,
        FilesModule,
        VenteMetierModule,
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class MetierModule {}

