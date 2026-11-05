import { IsString, IsInt, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoriesDto } from '../categories/categories.dto';
import { AnnonceDto } from '../annonce/annonce.dto';
import { CaracteristiqueSousCategoriesDto } from '../caracteristique_sous_categories/caracteristique_sous_categories.dto';

export class SousCategoriesDto {
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

  // ─── RELATIONS EXISTANTES ───

  // ✅ CORRIGÉ : 'categorie' est une relation @ManyToOne côté entité —
  // UN SEUL objet, jamais un tableau. @IsArray() + { each: true }
  // rejetait systématiquement { id: X } avec "categorie must be an
  // array". Retiré @IsArray(), retiré "each: true", et le type est
  // maintenant CategoriesDto (singulier) au lieu de CategoriesDto[].
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriesDto)
  readonly categorie?: CategoriesDto;

  // ✅ Inchangé : 'annonces' est un vrai @OneToMany, donc un tableau est
  // correct ici.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnonceDto)
  readonly annonces?: AnnonceDto[];

  // ✅ Inchangé : idem, @OneToMany, tableau correct.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaracteristiqueSousCategoriesDto)
  readonly caracteristiqueSousCategories?: CaracteristiqueSousCategoriesDto[];
} 