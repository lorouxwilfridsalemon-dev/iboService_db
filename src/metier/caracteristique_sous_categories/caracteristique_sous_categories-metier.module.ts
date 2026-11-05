// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CaracteristiqueSousCategoriesMetierController } from './caracteristique_sous_categories-metier.controller';
// import { CaracteristiqueSousCategoriesMetierService } from './caracteristique_sous_categories-metier.service';
// import { CaracteristiqueSousCategoriesEntity } from 'src/database/caracteristique_sous_categories/caracteristique_sous_categories.entity';
// // ✅ AJOUT : ces deux entités sont indispensables — create() a besoin de
// // retrouver la caractéristique ET la sous-catégorie choisies par leur id.
// import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
// import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       CaracteristiqueSousCategoriesEntity,
//       CaracteristiqueEntity,
//       SousCategoriesEntity,
//     ]),
//   ],
//   controllers: [CaracteristiqueSousCategoriesMetierController],
//   providers: [CaracteristiqueSousCategoriesMetierService],
//   exports: [CaracteristiqueSousCategoriesMetierService],
// })
// export class CaracteristiqueSousCategoriesMetierModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristiqueSousCategoriesMetierController } from './caracteristique_sous_categories-metier.controller';
import { CaracteristiqueSousCategoriesMetierService } from './caracteristique_sous_categories-metier.service';
import { CaracteristiqueSousCategoriesEntity } from 'src/database/caracteristique_sous_categories/caracteristique_sous_categories.entity';
// ✅ Indispensables : create() a besoin de retrouver la caractéristique
// ET la sous-catégorie choisies par leur id.
import { CaracteristiqueEntity } from '../../database/caracteristique/caracteristique.entity';
import { SousCategoriesEntity } from '../../database/sous_categories/sous_categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CaracteristiqueSousCategoriesEntity,
      CaracteristiqueEntity,
      SousCategoriesEntity,
    ]),
  ],
  controllers: [CaracteristiqueSousCategoriesMetierController],
  providers: [CaracteristiqueSousCategoriesMetierService],
  exports: [CaracteristiqueSousCategoriesMetierService],
})
export class CaracteristiqueSousCategoriesMetierModule {}