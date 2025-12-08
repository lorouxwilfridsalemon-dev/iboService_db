# 📘 Guide Complet : Tester l'API Vente avec Postman

**Documentation pour développeur junior**  
*Comment tester tous les endpoints du module "métier vente"*

---

## 📋 Table des matières

1. [Comprendre la logique métier](#1-comprendre-la-logique-métier)
2. [Structure des tables](#2-structure-des-tables)
3. [Endpoint 1 : Créer une vente](#endpoint-1-créer-une-vente)
4. [Endpoint 2 : Ventes par jour](#endpoint-2-ventes-par-jour)
5. [Endpoint 3 : Ventes par mois](#endpoint-3-ventes-par-mois)
6. [Endpoint 4 : Ventes par année](#endpoint-4-ventes-par-année)
7. [Erreurs fréquentes](#erreurs-fréquentes)
8. [Comment ça fonctionne techniquement](#comment-ça-fonctionne-techniquement)

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
1. Client arrive → On cherche s'il existe déjà (par numéro)
   ├─ Si nouveau → On le crée dans la base
   └─ Si existant → On utilise celui qui existe

2. Pour chaque produit acheté :
   ├─ On charge le produit depuis la base
   ├─ On récupère son prix_kg
   ├─ On calcule : montant = poids × prix_kg
   └─ On crée un "détail" (une pesée)

3. On additionne tous les montants → montant total

4. On crée l'achat (la vente globale)

5. On crée tous les détails (les pesées)
```

---

## 2. Structure des tables

### 📦 Table `achat_ach` (La vente globale)

**Une ligne = Une vente complète**

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_ach` | integer | ✅ | ID unique (auto-généré) |
| `montant_total_ach` | integer | ✅ | Montant total de la vente |
| `client_idclient` | integer | ✅ | ID du client (foreign key) |
| `utilisateur_idutilisateur` | integer | ✅ | ID de l'utilisateur qui a fait la vente |
| `date_creation_ach` | timestamp | ✅ | Date/heure de création (auto) |
| `geler_ach` | integer | ✅ | 0 = actif, 1 = gelé |

### 📝 Table `detail_achat_dac` (Les pesées)

**Une ligne = Une pesée (un produit)**

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_dac` | integer | ✅ | ID unique (auto-généré) |
| `poids_dac` | integer | ✅ | Poids en kg |
| `montant_dac` | integer | ✅ | Montant = poids × prix_kg |
| `commande_idcommande` | integer | ✅ | ID de l'achat (foreign key) |
| `poisson_idpoisson` | integer | ✅ | ID du produit (foreign key) |
| `date_creation_dac` | timestamp | ✅ | Date/heure (auto) |

### 👤 Table `client_cli` (Les clients)

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_cli` | integer | ✅ | ID unique (auto-généré) |
| `nom_prenom_client_cli` | varchar(50) | ✅ | Nom et prénom |
| `numero_client_cli` | varchar(15) | ❌ | Numéro de téléphone |
| `type_client_idtype_client` | integer | ✅ | ID du type de client (foreign key) |

### 🐟 Table `produit_pro` (Les produits/poissons)

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_pro` | integer | ✅ | ID unique (auto-généré) |
| `libelle_pro` | varchar(50) | ✅ | Nom du produit (ex: "Thon") |
| `prix_kg_pro` | integer | ❌ | Prix au kilogramme |

### 👨‍💼 Table `utilisateur_uti` (Les utilisateurs)

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_uti` | integer | ✅ | ID unique (auto-généré) |
| `nom_utilisateur_uti` | varchar(50) | ✅ | Nom d'utilisateur |

### 🏷️ Table `type_client_tyc` (Types de clients)

| Colonne | Type | Obligatoire | Description |
|--------|------|------------|-------------|
| `id_tyc` | integer | ✅ | ID unique (auto-généré) |
| `libelle_tyc` | varchar(50) | ✅ | Libellé (ex: "Particulier", "Restaurant") |

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
  "clientNom": "Amadou Diallo",
  "clientNumero": "+221771234567",
  "clientTypeClient": 1,
  "utilisateurId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 25
    },
    {
      "produitId": 2,
      "poids": 15
    }
  ]
}
```

### 🔍 Explication des champs

#### Champs obligatoires au niveau racine

| Champ | Type | Obligatoire | Description | Exemple |
|-------|------|------------|--------------|---------|
| `clientNom` | string | ✅ | Nom et prénom du client | `"Amadou Diallo"` |
| `clientNumero` | string | ✅ | Numéro de téléphone (unique) | `"+221771234567"` |
| `clientTypeClient` | number | ✅ | ID du type de client | `1` |
| `utilisateurId` | number | ✅ | ID de l'utilisateur qui fait la vente | `1` |
| `details` | array | ✅ | Liste des produits achetés | `[{...}, {...}]` |

#### Champs dans `details` (array)

| Champ | Type | Obligatoire | Description | Exemple |
|-------|------|------------|-------------|---------|
| `produitId` | number | ✅ | ID du produit (doit exister en base) | `1` |
| `poids` | number | ✅ | Poids en kg (entier) | `25` |

### ✅ Exemple complet - Vente simple (1 produit)

```json
{
  "clientNom": "Fatou Sarr",
  "clientNumero": "+221771111111",
  "clientTypeClient": 1,
  "utilisateurId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 30
    }
  ]
}
```

### ✅ Exemple complet - Vente multiple (3 produits)

```json
{
  "clientNom": "Ibrahima Ba",
  "clientNumero": "+221772222222",
  "clientTypeClient": 2,
  "utilisateurId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 25
    },
    {
      "produitId": 2,
      "poids": 15
    },
    {
      "produitId": 3,
      "poids": 10
    }
  ]
}
```

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

2. **Au moins 1 type de client** :
   ```sql
   SELECT id_tyc, libelle_tyc FROM type_client_tyc;
   ```
   → Utilisez un `id_tyc` existant pour `clientTypeClient`

3. **Au moins 1 produit** :
   ```sql
   SELECT id_pro, libelle_pro, prix_kg_pro FROM produit_pro;
   ```
   → Utilisez un `id_pro` existant pour `produitId` dans `details`

### 🔄 Logique métier détaillée

#### ÉTAPE 1 : Gestion du client

```typescript
// Le service cherche si le client existe déjà (par numéro)
let client = await entityManager.findOne(ClientEntity, {
  where: { numero: venteData.clientNumero }
});

// Si pas trouvé → création automatique
if (!client) {
  // Création du nouveau client
  client = entityManager.create(ClientEntity, {
    nomPrenom: venteData.clientNom,
    numero: venteData.clientNumero,
    typeClient: typeClient,  // Chargé depuis la base
    // ...
  });
}
```

**Ce que ça signifie pour vous** :
- Si vous envoyez un numéro qui existe déjà → Le client existant est utilisé
- Si vous envoyez un nouveau numéro → Un nouveau client est créé automatiquement

#### ÉTAPE 2 : Calcul du montant total

```typescript
let montantTotal = 0;
for (const element of venteData.details) {
  // Charger le produit pour obtenir son prixKg
  const produit = await entityManager.findOne(ProduitEntity, {
    where: { id: element.produitId }
  });
  
  // Calculer : montant = poids × prixKg
  const prixKg = produit.prixKg || 0;
  montantTotal += element.poids * prixKg;
}
```

**Ce que ça signifie pour vous** :
- **Vous n'envoyez PAS le prix** dans le body
- Le prix est récupéré automatiquement depuis la table `produit_pro`
- Le calcul est fait automatiquement : `poids × prix_kg_pro`

#### ÉTAPE 3 : Création de l'achat (vente globale)

```typescript
const achat = entityManager.create(AchatEntity, {
  client: client,
  utilisateur: utilisateur,
  montantTotal: montantTotal,  // Calculé automatiquement
  geler: 0,
  dateCreation: new Date(),
  // ...
});
```

#### ÉTAPE 4 : Création des détails (pesées)

```typescript
for (const element of venteData.details) {
  const produit = await entityManager.findOne(ProduitEntity, {
    where: { id: element.produitId }
  });
  
  const prixKg = produit.prixKg || 0;
  const montant = element.poids * prixKg;  // Calcul automatique
  
  const detail = entityManager.create(DetailAchatEntity, {
    achat: achatSauvegarde,
    produit: produit,
    poids: element.poids,
    montant: montant,  // Calculé automatiquement
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

| Champ | Type | Obligatoire | Format | Description |
|-------|------|------------|--------|-------------|
| `dateJour` | string | ✅ | `YYYY-MM-DD` | Date au format ISO | 

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

## Endpoint 3 : Ventes par mois

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

| Champ | Type | Obligatoire | Format | Description |
|-------|------|------------|--------|-------------|
| `mois` | string | ✅ | `"1"` à `"12"` | Mois (1 = janvier, 12 = décembre) |
| `annee` | string | ✅ | `"2024"` | Année (4 chiffres) |

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

## Endpoint 4 : Ventes par année

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

| Champ | Type | Obligatoire | Format | Description |
|-------|------|------------|--------|-------------|
| `annee` | string | ✅ | `"2024"` | Année (4 chiffres) |

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
    "poids": 25  // ✅ Positif
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
  where: { numero: venteData.clientNumero }
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
  client: 15,  // ❌ Erreur : TypeORM attend un objet ClientEntity
});

// ✅ On doit faire ça
const client = await entityManager.findOne(ClientEntity, {
  where: { id: 15 }
});

const achat = entityManager.create(AchatEntity, {
  client: client,  // ✅ Objet complet
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
   - `clientTypeClient` → doit exister dans `type_client_tyc`
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
  "clientNom": "string",
  "clientNumero": "string",
  "clientTypeClient": number,
  "utilisateurId": number,
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

