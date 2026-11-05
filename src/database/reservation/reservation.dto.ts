// import { IsString, IsInt, IsOptional, IsDateString, ValidateNested, IsArray } from 'class-validator';
// import { Type } from 'class-transformer';
// import { AnnonceDto } from '../annonce/annonce.dto';
// import { UtilisateurDto } from '../utilisateur/utilisateur.dto';
// // ✅ AJOUT
// import { HistoriqueStatutReservationDto } from '../historique_statut_reservation/historique_statut_reservation.dto';

// export class ReservationDto {
//   @IsOptional()
//   @IsInt()
//   readonly id: number;

//   @IsDateString()
//   readonly date_debut: string; 

//   @IsDateString()
//   readonly date_fin: string; 

//   @IsInt()
//   readonly montant_total: number;

//   @IsOptional()
//   @IsString()
//   readonly statut: string;

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

//   @IsDateString()
//   readonly dateCreation: string;

//   @IsOptional()
//   @IsInt()
//   readonly idusrcreation: number;

//   // Relation existante : Annonce
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AnnonceDto)
//   readonly annonce?: AnnonceDto;

//   @IsOptional()
//   @IsInt()
//   readonly id_ano?: number;

//   // Relation existante : Utilisateur
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => UtilisateurDto)
//   readonly utilisateur?: UtilisateurDto;

//   @IsOptional()
//   @IsInt()
//   readonly id_usr?: number; 

//   // ✅ AJOUT : historique des changements de statut de cette réservation
//   // (table statut_reservation) — jamais fourni par le client à la
//   // création/modification, seulement présent en lecture si la relation
//   // est chargée côté serveur.
//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => HistoriqueStatutReservationDto)
//   readonly historiquesStatut?: HistoriqueStatutReservationDto[];
// }

import { IsString, IsInt, IsOptional, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnonceDto } from '../annonce/annonce.dto';
import { UtilisateurDto } from '../utilisateur/utilisateur.dto';
// ✅ AJOUT
import { HistoriqueStatutReservationDto } from '../historique_statut_reservation/historique_statut_reservation.dto';
// ✅ AJOUT : pour la relation avec les transactions
import { TransactionDto } from '../transaction/transaction.dto';

export class ReservationDto {
  @IsOptional()
  @IsInt()
  readonly id: number;

  @IsDateString()
  readonly date_debut: string;

  @IsDateString()
  readonly date_fin: string;

  @IsInt()
  readonly montant_total: number;

  @IsOptional()
  @IsString()
  readonly statut: string;

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

  @IsOptional()
  @IsInt()
  readonly idusrcreation: number;

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS EXISTANTES
  // ─────────────────────────────────────────────────────────────────────────

  // Relation existante : Annonce
  @IsOptional()
  @ValidateNested()
  @Type(() => AnnonceDto)
  readonly annonce?: AnnonceDto;

  @IsOptional()
  @IsInt()
  readonly id_ano?: number;

  // Relation existante : Utilisateur
  @IsOptional()
  @ValidateNested()
  @Type(() => UtilisateurDto)
  readonly utilisateur?: UtilisateurDto;

  @IsOptional()
  @IsInt()
  readonly id_usr?: number;

  // Relation existante : Historique des statuts
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoriqueStatutReservationDto)
  readonly historiquesStatut?: HistoriqueStatutReservationDto[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : TRANSACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Transactions financières liées à cette réservation.
   *
   * Jamais fourni par le client à la création.
   * Chargé en lecture uniquement si nécessaire.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  readonly transactions?: TransactionDto[];
} 