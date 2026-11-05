import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { SousCategoriesEntity } from '../sous_categories/sous_categories.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { AnnonceImageEntity } from '../annonce_image/annonce_image.entity';
import { AvisEntity } from '../avis/avis.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { SignalementEntity } from '../signalement/signalement.entity';
import { FavoriEntity } from '../favori/favori.entity';
import { AnnonceCaracteristiqueEntity } from '../annonce_caracteristique/annonce_caracteristique.entity';
import { AnnonceVideoEntity } from '../annonce_video/annonce_video.entity';
import { HistoriqueStatutAnnonceEntity } from '../historique_statut_annonce/historique_statut_annonce.entity';
// ✅ NOUVEAU : relation boost
import { BoostEntity } from '../boost/boost.entity';

@Entity('annonce_ano')
@Index('fx_idusrcreation_ano', ['idusrcreation'])
@Index('fx_geler_idx_ano', ['geler'])
@Index('fx_date_creation_idx_ano', ['dateCreation'])
export class AnnonceEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_ano', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'titre_ano', length: 100, scale: 0, nullable: true, unique: false }))
  titre: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_ano', length: 255, scale: 0, nullable: true, unique: false }))
  description: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'prix_ano', scale: 0, nullable: false, unique: false }))
  prix: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'type_prix_ano', length: 50, scale: 0, nullable: false, unique: false }))
  type_prix: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'statut_ano', length: 50, scale: 0, nullable: true, unique: false }))
  statut: string;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_publication_ano', scale: 0, nullable: false, unique: false }))
  date_publication: Date;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'adresse_ano', length: 255, scale: 0, nullable: true, unique: false }))
  adresse: string;

  @Column(DefaultEntity.convertDataType({ type: 'float', name: 'longitude_ano', length: 10, scale: 0, nullable: true, unique: false }))
  longitude: number;

  @Column(DefaultEntity.convertDataType({ type: 'float', name: 'latitude_ano', length: 10, scale: 0, nullable: true, unique: false }))
  latitude: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'nombre_chambres_ano', scale: 0, nullable: false, unique: false }))
  nombre_chambres: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'nombre_douches_ano', scale: 0, nullable: false, unique: false }))
  nombre_douches: number;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'nombre_salon_ano', scale: 0, nullable: false, unique: false }))
  nombre_salon: number;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'type_location_ano', length: 50, scale: 0, nullable: true, unique: false }))
  type_location: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'caution_mois_ano', length: 50, scale: 0, nullable: true, unique: false }))
  caution_mois: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'avance_mois_ano', length: 50, scale: 0, nullable: true, unique: false }))
  avance_mois: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'frais_visite_ano', scale: 0, nullable: true, unique: false }))
  frais_visite: number;

  @Column(DefaultEntity.convertDataType({ type: 'boolean', name: 'est_meuble_ano', scale: 0, nullable: true, unique: false }))
  est_meuble: boolean;

  @Column(DefaultEntity.convertDataType({ type: 'boolean', name: 'est_automatique_ano', scale: 0, nullable: true, unique: false }))
  est_automatique: boolean;

  @Column(DefaultEntity.convertDataType({ type: 'boolean', name: 'a_gps_ano', scale: 0, nullable: true, unique: false }))
  a_gps: boolean;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'doc_cv_ano', length: 100, scale: 0, nullable: true, unique: false }))
  doc_cv: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'piece_ano', length: 100, scale: 0, nullable: true, unique: false }))
  piece: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_ano', length: 100, scale: 0, nullable: true, unique: false }))
  empty1: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_ano', length: 100, scale: 0, nullable: true, unique: false }))
  empty2: string;

  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_ano', length: 100, scale: 0, nullable: true, unique: false }))
  empty3: string;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_ano', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_ano', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_ano', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ─────────────────────────────────────────────────────────────────────────
  // RELATIONS EXISTANTES
  // ─────────────────────────────────────────────────────────────────────────

  @ManyToOne(() => SousCategoriesEntity, sousCategorie => sousCategorie.annonces, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_sca' })
  sousCategorie: SousCategoriesEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.annonces, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'id_usr' })
  utilisateur: UtilisateurEntity;

  @OneToMany(() => AnnonceImageEntity, annonceImage => annonceImage.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  images: AnnonceImageEntity[];

  @OneToMany(() => AvisEntity, avis => avis.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  avis: AvisEntity[];

  @OneToMany(() => ReservationEntity, reservation => reservation.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  reservations: ReservationEntity[];

  @OneToMany(() => SignalementEntity, signalement => signalement.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  signalements: SignalementEntity[];

  @OneToMany(() => FavoriEntity, favori => favori.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  favoris: FavoriEntity[];

  @OneToMany(() => AnnonceCaracteristiqueEntity, annonceCaracteristique => annonceCaracteristique.annonce, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  annonceCaracteristiques: AnnonceCaracteristiqueEntity[];

  @OneToMany(() => AnnonceVideoEntity, (annonceVideo) => annonceVideo.annonce, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  videos: AnnonceVideoEntity[];

  @OneToMany(() => HistoriqueStatutAnnonceEntity, historique => historique.annonce)
  historiquesStatut: HistoriqueStatutAnnonceEntity[];

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ NOUVELLE RELATION : BOOSTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Liste des boosts de cette annonce (historique complet).
   *
   * Une annonce peut avoir PLUSIEURS boosts au cours du temps
   * (ex: boost en janvier, autre boost en juin...).
   *
   * À un instant T, il ne peut y avoir qu'UN SEUL boost actif par annonce.
   */
  @OneToMany(() => BoostEntity, boost => boost.annonce, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  boosts: BoostEntity[];

  constructor(init?: Partial<any>) {
    Object.assign(this, init);
  }
}