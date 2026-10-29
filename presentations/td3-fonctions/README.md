# TD 3 — Logarithmes, exponentielles et trigonométrie

Présentation interactive en français du TD no 3 de Mathématiques 1 (EC 101-1-17, 2026–2027), feuille de F. Marotte.

[Ouvrir la présentation](https://malek452.github.io/atelier-presentations/td3-fonctions/) · [Corrigé imprimable](https://malek452.github.io/atelier-presentations/td3-fonctions/handout/)

## Contenu

Les 7 exercices et leurs 15 questions sont traités : propriétés des logarithmes, équations et inéquations logarithmiques, changement de variable avec l'exponentielle, tableaux de signes et trigonométrie. Chaque question comprend l'énoncé, les conditions d'existence, les transformations justifiées et la solution. Les rappels et les figures sont répartis dans le parcours.

Le cours joint « Chapitre 3 – Limites et continuité » inspire les repères graphiques et les rappels de croissance de ln et exp. Son thème principal diffère du TD. Les courbes et les cercles ont été redessinés pour cette présentation ; ils ne sont pas des captures des pages du cours.

## Utilisation

- Choisir un exercice puis une question dans les menus.
- Avancer avec « Étape suivante », les flèches du clavier ou un glissement horizontal sur téléphone.
- Le menu des étapes permet d'aller directement à un domaine, un calcul ou une conclusion.
- Utiliser le ralenti, le rejeu ou la réduction des animations selon les besoins.
- Le bouton plein écran facilite la projection. Le fond clair, les traits épais et les accents sombres améliorent la lecture.
- Le corrigé imprimable est accessible à `handout/`. L'impression du navigateur permet de l'enregistrer en PDF.

Les liens de questions sont stables, par exemple `#activity/td3-2b` et `#activity/td3-5c`. Aucun compte étudiant ni collecte de réponses.

## Développement

Projet indépendant dans `presentations/td3-fonctions`, adapté du modèle [Atelier Présentations](https://github.com/Malek452/atelier-presentations). Node.js 24 requis.

```sh
npm ci
npm run validate
npm run dev
```

`npm run validate` exécute les régressions, la compilation TeX, TypeScript, Motion Canvas, le polycopié et le site. Les tests mathématiques propres au TD complètent la relecture indépendante des solutions et vérifient notamment les domaines, les tableaux de signes et les familles trigonométriques.

Le workflow de publication à la racine du dépôt construit le modèle puis ce projet et publie son `dist/` dans `td3-fonctions/`. Les fichiers générés ne se modifient pas à la main.

## Sources et attribution

- F. Marotte, « Feuille TD no 3 », Mathématiques 1, 2026–2027 : énoncés fournis par l'enseignant.
- « Chapitre 3 – Limites et continuité », pages imprimées 29–42 : rappels et inspiration graphique.
- Modèle logiciel Atelier Présentations, licence MIT conservée dans `LICENSE`. Les droits sur les documents pédagogiques restent ceux de leurs auteurs.
