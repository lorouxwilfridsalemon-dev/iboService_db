// import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { DefaultEntity } from '../../core/shared/systems/default.entity';
// import { AnnonceEntity } from '../annonce/annonce.entity';
// import { MessageEntity } from '../message/message.entity';
// import { ReservationEntity } from '../reservation/reservation.entity';
// import { ProfilEntity } from '../profil/profil.entity';
// import { NotificationEntity } from '../notification/notification.entity';
// // ✅ Relations transactions
// import { TransactionEntity } from '../transaction/transaction.entity';
// // ✅ Relation portefeuille
// import { PortefeuilleEntity } from '../portefeuille/portefeuille.entity';
// // ✅ NOUVEAU : relation abonnement
// import { AbonnementEntity } from '../abonnement/abonnement.entity';
// import { BoostEntity } from '../boost/boost.entity';

// @Entity('utilisateur_usr')
// @Index('fx_idusrcreation_usr', ['idusrcreation'])
// export class UtilisateurEntity {

//   @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_usr', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
//   id: number;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_usr', length: 100, scale: 0, nullable: false, unique: false }))
//   nom: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'prenom_usr', length: 100, scale: 0, nullable: false, unique: false }))
//   prenom: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'pseudo_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   pseudo: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'email_usr', length: 100, scale: 0, nullable: true, unique: true }))
//   email: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'mot_passe_usr', length: 100, scale: 0, nullable: false, unique: false }))
//   motDePasse: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'contact_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   contact: string;

//   @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'confirmation_email_usr', scale: 0, nullable: true, unique: false }))
//   emailConfirmation: Date;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   description: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'language_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   language: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'devise_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   devise: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'photo_usr', length: 255, scale: 0, nullable: true, unique: false }))
//   photo: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   empty1: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   empty2: string;

//   @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_usr', length: 100, scale: 0, nullable: true, unique: false }))
//   empty3: string;

//   @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_usr', scale: 0, nullable: false, unique: false }))
//   geler: number;

//   @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_usr', scale: 0, nullable: true, unique: false }))
//   dateCreation: Date;

//   @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_usr', scale: 0, nullable: true, unique: false }))
//   idusrcreation: number;

//   // ─────────────────────────────────────────────────────────────────────────
//   // RELATIONS EXISTANTES
//   // ─────────────────────────────────────────────────────────────────────────

//   @OneToMany(() => AnnonceEntity, annonce => annonce.utilisateur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   annonces: AnnonceEntity[];

//   @OneToMany(() => MessageEntity, message => message.expediteur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   messagesEnvoyes: MessageEntity[];

//   @OneToMany(() => MessageEntity, message => message.destinataire, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   messagesRecus: MessageEntity[];

//   @OneToMany(() => ReservationEntity, reservation => reservation.utilisateur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   reservations: ReservationEntity[];

//   @ManyToOne(() => ProfilEntity, profil => profil.utilisateurs, {
//     nullable: true,
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   @JoinColumn({ name: 'id_pro' })
//   profil: ProfilEntity;

//   @OneToMany(() => NotificationEntity, notification => notification.utilisateur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   notifications: NotificationEntity[];

//   // ─────────────────────────────────────────────────────────────────────────
//   // RELATIONS TRANSACTIONS
//   // ─────────────────────────────────────────────────────────────────────────

//   /**
//    * Transactions où l'utilisateur est le PAYEUR.
//    */
//   @OneToMany(() => TransactionEntity, transaction => transaction.utilisateur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   transactionsPayeur: TransactionEntity[];

//   /**
//    * Transactions où l'utilisateur est le BÉNÉFICIAIRE.
//    */
//   @OneToMany(() => TransactionEntity, transaction => transaction.beneficiaire, {
//     onDelete: 'SET NULL',
//     onUpdate: 'CASCADE'
//   })
//   transactionsBeneficiaire: TransactionEntity[];

//   // ─────────────────────────────────────────────────────────────────────────
//   // RELATION PORTEFEUILLE
//   // ─────────────────────────────────────────────────────────────────────────

//   /**
//    * Portefeuille de l'utilisateur.
//    *
//    * Relation logique 1..1 : un utilisateur = un seul portefeuille.
//    * L'unicité réelle est garantie par l'index unique
//    * `fx_utilisateur_idx_ptf` côté portefeuille.
//    */
//   @OneToMany(() => PortefeuilleEntity, portefeuille => portefeuille.utilisateur, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
//   })
//   portefeuilles: PortefeuilleEntity[];

//   // ─────────────────────────────────────────────────────────────────────────
//   // ✅ NOUVELLE RELATION : ABONNEMENTS
//   // ─────────────────────────────────────────────────────────────────────────

