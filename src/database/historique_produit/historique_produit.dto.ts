import { IsString, IsInt, IsOptional } from 'class-validator';

export class HistoriqueProduitDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsInt()
  readonly produit: number;

  @IsOptional()
  @IsString()
  readonly libelle: string;

  @IsOptional()
  @IsInt()
  readonly prixKg: number;

  @IsOptional()
  @IsInt()
  readonly prixKgPalier1: number;

  @IsOptional()
  @IsInt()
  readonly prixKgPalier2: number;

  @IsOptional()
  @IsString()
  readonly empty1: string;

  @IsOptional()
  @IsString()
  readonly empty2: string;

  @IsOptional()
  @IsString()
  readonly empty3: string;

  @IsInt()
  readonly geler: number;

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;
}

