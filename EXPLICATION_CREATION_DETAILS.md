# 📖 EXPLICATION : Création des Détails de Vente

## 🎯 Vue d'Ensemble

Quand tu vends du poisson, tu peux vendre **plusieurs produits** en même temps :

- 5 kg de Thon rouge
- 3 kg de Thon blanc
- 2 kg de Saumon

Chaque produit = **1 détail**.

La boucle `for` crée **un détail pour chaque produit**.

---

## 📊 Données d'Entrée (Frontend)

Le Frontend envoie ça :

```json
{
  "clientNom": "Jean Dupont",
  "clientNumero": "0612345678",
  "clientTypeClient": 1,
  "utilisateurId": 1,
  "supportId": 1,
  "details": [
    {
      "produitId": 1,
      "poids": 5.25,
      "prixKg": 30.0
    },
    {
      "produitId": 2,
      "poids": 3.0,
      "prixKg": 25.0
    }
  ]
}
```

**`details`** = Tableau avec 2 éléments (2 produits)

---

## 🔄 La Boucle `for`

```typescript
for (const detailData of venteData.details) {
  // Ce code s'exécute 2 fois
  // 1ère fois : detailData = { produitId: 1, poids: 5.250, prixKg: 30.00 }
  // 2ème fois : detailData = { produitId: 2, poids: 3.000, prixKg: 25.00 }
}
```

**Explication** :

- `venteData.details` = le tableau `[{...}, {...}]`
- `for (const detailData of ...)` = Pour chaque élément du tableau
- `detailData` = 1 élément à la fois

---

## 📝 Étape par Étape (1ère Itération)

### Données de Départ

```javascript
detailData = {
  produitId: 1,
  poids: 5.25,
  prixKg: 30.0,
};
```

---

### ÉTAPE 1 : Charger le Produit

```typescript
const produit = await entityManager.findOne(ProduitEntity, {
  where: { id: detailData.produitId },
});
```

**Ce qui se passe** :

1. On cherche le produit avec `id = 1` dans la base
2. On récupère toutes ses infos

**Résultat** :

```javascript
produit = {
  id: 1,
  libelle: 'Thon rouge',
  geler: 0,
  dateCreation: '2025-11-01',
  // ...
};
```

---

### ÉTAPE 2 : Calculer le Montant

```typescript
const montant = Math.round(detailData.poids * detailData.prixKg * 100) / 100;
```

**Calcul** :

```
detailData.poids = 5.250
detailData.prixKg = 30.00

Calcul : 5.250 × 30.00 = 157.50
Arrondi : Math.round(157.50 * 100) / 100 = 157.50
```

**Résultat** :

```javascript
montant = 157.5;
```

---

### ÉTAPE 3 : Créer le Détail (en mémoire)

```typescript
const detail = entityManager.create(DetailAchatEntity, {
  achat: achatSauvegarde,
  produit: produit,
  poids: detailData.poids,
  prixKg: detailData.prixKg,
  montant: montant,
  date: now,
  heure: now,
});
```

**Ce qui se passe** :

1. On crée un objet `DetailAchatEntity`
2. On lui donne toutes les infos
3. **PAS ENCORE EN BASE** (juste en mémoire)

**Résultat** :

```javascript
detail = {
  achat: { id: 1, ... },        // L'achat créé juste avant
  produit: { id: 1, ... },      // Le produit qu'on a chargé
  poids: 5.250,                 // Du detailData
  prixKg: 30.00,                // Du detailData
  montant: 157.50,              // Calculé
  date: 2025-11-30,             // Date du jour
  heure: "14:30:25"             // Heure actuelle
}
```

---

### ÉTAPE 4 : Sauvegarder en Base

```typescript
const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);
```

**Ce qui se passe** :

1. On envoie l'objet `detail` à la base de données
2. La base génère un ID
3. On récupère l'objet avec son ID

**Résultat** :

```javascript
detailSauvegarde = {
  id: 1,                         // ← ID généré par la base !
  achat: { id: 1, ... },
  produit: { id: 1, ... },
  poids: 5.250,
  prixKg: 30.00,
  montant: 157.50,
  date: 2025-11-30,
  heure: "14:30:25"
}
```

**En base** :

```sql
INSERT INTO detail_achat_dac (
  achat_idachat,
  produit_idproduit,
  poids_dac,
  prix_kg_dac,
  montant_dac,
  date_dac,
  heure_dac
) VALUES (
  1,
  1,
  5.250,
  30.00,
  157.50,
  '2025-11-30',
  '14:30:25'
);
```

---

### ÉTAPE 5 : Ajouter au Tableau de Retour

