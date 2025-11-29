import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class DetailAchatDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsNumber()
  readonly poids: number;

  @IsNumber()
  readonly prixKg: number;

  @IsNumber()
  readonly montant: number;

  @IsString()
  readonly heure: string;

  @IsString()
  readonly date: string;

  @IsInt()
  readonly achat: number;

  @IsInt()
  readonly produit: number;
}

