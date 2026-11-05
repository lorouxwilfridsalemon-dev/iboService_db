import { IsString, IsInt, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto'; // ✅ Import

export class DetailImmobilierDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsInt()
  readonly nombre_chambres: number;

  @IsInt()
  readonly nombre_douches: number;

  @IsInt()
  readonly surface: number;

  @IsOptional()
  @IsString()
  readonly type_location: string;

  @IsOptional()
  @IsString()
  readonly caution_mois: string;

  @IsOptional()
  @IsString()
  readonly avance_mois: string;

  @IsInt()
  readonly frais_visite: number;

  // ✅ CORRECTION : meuble est un boolean, pas string
  @IsOptional()
  @IsBoolean()
  readonly meuble: boolean;

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

