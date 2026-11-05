import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaiementMetierService } from './paiement-metier.service';
import { WaveMoneyService } from './services/wave-money.service';
import { InitierPaiementDto } from './dto/initier-paiement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('metier/paiement')
export class PaiementMetierController {
  constructor(
    private readonly paiementMetierService: PaiementMetierService,
    private readonly waveMoneyService: WaveMoneyService,
  ) {}

  /**
   * POST /metier/paiement/initier
   * Initier un paiement Mobile Money (méthode générique).
   */
  @Post('initier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async initier(
    @Body() dto: InitierPaiementDto,
    @CurrentUser() user: any,
  ) {
    return this.paiementMetierService.initierPaiement(
      dto.transactionId,
      dto.operateur,
      dto.numeroPayeur,
      user.id,
    );
  }

  // =========================================================================
  // WAVE
  // =========================================================================

  /**
   * POST /metier/paiement/initier-wave
   * Initie un paiement Wave et retourne l'URL de redirection.
   */
  @Post('initier-wave')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async initierWave(
    @Body() body: { transactionId: number },
    @CurrentUser() user: any,
  ) {
    return this.paiementMetierService.initierPaiementWave(
      body.transactionId,
      user.id,
    );
  }

  /**
   * POST /metier/paiement/callback/wave
   *
   * Route PUBLIQUE appelée par Wave.
   */
  @Post('callback/wave')
  @HttpCode(HttpStatus.OK)
  async callbackWave(
    @Body() body: any,
    @Headers('wave-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody
      ? req.rawBody.toString('utf8')
      : JSON.stringify(body);

    const signatureValide = this.waveMoneyService.verifierSignatureWebhook(
      rawBody,
      signature,
    );

    if (!signatureValide) {
      return { success: false, message: 'Signature invalide' };
    }

    return this.paiementMetierService.traiterCallbackWave(body);
  }

  /**
   * POST /metier/paiement/callback
   * Ancienne route générique de callback.
   */
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async callback(@Body() body: any) {
    return this.paiementMetierService.traiterCallback(body);
  }
} 