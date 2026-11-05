// import { Injectable, NotFoundException } from '@nestjs/common';
// import { EntityManager } from 'typeorm';
// import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';

// @Injectable()
// export class ProfilMetierService {

//   constructor(
//     private readonly entityManager: EntityManager,
//   ) {}

//   /**
//    * Met à jour les informations personnelles d'un utilisateur connecté
//    */
//   async updateInformationsPersonnelles(
//     userId: number,
//     updateData: { nom: string; prenom: string; contact: string }
//   ) {
//     return await this.entityManager.transaction(async (entityManager) => {

//       const utilisateur = await entityManager.findOne(UtilisateurEntity, {
//         where: { id: userId },
//       });

//       if (!utilisateur) {
//         throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé.`);
//       }

//       utilisateur.nom = updateData.nom;
//       utilisateur.prenom = updateData.prenom;
//       utilisateur.contact = updateData.contact;

//       const utilisateurMisAJour = await entityManager.save(UtilisateurEntity, utilisateur);

//       return {
//         id: utilisateurMisAJour.id,
//         nom: utilisateurMisAJour.nom,
//         prenom: utilisateurMisAJour.prenom,
//         email: utilisateurMisAJour.email,
//         contact: utilisateurMisAJour.contact,
//         profil: utilisateurMisAJour.profil,
//         // ✅ AJOUT : renvoyer aussi la photo actuelle, pour que le
//         // client puisse rafraîchir sa session sans la perdre.
//         photo: (utilisateurMisAJour as any).photo ?? null,
//       };
//     });
//   }

//   /**
//    * ✅ AJOUT : enregistre le nom de fichier de la nouvelle photo de
//    * profil pour cet utilisateur.
//    */
//   async updatePhoto(userId: number, filename: string) {
//     return await this.entityManager.transaction(async (entityManager) => {
//       const utilisateur = await entityManager.findOne(UtilisateurEntity, {
//         where: { id: userId },
//       });

//       if (!utilisateur) {
//         throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé.`);
//       }

//       (utilisateur as any).photo = filename;

//       const utilisateurMisAJour = await entityManager.save(UtilisateurEntity, utilisateur);

//       return {
//         id: utilisateurMisAJour.id,
//         nom: utilisateurMisAJour.nom,
//         prenom: utilisateurMisAJour.prenom,
//         email: utilisateurMisAJour.email,
//         contact: utilisateurMisAJour.contact,
//         photo: (utilisateurMisAJour as any).photo,
//       };
//     });
//   }
// } 

import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
// ✅ AJOUT : nécessaire pour la gestion des Profils (types de comptes)
// côté dashboard admin.
import { ProfilEntity } from '../../database/profil/profil.entity';

@Injectable()
export class ProfilMetierService {

  constructor(
    private readonly entityManager: EntityManager,
    // ✅ AJOUT
    @InjectRepository(ProfilEntity)
    private readonly profilRepository: Repository<ProfilEntity>,
  ) {}

  /**
   * Met à jour les informations personnelles d'un utilisateur connecté
   */
  async updateInformationsPersonnelles(
    userId: number,
    updateData: { nom: string; prenom: string; contact: string }
  ) {
    return await this.entityManager.transaction(async (entityManager) => {

      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: userId },
      });

      if (!utilisateur) {
        throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé.`);
      }

      utilisateur.nom = updateData.nom;
      utilisateur.prenom = updateData.prenom;
      utilisateur.contact = updateData.contact;

      const utilisateurMisAJour = await entityManager.save(UtilisateurEntity, utilisateur);

      return {
        id: utilisateurMisAJour.id,
        nom: utilisateurMisAJour.nom,
        prenom: utilisateurMisAJour.prenom,
        email: utilisateurMisAJour.email,
        contact: utilisateurMisAJour.contact,
        profil: utilisateurMisAJour.profil,
        photo: (utilisateurMisAJour as any).photo ?? null,
      };
    });
  }

  /**
   * Enregistre le nom de fichier de la nouvelle photo de profil pour
   * cet utilisateur.
   */
  async updatePhoto(userId: number, filename: string) {
    return await this.entityManager.transaction(async (entityManager) => {
      const utilisateur = await entityManager.findOne(UtilisateurEntity, {
        where: { id: userId },
      });

      if (!utilisateur) {
        throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé.`);
      }

      (utilisateur as any).photo = filename;

      const utilisateurMisAJour = await entityManager.save(UtilisateurEntity, utilisateur);

      return {
        id: utilisateurMisAJour.id,
        nom: utilisateurMisAJour.nom,
        prenom: utilisateurMisAJour.prenom,
        email: utilisateurMisAJour.email,
        contact: utilisateurMisAJour.contact,
        photo: (utilisateurMisAJour as any).photo,
      };
    });
  }

  // ====================================================================
  // ✅ AJOUT : gestion des "Profils" (types de comptes) pour le dashboard
  // — contourne le CRUD générique /profil/:primaryKey dont le
  // ParseJsonPipe rejetait la requête avec "Validation object failed".
  // ====================================================================

  /**
   * GET /metier/profil/listeProfils
   */
  async listeProfils() {
    const profils = await this.profilRepository.find({
      where: { geler: 0 } as any,
      order: { id: 'DESC' } as any,
    });

    return {
      etat: 'succes',
      message: 'Profils récupérés',
      data: profils,
    };
  }

  /**
   * POST /metier/profil/ajouterProfil
   */
  async ajouterProfil(data: any, idUsrConnecte: number) {
    const profil = this.profilRepository.create({
      libelle: data.libelle,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: idUsrConnecte,
    } as any);

    const sauvegarde = await this.profilRepository.save(profil);

    return {
      etat: 'succes',
      message: 'Profil créé avec succès',
      data: sauvegarde,
    };
  }

  /**
   * PUT /metier/profil/modifierProfil/:id
   */
  async modifierProfil(id: number, data: any) {
    const profil = await this.profilRepository.findOne({ where: { id } as any });
    if (!profil) {
      throw new NotFoundException('Profil introuvable');
    }

    if (data.libelle !== undefined) profil.libelle = data.libelle;
    const sauvegarde = await this.profilRepository.save(profil);

    return {
      etat: 'succes',
      message: 'Profil modifié avec succès',
      data: sauvegarde,
    };
  }

  /**
   * DELETE /metier/profil/supprimerProfil/:id
   * Suppression douce (geler = 1).
   */
  async supprimerProfil(id: number) {
    const profil = await this.profilRepository.findOne({ where: { id } as any });
    if (!profil) {
      throw new NotFoundException('Profil introuvable');
    }

    profil.geler = 1;
    await this.profilRepository.save(profil); 

    return {
      etat: 'succes',
      message: 'Profil supprimé avec succès',
      data: null,
    };
  }
}