import type { Step } from './types';

export type ModelPlotKind = NonNullable<Step['plot']>;
export const productionRatio = (t: number) => (t <= 3 ? t : t <= 5 ? 3 : t - 2);
export const bacteriaPopulation = (t: number) => 100 * 3 ** (t / 3);
export const bacteriaThresholdTime = (3 * Math.log(500)) / Math.log(3);

export const modelPlotDescriptions: Record<ModelPlotKind, string> = {
  production:
    'Production cumulée normalisée N(t)/r, avec r > 0 constant. Les segments relient (0 ; 0), (3 ; 3), (5 ; 3) et (11 ; 9). Le temps t est en heures depuis 7 h ; N/r est en heures. La pause de 10 h à 12 h correspond au plateau entre t = 3 et t = 5. Le cumul ne diminue pas et atteint 9r pièces à 18 h.',
  bacteria:
    'Modèle exponentiel continu N(t) = 100 × 3^(t/3), t en heures, N en bactéries. La courbe croissante passe par (0 ; 100), (3 ; 300), (6 ; 900), (9 ; 2 700), (12 ; 8 100), (15 ; 24 300) et (18 ; 72 900). À 20 h, elle vaut environ 151 638. Le seuil de 50 000 bactéries est atteint à t = 3 ln(500)/ln(3), soit environ 16,97 h.',
};

export function modelPlotPoints(kind: ModelPlotKind): [number, number][] {
  return kind === 'production'
    ? [0, 3, 5, 11].map((t) => [t, productionRatio(t)])
    : Array.from({ length: 201 }, (_, i) => [i / 10, bacteriaPopulation(i / 10)]);
}
