// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   Query,
//   Req,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { unlink } from 'fs/promises';
// import { MessageMetierService } from './message-metier.service';
// import {
//   multerMessagesOptions,
//   TYPES_MESSAGE_AUTORISES,
// } from '../../upload.config';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @Controller('metier/message')
// @UseGuards(JwtAuthGuard)
// export class MessageMetierController {
//   constructor(private readonly messageMetierService: MessageMetierService) {}

//   // L'id vient du JWT (même champ que celui lu par la gateway : payload.id)
//   private getUserId(req: any): number {
//     const id = Number(req.user?.id);
//     if (!Number.isSafeInteger(id) || id <= 0) {
//       throw new BadRequestException('Utilisateur non identifié');
//     }
//     return id;
//   }

//   // ============================================================
//   // POST /metier/message/envoyer-fichier
//   // multipart/form-data : champs "file", "destinataireId", "typeMessage"
//   // ============================================================
//   @Post('envoyer-fichier')
//   @UseInterceptors(FileInterceptor('file', multerMessagesOptions))
//   async envoyerFichier(
//     @Req() req: any,
//     @UploadedFile() file: Express.Multer.File,
//     @Body('destinataireId') destinataireIdBrut: string,
//     @Body('typeMessage') typeMessageBrut: string,
//   ) {
//     // 🔍 Diagnostic : voir où le fichier est réellement écrit
//     console.log('📁 Fichier écrit ici :', file?.path);

//     if (!file) {
//       throw new BadRequestException(
//         'Aucun fichier reçu (le champ doit s\'appeler "file")',
//       );
//     }

//     const destinataireId = Number(destinataireIdBrut);
//     const typeMessage = String(typeMessageBrut || 'document')
//       .toLowerCase()
//       .trim();

//     // En cas d'entrée invalide, on supprime le fichier déjà écrit
//     const nettoyer = async () => {
//       try {
//         await unlink(file.path);
//       } catch {
//         /* ignoré */
//       }
//     };

//     if (!Number.isSafeInteger(destinataireId) || destinataireId <= 0) {
//       await nettoyer();
//       throw new BadRequestException('destinataireId invalide');
//     }

//     if (!TYPES_MESSAGE_AUTORISES.includes(typeMessage)) {
//       await nettoyer();
//       throw new BadRequestException(
//         `typeMessage invalide (attendu : ${TYPES_MESSAGE_AUTORISES.join(', ')})`,
//       );
//     }

//     try {
//       return await this.messageMetierService.envoyerMessageFichier(
//         this.getUserId(req),
//         destinataireId,
//         file,
//         typeMessage,
//       );
//     } catch (error) {
//       await nettoyer();
//       throw error;
//     }
//   }

//   // ============================================================
//   // POST /metier/message/envoyer
//   // ============================================================
//   @Post('envoyer')
//   async envoyer(
//     @Req() req: any,
//     @Body() body: { destinataireId: number; contenu: string; typeMessage?: string },
//   ) {
//     const contenu = String(body?.contenu ?? '').trim();
//     if (!contenu) throw new BadRequestException('Le contenu est vide');

//     return this.messageMetierService.envoyerMessage(
//       this.getUserId(req),
//       Number(body.destinataireId),
//       contenu,
//       { typeMessage: body.typeMessage },
//     );
//   }

//   // ============================================================
//   // POST /metier/message/envoyer-annonce/:annonceId
//   // ============================================================
//   @Post('envoyer-annonce/:annonceId')
//   async envoyerAnnonce(
//     @Req() req: any,
//     @Param('annonceId', ParseIntPipe) annonceId: number,
//     @Body('contenu') contenu: string,
//   ) {
//     return this.messageMetierService.envoyerMessageAnnonce(
//       this.getUserId(req),
//       annonceId,
//       String(contenu ?? '').trim(),
//     );
//   }

//   // ============================================================
//   // GET /metier/message/conversations
//   // ============================================================
//   @Get('conversations')
//   async conversations(@Req() req: any) {
//     return this.messageMetierService.getConversations(this.getUserId(req));
//   }

//   // ============================================================
//   // GET /metier/message/conversation/:autreUserId?page=1&limit=30
//   // ============================================================
//   @Get('conversation/:autreUserId')
//   async conversation(
//     @Req() req: any,
//     @Param('autreUserId', ParseIntPipe) autreUserId: number,
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//   ) {
//     return this.messageMetierService.getConversation(
//       this.getUserId(req),
//       autreUserId,
//       Number(page) || 1,
//       Number(limit) || 30,
//     );
//   }

