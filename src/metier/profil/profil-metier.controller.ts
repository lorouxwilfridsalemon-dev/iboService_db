// import {
//   Controller,
//   Post,
//   Body,
//   HttpException,
//   HttpStatus,
//   Logger,
//   Put,
//   UseGuards,
//   Request,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { existsSync, mkdirSync } from 'fs';
// import { ProfilMetierService } from './profil-metier.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// class UpdateProfilDto {
//   nom: string;
//   prenom: string;
//   contact: string;
// }

// @Controller('metier/profil')
// export class ProfilMetierController {
//   private readonly logger = new Logger(ProfilMetierController.name);

//   constructor(private readonly profilMetierService: ProfilMetierService) {}

//   /**
//    * PUT /metier/profil/informations-personnelles
//    */
//   @Put('informations-personnelles')
//   @UseGuards(JwtAuthGuard)
//   async updateInformationsPersonnelles(
//     @Request() req,
//     @Body() updateProfilDto: UpdateProfilDto,
//   ) {
//     try {
//       const userId = req.user.id;

//       const result = await this.profilMetierService.updateInformationsPersonnelles(
//         userId,
//         {
//           nom: updateProfilDto.nom,
//           prenom: updateProfilDto.prenom,
//           contact: updateProfilDto.contact,
//         },
//       );

//       return {
//         success: true,
//         message: 'Profil mis à jour avec succès',
//         data: result,
//       };
//     } catch (error) {
//       this.logger.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
//       throw new HttpException(
//         {
//           success: false,
//           message: error.message || 'Une erreur est survenue lors de la mise à jour.',
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   /**
//    * ✅ AJOUT : POST /metier/profil/photo
//    * Upload de la photo de profil (multipart, champ 'photo'), remplace
//    * l'ancienne photo si elle existait. Suit le même schéma que
//    * FileFieldsInterceptor utilisé pour publier une annonce (CV/pièce).
//    */
//   @Post('photo')
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(
//     FileInterceptor('photo', {
//       storage: diskStorage({
//         destination: (req, file, callback) => {
//           const uploadPath = './uploads/profils';
//           if (!existsSync(uploadPath)) {
//             mkdirSync(uploadPath, { recursive: true });
//           }
//           callback(null, uploadPath);
//         },
//         filename: (req, file, callback) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, callback) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
//           return callback(
//             new BadRequestException(
//               'La photo doit être au format jpg, jpeg, png ou webp',
//             ),
//             false,
//           );
//         }
//         callback(null, true);
//       },
//       limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max, une photo de profil
//     }),
//   )
//   async uploaderPhoto(
//     @Request() req,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     if (!file) {
//       throw new BadRequestException('Aucune photo reçue');
//     }

//     try {
//       const userId = req.user.id;
//       const result = await this.profilMetierService.updatePhoto(
//         userId,
//         file.filename,
//       );

//       return {
//         success: true,
//         message: 'Photo de profil mise à jour avec succès',
//         data: result,
//       };
//     } catch (error) {
//       this.logger.error(`Erreur lors de l'upload de la photo: ${error.message}`);
//       throw new HttpException(
//         {
//           success: false,
//           message: error.message || "Erreur lors de l'envoi de la photo.",
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }
// }


import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Put,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ProfilMetierService } from './profil-metier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

class UpdateProfilDto {
  nom: string;
  prenom: string;
  contact: string;
}

@Controller('metier/profil')
export class ProfilMetierController {
  private readonly logger = new Logger(ProfilMetierController.name);

  constructor(private readonly profilMetierService: ProfilMetierService) {}

  /**
   * PUT /metier/profil/informations-personnelles
   */
  @Put('informations-personnelles')
  @UseGuards(JwtAuthGuard)
  async updateInformationsPersonnelles(
    @Request() req,
    @Body() updateProfilDto: UpdateProfilDto,
  ) {
    try {
      const userId = req.user.id;

      const result = await this.profilMetierService.updateInformationsPersonnelles(
        userId,
        {
          nom: updateProfilDto.nom,
          prenom: updateProfilDto.prenom,
          contact: updateProfilDto.contact,
        },
      );

      return {
        success: true,
        message: 'Profil mis à jour avec succès',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Une erreur est survenue lors de la mise à jour.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * POST /metier/profil/photo
   */
  @Post('photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads/profils';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return callback(
            new BadRequestException(
              'La photo doit être au format jpg, jpeg, png ou webp',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploaderPhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune photo reçue');
    }

    try {
      const userId = req.user.id;
      const result = await this.profilMetierService.updatePhoto(
        userId,
        file.filename,
      );

      return {
        success: true,
        message: 'Photo de profil mise à jour avec succès',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload de la photo: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: error.message || "Erreur lors de l'envoi de la photo.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ====================================================================
  // ✅ AJOUT : gestion des "Profils" (types de comptes) pour le dashboard.
  // ====================================================================

  @Get('listeProfils')
  async listeProfils() {
    return this.profilMetierService.listeProfils();
  }

  @Post('ajouterProfil')
  async ajouterProfil(@Body() body: any, @Request() req) {
    const idUsrConnecte = req.user?.id ?? 1;
    return this.profilMetierService.ajouterProfil(body, idUsrConnecte);
  }

  @Put('modifierProfil/:id')
  async modifierProfil(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.profilMetierService.modifierProfil(id, body);
  }

  @Delete('supprimerProfil/:id')
  async supprimerProfil(@Param('id', ParseIntPipe) id: number) {
    return this.profilMetierService.supprimerProfil(id);
  }
}