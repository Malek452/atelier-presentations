import { it } from 'node:test';
import assert from 'node:assert/strict';
// Independent symbolic checks are test-only. The student UI has no answer validator.
// @ts-expect-error Nerdamer does not ship declarations for this entry.
import nerdamer from 'nerdamer/all.js';
import { getActivity } from './fixtures';
import { getActivity as getActiveActivity } from '../src/content';

// Nerdamer needs command separators and explicit fraction groups, even though
// MathJax and KaTeX also accept the shorter equivalent notation.
const parse = (tex: string) =>
  nerdamer.convertFromLaTeX(
    tex
      .replaceAll('\\times', '\\times ')
      .replaceAll('\\cdot', '\\cdot ')
      .replace(/\\(?:tfrac|frac)(\d)(\d)/g, '\\frac{$1}{$2}'),
  );
const numeric = (tex: string) => Number(parse(tex).evaluate().text('decimals'));
it('each power step preserves the original value, including nested powers', () => {
  const expected: Record<string, number> = { '1q1': 100000, '1q2': 7 ** 1.5, '1q4': 64 };
  for (const [id, value] of Object.entries(expected)) {
    const a = getActivity(id)!;
    for (const s of a.steps)
      for (const member of s.tex.split('='))
        assert.ok(
          Math.abs(numeric(member) - value) < Math.max(1, value) * 1e-10,
          `${id}: ${member}`,
        );
  }
});
it('every distributivity step is exactly the same polynomial', () => {
  const a = getActivity('distributivity')!;
  for (const s of a.steps)
    for (const member of s.tex.split('=')) {
      const difference = nerdamer(`expand((${parse(member).text()})-(x^2+x-2))`).toString();
      assert.equal(difference, '0', member);
    }
});
it('the two quadratic roots satisfy the original equation and both signs appear in the formula', () => {
  const a = getActivity('quadratic')!;
  const finalRoots = a.steps
    .filter((s) => s.title === 'Simplifier la fraction')
    .map((s) => numeric(s.tex.split('=')[1]));
  assert.deepEqual(finalRoots, [-2.5, 1]);
  for (const x of finalRoots) assert.equal(2 * x * x + 3 * x - 5, 0);
  assert.ok(a.steps.some((s) => s.statement && s.tex.includes('-b-\\sqrt{\\Delta}')));
  assert.ok(a.steps.some((s) => s.statement && s.tex.includes('-b+\\sqrt{\\Delta}')));
});
it('the sign table agrees with the rational function and excludes its pole', () => {
  const s = getActivity('sign-table')!.steps.find((s) => s.table?.selectedIntervals)!.table!;
  const f = (x: number) => (x - 1) / (x + 2);
  for (const [i, x] of [-3, 0, 2].entries()) {
    assert.equal(s.model.rows.at(-1)!.intervals[i], f(x) > 0 ? '+' : '-');
    assert.equal(s.selectedIntervals!.includes(i), f(x) >= 0);
  }
  assert.equal(s.model.rows.at(-1)!.points[0], 'bar');
  assert.deepEqual(s.selectedPoints, [1]);
  assert.equal(f(1), 0);
});
it('both unit-circle diagrams solve sin(x)=1/2, including complete turns', () => {
  const steps = getActivity('circle-sine')!.steps.filter((s) => s.circle);
  assert.equal(steps.length, 2);
  for (const s of steps)
    for (const k of [-2, -1, 0, 1, 2])
      assert.ok(Math.abs(Math.sin(s.circle!.angle + 2 * k * Math.PI) - 0.5) < 1e-12);
});

