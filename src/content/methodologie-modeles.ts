import type { Exercise } from '../types';
import { textStep } from './define';

const t = String.raw;

export default {
  id: 1,
  title: 'Méthodologie des modèles',
  short: 'Méthode',
  theme: 'Modélisation',
  level: 'Fondations',
  minutes: 15,
  objectives: [
    'Distinguer une variation additive d’une variation multiplicative',
    'Définir les paramètres, les unités et les hypothèses du modèle',
    'Calculer une quantité ou la date à laquelle elle est atteinte',
  ],
  prerequisites: ['Fonctions affines', 'Puissances', 'Logarithme népérien'],
  description:
    'Une méthode transférable aux exercices 2 et 5 : choisir un modèle, déterminer ses paramètres, résoudre puis vérifier.',
  color: 'sage',
  activities: [
    {
      id: 'choisir-modele',
      label: '1. Choisir le modèle',
      prompt: 'Comment reconnaître un modèle affine ou exponentiel dans un énoncé ?',
      tex: t`N(t)=N_0+rt\qquad N(t)=N_0q^{t/T}`,
      result: t`N(t)=N_0+rt\quad\text{ou}\quad N(t)=N_0q^{t/T}`,
      visual: 'algebra',
      steps: [
        textStep(
          'Définir ce que l’on mesure',
          [
            'Nommer la quantité N(t) et son unité.',
            'Choisir l’origine t = 0, l’unité de temps et l’intervalle étudié.',
          ],
          'Une heure de la journée et une durée écoulée ne désignent pas la même variable. Ce choix doit précéder tout calcul.',
          'Lire et définir',
        ),
        textStep(
          'Repérer une quantité ajoutée',
          [
            'Pendant des durées égales, la même quantité est ajoutée ou retirée.',
            'On choisit un modèle affine à variation constante.',
          ],
          'Une variation constante par unité de temps correspond à une pente constante sur l’intervalle étudié.',
          'Reconnaître une évolution additive',
        ),
        {
          title: 'Écrire le modèle affine',
          tex: t`N(t)=N_0+rt`,
          why: 'N₀ est la valeur à t = 0. La pente r est la variation par unité de temps ; rt est donc la variation après une durée t.',
          focus: t`rt`,
          phase: 'Modèle affine',
          statement: true,
        },
        textStep(
          'Préciser le mot « linéaire »',
          [
            'Si la valeur initiale est nulle, le modèle s’écrit N(t) = rt : il est linéaire.',
            'Avec une valeur initiale non nulle, le terme exact est affine.',
          ],
          'Une fonction linéaire est un cas particulier de fonction affine : sa droite passe par l’origine.',
          'Vocabulaire',
        ),
        textStep(
          'Repérer un facteur multiplicatif',
          [
            'Pendant des durées égales, la quantité est multipliée par le même facteur.',
            'On choisit un modèle exponentiel continu à taux constant.',
          ],
          'Le facteur répété conduit à une puissance. L’hypothèse continue précise l’évolution entre deux observations.',
          'Reconnaître une évolution multiplicative',
        ),
        {
          title: 'Écrire le modèle exponentiel',
          tex: t`N(t)=N_0q^{t/T}`,
          why: 'N₀ > 0 est la valeur initiale, q > 0 le facteur appliqué pendant une période T > 0. Le quotient t/T compte les périodes écoulées.',
          focus: t`t/T`,
          phase: 'Modèle exponentiel',
          statement: true,
        },
        textStep(
          'Adapter le modèle aux changements',
          [
            'Une pause ou un changement de cadence peut imposer plusieurs morceaux.',
            'Une donnée manquante reste un paramètre : on annonce les hypothèses choisies.',
          ],
          'L’énoncé peut autoriser plusieurs modèles. Dans l’exercice 2, la cadence n’est pas donnée et la pause sépare les périodes de production.',
          'Respecter l’énoncé',
        ),
      ],
    },
    {
      id: 'parametres-modele',
      label: '2. Déterminer les paramètres',
      prompt: 'Identifier la valeur initiale, la cadence ou le facteur et sa période.',
      tex: t`N_0=N(0)`,
      result: t`N(t)=N_0+rt\qquad N(t)=N_0q^{t/T}`,
      visual: 'substitution',
      steps: [
        {
          title: 'Lire la valeur initiale',
          tex: t`N_0=N(0)`,
          why: 'La valeur initiale est celle à l’origine choisie pour le temps. Elle n’est nulle que si l’énoncé ou le choix du comptage le justifie.',
          phase: 'Valeur initiale',
          statement: true,
        },
        {
          title: 'Déterminer une pente constante',
          tex: t`r=\frac{N(t_2)-N(t_1)}{t_2-t_1}`,
          why: 'Dans un modèle affine, la pente est la variation de la quantité divisée par la durée correspondante. Il faut t₂ ≠ t₁ et les deux observations doivent appartenir au même morceau affine.',
          focus: t`\frac{N(t_2)-N(t_1)}{t_2-t_1}`,
          phase: 'Paramètre affine',
          statement: true,
        },
        textStep(
          'Lire le facteur et sa période',
          [
            '« Tripler toutes les trois heures » donne q = 3 et T = 3 h.',
            'Le facteur q n’a pas d’unité. Les durées t et T doivent avoir la même unité.',
          ],
          'Le facteur multiplicatif et la durée entre deux multiplications sont deux paramètres différents : aucun ne remplace l’autre.',
          'Paramètres exponentiels',
        ),
        {
          title: 'Compter les périodes écoulées',
          tex: t`N(t)=N_0q^{t/T}`,
          why: 'On divise la durée écoulée t par la durée T d’une période. Dans le modèle continu, t/T peut ne pas être entier ; q > 0 permet cette puissance réelle.',
          focus: t`t/T`,
          phase: 'Construire l’exposant',
          statement: true,
        },
        {
          title: 'Reconnaître la forme avec exp',
          tex: t`N(t)=N_0e^{kt},\qquad k=\frac{\ln q}{T}`,
          why: 'Pour q > 0, l’identité qᵘ = exp(u ln q) donne cette même fonction. Le coefficient k est un taux continu ; si t est en heures, k est en h⁻¹.',
          focus: t`\frac{\ln q}{T}`,
          phase: 'Deux écritures du même modèle',
          statement: true,
        },
        textStep(
          'Vérifier le sens de variation',
          [
            'Modèle affine : r positif donne une croissance ; r négatif, une décroissance ; r nul, une constante.',
            'Avec N₀ > 0 : q > 1 donne une croissance ; 0 < q < 1, une décroissance ; q = 1, une constante.',
          ],
          'Ces signes doivent correspondre au phénomène décrit. On conserve aussi le domaine physique : une production ou une population ne peut pas être négative.',
          'Premier contrôle',
        ),
      ],
    },
    {
      id: 'resoudre-modele',
      label: '3. Calculer et vérifier',
      prompt: 'Calculer une quantité, puis trouver la date à laquelle une valeur S est atteinte.',
      tex: t`N(t)=S`,
      result: t`t=\frac{S-N_0}{r}\qquad t=\frac{T\ln(S/N_0)}{\ln q}`,
      visual: 'logs',
      steps: [
        textStep(
          'Distinguer les deux questions',
          [
            'Pour connaître une quantité à une date donnée, remplacer t dans la formule.',
            'Pour connaître la date où la quantité vaut S, résoudre N(t) = S.',
          ],
          'L’inconnue change selon la question : on évalue une fonction dans le premier cas et on résout une équation dans le second.',
          'Identifier l’inconnue',
        ),
        {
          title: 'Poser l’équation affine',
          tex: t`N_0+rt=S`,
          why: 'On cherche la date où la quantité vaut S. On suppose ici r ≠ 0 pour pouvoir isoler t en divisant par r.',
          phase: 'Date dans un modèle affine',
          statement: true,
        },
        {
          title: 'Soustraire la valeur initiale',
          tex: t`rt=S-N_0`,
          why: 'On soustrait N₀ aux deux membres. Cette opération conserve exactement les solutions de l’équation.',
          focus: t`S-N_0`,
        },
        {
          title: 'Diviser par la pente non nulle',
          tex: t`t=\frac{S-N_0}{r}`,
          why: 'La pente r est supposée non nulle. On divise les deux membres par r pour obtenir la date candidate.',
          focus: t`\frac{S-N_0}{r}`,
        },
        {
          title: 'Poser l’équation exponentielle',
          tex: t`N_0q^{t/T}=S`,
          why: 'On suppose N₀ > 0, S > 0, T > 0, q > 0 et q ≠ 1. Ces conditions autorisent les logarithmes et la division finale par ln q.',
          phase: 'Date dans un modèle exponentiel',
          statement: true,
        },
        {
          title: 'Isoler la puissance',
          tex: t`q^{t/T}=\frac{S}{N_0}`,
          why: 'On divise les deux membres par N₀, qui est strictement positif et donc non nul.',
          focus: t`\frac{S}{N_0}`,
        },
        {
          title: 'Appliquer le logarithme',
          tex: t`\ln\left(q^{t/T}\right)=\ln\left(\frac{S}{N_0}\right)`,
          why: 'Les deux membres sont positifs. Le logarithme est injectif sur les réels strictement positifs : l’équation obtenue a les mêmes solutions.',
          focus: t`\ln\left(q^{t/T}\right)`,
        },
        {
          title: 'Faire apparaître l’exposant',
          tex: t`\frac{t}{T}\ln q=\ln\left(\frac{S}{N_0}\right)`,
          why: 'Pour une base q > 0 et tout exposant réel u, ln(qᵘ) = u ln q. Ici, u = t/T.',
          focus: t`\frac{t}{T}\ln q`,
        },
        {
          title: 'Multiplier par la période',
          tex: t`t\ln q=T\ln\left(\frac{S}{N_0}\right)`,
          why: 'On multiplie les deux membres par T, qui est strictement positif. Le facteur T au dénominateur se simplifie.',
          focus: t`T\ln\left(\frac{S}{N_0}\right)`,
        },
        {
          title: 'Diviser par le logarithme du facteur',
          tex: t`t=\frac{T\ln(S/N_0)}{\ln q}`,
          why: 'Comme q ≠ 1, ln q est non nul. La division donne la date candidate dans la même unité que T.',
          focus: t`\frac{T\ln(S/N_0)}{\ln q}`,
        },
        textStep(
          'Traiter un modèle constant',
          [
            'Si r = 0 ou q = 1, la quantité reste égale à sa valeur initiale.',
            'S égale cette valeur : toute date du domaine convient. Sinon : aucune date ne convient.',
          ],
          'Ces cas ont été exclus des divisions précédentes. Les examiner séparément évite une division par zéro.',
          'Cas particulier',
        ),
        textStep(
          'Contrôler avant de conclure',
          [
            'Garder seulement les dates du domaine et vérifier la valeur dans la formule initiale.',
            'Contrôler les unités, puis arrondir à la fin. Pour une croissance continue, un seuil supérieur à la valeur initiale est franchi après la date d’égalité.',
          ],
          'Une solution algébrique hors de l’intervalle étudié ne répond pas au problème. Un modèle par morceaux exige aussi de vérifier le morceau utilisé.',
          'Vérifier et interpréter',
        ),
      ],
    },
  ],
} satisfies Exercise;
