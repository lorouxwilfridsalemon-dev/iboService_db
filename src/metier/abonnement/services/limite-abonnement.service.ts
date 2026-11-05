import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { AbonnementEntity } from 'src/database/abonnement/abonnement.entity';
import { AnnonceEntity } from 'src/database/annonce/annonce.entity';
import { PlanAbonnementEntity } from 'src/database/plan_abonnement/plan_abonnement.entity';

@Injectable()
export class LimiteAbonnementService {
  constructor(
    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,

    @InjectRepository(AnnonceEntity)
    private readonly annonceRepository: Repository<AnnonceEntity>,

    @InjectRepository(PlanAbonnementEntity)
    private readonly planRepository: Repository<PlanAbonnementEntity>,
  ) {}

  /**
   * Vérifie si l'utilisateur peut publier une nouvelle annonce.
   * Lance une exception si la limite est atteinte.
   */
  async verifierLimiteAnnonces(idUsr: number): Promise<void> {
    const abonnement = await this.getAbonnementActif(idUsr);

    if (!abonnement) {
      throw new ForbiddenException(
        'Vous devez avoir un abonnement actif pour publier une annonce.',
      );
    }

    const plan = abonnement.plan;

    // ✅ Plan illimité
    if (plan.nbAnnoncesMax >= 999999) {
      return;
    }

    // Compter les annonces actives de l'utilisateur
    const nombreAnnonces = await this.annonceRepository.count({
      where: {
        utilisateur: { id: idUsr },
        geler: 0,
      },
    });

    if (nombreAnnonces >= plan.nbAnnoncesMax) {
      throw new ForbiddenException(
        `Vous avez atteint la limite de ${plan.nbAnnoncesMax} annonces de votre forfait "${plan.nom}". ` +
          `Passez à un forfait supérieur pour publier plus d'annonces.`,
      );
    }
  }

  /**
   * Vérifie si l'utilisateur peut ajouter une vidéo.
   */
  async verifierLimiteVideo(
    idUsr: number,
    nombreVideos: number,
  ): Promise<void> {
    const abonnement = await this.getAbonnementActif(idUsr);

    if (!abonnement) {
      throw new ForbiddenException(
        'Vous devez avoir un abonnement actif pour publier une annonce.',
      );
    }

    const plan = abonnement.plan;

    // Plan gratuit : 1 vidéo max
    if (plan.code === 'gratuit' && nombreVideos > 1) {
      throw new ForbiddenException(
        'Le forfait GRATUIT permet 1 vidéo par annonce maximum. ' +
          'Passez à un forfait payant pour ajouter plus de vidéos.',
      );
    }

    // Vérifier si la vidéo est autorisée
    if (plan.videoAutorisee !== 1 && nombreVideos > 0) {
      throw new ForbiddenException(
        `Les vidéos ne sont pas autorisées avec le forfait "${plan.nom}".`,
      );
    }
  }

  /**
   * Vérifie si l'utilisateur peut ajouter autant de photos.
   */
  async verifierLimitePhotos(
    idUsr: number,
    nombrePhotos: number,
  ): Promise<void> {
    const abonnement = await this.getAbonnementActif(idUsr);

    if (!abonnement) {
      throw new ForbiddenException(
        'Vous devez avoir un abonnement actif pour publier une annonce.',
      );
    }

    const plan = abonnement.plan;

    // Plan illimité
    if (plan.nbPhotosMax >= 999999) {
      return;
    }

    if (nombrePhotos > plan.nbPhotosMax) {
      throw new ForbiddenException(
        `Votre forfait "${plan.nom}" permet ${plan.nbPhotosMax} photos par annonce maximum. ` +
          `Vous avez essayé d'en ajouter ${nombrePhotos}.`,
      );
    }
  }

  /**
   * Récupère l'abonnement actif de l'utilisateur.
   */
  private async getAbonnementActif(
    idUsr: number,
  ): Promise<AbonnementEntity | null> {
    const maintenant = new Date();

    return this.abonnementRepository.findOne({
      where: [
        {
          utilisateur: { id: idUsr },
          statut: 'actif',
          dateFin: null,
          geler: 0,
        },
        {
          utilisateur: { id: idUsr },
          statut: 'actif',
          dateFin: MoreThanOrEqual(maintenant) as any,
          geler: 0,
        },
      ],
      relations: ['plan'],
      order: { dateCreation: 'DESC' },
    });
  }
}