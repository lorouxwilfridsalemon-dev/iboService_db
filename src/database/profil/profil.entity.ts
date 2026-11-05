import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';

@Entity('profil_pro')
@Index('fx_idusrcreation_idx_pro', ['idusrcreation'])
export class ProfilEntity {  

    @PrimaryGeneratedColumn(DefaultEntity.convertDataType({ type: 'integer', name: 'id_pro', length: 11, scale: 0, primary: true, nullable: false, unique: true }))
    id: number;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'libelle_pro', length: 100, scale: 0, nullable: false, unique: false }))
    libelle: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty1_pro', length: 100, scale: 0, nullable: true, unique: false }))
    empty1: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty2_pro', length: 100, scale: 0, nullable: true, unique: false }))
    empty2: string;

    @Column(DefaultEntity.convertDataType({ type: 'varchar', name: 'empty3_pro', length: 100, scale: 0, nullable: true, unique: false }))
    empty3: string;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'geler_pro', length: 11, scale: 0, nullable: false, unique: false }))
    geler: number;

    @Column(DefaultEntity.convertDataType({ type: 'integer', name: 'idusrcreation_pro', length: 11, scale: 0, nullable: false, unique: false }))
    idusrcreation: number;

    @Column(DefaultEntity.convertDataType({ type: 'timestamp', name: 'date_creation_pro', scale: 0, nullable: false, unique: false }))
    dateCreation: Date;

    // ✅ Un profil a plusieurs utilisateurs
    @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.profil, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    })
    utilisateurs: UtilisateurEntity[];

    constructor(init?: Partial<any>) {
        Object.assign(this, init);
    }
}