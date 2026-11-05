import { IsString, IsInt, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { AnnonceDto } from '../annonce/annonce.dto';
import { Type } from 'class-transformer';

export class LocalisationDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly titre: string;

  @IsInt()
  readonly prix: number;

  @IsOptional()
  @IsString()
  readonly type_prix: string;

   @IsOptional()
  @IsString()
  readonly statut: string;

  @IsString()
  readonly date_publication: string;

  @IsOptional()
  @IsString()
  readonly longitude: string;

  @IsOptional()
  @IsString()
  readonly lagitude: string;

  @IsOptional()
  @IsString()
  readonly adresse: string;

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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnnonceDto)
    readonly annonces?: AnnonceDto[];  


}

