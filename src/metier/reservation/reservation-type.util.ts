// /**
//  * ✅ Classification des sous-catégories par TYPE DE RÉSERVATION.
//  *
//  * C'est le cœur de la logique métier : chaque catégorie d'annonce se
//  * réserve différemment (séjour par nuitée, location par jour, simple
//  * demande de visite, événement d'un jour, ou rendez-vous de service).
//  */

// export enum TypeReservation {
//   SEJOUR = 'sejour', // Résidence meublée : nuitées
//   VEHICULE = 'vehicule', // Transport : jours
//   VISITE = 'visite', // Immobilier location longue durée + Vente : demande de visite
//   EVENEMENT = 'evenement', // Événementiel : réservation d'un jour, prix forfaitaire
//   RENDEZ_VOUS = 'rendez_vous', // Services : rendez-vous à une date, prix du prestataire si fixé sinon à négocier
// }

// const SOUS_CATEGORIES_SEJOUR = ['Résidence meublée'];

// const SOUS_CATEGORIES_VEHICULE = ['Voiture', 'Moto', 'Camion', 'Bus'];

// const SOUS_CATEGORIES_VISITE = [
//   'Maison individuelle',
//   'Appartement',
//   'Studio',
//   'Villa',
//   'Duplex',
//   'Immeuble',
//   'Entrepôt',
// ];

// const SOUS_CATEGORIES_EVENEMENT = [
//   'Salle de mariage',
//   'Salle de conférence',
//   'Espace convivial',
//   'Terrain de sport',
//   'Salle de réception',
//   'Salle de spectacle',
//   'Espace en plein air',
// ];

// // ✅ Les Services sont maintenant réservables via un rendez-vous (date +
// // description du besoin), et non plus exclus de toute réservation.
// const SOUS_CATEGORIES_RENDEZ_VOUS = [
//   'Plomberie',
//   'Électricité',
//   'Mécanique',
//   'Gardiennage',
//   'Domestiques',
//   'Maçonnerie',
//   'Peinture',
//   'Menuiserie',
//   'Coiffure',
//   'Blanchisserie',
//   'Électroménager',
// ];

// /**
//  * Détermine le type de réservation à partir du nom de la sous-catégorie.
//  * Retourne `null` uniquement si la sous-catégorie n'est reconnue dans
//  * aucune liste (cas défensif — ne devrait normalement pas arriver).
//  */
// export function determinerTypeReservation(
//   nomSousCategorie: string,
// ): TypeReservation | null {
//   if (SOUS_CATEGORIES_SEJOUR.includes(nomSousCategorie)) {
//     return TypeReservation.SEJOUR;
//   }
//   if (SOUS_CATEGORIES_VEHICULE.includes(nomSousCategorie)) {
//     return TypeReservation.VEHICULE;
//   }
//   if (SOUS_CATEGORIES_VISITE.includes(nomSousCategorie)) {
//     return TypeReservation.VISITE;
//   }
//   if (SOUS_CATEGORIES_EVENEMENT.includes(nomSousCategorie)) {
//     return TypeReservation.EVENEMENT;
//   }
//   if (SOUS_CATEGORIES_RENDEZ_VOUS.includes(nomSousCategorie)) {
//     return TypeReservation.RENDEZ_VOUS;
//   }
//   return null; // Sous-catégorie inconnue : cas défensif
// }

// /**
//  * Vrai si ce type de réservation doit vérifier les chevauchements de dates
//  * (usage exclusif : on ne peut pas louer la même voiture, le même
//  * appartement meublé ou la même salle à deux personnes sur les mêmes
//  * dates). VISITE et RENDEZ_VOUS ne sont PAS exclusifs — un prestataire de
//  * service peut avoir plusieurs rendez-vous au même moment, et plusieurs
//  * personnes peuvent visiter un bien à des dates différentes sans blocage.
//  */
// export function necessiteVerificationChevauchement(
//   type: TypeReservation,
// ): boolean {
//   return (
//     type === TypeReservation.SEJOUR ||
//     type === TypeReservation.VEHICULE ||
//     type === TypeReservation.EVENEMENT
//   );
// } 

