# TD5 — Limites et continuité

Présentation du corrigé des **5 exercices et 32 limites** de la feuille TD no 5, EC 101-1-17 Mathématiques 1, F. Marotte, 2026-2027.

Chaque exercice commence par un rappel des outils utiles, puis présente les solutions détaillées : domaine, choix de méthode, transformations justifiées et conclusion. Les limites à gauche et à droite sont distinguées. Les calculs élémentaires sont regroupés ; aucune règle de l’Hôpital, aucun développement limité ni dérivation ne sont utilisés.

## Consulter

- [Présentation publique pour les étudiants](https://malek452.github.io/atelier-presentations/td5-limites/)
- [Corrigé imprimable](https://malek452.github.io/atelier-presentations/td5-limites/handout/)

La publication est assurée par le workflow Pages du dépôt parent, qui valide et construit ce dossier à chaque modification sur `main`.

La version prête à projeter est dans `dist/` après compilation. Depuis ce dossier de projet :

```sh
python3 -m http.server 8000 --directory dist
```

Ouvrir http://localhost:8000. Le corrigé imprimable est accessible à http://localhost:8000/handout/. Utiliser l’impression du navigateur pour en faire un PDF.

Navigation : sélectionner un exercice, puis « Rappel / Question ». Les flèches ← et → avancent dans les étapes ; les chevrons du haut changent de question. Lecture automatique, ralenti, rejeu, plein écran et réduction des animations sont disponibles.

## Modifier ou reconstruire

Node.js **24** est requis.

```sh
npm ci
npm run validate
npm run dev
```

- `src/content/exercice1.ts` à `exercice5.ts` : rappels, énoncés, solutions et justifications.
- `presentation.config.ts` : titre et navigation.
- `src/theme.ts` : palette du tableau.
- `docs/AUTHORING.md` : format du contenu.
- `tests/td5.test.ts` : vérifications propres au TD.

`npm run validate` vérifie les formules, les références d’animation, le contenu et les interactions, puis construit `dist/` et le corrigé imprimable.

## Sources et méthodes

Documents fournis : **TD5.pdf** et **Chapitre 3 - Limites et continuité.pdf**. Les références de pages dans les rappels désignent la pagination imprimée du chapitre, notamment p. 33–34 (limites latérales et continuité), p. 37–38 (quotients et composition), p. 39–40 (termes dominants), p. 40 (croissances comparées).

Le moteur provient de [Malek452/atelier-presentations](https://github.com/Malek452/atelier-presentations), version `d689e8eb005eef008a90efcafe3fbd34a18eb7a1` : React, TypeScript, Motion Canvas, MathJax et KaTeX. Le thème clair reprend la variante `presentations/td3-fonctions` : fond clair, texte bleu foncé et accents contrastés pour la projection. Les exemples d’origine restent disponibles comme références mais ne font pas partie du TD affiché. Licence du moteur : MIT, voir `LICENSE` et `THIRD-PARTY-NOTICES.md`.
