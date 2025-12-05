# 📊 Documentation du Module État (Statistiques de Ventes)

## 🎯 Objectif du Module

Le module **État** permet de récupérer des statistiques de ventes organisées par période :

- **Par jour** : Toutes les ventes d'une journée spécifique
- **Par semaine** : Toutes les ventes d'une semaine (du lundi au dimanche)
- **Par mois** : Toutes les ventes d'un mois spécifique
- **Par année** : Toutes les ventes d'une année complète

---

## 📁 Structure du Module

```
src/metier/etat/
├── etat.service.ts      → Logique métier (calculs, requêtes)
├── etat.controller.ts   → Endpoints API (routes HTTP)
├── etat.module.ts       → Configuration du module NestJS
└── index.ts             → Exports pour faciliter les imports
```

---

## 🔍 Explication des Concepts

### 1. **Service (`etat.service.ts`)**

Le service contient la **logique métier** : il récupère les données de la base de données et les organise.

**Rôle** :

- Faire des requêtes SQL pour récupérer les ventes
- Grouper les données par période (jour, semaine, mois, année)
- Calculer les totaux (poids total, montant total, nombre de pesées)

**Méthodes principales** :

- `getEtatJour(date)` : Statistiques pour un jour
- `getEtatSemaine(date)` : Statistiques pour une semaine
- `getEtatMois(mois, annee)` : Statistiques pour un mois
- `getEtatAnnee(annee)` : Statistiques pour une année

---

### 2. **Controller (`etat.controller.ts`)**

Le controller expose les **endpoints API** : ce sont les routes HTTP que le frontend peut appeler.

**Rôle** :

- Recevoir les requêtes HTTP du frontend
- Appeler le service pour récupérer les données
- Retourner les résultats au frontend

**Endpoints** :

- `GET /metier/etat/jour?date=2025-11-01`
- `GET /metier/etat/semaine?date=2025-11-01`
- `GET /metier/etat/mois?mois=11&annee=2025`
- `GET /metier/etat/annee?annee=2025`

---

### 3. **Module (`etat.module.ts`)**

Le module **enregistre** le service et le controller dans NestJS.

**Rôle** :

- Dire à NestJS quels services et controllers utiliser
- Importer les entités TypeORM nécessaires
- Permettre l'injection de dépendances

---

## 📊 Comment ça Fonctionne ?

### Exemple : Récupérer les ventes d'un jour

```
1. Frontend envoie une requête HTTP
   GET /metier/etat/jour?date=2025-11-01

2. Le Controller reçoit la requête
   → Appelle etatMetierService.getEtatJour("2025-11-01")

3. Le Service fait une requête SQL
   → SELECT * FROM detail_achat_dac WHERE date = '2025-11-01'

4. Le Service groupe les données
   → Regroupe par achat (chaque achat = une ligne dans le tableau)

5. Le Service calcule les totaux
   → Somme des poids, somme des montants, nombre de pesées

6. Le Service retourne les résultats
   → JSON avec liste des ventes + totaux

7. Le Controller renvoie la réponse au frontend
```

---

## 🔧 Détails Techniques

### 1. **EntityManager et QueryBuilder**

Le service utilise `EntityManager` avec `QueryBuilder` pour faire des requêtes SQL complexes.

**Pourquoi QueryBuilder ?**

- Permet de construire des requêtes SQL de manière programmatique
- Plus flexible que `find()` pour les requêtes personnalisées
- Permet de faire des jointures (JOIN) entre tables
- Permet de filtrer par plages de dates avec `>=` et `<=`
- Contrôle total sur la requête SQL générée

**Exemple** :

```typescript
const details = await this.entityManager
  .createQueryBuilder(DetailAchatEntity, 'detail')
  .where('detail.date >= :dateDebut AND detail.date <= :dateFin', {
    dateDebut: dateDebut,
    dateFin: dateFin,
  })
  .leftJoinAndSelect('detail.achat', 'achat')
  .leftJoinAndSelect('detail.produit', 'produit')
  .getMany();
```

**Explication ligne par ligne** :

- `createQueryBuilder(DetailAchatEntity, 'detail')` :
  - Crée une requête SQL sur la table `detail_achat_dac`
  - `'detail'` est l'alias utilisé dans la requête SQL (comme `SELECT * FROM detail_achat_dac detail`)
