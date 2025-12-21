import { EventsModule } from './gateways/events.module';
import { Module } from '@nestjs/common';
import { FilesModule } from './../files/files.module';
import { VenteMetierModule } from './vente/vente.module';
import { ProduitMetierModule } from './produit/produit.module';
import { ClientMetierModule } from './client/client.module';
import { DashboardMetierModule } from './dashboard/dashboard.module';

@Module({
    imports: [
        // Config
        EventsModule,
        FilesModule,
        VenteMetierModule,
        ProduitMetierModule,
        ClientMetierModule,
        DashboardMetierModule,

    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class MetierModule { }

