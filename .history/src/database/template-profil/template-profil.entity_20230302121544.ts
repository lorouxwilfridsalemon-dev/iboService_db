import {BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { UtilisateurEntity } from '../utilisateur/utilisateur.entity';
import { ProfilEntity } from '../profil/profil.entity';
import { ModuleEntity } from '../module/module.entity';
import { DroitEntity } from '../droit/droit.entity';

@Entity('template_profil_tep')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class TemplateProfilEntity { 


@PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer',name:'id_tep', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
id : number;

@ManyToOne(type => ProfilEntity, profil => profil.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
@JoinColumn({ name: 'idpro_tep'})
profil : ProfilEntity;

@ManyToOne(type => ModuleEntity, module => module.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
@JoinColumn({ name: 'idmod_tep'})
module : ModuleEntity;

@ManyToOne(type => DroitEntity, droit => droit.id, {  nullable: true, primary:false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
@JoinColumn({ name: 'iddrt_tep'})
droit : DroitEntity;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_tep', length: 100, scale: 0, nullable: true, unique: false  }))
empty1 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_tep', length: 100, scale: 0, nullable: true, unique: false  }))
empty2 : string;

@Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_tep', length: 100, scale: 0, nullable: true, unique: false  }))
empty3 : string;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_tep', length: 11, scale: 0, nullable: false, unique: false  }))
geler : number;

@Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_tep', scale: 0, nullable: false, unique: false  }))
dateCreation : Date;

@Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_tep', length: 11, scale: 0, nullable: false, unique: false  }))
idusrcreation : number;

constructor(init?: Partial<any>) {
    Object.assign(this, init);
    }
}