import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { ProfilEntity } from '../profil/profil.entity';

@Entity('utilisateur_profil_upr')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class UtilisateurProfilEntity { 

@PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name: 'id_upr', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
id : number;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty1_upr', length: 100, scale: 0, nullable: true, unique: false  }))
empty1 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty2_upr', length: 100, scale: 0, nullable: true, unique: false  }))
empty2 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name: 'empty3_upr', length: 100, scale: 0, nullable: true, unique: false  }))
empty3 : string;

@Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_upr', scale: 0, nullable: false, unique: false  }))
dateCreation : Date;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_upr', length: 1, scale: 0, nullable: false, unique: false  }))
geler : number;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_upr', length: 11, scale: 0, nullable: false, unique: false  }))
idusrcreation : number;

@ManyToOne(type => UtilisateurEntity, utilisateur => utilisateur.utilisateurProfil, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
@JoinColumn({ name: 'idusr_upr'})
utilisateur : UtilisateurEntity;

@ManyToOne(type => ProfilEntity, profil => profil.utilisateurProfil, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
@JoinColumn({ name: 'idpro_upr'})
profil : ProfilEntity;

constructor(init?: Partial<any>) {
    Object.assign(this, init);
    }
}