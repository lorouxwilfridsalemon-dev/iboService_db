import {
  IsString,
  IsInt,
  IsOptional,
  IsIn,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StatutDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  @IsIn(['image', 'video', 'texte'])
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly contenu: string;

  @IsOptional()
  @IsString()
  readonly fichier: string;

  @IsOptional()
  @IsString()
  readonly couleurFond: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dateCreation: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dateExpiration: Date;

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  @IsOptional()
  @IsNumber()
  readonly id_utilisateur: number;
}