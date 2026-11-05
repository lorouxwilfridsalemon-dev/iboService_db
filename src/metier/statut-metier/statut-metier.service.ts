

// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThanOrEqual } from 'typeorm';
// import { StatutEntity } from '../../database/statut/statut.entity';
// import { StatutVueEntity } from '../../database/statut_vue/statut_vue.entity';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';

// const BASE_URL = 'http://192.168.1.34:4007';
// const DUREE_VIE_HEURES = 24; 

// @Injectable()
// export class StatutMetierService {
//   private readonly logger = new Logger(StatutMetierService.name);

//   constructor(
//     @InjectRepository(StatutEntity)
//     private readonly statutRepository: Repository<StatutEntity>,

//     @InjectRepository(StatutVueEntity)
//     private readonly statutVueRepository: Repository<StatutVueEntity>,

//     @InjectRepository(UtilisateurEntity)
//     private readonly utilisateurRepository: Repository<UtilisateurEntity>,
//   ) {}

//   // ============================================================
//   // ✅ CRÉER UN STATUT
//   // ============================================================
//   async creerStatut(
//     userId: number,
//     type: 'image' | 'video' | 'texte',
//     fichier?: string | null,
//     contenu?: string | null,
//     couleurFond?: string | null,
//   ) {
//     const maintenant = new Date();
//     const expiration = new Date(
//       maintenant.getTime() + DUREE_VIE_HEURES * 60 * 60 * 1000,
//     );

//     const statut = this.statutRepository.create({
//       type,
//       fichier: fichier ?? null,
//       contenu: contenu ?? null,
//       couleurFond: couleurFond ?? '#16A34A',
//       dateCreation: maintenant,
//       dateExpiration: expiration,
//       geler: 0,
//       idusrcreation: userId,
//       utilisateur: { id: userId } as any,
//     });

//     const saved = await this.statutRepository.save(statut);

//     // On recharge avec la relation utilisateur
//     const complet = await this.statutRepository.findOne({
//       where: { id: saved.id },
//       relations: ['utilisateur', 'vues'],
//     });

//     return {
//       etat: 'succes',
//       message: 'Statut créé avec succès',
//       data: this.formaterStatut(complet, userId),
//     };
//   }

//   // ============================================================
//   // ✅ LISTER LES STATUTS (groupés par utilisateur)
//   // ============================================================
//   async getStatuts(userId: number) {
//     const maintenant = new Date();

//     // Récupérer tous les statuts non expirés
//     const statuts = await this.statutRepository
//       .createQueryBuilder('statut')
//       .leftJoinAndSelect('statut.utilisateur', 'utilisateur')
//       .leftJoinAndSelect('statut.vues', 'vues')
//       .leftJoinAndSelect('vues.utilisateur', 'vueUtilisateur')
//       .where('statut.geler = 0')
//       .andWhere('statut.dateExpiration > :maintenant', { maintenant })
//       .orderBy('statut.dateCreation', 'DESC')
//       .getMany();

//     // Grouper par utilisateur
//     const parUtilisateur = new Map<number, any>();

//     for (const s of statuts) {
//       const user = (s as any).utilisateur;
//       if (!user) continue;

//       if (!parUtilisateur.has(user.id)) {
//         parUtilisateur.set(user.id, {
//           utilisateurId: user.id,
//           nomComplet: [user.prenom, user.nom].filter((v) => !!v).join(' '),
//           avatar: user.photo
//             ? `${BASE_URL}/files/profils/${user.photo}`
//             : '',
//           statuts: [],
//           aDesNonVus: false,
//           estMonStatut: user.id === userId,
//         });
//       }

//       const groupe = parUtilisateur.get(user.id);
//       const dejaVu = (s as any).vues?.some(
//         (v: any) => v.utilisateur?.id === userId,
//       ) ?? false;

