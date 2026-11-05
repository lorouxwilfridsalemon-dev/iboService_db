// import { 
//   Controller, 
//   Get, 
//   Post, 
//   Put, 
//   Delete, 
//   Body, 
//   Param, 
//   HttpException, 
//   HttpStatus, 
//   Logger,
//   UseGuards,
//   UseInterceptors,
//   Query
// } from '@nestjs/common';
// import { UtilisateurMetierService } from './utilisateur-metier.service';
// // import { UtilisateurDto } from '../utilisateur/utilisateur.dto';
// import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
// import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
// import { UtilisateurDto } from 'src/database/utilisateur/utilisateur.dto';
// // import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// @Controller('metier/utilisateur')
// @UseInterceptors(LoggingInterceptor)
// export class UtilisateurMetierController {
//   private readonly logger = new Logger(UtilisateurMetierController.name);
  
//   constructor(
//     private readonly utilisateurMetierService: UtilisateurMetierService,
//   ) {}

//   /**
//    * Récupérer tous les utilisateurs
//    * GET /metier/utilisateur
//    */
//   @Get()
//   // @UseGuards(JwtAuthGuard)
//   async findAll() {
//     this.logger.log('Requête pour récupérer tous les utilisateurs');
    
//     try {
//       const utilisateurs = await this.utilisateurMetierService.findAll();
//       return {
//         success: true,
//         data: utilisateurs,
//         message: `${utilisateurs.length} utilisateur(s) trouvé(s)`
//       };
//     } catch (error) {
//       this.logger.error(`Erreur findAll: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la récupération des utilisateurs',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   /**
//    * Récupérer un utilisateur par son ID
//    * GET /metier/utilisateur/:id
//    */
//   @Get(':id')
//   // @UseGuards(JwtAuthGuard)
//   async findById(@Param('id') id: number) {
//     this.logger.log(`Requête pour récupérer l'utilisateur ID: ${id}`);
    
//     try {
//       const utilisateur = await this.utilisateurMetierService.findById(id);
//       return {
//         success: true,
//         data: utilisateur,
//         message: 'Utilisateur trouvé avec succès'
//       };
//     } catch (error) {
//       this.logger.error(`Erreur findById pour ID ${id}: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la recherche de l\'utilisateur',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   /**
//    * Créer un nouvel utilisateur
//    * POST /metier/utilisateur
//    */
//   @Post()
//   // @UseGuards(JwtAuthGuard)
//   async create(@Body(new ValidationPipe()) utilisateurDto: UtilisateurDto) {
//     this.logger.log('Requête pour créer un nouvel utilisateur');
//     this.logger.debug(`Données reçues: ${JSON.stringify(utilisateurDto)}`);
    
//     try {
//       const utilisateur = await this.utilisateurMetierService.create(utilisateurDto);
//       return {
//         success: true,
//         data: utilisateur,
//         message: 'Utilisateur créé avec succès'
//       };
//     } catch (error) {
//       this.logger.error(`Erreur create: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la création de l\'utilisateur',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   /**
//    * Mettre à jour un utilisateur
//    * PUT /metier/utilisateur/:id
//    */
//   @Put(':id')
//   // @UseGuards(JwtAuthGuard)
//   async update(
//     @Param('id') id: number,
//     @Body(new ValidationPipe()) utilisateurDto: Partial<UtilisateurDto>
//   ) {
//     this.logger.log(`Requête pour mettre à jour l'utilisateur ID: ${id}`);
//     this.logger.debug(`Données de mise à jour: ${JSON.stringify(utilisateurDto)}`);
    
//     try {
//       const utilisateur = await this.utilisateurMetierService.update(id, utilisateurDto);
//       return {
//         success: true, 
//         data: utilisateur,
//         message: 'Utilisateur mis à jour avec succès'
//       };
//     } catch (error) {
//       this.logger.error(`Erreur update pour ID ${id}: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la mise à jour de l\'utilisateur',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   /**
//    * Supprimer un utilisateur
//    * DELETE /metier/utilisateur/:id
//    */
//   @Delete(':id')
//   // @UseGuards(JwtAuthGuard)
//   async delete(@Param('id') id: number) {
//     this.logger.log(`Requête pour supprimer l'utilisateur ID: ${id}`);
    