// Read the authored formulas rather than testing independent copies of the models.
// Nerdamer calls the natural logarithm `log` and does not parse TeX floor delimiters.
const modelTex = (tex: string) =>
  tex
    .replaceAll('\\,', '')
    .replaceAll('{,}', '.')
    .replace(/\brt\b/g, 'r t')
    .replace(/\\ln\s*(\d+)/g, '\\log($1)')
    .replace(/\\ln(?=\\left|\()/g, '\\log')
    .replace(/t\\log/g, '{t}\\log');
const modelValue = (tex: string, variables: Record<string, number> = {}): number => {
  const withFloors = modelTex(tex).replace(/\\lfloor\s*(.*?)\\rfloor/g, (_, inside: string) =>
    String(Math.floor(modelValue(inside, variables))),
  );
  return Number(parse(withFloors).evaluate(variables).text('decimals'));
};
const polynomialEqual = (actual: string, expected: string) =>
  assert.equal(
    nerdamer(`expand((${parse(modelTex(actual)).text()})-(${expected}))`).toString(),
    '0',
    actual,
  );
const closeTo = (actual: number, expected: number, tolerance = 1e-8) =>
  assert.ok(
    Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance,
    `${actual} ≠ ${expected}`,
  );
const continuousPopulation = () => {
  const activity = getActiveActivity('ex5-modele')!;
  const formula = activity.steps.find((step) => step.tex === activity.result);
  assert.ok(formula, 'The displayed model must agree with its exported result.');
  return formula.tex.split('=')[1];
};

it('the authored production pieces have the stated slopes, domain and continuous joins', () => {
  const activity = getActiveActivity('ex2-construction')!;
  const formula = activity.steps.find((step) => step.tex.includes('\\begin{cases}'))!;
  assert.equal(formula.tex, activity.result);
  const rows = formula.tex.match(/\\begin\{cases\}(.*?)\\end\{cases\}/)![1].split('\\\\');
  const pieces = rows.map((row) => row.split('&')[0]);
  assert.deepEqual(
    rows.map((row) => row.split('&')[1]),
    ['0\\le t\\le3', '3<t\\le5', '5<t\\le11'],
  );
  assert.equal(pieces.length, 3);
  for (const [index, piece] of pieces.entries()) {
    const derivative = nerdamer.diff(parse(modelTex(piece)).text(), 't').text();
    polynomialEqual(derivative, index === 1 ? '0' : 'r');
  }
  for (const r of [0.5, 1, 17]) {
    closeTo(modelValue(pieces[0], { t: 0, r }), 0);
    closeTo(modelValue(pieces[0], { t: 3, r }), modelValue(pieces[1], { t: 3, r }));
    closeTo(modelValue(pieces[1], { t: 5, r }), modelValue(pieces[2], { t: 5, r }));
    closeTo(modelValue(pieces[1], { t: 4, r }), 3 * r);
    closeTo(modelValue(pieces[2], { t: 11, r }), 9 * r);
  }
  polynomialEqual(pieces[2], 'r*(t-2)');
});

it('the production calculation and authored clock table use nine working hours, not eleven', () => {
  const verification = getActiveActivity('ex2-verifier')!;
  const totalSteps = verification.steps.filter((step) => step.tex.startsWith('N(11)='));
  assert.ok(totalSteps.length >= 4);
  for (const step of totalSteps) polynomialEqual(step.tex.split('=')[1], '9*r');
  polynomialEqual(verification.result.split('=')[1], '9*r');

  const clock = getActiveActivity('ex2-reperes')!.steps.find((step) =>
    step.tex.includes('\\begin{array}'),
  )!;
  const clockRows = clock.tex
    .replace(/^.*?\}h&/, '')
    .replace('\\end{array}', '')
    .split('\\\\\\hline t&');
  const hours = clockRows[0].split('&').map(Number);
  const elapsed = clockRows[1].split('&').map(Number);
  assert.deepEqual(hours, [7, 10, 12, 18]);
  assert.deepEqual(
    elapsed,
    hours.map((hour) => hour - 7),
  );
  assert.equal(elapsed[1] + elapsed[3] - elapsed[2], 9);

  const pointTable = verification.steps.find((step) => step.tex.includes('\\begin{array}'))!;
  const totals = pointTable.tex.split('\\hline N(t)&')[1].replace('\\end{array}', '').split('&');
  assert.deepEqual(
    totals.map((tex) => modelValue(tex, { r: 7 })),
    [0, 21, 21, 63],
  );
  assert.match(pointTable.tex, /\\mathrm h/);
});