//       groupe.statuts.push({
//         id: s.id,
//         type: s.type,
//         fichier: s.fichier,
//         fichierUrl: s.fichier ? `${BASE_URL}/files/statuts/${s.fichier}` : null,
//         contenu: s.contenu,
//         couleurFond: s.couleurFond,
//         dateCreation: s.dateCreation,
//         dateExpiration: s.dateExpiration,
//         dejaVu,
//         nombreVues: (s as any).vues?.length ?? 0,
//         estMonStatut: user.id === userId,
//       });

//       if (!dejaVu && user.id !== userId) {
//         groupe.aDesNonVus = true;
//       }
//     }

//     // Trier : mon statut d'abord, puis les non-vus, puis les autres
//     const liste = Array.from(parUtilisateur.values()).sort((a, b) => {
//       if (a.estMonStatut !== b.estMonStatut) {
//         return a.estMonStatut ? -1 : 1;
//       }
//       if (a.aDesNonVus !== b.aDesNonVus) {
//         return a.aDesNonVus ? -1 : 1;
//       }
//       return 0;
//     });

//     return {
//       etat: 'succes',
//       message: 'Statuts récupérés',
//       data: liste,
//     };
//   }

//   // ============================================================
//   // ✅ MARQUER UN STATUT COMME VU
//   // ============================================================
//   async marquerCommeVu(statutId: number, userId: number) {
//     const statut = await this.statutRepository.findOne({
//       where: { id: statutId },
//       relations: ['utilisateur'],
//     });

//     if (!statut) {
//       throw new NotFoundException('Statut introuvable');
//     }

//     // Si c'est mon propre statut, pas besoin de marquer "vu"
//     if ((statut as any).utilisateur?.id === userId) {
//       return { etat: 'succes', message: 'Statut personnel' };
//     }

//     // Vérifier si déjà vu
//     const dejaVu = await this.statutVueRepository.findOne({
//       where: {
//         statut: { id: statutId } as any,
//         utilisateur: { id: userId } as any,
//       },
//     });

//     if (!dejaVu) {
//       const vue = this.statutVueRepository.create({
//         dateVue: new Date(),
//         geler: 0,
//         idusrcreation: userId,
//         statut: { id: statutId } as any,
//         utilisateur: { id: userId } as any,
//       });
//       await this.statutVueRepository.save(vue);
//     }

//     return { etat: 'succes', message: 'Statut marqué comme vu' };
//   }

//   // ============================================================
//   // ✅ SUPPRIMER UN STATUT (par son auteur uniquement)
//   // ============================================================
//   async supprimerStatut(statutId: number, userId: number) {
//     const statut = await this.statutRepository.findOne({
//       where: { id: statutId },
//       relations: ['utilisateur'],
//     });

//     if (!statut) {
//       throw new NotFoundException('Statut introuvable');
//     }

//     if ((statut as any).utilisateur?.id !== userId) {
//       throw new NotFoundException('Vous ne pouvez supprimer que vos statuts');
//     }

//     await this.statutRepository.delete(statutId);
//     return { etat: 'succes', message: 'Statut supprimé' };
//   }

//   // ============================================================
//   // ✅ NETTOYER LES STATUTS EXPIRÉS
//   // ============================================================
//   async nettoyerStatutsExpires() {
//     const maintenant = new Date();
//     const result = await this.statutRepository.delete({
//       dateExpiration: LessThanOrEqual(maintenant),
//     });

//     this.logger.log(`🧹 ${result.affected} statuts expirés supprimés`);
//     return { etat: 'succes', message: `${result.affected} statuts supprimés` };
//   }

//   // ============================================================
//   // ✅ FORMATER UN STATUT POUR LE CLIENT
//   // ============================================================
//   private formaterStatut(statut: any, userId: number) {
//     const user = statut?.utilisateur;
//     return {
//       id: statut.id,
//       type: statut.type,
//       fichier: statut.fichier,
//       fichierUrl: statut.fichier
//         ? `${BASE_URL}/files/statuts/${statut.fichier}`
//         : null,
//       contenu: statut.contenu,
//       couleurFond: statut.couleurFond,
//       dateCreation: statut.dateCreation,
//       dateExpiration: statut.dateExpiration,
//       nombreVues: statut.vues?.length ?? 0,
//       utilisateur: user
//         ? {
//             id: user.id,
//             nom: user.nom,
//             prenom: user.prenom,
//             photo: user.photo,
//             avatar: user.photo
//               ? `${BASE_URL}/files/profils/${user.photo}`
//               : '',
//           }
//         : null,
//     };
//   }
// }


