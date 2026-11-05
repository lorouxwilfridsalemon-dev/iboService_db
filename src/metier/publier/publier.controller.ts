



import { Body, Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PublierMetierService } from './publier.service';

@Controller('metier/publier')
export class PublierMetierController {

  constructor(private readonly publierMetierService: PublierMetierService) { }

  @Post('annonce')
  // ✅ CORRIGÉ : FilesInterceptor('files', 10, ...) → FileFieldsInterceptor.
  // L'ancienne version n'acceptait qu'un seul champ nommé 'files'. Depuis
  // l'ajout du CV et de la pièce d'identité côté Flutter
  // (publier_services.dart envoie désormais 3 champs distincts : 'files',
  // 'cv', 'piece'), Multer rejetait la requête entière avec une erreur 400
  // dès qu'il recevait un champ inattendu — d'où "Erreur serveur (400)"
  // au moment de publier.
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'files', maxCount: 10 },
      { name: 'cv', maxCount: 1 },
      { name: 'piece', maxCount: 1 },
    ],
    {
      // ✅ Création automatique du dossier s'il n'existe pas
      storage: diskStorage({
        destination: (req, file, callback) => {
          // ✅ Les documents (CV/pièce) vont dans un sous-dossier séparé
          // des photos/vidéos d'annonces, pour rester bien organisés.
          const uploadPath =
            file.fieldname === 'cv' || file.fieldname === 'piece'
              ? './uploads/documents'
              : './uploads/annonces';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      // ✅ Filtre adapté selon le champ : images/vidéos pour 'files',
      // PDF/Word/images pour 'cv' et 'piece'.
      fileFilter: (req, file, callback) => {
        if (file.fieldname === 'files') {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|avi|mov|mkv|3gp|flv|wmv)$/i)) {
            return callback(
              new BadRequestException('Seuls les fichiers images (jpg, jpeg, png, gif, webp) et vidéos (mp4, avi, mov, mkv...) sont autorisés'),
              false
            );
          }
        } else if (file.fieldname === 'cv') {
          if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
            return callback(
              new BadRequestException('Le CV doit être un fichier PDF ou Word (.pdf, .doc, .docx)'),
              false
            );
          }
        } else if (file.fieldname === 'piece') {
          if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
            return callback(
              new BadRequestException('La pièce d\'identité doit être une image (jpg, jpeg, png) ou un PDF'),
              false
            );
          }
        }
        callback(null, true);
      },
      // ✅ Limite de taille : 100 Mo maximum par fichier
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    },
  ))
  async publierAnnonce(
    @Body() annonceData: any,
    @UploadedFiles()
    uploadedFiles: {
      files?: Express.Multer.File[];
      cv?: Express.Multer.File[];
      piece?: Express.Multer.File[];
    },
  ) {
    try {
      const files = uploadedFiles?.files ?? [];
      const cvFile = uploadedFiles?.cv?.[0] ?? null;
      const pieceFile = uploadedFiles?.piece?.[0] ?? null;

      console.log(
        `📸🎬 ${files.length} fichiers reçus pour l'annonce, ` +
        `CV: ${cvFile ? 'oui' : 'non'}, Pièce: ${pieceFile ? 'oui' : 'non'}.`,
      );

      // ✅ On sépare les images et les vidéos pour les envoyer proprement au service
      const images = files.filter(file => file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i));
      const videos = files.filter(file => file.originalname.match(/\.(mp4|avi|mov|mkv|3gp|flv|wmv)$/i));

      // ⚠️ Signature étendue : le service doit maintenant accepter cvFile et
      // pieceFile en 4e/5e paramètres pour enregistrer leurs noms dans les
      // colonnes doc_cv / piece de l'annonce. Voir publier.service.ts.
      return await this.publierMetierService.publierAnnonce(
        annonceData,
        images,
        videos,
        cvFile,
        pieceFile,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error('❌ Erreur lors de la publication:', errorMessage);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        { success: false, message: 'Erreur interne du serveur lors de la publication' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}