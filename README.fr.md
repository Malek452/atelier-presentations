# Atelier Présentations

Un modèle réutilisable issu d’[Atelier Fonctions](https://github.com/Malek452/atelier-fonctions) : un tableau vert sombre, des formules lisibles et des animations qui expliquent chaque transformation. L’étudiant consulte une présentation pas à pas, sans compte ni saisie de réponses.

[Présentation MSN en ligne](https://malek452.github.io/atelier-presentations/) · [English](README.md) · [Guide de rédaction](docs/AUTHORING.md) · [Recettes d’animation](docs/ANIMATIONS.md)

## Parcours MSN : modèles linéaires et exponentiels

La présentation active s’appuie sur le corrigé fourni `TD1-MSN-corrige-complet.tex`, exercices 2 et 5. Elle distingue les données des hypothèses et conserve les calculs expliqués pas à pas.

- [Méthode générale](https://malek452.github.io/atelier-presentations/#activity/choisir-modele) : reconnaître le modèle, déterminer ses paramètres et résoudre une question de quantité ou de date.
- [Exercice 2](https://malek452.github.io/atelier-presentations/#activity/ex2-reperes) : cadence inconnue `r`, pause, fonction affine par morceaux et total `9r` à 18 h.
- [Exercice 5](https://malek452.github.io/atelier-presentations/#activity/ex5-modele) : `N(t) = 100 × 3^(t/3)`, effectifs après 15 h et 20 h, seuil de 50 000 et limite du modèle continu.
- [Support imprimable](https://malek452.github.io/atelier-presentations/handout/) : toutes les étapes, justifications et graphiques.

Chaque push sur `main` lance la validation puis le déploiement GitHub Pages. Les exemples du modèle restent disponibles dans `examples/`, hors de la présentation active.

## Créer une présentation

Sur GitHub, choisir **Use this template → Create a new repository**, puis cloner le nouveau dépôt. Installer **Node.js 24 LTS**, puis exécuter :

```sh
npm ci
npm run dev
```

Ouvrir l’adresse locale affichée. Le premier démarrage prépare les formules et les animations. Après modification d’un fichier de contenu, attendre la recompilation, puis recharger la page.

Pour ajouter un chapitre contenant une activité :

```sh
npm run new:lesson -- mon-chapitre "Mon chapitre"
```

Le fichier `src/content/mon-chapitre.ts` est créé et enregistré automatiquement. Remplacer l’exemple d’équation par votre contenu ; la commande n’invente pas de cours. Le lien de l’activité est `#activity/mon-chapitre`.

## Personnaliser

- `presentation.config.ts` : titre, description, langue des commandes et libellés de navigation.
- `src/theme.ts` : couleurs du tableau et des rôles mathématiques.
- `src/content/index.ts` : choix et ordre des chapitres.
- `src/content/*.ts` : énoncés, étapes, justifications et indications d’animation.

Les exemples couvrent les puissances, la distributivité, le second degré, un tableau de signes français, le cercle trigonométrique et une explication textuelle. Ils ne constituent pas le TD original complet. Les commandes peuvent être affichées en anglais ; les textes rédigés doivent être traduits séparément.

## Navigation

Choisir un chapitre et une activité, puis avancer avec les boutons, les flèches du clavier ou un glissement horizontal sur téléphone. La lecture automatique, la pause, le ralenti, le rejeu et la réduction des animations sont disponibles. Un retour en arrière montre l’étape terminée ; le rejeu restitue sa transformation dans le sens de la démonstration.

Les expressions qui débordent et les tableaux conservent leur défilement horizontal. Aucun résultat d’étudiant n’est collecté. Seule la préférence de réduction des animations est conservée localement.

## Vérifier et mettre en ligne

```sh
npm run validate
npm run preview
```

La compilation produit `dist/`, prêt pour un hébergement statique. Le document imprimable se trouve à l’adresse `handout/`. Voir le [guide de publication](docs/DEPLOYMENT.md) pour GitHub Pages et Netlify.

Les vérifications automatiques repèrent notamment les références d’animation introuvables et les tableaux mal formés. Elles ne constituent pas une preuve de justesse d’un nouveau cours : relire les calculs, les conditions d’application et chaque justification.

## Utiliser un assistant de programmation

Demander à l’assistant de lire `AGENTS.md`, puis lui fournir le document réel et le niveau des étudiants. Les [prompts proposés](docs/LLM-PROMPTS.md) expliquent comment adapter le contenu sans perdre la cohérence pédagogique des animations.

Le moteur conserve React, TypeScript et Motion Canvas. Voir les [limites techniques](docs/ARCHITECTURE.md) et la [maintenance des dépendances](docs/MAINTENANCE.md). Licence MIT ; les droits sur les documents que vous ajoutez restent à vérifier séparément.
