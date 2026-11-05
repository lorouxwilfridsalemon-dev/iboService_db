import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilEntity } from './profil.entity';
import { ProfilService } from './profil.service';
import { ProfilController } from './profil.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ProfilEntity])],
  controllers: [ProfilController],
  providers: [ProfilService],
  exports: [ProfilService],
})
export class ProfilModule {}
