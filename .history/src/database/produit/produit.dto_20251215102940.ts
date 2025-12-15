import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class ProduitDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

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
  @IsInt()
  readonly prixKgGrosClient: number;

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

