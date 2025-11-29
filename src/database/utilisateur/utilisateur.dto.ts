import { IsString, IsInt, IsOptional } from 'class-validator';

export class UtilisateurDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly nomUtilisateur: string;

  @IsString()
  readonly motDePasse: string;

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

