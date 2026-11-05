import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AnnonceEntity } from '../annonce/annonce.entity';

@Entity('annonce_video_avi') // Renommé pour cohérence
@Index('fx_idusrcreation_avi', ['idusrcreation'])
@Index('fx_geler_idx_avi', ['geler'])
@Index('fx_date_creation_idx_avi', ['dateCreation'])
export class AnnonceVideoEntity {

  @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_avi', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
  id: number;

  // ✅ Nom de la vidéo (ex: "Visite villa cocody")
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'nom_avi', length: 255, scale: 0, nullable: true, unique: false }))
  nom: string;

  // ✅ URL ou chemin d'accès à la vidéo (OBLIGATOIRE)
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'url_video_avi', length: 500, scale: 0, nullable: false, unique: false }))
  url_video: string;

  // ✅ Taille de la vidéo en Mo (Optionnel)
  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'taille_avi', scale: 0, nullable: true, unique: false }))
  taille: number;

  // ✅ Description courte de la vidéo
  @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'description_avi', length: 255, scale: 0, nullable: true, unique: false }))
  description: string;

  // ❌ SUPPRIMÉ : order_image, empty1, empty2, empty3 (inutiles pour les vidéos)

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_avi', scale: 0, nullable: false, unique: false }))
  geler: number;

  @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_avi', scale: 0, nullable: false, unique: false }))
  dateCreation: Date;

  @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_avi', scale: 0, nullable: true, unique: false }))
  idusrcreation: number;

  // ✅ RELATION CORRIGÉE : ManyToOne vers Annonce
  @ManyToOne(() => AnnonceEntity, (annonce) => annonce.videos, { 
    nullable: false, 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_ano' }) 
  annonce: AnnonceEntity;

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
}

