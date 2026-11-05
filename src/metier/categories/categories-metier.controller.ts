// import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
// import { CategoriesMetierService } from './categories-metier.service';

// @Controller('metier/categories')
// export class CategoriesMetierController {
//   constructor(
//     private readonly categoriesMetierService: CategoriesMetierService,
//   ) {}

//   /**
//    * DELETE /metier/categories/supprimerCategories/:id
//    */
//   @Delete('supprimerCategories/:id')
//   async supprimerCategories(@Param('id', ParseIntPipe) id: number) {
//     return this.categoriesMetierService.supprimerCategories(id);
//   }
// }

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { CategoriesMetierService } from './categories-metier.service';

@Controller('metier/categories')
export class CategoriesMetierController {
  constructor(
    private readonly categoriesMetierService: CategoriesMetierService,
  ) {}

  @Get('listeCategories')
  async listeCategories() {
    return this.categoriesMetierService.listeCategories();
  }

  /**
   * ✅ AJOUT : POST /metier/categories/ajouterCategories
   */
  @Post('ajouterCategories')
  async ajouterCategories(@Body() body: any, @Request() req) {
    const idUsrConnecte = req.user?.id ?? 1;
    return this.categoriesMetierService.ajouterCategories(body, idUsrConnecte);
  }

  /**
   * ✅ AJOUT : PUT /metier/categories/modifierCategories/:id
   */
  @Put('modifierCategories/:id')
  async modifierCategories(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.categoriesMetierService.modifierCategories(id, body);
  }

  @Delete('supprimerCategories/:id')
  async supprimerCategories(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesMetierService.supprimerCategories(id);
  }
} 