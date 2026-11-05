import { IsString, IsInt, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { StatutReservationDto } from '../statut_reservation/statut_reservation.dto';
import { ReservationDto } from '../reservation/reservation.dto';

export class HistoriqueStatutReservationDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsDateString()
  readonly dateChangement: string; 

  @IsOptional()
  @IsString()
  readonly commentaire: string;

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
  @ValidateNested()
  @Type(() => StatutReservationDto)
  readonly statutReservation?: StatutReservationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReservationDto)
  readonly reservation?: ReservationDto;
}