import { IsString, IsInt, IsOptional } from 'class-validator';
// import VisiteDto from '../visite/visite.dto';

export class EmployeDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly nom: string;

  @IsString()
  readonly prenom: string;

  @IsString()
  readonly poste: string;

  @IsString()
  readonly sexe: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly dateNaissance: string;

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

  // @IsOptional()
  // readonly visite: VisiteDto;

//   @IsOptional()
//   readonly statutEmploye: StatutEmployeDto[];

}
