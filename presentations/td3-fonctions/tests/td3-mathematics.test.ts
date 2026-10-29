import { it } from 'node:test';
import assert from 'node:assert/strict';
import { activities } from '../src/content';
import type { Activity, SignTableFrame } from '../src/types';

// These checks use the source worksheet equations, independently of the authored
// transformations. Content snapshots alone cannot certify a mathematical lesson.
const tex = String.raw;
const compact = (s: string) =>
  s
    .replace(/\\(?:left|right|,|;|!|quad|qquad)/g, '')
    .replace(/\\(?:dfrac|tfrac)/g, '\\frac')
    .replace(/\\frac(\d)(\d)/g, '\\frac{$1}{$2}')
    .replace(/(?<!\\)[{}]/g, '')
    .replace(/\\ln\((\d+)\)/g, '\\ln$1')
    .replace(/\s+/g, '');
const activity = (id: string): Activity => {
  const found = activities.find((item) => item.id === id);
  assert.ok(found, `The active deck must cover worksheet activity ${id}`);
  return found;
};
const close = (actual: number, expected: number, message = '') =>
  assert.ok(
    Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected)),
    `${message}: ${actual} != ${expected}`,
  );
const hasStep = (a: Activity, fragment: string) =>
  a.steps.some((step) => compact(step.tex).includes(compact(fragment)));
const finalTable = (id: string): SignTableFrame => {
  const frame = activity(id).steps.find((step) => step.table?.selectedIntervals)?.table;
  assert.ok(frame, `${id} must explicitly select its solution intervals`);
  return frame;
};

it('covers every subquestion in the supplied worksheet with an explicit final result', () => {
  const ids = [
    '1a',
    '1b',
    '2a',
    '2b',
    '3a',
    '3b',
    '4a',
    '4b',
    '5a',
    '5b',
    '5c',
    '6a',
    '6b',
    '6c',
    '7',
  ];
  for (const id of ids) {
    const a = activity(`td3-${id}`);
    assert.ok(a.result.trim(), `${id}: missing result`);
    assert.ok(hasStep(a, a.result), `${id}: result metadata must also be displayed`);
  }
});

it('states the complete exact solution sets and all imposed domains', () => {
  const expected: Record<string, string> = {
    '1a': tex`A=-2\ln(5)`,
    '1b': tex`a=\frac{16}{15}`,
    '2a': tex`S=\{-1\}`,
    '2b': tex`S=\{2\}`,
    '3a': tex`S=[-\frac{1}{2};\frac{7}{2}]`,
    '3b': tex`S=[1;2[`,
    '4a': tex`S=\{-\ln(2);\ln(2)\}`,
    '4b': tex`S=\{\ln(2)\}`,
    '5a': tex`S=\varnothing`,
    '5b': tex`S=]0;+\infty[`,
    '5c': tex`S=]-\infty;1[\cup[3;+\infty[`,
    '6a': tex`S=\{\frac{\pi}{6}+\frac{2k\pi}{3}:k\in\mathbb{Z}\}`,
    '6b': tex`S=\{\pm\frac{\pi}{3}+2k\pi:k\in\mathbb{Z}\}`,
    '6c': tex`S=\{\frac{\pi}{4}+k\pi:k\in\mathbb{Z}\}`,
    '7': tex`S=]\frac{\pi}{6};\frac{11\pi}{6}[`,
  };
  for (const [id, result] of Object.entries(expected))
    assert.equal(compact(activity(`td3-${id}`).result), compact(result), id);
  for (const id of ['4a', '4b', '5a', '5b', '6a', '6b', '6c'])
    assert.equal(compact(activity(`td3-${id}`).initialDomain ?? ''), compact(tex`\mathbb{R}`), id);
  assert.equal(
    compact(activity('td3-5c').initialDomain ?? ''),
    compact(tex`\mathbb{R}\setminus\{1\}`),
  );
  assert.equal(compact(activity('td3-7').initialDomain ?? ''), compact(tex`[0,2\pi]`));
});

it('exercise 1 preserves the logarithmic values and the positive argument of ln(a)', () => {
  const oneA = activity('td3-1a');
  const oneB = activity('td3-1b');
  close(
    Math.log(125) - 0.5 * Math.log(25) + Math.log(1 / 25) - 4 * Math.log(Math.sqrt(5)),
    -2 * Math.log(5),
    '1a original expression',
  );
  const a = Math.exp(-Math.log(3) + 4 * Math.log(2) - Math.log(5));
  close(a, 16 / 15, '1b original expression');
  assert.ok(a > 0);
  assert.ok(compact(oneA.result).includes(compact(tex`-2\ln(5)`)));
  assert.ok(compact(oneB.result).includes(compact(tex`\frac{16}{15}`)));
});

