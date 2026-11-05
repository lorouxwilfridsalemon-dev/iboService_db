import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../database/notification/notification.entity';

@Injectable()
export class NotificationMetierService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * ✅ Point d'entrée générique : n'importe quel autre module métier
   * (réservation, publication, messagerie plus tard...) peut appeler
   * cette méthode pour créer une notification, sans avoir à connaître
   * les détails de l'entité NotificationEntity.
   *
   * ✅ AJOUT : referenceType/referenceId (stockés dans empty1/empty2,
   * colonnes existantes jusqu'ici inutilisées — pas de migration de base
   * nécessaire) permettent au client de savoir VERS QUOI naviguer en
   * tapant sur la notification (ex: "reservation" + id 42 → ouvrir le
   * détail de cette réservation précise, au lieu d'un simple texte).
   */
  async creerNotification(params: {
    idUsr: number;
    titre: string;
    message: string;
    type: 'reservation' | 'annonce' | 'message' | 'systeme';
    referenceType?: string;
    referenceId?: number;
  }) {
    const notification = this.notificationRepository.create({
      titre: params.titre,
      message: params.message,
      type: params.type,
      statut: 'non_lu',
      is_lu: false,
      empty1: params.referenceType ?? null,
      empty2: params.referenceId != null ? String(params.referenceId) : null,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: params.idUsr,
      utilisateur: { id: params.idUsr } as any,
    });

    return this.notificationRepository.save(notification);
  }

  /**
   * ✅ CORRIGÉ : pagination obligatoire (limit/offset) — sans ça, un
   * utilisateur avec un long historique chargerait TOUTES ses
   * notifications à chaque ouverture de la page, ce qui ne tient pas la
   * charge à grande échelle (des millions d'utilisateurs, potentiellement
   * des milliers de notifications chacun avec le temps).
   *
   * @param limit Nombre de notifications par page (défaut 20, max 50 pour
   * éviter qu'un client mal intentionné ou buggé ne demande des pages
   * démesurées).
   * @param offset Décalage pour la page suivante (0 = première page).
   */
  async mesNotifications(idUsrConnecte: number, limit = 20, offset = 0) {
    const limiteReelle = Math.min(Math.max(limit, 1), 50);

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { utilisateur: { id: idUsrConnecte } as any, geler: 0 },
      order: { dateCreation: 'DESC' } as any,
      take: limiteReelle,
      skip: Math.max(offset, 0),
    });

    return {
      etat: 'succes',
      message: 'Notifications récupérées',
      data: {
        notifications: notifications.map((n) => ({
          id: n.id,
          titre: n.titre,
          message: n.message,
          type: n.type,
          estLue: n.is_lu === true,
          dateCreation: n.dateCreation,
          // ✅ AJOUT : référence pour la navigation côté Flutter.
          referenceType: n.empty1 || null,
          referenceId: n.empty2 ? Number(n.empty2) : null,
        })),
        total,
        limit: limiteReelle,
        offset,
        aPlusDePages: offset + limiteReelle < total,
      },
    };
  }

  /**
   * Nombre de notifications non lues — pour afficher le badge rouge
   * sur l'icône cloche dans l'AppBar. Cette requête reste rapide même à
   * grande échelle car elle ne fait qu'un COUNT (pas de chargement des
   * lignes elles-mêmes).
   */
  async nombreNonLues(idUsrConnecte: number) {
    const nombre = await this.notificationRepository.count({
      where: {
        utilisateur: { id: idUsrConnecte } as any,
        is_lu: false,
        geler: 0,
      },
    });
    return { etat: 'succes', message: '', data: { nombre } };
  }

  /**
   * Marque une notification comme lue — vérifie que l'utilisateur
   * connecté en est bien le destinataire avant de la modifier.
   */
  async marquerCommeLue(id: number, idUsrConnecte: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id } as any,
      relations: ['utilisateur'],
    });

    if (!notification) {
      throw new NotFoundException('Notification introuvable');
    }

    const destinataireId = (notification as any).utilisateur?.id;
    if (destinataireId !== idUsrConnecte) {
      throw new ForbiddenException(
        "Cette notification ne vous appartient pas.",
      );
    }

    notification.is_lu = true;
    notification.statut = 'lu';
    await this.notificationRepository.save(notification);

    return { etat: 'succes', message: 'Notification marquée comme lue' };
  }

  /**
   * ✅ Marque TOUTES les notifications de l'utilisateur comme lues —
   * pratique pour un bouton "Tout marquer comme lu".
   */
  async marquerToutCommeLu(idUsrConnecte: number) {
    await this.notificationRepository.update(
      { utilisateur: { id: idUsrConnecte } as any, is_lu: false },
      { is_lu: true, statut: 'lu' },
    );
    return { etat: 'succes', message: 'Toutes les notifications sont marquées comme lues' };
  }
}