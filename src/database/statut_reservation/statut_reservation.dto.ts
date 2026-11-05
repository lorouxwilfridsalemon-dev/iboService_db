import { IsString, IsInt, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { HistoriqueStatutReservationDto } from '../historique_statut_reservation/historique_statut_reservation.dto';

export class StatutReservationDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsOptional()
  @IsString()
  readonly libelle: string; 

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

  @IsDateString()  
  readonly dateCreation: string;

  @IsInt()
  readonly idusrcreation: number;


  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HistoriqueStatutReservationDto)
  readonly historiques?: HistoriqueStatutReservationDto[];
}