it('logarithmic equation domains exclude all zero and negative logarithm arguments', () => {
  const domains = [
    {
      id: 'td3-2a',
      domain: tex`]-2;\frac{1}{2}[`,
      allowed: (x: number) => 1 - 2 * x > 0 && x + 2 > 0,
      points: [-3, -2, -1.999, -1, 0, 0.499, 0.5, 1],
      expected: (x: number) => -2 < x && x < 0.5,
    },
    {
      id: 'td3-2b',
      domain: tex`]1;4[`,
      allowed: (x: number) => 2 * x - 2 > 0 && 4 - x > 0 && x > 0,
      points: [-8, 0, 1, 1.001, 2, 3.999, 4, 5],
      expected: (x: number) => 1 < x && x < 4,
    },
    {
      id: 'td3-3a',
      domain: tex`]-\frac{2}{3};+\infty[`,
      allowed: (x: number) => 3 * x + 2 > 0 && x * x + 0.25 > 0,
      points: [-2, -2 / 3, -0.666, -0.5, 0, 3.5, 10],
      expected: (x: number) => x > -2 / 3,
    },
    {
      id: 'td3-3b',
      domain: tex`]-\frac{1}{2};2[`,
      allowed: (x: number) => 2 - x > 0 && 2 * x + 1 > 0,
      points: [-1, -0.5, -0.499, 0, 1, 1.999, 2, 3],
      expected: (x: number) => -0.5 < x && x < 2,
    },
  ];
  for (const item of domains) {
    const a = activity(item.id);
    assert.ok(compact(a.initialDomain ?? '').includes(compact(item.domain)), item.id);
    for (const x of item.points)
      assert.equal(item.allowed(x), item.expected(x), `${item.id} at ${x}`);
  }
});

it('exercise 2 roots satisfy the original equations and the squared extraneous root is rejected', () => {
  close(Math.log(1 - 2 * -1), Math.log(-1 + 2) + Math.log(3));
  close(Math.log(Math.sqrt(2 * 2 - 2)), Math.log(4 - 2) - 0.5 * Math.log(2));
  assert.ok(compact(activity('td3-2a').result).includes(tex`\{-1\}`));
  assert.ok(compact(activity('td3-2b').result).includes(tex`\{2\}`));
  // Squaring gives x²+6x−16. Both roots satisfy that polynomial, but only
  // x=2 gives real logarithms in the ORIGINAL equation.
  for (const x of [-8, 2]) close(x * x + 6 * x - 16, 0);
  assert.ok(!(2 * -8 - 2 > 0 && 4 - -8 > 0 && -8 > 0));
  assert.ok(activity('td3-2b').steps.some((step) => step.tex.includes('-8')));
});

it('exercise 3 solutions retain the correct inequality direction and endpoint inclusion', () => {
  const a = activity('td3-3a');
  const b = activity('td3-3b');
  assert.ok(compact(a.result).includes(compact(tex`[-\frac{1}{2};\frac{7}{2}]`)));
  assert.ok(compact(b.result).includes(compact(tex`[1;2[`)));
  // Independent exact factorization and interval tests, including both roots.
  for (const x of [-2, -0.6, -0.5, 0, 1, 3.5, 4, 10]) {
    close((x + 0.5) * (x - 3.5), x * x - 3 * x - 1.75);
    if (x > -2 / 3) assert.equal(3 * x + 2 >= x * x + 0.25, x >= -0.5 && x <= 3.5);
  }
  for (const x of [-0.499, 0, 0.999, 1, 1.001, 1.999])
    assert.equal(3 * (2 - x) <= 2 * x + 1, x >= 1 && x < 2);
  assert.equal(2 - 2, 0, 'The upper endpoint 2 is forbidden by ln(2−x)');
  const table = finalTable('td3-3a');
  assert.deepEqual(
    table.model.points.map((point) => point.value),
    [-0.5, 3.5],
  );
  assert.deepEqual(table.selectedIntervals, [1]);
  assert.deepEqual(table.selectedPoints, [0, 1]);
  for (const [i, x] of [-1, 0, 4].entries())
    assert.equal(table.model.rows.at(-1)!.intervals[i], (x + 0.5) * (x - 3.5) > 0 ? '+' : '-');
});

