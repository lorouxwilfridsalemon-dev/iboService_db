import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../core/shared/systems/default.entity';
import { AchatEntity } from '../achat/achat.entity';
import { ProduitEntity } from '../produit/produit.entity';

@Entity('detail_achat_dac')

export class DetailAchatEntity { 
 
  @PrimaryGeneratedColumn (DefaultEntity.convertDataType({ type: 'integer', name:'id_dac', length: 11, scale: 0, primary:true, nullable: false, unique: true  }))
  id : number;

  @Column (DefaultEntity.convertDataType({ type: 'decimal' , name:'poids_dac', length: 10, scale: 3, nullable: true, unique: false  }))
  poids : number;

  @Column (DefaultEntity.convertDataType({ type: 'decimal' , name:'prix_kg_dac', length: 10, scale: 2, nullable: true, unique: false  }))
  prixKg : number;

  @Column (DefaultEntity.convertDataType({ type: 'decimal' , name:'montant_dac', length: 10, scale: 2, nullable: true, unique: false  }))
  montant : number;

  @Column (DefaultEntity.convertDataType({ type: 'timestamp' , name:'heure_dac', scale: 0, nullable: true, unique: false  }))
  heure : Date;

  @Column (DefaultEntity.convertDataType({ type: 'date' , name:'Date_dac', scale: 0, nullable: true, unique: false  }))
  date : Date;

  @ManyToOne(() => AchatEntity, achat => achat.detailsAchat, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'commande_idcommande' })
  achat : AchatEntity;

  @ManyToOne(() => ProduitEntity, produit => produit.detailsAchat, {onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'poisson_idpoisson' })
  produit : ProduitEntity;

  constructor(init?: Partial<any>) { 
    Object.assign(this, init);
  }
} 

