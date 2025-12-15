import { Body, Controller, Post } from '@nestjs/common';
import { ProduitMetierService } from './produit.service';

@Controller('metier/produit')
export class ProduitMetierController {
  constructor(
    private readonly produitMetierService: ProduitMetierService,
  ) { }

  /**
   * Endpoint simple pour historiser un produit à partir de son ID.
   * Body attendu :
   * {
   *   "produitId": 1,
   *   "idusrcreation": 1
   * }
   */
  @Post('historiser')
  async historiserProduit(@Body() body: any) {
    const produitId = body.produitId;
    const idusrcreation = body.idusrcreation;

    return await this.produitMetierService.historiserProduit(produitId, idusrcreation);
  }
}