it('exercise 4 substitution roots respect e^x>0 and solve both original equations', () => {
  const a = activity('td3-4a');
  const b = activity('td3-4b');
  assert.ok(compact(a.result).includes(compact(tex`-\ln(2)`)));
  assert.ok(compact(a.result).includes(compact(tex`\ln(2)`)));
  assert.ok(compact(b.result).includes(compact(tex`\ln(2)`)));
  for (const x of [-Math.log(2), Math.log(2)]) close(2 * Math.exp(2 * x) - 5 * Math.exp(x), -2);
  close(Math.exp(Math.log(2)) - 2 * Math.exp(-Math.log(2)) - 1, 0);
  for (const t of [0.5, 2]) close(2 * t * t - 5 * t + 2, 0);
  for (const t of [-1, 2]) close(t * t - t - 2, 0);
  assert.ok(
    b.steps.some((step) => step.tex.includes('-1')),
    'The impossible t=−1 root must be discussed',
  );
  for (const x of [-10, -1, 0, 1, 10]) assert.ok(Math.exp(x) > 0);
});

it('exercise 5 uses exponential positivity, monotonicity and both sides of its pole', () => {
  assert.ok(compact(activity('td3-5a').result).includes(tex`\varnothing`));
  assert.ok(compact(activity('td3-5b').result).includes(compact(tex`]0;+\infty[`)));
  assert.ok(compact(activity('td3-5c').result).includes(compact(tex`]-\infty;1[\cup[3;+\infty[`)));
  for (const x of [-20, -1, 0, 1, 3, 20]) {
    assert.ok(Math.exp(-2 * x + 3) > 0);
    assert.equal(Math.exp(-x) < Math.exp(x), x > 0);
  }
  const frame = finalTable('td3-5c');
  assert.deepEqual(
    frame.model.points.map((point) => point.value),
    [1, 3],
  );
  const rows = frame.model.rows;
  const f = (x: number) => (Math.exp(x - 3) - 1) / (Math.exp(x) - Math.E);
  for (const [i, x] of [0, 2, 4].entries()) {
    assert.equal(rows.at(-1)!.intervals[i], f(x) > 0 ? '+' : '-');
    assert.equal(frame.selectedIntervals!.includes(i), f(x) >= 0);
  }
  assert.deepEqual(rows.at(-1)!.points, ['bar', '0']);
  assert.deepEqual(frame.selectedPoints, [1]);
  assert.equal(f(3), 0);
  assert.equal(Math.exp(1) - Math.E, 0);
});

it('exercise 6 solutions and circle angles satisfy the equations over repeated periods', () => {
  const a = activity('td3-6a');
  const b = activity('td3-6b');
  const c = activity('td3-6c');
  assert.ok(compact(a.result).includes(compact(tex`\frac{2k\pi}{3}`)));
  assert.ok(compact(a.result).includes(compact(tex`\frac{\pi}{6}`)));
  assert.ok(compact(b.result).includes(compact(tex`\frac{\pi}{3}`)));
  assert.ok(compact(b.result).includes(compact(tex`2k\pi`)));
  assert.ok(compact(c.result).includes(compact(tex`\frac{\pi}{4}+k\pi`)));
  for (const k of [-5, -2, -1, 0, 1, 2, 5]) {
    close(Math.sin(3 * (Math.PI / 6 + (2 * k * Math.PI) / 3)), 1);
    for (const sign of [-1, 1]) close(4 * Math.cos((sign * Math.PI) / 3 + 2 * k * Math.PI) + 1, 3);
    const x = Math.PI / 4 + k * Math.PI;
    close(Math.sin(x), Math.cos(x));
  }
  for (const step of a.steps.filter((item) => item.circle)) close(Math.sin(step.circle!.angle), 1);
  for (const step of c.steps.filter((item) => item.circle))
    close(Math.cos(step.circle!.angle), Math.sin(step.circle!.angle));
  for (const step of b.steps.filter((item) => item.circle))
    close(Math.cos(step.circle!.angle), 0.5);
  const angles = b.steps.flatMap((step) => (step.circle ? [step.circle.angle] : []));
  assert.ok(angles.some((angle) => Math.sin(angle) > 0));
  assert.ok(angles.some((angle) => Math.sin(angle) < 0));
});

it('exercise 7 selects the large arc and excludes both equality endpoints', () => {
  const a = activity('td3-7');
  assert.ok(compact(a.result).includes(compact(tex`]\frac{\pi}{6};\frac{11\pi}{6}[`)));
  const threshold = Math.sqrt(3) / 2;
  close(Math.cos(Math.PI / 6), threshold);
  close(Math.cos((11 * Math.PI) / 6), threshold);
  for (const x of [
    0,
    Math.PI / 12,
    Math.PI / 3,
    Math.PI,
    (3 * Math.PI) / 2,
    (23 * Math.PI) / 12,
    2 * Math.PI,
  ])
    assert.equal(Math.cos(x) < threshold, Math.PI / 6 < x && x < (11 * Math.PI) / 6);
  assert.ok(Math.cos(0) > threshold && Math.cos(2 * Math.PI) > threshold);
});
