# 📘 Guide Complet : Tester l'API Vente avec Postman

**Documentation pour développeur junior**  
_Comment tester tous les endpoints du module "métier vente"_

---

## 📋 Table des matières

1. [Comprendre la logique métier](#1-comprendre-la-logique-métier)
2. [Structure des tables](#2-structure-des-tables)
3. [Endpoint 1 : Créer une vente](#endpoint-1-créer-une-vente)
4. [Endpoint 2 : Ventes par jour](#endpoint-2-ventes-par-jour)
5. [Endpoint 3 : Ventes par semaine](#endpoint-3-ventes-par-semaine)
6. [Endpoint 4 : Ventes par mois](#endpoint-4-ventes-par-mois)
7. [Endpoint 5 : Ventes par année](#endpoint-5-ventes-par-année)
8. [Erreurs fréquentes](#erreurs-fréquentes)
9. [Comment ça fonctionne techniquement](#comment-ça-fonctionne-techniquement)

---

## 1. Comprendre la logique métier

### 🎯 Concept simple

**Une vente = 1 client achète plusieurs produits (pesées)**

Imaginez un marché aux poissons :

- Un client arrive avec plusieurs poissons différents
- Chaque poisson est pesé séparément (c'est une "pesée" = un détail)
- On calcule : `montant = poids × prix_au_kg`
- Tous les montants sont additionnés pour faire le total de la vente

### 📊 Exemple concret

**Scénario** : Amadou Diallo achète :

- 25 kg de Thon à 2000 FCFA/kg = 50 000 FCFA
- 15 kg de Sardine à 1500 FCFA/kg = 22 500 FCFA
- **Total de la vente = 72 500 FCFA**

### 🔄 Workflow d'une vente

```
1. Client arrive → Le frontend envoie un booléen `isGrosClient`
   ├─ `isGrosClient = false` → Client Normal
   └─ `isGrosClient = true`  → Gros Client

2. Si Client Normal (`isGrosClient = false`) :
   ├─ Le frontend envoie `clientNumero` (et éventuellement `clientNom`)
   ├─ On cherche le client par numéro
   ├─ Si nouveau → On le crée automatiquement avec le type **Client Normal (id=1)**
   └─ Si existant → On utilise le client existant

3. Si Gros Client (`isGrosClient = true`) :
   └─ Le frontend envoie `clientId` (client déjà existant sélectionné dans une liste)

4. Calcul du poids total (toutes les pesées additionnées)

5. Calcul du prix au kg : tous les clients utilisent `prixKg` (même prix pour tous)

6. Calcul du montant total = poids total × prix au kg

7. Gestion du paiement :
   ├─ montantPaye (montant payé par le client)
   ├─ solde = montantTotal - montantPaye
   └─ modalitePaiement (ID fixe : 1 = Espèces)

8. On crée l'achat (la vente globale)

9. On crée tous les détails (les pesées)
```

---

## 2. Structure des tables

### 📦 Table `achat_ach` (La vente globale)

**Une ligne = Une vente complète**

| Colonne                     | Type      | Obligatoire | Description                                 |
| --------------------------- | --------- | ----------- | ------------------------------------------- |
| `id_ach`                    | integer   | ✅          | ID unique (auto-généré)                     |
| `montant_total_ach`         | integer   | ✅          | Montant total de la vente                   |
| `montant_paye_ach`          | integer   | ❌          | Montant payé par le client (défaut: 0)      |
| `solde_ach`                 | integer   | ❌          | Solde restant (montantTotal - montantPaye)  |
| `client_idclient`           | integer   | ✅          | ID du client (foreign key)                  |
| `utilisateur_idutilisateur` | integer   | ✅          | ID de l'utilisateur qui a fait la vente     |
| `modalite_paiement_id_ach`  | integer   | ❌          | ID de la modalité de paiement (1 = Espèces) |
| `date_creation_ach`         | timestamp | ✅          | Date/heure de création (auto)               |
| `geler_ach`                 | integer   | ✅          | 0 = actif, 1 = gelé                         |

### 📝 Table `detail_achat_dac` (Les pesées)

**Une ligne = Une pesée (un produit)**

| Colonne               | Type      | Obligatoire | Description                 |
| --------------------- | --------- | ----------- | --------------------------- |
| `id_dac`              | integer   | ✅          | ID unique (auto-généré)     |
| `poids_dac`           | integer   | ✅          | Poids en kg                 |
| `montant_dac`         | integer   | ✅          | Montant = poids × prix_kg   |
| `commande_idcommande` | integer   | ✅          | ID de l'achat (foreign key) |
| `poisson_idpoisson`   | integer   | ✅          | ID du produit (foreign key) |
| `date_creation_dac`   | timestamp | ✅          | Date/heure (auto)           |

### 👤 Table `client_cli` (Les clients)

| Colonne                     | Type        | Obligatoire | Description                        |
| --------------------------- | ----------- | ----------- | ---------------------------------- |
| `id_cli`                    | integer     | ✅          | ID unique (auto-généré)            |
| `nom_prenom_client_cli`     | varchar(50) | ✅          | Nom et prénom                      |
| `numero_client_cli`         | varchar(15) | ❌          | Numéro de téléphone                |
| `type_client_idtype_client` | integer     | ✅          | ID du type de client (foreign key) |

### 🐟 Table `produit_pro` (Les produits/poissons)

| Colonne       | Type        | Obligatoire | Description                    |
| ------------- | ----------- | ----------- | ------------------------------ |
| `id_pro`      | integer     | ✅          | ID unique (auto-généré)       |
| `libelle_pro` | varchar(50) | ✅          | Nom du produit (ex: "Thon")    |
| `prix_kg_pro` | integer     | ❌          | Prix au kilogramme (pour tous) |

### 👨‍💼 Table `utilisateur_uti` (Les utilisateurs)

| Colonne               | Type        | Obligatoire | Description             |
| --------------------- | ----------- | ----------- | ----------------------- |
| `id_uti`              | integer     | ✅          | ID unique (auto-généré) |
| `nom_utilisateur_uti` | varchar(50) | ✅          | Nom d'utilisateur       |

### 🏷️ Table `type_client_tyc` (Types de clients)

| Colonne       | Type        | Obligatoire | Description                                  |
| ------------- | ----------- | ----------- | -------------------------------------------- |
| `id_tyc`      | integer     | ✅          | ID unique (auto-généré)                      |
| `libelle_tyc` | varchar(50) | ✅          | Libellé (ex: "Client Normal", "Gros Client") |

**IDs fixes :**

- `id = 1` → Client Normal (réductions selon poids)
- `id = 2` → Gros Client (prix fixe, pas de réduction)

### 💳 Table `modalite_paiement_mop` (Modalités de paiement)

| Colonne       | Type        | Obligatoire | Description                       |
| ------------- | ----------- | ----------- | --------------------------------- |
| `id_mop`      | integer     | ✅          | ID unique (auto-généré)           |
| `libelle_mop` | varchar(50) | ✅          | Libellé (ex: "Espèces", "Chèque") |

**IDs fixes :**

- `id = 1` → Espèces (modalité par défaut)

---

## Endpoint 1 : Créer une vente

### 📍 URL

```
POST http://localhost:3000/metier/vente/creerVente
```

### 📤 Headers

```
Content-Type: application/json
```

### 📋 Body JSON - Structure complète

```json
{
  "isGrosClient": false,
  "clientNom": "Amadou Diallo",
  "clientNumero": "+221771234567",
  "clientId": null,
  "utilisateurId": 1,
  "montantPaye": 0,
  "modalitePaiementId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 25
    },
    {
      "produitId": 1,
      "poids": 15
    }
  ]
}
```

### 🔍 Explication des champs

#### Champs obligatoires au niveau racine

| Champ                | Type    | Obligatoire | Description                                                             | Exemple           |
| -------------------- | ------- | ----------- | ----------------------------------------------------------------------- | ----------------- |
| `isGrosClient`       | boolean | ✅          | `true` si gros client, `false` si client normal                         | `false`           |
| `clientNom`          | string  | ⚠️          | Nom et prénom (obligatoire si `isGrosClient = false`)                   | `"Amadou Diallo"` |
| `clientNumero`       | string  | ⚠️          | Numéro de téléphone (obligatoire si `isGrosClient = false`)             | `"+221771234567"` |
| `clientId`           | number  | ⚠️          | ID du client (obligatoire si `isGrosClient = true`)                     | `null` ou `15`    |
| `utilisateurId`      | number  | ✅          | ID de l'utilisateur qui fait la vente                                   | `1`               |
| `montantPaye`        | number  | ❌          | Montant payé par le client (défaut: 0)                                  | `0` ou `50000`    |
| `modalitePaiementId` | number  | ❌          | ID de la modalité de paiement (défaut: 1 = Espèces)                     | `1`               |
| `details`            | array   | ✅          | Liste des pesées (toutes pour le même produit dans la version actuelle) | `[{...}, {...}]`  |

#### Champs dans `details` (array)

| Champ       | Type   | Obligatoire | Description                          | Exemple |
| ----------- | ------ | ----------- | ------------------------------------ | ------- |
| `produitId` | number | ✅          | ID du produit (doit exister en base) | `1`     |
| `poids`     | number | ✅          | Poids en kg (entier)                 | `25`    |

### ✅ Exemple complet - Client Normal (1 pesée)

```json
{
  "isGrosClient": false,
  "clientNom": "Fatou Sarr",
  "clientNumero": "+221771111111",
  "utilisateurId": 1,
  "montantPaye": 0,
  "modalitePaiementId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 30
    }
  ]
}
```

### ✅ Exemple complet - Client Normal (3 pesées, total ≥ 1000 kg)

```json
{
  "isGrosClient": false,
  "clientNom": "Ibrahima Ba",
  "clientNumero": "+221772222222",
  "utilisateurId": 1,
  "montantPaye": 2000000,
  "modalitePaiementId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 500
    },
    {
      "produitId": 1,
      "poids": 400
    },
    {
      "produitId": 1,
      "poids": 200
    }
  ]
}
```

**Note :** Le prix utilisé est `prixKg` (prix de base) pour tous les clients normaux, peu importe le poids.

### ✅ Exemple complet - Gros Client (prix fixe)

```json
{
  "isGrosClient": true,
  "clientId": 15,
  "utilisateurId": 1,
  "montantPaye": 5000000,
  "modalitePaiementId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 2000
    },
    {
      "produitId": 1,
      "poids": 1500
    }
  ]
}
```

**Note :** Gros Client → Pas besoin de `clientNom` ni `clientNumero`, même prix `prixKg` que les clients normaux

### 📥 Réponse en cas de succès

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
    "montantTotal": 72500,
    "montantPaye": 0,
    "solde": 72500,
    "nombrePesees": 2,
    "details": [
      {
        "produit": "Thon",
        "poids": 25,
        "prixKg": 2000,
        "montant": 50000
      },
      {
        "produit": "Sardine",
        "poids": 15,
        "prixKg": 1500,
        "montant": 22500
      }
    ]
  }
}
```

### ⚠️ Comment savoir quels IDs utiliser ?

**Avant de tester, vous devez avoir en base :**

1. **Au moins 1 utilisateur** :

   ```sql
   SELECT id_uti, nom_utilisateur_uti FROM utilisateur_uti;
   ```

   → Utilisez un `id_uti` existant pour `utilisateurId`

2. **Au moins 1 client** (pour tester le cas `isGrosClient = true`) :

   ```sql
   SELECT id_cli, nom_prenom_client_cli, numero_client_cli FROM client_cli;
   ```

   → Utilisez un `id_cli` existant pour `clientId` lorsque `isGrosClient = true`

3. **Au moins 1 produit** :
   ```sql
   SELECT id_pro, libelle_pro, prix_kg_pro FROM produit_pro;
   ```
   → Utilisez un `id_pro` existant pour `produitId` dans `details`

### 🔄 Logique métier détaillée

#### ÉTAPE 1 : Gestion du client (avec `isGrosClient`)

```typescript
const CLIENT_NORMAL_ID = 1;
const isGrosClient = venteData.isGrosClient === true;

let client: ClientEntity;

if (isGrosClient) {
  // GROS CLIENT : on attend un clientId
  if (!venteData.clientId) {
    throw new Error('clientId est obligatoire pour un gros client');
  }

  client = await entityManager.findOne(ClientEntity, {
    where: { id: venteData.clientId },
  });
} else {
  // CLIENT NORMAL : on attend un clientNumero
  if (!venteData.clientNumero) {
    throw new Error('clientNumero est obligatoire pour un client normal');
  }

  client = await entityManager.findOne(ClientEntity, {
    where: { numero: venteData.clientNumero },
  });

  if (!client) {
    const typeClientNormal = await entityManager.findOne(TypeClientEntity, {
      where: { id: CLIENT_NORMAL_ID },
    });

    client = entityManager.create(ClientEntity, {
      nomPrenom: venteData.clientNom || 'Client sans nom',
      numero: venteData.clientNumero,
      typeClient: typeClientNormal,
      // ...
    });

    client = await entityManager.save(ClientEntity, client);
  }
}
```

**Ce que ça signifie pour vous** :

- Si vous envoyez un numéro qui existe déjà → Le client existant est utilisé
- Si vous envoyez un nouveau numéro → Un nouveau client est créé automatiquement

#### ÉTAPE 2 : Calcul du poids total

```typescript
let poidsTotal = 0;
for (const element of venteData.details) {
  poidsTotal += element.poids; // Additionner tous les poids
}
```

**Ce que ça signifie pour vous** :

- Toutes les pesées sont additionnées pour obtenir le poids total
- Exemple : 500 kg + 600 kg + 200 kg = 1300 kg

#### ÉTAPE 3 : Calcul du prix au kg selon le type de client

```typescript
// Tous les clients utilisent le même prix
const prixKg = produit.prixKg || 0;
if (prixKg === 0) {
  throw new Error('Prix du produit non defini');
}
```

**Ce que ça signifie pour vous** :

- **Tous les clients** (gros client ou client normal) : utilisent le même prix `prixKg`
- **Pas de distinction de prix** : le type de client n'affecte plus le prix au kg

#### ÉTAPE 4 : Calcul du montant total

```typescript
const montantTotal = poidsTotal * prixKg;
```

**Ce que ça signifie pour vous** :

- **Vous n'envoyez PAS le prix** dans le body
- Le prix est calculé automatiquement selon le type de client et le poids total
- Le calcul est fait automatiquement : `poids total × prix au kg calculé`

#### ÉTAPE 5 : Gestion du paiement

```typescript
const montantPaye = venteData.montantPaye || 0;
const solde = montantTotal - montantPaye;

const modalitePaiement = await entityManager.findOne(ModalitePaiementEntity, {
  where: { id: venteData.modalitePaiementId || 1 }, // 1 = Espèces par défaut
});
```

**Ce que ça signifie pour vous** :

- `montantPaye` : Montant payé par le client (défaut: 0)
- `solde` : Calculé automatiquement = `montantTotal - montantPaye`
- `modalitePaiementId` : ID de la modalité (défaut: 1 = Espèces)

#### ÉTAPE 6 : Création de l'achat (vente globale)

```typescript
const achat = entityManager.create(AchatEntity, {
  client: client,
  utilisateur: utilisateur,
  montantTotal: montantTotal, // Calculé automatiquement
  geler: 0,
  dateCreation: new Date(),
  // ...
});
```

#### ÉTAPE 7 : Création des détails (pesées)

```typescript
for (const element of venteData.details) {
  const produit = await entityManager.findOne(ProduitEntity, {
    where: { id: element.produitId },
  });

  const prixKg = produit.prixKg || 0;
  const montant = element.poids * prixKg; // Calcul automatique

  const detail = entityManager.create(DetailAchatEntity, {
    achat: achatSauvegarde,
    produit: produit,
    poids: element.poids,
    montant: montant, // Calculé automatiquement
    // ...
  });
}
```

---

## Endpoint 2 : Ventes par jour

### 📍 URL

```
POST http://localhost:3000/metier/vente/venteParJour
```

### 📤 Headers

```
Content-Type: application/json
```

### 📋 Body JSON

```json
{
  "dateJour": "2024-01-15"
}
```

### 🔍 Explication des champs

| Champ      | Type   | Obligatoire | Format       | Description        |
| ---------- | ------ | ----------- | ------------ | ------------------ |
| `dateJour` | string | ✅          | `YYYY-MM-DD` | Date au format ISO |

### ✅ Exemples

**Exemple 1 : Ventes du 15 janvier 2024**

```json
{
  "dateJour": "2024-01-15"
}
```

**Exemple 2 : Ventes d'aujourd'hui**

```json
{
  "dateJour": "2024-12-20"
}
```

### 📥 Réponse en cas de succès

```json
[
  {
    "id": 42,
    "montantTotal": 72500,
    "dateCreation": "2024-01-15T10:30:00.000Z",
    "geler": 0,
    "nombrePesees": 2,
    "client": {
      "id": 15,
      "nomPrenom": "Amadou Diallo",
      "numero": "+221771234567",
      "typeClient": {
        "id": 1,
        "libelle": "Particulier"
      }
    },
    "utilisateur": {
      "id": 1,
      "nomUtilisateur": "admin"
    },
    "detailsAchat": [
      {
        "id": 101,
        "poids": 25,
        "montant": 50000,
        "produit": {
          "id": 1,
          "libelle": "Thon",
          "prixKg": 2000
        }
      },
      {
        "id": 102,
        "poids": 15,
        "montant": 22500,
        "produit": {
          "id": 2,
          "libelle": "Sardine",
          "prixKg": 1500
        }
      }
    ]
  }
]
```

**Si aucune vente** : Retourne un tableau vide `[]`

### 🔄 Logique métier

```typescript
// Requête SQL générée (simplifiée)
SELECT * FROM achat_ach
WHERE geler_ach = 0
AND TO_DAYS(date_creation_ach) = TO_DAYS('2024-01-15')
```

**Ce que ça signifie** :

- On cherche toutes les ventes non gelées (`geler = 0`)
- Créées le jour spécifié (peu importe l'heure)
- On charge aussi les relations : client, typeClient, utilisateur, détails, produits

---

## Endpoint 3 : Ventes par semaine

### 📍 URL

```
POST http://localhost:3000/metier/vente/venteParSemaine
```

### 📤 Headers

```
Content-Type: application/json
```

### 📋 Body JSON

```json
{
  "date": "2024-01-15"
}
```

### 🔍 Explication des champs

| Champ  | Type   | Obligatoire | Format       | Description                                                        |
| ------ | ------ | ----------- | ------------ | ------------------------------------------------------------------ |
| `date` | string | ✅          | `YYYY-MM-DD` | Date au format ISO (le backend calcule automatiquement la semaine) |

### ✅ Exemples

**Exemple 1 : Ventes de la semaine contenant le 15 janvier 2024**

```json
{
  "date": "2024-01-15"
}
```

**Exemple 2 : Ventes de la semaine contenant aujourd'hui**

```json
{
  "date": "2024-12-20"
}
```

### 📥 Réponse

Même format que `venteParJour` (tableau d'achats avec toutes les relations)

**Si aucune vente** : Retourne un tableau vide `[]`

### 🔄 Logique métier

```typescript
// Requête SQL générée (simplifiée)
SELECT * FROM achat_ach
WHERE geler_ach = 0
AND WEEK(date_creation_ach, 1) = WEEK('2024-01-15', 1)
AND YEAR(date_creation_ach) = YEAR('2024-01-15')
```

**Ce que ça signifie** :

- Le backend calcule automatiquement le numéro de semaine à partir de la date fournie
- Mode 1 = ISO standard (semaine commence le lundi)
- On cherche toutes les ventes non gelées (`geler = 0`)
- Créées dans la même semaine ISO que la date fournie
- On charge aussi les relations : client, typeClient, utilisateur, détails, produits

**Note importante** : La fonction `WEEK()` de MySQL utilise le mode 1 (ISO standard) :

- Semaine commence le lundi
- La première semaine de l'année est celle qui contient le 4 janvier
- Les semaines sont numérotées de 1 à 53

---

## Endpoint 4 : Ventes par mois

### 📍 URL

```
POST http://localhost:3000/metier/vente/venteParMois
```

### 📤 Headers

```
Content-Type: application/json
```

### 📋 Body JSON

```json
{
  "mois": "1",
  "annee": "2024"
}
```

### 🔍 Explication des champs

| Champ   | Type   | Obligatoire | Format         | Description                       |
| ------- | ------ | ----------- | -------------- | --------------------------------- |
| `mois`  | string | ✅          | `"1"` à `"12"` | Mois (1 = janvier, 12 = décembre) |
| `annee` | string | ✅          | `"2024"`       | Année (4 chiffres)                |

### ✅ Exemples

**Exemple 1 : Ventes de janvier 2024**

```json
{
  "mois": "1",
  "annee": "2024"
}
```

**Exemple 2 : Ventes de décembre 2024**

```json
{
  "mois": "12",
  "annee": "2024"
}
```

**⚠️ Important** : Le mois doit être une **string**, pas un nombre !

### 📥 Réponse

Même format que `venteParJour` (tableau d'achats avec toutes les relations)

### 🔄 Logique métier

```typescript
// Requête SQL générée (simplifiée)
SELECT * FROM achat_ach
WHERE geler_ach = 0
AND MONTH(date_creation_ach) = 1
AND YEAR(date_creation_ach) = 2024
```

---

## Endpoint 5 : Ventes par année

### 📍 URL

```
POST http://localhost:3000/metier/vente/venteParAnnee
```

### 📤 Headers

```
Content-Type: application/json
```

### 📋 Body JSON

```json
{
  "annee": "2024"
}
```

### 🔍 Explication des champs

| Champ   | Type   | Obligatoire | Format   | Description        |
| ------- | ------ | ----------- | -------- | ------------------ |
| `annee` | string | ✅          | `"2024"` | Année (4 chiffres) |

### ✅ Exemples

**Exemple 1 : Ventes de 2024**

```json
{
  "annee": "2024"
}
```

**Exemple 2 : Ventes de 2023**

```json
{
  "annee": "2023"
}
```

### 📥 Réponse

Même format que `venteParJour` (tableau d'achats avec toutes les relations)

### 🔄 Logique métier

```typescript
// Requête SQL générée (simplifiée)
SELECT * FROM achat_ach
WHERE geler_ach = 0
AND YEAR(date_creation_ach) = 2024
```

---

## Erreurs fréquentes

### ❌ Erreur 1 : `produitId` n'existe pas

**Erreur** :

```json
{
  "statusCode": 500,
  "message": "Cannot read property 'prixKg' of null"
}
```

**Cause** : Vous avez envoyé un `produitId` qui n'existe pas en base.

**Solution** :

1. Vérifiez que le produit existe :
   ```sql
   SELECT id_pro, libelle_pro FROM produit_pro WHERE id_pro = 1;
   ```
2. Utilisez un ID valide dans votre body JSON.

---

### ❌ Erreur 2 : `utilisateurId` n'existe pas

**Erreur** :

```json
{
  "statusCode": 500,
  "message": "Cannot read property 'id' of null"
}
```

**Cause** : Vous avez envoyé un `utilisateurId` qui n'existe pas.

**Solution** :

1. Vérifiez que l'utilisateur existe :
   ```sql
   SELECT id_uti, nom_utilisateur_uti FROM utilisateur_uti WHERE id_uti = 1;
   ```
2. Utilisez un ID valide.

---

### ❌ Erreur 3 : `clientTypeClient` n'existe pas

**Erreur** :

```json
{
  "statusCode": 500,
  "message": "Cannot read property 'id' of null"
}
```

**Cause** : Vous avez envoyé un `clientTypeClient` qui n'existe pas.

**Solution** :

1. Vérifiez que le type de client existe :
   ```sql
   SELECT id_tyc, libelle_tyc FROM type_client_tyc WHERE id_tyc = 1;
   ```
2. Utilisez un ID valide.

---

### ❌ Erreur 4 : Format de date incorrect

**Erreur** : Résultat vide `[]` alors qu'il devrait y avoir des ventes.

**Cause** : Format de date incorrect dans `venteParJour`.

**Solution** :

- ✅ Bon format : `"2024-01-15"`
- ❌ Mauvais format : `"15/01/2024"` ou `"2024-1-15"`

---

### ❌ Erreur 5 : `details` est vide

**Erreur** :

```json
{
  "statusCode": 500,
  "message": "Cannot read property 'length' of undefined"
}
```

**Cause** : Vous n'avez pas envoyé le champ `details` ou il est vide.

**Solution** :

- Toujours envoyer `details` avec au moins un élément :
  ```json
  {
    "details": [
      {
        "produitId": 1,
        "poids": 25
      }
    ]
  }
  ```

---

### ❌ Erreur 6 : `poids` est négatif ou zéro

**Erreur** : La vente est créée mais avec un montant de 0.

**Cause** : Vous avez envoyé `poids: 0` ou `poids: -5`.

**Solution** :

- Toujours envoyer un poids positif :
  ```json
  {
    "poids": 25 // ✅ Positif
  }
  ```

---

### ❌ Erreur 7 : `produit.prixKg` est null

**Erreur** : La vente est créée mais avec un montant de 0 pour ce produit.

**Cause** : Le produit existe mais n'a pas de `prix_kg_pro` défini.

**Solution** :

1. Vérifiez le prix du produit :
   ```sql
   SELECT id_pro, libelle_pro, prix_kg_pro FROM produit_pro WHERE id_pro = 1;
   ```
2. Si `prix_kg_pro` est `NULL`, mettez-le à jour :
   ```sql
   UPDATE produit_pro SET prix_kg_pro = 2000 WHERE id_pro = 1;
   ```

---

## Comment ça fonctionne techniquement

### 🏗️ Architecture NestJS

```
Requête HTTP (Postman)
    ↓
Controller (vente.controller.ts)
    ↓
Service (vente.service.ts)
    ↓
EntityManager (TypeORM)
    ↓
Base de données MySQL
```

### 📝 Détail du flux pour `creerVente`

#### 1. Controller reçoit la requête

```typescript
@Post('creerVente')
async creerVente(@Body() venteData: any) {
  // venteData contient le JSON que vous avez envoyé
  return await this.venteMetierService.creerVente(venteData);
}
```

**Ce qui se passe** :

- NestJS parse automatiquement le JSON du body
- Le `@Body()` decorator extrait les données
- Les données sont passées au service

#### 2. Service exécute la transaction

```typescript
async creerVente(venteData: any) {
  return await this.entityManager.transaction(async (entityManager) => {
    // Toute la logique ici
  });
}
```

**Pourquoi une transaction ?**

- Si une erreur survient, **tout est annulé** (rollback)
- Garantit la cohérence : soit tout est créé, soit rien

**Exemple** :

- Si la création de l'achat réussit mais qu'une erreur survient lors de la création des détails
- → L'achat est automatiquement supprimé (rollback)

#### 3. EntityManager fait les requêtes SQL

```typescript
// Chercher un client
let client = await entityManager.findOne(ClientEntity, {
  where: { numero: venteData.clientNumero },
});
```

**Requête SQL générée** :

```sql
SELECT * FROM client_cli
WHERE numero_client_cli = '+221771234567'
LIMIT 1;
```

#### 4. Création des entités

```typescript
// Créer un achat
const achat = entityManager.create(AchatEntity, {
  client: client,
  utilisateur: utilisateur,
  montantTotal: montantTotal,
  // ...
});

// Sauvegarder en base
const achatSauvegarde = await entityManager.save(AchatEntity, achat);
```

**Requête SQL générée** :

```sql
INSERT INTO achat_ach
  (montant_total_ach, client_idclient, utilisateur_idutilisateur, date_creation_ach, geler_ach, idusrcreation_ach)
VALUES
  (72500, 15, 1, '2024-01-15 10:30:00', 0, 1);
```

### 🔗 Relations entre tables

```
ACHAT (1)
  ├── CLIENT (N) → Un achat a UN client
  ├── UTILISATEUR (N) → Un achat a UN utilisateur
  └── DETAIL_ACHAT (N) → Un achat a PLUSIEURS détails

DETAIL_ACHAT (1)
  ├── ACHAT (N) → Un détail appartient à UN achat
  └── PRODUIT (N) → Un détail concerne UN produit

CLIENT (1)
  └── TYPE_CLIENT (N) → Un client a UN type
```

**Légende** :

- `(1)` = Un seul
- `(N)` = Plusieurs

### 🎯 Pourquoi on charge les objets complets ?

```typescript
// ❌ On ne peut pas faire ça
const achat = entityManager.create(AchatEntity, {
  client: 15, // ❌ Erreur : TypeORM attend un objet ClientEntity
});

// ✅ On doit faire ça
const client = await entityManager.findOne(ClientEntity, {
  where: { id: 15 },
});

const achat = entityManager.create(AchatEntity, {
  client: client, // ✅ Objet complet
});
```

**Raison** :

- TypeORM utilise les **relations** (foreign keys)
- Il a besoin de l'objet complet pour gérer les relations
- C'est pour ça qu'on charge d'abord le client, l'utilisateur, le produit

---

## 📚 Checklist avant de tester

Avant de tester avec Postman, vérifiez que vous avez :

- [ ] **Au moins 1 utilisateur** en base

  ```sql
  SELECT id_uti FROM utilisateur_uti LIMIT 1;
  ```

- [ ] **Au moins 1 type de client** en base

  ```sql
  SELECT id_tyc FROM type_client_tyc LIMIT 1;
  ```

- [ ] **Au moins 1 produit** avec un prix défini

  ```sql
  SELECT id_pro, libelle_pro, prix_kg_pro FROM produit_pro WHERE prix_kg_pro IS NOT NULL LIMIT 1;
  ```

- [ ] **Le serveur NestJS est démarré**

  ```bash
  npm run start:dev
  ```

- [ ] **Postman est configuré**
  - Méthode : `POST`
  - URL : `http://localhost:3000/metier/vente/creerVente`
  - Headers : `Content-Type: application/json`
  - Body : `raw` → `JSON`

---

## 🎓 Résumé pour débutant

### Ce que vous devez comprendre

1. **Une vente = 1 achat + plusieurs détails**

   - L'achat = la vente globale
   - Les détails = les pesées individuelles

2. **Vous n'envoyez PAS le prix**

   - Le prix est récupéré automatiquement depuis la table `produit_pro`
   - Le calcul est fait automatiquement : `poids × prix_kg`

3. **Les IDs doivent exister en base**

- `utilisateurId` → doit exister dans `utilisateur_uti`
- `clientId` (si `isGrosClient = true`) → doit exister dans `client_cli`
- `produitId` → doit exister dans `produit_pro`

4. **Le client est créé automatiquement**

   - Si le numéro n'existe pas → nouveau client créé
   - Si le numéro existe → client existant utilisé

5. **Tout se passe dans une transaction**
   - Si une erreur survient → tout est annulé
   - Garantit la cohérence des données

### Structure JSON à retenir

```json
{
  "isGrosClient": "boolean (true = Gros Client, false = Client Normal)",
  "clientNom": "string (si Client Normal)",
  "clientNumero": "string (si Client Normal)",
  "clientId": "number (si Gros Client)",
  "utilisateurId": number,
  "montantPaye": "number (optionnel, défaut: 0)",
  "modalitePaiementId": "number (optionnel, défaut: 1 = Espèces)",
  "details": [
    {
      "produitId": number,
      "poids": number
    }
  ]
}
```

---

## 🚀 Prochaines étapes

1. **Testez avec Postman** en suivant les exemples
2. **Vérifiez les données en base** avec des requêtes SQL
3. **Comprenez les erreurs** et comment les corriger
4. **Explorez les autres endpoints** (venteParJour, venteParMois, venteParAnnee)

---

**Bon courage ! 🎉**