```typescript
detailsCrees.push({
  produit: produit.libelle,
  poids: detailSauvegarde.poids,
  prixKg: detailSauvegarde.prixKg,
  montant: detailSauvegarde.montant,
});
```

**Ce qui se passe** :

1. On crée un petit objet simplifié
2. On l'ajoute au tableau `detailsCrees`
3. Ce tableau sera retourné au Frontend

**Résultat** :

```javascript
detailsCrees = [
  {
    produit: 'Thon rouge',
    poids: 5.25,
    prixKg: 30.0,
    montant: 157.5,
  },
];
```

---

## 🔁 2ème Itération (Même Chose)

### Données de Départ

```javascript
detailData = {
  produitId: 2,
  poids: 3.0,
  prixKg: 25.0,
};
```

### ÉTAPE 1 : Charger le Produit

```javascript
produit = {
  id: 2,
  libelle: 'Thon blanc',
  // ...
};
```

### ÉTAPE 2 : Calculer

```
3.000 × 25.00 = 75.00
```

### ÉTAPE 3 : Créer

```javascript
detail = {
  achat: { id: 1, ... },
  produit: { id: 2, ... },
  poids: 3.000,
  prixKg: 25.00,
  montant: 75.00,
  date: 2025-11-30,
  heure: "14:30:25"
}
```

### ÉTAPE 4 : Sauvegarder

```javascript
detailSauvegarde = {
  id: 2, // ← Nouveau ID
  // ...
};
```

**En base** :

```sql
INSERT INTO detail_achat_dac (...) VALUES (1, 2, 3.000, 25.00, 75.00, ...);
```

### ÉTAPE 5 : Ajouter au Tableau

```javascript
detailsCrees = [
  {
    produit: 'Thon rouge',
    poids: 5.25,
    prixKg: 30.0,
    montant: 157.5,
  },
  {
    produit: 'Thon blanc', // ← Ajouté
    poids: 3.0,
    prixKg: 25.0,
    montant: 75.0,
  },
];
```

---

## 🎯 Résultat Final

### Dans la Base de Données

**Table `achat_ach`** :

```
| id | client_id | montant_total | date       |
|----|-----------|---------------|------------|
| 1  | 1         | 232.50        | 2025-11-30 |
```

**Table `detail_achat_dac`** :

```
| id | achat_id | produit_id | poids | prix_kg | montant |
|----|----------|------------|-------|---------|---------|
| 1  | 1        | 1          | 5.250 | 30.00   | 157.50  |
| 2  | 1        | 2          | 3.000 | 25.00   | 75.00   |
```

### Retourné au Frontend

```json
{
  "success": true,
  "message": "Vente créée avec succès",
  "data": {
    "venteId": 1,
    "client": {
      "id": 1,
      "nom": "Jean Dupont",
      "numero": "0612345678"
    },
    "montantTotal": 232.5,
    "nombreArticles": 2,
    "details": [
      {
        "produit": "Thon rouge",
        "poids": 5.25,
        "prixKg": 30.0,
        "montant": 157.5
      },
      {
        "produit": "Thon blanc",
        "poids": 3.0,
        "prixKg": 25.0,
        "montant": 75.0
      }
    ]
  }
}
```

---

## 📊 Schéma Complet

```
ENTRÉE (Frontend)
┌────────────────────────────────┐
│ details: [                     │
│   { produitId: 1,              │
│     poids: 5.250,              │
│     prixKg: 30.00 },           │
│   { produitId: 2,              │
│     poids: 3.000,              │
│     prixKg: 25.00 }            │
│ ]                              │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ BOUCLE FOR                     │
│ (2 itérations)                 │
└────────────┬───────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ TOUR 1  │      │ TOUR 2  │
└────┬────┘      └────┬────┘
     │                │
     ▼                ▼
1. Charger       1. Charger
   produit 1        produit 2
     │                │
     ▼                ▼
2. Calculer      2. Calculer
   157.50           75.00
     │                │
     ▼                ▼
3. Créer         3. Créer
   detail           detail
     │                │
     ▼                ▼
4. Sauvegarder   4. Sauvegarder
   (id=1)           (id=2)
     │                │
     ▼                ▼
5. Ajouter       5. Ajouter
   au tableau       au tableau
     │                │
     └────────┬───────┘
              │
              ▼
┌────────────────────────────────┐
│ detailsCrees = [               │
│   { produit: "Thon rouge",     │
│     montant: 157.50 },         │
│   { produit: "Thon blanc",     │
│     montant: 75.00 }           │
│ ]                              │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│ SORTIE (Response)              │
│ { success: true,               │
│   details: [...] }             │
└────────────────────────────────┘
```

---

## 💡 Points Clés à Retenir

### 1. La Boucle Traite Chaque Produit

