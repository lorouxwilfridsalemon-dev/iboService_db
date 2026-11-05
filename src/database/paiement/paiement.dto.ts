import { IsString, IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class PaiementDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsInt()
  readonly montantDu: number;

  @IsOptional()
  @IsInt()
  readonly montantPaye: number;

  @IsOptional()
  @IsInt()
  readonly solde: number;

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

  @IsDateString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  @IsInt()
  readonly achat: number;

  @IsInt()
  readonly modalitePaiement: number;
}

