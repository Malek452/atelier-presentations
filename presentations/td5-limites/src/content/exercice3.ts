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
  id: 3,
  title: 'Exercice 3 · Limites avec des racines',
  short: 'Exercice 3',
  theme: 'Racines, conjugaison et valeur absolue',
  level: 'Mathématiques 1',
  minutes: 30,
  description: 'Six limites pour choisir entre continuité, factorisation et quantité conjuguée.',
  color: 'sage',
  objectives: [
    'Utiliser une quantité conjuguée',
    'Ne pas confondre √(x²) et x',
    'Comparer les limites latérales',
  ],
  prerequisites: ['Racine carrée', 'Identités remarquables'],
  activities: [
    {
      id: 'ex3-rappel',
      label: 'Rappel · Racines et valeur absolue',
      prompt: 'Quelles propriétés utiliser avec des racines carrées ?',
      tex: t`\sqrt{x^2}=|x|`,
      result: t`\sqrt{x^2}=|x|`,
      visual: 'algebra',
      steps: [
        s(
          'La racine d’un carré est une valeur absolue',
          t`\sqrt{x^2}=|x|=\begin{cases}x&x\ge0,\\-x&x<0.\end{cases}`,
          'Une racine carrée est toujours positive ou nulle. On ne peut remplacer √(x²) par x que lorsqu’on sait que x est positif ou nul.',
          'Rappel',
        ),
        s(
          'Extraire un carré d’une racine',
          t`\sqrt{x^2 A(x)}=|x|\sqrt{A(x)}\qquad\bigl(A(x)\ge0\bigr)`,
          'La propriété √(ab) = √a √b est valable pour des facteurs positifs ou nuls. Le facteur extrait est donc |x|, pas toujours x.',
          'Rappel',
        ),
        s(
          'Éliminer une différence de racines',
          t`\sqrt A-\sqrt B=\frac{A-B}{\sqrt A+\sqrt B}`,
          'Pour A et B positifs ou nuls et une somme de racines non nulle, la quantité conjuguée transforme la différence en quotient. C’est utile pour les formes ∞ − ∞ et 0/0.',
          'Rappel',
        ),
        s(
          'Tester la continuité avant de transformer',
          t`u(x)\to a\ge0\quad\Longrightarrow\quad\sqrt{u(x)}\to\sqrt a`,
          'La racine carrée est continue sur [0, +∞[. Pour un quotient, la substitution est possible si la limite du dénominateur est non nulle.',
          'Rappel',
        ),
      ],
    },
    {
      id: 'ex3-a',
      label: 'a · Extraire x² sous la racine',
      prompt: 'Calculer la limite en +∞.',
      tex: t`\lim_{x\to+\infty}\frac{\sqrt{9x^2+7}}{3x-5}`,
      result: t`1`,
      visual: 'algebra',
      initialDomain: t`\mathbb R\setminus\{5/3\}`,
      steps: [
        s(
          'Domaine et forme à transformer',
          t`F(x)=\frac{\sqrt{9x^2+7}}{3x-5}\quad;\quad D_F=\mathbb R\setminus\{5/3\}`,
          'Le radicand 9x² + 7 est strictement positif pour tout réel. Seul le dénominateur impose une exclusion. À +∞, on rencontre une forme ∞/∞.',
          'Exercice 3a',
        ),
        s(
          'Extraire le carré pour x positif',
          t`\sqrt{9x^2+7}=\sqrt{x^2(9+7/x^2)}=x\sqrt{9+7/x^2}\qquad(x>0)`,
          'À +∞, x est finalement positif : |x| = x. On peut donc extraire x de la racine après avoir factorisé x².',
        ),
        s(
          'Simplifier le facteur dominant',
          t`F(x)=\frac{x\sqrt{9+7/x^2}}{x(3-5/x)}=\frac{\sqrt{9+7/x^2}}{3-5/x}`,
          'Pour x suffisamment grand, x est non nul. On simplifie le facteur commun x sans modifier le quotient.',
        ),
        s(
          'Passer à la limite',
          t`\lim_{x\to+\infty}F(x)=\frac{\sqrt9}{3}=1`,
          'Les fractions 7/x² et 5/x tendent vers zéro ; le dénominateur tend vers 3, qui est non nul.',
        ),
      ],
    },
    {
      id: 'ex3-b',
      label: 'b · Différence de deux racines',
      prompt: 'Calculer la limite de √(1 + x) − √(x − 1) en +∞.',
      tex: t`\lim_{x\to+\infty}\bigl(\sqrt{1+x}-\sqrt{x-1}\bigr)`,
      result: t`0`,
      visual: 'algebra',
      initialDomain: t`[1,+\infty[`,
      steps: [
        s(
          'Domaine et forme indéterminée',
          t`F(x)=\sqrt{x+1}-\sqrt{x-1}\quad;\quad D_F=[1,+\infty[`,
          'Les deux racines existent si x ≥ 1. Chacune tend vers +∞ ; la forme ∞ − ∞ ne donne pas de limite directement.',
          'Exercice 3b',
        ),
        s(
          'Utiliser la quantité conjuguée',
          t`F(x)=\frac{(x+1)-(x-1)}{\sqrt{x+1}+\sqrt{x-1}}=\frac2{\sqrt{x+1}+\sqrt{x-1}}`,
          'La somme des racines est strictement positive sur le domaine. Le produit des expressions conjuguées vaut (x + 1) − (x − 1) = 2.',
        ),
        s(
          'Conclure',
          t`\lim_{x\to+\infty}\bigl(\sqrt{x+1}-\sqrt{x-1}\bigr)=0`,
          'Le dénominateur tend vers +∞ et le numérateur reste égal à 2. Le quotient tend donc vers zéro par valeurs positives.',
        ),
      ],
    },
    {
      id: 'ex3-c',
      label: 'c · Comparer x et √x',
      prompt: 'Calculer la limite en +∞.',
      tex: t`\lim_{x\to+\infty}\frac{x+\sqrt x}{x-\sqrt x}`,
      result: t`1`,
      visual: 'algebra',
      initialDomain: t`]0,1[\,\cup\,]1,+\infty[`,
      steps: [
        s(
          'Déterminer les valeurs interdites',
          t`F(x)=\frac{x+\sqrt x}{x-\sqrt x}\quad;\quad x-\sqrt x=\sqrt x(\sqrt x-1)`,
          'La racine impose x ≥ 0. Le dénominateur s’annule exactement pour x = 0 ou x = 1. Le domaine est donc ]0, 1[ ∪ ]1, +∞[.',
          'Exercice 3c',
        ),
        s(
          'Diviser le numérateur et le dénominateur par x',
          t`F(x)=\frac{1+1/\sqrt x}{1-1/\sqrt x}\qquad(x>0,\ x\ne1)`,
          'Sur le domaine, x est positif et non nul. L’égalité √x/x = 1/√x permet de faire apparaître des termes tendant vers zéro.',
        ),
        s(
          'Conclure',
          t`\lim_{x\to+\infty}F(x)=\frac{1+0}{1-0}=1`,
          'La quantité 1/√x tend vers zéro. Le dénominateur de la forme transformée tend vers 1, donc on peut appliquer la règle du quotient.',
        ),
      ],
    },
    {
      id: 'ex3-d',
      label: 'd · Une substitution suffit',
      prompt: 'Calculer la limite en 0.',
      tex: t`\lim_{x\to0}\frac{\sqrt{4x^2+1}}{2x+3}`,
      result: t`\frac13`,
      visual: 'substitution',
      initialDomain: t`\mathbb R\setminus\{-3/2\}`,
      steps: [
        s(
          'Vérifier les conditions de continuité',
          t`F(x)=\frac{\sqrt{4x^2+1}}{2x+3}\quad;\quad4x^2+1>0\quad;\quad2\cdot0+3\ne0`,
          'Le radicand est strictement positif pour tout réel. Le domaine exclut seulement −3/2 ; en particulier, la fonction est continue en 0.',
          'Exercice 3d',
        ),
        s(
          'Substituer directement',
          t`\lim_{x\to0}F(x)=\frac{\sqrt{4\cdot0^2+1}}{2\cdot0+3}=\frac13`,
          'Aucune forme indéterminée n’apparaît. La continuité suffit : il est inutile de multiplier par une quantité conjuguée.',
        ),
      ],
    },
    {
      id: 'ex3-e',
      label: 'e · Lever une forme 0/0',
      prompt: 'Calculer la limite en 0.',
      tex: t`\lim_{x\to0}\frac{\sqrt{1+x}-\sqrt{1-x}}x`,
      result: t`1`,
      visual: 'algebra',
      initialDomain: t`[-1,1]\setminus\{0\}`,
      steps: [
        s(
          'Domaine et diagnostic',
          t`F(x)=\frac{\sqrt{1+x}-\sqrt{1-x}}x\quad;\quad D_F=[-1,1]\setminus\{0\}`,
          'Les racines imposent −1 ≤ x ≤ 1 et le dénominateur impose x ≠ 0. En 0, numérateur et dénominateur tendent vers zéro : la forme est indéterminée.',
          'Exercice 3e',
        ),
        s(
          'Multiplier par la somme des racines',
          t`F(x)=\frac{(1+x)-(1-x)}{x\bigl(\sqrt{1+x}+\sqrt{1-x}\bigr)}`,
          'La somme de racines est strictement positive sur [−1, 1]. La multiplication par la quantité conjuguée est donc légitime.',
        ),
        s(
          'Simplifier le facteur x',
          t`F(x)=\frac{2x}{x\bigl(\sqrt{1+x}+\sqrt{1-x}\bigr)}=\frac2{\sqrt{1+x}+\sqrt{1-x}}`,
          'Le numérateur se réduit à 2x. On simplifie par x, qui est non nul aux points où l’on étudie la fonction.',
        ),
        s(
          'Conclure des deux côtés',
          t`\lim_{x\to0}F(x)=\frac2{1+1}=1`,
          'L’expression transformée est continue en 0 et son dénominateur y vaut 2. La même limite vaut à gauche et à droite.',
        ),
      ],
    },
    {
      id: 'ex3-f',
      label: 'f · Le piège de √(x²)',
      prompt: 'La limite en 0 existe-t-elle ?',
      tex: t`\lim_{x\to0}\frac{\sqrt{4x^2+x^3}}{2x+x^2}`,
      result: t`\lim_{x\to0^-}F(x)=-1\quad;\quad\lim_{x\to0^+}F(x)=1`,
      visual: 'algebra',
      initialDomain: t`[-4,+\infty[\setminus\{-2,0\}`,
      steps: [
        s(
          'Déterminer le domaine',
          t`F(x)=\frac{\sqrt{x^2(4+x)}}{x(2+x)}\quad;\quad D_F=[-4,+\infty[\setminus\{-2,0\}`,
          'Le radicand x²(4 + x) est positif ou nul exactement pour x ≥ −4. Le dénominateur exclut −2 et 0. On peut approcher 0 des deux côtés.',
          'Exercice 3f',
        ),
        s(
          'Extraire le carré sans perdre le signe',
          t`\sqrt{x^2(4+x)}=|x|\sqrt{4+x}`,
          'Puisque 4 + x ≥ 0 sur le domaine, on peut séparer les racines. Il faut conserver |x| : pour x négatif, √(x²) vaut −x.',
        ),
        s(
          'Isoler le facteur de signe',
          t`F(x)=\frac{|x|}{x}\,\frac{\sqrt{4+x}}{2+x}\quad;\quad\frac{\sqrt{4+x}}{2+x}\longrightarrow1`,
          'Le second facteur est continu en 0 et tend vers 2/2 = 1. Le premier vaut −1 à gauche de 0 et 1 à droite.',
        ),
        s(
          'À droite de 0 : |x| = x',
          t`x>0\quad\Longrightarrow\quad F(x)=\frac{\sqrt{4+x}}{2+x}\quad\Longrightarrow\quad\lim_{x\to0^+}F(x)=1`,
          'Pour x positif, le rapport |x|/x vaut 1. La limite à droite est donc celle du second facteur.',
        ),
        s(
          'À gauche de 0 : |x| = −x',
          t`x<0\quad\Longrightarrow\quad F(x)=-\frac{\sqrt{4+x}}{2+x}\quad\Longrightarrow\quad\lim_{x\to0^-}F(x)=-1`,
          'Pour x négatif, le rapport |x|/x vaut −1. Ce signe doit être conservé quand on passe à la limite.',
        ),
        s(
          'La limite en 0 n’existe pas',
          t`\lim_{x\to0^-}F(x)=-1\ne1=\lim_{x\to0^+}F(x)`,
          'Les deux limites latérales sont finies mais différentes. Il n’existe donc pas de limite en 0 ; remplacer √(x²) par x aurait masqué ce résultat.',
        ),
      ],
    },
  ],
} satisfies Exercise;
