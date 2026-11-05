import { IsString, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CaracteristiqueDto } from '../caracteristique/caracteristique.dto';
import { AnnonceDto } from '../annonce/annonce.dto'; // ✅

export class AnnonceCaracteristiqueDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly valeur: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CaracteristiqueDto)
  readonly caracteristique?: CaracteristiqueDto;

  @IsOptional()
  @IsInt()
  readonly id_car?: number;

  // ✅ NOUVELLE RELATION
  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  @IsOptional()
  @IsInt()
  readonly id_ano?: number;
}