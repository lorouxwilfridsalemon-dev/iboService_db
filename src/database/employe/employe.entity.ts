import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
// import { VisiteEntity } from '../visite';
@Entity('employe_emp')
@Index('fx_idusrcreation_idx', ['idusrcreation'])
export class EmployeEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_emp', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'nom_emp', length: 100, scale: 0, nullable: false, unique: false  }))
  nom : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'prenom_emp', length: 255, scale: 0, nullable: false, unique: false  }))
  prenom : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'poste_emp', length: 255, scale: 0, nullable: false, unique: false  }))
  poste : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'sexe_emp', length: 255, scale: 0, nullable: false, unique: false  }))
  sexe : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'email_emp', length: 255, scale: 0, nullable: false, unique: false  }))
  email : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'date_naissance_emp', length: 255, scale: 0, nullable: false, unique: false  }))
  dateNaissance : Date;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty1_emp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty1 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty2_emp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty2 : string;

  @Column (DefaultEntity.convertDataType({ type: 'varchar' , name:'empty3_emp', length: 100, scale: 0, nullable: true, unique: false  }))
  empty3 : string;

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'geler_emp', length: 100, scale: 0, nullable: false, unique: false  }))
  geler : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'date_creation_emp', scale: 0, nullable: false, unique: false  }))
  dateCreation : Date; 

  @Column (DefaultEntity.convertDataType({ type: 'integer' , name:'idusrcreation_emp', scale: 0, nullable: true, unique: false  }))
  idusrcreation : number; 

  // @OneToMany(type => VisiteEntity, visite => visite.id, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  // visite : VisiteEntity[];

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 
