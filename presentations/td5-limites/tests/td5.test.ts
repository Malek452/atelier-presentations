import { it } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Nerdamer does not ship declarations for this entry.
import nerdamer from 'nerdamer/all.js';
import { exercises, getActivity } from '../src/content';
import type { Activity } from '../src/types';

const activity = (id: string): Activity => {
  const result = getActivity(id);
  assert.ok(result, `Missing TD5 question: ${id}`);
  return result;
};
const math = (tex: string) => nerdamer.convertFromLaTeX(tex
  .replace(/\\(?:tfrac|frac)(\d)(\d)/g, '\\frac{$1}{$2}')
  .replace(/\\(?:tfrac|frac)([a-zA-Z0-9])(?=\{)/g, '\\frac{$1}')
  .replace(/\\ln(\d)/g, '\\ln($1)')
  .replaceAll('\\ln', '\\log')
  .replaceAll('\\times', '\\times ')
  .replaceAll('\\cdot', '\\cdot ')
  .replace(/\\(?:bigl|bigr|left|right)/g, '')
  .replace(/\\[,!]/g, ''));
const valueAt = (tex: string, x: number) =>
  Number(nerdamer(math(tex.replaceAll('|x|', String(Math.abs(x)))).text(), { x }).evaluate().text('decimals'));
const close = (actual: number, expected: number, message: string, tolerance = 1e-9) =>
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${message}: ${actual} versus ${expected}`);
const formulas = (id: string) => activity(id).steps.map((step) => step.tex).join('\n');
const explanations = (id: string) => activity(id).steps.map((step) => step.why).join('\n');

it('TD5 covers every original subquestion and starts each exercise with its reminder', () => {
  assert.deepEqual(exercises.map((exercise) => exercise.id), [1, 2, 3, 4, 5]);
  const letters = ['abcd', 'abcd', 'abcdef', 'abcde', 'abcd'];
  for (const exercise of exercises) {
    assert.equal(exercise.activities[0].id, `ex${exercise.id}-rappel`);
    assert.match(exercise.activities[0].steps[0].phase ?? '', /^Rappels?$/);
    assert.ok(exercise.activities[0].steps.every((step) => !step.phase || /^Rappels?$/.test(step.phase)));
    assert.deepEqual(exercise.activities.slice(1).map((a) => a.id),
      [...letters[exercise.id - 1]].map((letter) => `ex${exercise.id}-${letter}`));
    for (const question of exercise.activities.slice(1)) {
      assert.ok(question.initialDomain, `${question.id}: initial domain is needed`);
      assert.ok(question.steps.length >= 2, `${question.id}: detailed reasoning is needed`);
    }
  }
});

it('the three poles distinguish left and right divergence and explicitly deny a two-sided limit', () => {
  for (const id of ['ex1-d', 'ex2-a', 'ex5-b']) {
    const tex = activity(id).result + '\n' + formulas(id);
    assert.match(tex, /\\lim_\{x\\to1\^-\}[^\n]*=-\\infty/, id);
    assert.match(tex, /\\lim_\{x\\to1\^\+\}[^\n]*=\+\\infty/, id);
    assert.match(explanations(id), /(?:pas|n’existe|n.admet|différentes)/i, id);
  }
});

it('the factorisation in question 2a preserves the double denominator zero', () => {
  const tex = formulas('ex2-a');
  assert.ok(tex.includes('(x-1)(3x+2)'));
  assert.ok(tex.includes('(x-1)(x+1)^2(x^2+1)^2'));
  assert.equal(nerdamer('expand((x-1)*(3*x+2)-(3*x^2-x-2))').toString(), '0');
  assert.equal(nerdamer('expand((x-1)^2*(x+1)^2*(x^2+1)^2-(x^4-1)^2)').toString(), '0');
  const simplified = String.raw`\frac{3x+2}{(x-1)(x+1)^2(x^2+1)^2}`;
  assert.ok(tex.includes(simplified));
  for (const x of [-3, -0.5, 0, 0.9, 1.1, 3])
    close(valueAt(simplified, x), (3*x*x-x-2)/(x**4-1)**2, `2a equality at x=${x}`);
});

it('cancelling the factor x in question 2b retains the punctured domain', () => {
  const question = activity('ex2-b');
  assert.ok(question.initialDomain!.includes('0'));
  const simplified = String.raw`\frac{4x^2-2x+1}{3x+2}`;
  assert.ok(formulas('ex2-b').includes(simplified));
  assert.equal(nerdamer('expand(x*(4*x^2-2*x+1)-(4*x^3-2*x^2+x))').toString(), '0');
  assert.equal(nerdamer('expand(x*(3*x+2)-(3*x^2+2*x))').toString(), '0');
  close(valueAt(simplified, 0), 1/2, '2b removable singularity');
  close(valueAt(simplified, 1), 3/5, '2b regular value');
});

it('the finite scalar answers agree with the independent correction', () => {
  const expected: Record<string, number> = {
    'ex1-a': -7, 'ex1-b': 0, 'ex1-c': 0,
    'ex3-a': 1, 'ex3-b': 0, 'ex3-c': 1, 'ex3-d': 1/3, 'ex3-e': 1,
    'ex4-e': -1/8, 'ex5-a': 0, 'ex5-c': Math.log(3)/Math.log(2), 'ex5-d': 1,
  };
  for (const [id, expectedValue] of Object.entries(expected))
    close(valueAt(activity(id).result, 0), expectedValue, `${id}: result`);
  for (const [id, result] of Object.entries({
    'ex4-a': String.raw`+\infty`, 'ex4-b': String.raw`-\infty`,
    'ex4-c': String.raw`-\infty`, 'ex4-d': String.raw`+\infty`,
  })) assert.equal(activity(id).result, result);
});

it('question 3f keeps the absolute value and opposite one-sided limits', () => {
  const tex = formulas('ex3-f');
  const signedExpression = String.raw`\frac{|x|}{x}\,\frac{\sqrt{4+x}}{2+x}`;
  assert.ok(tex.includes(signedExpression));
  assert.match(tex, /\\lim_\{x\\to0\^-\}[^\n]*=-1/);
  assert.match(tex, /\\lim_\{x\\to0\^\+\}[^\n]*=1/);
  for (const x of [-0.5, -0.01, 0.01, 0.5])
    close(valueAt(signedExpression, x), Math.sqrt(4*x*x+x*x*x)/(2*x+x*x), `3f identity at x=${x}`);
  close(valueAt(signedExpression, -1e-7), -1, '3f left limit', 1e-6);
  close(valueAt(signedExpression, 1e-7), 1, '3f right limit', 1e-6);
});

it('the conjugates in 2d, 3b and 3e preserve values on their actual domains', () => {
  const cases: {id: string; tex: string; samples: number[]; original: (x: number) => number}[] = [
    { id: 'ex2-d', tex: String.raw`\frac1{\sqrt{1+1/x}+\sqrt{1/x}}`,
      samples: [0.01, 0.2, 4, 100], original: x => Math.sqrt(1+1/x)-Math.sqrt(1/x) },
    { id: 'ex3-b', tex: String.raw`\frac2{\sqrt{x+1}+\sqrt{x-1}}`,
      samples: [1, 2, 10, 100], original: x => Math.sqrt(x+1)-Math.sqrt(x-1) },
    { id: 'ex3-e', tex: String.raw`\frac2{\sqrt{1+x}+\sqrt{1-x}}`,
      samples: [-1, -0.1, 0.1, 1], original: x => (Math.sqrt(1+x)-Math.sqrt(1-x))/x },
  ];
  for (const item of cases) {
    assert.ok(formulas(item.id).includes(item.tex), `${item.id}: conjugate present`);
    for (const x of item.samples)
      close(valueAt(item.tex, x), item.original(x), `${item.id}: conjugate at x=${x}`);
  }
});

it('question 4e uses an exact conjugate identity valid on both sides of zero', () => {
  const tex = formulas('ex4-e');
  assert.ok(tex.includes(String.raw`(1+x)-(1+x/2)^2=-\frac{x^2}{4}`));
  assert.equal(nerdamer('expand((1+x)-(1+x/2)^2+x^2/4)').toString(), '0');
  const simplified = String.raw`-\frac{1}{4\bigl(\sqrt{1+x}+1+x/2\bigr)}`;
  assert.ok(tex.includes(simplified));
  for (const x of [-0.5, -0.1, 0.1, 0.5])
    close(valueAt(simplified, x), (Math.sqrt(1+x)-(1+x/2))/(x*x), `4e identity at x=${x}`);
  close(valueAt(simplified, 0), -1/8, '4e continuous extension at zero');
});

it('endpoint approaches and logarithmic denominator signs are explicit', () => {
  assert.ok(formulas('ex2-c').includes(String.raw`\to2^-`));
  assert.ok(formulas('ex2-d').includes(String.raw`\to0^+`));
  assert.ok(formulas('ex5-a').includes(String.raw`\to0^+`));
  assert.ok(formulas('ex4-b').includes(String.raw`\longrightarrow0^+`));
  assert.ok(formulas('ex4-c').includes(String.raw`\longrightarrow0^-`));
  assert.equal(activity('ex4-b').initialDomain, String.raw`]1;+\infty[`);
});
