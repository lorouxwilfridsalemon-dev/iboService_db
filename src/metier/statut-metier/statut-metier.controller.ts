// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { unlink } from 'fs/promises';
// import { StatutMetierService } from './statut-metier.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { multerStatutsOptions } from '../../upload.config';

// @Controller('metier/statut')
// @UseGuards(JwtAuthGuard)
// export class StatutMetierController {
//   constructor(private readonly statutMetierService: StatutMetierService) {}

//   // ============================================================
//   // POST /metier/statut/creer
//   // ============================================================
//   @Post('creer')
//   @UseInterceptors(FileInterceptor('file', multerStatutsOptions))
//   async creer(
//     @CurrentUser() user: any,
//     @UploadedFile() file: Express.Multer.File,
//     @Body('type') type: string,
//     @Body('contenu') contenu?: string,
//     @Body('couleurFond') couleurFond?: string,
//   ) {
//     const userId = Number(user?.id);
//     if (!Number.isSafeInteger(userId) || userId <= 0) {
//       throw new BadRequestException('Utilisateur non identifié');
//     }

//     if (!['image', 'video', 'texte'].includes(type)) {
//       if (file?.path) await unlink(file.path).catch(() => {});
//       throw new BadRequestException('type invalide');
//     }

//     if ((type === 'image' || type === 'video') && !file) {
//       throw new BadRequestException('Fichier manquant');
//     }

//     if (type === 'texte' && !contenu) {
//       throw new BadRequestException('Contenu manquant');
//     }

//     return this.statutMetierService.creerStatut(
//       userId,
//       type as any,
//       file?.filename ?? null,
//       contenu ?? null,
//       couleurFond ?? null,
//     );
//   }

//   // ============================================================
//   // GET /metier/statut/liste
//   // ============================================================
//   @Get('liste')
//   async liste(@CurrentUser() user: any) {
//     return this.statutMetierService.getStatuts(Number(user?.id));
//   }

//   // ============================================================
//   // POST /metier/statut/:id/vu
//   // ============================================================
//   @Post(':id/vu')
//   async marquerVu(
//     @CurrentUser() user: any,
//     @Param('id', ParseIntPipe) id: number,
//   ) {
//     return this.statutMetierService.marquerCommeVu(id, Number(user?.id));
//   }

//   // ============================================================
//   // DELETE /metier/statut/:id
//   // ============================================================
//   @Delete(':id')
//   async supprimer(
//     @CurrentUser() user: any,
//     @Param('id', ParseIntPipe) id: number,
//   ) {
//     return this.statutMetierService.supprimerStatut(id, Number(user?.id));
//   }
// }






import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';
import { StatutMetierService } from './statut-metier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  multerStatutsOptions,
  TYPES_STATUTS_AUTORISES,
} from '../../upload.config';
 
const LONGUEUR_MAX_TEXTE = 300;
 
@Controller('metier/statut')
@UseGuards(JwtAuthGuard)
export class StatutMetierController {
  private readonly logger = new Logger(StatutMetierController.name);
 
  constructor(private readonly statutMetierService: StatutMetierService) {}
 
  // Supprime le fichier déjà écrit sur le disque (en cas d'erreur)
  private async nettoyer(file?: Express.Multer.File) {
    if (file?.path) {
      await unlink(file.path).catch(() => undefined);
    }
  }
 
  // ============================================================
  // POST /metier/statut/creer
  // multipart/form-data : "file" (image/vidéo), "type", "contenu", "couleurFond"
  // ============================================================
  @Post('creer')
  @UseInterceptors(FileInterceptor('file', multerStatutsOptions))
  async creer(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') typeBrut: string,
    @Body('contenu') contenuBrut?: string,
    @Body('couleurFond') couleurFond?: string,
  ) {
    const type = String(typeBrut ?? '').toLowerCase().trim();
    const contenu = (contenuBrut ?? '').toString().trim();
 
    this.logger.log(
      `📝 Création statut — type: ${type} | fichier: ${file?.filename ?? 'aucun'} | texte: ${contenu.length} caractères`,
    );
 
    const userId = Number(user?.id);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      await this.nettoyer(file);
      throw new BadRequestException('Utilisateur non identifié');
    }
 
    if (!TYPES_STATUTS_AUTORISES.includes(type)) {
      await this.nettoyer(file);
      throw new BadRequestException(
        `type invalide (attendu : ${TYPES_STATUTS_AUTORISES.join(', ')})`,
      );
    }
 
    if ((type === 'image' || type === 'video') && !file) {
      throw new BadRequestException(
        'Fichier manquant (le champ doit s\'appeler "file")',
      );
    }
 
    if (type === 'texte' && !contenu) {
      await this.nettoyer(file);
      throw new BadRequestException('Contenu manquant');
    }
 
    try {
      return await this.statutMetierService.creerStatut(
        userId,
        type as any,
        file?.filename ?? null,
        contenu ? contenu.substring(0, LONGUEUR_MAX_TEXTE) : null,
        couleurFond ?? null,
      );
    } catch (error: any) {
      // 🔍 Log complet : c'est ici qu'on verra une erreur SQL (emoji, colonne…)
      this.logger.error(
        `❌ Échec création statut : ${error?.message}`,
        error?.stack,
      );
      await this.nettoyer(file);
      throw error;
    }
  }
 
  // ============================================================
  // GET /metier/statut/liste
  // ============================================================
  @Get('liste')
  async liste(@CurrentUser() user: any) {
    return this.statutMetierService.getStatuts(Number(user?.id));
  }
 
  // ============================================================
  // POST /metier/statut/:id/vu
  // ============================================================
  @Post(':id/vu')
  async marquerVu(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.statutMetierService.marquerCommeVu(id, Number(user?.id));
  }
 
  // ============================================================
  // DELETE /metier/statut/:id
  // ============================================================
  @Delete(':id')
  async supprimer(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.statutMetierService.supprimerStatut(id, Number(user?.id));
  }
}