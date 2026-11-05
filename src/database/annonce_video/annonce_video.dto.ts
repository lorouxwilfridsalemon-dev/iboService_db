import { IsString, IsInt, IsOptional, ValidateNested, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto';

export class AnnonceVideoDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly nom: string;

  // ✅ Validation de l'URL (doit être une URL valide)
  @IsString()
  @IsUrl({}, { message: 'Le champ url_video doit être une URL valide' })
  readonly url_video: string;

  @IsOptional()
  @IsInt()
  readonly taille: number;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsInt()
  readonly geler: number;

  @IsString()
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;

  // ✅ Relation vers l'annonce (Optionnel pour le DTO)
  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  // ✅ ID de l'annonce (pour l'envoi depuis le frontend)
  @IsOptional()
  @IsInt()
  readonly id_ano?: number;
}

