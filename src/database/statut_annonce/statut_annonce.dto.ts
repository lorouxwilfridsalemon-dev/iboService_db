import { IsString, IsInt, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { HistoriqueStatutAnnonceDto } from '../historique_statut_annonce/historique_statut_annonce.dto';

export class StatutAnnonceDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly libelle: string;  

  @IsOptional()
  @IsString()
  readonly description: string;

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HistoriqueStatutAnnonceDto)
  readonly historiques?: HistoriqueStatutAnnonceDto[];
}