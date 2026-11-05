


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';   // ✅ AJOUT
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { MetierModule } from './metier/metier.module';
import { AuthModule } from './metier/auth/auth.module';

@Module({
  imports: [ 
    // ✅ AJOUT : DOIT ÊTRE EN PREMIER
    // Charge le fichier .env et rend les variables accessibles partout
    // via process.env ou ConfigService.
    ConfigModule.forRoot({
      isGlobal: true,          // ✅ Accessible dans TOUS les modules
      envFilePath: '.env',     // ✅ Emplacement du fichier
    }),

    // Modules existants (inchangés)
    DatabaseModule,
    MetierModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
