import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CaracteristiquesMetierService } from './caracteristiques-metier.service';

@Controller('metier/caracteristiques')
export class CaracteristiquesMetierController {
  constructor(
    private readonly caracteristiquesMetierService: CaracteristiquesMetierService,
  ) {}

  @Delete('supprimerCaracteristiques/:id')
  async supprimerCaracteristiques(@Param('id', ParseIntPipe) id: number) {
    return this.caracteristiquesMetierService.supprimerCaracteristiques(id);
  }
}