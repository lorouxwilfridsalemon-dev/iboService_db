import { IsString, IsInt, IsOptional } from 'class-validator';
// import VisiteDto from '../visite/visite.dto';

export class StatutDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsString()
  readonly libelle: string;

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
//   readonly statutStatut: StatutStatutDto[];

}
