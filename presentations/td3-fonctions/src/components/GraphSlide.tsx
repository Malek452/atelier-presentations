import type { Step } from '../types';
import { theme } from '../theme';
import { MathView } from './Math';

export const graphDescriptions = {
  log: 'La courbe y = ln(x) est définie pour x > 0, strictement croissante et passe par (1 ; 0) et (e ; 1). Les pointillés repèrent les coordonnées, sans prouver la croissance.',
  exp: 'La courbe y = exp(x) est strictement croissante sur R, toujours au-dessus de l’axe horizontal et passe par (0 ; 1) et (1 ; e).',
  'cosine-inequality': 'Sur le cercle unité, le cosinus est l’abscisse. L’arc bleu à gauche de la droite d’abscisse racine de 3 sur 2 correspond à pi sur 6 < x < 11 pi sur 6. Les deux cercles vides excluent les bornes.',
};

const ink = theme.mathInk, blue = theme.second, rust = theme.active;
const pts = (fn: (x: number) => number, a: number, b: number, X: (x: number) => number, Y: (y: number) => number) =>
  Array.from({ length: 181 }, (_, i) => {
    const x = a + ((b - a) * i) / 180;
    return `${i ? 'L' : 'M'}${X(x).toFixed(2)},${Y(fn(x)).toFixed(2)}`;
  }).join(' ');

function ReferenceCurve({ kind }: { kind: 'log' | 'exp' }) {
  const log = kind === 'log';
  const X = (x: number) => log ? 115 + x * 86 : 345 + x * 107;
  const Y = (y: number) => log ? 210 - y * 58 : 330 - y * 43;
  const axisY = Y(0), axisX = X(0);
  const path = log ? pts(Math.log, .075, 6.3, X, Y) : pts(Math.exp, -2.9, 1.98, X, Y);
  const pX = log ? Math.E : 1, pY = log ? 1 : Math.E;
  return <svg viewBox="0 0 760 400" role="img" aria-label={graphDescriptions[kind]}>
    <title>{log ? 'Courbe du logarithme népérien' : 'Courbe de la fonction exponentielle'}</title>
    <g stroke={ink} strokeWidth="2.5" fill="none">
      <path d={`M45,${axisY} H715 m-10,-6 10,6 -10,6`} />
      <path d={`M${axisX},370 V25 m-6,10 6,-10 6,10`} />
    </g>
    <g stroke={theme.muted} strokeWidth="2" strokeDasharray="7 7" fill="none">
      <path d={`M${X(pX)},${axisY} V${Y(pY)} H${axisX}`} />
    </g>
    <path d={path} stroke={blue} strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <g fill={ink} fontSize="25">
      <text x="725" y={axisY + 8}>x</text><text x={axisX + 15} y="31">y</text>
      <text x={axisX - 27} y={axisY + 28}>0</text>
      {log ? <>
        <text x={X(1) - 6} y={axisY + 30}>1</text>
        <text x={X(Math.E) - 6} y={axisY + 30}>e</text>
        <text x={axisX - 27} y={Y(1) + 7}>1</text>
        <text x={X(5.2)} y={Y(Math.log(5.2)) - 20} fill={blue}>ln(x)</text>
      </> : <>
        <text x={X(1) - 6} y={axisY + 30}>1</text>
        <text x={axisX - 27} y={Y(1) + 7}>1</text>
        <text x={axisX - 27} y={Y(Math.E) + 7}>e</text>
        <text x={X(1.98) + 18} y={Y(Math.exp(1.98)) + 8} fill={blue}>exp(x)</text>
      </>}
    </g>
    <g fill={rust} stroke={theme.board} strokeWidth="2">
      <circle cx={X(log ? 1 : 0)} cy={Y(log ? 0 : 1)} r="6.5" />
      <circle cx={X(pX)} cy={Y(pY)} r="6.5" />
    </g>
  </svg>;
}