//   // ============================================================
//   // POST /metier/message/marquer-recu/:messageId
//   // ✅ NOUVEAU : Pour passer le message de "envoye" à "recu"
//   // ============================================================
//   @Post('marquer-recu/:messageId')
//   async marquerRecu(
//     @Param('messageId', ParseIntPipe) messageId: number,
//   ) {
//     return this.messageMetierService.marquerMessageRecu(messageId);
//   }

//   // ============================================================
//   // POST /metier/message/marquer-lu
//   // ============================================================
//   @Post('marquer-lu')
//   async marquerLu(@Req() req: any, @Body('messageIds') messageIds: number[]) {
//     const ids = Array.isArray(messageIds)
//       ? messageIds.map(Number).filter((n) => Number.isSafeInteger(n))
//       : [];
//     return this.messageMetierService.marquerMessagesLus(
//       ids,
//       this.getUserId(req),
//     );
//   }

//   // ============================================================
//   // GET /metier/message/non-lus/conversations  (avant /non-lus)
//   // ============================================================
//   @Get('non-lus/conversations')
//   async nonLusParConversation(@Req() req: any) {
//     return this.messageMetierService.getMessagesNonLusParConversation(
//       this.getUserId(req),
//     );
//   }

//   // ============================================================
//   // GET /metier/message/non-lus
//   // ============================================================
//   @Get('non-lus')
//   async nonLus(@Req() req: any) {
//     return this.messageMetierService.getNombreMessagesNonLus(
//       this.getUserId(req),
//     );
//   }

//   // ============================================================
//   // GET /metier/message/rechercher?terme=...
//   // ============================================================
//   @Get('rechercher')
//   async rechercher(
//     @Req() req: any,
//     @Query('terme') terme: string,
//     @Query('page') page?: string,
//     @Query('limit') limit?: string,
//   ) {
//     return this.messageMetierService.rechercherMessages(
//       this.getUserId(req),
//       terme,
//       Number(page) || 1,
//       Number(limit) || 20,
//     );
//   }

//   // ============================================================
//   // DELETE /metier/message/conversation/:conversationId (avant /:messageId)
//   // ============================================================
//   @Delete('conversation/:conversationId')
//   async supprimerConversation(
//     @Req() req: any,
//     @Param('conversationId') conversationId: string,
//   ) {
//     return this.messageMetierService.supprimerConversation(
//       conversationId,
//       this.getUserId(req),
//     );
//   }

//   // ============================================================
//   // DELETE /metier/message/:messageId
//   // ============================================================
//   @Delete(':messageId')
//   async supprimerMessage(
//     @Req() req: any,
//     @Param('messageId', ParseIntPipe) messageId: number,
//   ) {
//     return this.messageMetierService.supprimerMessage(
//       messageId,
//       this.getUserId(req),
//     );
//   }
// }





// // import {
// //   BadRequestException,
// //   Body,
// //   Controller,
// //   Delete,
// //   Get,
// //   Param,
// //   ParseIntPipe,
// //   Post,
// //   Query,
// //   Req,
// //   UploadedFile,
// //   UseGuards,
// //   UseInterceptors,
// // } from '@nestjs/common';
// // import { FileInterceptor } from '@nestjs/platform-express';
// // import { unlink } from 'fs/promises';
// // import { MessageMetierService } from './message-metier.service';
// // import {
// //   multerMessagesOptions,
// //   TYPES_MESSAGE_AUTORISES,
// // } from '../../upload.config';
// // import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// // // ⚠️ ADAPTE cet import à ton projet (le guard JWT que tu utilises déjà)
// // // import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// // @Controller('metier/message')
// // @UseGuards(JwtAuthGuard)
// // export class MessageMetierController {
// //   constructor(private readonly messageMetierService: MessageMetierService) {}

// //   // L'id vient du JWT (même champ que celui lu par la gateway : payload.id)
// //   private getUserId(req: any): number {
// //     const id = Number(req.user?.id);
// //     if (!Number.isSafeInteger(id) || id <= 0) {
// //       throw new BadRequestException('Utilisateur non identifié');
// //     }
// //     return id;
// //   }

