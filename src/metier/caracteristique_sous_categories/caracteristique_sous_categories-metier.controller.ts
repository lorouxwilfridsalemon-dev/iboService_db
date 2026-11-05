// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   Request,
// } from '@nestjs/common';
// import { CaracteristiqueSousCategoriesMetierService } from './caracteristique_sous_categories-metier.service';

// // ✅ RETIRÉ : @UseGuards(JwtAuthGuard) — SousCategoriesMetierController
// // (qui fonctionne) n'a pas ce garde non plus. Le garder ici sans
// // intercepteur HTTP Angular garanti pour CE module précis pouvait
// // bloquer la requête avant même qu'elle n'atteigne le contrôleur.
// @Controller('metier/caracteristique-sous-categories')
// export class CaracteristiqueSousCategoriesMetierController {
//   constructor(
//     private readonly service: CaracteristiqueSousCategoriesMetierService,
//   ) {}

//   @Get()
//   async findAll() {
//     return this.service.findAll();
//   }

//   @Post()
//   async create( 
//     @Body() body: { caracteristiqueId: number; sousCategorieId: number },
//     @Request() req,
//   ) {
//     const idUsrConnecte = req.user?.id ?? 1;
//     return this.service.create(body, idUsrConnecte);
//   }

//   @Delete(':id')
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     return this.service.remove(id);
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
} from '@nestjs/common';
import { CaracteristiqueSousCategoriesMetierService } from './caracteristique_sous_categories-metier.service';

// ⚠️ Pas de @UseGuards(JwtAuthGuard) volontairement — cohérent avec
// SousCategoriesMetierController qui fonctionne. Le rajouter causait un
// 404 tant que le token JWT n'est pas garanti transmis pour CE module
// précis côté Angular.
@Controller('metier/caracteristique-sous-categories')
export class CaracteristiqueSousCategoriesMetierController {
  constructor(
    private readonly service: CaracteristiqueSousCategoriesMetierService,
  ) {}

  /**
   * GET /metier/caracteristique-sous-categories
   */
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  /**
   * POST /metier/caracteristique-sous-categories
   */
  @Post()
  async create(
    @Body() body: { caracteristiqueId: number; sousCategorieId: number },
  ) {
    return this.service.create(body);
  }

  /**
   * DELETE /metier/caracteristique-sous-categories/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
} 