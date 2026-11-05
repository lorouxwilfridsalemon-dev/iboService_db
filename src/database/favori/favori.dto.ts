import { IsString, IsInt, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto'; 

export class FavoriDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsDateString()
  readonly dateCreation: string; 

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

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  
  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  @IsOptional()
  @IsInt()
  readonly id_ano?: number;
}