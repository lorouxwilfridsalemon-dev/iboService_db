import { IsInt, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class StatutVueDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly dateVue: Date;

  @IsOptional()
  @IsInt()
  readonly geler: number;

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  @IsOptional()
  @IsNumber()
  readonly id_statut: number;

  @IsOptional()
  @IsNumber()
  readonly id_utilisateur: number;
}