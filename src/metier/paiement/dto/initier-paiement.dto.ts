import { IsInt, IsEnum, IsString, MaxLength } from 'class-validator';

export enum OperateurMobile {
  ORANGE_MONEY = 'orange_money',
  MTN_MOMO = 'mtn_momo',
  WAVE = 'wave',
  MOOV_MONEY = 'moov_money',
}

export class InitierPaiementDto {
  /**
   * ID de la transaction à payer.
   */
  @IsInt()
  readonly transactionId: number; 

  /**
   * Opérateur Mobile Money.
   */
  @IsEnum(OperateurMobile)
  readonly operateur: OperateurMobile;

  /**
   * Numéro de téléphone du payeur.
   */
  @IsString()
  @MaxLength(20)
  readonly numeroPayeur: string;
}