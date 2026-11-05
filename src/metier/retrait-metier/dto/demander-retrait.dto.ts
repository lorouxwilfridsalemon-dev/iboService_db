import {
  IsInt,
  IsEnum,
  IsString,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export enum MethodeRetrait {
  ORANGE_MONEY = 'orange_money',
  MTN_MOMO = 'mtn_momo',
  WAVE = 'wave',
  MOOV_MONEY = 'moov_money',
  VIREMENT = 'virement',
}

export class DemanderRetraitDto {
  /**
   * Montant à retirer (FCFA).
   */
  @IsInt()
  @Min(1000, { message: 'Le montant minimum de retrait est 1000 FCFA' })
  readonly montant: number;

  /**
   * Méthode de retrait.
   */
  @IsEnum(MethodeRetrait)
  readonly methode: MethodeRetrait;

  /**
   * Numéro de destination (mobile money) ou IBAN.
   */
  @IsString()
  @MaxLength(50)
  readonly numeroDestination: string; 

  /**
   * Nom du titulaire du compte (optionnel).
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly nomDestination?: string;
}