//   /**
//    * Liste des abonnements de l'utilisateur (historique complet).
//    *
//    * Relation 1..N : un utilisateur peut avoir plusieurs abonnements
//    * au cours du temps (souscription, renouvellement, changement de plan...).
//    *
//    * À un instant T, il ne peut avoir qu'UN SEUL abonnement actif.
//    */
//   @OneToMany(() => AbonnementEntity, abonnement => abonnement.utilisateur, {
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE'
//   })
//   abonnements: AbonnementEntity[];

//   /**
//  * Liste des boosts achetés par l'utilisateur (historique).
//  *
//  * Relation 1..N : un utilisateur peut acheter plusieurs boosts
//  * (pour différentes annonces, à différentes périodes).
//  */
// @OneToMany(() => BoostEntity, boost => boost.utilisateur, {
//   onDelete: 'RESTRICT',
//   onUpdate: 'CASCADE'
// })
// boosts: BoostEntity[];

//   constructor(init?: Partial<any>) {
//     Object.assign(this, init);
//   }
// } 

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';
import { MessageEntity } from '../message/message.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { ProfilEntity } from '../profil/profil.entity';
import { NotificationEntity } from '../notification/notification.entity';
// ✅ Relations transactions
import { TransactionEntity } from '../transaction/transaction.entity';
// ✅ Relation portefeuille
import { PortefeuilleEntity } from '../portefeuille/portefeuille.entity';
// ✅ NOUVELLE : relation abonnement
import { AbonnementEntity } from '../abonnement/abonnement.entity';
import { BoostEntity } from '../boost/boost.entity';
// ✅ NOUVELLE : relation statut (stories)
import { StatutEntity } from '../statut/statut.entity';

@Entity('utilisateur_usr')
@Index('fx_idusrcreation_usr', ['idusrcreation'])
export class UtilisateurEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_usr', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_usr', length: 100, scale: 0, nullable: false, unique: false }))
  nom: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'prenom_usr', length: 100, scale: 0, nullable: false, unique: false }))
  prenom: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'pseudo_usr', length: 100, scale: 0, nullable: true, unique: false }))
  pseudo: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'email_usr', length: 100, scale: 0, nullable: true, unique: true }))
  email: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'mot_passe_usr', length: 100, scale: 0, nullable: false, unique: false }))
  motDePasse: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'contact_usr', length: 100, scale: 0, nullable: true, unique: false }))
  contact: string;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'confirmation_email_usr', scale: 0, nullable: true, unique: false }))
  emailConfirmation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_usr', length: 100, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'language_usr', length: 100, scale: 0, nullable: true, unique: false }))
  language: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'devise_usr', length: 100, scale: 0, nullable: true, unique: false }))
  devise: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'photo_usr', length: 255, scale: 0, nullable: true, unique: false }))
  photo: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_usr', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_usr', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_usr', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_usr', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_usr', scale: 0, nullable: true, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_usr', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS EXISTANTES
  // ─────────────────────────────────────────────────────────────────────────

  @OneToMany(() => AnnonceEntity, annonce => annonce.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  annonces: AnnonceEntity[];

  @OneToMany(() => MessageEntity, message => message.expediteur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  messagesEnvoyes: MessageEntity[];

  @OneToMany(() => MessageEntity, message => message.destinataire, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  messagesRecus: MessageEntity[];

  @OneToMany(() => ReservationEntity, reservation => reservation.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  reservations: ReservationEntity[];

  @ManyToOne(() => ProfilEntity, profil => profil.utilisateurs, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_pro' })
  profil: ProfilEntity;

  @OneToMany(() => NotificationEntity, notification => notification.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  notifications: NotificationEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS TRANSACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Transactions où l'utilisateur est le PAYEUR.
   */
  @OneToMany(() => TransactionEntity, transaction => transaction.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  transactionsPayeur: TransactionEntity[];

  /**
   * Transactions où l'utilisateur est le BÉNÉFICIAIRE.
   */
  @OneToMany(() => TransactionEntity, transaction => transaction.beneficiaire, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  transactionsBeneficiaire: TransactionEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // RELATION PORTEFEUILLE
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Portefeuille de l'utilisateur.
   */
  @OneToMany(() => PortefeuilleEntity, portefeuille => portefeuille.utilisateur, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  portefeuilles: PortefeuilleEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : ABONNEMENTS
  // ─────────────────────────────────────────────────────────────────────────

  @OneToMany(() => AbonnementEntity, abonnement => abonnement.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  abonnements: AbonnementEntity[];

  /**
   * Liste des boosts achetés par l'utilisateur (historique).
   */
  @OneToMany(() => BoostEntity, boost => boost.utilisateur, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  boosts: BoostEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : STATUTS (STORIES / STATUTS WHATSAPP)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Liste des statuts (stories) créés par l'utilisateur.
   * 
   * Relation 1..N : un utilisateur peut publier plusieurs statuts
   * au cours du temps (mais ils expirent après 24h).
   */
  @OneToMany(() => StatutEntity, statut => statut.utilisateur, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  statuts: StatutEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}