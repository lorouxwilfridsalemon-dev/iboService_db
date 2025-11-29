import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { MetierModule } from './metier/metier.module';

@Module({
  imports: [DatabaseModule, MetierModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