// //   // ============================================================
// //   // POST /metier/message/envoyer-fichier
// //   // multipart/form-data : champs "file", "destinataireId", "typeMessage"
// //   // ============================================================
// //   @Post('envoyer-fichier')
// //   @UseInterceptors(FileInterceptor('file', multerMessagesOptions))
// //   async envoyerFichier(
// //     @Req() req: any,
// //     @UploadedFile() file: Express.Multer.File,
// //     @Body('destinataireId') destinataireIdBrut: string,
// //     @Body('typeMessage') typeMessageBrut: string,
// //   ) {
// //     // 🔍 Diagnostic : voir où le fichier est réellement écrit
// //     console.log('📁 Fichier écrit ici :', file?.path);

// //     if (!file) {
// //       throw new BadRequestException(
// //         'Aucun fichier reçu (le champ doit s\'appeler "file")',
// //       );
// //     }

// //     const destinataireId = Number(destinataireIdBrut);
// //     const typeMessage = String(typeMessageBrut || 'document')
// //       .toLowerCase()
// //       .trim();

// //     // En cas d'entrée invalide, on supprime le fichier déjà écrit
// //     const nettoyer = async () => {
// //       try {
// //         await unlink(file.path);
// //       } catch {
// //         /* ignoré */
// //       }
// //     };

// //     if (!Number.isSafeInteger(destinataireId) || destinataireId <= 0) {
// //       await nettoyer();
// //       throw new BadRequestException('destinataireId invalide');
// //     }

// //     if (!TYPES_MESSAGE_AUTORISES.includes(typeMessage)) {
// //       await nettoyer();
// //       throw new BadRequestException(
// //         `typeMessage invalide (attendu : ${TYPES_MESSAGE_AUTORISES.join(', ')})`,
// //       );
// //     }

// //     try {
// //       return await this.messageMetierService.envoyerMessageFichier(
// //         this.getUserId(req),
// //         destinataireId,
// //         file,
// //         typeMessage,
// //       );
// //     } catch (error) {
// //       await nettoyer();
// //       throw error;
// //     }
// //   }

// //   // ============================================================
// //   // POST /metier/message/envoyer
// //   // ============================================================
// //   @Post('envoyer')
// //   async envoyer(
// //     @Req() req: any,
// //     @Body() body: { destinataireId: number; contenu: string; typeMessage?: string },
// //   ) {
// //     const contenu = String(body?.contenu ?? '').trim();
// //     if (!contenu) throw new BadRequestException('Le contenu est vide');

// //     return this.messageMetierService.envoyerMessage(
// //       this.getUserId(req),
// //       Number(body.destinataireId),
// //       contenu,
// //       { typeMessage: body.typeMessage },
// //     );
// //   }

// //   // ============================================================
// //   // POST /metier/message/envoyer-annonce/:annonceId
// //   // ============================================================
// //   @Post('envoyer-annonce/:annonceId')
// //   async envoyerAnnonce(
// //     @Req() req: any,
// //     @Param('annonceId', ParseIntPipe) annonceId: number,
// //     @Body('contenu') contenu: string,
// //   ) {
// //     return this.messageMetierService.envoyerMessageAnnonce(
// //       this.getUserId(req),
// //       annonceId,
// //       String(contenu ?? '').trim(),
// //     );
// //   }

// //   // ============================================================
// //   // GET /metier/message/conversations
// //   // ============================================================
// //   @Get('conversations')
// //   async conversations(@Req() req: any) {
// //     return this.messageMetierService.getConversations(this.getUserId(req));
// //   }

// //   // ============================================================
// //   // GET /metier/message/conversation/:autreUserId?page=1&limit=30
// //   // ============================================================
// //   @Get('conversation/:autreUserId')
// //   async conversation(
// //     @Req() req: any,
// //     @Param('autreUserId', ParseIntPipe) autreUserId: number,
// //     @Query('page') page?: string,
// //     @Query('limit') limit?: string,
// //   ) {
// //     return this.messageMetierService.getConversation(
// //       this.getUserId(req),
// //       autreUserId,
// //       Number(page) || 1,
// //       Number(limit) || 30,
// //     );
// //   }

// //   // ============================================================
// //   // POST /metier/message/marquer-lu
// //   // ============================================================
// //   @Post('marquer-lu')
// //   async marquerLu(@Req() req: any, @Body('messageIds') messageIds: number[]) {
// //     const ids = Array.isArray(messageIds)
// //       ? messageIds.map(Number).filter((n) => Number.isSafeInteger(n))
// //       : [];
// //     return this.messageMetierService.marquerMessagesLus(
// //       ids,
// //       this.getUserId(req),
// //     );
// //   }

