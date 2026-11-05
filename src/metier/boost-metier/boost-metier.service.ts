import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoostEntity } from '../../database/boost/boost.entity';
import { AnnonceEntity } from '../../database/annonce/annonce.entity';
import { UtilisateurEntity } from '../../database/utilisateur/utilisateur.entity';
import { TransactionEntity } from '../../database/transaction/transaction.entity';

/**
 * Tarifs des boosts (en FCFA).
 * Doivent correspondre au document business model.
 */
const TARIFS_BOOST = {
  1: 500, // 1 mois
  6: 1500, // 6 mois
};

/**
 * Durées en heures.
 */
const DUREES_HEURES = {
  1: 30 * 24, // 720 heures
  6: 180 * 24, // 4320 heures
};

@Injectable()
export class BoostMetierService {
  constructor(
    @InjectRepository(BoostEntity)
    private readonly boostRepository: Repository<BoostEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,

    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  // =========================================================================
  // ACHAT DE BOOST
  // =========================================================================

  /**
   * Achete un boost pour une annonce.
   *
   * Flux :
   * 1. Vérifie que l'utilisateur est propriétaire de l'annonce
   * 2. Vérifie qu'il n'y a pas déjà un boost actif sur cette annonce
   * 3. Calcule le prix
   * 4. Crée le boost (statut 'en_attente')
   * 5. Crée une transaction (statut 'en_attente')
   * 6. Retourne les infos pour initier le paiement
   */
  async acheterBoost(
    annonceId: number,
    dureeMois: number,
    idUsrConnecte: number,
  ) {
    // 1. Vérifier que l'utilisateur existe
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: idUsrConnecte },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // 2. Vérifier que l'annonce existe
    const annonce = await this.annonceRepository.findOne({
      where: { id: annonceId },
      relations: ['utilisateur'],
    });

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable');
    }

    // 3. Vérifier que l'utilisateur est propriétaire de l'annonce
    if (annonce.utilisateur?.id !== idUsrConnecte) {
      throw new ForbiddenException(
        'Vous n\'êtes pas propriétaire de cette annonce',
      );
    }

    // 4. Vérifier qu'il n'y a pas déjà un boost actif
    const boostActif = await this.boostRepository.findOne({
      where: {
        annonce: { id: annonceId },
        statut: 'actif',
        geler: 0,
      },
    });

    if (boostActif) {
      throw new ConflictException(
        'Cette annonce a déjà un boost actif',
      );
    }

    // 5. Calculer le prix et la durée
    const montantPaye = TARIFS_BOOST[dureeMois];
    const dureeHeures = DUREES_HEURES[dureeMois];

    if (!montantPaye || !dureeHeures) {
      throw new BadRequestException(
        'Durée invalide. Choisissez 1 ou 6 mois',
      );
    }

    // 6. Calculer les dates
    const dateDebut = new Date();
    const dateFin = new Date(
      dateDebut.getTime() + dureeHeures * 60 * 60 * 1000,
    );

    // 7. Générer la référence du boost
    const referenceBoost = await this.genererReferenceBoost();

    // 8. Créer le boost
    const boost = this.boostRepository.create({
      reference: referenceBoost,
      typeBoost: 'top_liste',
      dureeHeures,
      dateDebut,
      dateFin,
      montantPaye,
      devise: 'XOF',
      gratuit: 0,
      nbVues: 0,
      nbClics: 0,
      nbContacts: 0,
      statut: 'en_attente',
      dateCreation: new Date(),
      geler: 0,
      idusrcreation: idUsrConnecte,
      annonce: { id: annonceId } as AnnonceEntity,
      utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
    });

    const boostSaved = await this.boostRepository.save(boost);

    // 9. Générer la référence de la transaction
    const referenceTransaction = await this.genererReferenceTransaction();

    // 10. Créer la transaction
    const transaction = this.transactionRepository.create({
      reference: referenceTransaction,
      type: 'boost',
      montant: montantPaye,
      devise: 'XOF',
      montantCommission: 0,
      pourcentageCommission: 0,
      montantNet: montantPaye,
      statut: 'en_attente',
      methodePaiement: null,
      referenceExterne: null,
      referenceOperateur: null,
      description: `Achat boost ${dureeMois} mois pour annonce #${annonceId}`,
      metadata: JSON.stringify({
        boostId: boostSaved.id,
        annonceId,
        dureeMois,
      }),
      erreur: null,
      dateCreation: new Date(),
      dateValidation: null,
      dateRemboursement: null,
      geler: 0,
      idusrcreation: idUsrConnecte,
      utilisateur: { id: idUsrConnecte } as UtilisateurEntity,
      beneficiaire: null,
      reservation: null,
    });

    const transactionSaved = await this.transactionRepository.save(
      transaction,
    );

    return {
      success: true,
      message: 'Boost créé. Veuillez procéder au paiement.',
      boost: this.formaterBoost(boostSaved, annonce),
      transaction: {
        id: transactionSaved.id,
        reference: transactionSaved.reference,
        montant: transactionSaved.montant,
        devise: transactionSaved.devise,
      },
    };
  }

  // =========================================================================
  // CONSULTATION
  // =========================================================================

  /**
   * Récupère les boosts actifs de l'utilisateur.
   */
  async getMesBoosts(idUsrConnecte: number) {
    const boosts = await this.boostRepository.find({
      where: { utilisateur: { id: idUsrConnecte }, geler: 0 },
      relations: ['annonce'],
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      count: boosts.length,
      data: boosts.map((b) => this.formaterBoost(b, b.annonce)),
    };
  }

  /**
   * Récupère le boost actif d'une annonce.
   */
  async getBoostActif(annonceId: number) {
    const boost = await this.boostRepository.findOne({
      where: {
        annonce: { id: annonceId },
        statut: 'actif',
        geler: 0,
      },
      relations: ['annonce'],
    });

    if (!boost) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: this.formaterBoost(boost, boost.annonce),
    };
  }

  // =========================================================================
  // MÉTHODES INTERNES
  // =========================================================================

  private async genererReferenceBoost(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.boostRepository.count();
    const numero = (count + 1).toString().padStart(6, '0');
    return `BST-${annee}-${numero}`;
  }

  private async genererReferenceTransaction(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.transactionRepository.count();
    const numero = (count + 1).toString().padStart(6, '0');
    return `TRX-${annee}-${numero}`;
  }

  // =========================================================================
  // FORMATAGE
  // =========================================================================

  private formaterBoost(boost: BoostEntity, annonce?: AnnonceEntity) {
    return {
      id: boost.id,
      reference: boost.reference,
      typeBoost: boost.typeBoost,
      dureeHeures: boost.dureeHeures,
      dateDebut: boost.dateDebut,
      dateFin: boost.dateFin,
      montantPaye: boost.montantPaye,
      devise: boost.devise,
      statut: boost.statut,
      statistiques: {
        nbVues: boost.nbVues,
        nbClics: boost.nbClics,
        nbContacts: boost.nbContacts,
      },
      annonce: annonce
        ? {
            id: annonce.id,
            titre: annonce.titre,
            adresse: annonce.adresse,
          }
        : null,
      dateCreation: boost.dateCreation,
    };
  }
} 