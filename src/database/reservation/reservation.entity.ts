import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { HistoriqueStatutReservationEntity } from '../historique_statut_reservation/historique_statut_reservation.entity';
// ✅ AJOUT : pour la relation avec les transactions
import { TransactionEntity } from '../transaction/transaction.entity';

@Entity('reservation_res')
@Index('fx_idusrcreation_res', ['idusrcreation'])
@Index('fx_geler_idx_res', ['geler'])
@Index('fx_date_creation_idx_res', ['dateCreation'])
export class ReservationEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_res', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_debut_res', scale: 0, nullable: false, unique: false }))
  date_debut: Date;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_fin_res', scale: 0, nullable: false, unique: false }))
  date_fin: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'montant_total_res', length: 10, scale: 0, nullable: false, unique: false }))
  montant_total: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'statut_res', length: 100, scale: 0, nullable: true, unique: false }))
  statut: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_res', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_res', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_res', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_res', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_res', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_res', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS EXISTANTES
  // ─────────────────────────────────────────────────────────────────────────

  // Relation existante : AnnonceEntity
  @ManyToOne(() => AnnonceEntity, annonce => annonce.reservations, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_ano' }) 
  annonce: AnnonceEntity;

  // Relation existante : UtilisateurEntity
  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.reservations, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_usr' })
  utilisateur: UtilisateurEntity;

  @OneToMany(() => HistoriqueStatutReservationEntity, historique => historique.reservation)
  historiquesStatut: HistoriqueStatutReservationEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : TRANSACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Transactions financières liées à cette réservation.
   *
   * Une réservation peut générer PLUSIEURS transactions :
   * - 1 paiement initial (par le client)
   * - 1 commission (prélevée par la plateforme)
   * - 1 remboursement éventuel (en cas d'annulation)
   * - 1 virement au propriétaire
   */
  @OneToMany(() => TransactionEntity, transaction => transaction.reservation, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  transactions: TransactionEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}