// //   // ============================================================
// //   // GET /metier/message/non-lus/conversations  (avant /non-lus)
// //   // ============================================================
// //   @Get('non-lus/conversations')
// //   async nonLusParConversation(@Req() req: any) {
// //     return this.messageMetierService.getMessagesNonLusParConversation(
// //       this.getUserId(req),
// //     );
// //   }

// //   // ============================================================
// //   // GET /metier/message/non-lus
// //   // ============================================================
// //   @Get('non-lus')
// //   async nonLus(@Req() req: any) {
// //     return this.messageMetierService.getNombreMessagesNonLus(
// //       this.getUserId(req),
// //     );
// //   }

// //   // ============================================================
// //   // GET /metier/message/rechercher?terme=...
// //   // ============================================================
// //   @Get('rechercher')
// //   async rechercher(
// //     @Req() req: any,
// //     @Query('terme') terme: string,
// //     @Query('page') page?: string,
// //     @Query('limit') limit?: string,
// //   ) {
// //     return this.messageMetierService.rechercherMessages(
// //       this.getUserId(req),
// //       terme,
// //       Number(page) || 1,
// //       Number(limit) || 20,
// //     );
// //   }

// //   // ============================================================
// //   // DELETE /metier/message/conversation/:conversationId (avant /:messageId)
// //   // ============================================================
// //   @Delete('conversation/:conversationId')
// //   async supprimerConversation(
// //     @Req() req: any,
// //     @Param('conversationId') conversationId: string,
// //   ) {
// //     return this.messageMetierService.supprimerConversation(
// //       conversationId,
// //       this.getUserId(req),
// //     );
// //   }

// //   // ============================================================
// //   // DELETE /metier/message/:messageId
// //   // ============================================================
// //   @Delete(':messageId')
// //   async supprimerMessage(
// //     @Req() req: any,
// //     @Param('messageId', ParseIntPipe) messageId: number,
// //   ) {
// //     return this.messageMetierService.supprimerMessage(
// //       messageId,
// //       this.getUserId(req),
// //     );
// //   }
// // }



import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';
import { MessageMetierService } from './message-metier.service';
import {
  multerMessagesOptions,
  TYPES_MESSAGE_AUTORISES,
} from '../../upload.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 
// ⚠️ ADAPTE cet import à ton projet (le guard JWT que tu utilises déjà)
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
 
@Controller('metier/message')
@UseGuards(JwtAuthGuard)
export class MessageMetierController {
  constructor(private readonly messageMetierService: MessageMetierService) {}
 
  // L'id vient du JWT (même champ que celui lu par la gateway : payload.id)
  private getUserId(req: any): number {
    const id = Number(req.user?.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('Utilisateur non identifié');
    }
    return id;
  }
 
  // ============================================================
  // POST /metier/message/envoyer-fichier
  // multipart/form-data : champs "file", "destinataireId", "typeMessage"
  // ============================================================
  @Post('envoyer-fichier')
  @UseInterceptors(FileInterceptor('file', multerMessagesOptions))
  async envoyerFichier(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('destinataireId') destinataireIdBrut: string,
    @Body('typeMessage') typeMessageBrut: string,
  ) {
    // 🔍 Diagnostic : voir où le fichier est réellement écrit
    console.log('📁 Fichier écrit ici :', file?.path);
 
    if (!file) {
      throw new BadRequestException(
        'Aucun fichier reçu (le champ doit s\'appeler "file")',
      );
    }
 
    const destinataireId = Number(destinataireIdBrut);
    const typeMessage = String(typeMessageBrut || 'document')
      .toLowerCase()
      .trim();
 
    // En cas d'entrée invalide, on supprime le fichier déjà écrit
    const nettoyer = async () => {
      try {
        await unlink(file.path);
      } catch {
        /* ignoré */
      }
    };
 
    if (!Number.isSafeInteger(destinataireId) || destinataireId <= 0) {
      await nettoyer();
      throw new BadRequestException('destinataireId invalide');
    }
 
    if (!TYPES_MESSAGE_AUTORISES.includes(typeMessage)) {
      await nettoyer();
      throw new BadRequestException(
        `typeMessage invalide (attendu : ${TYPES_MESSAGE_AUTORISES.join(', ')})`,
      );
    }
 
    try {
      return await this.messageMetierService.envoyerMessageFichier(
        this.getUserId(req),
        destinataireId,
        file,
        typeMessage,
      );
    } catch (error) {
      await nettoyer();
      throw error;
    }
  }
 