function CosineInequality() {
  const cx = 255, cy = 200, r = 140, cut = cx + r * Math.sqrt(3) / 2;
  const upper = cy - r / 2, lower = cy + r / 2;
  return <svg viewBox="0 0 760 400" role="img" aria-label={graphDescriptions['cosine-inequality']}>
    <title>Cosinus inférieur strictement à racine de trois sur deux</title>
    <g stroke={ink} strokeWidth="2" fill="none">
      <path d="M70,200 H440 m-10,-6 10,6 -10,6" />
      <path d="M255,380 V20 m-6,10 6,-10 6,10" />
      <circle cx={cx} cy={cy} r={r} stroke={theme.muted} strokeWidth="3" />
    </g>
    <path d={`M${cut},${upper} A${r},${r} 0 1 0 ${cut},${lower}`} fill="none" stroke={blue} strokeWidth="10" />
    <path d={`M${cut},45 V355`} stroke={rust} strokeWidth="3" strokeDasharray="8 6" />
    <g fill={theme.board} stroke={blue} strokeWidth="4">
      <circle cx={cut} cy={upper} r="7" /><circle cx={cut} cy={lower} r="7" />
    </g>
    <g fill={ink} fontSize="25">
      <text x="229" y="228">O</text><text x="410" y="230">1</text>
      <text x="76" y="230">−1</text><text x="269" y="61">1</text><text x="269" y="356">−1</text>
      <text x={cut + 18} y={upper - 8}>π/6</text><text x={cut + 18} y={lower + 28}>11π/6</text>
      <text x="490" y="177" fill={rust}>Abscisse = √3/2</text>
      <text x="490" y="219" fill={blue}>Arc solution</text>
      <text x="490" y="259">Bornes exclues</text>
    </g>
    <path d="M457,211 H481" stroke={blue} strokeWidth="8" fill="none" />
  </svg>;
}

export function CircleDiagram({ circle }: { circle: NonNullable<Step['circle']> }) {
  const cx=285, cy=200, r=140, px=cx+r*Math.cos(circle.angle), py=cy-r*Math.sin(circle.angle);
  const isCos=circle.axis==='cos', qx=isCos?px:cx, qy=isCos?cy:py;
  return <svg viewBox="0 0 760 400" role="img" aria-label={`Cercle unité. Angle ${circle.angle} radians. ${isCos ? 'Projection horizontale : cosinus.' : 'Projection verticale : sinus.'}`}>
    <title>Cercle trigonométrique et projection</title>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.muted} strokeWidth="3" />
    <g stroke={ink} strokeWidth="2" fill="none"><path d="M100,200 H475"/><path d="M285,380 V20"/><path d={`M${cx},${cy} L${px},${py}`}/></g>
    <path d={`M${px},${py} L${qx},${qy}`} stroke={blue} strokeWidth="3" strokeDasharray="7 6"/>
    <path d={`M${cx},${cy} L${qx},${qy}`} stroke={rust} strokeWidth="6"/>
    <circle cx={px} cy={py} r="7" fill={blue}/>
    <g fill={ink} fontSize="26"><text x="440" y="231">1</text><text x="108" y="231">−1</text><text x="300" y="61">1</text><text x="300" y="355">−1</text><text x="258" y="230">O</text><text x="505" y="183" fill={rust}>{isCos?'cos(x)':'sin(x)'}</text><text x="505" y="224">{isCos?'Abscisse':'Ordonnée'}</text></g>
  </svg>;
}

export function GraphSlide({ graph, tex, circle }: { graph?: NonNullable<Step['graph']>; tex: string; circle?: NonNullable<Step['circle']> }) {
  return <div className="graph-slide">
    <MathView display tex={tex} />
    {graph === 'cosine-inequality' ? <CosineInequality /> : graph ? <ReferenceCurve kind={graph} /> : circle ? <CircleDiagram circle={circle} /> : null}
  </div>;
}