- `.where('detail.date >= :dateDebut AND detail.date <= :dateFin', {...})` :
  - Ajoute une condition WHERE pour filtrer par plage de dates
  - `:dateDebut` et `:dateFin` sont des paramètres (évite les injections SQL)
  - Les valeurs sont passées dans l'objet `{ dateDebut: ..., dateFin: ... }`
  - `>=` signifie "supérieur ou égal à"
  - `<=` signifie "inférieur ou égal à"
- `.leftJoinAndSelect('detail.achat', 'achat')` :
  - Fait un LEFT JOIN avec la table `achat_ach`
  - `'detail.achat'` : la relation définie dans l'entité `DetailAchatEntity`
  - `'achat'` : l'alias pour la table jointe
  - Charge automatiquement les infos de l'achat dans `detail.achat`
- `.leftJoinAndSelect('detail.produit', 'produit')` :
  - Fait un LEFT JOIN avec la table `produit_pro`
  - Charge automatiquement les infos du produit dans `detail.produit`
- `.getMany()` :
  - Exécute la requête SQL
  - Retourne un tableau de résultats (tous les détails qui matchent)

**Équivalent SQL** :

```sql
SELECT detail.*, achat.*, produit.*
FROM detail_achat_dac detail
LEFT JOIN achat_ach achat ON detail.commande_idcommande = achat.id_ach
LEFT JOIN produit_pro produit ON detail.poisson_idpoisson = produit.id_pro
WHERE detail.date >= '2025-11-01 00:00:00'
  AND detail.date <= '2025-11-01 23:59:59'
```

---

### 2. **Objets JavaScript `{}` (Structure de Données)**

Le service utilise des objets JavaScript simples `{}` pour grouper les données.

**Qu'est-ce qu'un objet JavaScript ?**

- C'est une structure de données qui stocke des paires clé-valeur
- Permet de regrouper des données par clé (ex: par date, par mois)
- Plus simple et plus lisible que `Map` pour les débutants

**Exemple** :

```typescript
const resultats = {}; // Objet vide

// Ajouter une entrée
resultats['01/11/2025'] = {
  date: '01/11/2025',
  totalPoids: 120.4,
  montant: 9920
};

// Ou avec la notation point
resultats['achat_5'] = {
  date: '01/11/2025',
  totalPoids: 120.4,
  montant: 9920
};

// Vérifier si une clé existe
if (!resultats['01/11/2025']) {
  // Créer une nouvelle entrée
  resultats['01/11/2025'] = { ... };
}

// Récupérer une entrée
const jour = resultats['01/11/2025'];

// Convertir en tableau
const liste = [];
for (const cle in resultats) {
  liste.push(resultats[cle]);
}
```

**Pourquoi utiliser des objets `{}` ?**

- Plus simple à comprendre que `Map`
- Syntaxe familière pour les débutants
- Permet de regrouper facilement les données
- Évite les doublons (une clé = une valeur)

---

### 3. **Boucles `for` (Calcul des Totaux)**

Le service utilise des boucles `for` simples pour calculer les totaux.

**Pourquoi des boucles `for` ?**

- Plus simples à comprendre que `reduce()`
- Plus faciles à déboguer
- Syntaxe familière pour les débutants

**Exemple** :

```typescript
let totalPoids = 0;
let totalVentes = 0;

for (const item of liste) {
  totalPoids += item.totalPoids;
  totalVentes += item.montant;
}
```

**Explication ligne par ligne** :

- `let totalPoids = 0;` : Initialise la variable à 0
- `for (const item of liste)` : Parcourt chaque élément du tableau `liste`
  - `item` : L'élément actuel du tableau
- `totalPoids += item.totalPoids;` : Ajoute le poids de l'item à la somme
  - Équivalent à `totalPoids = totalPoids + item.totalPoids`
- `totalVentes += item.montant;` : Ajoute le montant de l'item à la somme

**Alternative avec `reduce()`** (plus avancé) :

```typescript
const totalPoids = liste.reduce((sum, item) => sum + item.totalPoids, 0);
```

---

## 📡 Endpoints API

### 1. **GET /metier/etat/jour**

Récupère les statistiques pour un jour spécifique.

**Paramètres** :

- `date` (query) : Date au format `YYYY-MM-DD` (ex: `2025-11-01`)

**Exemple de requête** :

```
GET /metier/etat/jour?date=2025-11-01
```

**Réponse** :