it('the authored exponential model triples in three hours and gives the displayed 15 h and 20 h populations', () => {
  const model = continuousPopulation();
  closeTo(modelValue(model, { t: 0 }), 100);
  for (const time of [0, 1.25, 3, 12, 20])
    closeTo(modelValue(model, { t: time + 3 }) / modelValue(model, { t: time }), 3);

  const steps = getActiveActivity('ex5-effectifs')!.steps;
  for (const step of steps.filter((step) => step.tex.startsWith('N(15)=')))
    closeTo(modelValue(step.tex.split('=')[1]), modelValue(model, { t: 15 }));
  closeTo(modelValue(model, { t: 15 }), 24300);
  closeTo(modelValue(model, { t: 20 }), 151638.1107004839, 1e-6);
  const roundedTwenty = steps.find((step) => step.tex.startsWith('N(20)\\simeq'))!;
  assert.equal(
    modelValue(roundedTwenty.tex.split('\\simeq')[1]),
    Math.round(modelValue(model, { t: 20 })),
  );
});

it('every authored logarithmic equation retains the exact threshold and the minute conversion uses 60', () => {
  const activity = getActiveActivity('ex5-seuil')!;
  const exact = activity.steps.find(
    (step) => step.tex.startsWith('t=') && step.tex.includes('\\ln'),
  )!;
  const threshold = modelValue(exact.tex.split('=')[1]);
  closeTo(threshold, 16.97034020789009);
  closeTo(modelValue(continuousPopulation(), { t: threshold }), 50000, 1e-6);
  assert.ok(threshold > 15 && threshold < 18);
  for (const step of activity.steps.filter((step) => step.tex.includes('='))) {
    const [left, right] = step.tex.split('=');
    closeTo(modelValue(left, { t: threshold }), modelValue(right, { t: threshold }), 1e-6);
  }

  const conversion = activity.steps.find((step) => step.tex.includes('\\mathrm{min}'))!;
  const [left, right] = conversion.tex.split('\\simeq');
  assert.match(left, /\\times60$/);
  const minutes = modelValue(right.split('\\ ')[0]);
  closeTo(modelValue(left), minutes, 0.005);
  assert.equal(Math.round((threshold - Math.floor(threshold)) * 60), 58);
  assert.ok(
    activity.steps.some((step) => step.prose?.some((line) => line.includes('16 h 58 min'))),
  );
});

it('the authored jump model agrees at tripling instants and crosses 50000 at 18 h without attaining it', () => {
  const activity = getActiveActivity('ex5-hypotheses')!;
  const modelStep = activity.steps.find((step) => step.tex.includes('\\lfloor'))!;
  const jumpModel = modelStep.tex.split('=')[1];
  for (const time of [0, 3, 6, 9, 12, 15, 18])
    closeTo(modelValue(jumpModel, { t: time }), modelValue(continuousPopulation(), { t: time }));
  const displayed = activity.steps.find((step) => step.tex.startsWith('N_{\\mathrm{sauts}}(20)='))!;
  for (const member of displayed.tex.split('=').slice(1))
    closeTo(modelValue(member), modelValue(jumpModel, { t: 20 }));
  closeTo(modelValue(jumpModel, { t: 20 }), 72900);
  assert.notEqual(
    modelValue(jumpModel, { t: 20 }),
    Math.round(modelValue(continuousPopulation(), { t: 20 })),
  );
  closeTo(modelValue(jumpModel, { t: 18 - 1e-6 }), 24300);
  closeTo(modelValue(jumpModel, { t: 18 }), 72900);
  assert.ok(modelValue(jumpModel, { t: 18 - 1e-6 }) < 50000);
  assert.ok(modelValue(jumpModel, { t: 18 }) > 50000);
});
