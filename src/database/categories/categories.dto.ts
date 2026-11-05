import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
// import { CaracteristiqueDto } from '../caracteristique/caracteristique.dto'; //

export class CategoriesDto {
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

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  readonly sousCategoriesIds?: number[];


  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  readonly caracteristiquesIds?: number[];
}





// import { IsString, IsInt, IsOptional, IsNumber, IsArray } from 'class-validator';

// export class CategoriesDto {
//   @IsOptional()
//   @IsInt()
//   readonly id: number;

//   @IsOptional()
//   @IsString()
//   readonly nom: string;

//   @IsOptional()
//   @IsString()
//   readonly description: string;

//   @IsOptional()
//   @IsString()
//   readonly empty1: string;

//   @IsOptional()
//   @IsString()
//   readonly empty2: string;

//   @IsOptional()
//   @IsString()
//   readonly empty3: string;

//   @IsInt()
//   readonly geler: number;

//   @IsString()
//   readonly dateCreation: string;

//   @IsInt()
//   readonly idusrcreation: number;

//   @IsOptional()
//   @IsArray()
//   @IsInt({ each: true })
//   readonly sousCategoriesIds?: number[]; 

 
// }

