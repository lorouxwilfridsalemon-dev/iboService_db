import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class AchatDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsInt()
  readonly montantTotal: number;


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
}