```json
{
  "success": true,
  "data": {
    "periode": "2025-11-01",
    "liste": [
      {
        "date": "01/11/2025",
        "totalPoids": 120.4,
        "prixKg": 800,
        "nombrePesees": 6,
        "montant": 9920
      },
      {
        "date": "01/11/2025",
        "totalPoids": 7.9,
        "prixKg": 800,
        "nombrePesees": 1,
        "montant": 6320
      }
    ],
    "totalPoids": 128.3,
    "totalVentes": 16240,
    "nombreItems": 2
  }
}
```

---

### 2. **GET /metier/etat/semaine**

Récupère les statistiques pour une semaine.

**Paramètres** :

- `date` (query) : Date au format `YYYY-MM-DD` (ex: `2025-11-01`)
  - La semaine commence le lundi de cette date

**Exemple de requête** :

```
GET /metier/etat/semaine?date=2025-11-01
```

**Réponse** :

```json
{
  "success": true,
  "data": {
    "periode": "Semaine du 28/10/2025 au 03/11/2025",
    "liste": [
      {
        "jour": "Lundi",
        "date": "28/10/2025",
        "totalPoids": 820,
        "prixKg": 800,
        "nombrePesees": 6,
        "montant": 656000
      },
      {
        "jour": "Mardi",
        "date": "29/10/2025",
        "totalPoids": 950,
        "prixKg": 800,
        "nombrePesees": 1,
        "montant": 6320
      }
    ],
    "totalPoids": 1770,
    "totalVentes": 662320,
    "nombreItems": 2
  }
}
```

---

### 3. **GET /metier/etat/mois**

Récupère les statistiques pour un mois.

**Paramètres** :

- `mois` (query) : Numéro du mois (1-12)
- `annee` (query) : Année (ex: `2025`)

**Exemple de requête** :

```
GET /metier/etat/mois?mois=11&annee=2025
```

**Réponse** :

```json
{
  "success": true,
  "data": {
    "periode": "Novembre 2025",
    "liste": [
      {
        "date": "01/11/2025",
        "totalPoids": 120.4,
        "prixKg": 800,
        "nombrePesees": 6,
        "montant": 9920
      },
      {
        "date": "02/11/2025",
        "totalPoids": 7.9,
        "prixKg": 800,
        "nombrePesees": 1,
        "montant": 6320
      }
    ],
    "totalPoids": 128.3,
    "totalVentes": 16240,
    "nombreItems": 2
  }
}
```

---

### 4. **GET /metier/etat/annee**

Récupère les statistiques pour une année.

**Paramètres** :

- `annee` (query) : Année (ex: `2025`)

**Exemple de requête** :

```
GET /metier/etat/annee?annee=2025
```

**Réponse** :

```json
{
  "success": true,
  "data": {
    "periode": "2025",
    "liste": [
      {
        "mois": "Janvier",
        "totalPoids": 820,
        "prixKg": 800,
        "nombrePesees": 6,
        "montant": 656000
      },
      {
        "mois": "Février",
        "totalPoids": 950,
        "prixKg": 800,
        "nombrePesees": 1,
        "montant": 6320
      }
    ],
    "totalPoids": 1770,
    "totalVentes": 662320,
    "nombreItems": 2
  }
}
```

---

## 🧮 Logique de Groupement

### Comment les données sont-elles groupées ?

Le groupement se fait en JavaScript après avoir récupéré les données avec QueryBuilder.

#### **Par Jour** :

- **QueryBuilder** : Récupère tous les `DetailAchatEntity` pour le jour
- **Groupement** : Les ventes sont groupées **par achat** (chaque achat = une ligne)
- Si un client fait plusieurs achats dans la journée, chaque achat apparaît sur une ligne séparée
- Utilise l'ID de l'achat comme clé : `resultats[achatId]`

#### **Par Semaine** :

- **QueryBuilder** : Récupère tous les `DetailAchatEntity` pour la semaine (plage de dates)
- **Groupement** : Les ventes sont groupées **par jour de la semaine**
- Tous les achats d'un même jour sont additionnés ensemble
- Utilise la date formatée comme clé : `resultats[dateKey]`

#### **Par Mois** :

- **QueryBuilder** : Récupère tous les `DetailAchatEntity` pour le mois (plage de dates)
- **Groupement** : Les ventes sont groupées **par jour du mois**
- Tous les achats d'un même jour sont additionnés ensemble
- Utilise la date formatée comme clé : `resultats[dateKey]`

#### **Par Année** :

- **QueryBuilder** : Récupère tous les `DetailAchatEntity` pour l'année (plage de dates)
- **Groupement** : Les ventes sont groupées **par mois**
- Tous les achats d'un même mois sont additionnés ensemble
- Utilise le numéro du mois comme clé : `resultats[mois]`

