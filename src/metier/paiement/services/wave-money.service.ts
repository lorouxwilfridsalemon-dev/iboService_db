import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service d'intégration avec l'API Wave Business.
 *
 * Documentation : https://docs.wave.com
 * Endpoint CI   : https://api.wave.com/ci
 *
 * Responsabilités :
 * - Créer une session de paiement (checkout)
 * - Vérifier les signatures des webhooks
 */
@Injectable()
export class WaveMoneyService {
  private readonly logger = new Logger(WaveMoneyService.name);
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly apiBase: string;

  constructor(private readonly configService: ConfigService) {
    // Récupère les clés depuis .env
    this.apiKey = this.configService.get<string>('WAVE_API_KEY');
    this.webhookSecret = this.configService.get<string>(
      'WAVE_WEBHOOK_SECRET',
    );
    this.apiBase =
      this.configService.get<string>('WAVE_API_URL') ||
      'https://api.wave.com/ci';

    // Log de démarrage (sans révéler les clés)
    this.logger.log(`Wave service initialisé (API base: ${this.apiBase})`);
    this.logger.log(
      `Wave API Key configurée : ${this.apiKey ? 'OUI' : 'NON'}`,
    );
    this.logger.log(
      `Wave Webhook Secret configuré : ${this.webhookSecret ? 'OUI' : 'NON'}`,
    );
  }

  // =========================================================================
  // CRÉATION D'UNE SESSION DE PAIEMENT
  // =========================================================================

  /**
   * Crée une session de checkout Wave.
   */
  async creerSessionCheckout(
    montant: number,
    referenceInterne: string,
    successUrl: string,
    errorUrl: string,
  ): Promise<{
    checkoutId: string;
    waveLaunchUrl: string;
    whenExpires: string;
  }> {
    if (!this.apiKey) {
      throw new HttpException(
        'Wave API Key non configurée',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const body = {
      amount: String(montant),
      currency: 'XOF',
      client_reference: referenceInterne,
      success_url: successUrl,
      error_url: errorUrl,
    };

    this.logger.log(
      `Création session Wave : montant=${montant} XOF, ref=${referenceInterne}`,
    );

    try {
      const response = await fetch(`${this.apiBase}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.message || errorData?.error || 'Erreur inconnue';

        this.logger.error(
          `Erreur Wave API (${response.status}): ${errorMessage}`,
        );

        throw new HttpException(
          `Erreur Wave: ${errorMessage}`,
          HttpStatus.BAD_REQUEST, 
        );
      }

      const data: any = await response.json();

      this.logger.log(
        `Session Wave créée : ${data.id}, expires à ${data.when_expires}`,
      );

      return {
        checkoutId: data.id,
        waveLaunchUrl: data.wave_launch_url,
        whenExpires: data.when_expires,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Erreur lors de la création de session Wave: ${error.message}`,
      );

      throw new HttpException(
        `Erreur de communication avec Wave: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // =========================================================================
  // VÉRIFICATION DE SIGNATURE (WEBHOOK)
  // =========================================================================

  /**
   * Vérifie la signature HMAC-SHA256 d'un webhook Wave.
   */
  verifierSignatureWebhook(rawBody: string, signature: string): boolean {
    if (!signature || !rawBody || !this.webhookSecret) {
      this.logger.warn(
        `Signature vérification échouée : signature=${!!signature}, rawBody=${!!rawBody}, secret=${!!this.webhookSecret}`,
      );
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody, 'utf8')
        .digest('hex');

      const signatureBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (signatureBuffer.length !== expectedBuffer.length) {
        this.logger.warn('Longueurs de signature différentes');
        return false;
      }

      const signatureValide = crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer,
      );

      if (!signatureValide) {
        this.logger.warn('Signature Wave invalide');
      }

      return signatureValide;
    } catch (error) {
      this.logger.error(
        `Erreur lors de la vérification de signature: ${error.message}`,
      );
      return false;
    }
  }

  // =========================================================================
  // RÉCUPÉRATION D'UNE SESSION
  // =========================================================================

  /**
   * Récupère les détails d'une session de checkout.
   */
  async recupererSession(checkoutId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiBase}/v1/checkout/sessions/${checkoutId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new HttpException(
          `Erreur Wave: ${response.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Erreur de communication avec Wave: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 