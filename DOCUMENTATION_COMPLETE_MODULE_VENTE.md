# 📚 Documentation Complète - Module Vente Métier

## 🎯 Introduction

Cette documentation explique **en détail** le fonctionnement du module "Vente Métier" de votre application de gestion de vente de thon. Elle est conçue pour les **débutants/juniors** qui veulent comprendre **chaque ligne de code** et la logique métier derrière.

---

## 📋 Table des matières

1. [Vue d'ensemble du module](#vue-densemble)
2. [Architecture et séparation des responsabilités](#architecture)
3. [Le Controller - Point d'entrée HTTP](#controller)
4. [Le Service - Logique métier](#service)
5. [Les Entités - Modèle de données](#entites)
6. [Workflow complet - De la requête à la réponse](#workflow)
7. [Choix techniques expliqués](#choix-techniques)
8. [Exemples concrets de la vie réelle](#exemples-concrets)
9. [Structure de documentation réutilisable](#structure-documentation)

---

## 🏗️ Vue d'ensemble du module {#vue-densemble}

### Qu'est-ce qu'un module NestJS ?

Un **module** dans NestJS, c'est comme une **boîte organisée** qui contient :

- **Controller** : Reçoit les requêtes HTTP (comme un réceptionniste)
- **Service** : Contient la logique métier (comme le chef qui fait le travail)
- **Module** : Configure et lie tout ensemble (comme le manager qui organise)

### Structure du module Vente

```
src/metier/vente/
├── vente.controller.ts    → Reçoit les requêtes HTTP
├── vente.service.ts        → Logique métier (création vente, statistiques)
├── vente.module.ts         → Configuration du module
└── index.ts                → Exports pour faciliter les imports
```

### Ce que fait le module Vente

Le module Vente permet de :

1. **Créer une vente** : Enregistrer une transaction de vente avec client, produits, pesées
2. **Consulter les ventes** : Voir les ventes par jour, mois, année

---

## 🏛️ Architecture et séparation des responsabilités {#architecture}

### Principe de séparation des responsabilités

En programmation, on sépare le code en **couches** (layers) pour que chaque partie ait **une seule responsabilité** :

```
┌─────────────────────────────────────────┐
│   FRONTEND (Interface utilisateur)     │
│   → Affiche les formulaires             │
│   → Envoie les requêtes HTTP            │
└──────────────┬──────────────────────────┘
               │ HTTP Request (POST/GET)
               ▼
┌─────────────────────────────────────────┐
│   CONTROLLER (Point d'entrée)           │
│   → Reçoit la requête HTTP               │
│   → Valide les données                   │
│   → Appelle le Service                   │
└──────────────┬──────────────────────────┘
               │ Appel de méthode
               ▼
┌─────────────────────────────────────────┐
│   SERVICE (Logique métier)              │
│   → Fait les calculs                     │
│   → Gère les transactions                │
│   → Appelle la base de données           │
└──────────────┬──────────────────────────┘
               │ Requêtes SQL
               ▼
┌─────────────────────────────────────────┐
│   DATABASE (Base de données)            │
│   → Stocke les données                   │
│   → Retourne les résultats               │
└─────────────────────────────────────────┘
```

### Pourquoi cette séparation ?

**Avant (code mélangé)** :

```typescript
// ❌ MAUVAIS : Tout est mélangé
app.post('/vente', (req, res) => {
  // Validation
  // Calculs
  // Requête SQL
  // Formatage réponse
  // Tout dans une seule fonction = IMPOSSIBLE À MAINTENIR
});
```

**Après (code séparé)** :

```typescript
// ✅ BON : Chaque couche a sa responsabilité
Controller → Reçoit la requête
Service → Fait les calculs
Entity → Structure les données
```

**Avantages** :

- ✅ **Testable** : On peut tester chaque partie séparément
- ✅ **Maintenable** : Si on change la logique, on modifie seulement le Service
- ✅ **Réutilisable** : Le Service peut être utilisé par plusieurs Controllers
- ✅ **Lisible** : Chaque fichier a un rôle clair

---

## 🎮 Le Controller - Point d'entrée HTTP {#controller}

### Qu'est-ce qu'un Controller ?

Le **Controller** est comme un **réceptionniste d'hôtel** :

- Il **reçoit** les clients (requêtes HTTP)
- Il **vérifie** leur identité (validation)
- Il **dirige** vers le bon service (appelle le Service)
- Il **retourne** la réponse au client

### Code du Controller expliqué ligne par ligne

```typescript
// vente.controller.ts

// 1️⃣ IMPORTS - On importe ce dont on a besoin
import { Body, Catch, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { VenteMetierService } from './vente.service';
```

**Explication** :

- `@nestjs/common` : Bibliothèque NestJS avec tous les décorateurs
- `Body` : Pour récupérer les données envoyées dans le corps de la requête
- `Controller` : Décorateur pour créer un controller
- `Post` : Décorateur pour créer une route POST
- `VenteMetierService` : Le service qu'on va utiliser

---

```typescript
// 2️⃣ DÉCORATEURS DE CLASSE - Configuration globale du Controller

@Catch()  // Capture toutes les erreurs non gérées
@UseInterceptors(LoggingInterceptor)  // Log toutes les requêtes
@Controller('metier/vente')  // Préfixe de toutes les routes
export class VenteMetierController {
```

**Explication des décorateurs** :

#### `@Catch()`

- **Rôle** : Capture les erreurs qui ne sont pas gérées
- **Exemple** : Si une erreur survient dans le Service, elle est capturée ici
- **Analogie** : Comme un filet de sécurité qui attrape les erreurs

#### `@UseInterceptors(LoggingInterceptor)`

- **Rôle** : Enregistre chaque requête dans les logs
- **Exemple** : "POST /metier/vente/creerVente - 2025-01-15 14:30:00"
- **Analogie** : Comme un registre d'entrée qui note tous les visiteurs

#### `@Controller('metier/vente')`

- **Rôle** : Définit le **préfixe** de toutes les routes
- **Résultat** : Toutes les routes commencent par `/metier/vente`
- **Exemple** : `@Post('creerVente')` devient `/metier/vente/creerVente`

---

```typescript
// 3️⃣ INJECTION DE DÉPENDANCE - On "injecte" le Service

constructor(
  private readonly venteMetierService: VenteMetierService,
) { }
```

**Explication** :

- **Injection de dépendance** : NestJS crée automatiquement le Service et le met à disposition
- **`private readonly`** :
  - `private` : Seule cette classe peut utiliser `venteMetierService`
  - `readonly` : On ne peut pas réassigner cette variable
- **Analogie** : Comme si NestJS vous donnait un téléphone déjà configuré pour appeler le Service

---

```typescript
// 4️⃣ ENDPOINT 1 : Créer une vente

@Post('creerVente')
async creerVente(@Body() venteData: any) {
  return await this.venteMetierService.creerVente(venteData);
}
```

**Décomposition** :

#### `@Post('creerVente')`

- **Type** : POST (pour créer/envoyer des données)
- **Route complète** : `POST /metier/vente/creerVente`
- **Pourquoi POST ?** : On **crée** une nouvelle vente (action qui modifie la base)

#### `async creerVente(...)`

- **`async`** : La fonction est **asynchrone** (elle attend des opérations longues)
- **Pourquoi async ?** : Les opérations de base de données sont lentes, on doit attendre

#### `@Body() venteData: any`

- **`@Body()`** : Récupère les données envoyées dans le **corps** de la requête HTTP
- **`venteData`** : Variable qui contient ces données
- **`any`** : Type TypeScript = "n'importe quel type" (pas idéal, mais simple pour débuter)

**Exemple de requête HTTP** :

```json
POST /metier/vente/creerVente
Content-Type: application/json

{
  "clientNom": "Amadou Diallo",
  "clientNumero": "+221771234567",
  "clientTypeClient": 1,
  "utilisateurId": 5,
  "details": [
    {
      "produitId": 2,
      "poids": 25.5
    },
    {
      "produitId": 3,
      "poids": 15.2
    }
  ]
}
```

**Ce qui se passe** :

1. Le client (frontend) envoie cette requête
2. NestJS route vers `VenteMetierController.creerVente()`
3. `@Body()` extrait le JSON et le met dans `venteData`
4. On appelle `venteMetierService.creerVente(venteData)`
5. Le Service fait le travail (voir section Service)
6. On retourne le résultat au client

---

```typescript
// 5️⃣ ENDPOINT 2 : Ventes par jour

@Post('venteParJour')
async venteParJour(@Body() query: any) {
  return await this.venteMetierService.venteParJour(query);
}
```

**Explication** :

- **Route** : `POST /metier/vente/venteParJour`
- **`@Body() query`** : Reçoit les paramètres de recherche (ex: `{ dateJour: "2025-01-15" }`)
- **Pourquoi POST et pas GET ?** : Par convention, on utilise POST pour les requêtes avec body (même si c'est une lecture)

**Exemple de requête** :

```json
POST /metier/vente/venteParJour
Content-Type: application/json

{
  "dateJour": "2025-01-15"
}
```

---

```typescript
// 6️⃣ ENDPOINT 3 et 4 : Ventes par mois et année

@Post('venteParMois')
async venteParMois(@Body() query: any) {
  return await this.venteMetierService.venteParMois(query);
}

@Post('venteParAnnee')
async venteParAnnee(@Body() query: any) {
  return await this.venteMetierService.venteParAnnee(query);
}
```

**Même logique** : On reçoit les paramètres et on délègue au Service.

---

### Résumé du Controller

| Élément         | Rôle                          | Exemple                         |
| --------------- | ----------------------------- | ------------------------------- |
| `@Controller()` | Définit le préfixe des routes | `/metier/vente`                 |
| `@Post()`       | Crée une route POST           | `POST /metier/vente/creerVente` |
| `@Body()`       | Récupère les données du corps | `{ clientNom: "..." }`          |
| `constructor()` | Injection du Service          | `venteMetierService` disponible |
| `async`         | Fonction asynchrone           | Attend les opérations DB        |

---

## ⚙️ Le Service - Logique métier {#service}

### Qu'est-ce qu'un Service ?

Le **Service** contient la **logique métier** (business logic) :

- **Calculs** : Montants, totaux, statistiques
- **Règles métier** : "Un client doit avoir un numéro", "Le montant = poids × prix"
- **Transactions** : S'assurer que tout se passe bien ou rien ne se passe
- **Requêtes complexes** : Joindre plusieurs tables, filtrer, grouper

### Code du Service expliqué

```typescript
// vente.service.ts

// 1️⃣ IMPORTS
import { Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { AchatEntity } from '../../database/achat/achat.entity';
// ... autres entités
```

**Explication** :

- `@Injectable()` : Permet à NestJS d'injecter ce Service dans d'autres classes
- `EntityManager` : Outil TypeORM pour gérer la base de données
- `getManager()` : Fonction pour obtenir l'EntityManager (pour les requêtes complexes)

---

```typescript
// 2️⃣ DÉCORATEUR ET CONSTRUCTOR

@Injectable()
export class VenteMetierService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }
```

**Explication** :

- `@Injectable()` : "Cette classe peut être injectée dans d'autres classes"
- `EntityManager` : Injecté automatiquement par NestJS
- **Analogie** : Comme si NestJS vous donnait un outil magique pour parler à la base de données

---

### Méthode 1 : `creerVente()` - Création d'une vente

Cette méthode est **la plus complexe** car elle fait plusieurs choses dans une **transaction**. Elle gère deux types de clients différents avec des logiques de prix différentes.

#### Vue d'ensemble

```typescript
async creerVente(venteData: any) {
  return await this.entityManager.transaction(async (entityManager) => {
    // ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT (Gros Client ou Normal)
    // ÉTAPE 2 : OBTENIR LE CLIENT (charger ou créer selon le type)
    // ÉTAPE 3 : CHARGER L'UTILISATEUR
    // ÉTAPE 4 : CHARGER LE PRODUIT (THON - un seul produit)
    // ÉTAPE 5 : CALCULER LE POIDS TOTAL (additionner toutes les pesées)
    // ÉTAPE 6 : CALCULER LE PRIX AU KG (selon type client et poids total)
    // ÉTAPE 7 : CALCULER LE MONTANT TOTAL
    // ÉTAPE 8 : GÉRER LE PAIEMENT (montantPaye, solde, modalité)
    // ÉTAPE 9 : CRÉER L'ACHAT
    // ÉTAPE 10 : CRÉER LES DÉTAILS (pesées)
    // ÉTAPE 11 : RETOURNER LE RÉSULTAT
  });
}
```

#### Qu'est-ce qu'une transaction ?

**Analogie** : Imaginez que vous faites un virement bancaire :

1. Vous retirez l'argent de votre compte
2. Vous le mettez dans le compte du destinataire

**Sans transaction** :

- ❌ Si l'étape 2 échoue, l'argent est perdu (retiré mais pas déposé)
- ❌ Les données sont incohérentes

**Avec transaction** :

- ✅ Si l'étape 2 échoue, l'étape 1 est **annulée automatiquement**
- ✅ Soit **tout** réussit, soit **rien** ne se passe
- ✅ Les données restent cohérentes

**En code** :

```typescript
await this.entityManager.transaction(async (entityManager) => {
  // Toutes les opérations ici sont dans une transaction
  // Si une erreur survient, TOUT est annulé automatiquement
});
```

---

#### ÉTAPE 1 : Déterminer le type de client

**Contexte** : Il existe deux types de clients avec des logiques de prix différentes :

- **Gros Client** : Prix fixe (pas de réduction)
- **Client Normal** : Prix avec réductions selon le poids total

```typescript
// ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT
// Charger le type "Gros Client" pour comparaison
const typeGrosClient = await entityManager.findOne(TypeClientEntity, {
  where: { libelle: 'Gros Client' },
});

// Vérifier si le type client sélectionné est "Gros Client"
const isGrosClient =
  typeGrosClient && venteData.clientTypeClient === typeGrosClient.id;
```

**Explication ligne par ligne** :

1. **Charger le type "Gros Client"** : On cherche dans la base le type client qui s'appelle "Gros Client"

   - **Pourquoi ?** : Pour comparer avec le type sélectionné par l'utilisateur

2. **`const isGrosClient`** : Variable booléenne qui indique si c'est un gros client
   - **`typeGrosClient &&`** : Vérifie que le type existe (protection)
   - **`venteData.clientTypeClient === typeGrosClient.id`** : Compare l'ID du type sélectionné avec l'ID du type "Gros Client"
   - **Résultat** : `true` si c'est un gros client, `false` sinon

**Analogie** : Comme vérifier si quelqu'un est VIP avant de lui donner un traitement spécial.

---

#### ÉTAPE 2 : Obtenir le client

**Deux scénarios différents** selon le type de client :

##### Scénario A : Gros Client

```typescript
if (isGrosClient) {
  // Gros client : charger par ID (client déjà sélectionné dans la liste)
  client = await entityManager.findOne(ClientEntity, {
    where: { id: venteData.clientId },
  });

  if (!client) {
    throw new Error('Client gros client introuvable');
  }
  console.log(`Gros client sélectionné: ${client.nomPrenom}`);
}
```

**Explication** :

- **Gros client** : Le client est **déjà enregistré** dans la base
- Le frontend envoie `venteData.clientId` (ID du client sélectionné)
- On charge directement le client par son ID
- **Pas de création** : Le client existe déjà

**Pourquoi ?** : Les gros clients sont pré-enregistrés dans le système, on les sélectionne juste dans une liste.

##### Scénario B : Client Normal

```typescript
else {
  // Client normal : chercher par numéro ou créer
  client = await entityManager.findOne(ClientEntity, {
    where: { numero: venteData.clientNumero }
  });

  if (!client) {
    console.log(`Nouveau client normal: ${venteData.clientNom}`);

    // Charger le type de client normal
    const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
      where: { id: venteData.clientTypeClient }
    });

    // Créer le client
    client = entityManager.create(ClientEntity, {
      nomPrenom: venteData.clientNom,
      numero: venteData.clientNumero,
      typeClient: typeClientNormal,
      geler: 0,
      dateCreation: new Date(),
      idusrcreation: venteData.utilisateurId
    });

    client = await entityManager.save(ClientEntity, client);
  } else {
    console.log(`Client normal existant: ${client.nomPrenom}`);
  }
}
```

**Explication** :

- **Client normal** : Peut être nouveau ou existant
- On cherche d'abord par numéro de téléphone
- **Si trouvé** : On utilise le client existant
- **Si pas trouvé** : On crée un nouveau client avec le type sélectionné

**Pourquoi cette logique ?** : Les clients normaux peuvent être ponctuels, on les crée à la volée s'ils n'existent pas.

---

#### ÉTAPE 3 : Charger l'utilisateur

```typescript
// ÉTAPE 3 : CHARGER L'UTILISATEUR
const utilisateur = await entityManager.findOne(UtilisateurEntity, {
  where: { id: venteData.utilisateurId },
});
```

**Explication** :

- On charge l'utilisateur qui fait la vente
- Nécessaire pour tracer qui a créé la vente (`idusrcreation`)

---

#### ÉTAPE 4 : Charger le produit (thon)

**Important** : Il n'y a qu'un seul produit dans cette application : le thon.

```typescript
// ÉTAPE 4 : CHARGER LE PRODUIT (THON)
// Puisqu'il n'y a qu'un seul produit (thon), on le charge une seule fois
const produit = await entityManager.findOne(ProduitEntity, {
  where: { id: venteData.details[0].produitId },
});

if (!produit) {
  throw new Error('Produit introuvable');
}
```

**Explication** :

- **`venteData.details[0].produitId`** : On prend le produitId de la première pesée
- **Pourquoi une seule fois ?** : Toutes les pesées concernent le même produit (thon)
- **Avantage** : Évite de charger le même produit plusieurs fois (performance)

**Analogie** : Comme si vous vendez seulement des pommes, pas besoin de vérifier le type de fruit à chaque pesée.

---

#### ÉTAPE 5 : Calculer le poids total

**Contexte** : Pour les clients normaux, le prix dépend du poids total de toutes les pesées.

```typescript
// ÉTAPE 5 : CALCULER LE POIDS TOTAL
// Additionner tous les poids de toutes les pesées
let poidsTotal = 0;
for (const element of venteData.details) {
  poidsTotal += element.poids;
}
// Exemple : 500 + 600 + 200 = 1300 kg
```

**Explication ligne par ligne** :

1. **`let poidsTotal = 0`** : Initialise le poids total à zéro

2. **`for (const element of venteData.details)`** : Boucle sur chaque pesée

   - **Analogie** : Comme additionner tous les articles dans votre panier

3. **`poidsTotal += element.poids`** : Ajoute le poids de chaque pesée au total
   - **`+=`** : Opérateur d'addition et assignation (équivalent à `poidsTotal = poidsTotal + element.poids`)

**Exemple concret** :

```
Pesée 1 : 500 kg
Pesée 2 : 600 kg
Pesée 3 : 200 kg
─────────────────
POIDS TOTAL = 1300 kg
```

**Pourquoi calculer le poids total ?** : Pour déterminer quelle réduction appliquer (1 tonne, 3 tonnes, ou prix de base).

---

#### ÉTAPE 6 : Calculer le prix au kg

**C'est ici que la logique diffère selon le type de client** :

```typescript
// ÉTAPE 6 : CALCULER LE PRIX AU KG
let prixKg = 0;

if (isGrosClient) {
  // Gros client : prix fixe (pas de réduction)
  prixKg = produit.prixKgGrosClient || produit.prixKg || 0;
} else {
  // Client normal : prix selon poids total
  if (poidsTotal >= 3000) {
    // 3 tonnes ou plus
    prixKg = produit.prixKg3Tonnes || produit.prixKg || 0;
  } else if (poidsTotal >= 1000) {
    // 1 tonne ou plus
    prixKg = produit.prixKg1Tonne || produit.prixKg || 0;
  } else {
    // Moins de 1 tonne : prix de base
    prixKg = produit.prixKg || 0;
  }
}
```

**Explication détaillée** :

##### Cas A : Gros Client

```typescript
if (isGrosClient) {
  prixKg = produit.prixKgGrosClient || produit.prixKg || 0;
}
```

- **Prix fixe** : Utilise `prixKgGrosClient` (prix spécial pour gros clients)
- **Pas de réduction** : Le prix ne change pas selon le poids
- **Fallback** : Si `prixKgGrosClient` n'existe pas, utilise `prixKg` (prix de base)

**Exemple** : Gros client achète 1300 kg → Prix = 2500 FCFA/kg (fixe, peu importe le poids)

##### Cas B : Client Normal

```typescript
else {
  if (poidsTotal >= 3000) {
    // 3 tonnes ou plus → Réduction maximale
    prixKg = produit.prixKg3Tonnes || produit.prixKg || 0;
  } else if (poidsTotal >= 1000) {
    // 1 tonne ou plus → Réduction moyenne
    prixKg = produit.prixKg1Tonne || produit.prixKg || 0;
  } else {
    // Moins de 1 tonne → Prix de base (pas de réduction)
    prixKg = produit.prixKg || 0;
  }
}
```

**Logique de réduction** :

- **≥ 3000 kg (3 tonnes)** : Prix le plus bas (`prixKg3Tonnes`)
- **≥ 1000 kg (1 tonne)** : Prix moyen (`prixKg1Tonne`)
- **< 1000 kg** : Prix de base (`prixKg`)

**Exemple concret** :

```
Client normal achète 1300 kg :
  → 1300 kg ≥ 1000 kg (mais < 3000 kg)
  → Prix utilisé = prixKg1Tonne (ex: 2750 FCFA/kg)
  → Réduction de -250 FCFA/kg par rapport au prix de base
```

**Important** : Le même prix s'applique à **toutes les pesées** de la vente. Si le total fait 1300 kg, toutes les pesées utilisent `prixKg1Tonne`.

---

#### ÉTAPE 7 : Calculer le montant total

```typescript
// ÉTAPE 7 : CALCULER LE MONTANT TOTAL
const montantTotal = poidsTotal * prixKg;
// Exemple : 1300 kg × 2750 FCFA/kg = 3 575 000 FCFA
```

**Explication** :

- **Formule simple** : `montantTotal = poidsTotal × prixKg`
- Le prix utilisé est celui calculé à l'étape 6 (selon le type de client et le poids total)

**Exemple concret** :

```
Poids total : 1300 kg
Prix (client normal, 1 tonne) : 2750 FCFA/kg
────────────────────────────────────────────
Montant total = 1300 × 2750 = 3 575 000 FCFA
```

---

#### ÉTAPE 8 : Gérer le paiement

**Contexte** : Les ventes peuvent être payées partiellement ou en totalité.

```typescript
// ÉTAPE 8 : GÉRER LE PAIEMENT
const montantPaye = venteData.montantPaye || 0;
const solde = montantTotal - montantPaye;

// Charger la modalité de paiement "Espèces"
const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  where: { libelle: 'Espèces' },
});
```

**Explication ligne par ligne** :

1. **`const montantPaye = venteData.montantPaye || 0`** :

   - Récupère le montant payé depuis les données de la vente
   - Si non fourni, utilise `0` (par défaut)
   - **Exemple** : Client paie 2 000 000 FCFA sur 3 575 000 FCFA

2. **`const solde = montantTotal - montantPaye`** :

   - Calcule ce qui reste à payer
   - **Formule** : `solde = montantTotal - montantPaye`
   - **Exemple** : `3 575 000 - 2 000 000 = 1 575 000 FCFA` (solde restant)

3. **Charger la modalité de paiement** :
   - Pour le moment, une seule modalité : "Espèces"
   - On charge cette modalité depuis la base de données

**Exemple concret** :

```
Montant total : 3 575 000 FCFA
Montant payé : 2 000 000 FCFA
───────────────────────────────
Solde restant : 1 575 000 FCFA
```

**Cas possibles** :

- **Paiement complet** : `montantPaye = montantTotal` → `solde = 0`
- **Paiement partiel** : `montantPaye < montantTotal` → `solde > 0`
- **Non payé** : `montantPaye = 0` → `solde = montantTotal`

---

#### ÉTAPE 9 : Créer l'achat (la vente principale)

```typescript
// ÉTAPE 9 : CRÉER L'ACHAT
const now = new Date();

const achat = entityManager.create(AchatEntity, {
  client: client, // Le client (objet complet)
  utilisateur: utilisateur, // L'utilisateur (objet complet)
  montantTotal: montantTotal, // Le total calculé
  montantPaye: montantPaye, // Montant payé
  solde: solde, // Solde restant
  modalitePaiement: modalitePaiement, // Modalité de paiement
  geler: 0,
  dateCreation: now,
  idusrcreation: utilisateur.id,
});

const achatSauvegarde = await entityManager.save(AchatEntity, achat);
```

**Explication** :

1. **`const now = new Date()`** : Date/heure actuelle (utilisée pour toutes les pesées)

2. **`entityManager.create()`** : Crée l'objet `AchatEntity` en mémoire

   - **`client: client`** : Relation vers le client (objet complet)
   - **`utilisateur: utilisateur`** : Relation vers l'utilisateur
   - **`montantTotal`** : Le total calculé à l'étape 7
   - **`montantPaye`** : Montant payé par le client
   - **`solde`** : Solde restant à payer
   - **`modalitePaiement`** : Modalité de paiement (ex: "Espèces")

3. **`entityManager.save()`** : Sauvegarde en base et récupère l'objet avec l'ID généré
   - **Important** : Après `save()`, `achatSauvegarde.id` existe (généré par la base)

**Pourquoi sauvegarder maintenant ?**

- On a besoin de l'ID de l'achat pour créer les détails (pesées)
- Les détails ont une **foreign key** vers l'achat

---

#### ÉTAPE 10 : Créer les détails (pesées)

**Important** : Toutes les pesées utilisent le **même prixKg** calculé à l'étape 6.

```typescript
// ÉTAPE 10 : CRÉER LES DÉTAILS (PESÉES)
const detailsCrees = [];

for (const element of venteData.details) {
  // Toutes les pesées utilisent le même prixKg calculé à l'étape 6
  const montant = element.poids * prixKg;

  const detail = entityManager.create(DetailAchatEntity, {
    achat: achatSauvegarde, // L'achat créé à l'étape 9
    produit: produit, // Le produit (thon) - même pour toutes les pesées
    poids: element.poids, // Le poids de la pesée
    montant: montant, // Montant calculé (poids × prixKg)
    dateCreation: now, // Même date que l'achat
  });

  const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);

  detailsCrees.push({
    produit: produit.libelle, // Nom du produit (ex: "Thon")
    poids: detailSauvegarde.poids,
    prixKg: prixKg, // Prix utilisé (même pour toutes les pesées)
    montant: detailSauvegarde.montant,
  });
}
```

**Explication ligne par ligne** :

1. **`const detailsCrees = []`** : Tableau pour stocker les détails créés (pour la réponse)

2. **Boucle sur chaque pesée** : Pour chaque pesée dans `venteData.details`

3. **Calculer le montant** : `montant = element.poids × prixKg`

   - **Important** : Le `prixKg` utilisé est celui calculé à l'étape 6
   - **Toutes les pesées** utilisent le même prix (selon le poids total)

4. **Créer le détail** :

   - **`achat: achatSauvegarde`** : Lien vers l'achat principal (foreign key)
   - **`produit: produit`** : Lien vers le produit (thon) - même produit pour toutes les pesées
   - **`poids`** : Poids de la pesée
   - **`montant`** : Montant calculé (poids × prixKg)

5. **Sauvegarder** : Enregistre en base

6. **Ajouter au tableau** : Pour retourner les détails dans la réponse

**Exemple concret** :

```
Vente avec 3 pesées, poids total = 1300 kg (client normal)
→ Prix utilisé = prixKg1Tonne = 2750 FCFA/kg

Pesée 1 : 500 kg × 2750 = 1 375 000 FCFA
Pesée 2 : 600 kg × 2750 = 1 650 000 FCFA
Pesée 3 : 200 kg × 2750 = 550 000 FCFA
─────────────────────────────────────────
TOTAL = 3 575 000 FCFA
```

**Structure en base de données** :

```
ACHAT (1)
  ├── DÉTAIL 1 (pesée 1 : 500 kg)
  ├── DÉTAIL 2 (pesée 2 : 600 kg)
  └── DÉTAIL 3 (pesée 3 : 200 kg)
```

**Relation** : Un achat a **plusieurs** détails (One-to-Many)

**Point important** : Même si les pesées sont différentes, elles utilisent toutes le même prix car le prix dépend du **poids total**, pas du poids individuel de chaque pesée.

---

#### ÉTAPE 11 : Retourner le résultat

```typescript
// ÉTAPE 11 : RETOURNER LE RÉSULTAT
return {
  success: true,
  message: 'Vente créée avec succès',
  data: {
    venteId: achatSauvegarde.id,
    client: {
      id: client.id,
      nom: client.nomPrenom,
      numero: client.numero,
    },
    montantTotal: achatSauvegarde.montantTotal,
    montantPaye: achatSauvegarde.montantPaye,
    solde: achatSauvegarde.solde,
    nombrePesees: detailsCrees.length,
    details: detailsCrees,
  },
};
```

**Explication** :

- **Format standardisé** : Toujours retourner `{ success, message, data }`
- **`venteId`** : ID de la vente créée (pour référence)
- **`client`** : Informations du client (simplifiées)
- **`montantTotal`** : Total de la vente
- **`montantPaye`** : Montant payé par le client
- **`solde`** : Solde restant à payer
- **`nombrePesees`** : Nombre de pesées
- **`details`** : Liste des pesées avec détails

**Exemple de réponse** :

```json
{
  "success": true,
  "message": "Vente créée avec succès",
  "data": {
    "venteId": 42,
    "client": {
      "id": 15,
      "nom": "Amadou Diallo",
      "numero": "+221771234567"
    },
    "montantTotal": 3575000,
    "montantPaye": 2000000,
    "solde": 1575000,
    "nombrePesees": 3,
    "details": [
      {
        "produit": "Thon",
        "poids": 500,
        "prixKg": 2750,
        "montant": 1375000
      },
      {
        "produit": "Thon",
        "poids": 600,
        "prixKg": 2750,
        "montant": 1650000
      },
      {
        "produit": "Thon",
        "poids": 200,
        "prixKg": 2750,
        "montant": 550000
      }
    ]
  }
}
```

**Points importants à retenir** :

- ✅ Le `prixKg` est le même pour toutes les pesées (calculé selon le poids total)
- ✅ Le `montantTotal` = somme de tous les montants des pesées
- ✅ Le `solde` = `montantTotal - montantPaye`
- ✅ Toutes les pesées concernent le même produit (thon)

---

### Méthode 2 : `venteParJour()` - Ventes d'un jour

```typescript
async venteParJour(query: any) {
  const manager = getManager();
  const { dateJour } = query;

  const ventesDuJour = await manager.createQueryBuilder(AchatEntity, 'achat')
    .select([
      "achat",
      "client",
      "typeClient",
      "detailAchat",
      "produit",
      "utilisateur"
    ])
    .leftJoin("achat.utilisateur", "utilisateur")
    .leftJoin("achat.client", "client")
    .leftJoin("client.typeClient", "typeClient")
    .leftJoin("achat.detailsAchat", "detailAchat")
    .leftJoin("detailAchat.produit", "produit")
    .where('achat.geler = 0')
    .andWhere('TO_DAYS(achat.dateCreation) = TO_DAYS(:dateJour)', { dateJour })
    .getMany();

  // Ajouter le nombre de pesées pour chaque vente
  const resultatsAvecPesees = ventesDuJour.map(achat => {
    const nombrePesees = achat.detailsAchat?.length || 0;
    return {
      ...achat,
      nombrePesees: nombrePesees
    };
  });

  return resultatsAvecPesees;
}
```

#### Explication : QueryBuilder

**QueryBuilder** est un outil TypeORM pour construire des requêtes SQL complexes de manière **sécurisée** et **lisible**.

**Analogie** : Comme construire une phrase avec des blocs :

```
SELECT ... FROM ... WHERE ... JOIN ... ORDER BY ...
```

---

#### Ligne par ligne

1. **`const manager = getManager()`** : Obtient l'EntityManager (pour QueryBuilder)

2. **`const { dateJour } = query`** : Extrait `dateJour` de l'objet `query`

   - **Exemple** : `query = { dateJour: "2025-01-15" }`

3. **`manager.createQueryBuilder(AchatEntity, 'achat')`** :

   - **`AchatEntity`** : Table principale (FROM)
   - **`'achat'`** : Alias pour cette table (comme un surnom)

4. **`.select([...])`** : Choisit les colonnes/tables à récupérer

   - **`"achat"`** : Toutes les colonnes de la table achat
   - **`"client"`** : Toutes les colonnes de la table client (via join)
   - **`"detailAchat"`** : Toutes les colonnes des détails
   - **etc.**

5. **`.leftJoin("achat.utilisateur", "utilisateur")`** :
   - **`"achat.utilisateur"`** : Relation définie dans `AchatEntity`
   - **`"utilisateur"`** : Alias pour la table utilisateur
   - **LEFT JOIN** : Inclut même si pas d'utilisateur (pas de perte de données)

**Requête SQL générée** :

```sql
SELECT
  achat.*,
  utilisateur.*,
  client.*,
  typeClient.*,
  detailAchat.*,
  produit.*
FROM achat_ach AS achat
LEFT JOIN utilisateur_uti AS utilisateur ON achat.utilisateur_idutilisateur = utilisateur.id_uti
LEFT JOIN client_cli AS client ON achat.client_idclient = client.id_cli
LEFT JOIN type_client_tyc AS typeClient ON client.type_client_idtype_client = typeClient.id_tyc
LEFT JOIN detail_achat_dac AS detailAchat ON detailAchat.commande_idcommande = achat.id_ach
LEFT JOIN produit_pro AS produit ON detailAchat.poisson_idpoisson = produit.id_pro
WHERE achat.geler_ach = 0
  AND TO_DAYS(achat.date_creation_ach) = TO_DAYS(:dateJour)
```

6. **`.where('achat.geler = 0')`** : Filtre les achats actifs (pas supprimés)

7. **`.andWhere('TO_DAYS(...) = TO_DAYS(...)')`** :

   - **`TO_DAYS()`** : Fonction MySQL qui convertit une date en nombre de jours depuis l'an 0
   - **Comparaison** : Compare seulement la **date** (ignore l'heure)
   - **Exemple** : `2025-01-15 14:30:00` et `2025-01-15 08:00:00` → même jour

8. **`.getMany()`** : Exécute la requête et retourne un **tableau** d'objets

---

#### Ajout du nombre de pesées

```typescript
const resultatsAvecPesees = ventesDuJour.map((achat) => {
  const nombrePesees = achat.detailsAchat?.length || 0;
  return {
    ...achat,
    nombrePesees: nombrePesees,
  };
});
```

**Explication** :

1. **`.map()`** : Transforme chaque élément du tableau

   - **Analogie** : Comme passer chaque élément dans une machine qui le modifie

2. **`achat.detailsAchat?.length`** :

   - **`?.`** : Optional chaining (si `detailsAchat` est `null`, ne plante pas)
   - **`.length`** : Nombre d'éléments dans le tableau

3. **`{ ...achat, nombrePesees }`** :
   - **`...achat`** : Spread operator (copie toutes les propriétés de `achat`)
   - **`nombrePesees: nombrePesees`** : Ajoute la propriété `nombrePesees`

**Résultat** : Chaque achat a maintenant une propriété `nombrePesees`

---

### Méthode 3 et 4 : `venteParMois()` et `venteParAnnee()`

**Même logique** que `venteParJour()`, mais avec des filtres différents :

```typescript
// Pour le mois
.andWhere('MONTH(achat.dateCreation) = :mois', { mois: moisInt })
.andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })

// Pour l'année
.andWhere('YEAR(achat.dateCreation) = :annee', { annee: anneeInt })
```

**Explication** :

- **`MONTH()`** : Fonction MySQL qui extrait le mois (1-12)
- **`YEAR()`** : Fonction MySQL qui extrait l'année

---

## 🗄️ Les Entités - Modèle de données {#entites}

### Qu'est-ce qu'une Entité ?

Une **Entité** est la **représentation** d'une table de base de données en TypeScript.

**Analogie** : Comme un **plan d'architecture** qui décrit la structure d'une maison :

- Les **colonnes** = les pièces
- Les **relations** = les portes entre les pièces

---

### Structure d'une Entité

```typescript
@Entity('achat_ach')  // Nom de la table en base
export class AchatEntity {
  @PrimaryGeneratedColumn(...)  // Colonne ID (auto-incrémentée)
  id: number;

  @Column(...)  // Colonne normale
  montantTotal: number;

  @ManyToOne(...)  // Relation "Plusieurs achats → Un client"
  client: ClientEntity;

  @OneToMany(...)  // Relation "Un achat → Plusieurs détails"
  detailsAchat: DetailAchatEntity[];
}
```

---

### Relations entre entités

#### 1. Relation Client → Achat

```typescript
// Dans ClientEntity
@OneToMany(() => AchatEntity, achat => achat.client)
achats: AchatEntity[];

// Dans AchatEntity
@ManyToOne(() => ClientEntity, client => client.achats)
client: ClientEntity;
```

**Explication** :

- **Un client** peut avoir **plusieurs achats** (One-to-Many)
- **Un achat** appartient à **un seul client** (Many-to-One)

**En base de données** :

- Table `achat_ach` a une colonne `client_idclient` (foreign key)

---

#### 2. Relation Achat → DetailAchat

```typescript
// Dans AchatEntity
@OneToMany(() => DetailAchatEntity, detailAchat => detailAchat.achat)
detailsAchat: DetailAchatEntity[];

// Dans DetailAchatEntity
@ManyToOne(() => AchatEntity, achat => achat.detailsAchat)
achat: AchatEntity;
```

**Explication** :

- **Un achat** peut avoir **plusieurs pesées** (détails)
- **Une pesée** appartient à **un seul achat**

**En base de données** :

- Table `detail_achat_dac` a une colonne `commande_idcommande` (foreign key vers achat)

---

### Schéma de relations complet

```
CLIENT (1)
  └── ACHATS (N)
        └── DÉTAILS_ACHAT (N)
              └── PRODUIT (1)

UTILISATEUR (1)
  └── ACHATS (N)

TYPE_CLIENT (1)
  └── CLIENTS (N)
```

**Légende** :

- `(1)` = Un seul
- `(N)` = Plusieurs

---

## 🔄 Workflow complet - De la requête à la réponse {#workflow}

### Scénario : Créer une vente

#### 1. Frontend envoie la requête

**Deux scénarios possibles** :

##### Scénario A : Gros Client

```javascript
// Frontend (JavaScript) - Gros Client
const venteData = {
  clientTypeClient: 2, // ID du type "Gros Client"
  clientId: 15, // ID du client sélectionné dans la liste
  utilisateurId: 5,
  montantPaye: 2000000, // Montant payé (optionnel)
  details: [
    { produitId: 1, poids: 500 },
    { produitId: 1, poids: 600 },
    { produitId: 1, poids: 200 },
  ],
};
```

##### Scénario B : Client Normal

```javascript
// Frontend (JavaScript) - Client Normal
const venteData = {
  clientTypeClient: 1, // ID du type "Client Normal"
  clientNom: 'Amadou Diallo', // Nom saisi
  clientNumero: '+221771234567', // Numéro saisi
  utilisateurId: 5,
  montantPaye: 2000000, // Montant payé (optionnel, défaut 0)
  details: [
    { produitId: 1, poids: 500 },
    { produitId: 1, poids: 600 },
    { produitId: 1, poids: 200 },
  ],
};

fetch('http://localhost:3000/metier/vente/creerVente', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(venteData),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

#### 2. NestJS route la requête

```
Requête HTTP arrive
    ↓
NestJS cherche la route : POST /metier/vente/creerVente
    ↓
Trouve : VenteMetierController.creerVente()
    ↓
Exécute les interceptors (logging)
    ↓
Appelle la méthode creerVente()
```

---

#### 3. Controller reçoit et délègue

```typescript
@Post('creerVente')
async creerVente(@Body() venteData: any) {
  // venteData contient maintenant :
  // {
  //   clientNom: "Amadou Diallo",
  //   clientNumero: "+221771234567",
  //   ...
  // }

  return await this.venteMetierService.creerVente(venteData);
}
```

---

#### 4. Service exécute la logique métier

```typescript
async creerVente(venteData: any) {
  return await this.entityManager.transaction(async (entityManager) => {
    // ÉTAPE 1 : DÉTERMINER LE TYPE DE CLIENT
    // ÉTAPE 2 : OBTENIR LE CLIENT (charger ou créer)
    // ÉTAPE 3 : CHARGER L'UTILISATEUR
    // ÉTAPE 4 : CHARGER LE PRODUIT (THON)
    // ÉTAPE 5 : CALCULER LE POIDS TOTAL
    // ÉTAPE 6 : CALCULER LE PRIX AU KG (selon type et poids)
    // ÉTAPE 7 : CALCULER LE MONTANT TOTAL
    // ÉTAPE 8 : GÉRER LE PAIEMENT
    // ÉTAPE 9 : CRÉER L'ACHAT EN BASE
    // ÉTAPE 10 : CRÉER LES DÉTAILS EN BASE
    // ÉTAPE 11 : RETOURNER LE RÉSULTAT
  });
}
```

**Requêtes SQL exécutées** (dans l'ordre) :

```sql
-- ÉTAPE 1 : Charger le type "Gros Client"
SELECT * FROM type_client_tyc WHERE libelle_tyc = 'Gros Client';

-- ÉTAPE 2 : Obtenir le client
-- Si gros client :
SELECT * FROM client_cli WHERE id_cli = 15;

-- Si client normal :
SELECT * FROM client_cli WHERE numero_client_cli = '+221771234567';
-- Si pas trouvé : Créer le client
INSERT INTO client_cli (nom_prenom_client_cli, numero_client_cli, ...)
VALUES ('Amadou Diallo', '+221771234567', ...);

-- ÉTAPE 3 : Charger l'utilisateur
SELECT * FROM utilisateur_uti WHERE id_uti = 5;

-- ÉTAPE 4 : Charger le produit (une seule fois)
SELECT * FROM produit_pro WHERE id_pro = 1;

-- ÉTAPE 5-7 : Calculs en mémoire (pas de requête SQL)
-- poidsTotal = 500 + 600 + 200 = 1300 kg
-- prixKg = prixKg1Tonne (si client normal et poidsTotal >= 1000)
-- montantTotal = 1300 × 2750 = 3 575 000

-- ÉTAPE 8 : Charger la modalité de paiement
SELECT * FROM modalite_paiement_mop WHERE libelle_mop = 'Espèces';

-- ÉTAPE 9 : Créer l'achat
INSERT INTO achat_ach (
  client_idclient,
  utilisateur_idutilisateur,
  montant_total_ach,
  montant_paye_ach,
  solde_ach,
  modalite_paiement_id_ach,
  ...
)
VALUES (15, 5, 3575000, 2000000, 1575000, 1, ...);

-- ÉTAPE 10 : Créer les détails (boucle)
INSERT INTO detail_achat_dac (
  commande_idcommande,
  poisson_idpoisson,
  poids_dac,
  montant_dac,
  ...
)
VALUES (42, 1, 500, 1375000, ...);  -- Détail 1

INSERT INTO detail_achat_dac (...)
VALUES (42, 1, 600, 1650000, ...);  -- Détail 2

INSERT INTO detail_achat_dac (...)
VALUES (42, 1, 200, 550000, ...);  -- Détail 3
```

---

#### 5. Service retourne le résultat

```typescript
return {
  success: true,
  message: 'Vente créée avec succès',
  data: { ... }
};
```

---

#### 6. Controller retourne au client

```typescript
// Le Controller retourne directement ce que le Service a retourné
return await this.venteMetierService.creerVente(venteData);
```

---

#### 7. NestJS sérialise en JSON

NestJS convertit automatiquement l'objet JavaScript en JSON :

```json
{
  "success": true,
  "message": "Vente créée avec succès",
  "data": {
    "venteId": 42,
    "client": { ... },
    "montantTotal": 81400,
    "nombrePesees": 2,
    "details": [ ... ]
  }
}
```

---

#### 8. Frontend reçoit la réponse

```javascript
.then(response => response.json())
.then(data => {
  console.log(data.success);  // true
  console.log(data.data.venteId);  // 42
  console.log(data.data.montantTotal);  // 81400
});
```

---

### Diagramme de séquence complet

```
Frontend          Controller          Service          Database
   │                   │                  │               │
   │── POST /creerVente─→│                  │               │
   │                   │                  │               │
   │                   │── creerVente() ─→│               │
   │                   │                  │               │
   │                   │                  │── BEGIN TRANSACTION
   │                   │                  │               │
   │                   │                  │── SELECT client
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │                  │── INSERT client (si nouveau)
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │                  │── SELECT produits
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │                  │── INSERT achat
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │                  │── INSERT details
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │                  │── COMMIT TRANSACTION
   │                   │                  │←──────────────│
   │                   │                  │               │
   │                   │←── return {...} ─│               │
   │                   │                  │               │
   │←── JSON Response ──│                  │               │
   │                   │                  │               │
```

---

## 🛠️ Choix techniques expliqués {#choix-techniques}

### Pourquoi TypeORM ?

**TypeORM** est un **ORM** (Object-Relational Mapping) :

- **Traduit** les objets JavaScript en requêtes SQL
- **Gère** les relations entre tables automatiquement
- **Type-safe** : TypeScript vérifie les types

**Alternative** : Écrire du SQL brut

```typescript
// ❌ Sans ORM (SQL brut)
const result = await db.query(
  `
  SELECT * FROM achat_ach 
  WHERE id_ach = $1
`,
  [id],
);

// ✅ Avec TypeORM
const achat = await entityManager.findOne(AchatEntity, {
  where: { id: id },
});
```

**Avantages TypeORM** :

- ✅ Code plus lisible
- ✅ Protection contre les injections SQL
- ✅ Relations gérées automatiquement
- ✅ Compatible avec TypeScript

---

### Pourquoi EntityManager au lieu de Repository ?

**Repository** : Un repository par entité

```typescript
// ❌ Avec Repository (ancienne approche)
constructor(
  private readonly achatRepository: Repository<AchatEntity>,
  private readonly clientRepository: Repository<ClientEntity>,
  private readonly produitRepository: Repository<ProduitEntity>,
  // ... beaucoup de repositories
) {}
```

**EntityManager** : Un seul manager pour tout

```typescript
// ✅ Avec EntityManager (approche actuelle)
constructor(
  private readonly entityManager: EntityManager,
) {}
```

**Avantages EntityManager** :

- ✅ **Moins de dépendances** : Un seul objet injecté
- ✅ **Transactions plus simples** : `entityManager.transaction()`
- ✅ **Plus flexible** : Peut travailler avec n'importe quelle entité

---

### Pourquoi les transactions ?

**Transaction** = "Tout ou rien"

**Sans transaction** :

```typescript
// ❌ Problème : Si une étape échoue, les données sont incohérentes
await createClient();
await createAchat(); // Si ça échoue ici, le client est créé mais pas l'achat
await createDetails();
```

**Avec transaction** :

```typescript
// ✅ Solution : Si une étape échoue, TOUT est annulé
await entityManager.transaction(async (em) => {
  await em.save(client);
  await em.save(achat); // Si ça échoue, le client n'est PAS créé
  await em.save(details);
});
```

**Cas d'usage** :

- Créer plusieurs enregistrements liés
- Transférer de l'argent (débit + crédit)
- Mettre à jour plusieurs tables

---

### Pourquoi les JOINs ?

**JOIN** = Relier plusieurs tables en une seule requête

**Sans JOIN** (requêtes multiples) :

```typescript
// ❌ Problème : Beaucoup de requêtes (lent)
const achat = await findAchat(id);
const client = await findClient(achat.clientId);
const utilisateur = await findUtilisateur(achat.utilisateurId);
const details = await findDetails(achat.id);
// ... 4 requêtes séparées
```

**Avec JOIN** (une seule requête) :

```typescript
// ✅ Solution : Une seule requête (rapide)
const achat = await queryBuilder
  .leftJoin('achat.client', 'client')
  .leftJoin('achat.utilisateur', 'utilisateur')
  .leftJoin('achat.detailsAchat', 'detailAchat')
  .getOne();
// ... 1 requête avec tous les JOINs
```

**Avantages JOINs** :

- ✅ **Performance** : Moins de requêtes = plus rapide
- ✅ **Cohérence** : Toutes les données en une fois
- ✅ **Simplicité** : Un seul objet avec toutes les relations

---

### Pourquoi LEFT JOIN et pas INNER JOIN ?

**INNER JOIN** : Retourne seulement si les deux tables ont une correspondance

```sql
-- Si un achat n'a pas de client, il n'apparaît PAS dans les résultats
SELECT * FROM achat
INNER JOIN client ON achat.client_id = client.id;
```

**LEFT JOIN** : Retourne même si la table jointe n'a pas de correspondance

```sql
-- Si un achat n'a pas de client, il apparaît quand même (client = NULL)
SELECT * FROM achat
LEFT JOIN client ON achat.client_id = client.id;
```

**Pourquoi LEFT JOIN ici ?**

- ✅ **Sécurité** : On ne perd pas de données
- ✅ **Flexibilité** : Même si une relation manque, on a les données principales

---

## 🎬 Exemples concrets de la vie réelle {#exemples-concrets}

### Exemple 1 : Vente au marché - Client Normal

**Scénario** : Un client normal vient acheter du thon au marché.

**Étape par étape** :

1. **Client arrive** : "Bonjour, je veux du thon"

   - Frontend : L'utilisateur sélectionne "Client Normal"
   - Frontend : L'utilisateur saisit le nom "Amadou Diallo" et numéro "+221771234567"

2. **Première pesée** : On pèse 500 kg de thon

   - Frontend : Balance envoie `poids: 500`
   - Service : Stocke la pesée dans `venteData.details`

3. **Deuxième pesée** : On pèse 600 kg de thon

   - Frontend : Balance envoie `poids: 600`
   - Service : Stocke la pesée dans `venteData.details`

4. **Troisième pesée** : On pèse 200 kg de thon

   - Frontend : Balance envoie `poids: 200`
   - Service : Stocke la pesée dans `venteData.details`

5. **Calculs automatiques** :

   - Service : Poids total = 500 + 600 + 200 = **1300 kg**
   - Service : 1300 kg ≥ 1000 kg → Prix utilisé = `prixKg1Tonne` = **2750 FCFA/kg**
   - Service : Montant total = 1300 × 2750 = **3 575 000 FCFA**

6. **Paiement** :

   - Client paie : 2 000 000 FCFA
   - Solde restant : 3 575 000 - 2 000 000 = **1 575 000 FCFA**

7. **Enregistrement** :

   - Service : Crée l'achat (vente principale) avec montantTotal, montantPaye, solde
   - Service : Crée 3 détails (3 pesées) avec le même prixKg (2750 FCFA/kg)
   - Base de données : Tout est sauvegardé

8. **Réponse** : "Vente créée ! Total : 3 575 000 FCFA, Payé : 2 000 000 FCFA, Solde : 1 575 000 FCFA"

---

### Exemple 1bis : Vente au marché - Gros Client

**Scénario** : Un gros client vient acheter du thon au marché.

**Étape par étape** :

1. **Client arrive** : "Bonjour, c'est Konan (gros client)"

   - Frontend : L'utilisateur sélectionne "Gros Client"
   - Frontend : L'utilisateur sélectionne "Konan" dans la liste des gros clients

2. **Pesées** : Même scénario (500 kg + 600 kg + 200 kg = 1300 kg)

3. **Calculs automatiques** :

   - Service : Poids total = 1300 kg
   - Service : **Gros client** → Prix utilisé = `prixKgGrosClient` = **2500 FCFA/kg** (prix fixe)
   - Service : Montant total = 1300 × 2500 = **3 250 000 FCFA**
   - **Note** : Pas de réduction, prix fixe peu importe le poids

4. **Paiement et enregistrement** : Même logique que l'exemple 1

---

### Exemple 2 : Consultation des ventes du jour

**Scénario** : Le gérant veut voir toutes les ventes d'aujourd'hui.

**Étape par étape** :

1. **Requête** : Frontend envoie `{ dateJour: "2025-01-15" }`

2. **Service** : QueryBuilder construit la requête SQL

   ```sql
   SELECT * FROM achat
   WHERE DATE(date_creation) = '2025-01-15'
   AND geler = 0
   ```

3. **Base de données** : Retourne toutes les ventes du 15 janvier 2025

4. **Service** : Pour chaque vente, compte le nombre de pesées

   - Vente 1 : 2 pesées
   - Vente 2 : 1 pesée
   - Vente 3 : 3 pesées

5. **Réponse** : Tableau avec toutes les ventes et leur nombre de pesées

---

### Exemple 3 : Différences entre Gros Client et Client Normal

**Scénario A : Gros Client**

1. **Sélection** : L'utilisateur sélectionne "Gros Client" dans le formulaire
2. **Liste** : Une liste déroulante des gros clients pré-enregistrés s'affiche
3. **Sélection client** : L'utilisateur sélectionne "Konan" (gros client existant)
4. **Pesées** : Client fait ses pesées (ex: 1300 kg total)
5. **Prix** : Service utilise `prixKgGrosClient` = 2500 FCFA/kg (prix fixe)
6. **Montant** : 1300 × 2500 = 3 250 000 FCFA
7. **Pas de réduction** : Le prix est fixe, peu importe le poids

**Scénario B : Client Normal**

1. **Sélection** : L'utilisateur sélectionne "Client Normal" dans le formulaire
2. **Saisie** : L'utilisateur saisit le nom "Amadou Diallo" et numéro "+221771234567"
3. **Vérification** : Service cherche si le client existe par numéro
   - **Si trouvé** : Utilise le client existant
   - **Si pas trouvé** : Crée un nouveau client
4. **Pesées** : Client fait ses pesées (ex: 1300 kg total)
5. **Prix** : Service calcule le prix selon le poids total
   - 1300 kg ≥ 1000 kg → Prix = `prixKg1Tonne` = 2750 FCFA/kg
6. **Montant** : 1300 × 2750 = 3 575 000 FCFA
7. **Réduction appliquée** : -250 FCFA/kg par rapport au prix de base

**Comparaison** :

| Critère               | Gros Client               | Client Normal               |
| --------------------- | ------------------------- | --------------------------- |
| **Enregistrement**    | Pré-enregistré            | Créé à la volée si nouveau  |
| **Prix**              | Fixe (`prixKgGrosClient`) | Variable selon poids total  |
| **Réduction**         | ❌ Aucune                 | ✅ Selon poids (1T, 3T)     |
| **Exemple (1300 kg)** | 2500 FCFA/kg              | 2750 FCFA/kg (réduction 1T) |

**Pourquoi cette logique ?**

- ✅ **Gros clients** : Clients importants avec prix négocié à l'avance
- ✅ **Clients normaux** : Clients ponctuels avec réductions selon volume
- ✅ **Flexibilité** : Système adapte le prix selon le type de client

---

## 📖 Structure de documentation réutilisable {#structure-documentation}

### Template pour documenter un module

```markdown
# 📚 Documentation - Module [NOM_MODULE]

## 🎯 Introduction

- [Description du module]
- [Rôle dans l'application]

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Controller](#controller)
4. [Service](#service)
5. [Entités](#entites)
6. [Workflow](#workflow)
7. [Choix techniques](#choix-techniques)
8. [Exemples](#exemples)

## 🏗️ Vue d'ensemble

- Structure des fichiers
- Responsabilités

## 🏛️ Architecture

- Séparation des responsabilités
- Diagramme de flux

## 🎮 Controller

- Décorateurs expliqués
- Endpoints détaillés
- Exemples de requêtes

## ⚙️ Service

- Méthodes expliquées ligne par ligne
- Logique métier
- Transactions

## 🗄️ Entités

- Structure des entités
- Relations
- Schéma de base de données

## 🔄 Workflow

- Diagramme de séquence
- Exemple complet

## 🛠️ Choix techniques

- Pourquoi cette technologie ?
- Alternatives considérées

## 🎬 Exemples concrets

- Scénarios réels
- Cas d'usage
```

---

## 🎓 Résumé pour les débutants

### Concepts clés à retenir

1. **Controller** = Réceptionniste (reçoit, délègue, répond)
2. **Service** = Chef (fait le travail, logique métier)
3. **Entity** = Plan d'architecture (structure des données)
4. **Transaction** = Tout ou rien (cohérence des données)
5. **JOIN** = Relier les tables (une seule requête)
6. **QueryBuilder** = Constructeur de requêtes (sécurisé et lisible)
7. **Gros Client vs Client Normal** = Deux types de clients avec des prix différents
8. **Poids total** = Somme de toutes les pesées (détermine les réductions)
9. **Montant payé et solde** = Gestion des paiements partiels

### Workflow mental

```
Requête HTTP
    ↓
Controller (reçoit)
    ↓
Service (travaille)
    ↓
Database (stocke)
    ↓
Service (retourne)
    ↓
Controller (répond)
    ↓
Réponse HTTP
```

### Bonnes pratiques

1. ✅ **Séparation des responsabilités** : Chaque couche a un rôle
2. ✅ **Transactions** : Pour les opérations multiples
3. ✅ **JOINs** : Pour les requêtes complexes
4. ✅ **Validation** : Toujours valider les données
5. ✅ **Gestion d'erreurs** : Anticiper les problèmes
6. ✅ **Logique métier centralisée** : Tous les calculs dans le Service
7. ✅ **Gestion des types** : Distinguer clairement les différents types de clients

### Nouveaux concepts importants

#### 1. Types de clients

- **Gros Client** : Client pré-enregistré avec prix fixe
- **Client Normal** : Client créé à la volée avec réductions selon poids

#### 2. Calcul du prix

- **Gros Client** : `prixKgGrosClient` (fixe, pas de réduction)
- **Client Normal** :
  - ≥ 3000 kg → `prixKg3Tonnes` (réduction maximale)
  - ≥ 1000 kg → `prixKg1Tonne` (réduction moyenne)
  - < 1000 kg → `prixKg` (prix de base)

#### 3. Gestion du paiement

- **montantTotal** : Total de la vente
- **montantPaye** : Montant payé par le client
- **solde** : Reste à payer = `montantTotal - montantPaye`
- **modalitePaiement** : Méthode de paiement (ex: "Espèces")

#### 4. Un seul produit

- **Thon uniquement** : Toutes les pesées concernent le même produit
- **Poids total** : Addition de toutes les pesées pour déterminer les réductions
- **Même prix** : Toutes les pesées utilisent le même prixKg (calculé selon le poids total)

---

## 📝 Conclusion

Cette documentation explique **chaque aspect** du module Vente :

- **Comment** ça fonctionne (code)
- **Pourquoi** c'est fait comme ça (choix techniques)
- **Quand** utiliser ces concepts (exemples)

**Prochaines étapes** :

1. Lire le code en parallèle de cette documentation
2. Tester les endpoints avec Postman
3. Modifier le code pour comprendre l'impact
4. Créer de nouvelles fonctionnalités en suivant ce modèle

**Questions ?** Relisez la section concernée ou consultez la documentation NestJS/TypeORM officielle.

---

**Document créé le** : 2025-01-15  
**Version** : 1.0  
**Auteur** : Documentation pédagogique pour junior
