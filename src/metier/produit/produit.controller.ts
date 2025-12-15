import { Body, Controller, Post } from '@nestjs/common';
import { ProduitMetierService } from './produit.service';

@Controller('metier/produit')
export class ProduitMetierController {
  constructor(
    private readonly produitMetierService: ProduitMetierService,
  ) { }

  @Post('historiser')
  async historiserProduit(@Body() body: any) {
    const produitId = body.produitId;
    const idusrcreation = body.idusrcreation;

    return await this.produitMetierService.historiserProduit(produitId, idusrcreation);
  }
}


