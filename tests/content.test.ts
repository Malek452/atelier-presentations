import { it } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { activities } from '../src/content';
import { exercises } from './fixtures';
import { definePresentation } from '../src/content/define';
import { readRoute } from '../src/route';
import { focusParts } from '../src/components/focus';
import { expandBinomial } from '../src/content/binomial';
import { quadraticSteps } from '../src/content/quadratic';
import {
  bacteriaPopulation,
  bacteriaThresholdTime,
  modelPlotPoints,
  productionRatio,
} from '../src/model-plots';

it('all active lessons contain renderable TeX and exact highlight references', () => {
  for (const activity of activities)
    for (const [i, step] of activity.steps.entries()) {
      katex.renderToString(step.tex, { throwOnError: true, strict: 'error' });
      const parts = focusParts(step);
      assert.equal(parts.before + parts.focus + parts.after, step.tex);
      if (step.fromFocus) {
        const source = focusParts({
          ...activity.steps[i - 1],
          focus: step.fromFocus,
          focusOccurrence: step.fromFocusOccurrence,
        });
        assert.equal(source.focus, step.fromFocus);
      }
    }
});

it('rejects duplicate IDs, ambiguous operations and broken table shapes', () => {
  let deck = structuredClone(exercises);
  deck[1].activities[0].id = deck[0].activities[0].id;
  assert.throws(() => definePresentation(deck), /unique URL-safe/);
  deck = structuredClone(exercises);
  deck[0].activities[0].steps[0].product = { left: 'x', right: 'x', result: 'x^2' };
  assert.throws(() => definePresentation(deck), /source expression/);
  deck = structuredClone(exercises);
  deck[0].activities[0].steps[2].product = { left: 'x', right: 'x', result: 'x^2' };
  assert.throws(() => definePresentation(deck), /one semantic/);
  deck = structuredClone(exercises);
  const frame = deck
    .flatMap((s) => s.activities)
    .flatMap((a) => a.steps)
    .find((s) => s.table)!.table!;
  frame.model.points.reverse();
  assert.throws(() => definePresentation(deck), /strictly increasing/);
  deck = structuredClone(exercises);
  const selection = deck
    .flatMap((s) => s.activities)
    .flatMap((a) => a.steps)
    .find((s) => s.table?.selectedPoints)!.table!;
  selection.selectedPoints = [0];
  assert.throws(() => definePresentation(deck), /forbidden endpoint/);
});

it('stable activity links survive section reordering and unknown links fall back', () => {
  const route = readRoute(exercises, '#activity/distributivity');
  assert.equal(
    exercises.find((s) => s.id === route.exercise)!.activities[route.index].id,
    'distributivity',
  );
  assert.deepEqual(readRoute([...exercises].reverse(), '#activity/distributivity'), route);
  assert.deepEqual(readRoute(exercises, '#activity/unknown'), {
    exercise: exercises[0].id,
    index: 0,
  });
  assert.deepEqual(readRoute(exercises, '#activity/%E0%A4%A'), {
    exercise: exercises[0].id,
    index: 0,
  });
});

it('restricted authoring helpers reject unsupported cases instead of silently producing invalid slides', () => {
  assert.throws(() => expandBinomial((x) => x, 2, 3), /supports/);
  assert.throws(() => expandBinomial((x) => x, 2, -2), /supports/);
  assert.throws(() => quadraticSteps({ a: 0, b: 1, c: 1, roots: ['0', '1'] }), /requires/);
  assert.throws(() => quadraticSteps({ a: 1, b: 0, c: 1, roots: ['0', '1'] }), /requires/);
});

it('model plots preserve the pause, period multiplier, endpoints and threshold', () => {
  assert.deepEqual(modelPlotPoints('production'), [
    [0, 0],
    [3, 3],
    [5, 3],
    [11, 9],
  ]);
  assert.equal(productionRatio(4), 3);
  for (const t of [0, 1, 6, 15])
    assert.ok(Math.abs(bacteriaPopulation(t + 3) / bacteriaPopulation(t) - 3) < 1e-12);
  const curve = modelPlotPoints('bacteria');
  assert.deepEqual(curve[0], [0, 100]);
  assert.equal(curve.at(-1)![0], 20);
  assert.equal(Math.round(curve.at(-1)![1]), 151638);
  assert.ok(Math.abs(bacteriaPopulation(bacteriaThresholdTime) - 50000) < 1e-8);
  assert.ok(curve.every(([t, n], i) => i === 0 || (t > curve[i - 1][0] && n > curve[i - 1][1])));
});

it('plot steps require a statement boundary and cannot overlay another surface', () => {
  const deck = structuredClone(exercises);
  const step = deck[0].activities[0].steps[0];
  step.plot = 'production';
  step.statement = true;
  assert.doesNotThrow(() => definePresentation(deck));
  step.statement = false;
  assert.throws(() => definePresentation(deck), /reviewed plot/);
  step.statement = true;
  step.prose = ['Une explication'];
  assert.throws(() => definePresentation(deck), /one presentation surface/);
});