import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { StatutEntity } from '../../database/statut/statut.entity';
import { StatutVueEntity } from '../../database/statut_vue/statut_vue.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
 
const BASE_URL = 'http://192.168.1.34:4007';
const DUREE_VIE_HEURES = 24;
 
@Injectable()
export class StatutMetierService {
  private readonly logger = new Logger(StatutMetierService.name);
 
  constructor(
    @InjectRepository(StatutEntity)
    private readonly statutRepository: Repository<StatutEntity>,
 
    @InjectRepository(StatutVueEntity)
    private readonly statutVueRepository: Repository<StatutVueEntity>,
 
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}
 
  // ============================================================
  // ✅ CRÉER UN STATUT
  // ============================================================
  async creerStatut(
    userId: number,
    type: 'image' | 'video' | 'texte',
    fichier?: string | null,
    contenu?: string | null,
    couleurFond?: string | null,
  ) {
    const maintenant = new Date();
    const expiration = new Date(
      maintenant.getTime() + DUREE_VIE_HEURES * 60 * 60 * 1000,
    );
 
    const statut = this.statutRepository.create({
      type,
      fichier: fichier ?? null,
      contenu: contenu ?? null,
      couleurFond: couleurFond ?? '#16A34A',
      dateCreation: maintenant,
      dateExpiration: expiration,
      geler: 0,
      idusrcreation: userId,
      utilisateur: { id: userId } as any,
    });
 
    const saved = await this.statutRepository.save(statut);
 
    // On recharge avec la relation utilisateur
    const complet = await this.statutRepository.findOne({
      where: { id: saved.id },
      relations: ['utilisateur', 'vues'],
    });
 
    return {
      etat: 'succes',
      message: 'Statut créé avec succès',
      data: this.formaterStatut(complet, userId),
    };
  }
 
  // ============================================================
  // ✅ LISTER LES STATUTS (groupés par utilisateur)
  // ============================================================
  async getStatuts(userId: number) {
    const maintenant = new Date();
 
    // Récupérer tous les statuts non expirés
    const statuts = await this.statutRepository
      .createQueryBuilder('statut')
      .leftJoinAndSelect('statut.utilisateur', 'utilisateur')
      .leftJoinAndSelect('statut.vues', 'vues')
      .leftJoinAndSelect('vues.utilisateur', 'vueUtilisateur')
      .where('statut.geler = 0')
      .andWhere('statut.dateExpiration > :maintenant', { maintenant })
      .orderBy('statut.dateCreation', 'DESC')
      .getMany();
 
    // Grouper par utilisateur
    const parUtilisateur = new Map<number, any>();
 
    for (const s of statuts) {
      const user = (s as any).utilisateur;
      if (!user) continue;
 
      if (!parUtilisateur.has(user.id)) {
        parUtilisateur.set(user.id, {
          utilisateurId: user.id,
          nomComplet: [user.prenom, user.nom].filter((v) => !!v).join(' '),
          avatar: user.photo
            ? `${BASE_URL}/files/profils/${user.photo}`
            : '',
          statuts: [],
          aDesNonVus: false,
          estMonStatut: user.id === userId,
        });
      }
 
      const groupe = parUtilisateur.get(user.id);
      const dejaVu =
        (s as any).vues?.some((v: any) => v.utilisateur?.id === userId) ??
        false;
 
      groupe.statuts.push({
        id: s.id,
        type: s.type,
        fichier: s.fichier,
        fichierUrl: s.fichier ? `${BASE_URL}/files/statuts/${s.fichier}` : null,
        contenu: s.contenu,
        couleurFond: s.couleurFond,
        dateCreation: s.dateCreation,
        dateExpiration: s.dateExpiration,
        dejaVu,
        nombreVues: (s as any).vues?.length ?? 0,
        estMonStatut: user.id === userId,
      });
 
      if (!dejaVu && user.id !== userId) {
        groupe.aDesNonVus = true;
      }
    }
 
    // Trier : mon statut d'abord, puis les non-vus, puis les autres
    const liste = Array.from(parUtilisateur.values()).sort((a, b) => {
      if (a.estMonStatut !== b.estMonStatut) {
        return a.estMonStatut ? -1 : 1;
      }
      if (a.aDesNonVus !== b.aDesNonVus) {
        return a.aDesNonVus ? -1 : 1;
      }
      return 0;
    });
 
    return {
      etat: 'succes',
      message: 'Statuts récupérés',
      data: liste,
    };
  }
 
