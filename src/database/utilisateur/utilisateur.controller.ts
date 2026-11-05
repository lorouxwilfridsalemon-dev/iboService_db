import {
  Catch,
  Controller,
  Get,
} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  Delete, 
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurDto } from './utilisateur.dto';

/**
 * Contrôleur CRUD de base pour les utilisateurs.
 *
 * ⚠️ Ce contrôleur ne fait QUE le CRUD.
 * La logique métier est dans `src/metier/utilisateur/`.
 */
@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('utilisateur')
export class UtilisateurController {
  constructor(
    private readonly utilisateurService: UtilisateurService,
  ) {}

  @Post()
  async save(
    @Body(new ValidationPipe()) utilisateurDto: UtilisateurDto,
  ) {
    return this.utilisateurService.save(utilisateurDto);
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) utilisateurDto: UtilisateurDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey: any,
  ) {
    return this.utilisateurService.update(utilisateurDto, primaryKey);
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey: any) {
    return this.utilisateurService.delete(primaryKey);
  }

  @Get()
  async find() {
    return this.utilisateurService.find({});
  }

  @Get('query/:findOption')
  async findQuery(
    @Param('findOption', new ParseJsonObjectPipe()) findOption: any,
  ) {
    return this.utilisateurService.find(findOption);
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey: any) {
    return this.utilisateurService.findById(primaryKey);
  }
}