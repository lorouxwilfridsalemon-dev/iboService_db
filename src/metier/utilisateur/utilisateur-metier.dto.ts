import { IsString, IsInt, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

/**
 * ✅ DTO dédié au métier — volontairement plus simple que le DTO
 * générique (UtilisateurDto), qui exige geler/dateCreation/idusrcreation
 * du client alors que ce sont des champs gérés côté serveur (date de
 * création automatique, statut par défaut...). Évite aussi le piège du
 * mat-slide-toggle qui envoie un booléen là où le générique attend un
 * entier strict.
 */
export class CreerUtilisateurDto {
  @IsString()
  readonly nom: string;

  @IsString()
  readonly prenom: string;

  @IsOptional()
  @IsString()
  readonly pseudo?: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly contact?: string;

  @IsString()
  @MinLength(8)
  readonly motDePasse: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly language?: string;

  @IsOptional()
  @IsString()
  readonly devise?: string;

  @IsOptional()
  @IsInt()
  readonly id_pro?: number;
}

export class ModifierUtilisateurDto {
  @IsOptional()
  @IsString()
  readonly nom?: string;

  @IsOptional()
  @IsString()
  readonly prenom?: string;

  @IsOptional()
  @IsString()
  readonly pseudo?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly contact?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  readonly motDePasse?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly language?: string;

  @IsOptional()
  @IsString()
  readonly devise?: string;

  @IsOptional()
  @IsInt()
  readonly id_pro?: number;

  // ✅ Accepte 0/1 (entier) OU true/false (booléen envoyé par le
  // mat-slide-toggle) — converti en entier dans le service, pas ici.
  @IsOptional()
  readonly geler?: number | boolean;
}