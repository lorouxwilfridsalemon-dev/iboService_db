

// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
// import { AnnonceMetierService } from './annonce-metier.service';

// @Controller('metier/annonces')
// export class AnnonceMetierController {
//   constructor(private readonly service: AnnonceMetierService) {}

//   @Get()
//   async findAll(
//     @Query('periodicite') periodicite?: string,
//     @Query('dateJour') dateJour?: string,
//     @Query('semaine') semaine?: string,
//     @Query('mois') mois?: string,
//     @Query('annee') annee?: string,
//     @Query('dateDebut') dateDebut?: string,
//     @Query('dateFin') dateFin?: string,
//   ) {
//     return this.service.getListeAnnonceAll({
//       periodicite,
//       dateJour,
//       semaine,
//       mois,
//       annee,
//       dateDebut,
//       dateFin,
//     });
//   }

//   @Get(':id')
//   async findById(@Param('id', ParseIntPipe) id: number) {
//     return this.service.findById(id);
//   }

//   /**
//    * ✅ AJOUT : PUT /metier/annonces/:id — modification d'une annonce.
//    */
//   @Put(':id')
//   async modifier(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
//     return this.service.modifier(id, body);
//   }

//   @Put('valider/:id')
//   async valider(@Param('id', ParseIntPipe) id: number) {
//     return this.service.valider(id);
//   }

//   @Put('refuser/:id')
//   async refuser(@Param('id', ParseIntPipe) id: number) {
//     return this.service.refuser(id);
//   }

//   @Delete(':id')
//   async supprimer(@Param('id', ParseIntPipe) id: number) {
//     return this.service.supprimer(id);
//   }
// }



import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AnnonceMetierService } from './annonce-metier.service';

@Controller('metier/annonces')
export class AnnonceMetierController {
  constructor(private readonly service: AnnonceMetierService) {}

  // =========================================================================
  // GET — Liste
  // =========================================================================
  @Get()
  async findAll(
    @Query('periodicite') periodicite?: string,
    @Query('dateJour') dateJour?: string,
    @Query('semaine') semaine?: string,
    @Query('mois') mois?: string,
    @Query('annee') annee?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.service.getListeAnnonceAll({
      periodicite,
      dateJour,
      semaine,
      mois,
      annee,
      dateDebut,
      dateFin,
    });
  }

  // =========================================================================
  // POST — Publication (création) avec upload de fichiers
  // =========================================================================
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
        { name: 'cv', maxCount: 1 },
        { name: 'piece', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // ✅ Dossier selon le type de fichier
            let dest = './uploads/annonces';
            if (file.fieldname === 'videos') dest = './uploads/videos';
            if (file.fieldname === 'cv')     dest = './uploads/cv';
            if (file.fieldname === 'piece')  dest = './uploads/pieces';
            cb(null, dest);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10 Mo
        },
      },
    ),
  )
  async publier(
    @Body() body: any,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      cv?: Express.Multer.File[];
      piece?: Express.Multer.File[];
    },
  ) {
    return this.service.publierAnnonce(
      body,
      files?.images ?? [],
      files?.videos ?? [],
      files?.cv?.[0] ?? null,
      files?.piece?.[0] ?? null,
    );
  }

  // =========================================================================
  // GET — Détail
  // =========================================================================
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  // =========================================================================
  // PUT — Modification
  // =========================================================================
  @Put(':id')
  async modifier(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.modifier(id, body);
  }

  // =========================================================================
  // PUT — Valider / Refuser
  // =========================================================================
  @Put('valider/:id')
  async valider(@Param('id', ParseIntPipe) id: number) {
    return this.service.valider(id);
  }

  @Put('refuser/:id')
  async refuser(@Param('id', ParseIntPipe) id: number) {
    return this.service.refuser(id);
  }

  // =========================================================================
  // DELETE
  // =========================================================================
  @Delete(':id')
  async supprimer(@Param('id', ParseIntPipe) id: number) {
    return this.service.supprimer(id);
  }
} 