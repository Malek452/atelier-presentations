import type { Exercise, Step } from '../types';
const t = String.raw;
const s = (title: string, tex: string, why: string, phase = 'Solution'): Step => ({
  title,
  tex,
  why,
  phase,
  statement: true,
});
export default {
  id: 1,
  title: 'Exercice 1 · Une fonction rationnelle',
  short: 'Exercice 1',
  theme: 'Continuité, infini et limites latérales',
  level: 'Mathématiques 1',
  minutes: 15,
  description: 'Étudier les limites de f(x) = (x + 7)/(x² − 1).',
  color: 'sage',
  objectives: ['Distinguer substitution et forme indéterminée', 'Comparer les limites latérales'],
  prerequisites: ['Factorisation', 'Signe d’un produit'],
  activities: [
    {
      id: 'ex1-rappel',
      label: 'Rappel · Quotients et signes',
      prompt: 'Quels outils utiliser pour une fonction rationnelle ?',
      tex: t`f(x)=\frac{x+7}{x^2-1}`,
      result: t`D_f=\mathbb R\setminus\{-1,1\}`,
      visual: 'algebra',
      steps: [
        s(
          'Commencer par le domaine',
          t`x^2-1=(x-1)(x+1)\quad;\quad D_f=\mathbb R\setminus\{-1,1\}`,
          'Un quotient est défini lorsque son dénominateur ne s’annule pas. Les deux valeurs interdites sont −1 et 1.',
          'Rappel',
        ),
        s(
          'En un point régulier : utiliser la continuité',
          t`Q(a)\ne0\quad\Longrightarrow\quad\lim_{x\to a}\frac{P(x)}{Q(x)}=\frac{P(a)}{Q(a)}`,
          'Les polynômes sont continus. Leur quotient est continu en tout point où le dénominateur est non nul.',
          'Rappel',
        ),
        s(
          'À l’infini : faire apparaître les termes dominants',
          t`\frac{x+7}{x^2-1}=\frac1x\,\frac{1+7/x}{1-1/x^2}\quad(x\ne0,\pm1)`,
          'On factorise x au numérateur et x² au dénominateur. Les fractions 7/x et 1/x² tendent vers zéro aux deux infinis.',
          'Rappel',
        ),
        s(
          'Près d’un zéro du dénominateur : séparer les côtés',
          t`\lim_{x\to a^-}f(x)\ne\lim_{x\to a^+}f(x)\quad\Longrightarrow\quad\lim_{x\to a}f(x)\text{ n’existe pas}`,
          'Lorsque le domaine permet d’approcher a des deux côtés, une limite en a exige que les deux limites latérales coïncident, même lorsqu’elles sont infinies.',
          'Rappel',
        ),
      ],
    },
    {
      id: 'ex1-a',
      label: 'a · Limite en 0',
      prompt: 'Calculer la limite de f en 0.',
      tex: t`\lim_{x\to0}\frac{x+7}{x^2-1}`,
      result: t`-7`,
      visual: 'substitution',
      initialDomain: t`\mathbb R\setminus\{-1,1\}`,
      steps: [
        s(
          'Vérifier que 0 appartient au domaine',
          t`0^2-1=-1\ne0`,
          'Le dénominateur est non nul en 0 : f est continue en ce point.',
          'Exercice 1a',
        ),
        s(
          'Substituer puis conclure',
          t`\lim_{x\to0}\frac{x+7}{x^2-1}=\frac{7}{-1}=-7`,
          'La continuité autorise la substitution directe. Le calcul numérique est effectué en une seule étape.',
        ),
      ],
    },
    {
      id: 'ex1-b',
      label: 'b · Limite en +∞',
      prompt: 'Calculer la limite de f en +∞.',
      tex: t`\lim_{x\to+\infty}\frac{x+7}{x^2-1}`,
      result: t`0`,
      visual: 'algebra',
      initialDomain: t`\mathbb R\setminus\{-1,1\}`,
      steps: [
        s(
          'Repérer la forme indéterminée',
          t`x+7\longrightarrow+\infty\quad;\quad x^2-1\longrightarrow+\infty`,
          'Le quotient « infini sur infini » ne permet pas de conclure. Il faut comparer les vitesses de croissance.',
          'Exercice 1b',
        ),
        s(
          'Factoriser les puissances dominantes',
          t`f(x)=\frac{x(1+7/x)}{x^2(1-1/x^2)}=\frac1x\,\frac{1+7/x}{1-1/x^2}`,
          'Pour x suffisamment grand, x est non nul. La simplification fait apparaître un facteur 1/x et un quotient qui tend vers 1.',
        ),
        s(
          'Passer à la limite',
          t`\lim_{x\to+\infty}f(x)=0\times\frac11=0`,
          'Le facteur 1/x tend vers zéro et le second facteur tend vers 1. Leur produit tend donc vers zéro.',
        ),
      ],
    },
    {
      id: 'ex1-c',
      label: 'c · Limite en −∞',
      prompt: 'Calculer la limite de f en −∞.',
      tex: t`\lim_{x\to-\infty}\frac{x+7}{x^2-1}`,
      result: t`0`,
      visual: 'algebra',
      initialDomain: t`\mathbb R\setminus\{-1,1\}`,
      steps: [
        s(
          'Réutiliser une égalité valable pour x négatif',
          t`f(x)=\frac1x\,\frac{1+7/x}{1-1/x^2}`,
          'La factorisation est valable pour tout x non nul du domaine, y compris pour x négatif.',
          'Exercice 1c',
        ),
        s(
          'Identifier les limites des facteurs',
          t`\frac1x\longrightarrow0\quad;\quad\frac{1+7/x}{1-1/x^2}\longrightarrow1\qquad(x\to-\infty)`,
          'À l’infini négatif aussi, 1/x, 7/x et 1/x² tendent vers zéro. Le signe de 1/x change, pas sa limite.',
        ),
        s(
          'Conclure',
          t`\lim_{x\to-\infty}f(x)=0`,
          'Le produit tend vers zéro. Pour x < −7, f(x) est négatif : la courbe se rapproche de zéro par valeurs négatives.',
        ),
      ],
    },
    {
      id: 'ex1-d',
      label: 'd · Limites à gauche et à droite de 1',
      prompt: 'La fonction f admet-elle une limite en 1 ?',
      tex: t`\lim_{x\to1}\frac{x+7}{x^2-1}`,
      result: t`\lim_{x\to1^-}f(x)=-\infty\quad;\quad\lim_{x\to1^+}f(x)=+\infty`,
      visual: 'signs',
      initialDomain: t`\mathbb R\setminus\{-1,1\}`,
      steps: [
        s(
          'Isoler le facteur qui s’annule',
          t`f(x)=\frac{x+7}{x+1}\,\frac1{x-1}\quad;\quad\frac{x+7}{x+1}\longrightarrow4`,
          'Au voisinage de 1, le premier facteur est positif et tend vers 4. Le comportement dépend donc de 1/(x − 1).',
          'Exercice 1d',
        ),
        s(
          'Approcher 1 par la gauche',
          t`x\to1^-\quad:\quad\frac1{x-1}\to-\infty\quad\Longrightarrow\quad f(x)\to-\infty`,
          'À gauche de 1, x − 1 est négatif et tend vers zéro. Son inverse tend vers −∞ ; le facteur positif tendant vers 4 conserve ce signe.',
        ),
        s(
          'Approcher 1 par la droite',
          t`x\to1^+\quad:\quad\frac1{x-1}\to+\infty\quad\Longrightarrow\quad f(x)\to+\infty`,
          'À droite de 1, x − 1 est positif et tend vers zéro. Son inverse tend vers +∞.',
        ),
        s(
          'Comparer les deux côtés',
          t`\lim_{x\to1^-}f(x)=-\infty\ne+\infty=\lim_{x\to1^+}f(x)`,
          'Les deux limites latérales sont différentes : f n’admet pas de limite en 1. La droite x = 1 est néanmoins une asymptote verticale.',
        ),
      ],
    },
  ],
} satisfies Exercise;