---

## 🔢 Calcul des Totaux

### Comment sont calculés les totaux ?

Les totaux sont calculés avec des boucles `for` simples après le groupement.

1. **Total Poids** :

   ```typescript
   let totalPoids = 0;
   for (const item of liste) {
     totalPoids += item.totalPoids;
   }
   ```

   - Parcourt chaque élément de la liste
   - Additionne tous les poids
   - Résultat en décimal (ex: `143.4`)
   - Formaté avec `parseFloat(totalPoids.toFixed(1))` pour garder 1 décimale

2. **Total Ventes** :

   ```typescript
   let totalVentes = 0;
   for (const item of liste) {
     totalVentes += item.montant;
   }
   ```

   - Parcourt chaque élément de la liste
   - Additionne tous les montants
   - Résultat en entier (CFA)

3. **Nombre de Pesées** :
   - Compté pendant le groupement : `nombrePesees += 1`
   - Chaque `DetailAchatEntity` = une pesée
   - Stocké dans chaque élément de la liste

---

## 🧪 Test avec Postman

### 1. Tester l'endpoint Jour

1. Ouvrir Postman
2. Créer une nouvelle requête GET
3. URL : `http://localhost:3000/metier/etat/jour?date=2025-11-01`
4. Cliquer sur "Send"
5. Vérifier la réponse JSON

### 2. Tester l'endpoint Semaine

1. URL : `http://localhost:3000/metier/etat/semaine?date=2025-11-01`
2. Cliquer sur "Send"

### 3. Tester l'endpoint Mois

1. URL : `http://localhost:3000/metier/etat/mois?mois=11&annee=2025`
2. Cliquer sur "Send"

### 4. Tester l'endpoint Année

1. URL : `http://localhost:3000/metier/etat/annee?annee=2025`
2. Cliquer sur "Send"

---

## 🎓 Concepts Importants à Retenir

### 1. **Service vs Controller**

- **Service** : Contient la logique métier (calculs, requêtes SQL)
- **Controller** : Expose les endpoints API (routes HTTP)

### 2. **EntityManager**

- Permet de faire des requêtes SQL complexes
- Utilise `QueryBuilder` pour construire des requêtes
- Permet de faire des JOIN entre tables

### 3. **Map**

- Structure de données pour grouper des données
- Clé-valeur (ex: date → données)
- Permet d'éviter les doublons

### 4. **reduce()**

- Fonction JavaScript pour calculer des totaux
- Parcourt un tableau et accumule une valeur
- Parfait pour les sommes, moyennes, etc.

### 5. **Query Parameters**

- Paramètres passés dans l'URL après le `?`
- Exemple : `?date=2025-11-01&mois=11`
- Accessibles avec `@Query()` dans le controller

---

## 🚀 Prochaines Étapes

Maintenant que tu comprends le module État, tu peux :

1. **Tester les endpoints** avec Postman
2. **Intégrer avec le frontend** pour afficher les statistiques
3. **Ajouter des filtres** (ex: filtrer par produit, par client)
4. **Ajouter des graphiques** pour visualiser les données

---

## ❓ Questions Fréquentes

### Q: Pourquoi utiliser EntityManager avec QueryBuilder au lieu de Repository ?

**R:** QueryBuilder permet de faire des requêtes plus complexes et flexibles :

- Filtres par plages de dates avec `>=` et `<=`
- JOIN explicites avec `leftJoinAndSelect`
- Contrôle total sur la requête SQL générée
- Plus adapté pour les statistiques et agrégations

### Q: Pourquoi utiliser des objets `{}` au lieu d'un tableau simple ?

**R:** Les objets `{}` permettent de grouper facilement les données par clé (date, mois, achatId) :

- Accès direct par clé : `resultats[achatId]`
- Évite les doublons (une clé = une valeur)
- Plus simple à comprendre que `Map` pour les débutants
- Facile à convertir en tableau avec une boucle `for...in`

### Q: Comment formater les dates ?

**R:** Le service utilise une méthode privée `formatDate()` qui convertit les dates au format `DD/MM/YYYY` pour l'affichage.

### Q: Comment calculer les totaux ?

**R:** On utilise `reduce()` pour additionner tous les éléments d'un tableau. C'est plus propre et plus lisible qu'une boucle `for`.

---

## 📚 Ressources

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation TypeORM](https://typeorm.io/)
- [Documentation JavaScript Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Documentation JavaScript reduce()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

**Bon courage dans ton apprentissage ! 🚀**
