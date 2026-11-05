import { IsString, IsInt, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { StatutAnnonceDto } from '../statut_annonce/statut_annonce.dto';
import { AnnonceDto } from '../annonce/annonce.dto';

export class HistoriqueStatutAnnonceDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsDateString()
  readonly dateChangement: string;

  @IsOptional()
  @IsString()
  readonly commentaire: string;

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
  @ValidateNested()
  @Type(() => StatutAnnonceDto)
  readonly statutAnnonce?: StatutAnnonceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;
} 