```typescript
for (const detailData of venteData.details) {
  // S'exécute autant de fois qu'il y a de produits
}
```

Si 3 produits → 3 tours de boucle

### 2. Chaque Tour Crée 1 Ligne en Base

```
Tour 1 → INSERT detail_achat (id=1)
Tour 2 → INSERT detail_achat (id=2)
Tour 3 → INSERT detail_achat (id=3)
```

### 3. Calcul du Montant

```
montant = poids × prix_kg
```

Simple multiplication !

### 4. Relations

Chaque détail est lié à :

- **L'achat** (créé juste avant la boucle)
- **Le produit** (chargé depuis la base)

---

## 🔍 Code Annoté Ligne par Ligne

```typescript
// Tableau vide pour stocker les détails créés
const detailsCrees = [];

// Pour chaque produit dans le tableau details
for (const detailData of venteData.details) {
  // detailData = { produitId: 1, poids: 5.250, prixKg: 30.00 }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ÉTAPE 1 : Charger le produit depuis la base
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const produit = await entityManager.findOne(ProduitEntity, {
    where: { id: detailData.produitId },
    // WHERE id = 1
  });
  // Résultat : produit = { id: 1, libelle: "Thon rouge", ... }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ÉTAPE 2 : Calculer le montant
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const montant = Math.round(detailData.poids * detailData.prixKg * 100) / 100;
  // 5.250 × 30.00 = 157.50
  // Math.round(157.50 * 100) / 100 = 157.50
  // Résultat : montant = 157.50

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ÉTAPE 3 : Créer l'objet détail (en mémoire)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const detail = entityManager.create(DetailAchatEntity, {
    achat: achatSauvegarde, // Achat créé avant la boucle
    produit: produit, // Produit chargé à l'étape 1
    poids: detailData.poids, // 5.250
    prixKg: detailData.prixKg, // 30.00
    montant: montant, // 157.50 (calculé à l'étape 2)
    date: now, // Date du jour
    heure: now, // Heure actuelle
  });
  // Résultat : detail = { achat: {...}, produit: {...}, poids: 5.250, ... }
  // ATTENTION : PAS ENCORE EN BASE !

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ÉTAPE 4 : Sauvegarder en base de données
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const detailSauvegarde = await entityManager.save(DetailAchatEntity, detail);
  // INSERT INTO detail_achat_dac (...) VALUES (...)
  // Résultat : detailSauvegarde = { id: 1, ... }
  // MAINTENANT EN BASE avec ID généré !

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ÉTAPE 5 : Ajouter au tableau de retour
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  detailsCrees.push({
    produit: produit.libelle, // "Thon rouge"
    poids: detailSauvegarde.poids, // 5.250
    prixKg: detailSauvegarde.prixKg, // 30.00
    montant: detailSauvegarde.montant, // 157.50
  });
  // detailsCrees = [{ produit: "Thon rouge", poids: 5.250, ... }]

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FIN DU TOUR 1 → RETOUR AU DÉBUT DE LA BOUCLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
}

// Après la boucle :
// detailsCrees = [
//   { produit: "Thon rouge", montant: 157.50 },
//   { produit: "Thon blanc", montant: 75.00 }
// ]
```

---

## 🎯 Résumé Ultra Simple

**La boucle fait 5 choses pour CHAQUE produit** :

1. **Charger** le produit (SELECT)
2. **Calculer** le montant (poids × prix)
3. **Créer** l'objet détail (en mémoire)
4. **Sauvegarder** en base (INSERT)
5. **Ajouter** au tableau de retour

**Répété autant de fois qu'il y a de produits !**

---

## ❓ Questions Fréquentes

### Q1 : Pourquoi une boucle ?

**R** : Parce qu'on peut vendre plusieurs produits en même temps. Chaque produit = 1 détail à créer.

### Q2 : C'est quoi `detailData` ?

**R** : C'est 1 élément du tableau `venteData.details`. Contient : `produitId`, `poids`, `prixKg`.

### Q3 : Pourquoi charger le produit ?

**R** : Pour avoir son libellé et vérifier qu'il existe. On crée une relation avec le produit.

### Q4 : C'est quoi la différence entre `detail` et `detailSauvegarde` ?

**R** :

- `detail` = Objet en mémoire (pas d'ID)
- `detailSauvegarde` = Objet en base (avec ID généré)

### Q5 : Pourquoi `detailsCrees.push()` ?

**R** : Pour créer un tableau qu'on retourne au Frontend avec les infos simplifiées.

---

## 🎉 Maintenant C'est Clair ?

La création des détails c'est juste :

1. **Boucle** sur tous les produits
2. Pour chaque produit : charger, calculer, créer, sauvegarder
3. **Résultat** : Autant de lignes en base que de produits

**Simple !** 😊
