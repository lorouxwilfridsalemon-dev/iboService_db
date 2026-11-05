import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Type de boost disponible.
 */
export enum BoostType {
  TOP_LISTE = 'top_liste',
  EN_AVANT = 'en_avant',
}

/**
 * Statut du boost.
 */
export enum BoostStatut {
  EN_ATTENTE = 'en_attente',
  ACTIF = 'actif',
  EXPIRE = 'expire',
  ANNULE = 'annule',
}

export class BoostDto {   // ✅ CORRIGÉ : spécifique au boost
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly reference: string;

  @IsEnum(BoostType, {
    message: `Le type doit être : ${Object.values(BoostType).join(', ')}`,
  })
  readonly typeBoost: BoostType;

  @IsInt()
  @Min(24)
  readonly dureeHeures: number;

  @IsDateString()
  readonly dateDebut: string;

  @IsDateString()
  readonly dateFin: string;

  @IsInt()
  @Min(0)
  readonly montantPaye: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  readonly devise: string;

  @IsOptional()
  @IsInt()
  readonly gratuit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly nbVues: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly nbClics: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly nbContacts: number;

  @IsOptional()
  @IsEnum(BoostStatut, {
    message: `Le statut doit être : ${Object.values(BoostStatut).join(', ')}`,
  })
  readonly statut: BoostStatut;

  @IsOptional()
  @IsDateString()
  readonly dateCreation: string;

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  // Relations
  @IsInt()
  readonly annonce_id_ano: number;

  @IsInt()
  readonly utilisateur_id_usr: number;

  
} 