  // ============================================================
  // POST /metier/message/envoyer
  // ============================================================
  @Post('envoyer')
  async envoyer(
    @Req() req: any,
    @Body() body: { destinataireId: number; contenu: string; typeMessage?: string },
  ) {
    const contenu = String(body?.contenu ?? '').trim();
    if (!contenu) throw new BadRequestException('Le contenu est vide');
 
    return this.messageMetierService.envoyerMessage(
      this.getUserId(req),
      Number(body.destinataireId),
      contenu,
      { typeMessage: body.typeMessage },
    );
  }
 
  // ============================================================
  // POST /metier/message/envoyer-annonce/:annonceId
  // ============================================================
  @Post('envoyer-annonce/:annonceId')
  async envoyerAnnonce(
    @Req() req: any,
    @Param('annonceId', ParseIntPipe) annonceId: number,
    @Body('contenu') contenu: string,
  ) {
    return this.messageMetierService.envoyerMessageAnnonce(
      this.getUserId(req),
      annonceId,
      String(contenu ?? '').trim(),
    );
  }
 
  // ============================================================
  // GET /metier/message/conversations
  // ============================================================
  @Get('conversations')
  async conversations(@Req() req: any) {
    return this.messageMetierService.getConversations(this.getUserId(req));
  }
 
  // ============================================================
  // GET /metier/message/conversation/:autreUserId?page=1&limit=30
  // ============================================================
  @Get('conversation/:autreUserId')
  async conversation(
    @Req() req: any,
    @Param('autreUserId', ParseIntPipe) autreUserId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messageMetierService.getConversation(
      this.getUserId(req),
      autreUserId,
      Number(page) || 1,
      Number(limit) || 30,
    );
  }
 
  // ============================================================
  // POST /metier/message/marquer-lu
  // ============================================================
  @Post('marquer-lu')
  async marquerLu(@Req() req: any, @Body('messageIds') messageIds: number[]) {
    const ids = Array.isArray(messageIds)
      ? messageIds.map(Number).filter((n) => Number.isSafeInteger(n))
      : [];
    return this.messageMetierService.marquerMessagesLus(
      ids,
      this.getUserId(req),
    );
  }
 
  // ============================================================
  // POST /metier/message/supprimer-multiple
  // ============================================================
  @Post('supprimer-multiple')
  async supprimerMultiple(
    @Req() req: any,
    @Body('messageIds') messageIds: number[],
  ) {
    const ids = Array.isArray(messageIds)
      ? messageIds.map(Number).filter((n) => Number.isSafeInteger(n) && n > 0)
      : [];
    return this.messageMetierService.supprimerMessages(
      ids,
      this.getUserId(req),
    );
  }
 
  // ============================================================
  // GET /metier/message/non-lus/conversations  (avant /non-lus)
  // ============================================================
  @Get('non-lus/conversations')
  async nonLusParConversation(@Req() req: any) {
    return this.messageMetierService.getMessagesNonLusParConversation(
      this.getUserId(req),
    );
  }
 
  // ============================================================
  // GET /metier/message/non-lus
  // ============================================================
  @Get('non-lus')
  async nonLus(@Req() req: any) {
    return this.messageMetierService.getNombreMessagesNonLus(
      this.getUserId(req),
    );
  }
 
  // ============================================================
  // GET /metier/message/rechercher?terme=...
  // ============================================================
  @Get('rechercher')
  async rechercher(
    @Req() req: any,
    @Query('terme') terme: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messageMetierService.rechercherMessages(
      this.getUserId(req),
      terme,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }
 
  // ============================================================
  // DELETE /metier/message/conversation/:conversationId (avant /:messageId)
  // ============================================================
  @Delete('conversation/:conversationId')
  async supprimerConversation(
    @Req() req: any,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageMetierService.supprimerConversation(
      conversationId,
      this.getUserId(req),
    );
  }
 
  // ============================================================
  // DELETE /metier/message/:messageId
  // ============================================================
  @Delete(':messageId')
  async supprimerMessage(
    @Req() req: any,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messageMetierService.supprimerMessage(
      messageId,
      this.getUserId(req),
    );
  }
}


