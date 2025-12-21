# Guide de Test - Dashboard Statistiques

## Vue d'ensemble

Ce guide contient les exemples JSON pour tester les endpoints de statistiques du dashboard. Tous les endpoints retournent le `poidsTotal` et le `montantTotal` agrégés pour la période demandée.

---

## 1. Statistiques par Jour

### Endpoint
```
GET /metier/dashboard/statistiques/jour?dateJour=2024-03-15
```

### Paramètres Query
- `dateJour` : Date au format `YYYY-MM-DD` (ex: `2024-03-15`)

### Exemple de requête Postman
```
GET http://localhost:3000/metier/dashboard/statistiques/jour?dateJour=2024-03-15
```

### Réponse attendue
```json
{
  "poidsTotal": 125.50,
  "montantTotal": 2500000,
  "date": "2024-03-15"
}
```

### Exemples de dates à tester
- Aujourd'hui : `dateJour=2024-03-15`
- Hier : `dateJour=2024-03-14`
- Date sans ventes : `dateJour=2024-01-01` (retournera `poidsTotal: 0, montantTotal: 0`)

---

## 2. Statistiques par Semaine

### Endpoint
```
GET /metier/dashboard/statistiques/semaine?date=2024-03-15
```

### Paramètres Query
- `date` : N'importe quelle date de la semaine au format `YYYY-MM-DD` (ex: `2024-03-15`)
  - La semaine commence le lundi (ISO standard)

### Exemple de requête Postman
```
GET http://localhost:3000/metier/dashboard/statistiques/semaine?date=2024-03-15
```

### Réponse attendue
```json
{
  "poidsTotal": 850.75,
  "montantTotal": 17000000,
  "date": "2024-03-15"
}
```

### Exemples de dates à tester
- Semaine actuelle : `date=2024-03-15` (retourne toutes les ventes de la semaine du 11 au 17 mars 2024)
- Semaine précédente : `date=2024-03-08`
- Semaine sans ventes : `date=2024-01-01` (retournera `poidsTotal: 0, montantTotal: 0`)

---

## 3. Statistiques par Mois

### Endpoint
```
GET /metier/dashboard/statistiques/mois?mois=3&annee=2024
```

### Paramètres Query
- `mois` : Numéro du mois (1-12)
- `annee` : Année (ex: `2024`)

### Exemple de requête Postman
```
GET http://localhost:3000/metier/dashboard/statistiques/mois?mois=3&annee=2024
```

### Réponse attendue
```json
{
  "poidsTotal": 3500.25,
  "montantTotal": 70000000,
  "mois": 3,
  "annee": 2024
}
```

### Exemples de mois à tester
- Mars 2024 : `mois=3&annee=2024`
- Janvier 2024 : `mois=1&annee=2024`
- Décembre 2023 : `mois=12&annee=2023`
- Mois sans ventes : `mois=1&annee=2020` (retournera `poidsTotal: 0, montantTotal: 0`)

---

## 4. Statistiques par Année

### Endpoint
```
GET /metier/dashboard/statistiques/annee?annee=2024
```

### Paramètres Query
- `annee` : Année (ex: `2024`)

### Exemple de requête Postman
```
GET http://localhost:3000/metier/dashboard/statistiques/annee?annee=2024
```

### Réponse attendue
```json
{
  "poidsTotal": 45000.50,
  "montantTotal": 900000000,
  "annee": 2024
}
```

### Exemples d'années à tester
- Année actuelle : `annee=2024`
- Année précédente : `annee=2023`
- Année sans ventes : `annee=2020` (retournera `poidsTotal: 0, montantTotal: 0`)

---

## Notes importantes

### Format des dates
- Toutes les dates doivent être au format `YYYY-MM-DD`
- Exemple : `2024-03-15` (15 mars 2024)

### Valeurs par défaut
- Si aucune vente n'est trouvée pour la période, les valeurs retournées seront `0`
- Les ventes avec `geler = 1` sont exclues automatiquement

### Calculs
- `poidsTotal` : Somme de tous les `poidsTotal` des achats de la période
- `montantTotal` : Somme de tous les `montantTotal` des achats de la période

### Gestion des erreurs
Si un paramètre est manquant ou invalide, l'API retournera une erreur. Exemples :
- Jour : `dateJour` manquant → Erreur
- Semaine : `date` manquant → Erreur
- Mois : `mois` ou `annee` manquant → Erreur
- Année : `annee` manquant → Erreur

---

## Collection Postman complète

### Variables d'environnement Postman
Créer les variables suivantes :
- `base_url` : `http://localhost:3000`
- `date_test` : `2024-03-15`
- `mois_test` : `3`
- `annee_test` : `2024`

### Exemples de requêtes avec variables
```
GET {{base_url}}/metier/dashboard/statistiques/jour?dateJour={{date_test}}
GET {{base_url}}/metier/dashboard/statistiques/semaine?date={{date_test}}
GET {{base_url}}/metier/dashboard/statistiques/mois?mois={{mois_test}}&annee={{annee_test}}
GET {{base_url}}/metier/dashboard/statistiques/annee?annee={{annee_test}}
```

---

## Tests de validation

### Test 1 : Vérifier que les totaux sont corrects
1. Créer plusieurs ventes avec des `poidsTotal` et `montantTotal` connus
2. Appeler l'endpoint pour la période correspondante
3. Vérifier que la somme correspond aux ventes créées

### Test 2 : Vérifier les périodes sans ventes
1. Appeler un endpoint avec une date/mois/année sans ventes
2. Vérifier que `poidsTotal` et `montantTotal` sont à `0`

### Test 3 : Vérifier l'exclusion des ventes gelées
1. Créer une vente avec `geler = 1`
2. Appeler l'endpoint pour la période correspondante
3. Vérifier que cette vente n'est pas incluse dans les totaux

---

## Exemples de réponses complètes

### Réponse jour avec ventes
```json
{
  "poidsTotal": 125.50,
  "montantTotal": 2500000,
  "date": "2024-03-15"
}
```

### Réponse jour sans ventes
```json
{
  "poidsTotal": 0,
  "montantTotal": 0,
  "date": "2024-01-01"
}
```

### Réponse mois avec ventes
```json
{
  "poidsTotal": 3500.25,
  "montantTotal": 70000000,
  "mois": 3,
  "annee": 2024
}
```

### Réponse année avec ventes
```json
{
  "poidsTotal": 45000.50,
  "montantTotal": 900000000,
  "annee": 2024
}
```