// /**
//  * Vrai si ce type n'utilise qu'une seule date (pas de plage début/fin).
//  */
// export function necessiteDateUnique(type: TypeReservation): boolean {
//   return (
//     type === TypeReservation.VISITE ||
//     type === TypeReservation.EVENEMENT ||
//     type === TypeReservation.RENDEZ_VOUS
//   );
// }


/**
 * ✅ Classification des sous-catégories par TYPE DE RÉSERVATION.
 *
 * C'est le cœur de la logique métier : chaque catégorie d'annonce se
 * réserve différemment (séjour par nuitée, location par jour, simple
 * demande de visite, événement multi-jours, ou rendez-vous de service).
 */

export enum TypeReservation {
  SEJOUR = 'sejour',
  VEHICULE = 'vehicule',
  VISITE = 'visite',
  EVENEMENT = 'evenement',
  RENDEZ_VOUS = 'rendez_vous',
}

const SOUS_CATEGORIES_SEJOUR = ['Résidence meublée'];

const SOUS_CATEGORIES_VEHICULE = ['Voiture', 'Moto', 'Camion', 'Bus'];

const SOUS_CATEGORIES_VISITE = [
  'Maison individuelle',
  'Appartement',
  'Studio',
  'Villa',
  'Duplex',
  'Immeuble',
  'Entrepôt',
];

const SOUS_CATEGORIES_EVENEMENT = [
  'Salle de mariage',
  'Salle de conférence',
  'Espace convivial',
  'Terrain de sport',
  'Salle de réception',
  'Salle de spectacle',
  'Espace en plein air',
];

const SOUS_CATEGORIES_RENDEZ_VOUS = [
  'Plomberie',
  'Électricité',
  'Mécanique',
  'Gardiennage',
  'Domestiques',
  'Maçonnerie',
  'Peinture',
  'Menuiserie',
  'Coiffure',
  'Blanchisserie',
  'Électroménager',
];

export function determinerTypeReservation(
  nomSousCategorie: string,
): TypeReservation | null {
  if (SOUS_CATEGORIES_SEJOUR.includes(nomSousCategorie)) {
    return TypeReservation.SEJOUR;
  }
  if (SOUS_CATEGORIES_VEHICULE.includes(nomSousCategorie)) {
    return TypeReservation.VEHICULE;
  }
  if (SOUS_CATEGORIES_VISITE.includes(nomSousCategorie)) {
    return TypeReservation.VISITE;
  }
  if (SOUS_CATEGORIES_EVENEMENT.includes(nomSousCategorie)) {
    return TypeReservation.EVENEMENT;
  }
  if (SOUS_CATEGORIES_RENDEZ_VOUS.includes(nomSousCategorie)) {
    return TypeReservation.RENDEZ_VOUS;
  }
  return null;
}

/**
 * ✅ NOUVEAU : Vrai si ce type nécessite une plage de dates (début + fin).
 * Inclut désormais l'événementiel.
 */
export function necessitePeriode(type: TypeReservation): boolean {
  return (
    type === TypeReservation.SEJOUR ||
    type === TypeReservation.VEHICULE ||
    type === TypeReservation.EVENEMENT
  );
}

/**
 * Vrai si ce type de réservation doit vérifier les chevauchements de dates.
 */
export function necessiteVerificationChevauchement(
  type: TypeReservation,
): boolean {
  return (
    type === TypeReservation.SEJOUR ||
    type === TypeReservation.VEHICULE ||
    type === TypeReservation.EVENEMENT
  );
}

/**
 * ✅ MODIFIÉ : Vrai si ce type n'utilise qu'une seule date.
 * EVENEMENT retiré — il peut maintenant être multi-jours.
 */
export function necessiteDateUnique(type: TypeReservation): boolean {
  return (
    type === TypeReservation.VISITE ||
    type === TypeReservation.RENDEZ_VOUS
  );
}