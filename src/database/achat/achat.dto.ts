import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class AchatDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsNumber()
  readonly poidsTotal: number;

  @IsInt()
  readonly montantTotal: number;

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

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  @IsOptional()
  @IsInt()
  readonly client: number;

  @IsOptional()
  @IsInt()
  readonly utilisateur: number;

  @IsOptional()
  @IsInt()
  readonly modalitePaiement: number;
}

