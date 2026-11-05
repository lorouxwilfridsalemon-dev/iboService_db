import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SousCategoriesMetierService } from './sous-categories-metier.service';

@Controller('metier/sous-categories')
export class SousCategoriesMetierController {
  constructor(
    private readonly sousCategoriesMetierService: SousCategoriesMetierService,
  ) {}

  /**
   * GET /metier/sous-categories
   */
  @Get()
  async findAll() { 
    return this.sousCategoriesMetierService.findAll();
  }

  /**
   * ✅ AJOUT : GET /metier/sous-categories/getListeSousCategories
   * Alias demandé par le service Angular — mêmes données que findAll().
   * ⚠️ Doit être déclarée AVANT @Get(':id'), sinon NestJS interprète
   * "getListeSousCategories" comme une valeur d'ID.
   */
  @Get('getListeSousCategories')
  async getListeSousCategories() {
    return this.sousCategoriesMetierService.findAll();
  }

  /**
   * GET /metier/sous-categories/categorie/:categorieId
   * ⚠️ Doit aussi être déclarée AVANT @Get(':id').
   */
  @Get('categorie/:categorieId')
  async findByCategorie(
    @Param('categorieId', ParseIntPipe) categorieId: number,
  ) {
    return this.sousCategoriesMetierService.findByCategorie(categorieId);
  }

  /**
   * GET /metier/sous-categories/:id
   * ⚠️ Reste bien la DERNIÈRE route GET déclarée.
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.sousCategoriesMetierService.findById(id);
  }

  /**
   * ✅ AJOUT : POST /metier/sous-categories/ajouterSousCategories
   * Route demandée par le service Angular — évite complètement le DTO
   * générique (sous_categories.dto.ts) et sa validation problématique.
   */
  @Post('ajouterSousCategories')
  async ajouterSousCategories(@Body() body: any) {
    return this.sousCategoriesMetierService.ajouterSousCategories(body);
  }

  /**
   * ✅ AJOUT : PUT /metier/sous-categories/modifierSousCategories/:id
   */
  @Put('modifierSousCategories/:id')
  async modifierSousCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.sousCategoriesMetierService.modifierSousCategories(id, body);
  }

  /**
   * ✅ AJOUT : DELETE /metier/sous-categories/supprimerSousCategories/:id
   */
  @Delete('supprimerSousCategories/:id')
  async supprimerSousCategories(@Param('id', ParseIntPipe) id: number) {
    return this.sousCategoriesMetierService.supprimerSousCategories(id);
  }
}   