import React, { useId } from 'react';
import { theme } from '../theme';
import {
  bacteriaPopulation,
  bacteriaThresholdTime,
  modelPlotDescriptions,
  modelPlotPoints,
  type ModelPlotKind,
} from '../model-plots';

/** Static diagrams intentionally keep the same result at every playback speed. */
export function ModelPlot({ kind, print = false }: { kind: ModelPlotKind; print?: boolean }) {
  const id = useId();
  const production = kind === 'production';
  const ink = print ? '#182923' : theme.mathInk;
  const grid = print ? '#d1d9cf' : theme.line;
  const curve = print ? '#176d70' : theme.second;
  const accent = print ? '#8b4b16' : theme.active;
  const left = production ? 48 : 94;
  const right = 570,
    top = 42,
    bottom = 275;
  const xMax = production ? 11 : 20;
  const yMax = production ? 10 : 160000;
  const x = (value: number) => left + ((right - left) * value) / xMax;
  const y = (value: number) => bottom - ((bottom - top) * value) / yMax;
  const xTicks = production ? [0, 3, 5, 11] : [0, 5, 10, 15, 20];
  const yTicks = production ? [0, 3, 6, 9] : [0, 50000, 100000, 150000];
  const points = modelPlotPoints(kind);
  const title = production ? 'Production cumulée et pause' : 'Croissance bactérienne et seuil';
  const path = points.map(([t, n], i) => `${i ? 'L' : 'M'}${x(t)},${y(n)}`).join(' ');
  return (
    <figure style={{ width: '100%', maxWidth: 850, margin: '12px auto', color: ink }}>
      <svg
        viewBox="0 0 610 340"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: print ? 'none' : '48vh',
          minHeight: 190,
        }}
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fill={ink}
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-description`}>{modelPlotDescriptions[kind]}</desc>
        <text x={left} y="23">
          {production ? 'N(t) / r (h)' : 'N(t) — bactéries'}
        </text>
        {production && (
          <>
            <rect
              x={x(3)}
              y={top}
              width={x(5) - x(3)}
              height={bottom - top}
              fill={accent}
              opacity="0.1"
            />
            <text x={x(4)} y="61" textAnchor="middle" fill={accent}>
              Pause
            </text>
          </>
        )}
        {yTicks.map((value) => (
          <g key={value}>
            <line x1={left} x2={right} y1={y(value)} y2={y(value)} stroke={grid} />
            <text x={left - 10} y={y(value) + 5} textAnchor="end" fontSize="20">
              {value.toLocaleString('fr-FR')}
            </text>
          </g>
        ))}
        {xTicks.map((value) => (
          <g key={value}>
            <line x1={x(value)} x2={x(value)} y1={top} y2={bottom} stroke={grid} />
            <text x={x(value)} y={bottom + 23} textAnchor="middle">
              {value}
            </text>
          </g>
        ))}
        <path
          d={`M${left},${top} V${bottom} H${right}`}
          fill="none"
          stroke={ink}
          strokeWidth="1.5"
        />
        <path
          data-model-curve={kind}
          d={path}
          fill="none"
          stroke={curve}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {(production
          ? points
          : [0, 3, 6, 9, 12, 15, 18, 20].map((t) => [t, bacteriaPopulation(t)])
        ).map(([t, n]) => (
          <circle key={t} cx={x(t)} cy={y(n)} r="3.7" fill={curve} />
        ))}
        {!production && (
          <g fill={accent}>
            <path
              d={`M${left},${y(50000)} H${x(bacteriaThresholdTime)} V${bottom}`}
              fill="none"
              stroke={accent}
              strokeWidth="1.8"
              strokeDasharray="6 4"
            />
            <circle cx={x(bacteriaThresholdTime)} cy={y(50000)} r="5" fill={accent} />
            <text x={x(bacteriaThresholdTime) - 12} y={y(50000) - 13} textAnchor="end">
              50 000 à ≈ 16,97 h
            </text>
          </g>
        )}
        <text x={(left + right) / 2} y="331" textAnchor="middle">
          {production ? 't — heures écoulées depuis 7 h' : 't — heures écoulées'}
        </text>
      </svg>
      <figcaption
        style={{ textAlign: 'center', fontSize: 14, lineHeight: 1.5, padding: '2px 12px' }}
      >
        {production
          ? 'Montée → plateau de 10 h à 12 h → montée. À 18 h : N(11) = 9r.'
          : 'Une courbe continue : tripler en 3 h n’est pas ajouter une quantité fixe.'}
      </figcaption>
    </figure>
  );
}