//     try {
//       const result = await this.utilisateurMetierService.delete(id);
//       return {
//         success: true,
//         data: null,
//         message: result.message
//       };
//     } catch (error) {
//       this.logger.error(`Erreur delete pour ID ${id}: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la suppression de l\'utilisateur',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   /**
//    * Rechercher des utilisateurs avec critères
//    * GET /metier/utilisateur/search/recherche?nom=Doe&prenom=John
//    */
//   @Get('search/recherche')
//   // @UseGuards(JwtAuthGuard)
//   async search(
//     @Query('nom') nom?: string,
//     @Query('prenom') prenom?: string,
//     @Query('email') email?: string,
//     @Query('profil') profil?: number
//   ) {
//     this.logger.log('Requête de recherche utilisateurs');
    
//     try {
//       const utilisateurs = await this.utilisateurMetierService.search({
//         nom,
//         prenom,
//         email,
//         profil
//       });
      
//       return {
//         success: true,
//         data: utilisateurs,
//         message: `${utilisateurs.length} utilisateur(s) trouvé(s)`
//       };
//     } catch (error) {
//       this.logger.error(`Erreur search: ${error.message}`);
//       throw new HttpException(
//         error.message || 'Erreur lors de la recherche des utilisateurs',
//         error.status || HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }
// }

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
  Query,
  Request,
} from '@nestjs/common';
import { UtilisateurMetierService } from './utilisateur-metier.service';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
// ✅ CORRIGÉ : DTO dédié (CreerUtilisateurDto/ModifierUtilisateurDto)
// au lieu du DTO générique UtilisateurDto, qui exigeait
// geler/dateCreation/idusrcreation du client et provoquait un 400.
import { CreerUtilisateurDto, ModifierUtilisateurDto } from './utilisateur-metier.dto';

@Controller('metier/utilisateur')
@UseInterceptors(LoggingInterceptor)
export class UtilisateurMetierController {
  private readonly logger = new Logger(UtilisateurMetierController.name);

  constructor(
    private readonly utilisateurMetierService: UtilisateurMetierService,
  ) {}

  @Get()
  async findAll() {
    try {
      const utilisateurs = await this.utilisateurMetierService.findAll();
      return {
        success: true,
        data: utilisateurs,
        message: `${utilisateurs.length} utilisateur(s) trouvé(s)`,
      };
    } catch (error) {
      this.logger.error(`Erreur findAll: ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des utilisateurs',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search/recherche')
  async search(
    @Query('nom') nom?: string,
    @Query('prenom') prenom?: string,
    @Query('email') email?: string,
    @Query('profil') profil?: number,
  ) {
    try {
      const utilisateurs = await this.utilisateurMetierService.search({ nom, prenom, email, profil });
      return {
        success: true,
        data: utilisateurs,
        message: `${utilisateurs.length} utilisateur(s) trouvé(s)`,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la recherche des utilisateurs',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const utilisateur = await this.utilisateurMetierService.findById(id);
      return { success: true, data: utilisateur, message: 'Utilisateur trouvé avec succès' };
    } catch (error) {
      this.logger.error(`Erreur findById pour ID ${id}: ${error.message}`);
      throw new HttpException(
        error.message || "Erreur lors de la recherche de l'utilisateur",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() dto: CreerUtilisateurDto, @Request() req) {
    try {
      const idUsrConnecte = req.user?.id ?? 1;
      const utilisateur = await this.utilisateurMetierService.create(dto, idUsrConnecte);
      return { success: true, data: utilisateur, message: 'Utilisateur créé avec succès' };
    } catch (error) {
      this.logger.error(`Erreur create: ${error.message}`);
      throw new HttpException(
        error.message || "Erreur lors de la création de l'utilisateur",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ModifierUtilisateurDto) {
    try {
      const utilisateur = await this.utilisateurMetierService.update(id, dto);
      return { success: true, data: utilisateur, message: 'Utilisateur mis à jour avec succès' };
    } catch (error) {
      this.logger.error(`Erreur update pour ID ${id}: ${error.message}`);
      throw new HttpException(
        error.message || "Erreur lors de la mise à jour de l'utilisateur",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.utilisateurMetierService.delete(id);
      return { success: true, data: null, message: result.message };
    } catch (error) {
      this.logger.error(`Erreur delete pour ID ${id}: ${error.message}`);
      throw new HttpException(
        error.message || "Erreur lors de la suppression de l'utilisateur",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 