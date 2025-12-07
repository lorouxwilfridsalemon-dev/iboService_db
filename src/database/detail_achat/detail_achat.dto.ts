import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class DetailAchatDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsNumber()
  readonly poids: number;

  @IsInt()
  readonly montant: number;

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
  readonly achat: number;

  @IsInt()
  readonly produit: number;
}

