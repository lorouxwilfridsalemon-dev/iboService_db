import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RetraitMetierService } from './retrait-metier.service';
import { DemanderRetraitDto } from './dto/demander-retrait.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('metier/retrait')
@UseGuards(JwtAuthGuard)
export class RetraitMetierController {
  constructor(private readonly retraitMetierService: RetraitMetierService) {}

  /**
   * POST /metier/retrait/demander
   */
  @Post('demander')
  @HttpCode(HttpStatus.OK)
  async demander(
    @Body() dto: DemanderRetraitDto,
    @CurrentUser() user: any,
  ) {
    return this.retraitMetierService.demanderRetrait(
      dto.montant,
      dto.methode,
      dto.numeroDestination,
      dto.nomDestination,
      user.id,
    );
  }

  /**
   * GET /metier/retrait/mes-retraits
   */
  @Get('mes-retraits')
  async mesRetraits(@CurrentUser() user: any) {
    return this.retraitMetierService.getMesRetraits(user.id);
  }

  /**
   * GET /metier/retrait/mon-portefeuille
   */
  @Get('mon-portefeuille')
  async monPortefeuille(@CurrentUser() user: any) {
    return this.retraitMetierService.getMonPortefeuille(user.id);
  }
} 