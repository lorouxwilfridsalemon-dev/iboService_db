# 📊 Modèle de Données Complet - Gestion Vente Thon

**Document de conception** - Modèle de données et logique métier  
_Sans implémentation - Architecture uniquement_

---

## 📋 Table des matières

1. [Prix produits avec réductions](#1-prix-produits-avec-réductions)
2. [Historique des produits](#2-historique-des-produits)
3. [Gestion des paiements](#3-gestion-des-paiements)
4. [Relations entre tables](#4-relations-entre-tables)
5. [Logique métier](#5-logique-métier)

---

## 1. Prix produits avec réductions

### 1.1 Table `produit_pro` (modifiée)

**Objectif** : Stocker les prix avec réductions directement dans la table produit.

#### Colonnes existantes

- `id_pro` (PK, integer, auto-increment)
- `libelle_pro` (varchar 50) - Nom du produit
- `prix_kg_pro` (integer) - **Prix de base** (ex: 3000 FCFA)

#### Nouvelles colonnes à ajouter

- `prix_kg_1_tonne_pro` (integer, nullable) - **Prix avec réduction 1 tonne** (ex: 2750 FCFA = 3000 - 250)
- `prix_kg_3_tonnes_pro` (integer, nullable) - **Prix avec réduction 3 tonnes** (ex: 2500 FCFA = 3000 - 500)

#### Structure SQL complète

```sql
CREATE TABLE produit_pro (
  id_pro INT PRIMARY KEY AUTO_INCREMENT,
  libelle_pro VARCHAR(50) NOT NULL,
  prix_kg_pro INT,                    -- 3000 FCFA (prix de base)
  prix_kg_1_tonne_pro INT,             -- 2750 FCFA (nouveau)
  prix_kg_3_tonnes_pro INT,            -- 2500 FCFA (nouveau)
  empty1_pro VARCHAR(100),
  empty2_pro VARCHAR(100),
  empty3_pro VARCHAR(100),
  geler_pro INT NOT NULL DEFAULT 0,
  date_creation_pro TIMESTAMP NOT NULL,
  idusrcreation_pro INT
);
```

#### Exemple de données

```
id_pro | libelle_pro | prix_kg_pro | prix_kg_1_tonne_pro | prix_kg_3_tonnes_pro
-------|-------------|-------------|---------------------|--------------------
1      | Thon        | 3000        | 2750                | 2500
2      | Sardine     | 2000        | 1750                | 1500
3      | Maquereau   | 2500        | 2250                | 2000
```

#### Logique de calcul du prix

**Règle** : Le prix appliqué dépend du poids total du produit dans la vente.

```
SI poids >= 3000 kg ET prix_kg_3_tonnes_pro existe
  → Utiliser prix_kg_3_tonnes_pro (2500 FCFA)

SINON SI poids >= 1000 kg ET prix_kg_1_tonne_pro existe
  → Utiliser prix_kg_1_tonne_pro (2750 FCFA)

SINON
  → Utiliser prix_kg_pro (3000 FCFA - prix de base)
```

**Exemples** :

- Poids = 500 kg → Prix = 3000 FCFA (pas de réduction)
- Poids = 1200 kg → Prix = 2750 FCFA (réduction 1 tonne)
- Poids = 3500 kg → Prix = 2500 FCFA (réduction 3 tonnes)

### 1.2 Pourquoi stocker les réductions dans la table produit ?

#### ✅ Avantages

**1. Performance et simplicité**

- **Pas de calcul à chaque vente** : Le prix est déjà stocké, pas besoin de calculer `prix_kg - 250` ou `prix_kg - 500`
- **Requête SQL simple** : `SELECT prix_kg_1_tonne_pro FROM produit_pro WHERE id_pro = 1`
- **Moins de logique métier** : Pas besoin de fonction complexe pour calculer les réductions

**2. Flexibilité par produit**

- **Prix différents par produit** : Chaque produit peut avoir ses propres réductions
  - Exemple : Thon → -250 FCFA à 1 tonne, Sardine → -200 FCFA à 1 tonne
- **Pas de réduction obligatoire** : Si un produit n'a pas de réduction, `prix_kg_1_tonne_pro = NULL`
- **Facile à modifier** : Changer la réduction d'un produit = UPDATE d'une seule colonne

**3. Traçabilité**

- **Voir l'historique des prix réduits** : Via `historique_produit_hpr`, on peut voir l'évolution des prix réduits
- **Audit facile** : "Quel était le prix réduit du Thon le 15 janvier ?" → Requête simple

**4. Cohérence des données**

- **Prix fixe au moment de la vente** : Le prix utilisé est stocké dans `detail_achat_dac.montant_dac`
- **Pas de risque d'erreur de calcul** : Le prix est déjà calculé et validé

#### ⚠️ Inconvénients

**1. Redondance potentielle**

- Si les réductions sont toujours les mêmes (toujours -250, toujours -500), on pourrait calculer
- **Mais** : Si les réductions varient par produit, c'est nécessaire

**2. Maintenance**

- Si on change la règle (ex: -300 au lieu de -250), il faut mettre à jour tous les produits
- **Solution** : Script de migration SQL pour mettre à jour en masse

**3. Stockage**

- 2 colonnes supplémentaires par produit
- **Impact négligeable** : Pour 100 produits = 200 valeurs entières (800 bytes)

#### 🎯 Évaluation de l'approche

**Votre approche est EXCELLENTE pour votre cas d'usage** ✅

**Pourquoi ?**

1. **Réductions variables** : Vous avez dit que les réductions peuvent être différentes par produit

   - Thon : -250 FCFA à 1 tonne, -500 FCFA à 3 tonnes
   - Sardine : Peut-être -200 FCFA à 1 tonne, -400 FCFA à 3 tonnes
   - → **Nécessite de stocker les prix réduits**

2. **Simplicité d'utilisation** :

   - Lors d'une vente, on charge le produit et on a directement les 3 prix
   - Pas besoin de logique complexe : `if poids >= 3000 → prix = prix_kg_3_tonnes_pro`

3. **Performance** :

   - Une seule requête SQL pour obtenir tous les prix
   - Pas de calcul à chaque vente

4. **Évolutivité** :
   - Si demain vous voulez ajouter une réduction à 5 tonnes, ajoutez juste `prix_kg_5_tonnes_pro`
   - Pas besoin de modifier la logique de calcul

**Alternative (moins bonne pour votre cas)** :

- Calculer les réductions : `prix_kg - 250` ou `prix_kg - 500`
- **Problème** : Si les réductions varient par produit, il faudrait une table de configuration
- **Résultat** : Plus complexe que votre approche actuelle

#### 📊 Comparaison

| Critère         | Votre approche (prix stockés) | Calcul dynamique                     |
| --------------- | ----------------------------- | ------------------------------------ |
| **Simplicité**  | ✅ Très simple                | ❌ Plus complexe                     |
| **Performance** | ✅ Excellente                 | ⚠️ Calcul à chaque fois              |
| **Flexibilité** | ✅ Par produit                | ❌ Règle globale                     |
| **Maintenance** | ⚠️ Mise à jour manuelle       | ✅ Règle centralisée                 |
| **Traçabilité** | ✅ Historique complet         | ⚠️ Pas d'historique des prix réduits |

**Conclusion** : Votre approche est **parfaite** pour votre besoin ! 🎉

---

## 2. Historique des produits

### 2.1 Table `historique_produit_hpr` (nouvelle)

**Objectif** : Garder un historique complet de toutes les **modifications** des produits (pas des ventes).

#### Structure

**Colonnes principales** :

- `id_hpr` (PK, integer, auto-increment)
- `produit_id_hpr` (FK, integer) - **ID du produit original** (référence vers `produit_pro.id_pro`)

**Copie des champs du produit** :

- `libelle_hpr` (varchar 50) - Copie de `libelle_pro`
- `prix_kg_hpr` (integer) - Copie de `prix_kg_pro`
- `prix_kg_1_tonne_hpr` (integer) - Copie de `prix_kg_1_tonne_pro`
- `prix_kg_3_tonnes_hpr` (integer) - Copie de `prix_kg_3_tonnes_pro`

**Champs de traçabilité** :

- `date_modification_hpr` (timestamp) - Date de la modification
- `idusr_modification_hpr` (integer) - Utilisateur qui a fait la modification
- `type_action_hpr` (varchar 50) - Type d'action : `'CREATION'`, `'MODIFICATION'`

**Valeurs avant/après (optionnel)** :

- `ancien_prix_kg_hpr` (integer, nullable) - Prix avant modification
- `nouveau_prix_kg_hpr` (integer, nullable) - Nouveau prix après modification

#### Structure SQL

```sql
CREATE TABLE historique_produit_hpr (
  id_hpr INT PRIMARY KEY AUTO_INCREMENT,
  produit_id_hpr INT NOT NULL,

  -- Copie des champs du produit
  libelle_hpr VARCHAR(50),
  prix_kg_hpr INT,
  prix_kg_1_tonne_hpr INT,
  prix_kg_3_tonnes_hpr INT,

  -- Traçabilité
  date_modification_hpr TIMESTAMP NOT NULL,
  idusr_modification_hpr INT,
  type_action_hpr VARCHAR(50), -- 'CREATION', 'MODIFICATION'

  -- Valeurs avant/après (optionnel)
  ancien_prix_kg_hpr INT,
  nouveau_prix_kg_hpr INT,

  -- Contrainte
  FOREIGN KEY (produit_id_hpr) REFERENCES produit_pro(id_pro)
);
```

#### Exemple de données

```
id_hpr | produit_id_hpr | libelle_hpr | prix_kg_hpr | prix_kg_1_tonne_hpr | prix_kg_3_tonnes_hpr | date_modification_hpr | type_action_hpr
-------|----------------|-------------|-------------|---------------------|----------------------|----------------------|----------------
1      | 1              | Thon        | 3000        | 2750                | 2500                 | 2024-01-15 10:00:00  | CREATION
2      | 1              | Thon        | 3200        | 2950                | 2700                 | 2024-01-20 14:30:00  | MODIFICATION
3      | 1              | Thon        | 3200        | 2800                | 2600                 | 2024-02-10 09:15:00  | MODIFICATION
```

#### Logique de création d'historique

**Quand créer un historique ?**

**Uniquement lors des modifications du produit** :

- Quand on modifie le prix d'un produit (prix_kg_pro, prix_kg_1_tonne_pro, prix_kg_3_tonnes_pro)
- Quand on modifie le libellé du produit
- Créer un historique **AVANT** la modification
- Stocker les anciennes et nouvelles valeurs

**Pourquoi pas d'historique lors des ventes ?**

- Les ventes sont déjà tracées dans `detail_achat_dac` avec le prix utilisé
- Évite la duplication de données (le prix utilisé est déjà dans `detail_achat_dac.montant_dac`)
- Réduit la taille de la base de données (moins d'enregistrements)
- L'historique produit sert uniquement à tracer les **changements de configuration** du produit

---

## 3. Gestion des paiements

### 3.1 Table `achat_ach` (modifiée)

**Objectif** : Ajouter les champs de paiement et modalité directement dans la table achat.

#### Nouvelles colonnes à ajouter

- `montant_paye_ach` (integer, nullable, default 0) - **Montant total payé**
- `solde_ach` (integer, nullable) - **Solde restant** (montantTotal - montantPaye)
- `modalite_paiement_id_ach` (FK, integer, nullable) - **Référence vers modalité de paiement**

#### Structure SQL (modification)

```sql
ALTER TABLE achat_ach
ADD COLUMN montant_paye_ach INT DEFAULT 0,
ADD COLUMN solde_ach INT,
ADD COLUMN modalite_paiement_id_ach INT,
ADD FOREIGN KEY (modalite_paiement_id_ach) REFERENCES modalite_paiement_mop(id_mop);
```

#### Logique de calcul

```
solde_ach = montant_total_ach - montant_paye_ach
```

**Cas possibles** :

- Si `montant_paye_ach = 0` → `solde_ach = montant_total_ach` (non payé)
- Si `montant_paye_ach = montant_total_ach` → `solde_ach = 0` (payé intégralement)
- Si `0 < montant_paye_ach < montant_total_ach` → `solde_ach > 0` (partiellement payé)

#### Exemple de données

```
id_ach | montant_total_ach | montant_paye_ach | solde_ach | modalite_paiement_id_ach
-------|-------------------|------------------|-----------|------------------------
42     | 100000            | 0                | 100000    | 1  (Espèces)
43     | 75000             | 50000            | 25000     | 2  (Chèque)
44     | 50000             | 50000            | 0         | 3  (Virement)
```

### 3.2 Table `modalite_paiement_mop` (nouvelle)

**Objectif** : Stocker les modalités de paiement configurables (Espèces, Chèque, Virement, etc.).

#### Structure

**Colonnes** :

- `id_mop` (PK, integer, auto-increment)
- `libelle_mop` (varchar 50) - Libellé de la modalité (ex: "Espèces", "Chèque", "Virement", "Carte bancaire")
- `code_mop` (varchar 20, unique) - Code unique (ex: "ESPECE", "CHEQUE", "VIREMENT")
- `actif_mop` (tinyint, default 1) - 1=actif, 0=inactif
- `geler_mop` (tinyint, default 0)
- `date_creation_mop` (timestamp)
- `idusrcreation_mop` (integer)

#### Structure SQL

```sql
CREATE TABLE modalite_paiement_mop (
  id_mop INT PRIMARY KEY AUTO_INCREMENT,
  libelle_mop VARCHAR(50) NOT NULL,
  code_mop VARCHAR(20) UNIQUE NOT NULL,
  actif_mop INT DEFAULT 1,
  geler_mop INT NOT NULL DEFAULT 0,
  date_creation_mop TIMESTAMP NOT NULL,
  idusrcreation_mop INT
);
```

#### Exemple de données

```
id_mop | libelle_mop      | code_mop   | actif_mop
-------|-----------------|------------|-----------
1      | Espèces         | ESPECE     | 1
2      | Chèque          | CHEQUE     | 1
3      | Virement        | VIREMENT   | 1
4      | Carte bancaire  | CARTE      | 1
```

#### Logique

- Un achat a **une seule modalité de paiement** (relation one-to-many)
- La modalité peut être NULL si le paiement n'est pas encore défini
- Permet de filtrer les ventes par modalité de paiement

---

## 4. Relations entre tables

### 4.1 Schéma complet

```
produit_pro (1)
  ├── prix_kg_pro (champ)
  ├── prix_kg_1_tonne_pro (champ)
  ├── prix_kg_3_tonnes_pro (champ)
  └── historique_produit_hpr (N)
      └── produit_id_hpr (FK)

achat_ach (1)
  ├── montant_total_ach (champ)
  ├── montant_paye_ach (champ)
  ├── solde_ach (champ)
  └── modalite_paiement_mop (N)
      └── modalite_paiement_id_ach (FK)
```

### 4.2 Relations détaillées

**Produit → Historique** :

- Un produit peut avoir plusieurs historiques
- Chaque historique est lié à un seul produit
- Relation : `produit_pro.id_pro` → `historique_produit_hpr.produit_id_hpr`

**Achat → Modalité de paiement** :

- Un achat a une seule modalité de paiement
- Une modalité peut être sur plusieurs achats
- Relation : `achat_ach.modalite_paiement_id_ach` → `modalite_paiement_mop.id_mop`

---

## 5. Logique métier

### 5.1 Calcul du prix selon le poids

**Algorithme** :

```
FONCTION calculerPrixSelonPoids(produit, poids):

  SI poids >= 3000 kg ET produit.prix_kg_3_tonnes_pro existe:
    RETOURNER produit.prix_kg_3_tonnes_pro  // 2500 FCFA

  SINON SI poids >= 1000 kg ET produit.prix_kg_1_tonne_pro existe:
    RETOURNER produit.prix_kg_1_tonne_pro  // 2750 FCFA

  SINON:
    RETOURNER produit.prix_kg_pro  // 3000 FCFA (prix de base)
```

**Exemples** :

- Produit : Thon (prix_kg = 3000, prix_1_tonne = 2750, prix_3_tonnes = 2500)
  - Poids = 500 kg → Prix = 3000 FCFA
  - Poids = 1200 kg → Prix = 2750 FCFA
  - Poids = 3500 kg → Prix = 2500 FCFA

### 5.2 Création d'historique produit

**Algorithme : Créer historique lors d'une modification**

```
1. Charger le produit actuel depuis produit_pro
2. Créer un enregistrement dans historique_produit_hpr avec :
   - produit_id_hpr = id du produit
   - Copie de tous les champs du produit (libelle, prix_kg, prix_kg_1_tonne, prix_kg_3_tonnes)
   - ancien_prix_kg_hpr = prix actuel
   - nouveau_prix_kg_hpr = nouveau prix (si modification de prix)
   - date_modification_hpr = maintenant
   - idusr_modification_hpr = ID utilisateur
   - type_action_hpr = 'MODIFICATION'
3. Modifier le produit dans produit_pro
```

### 5.3 Mise à jour du paiement

**Algorithme : Ajouter un paiement à un achat**

```
1. Récupérer l'achat depuis achat_ach
2. Calculer le nouveau montantPaye :
   montantPaye = montantPayeActuel + nouveauPaiement
3. Calculer le nouveau solde :
   solde = montantTotal - montantPaye
4. Mettre à jour achat_ach :
   UPDATE achat_ach
   SET montant_paye_ach = montantPaye,
       solde_ach = solde,
       modalite_paiement_id_ach = modaliteId  (si fourni)
   WHERE id_ach = achatId
```

**Note** : Le statut de paiement peut être déterminé à la volée selon le solde :

- `solde = 0` → Payé intégralement
- `solde > 0 ET montantPaye > 0` → Partiellement payé
- `montantPaye = 0` → Non payé

### 5.4 Exemple de workflow complet

#### Scénario : Vente avec paiement en deux temps

**Étape 1 : Création de la vente**

```
Achat créé :
- montantTotal = 100000 FCFA
- montantPaye = 0
- solde = 100000 FCFA
- modalitePaiement = NULL (pas encore défini)
```

**Étape 2 : Premier paiement (50000 FCFA, Espèces)**

```
Calcul :
- montantPaye = 0 + 50000 = 50000
- solde = 100000 - 50000 = 50000

Actions :
UPDATE achat_ach
SET montant_paye_ach = 50000,
    solde_ach = 50000,
    modalite_paiement_id_ach = 1  (Espèces)
WHERE id_ach = 42
```

**Étape 3 : Deuxième paiement (50000 FCFA, Virement)**

```
Calcul :
- montantPaye = 50000 + 50000 = 100000
- solde = 100000 - 100000 = 0

Actions :
UPDATE achat_ach
SET montant_paye_ach = 100000,
    solde_ach = 0,
    modalite_paiement_id_ach = 3  (Virement)
WHERE id_ach = 42
```

**Résultat final** :

- L'achat est payé intégralement (solde = 0)
- Modalité de paiement : Virement (dernière modalité utilisée)
- Le statut peut être déterminé à la volée : `solde = 0` → "Payé intégralement"

---

## 📝 Résumé des modifications

### Tables modifiées

1. **`produit_pro`** :

   - Ajout de `prix_kg_1_tonne_pro`
   - Ajout de `prix_kg_3_tonnes_pro`

2. **`achat_ach`** :
   - Ajout de `montant_paye_ach`
   - Ajout de `solde_ach`

### Nouvelles tables

1. **`historique_produit_hpr`** :

   - Historique des **modifications uniquement** des produits (pas des ventes)

2. **`modalite_paiement_mop`** :

   - Modalités de paiement configurables (Espèces, Chèque, Virement, etc.)

---

## ✅ Points importants

1. **Prix avec réductions** : Stockés directement dans `produit_pro` pour faciliter les requêtes et la performance
2. **Historique produit** : Permet de tracer uniquement les **modifications** des produits (pas des ventes)
3. **Paiements** : Gérés via `montant_paye_ach` et `solde_ach` dans `achat_ach`
4. **Modalité de paiement** : Liée directement à l'achat (relation simple, pas de table pivot)
5. **Statut de paiement** : Calculé à la volée selon le solde (pas besoin de table statut)

---

---

## 6. Évaluation de l'approche simplifiée

### 6.1 Approche retenue

**Structure simplifiée** :

- Pas de table `statut_sta`
- Pas de table pivot `achat_statut_ast`
- Modalité de paiement liée directement à `achat_ach`
- Statut calculé à la volée selon le solde

### 6.2 Avantages de cette approche

**1. Simplicité** ✅

- **Moins de tables** : 2 tables en moins (statut_sta et achat_statut_ast)
- **Moins de relations** : Relation directe `achat_ach` → `modalite_paiement_mop`
- **Moins de code** : Pas besoin de gérer les statuts actifs/inactifs
- **Moins de requêtes** : Pas besoin de JOIN avec table pivot

**2. Performance** ✅

- **Requêtes plus rapides** : Pas de table pivot à joindre
- **Moins d'écritures** : Pas besoin de créer/mettre à jour des statuts
- **Indexation simple** : Index direct sur `modalite_paiement_id_ach`

**3. Maintenance** ✅

- **Moins de données à gérer** : Pas d'historique de statuts
- **Logique simple** : Le statut = fonction du solde (calculé à la volée)
- **Moins de bugs potentiels** : Moins de tables = moins de risques d'incohérence

**4. Flexibilité** ✅

- **Modalité modifiable** : On peut changer la modalité de paiement facilement
- **Statut dynamique** : Le statut se calcule automatiquement selon le solde

### 6.3 Inconvénients de cette approche

**1. Pas d'historique des statuts** ⚠️

- **Problème** : On ne peut pas voir l'historique "Impayé → Partiel → Payé"
- **Impact** : Si besoin d'audit complet des changements de statut, cette approche ne le permet pas
- **Solution** : Si nécessaire, on peut ajouter une table `historique_paiement` plus tard

**2. Modalité unique** ⚠️

- **Problème** : Un achat a une seule modalité de paiement
- **Impact** : Si un achat est payé en deux fois avec deux modalités différentes (ex: 50% Espèces, 50% Virement), on ne peut stocker qu'une seule modalité
- **Solution** :
  - Option A : Stocker la dernière modalité utilisée
  - Option B : Créer une table `paiement_pai` pour gérer les paiements multiples avec leurs modalités

**3. Statut calculé** ⚠️

- **Problème** : Le statut n'est pas stocké, il est calculé à chaque fois
- **Impact** : Si besoin de filtrer par statut, il faut calculer à chaque requête
- **Solution** : Ajouter une colonne calculée ou un trigger SQL pour stocker le statut

### 6.4 Comparaison avec l'approche précédente

| Critère                 | Approche simplifiée (actuelle) | Approche avec statuts (précédente) |
| ----------------------- | ------------------------------ | ---------------------------------- |
| **Simplicité**          | ✅ Très simple                 | ❌ Plus complexe                   |
| **Performance**         | ✅ Excellente                  | ⚠️ Plus de JOINs                   |
| **Historique statuts**  | ❌ Pas d'historique            | ✅ Historique complet              |
| **Modalités multiples** | ⚠️ Une seule modalité          | ✅ Plusieurs modalités possibles   |
| **Maintenance**         | ✅ Facile                      | ⚠️ Plus de tables à gérer          |
| **Flexibilité**         | ✅ Statut dynamique            | ⚠️ Statut stocké                   |

### 6.5 Recommandations

**Votre approche simplifiée est VIABLE si** :

1. ✅ **Vous n'avez pas besoin d'historique des statuts**

   - Si vous voulez juste savoir "est-ce payé ou non", c'est suffisant
   - Le solde donne déjà l'information nécessaire

2. ✅ **Les paiements sont généralement en une seule modalité**

   - Si un achat est payé en une fois (ex: 100% Espèces), c'est parfait
   - Si parfois en deux fois mais même modalité, on peut stocker la dernière

3. ✅ **Vous voulez la simplicité**
   - Moins de tables = moins de complexité
   - Plus facile à comprendre et maintenir

**Vous devriez considérer l'approche avec statuts si** :

1. ❌ **Vous avez besoin d'audit complet**

   - Besoin de tracer tous les changements de statut
   - Besoin de savoir "qui a changé le statut et quand"

2. ❌ **Les paiements sont souvent multi-modalités**

   - Un achat payé 50% Espèces + 50% Virement
   - Besoin de tracer chaque paiement avec sa modalité

3. ❌ **Vous avez besoin de filtrer par statut fréquemment**
   - Beaucoup de requêtes "tous les achats impayés"
   - Le calcul à la volée peut être plus lent

### 6.6 Solution hybride (optionnelle)

Si vous voulez garder la simplicité mais ajouter la flexibilité :

**Option : Table `paiement_pai` pour paiements multiples**

```sql
CREATE TABLE paiement_pai (
  id_pai INT PRIMARY KEY AUTO_INCREMENT,
  achat_id_pai INT NOT NULL,
  montant_pai INT NOT NULL,
  modalite_paiement_id_pai INT,
  date_paiement_pai TIMESTAMP,
  FOREIGN KEY (achat_id_pai) REFERENCES achat_ach(id_ach),
  FOREIGN KEY (modalite_paiement_id_pai) REFERENCES modalite_paiement_mop(id_mop)
);
```

**Avantages** :

- Garde la simplicité (pas de table statut)
- Permet plusieurs paiements avec leurs modalités
- `montant_paye_ach` = SUM des paiements
- `solde_ach` = montantTotal - SUM des paiements

**Conclusion** : Votre approche simplifiée est **parfaitement viable** pour la plupart des cas d'usage ! 🎉

---

**Document de conception - Prêt pour implémentation**
