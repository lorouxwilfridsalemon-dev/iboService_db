import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { BoostMetierService } from './boost-metier.service';
import { AcheterBoostDto } from './dto/acheter-boost.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('metier/boost')
@UseGuards(JwtAuthGuard)
export class BoostMetierController {
  constructor(private readonly boostMetierService: BoostMetierService) {}

  /**
   * POST /metier/boost/acheter
   * Acheter un boost pour une annonce.
   */
  @Post('acheter')
  @HttpCode(HttpStatus.OK)
  async acheter(
    @Body() dto: AcheterBoostDto,
    @CurrentUser() user: any,
  ) {
    return this.boostMetierService.acheterBoost(
      dto.annonceId,
      dto.dureeMois,
      user.id,
    );
  }

  /**
   * GET /metier/boost/mes-boosts
   */
  @Get('mes-boosts')
  async mesBoosts(@CurrentUser() user: any) {
    return this.boostMetierService.getMesBoosts(user.id);
  }

  /**
   * GET /metier/boost/annonce/:annonceId
   */
  @Get('annonce/:annonceId')
  async getBoostAnnonce(
    @Param('annonceId', ParseIntPipe) annonceId: number,
  ) {
    return this.boostMetierService.getBoostActif(annonceId);
  }
} 