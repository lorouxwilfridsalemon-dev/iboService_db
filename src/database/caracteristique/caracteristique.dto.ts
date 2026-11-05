import { IsString, IsInt, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoriesDto } from '../categories/categories.dto';
import { AnnonceCaracteristiqueDto } from '../annonce_caracteristique/annonce_caracteristique.dto';
import { CaracteristiqueSousCategoriesDto } from '../caracteristique_sous_categories/caracteristique_sous_categories.dto';

export class CaracteristiqueDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly nom: string;

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

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  // ─── RELATIONS ───

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriesDto)
  readonly categorie?: CategoriesDto;

  @IsOptional()
  @IsInt()
  readonly id_categorie_cat?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceCaracteristiqueDto)
  readonly annonceCaracteristiques?: AnnonceCaracteristiqueDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaracteristiqueSousCategoriesDto)
  readonly caracteristiqueSousCategories?: CaracteristiqueSousCategoriesDto[];
}