import type { Exercise, Step } from '../types';
const t = String.raw;
const s = (title: string, tex: string, why: string, phase?: string): Step => ({ title, tex, why, phase, statement: true });

export default {
  id: 5,
  title: 'Exercice 5 · Un quotient de logarithmes',
  short: 'Exercice 5',
  theme: 'Limites et logarithmes',
  level: 'Mathématiques 1',
  minutes: 18,
  objectives: ['Vérifier le domaine des logarithmes', 'Distinguer limites à gauche et à droite', 'Transformer un quotient à l’infini'],
  prerequisites: ['Continuité du logarithme', 'Signe du logarithme', 'Limites de quotients'],
  description: 'Étude de ln(1 + x) / ln x en 0, 1, 2 et +∞.',
  color: 'sage',
  activities: [
    {
      id: 'ex5-rappel', label: 'Rappels de cours', visual: 'logs',
      prompt: 'Préparer l’étude de f(x) = ln(1 + x) / ln x.',
      tex: t`f(x)=\frac{\ln(1+x)}{\ln x}`,
      result: t`D_f=]0;1[\cup]1;+\infty[`,
      note: 'Chapitre 3 : continuité p. 34, logarithme et limites latérales p. 35, quotients p. 37.',
      steps: [
        s('Définir la fonction et son domaine', t`f(x)=\frac{\ln(1+x)}{\ln x},\qquad D_f=]0;1[\cup]1;+\infty[`, 'Il faut x > 0 pour ln x, 1 + x > 0 pour ln(1 + x), et ln x ≠ 0. La première condition implique la seconde ; la troisième exclut x = 1.', 'Rappels'),
        s('Connaître le signe du logarithme', t`\ln x<0\ (0<x<1),\qquad\ln1=0,\qquad\ln x>0\ (x>1)`, 'Le logarithme est strictement croissant et s’annule en 1. Son signe change donc en 1.'),
        s('Connaître ses limites', t`\lim_{x\to0^+}\ln x=-\infty,\qquad\lim_{x\to+\infty}\ln x=+\infty`, 'Ces limites sont rappelées dans le cours p. 35. La fonction n’est définie que pour des réels strictement positifs.'),
        s('Comparer les limites latérales', t`\lim_{x\to a^-}f(x)\ne\lim_{x\to a^+}f(x)\quad\Longrightarrow\quad\lim_{x\to a}f(x)\text{ n’existe pas}`, 'Lorsque le domaine contient des points des deux côtés de a, deux limites latérales différentes empêchent l’existence d’une limite commune, même infinie.'),
        s('Transformer ln(1 + x) pour x positif', t`\ln(1+x)=\ln x+\ln\!\left(1+\frac1x\right)\quad(x>0)`, 'On factorise 1 + x = x(1 + 1/x). Les deux facteurs sont positifs, donc on peut utiliser le logarithme d’un produit.'),
      ],
    },
    {
      id: 'ex5-a', label: 'a · En zéro', visual: 'logs',
      prompt: 'Étudier la limite de f(x) = ln(1 + x) / ln x lorsque x tend vers 0.',
      tex: t`\lim_{x\to0^+}\frac{\ln(1+x)}{\ln x}`,
      result: t`0`, initialDomain: t`]0;1[\cup]1;+\infty[`,
      steps: [
        s('Lire la limite sur le domaine', t`\lim_{x\to0^+}\frac{\ln(1+x)}{\ln x}`, 'La feuille écrit x → 0. Puisque x doit être strictement positif, il s’agit nécessairement de la limite à droite de 0.', 'Exercice 5a'),
        s('Calculer les limites des deux termes', t`\ln(1+x)\longrightarrow0,\qquad\ln x\longrightarrow-\infty`, '1 + x tend vers 1 ; la continuité du logarithme en 1 donne ln(1 + x) → ln 1 = 0. La limite du dénominateur est une limite de référence.'),
        s('Passer au quotient', t`\frac{\ln(1+x)}{\ln x}=\ln(1+x)\times\frac1{\ln x}\longrightarrow0`, 'Le premier facteur tend vers 0, le second aussi. Le produit tend donc vers 0 ; ce cas n’est pas une forme indéterminée.'),
        s('Conclure et préciser le signe', t`\boxed{\lim_{x\to0^+}\frac{\ln(1+x)}{\ln x}=0}`, 'Pour 0 < x < 1, ln(1 + x) > 0 et ln x < 0. Le quotient s’approche de 0 par valeurs négatives.', 'Conclusion'),
      ],
    },
    {
      id: 'ex5-b', label: 'b · En un : deux côtés', visual: 'logs',
      prompt: 'Étudier la limite de f(x) = ln(1 + x) / ln x lorsque x tend vers 1.',
      tex: t`\lim_{x\to1}\frac{\ln(1+x)}{\ln x}`,
      result: t`\lim_{x\to1^-}f(x)=-\infty,\quad\lim_{x\to1^+}f(x)=+\infty`,
      initialDomain: t`]0;1[\cup]1;+\infty[`,
      steps: [
        s('Énoncé : un point exclu du domaine', t`\lim_{x\to1}\frac{\ln(1+x)}{\ln x}`, 'La fonction n’est pas définie en 1, mais elle l’est de chaque côté. On doit étudier séparément les approches par la gauche et par la droite.', 'Exercice 5b'),
        s('Le numérateur ne s’annule pas', t`\lim_{x\to1}\ln(1+x)=\ln2>0`, 'La continuité de ln en 2 donne un réel strictement positif. Il ne s’agit donc pas d’une forme 0/0.'),
        s('Approcher 1 par la gauche', t`x\to1^-\quad\Longrightarrow\quad\ln x\to0^-`, 'Pour 0 < x < 1, le logarithme est négatif. Sa continuité en 1 donne la limite 0, atteinte par valeurs négatives.', 'Limite à gauche'),
        s('Conclusion à gauche', t`\boxed{\lim_{x\to1^-}f(x)=-\infty}`, 'Un numérateur qui tend vers ln 2 > 0, divisé par un dénominateur qui tend vers 0⁻, donne −∞.'),
        s('Approcher 1 par la droite', t`x\to1^+\quad\Longrightarrow\quad\ln x\to0^+`, 'Pour x > 1, le logarithme est positif ; il tend vers 0 par valeurs positives.', 'Limite à droite'),
        s('Conclusion à droite', t`\boxed{\lim_{x\to1^+}f(x)=+\infty}`, 'Le numérateur tend toujours vers ln 2 > 0 ; cette fois, le dénominateur tend vers 0⁺.'),
        s('La limite en 1 n’existe pas', t`\boxed{\lim_{x\to1}f(x)\text{ n’existe pas}}`, 'Les limites latérales sont différentes : −∞ à gauche et +∞ à droite. Il n’existe donc aucune limite commune en 1 ; la droite x = 1 est une asymptote verticale.', 'Conclusion'),
      ],
    },
    {
      id: 'ex5-c', label: 'c · En deux : continuité', visual: 'logs',
      prompt: 'Étudier la limite de f(x) = ln(1 + x) / ln x lorsque x tend vers 2.',
      tex: t`\lim_{x\to2}\frac{\ln(1+x)}{\ln x}`,
      result: t`\frac{\ln3}{\ln2}`, initialDomain: t`]0;1[\cup]1;+\infty[`,
      steps: [
        s('Énoncé et continuité', t`\lim_{x\to2}\frac{\ln(1+x)}{\ln x}`, '2 appartient au domaine de la fonction. Les deux logarithmes sont continus en ce point et ln 2 ≠ 0.', 'Exercice 5c'),
        s('Évaluer les deux limites', t`\ln(1+x)\longrightarrow\ln3,\qquad\ln x\longrightarrow\ln2>0`, 'On applique la continuité du logarithme en 3 au numérateur et en 2 au dénominateur.'),
        s('Conclure par quotient', t`\boxed{\lim_{x\to2}\frac{\ln(1+x)}{\ln x}=\frac{\ln3}{\ln2}}`, 'Le dénominateur a une limite non nulle, donc la limite du quotient est le quotient des limites. On conserve cette valeur exacte.', 'Conclusion'),
      ],
    },
    {
      id: 'ex5-d', label: 'd · À l’infini', visual: 'logs',
      prompt: 'Étudier la limite de f(x) = ln(1 + x) / ln x lorsque x tend vers +∞.',
      tex: t`\lim_{x\to+\infty}\frac{\ln(1+x)}{\ln x}`,
      result: t`1`, initialDomain: t`]0;1[\cup]1;+\infty[`,
      steps: [
        s('Reconnaître la forme indéterminée', t`\lim_{x\to+\infty}\frac{\ln(1+x)}{\ln x}`, 'Les deux logarithmes tendent vers +∞. La forme ∞/∞ impose une transformation avant de conclure.', 'Exercice 5d'),
        s('Extraire ln x du numérateur', t`\ln(1+x)=\ln x+\ln\!\left(1+\frac1x\right)`, 'Pour x > 1, on factorise 1 + x = x(1 + 1/x), puis on applique le logarithme d’un produit positif.'),
        s('Séparer le terme principal et le reste', t`\frac{\ln(1+x)}{\ln x}=1+\frac{\ln(1+1/x)}{\ln x}\quad(x>1)`, 'On divise la somme par ln x, qui est strictement positif pour x > 1.'),
        s('Le reste tend vers zéro', t`\lim_{x\to+\infty}\frac{\ln(1+1/x)}{\ln x}=0`, 'Le numérateur tend vers ln 1 = 0 par continuité ; le dénominateur tend vers +∞. Leur quotient tend donc vers 0.'),
        s('Conclure', t`\boxed{\lim_{x\to+\infty}\frac{\ln(1+x)}{\ln x}=1}`, 'Le quotient s’écrit exactement 1 plus un terme qui tend vers 0. La droite y = 1 est une asymptote horizontale en +∞.', 'Conclusion'),
      ],
    },
  ],
} satisfies Exercise;
