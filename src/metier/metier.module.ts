import { EventsModule } from './gateways/events.module';
import { Module } from '@nestjs/common';
import { FilesModule } from './../files/files.module';
// import { ClientMetierModule } from './client/client.module';

@Module({
    imports: [
        // Config
        EventsModule,
        FilesModule,
    ],
    providers: [],
    controllers: [],
    exports: [],
})
export class MetierModule {}
