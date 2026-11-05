import { IsString, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto';

export class AnnonceImageDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly nom: string;

  @IsOptional()
  @IsString()
  readonly order_image: string;

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
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  @IsOptional()
  @IsInt()
  readonly id_ano?: number;
}

