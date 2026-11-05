import { IsString, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CaracteristiqueDto } from '../caracteristique/caracteristique.dto';
import { SousCategoriesDto } from '../sous_categories/sous_categories.dto'; // ✅

export class CaracteristiqueSousCategoriesDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

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

  // ─── RELATION AVEC CARACTERISTIQUE ───

  @IsOptional()
  @ValidateNested()
  @Type(() => CaracteristiqueDto)
  readonly caracteristique?: CaracteristiqueDto;

  // ✅ NOUVELLE RELATION AVEC SOUS-CATÉGORIE
  @IsOptional()
  @ValidateNested()
  @Type(() => SousCategoriesDto)
  readonly sousCategorie?: SousCategoriesDto;
}