  // ============================================================
  // ✅ MARQUER UN STATUT COMME VU
  // ============================================================
  async marquerCommeVu(statutId: number, userId: number) {
    const statut = await this.statutRepository.findOne({
      where: { id: statutId },
      relations: ['utilisateur'],
    });
 
    if (!statut) {
      throw new NotFoundException('Statut introuvable');
    }
 
    // Si c'est mon propre statut, pas besoin de marquer "vu"
    if ((statut as any).utilisateur?.id === userId) {
      return { etat: 'succes', message: 'Statut personnel' };
    }
 
    // Vérifier si déjà vu
    const dejaVu = await this.statutVueRepository.findOne({
      where: {
        statut: { id: statutId } as any,
        utilisateur: { id: userId } as any,
      },
    });
 
    if (!dejaVu) {
      const vue = this.statutVueRepository.create({
        dateVue: new Date(),
        geler: 0,
        idusrcreation: userId,
        statut: { id: statutId } as any,
        utilisateur: { id: userId } as any,
      });
      await this.statutVueRepository.save(vue);
    }
 
    return { etat: 'succes', message: 'Statut marqué comme vu' };
  }
 
  // ============================================================
  // ✅ SUPPRIMER UN STATUT (par son auteur uniquement)
  // ============================================================
  async supprimerStatut(statutId: number, userId: number) {
    const statut = await this.statutRepository.findOne({
      where: { id: statutId },
      relations: ['utilisateur'],
    });
 
    if (!statut) {
      throw new NotFoundException('Statut introuvable');
    }
 
    if ((statut as any).utilisateur?.id !== userId) {
      throw new NotFoundException('Vous ne pouvez supprimer que vos statuts');
    }
 
    await this.statutRepository.delete(statutId);
    return { etat: 'succes', message: 'Statut supprimé' };
  }
 
  // ============================================================
  // ✅ NETTOYER LES STATUTS EXPIRÉS
  // ============================================================
  async nettoyerStatutsExpires() {
    const maintenant = new Date();
    const result = await this.statutRepository.delete({
      dateExpiration: LessThanOrEqual(maintenant),
    });
 
    this.logger.log(`🧹 ${result.affected} statuts expirés supprimés`);
    return { etat: 'succes', message: `${result.affected} statuts supprimés` };
  }
 
  // ============================================================
  // ✅ FORMATER UN STATUT POUR LE CLIENT
  // ============================================================
  private formaterStatut(statut: any, userId: number) {
    const user = statut?.utilisateur;
    return {
      id: statut.id,
      type: statut.type,
      fichier: statut.fichier,
      fichierUrl: statut.fichier
        ? `${BASE_URL}/files/statuts/${statut.fichier}`
        : null,
      contenu: statut.contenu,
      couleurFond: statut.couleurFond,
      dateCreation: statut.dateCreation,
      dateExpiration: statut.dateExpiration,
      nombreVues: statut.vues?.length ?? 0,
      utilisateur: user
        ? {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            photo: user.photo,
            avatar: user.photo
              ? `${BASE_URL}/files/profils/${user.photo}`
              : '',
          }
        : null,
    };
  }
}