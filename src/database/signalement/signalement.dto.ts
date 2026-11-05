import { IsString, IsInt, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto'; // ✅ Import

export class SignalementDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly statut: string;

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
  readonly dateCreation: string; // ✅ Changé de Date à string

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  // ✅ AJOUTER : Pour recevoir l'objet annonce complet
  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  // ✅ AJOUTER : Version simple - juste l'ID de l'annonce
  @IsOptional()
  @IsInt()
  readonly id_ano?: number;
}