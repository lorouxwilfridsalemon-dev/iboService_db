// import { AnnonceDto } from '../annonce/annonce.dto';
// import { MessageDto } from '../message/message.dto';
// import { IsString, IsInt, IsOptional, IsEmail, Length, IsArray, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ReservationDto } from '../reservation/reservation.dto';
// import { ProfilDto } from '../profil/profil.dto';
// import { NotificationDto } from '../notification/notification.dto';
// // ✅ Relations transactions
// import { TransactionDto } from '../transaction/transaction.dto';
// // ✅ Relation portefeuille
// import { PortefeuilleDto } from '../portefeuille/portefeuille.dto';
// // ✅ NOUVEAU : relation abonnement
// import { AbonnementDto } from '../abonnement/abonnement.dto';
// import { BoostDto } from '../boost/boost.dto';

// export class UtilisateurDto {

//     @IsOptional()
//     @IsInt()
//     readonly id: number;

//     @IsString()
//     readonly nom: string;

//     @IsString()
//     readonly prenom: string;

//     @IsOptional()
//     @IsString()
//     readonly pseudo: string;

//     @IsOptional()
//     @IsString()
//     @Length(8)
//     readonly motDePasse: string;

//     @IsString()
//     @IsEmail()
//     readonly email: string;

//     @IsString()
//     readonly contact: string;

//     @IsOptional()
//     @IsString()
//     readonly description: string;

//     @IsOptional()
//     @IsString()
//     readonly language: string;

//     @IsOptional()
//     @IsString()
//     readonly devise: string;

//     @IsOptional()
//     @IsString()
//     readonly emailConfirmation: string;

//     @IsOptional()
//     @IsString()
//     readonly empty1: string;

//     @IsOptional()
//     @IsString()
//     readonly empty2: string;

//     @IsOptional()
//     @IsString()
//     readonly empty3: string;

//     @IsInt()
//     readonly geler: number;

//     @IsString()
//     readonly dateCreation: string;

//     @IsInt()
//     readonly idusrcreation: number;

//     // ─────────────────────────────────────────────────────────────────────────
//     // RELATIONS EXISTANTES
//     // ─────────────────────────────────────────────────────────────────────────

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => AnnonceDto)
//     readonly annonces?: AnnonceDto[];

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => MessageDto)
//     readonly messagesEnvoyes?: MessageDto[];

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => MessageDto)
//     readonly messagesRecus?: MessageDto[];

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => ReservationDto)
//     readonly reservations?: ReservationDto[];

//     @IsOptional()
//     @ValidateNested()
//     @Type(() => ProfilDto)
//     readonly profil?: ProfilDto;

//     @IsOptional()
//     @IsInt()
//     readonly id_pro?: number;

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => NotificationDto)
//     readonly notifications?: NotificationDto[];

//     // ─────────────────────────────────────────────────────────────────────────
//     // RELATIONS TRANSACTIONS
//     // ─────────────────────────────────────────────────────────────────────────

//     /**
//      * Transactions où l'utilisateur est le payeur.
//      */
//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => TransactionDto)
//     readonly transactionsPayeur?: TransactionDto[];

//     /**
//      * Transactions où l'utilisateur est le bénéficiaire.
//      */
//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => TransactionDto)
//     readonly transactionsBeneficiaire?: TransactionDto[];

//     // ─────────────────────────────────────────────────────────────────────────
//     // RELATION PORTEFEUILLE
//     // ─────────────────────────────────────────────────────────────────────────

//     /**
//      * Portefeuille de l'utilisateur.
//      */
//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => PortefeuilleDto)
//     readonly portefeuilles?: PortefeuilleDto[];

//     // ─────────────────────────────────────────────────────────────────────────
//     // ✅ NOUVELLE RELATION : ABONNEMENTS
//     // ─────────────────────────────────────────────────────────────────────────

//     /**
//      * Liste des abonnements de l'utilisateur (historique).
//      */
//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => AbonnementDto)
//     readonly abonnements?: AbonnementDto[];

//     /**
//  * Liste des boosts achetés par l'utilisateur.
//  */
// @IsOptional()
// @IsArray()
// @ValidateNested({ each: true })
// @Type(() => BoostDto)
// readonly boosts?: BoostDto[];
// } 

import { AnnonceDto } from '../annonce/annonce.dto';
import { MessageDto } from '../message/message.dto';
import { IsString, IsInt, IsOptional, IsEmail, Length, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationDto } from '../reservation/reservation.dto';
import { ProfilDto } from '../profil/profil.dto';
import { NotificationDto } from '../notification/notification.dto';
// ✅ Relations transactions
import { TransactionDto } from '../transaction/transaction.dto';
// ✅ Relation portefeuille
import { PortefeuilleDto } from '../portefeuille/portefeuille.dto';
// ✅ NOUVELLE : relation abonnement
import { AbonnementDto } from '../abonnement/abonnement.dto';
import { BoostDto } from '../boost/boost.dto';
// ✅ NOUVELLE : relation statut (stories)
import { StatutDto } from '../statut/statut.dto';

export class UtilisateurDto {

    @IsOptional()
    @IsInt()
    readonly id: number;

    @IsString()
    readonly nom: string;

    @IsString()
    readonly prenom: string;

    @IsOptional()
    @IsString()
    readonly pseudo: string;

    @IsOptional()
    @IsString()
    @Length(8)
    readonly motDePasse: string;

    @IsString()
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly contact: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly language: string;

    @IsOptional()
    @IsString()
    readonly devise: string;

    @IsOptional()
    @IsString()
    readonly emailConfirmation: string;

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

    // ─────────────────────────────────────────────────────────────────────────
    // RELATIONS EXISTANTES
    // ─────────────────────────────────────────────────────────────────────────

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnnonceDto)
    readonly annonces?: AnnonceDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    readonly messagesEnvoyes?: MessageDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    readonly messagesRecus?: MessageDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReservationDto)
    readonly reservations?: ReservationDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => ProfilDto)
    readonly profil?: ProfilDto;

    @IsOptional()
    @IsInt()
    readonly id_pro?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NotificationDto)
    readonly notifications?: NotificationDto[];

    // ─────────────────────────────────────────────────────────────────────────
    // RELATIONS TRANSACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Transactions où l'utilisateur est le payeur.
     */
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionDto)
    readonly transactionsPayeur?: TransactionDto[];

    /**
     * Transactions où l'utilisateur est le bénéficiaire.
     */
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionDto)
    readonly transactionsBeneficiaire?: TransactionDto[];

    // ─────────────────────────────────────────────────────────────────────────
    // RELATION PORTEFEUILLE
    // ─────────────────────────────────────────────────────────────────────────

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PortefeuilleDto)
    readonly portefeuilles?: PortefeuilleDto[];

    // ─────────────────────────────────────────────────────────────────────────
    // ✅ NOUVELLE RELATION : ABONNEMENTS
    // ─────────────────────────────────────────────────────────────────────────

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AbonnementDto)
    readonly abonnements?: AbonnementDto[];

    /**
     * Liste des boosts achetés par l'utilisateur.
     */
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BoostDto)
    readonly boosts?: BoostDto[];

    // ─────────────────────────────────────────────────────────────────────────
    // ✅ NOUVELLE RELATION : STATUTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Liste des statuts (stories) publiés par l'utilisateur.
     */
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StatutDto)
    readonly statuts?: StatutDto[];
}