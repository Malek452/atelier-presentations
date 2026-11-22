# Semantic animation recipes

Keep the expression on one board. Highlight the operands before moving them. Preserve unrelated terms. Establish a new `phase` and use `statement: true` when introducing a new claim, rather than morphing unrelated formulas into each other.

The complete executable recipes are `powers.ts`, `algebra.ts`, `signs.ts` and `circle.ts` in `examples/`. The fragments below describe cues on a current step; its `fromFocus` refers to the immediately preceding step.

## Common-base powers

Given a previous expression `10^2\times10^3`, the next step can be:

```ts
{
  title: 'Additionner les exposants',
  tex: '10^{2+3}',
  why: 'Dans ce produit de puissances de même base, on garde 10 et on additionne 2 et 3.',
  fromFocus: String.raw`10^2\times10^3`,
  focus: '2+3',
  power: {kind:'product', base:'10', left:'2', right:'3', to:'10^{2+3}'},
}
```

`kind: 'quotient'` subtracts the denominator exponent; `kind: 'power'` multiplies nested exponents. The cue does not establish their conditions of validity. For general real exponents, a positive base is sufficient; state relevant domain restrictions in the lesson. `targetLeft`/`targetRight` can specify destination exponents when extra parentheses are needed. Do not silently reorder or drop exponent terms.

## Distribution, one factor at a time

For a previous `x(x-1)`, write the products first:

```ts
{
  title: 'Distribuer x',
  tex: String.raw`x\cdot x+x\cdot(-1)`,
  why: 'Le facteur x multiplie chacun des deux termes de la parenthèse.',
  fromFocus: 'x(x-1)',
  distribute: {
    factor:'x', term:'x', product:String.raw`x\cdot x`,
    remainder:String.raw`x\cdot(-1)`,
  },
}
```

The common factor is copied to the first term while remaining attached to the rest. For a factor on the right, set `side: 'right'`. `product` and `remainder` must be exact parts of the destination expression. Use subsequent steps to evaluate each product. The `expandBinomial` example shows this in a complete surrounding polynomial.

## One multiplication

On the step after `x\cdot x+x\cdot(-1)`, use `tex: 'x^2+x\\cdot(-1)'`, `fromFocus: 'x\\cdot x'`, `focus: 'x^2'` and:

```ts
product: {left:'x', right:'x', result:'x^2'}
```

The two selected operands are shown together, then replaced by their product before returning to the complete expression. The source selection must contain both factors. Signs are part of the selected operands; do not leave a negative sign behind.

## Collect like terms

For a previous `x^2-x+2x-2`, use `tex: 'x^2+x-2'`, `fromFocus: '-x+2x'`, `focus: 'x'` and:

```ts
collect: {left:'-x', right:'2x', via:'(-1+2)x', result:'x'}
```

`via` explicitly shows the coefficient operation. This distinguishes collection from multiplying the terms. The worked binomial helper also handles repeated occurrences in surrounding equations.

## Statement transitions

Introducing `x_1=(-b-\sqrt{\Delta})/(2a)` after computing a discriminant is a new formula, not an equality transformation of Δ. Mark the formula step `statement: true`, name the root-calculation phase, and explain the conditions `a ≠ 0` and `Δ > 0`. Only subsequent substitutions are transformations of that formula.

## Diagrams

- The `circle` field adds the unit circle, radius and projection. For example, use `angle: Math.PI/6`, `label: '\\sin(\\pi/6)=1/2'`, and `axis: 'sin'`. The angle is in radians. Set `axis: 'cos'` for the horizontal coordinate. Author the equation and conclusion separately.
- `table` uses the accessible HTML sign-table renderer; see `docs/AUTHORING.md`. Entries arrive along their row and the solution intervals are selected afterward.
- `diagram: 'fold'` retains the original rectangle-folding illustration. It is a specific schematic, not a general geometry system. It uses the label for the long side `b`; do not claim it represents arbitrary dimensions or a proof of a new geometric statement.
- `textStep` uses a short positional transition for readable paragraphs. It does not imply a mathematical equivalence between text blocks.

## Helper limits

`expandBinomial(wrap, p, q)` generates `(x+p)(x+q)` only for safe positive integer `p`, negative integer `q`, and `p+q ≠ 0`. `wrap` must include its argument unchanged once. It writes distribution, then individual products, then collection. Other signs, cancellation to zero, or different variables should be authored explicitly or implemented with their own verified helper.

`quadraticSteps({a,b,c,roots})` supports integer coefficients, `a ≠ 0`, and positive integer Δ no greater than 1,000,000. The two reviewed exact root strings are supplied in **minus-formula / plus-formula order**, not necessarily increasing order when `a < 0`. The helper builds formulas and arithmetic; it does not independently verify your supplied roots. Cases Δ = 0 and Δ < 0 need explicit lessons. `discriminantSteps` alone supports those cases with safe integer coefficients.

## Timing contract

`motion/timing.ts` defines one slot per step. `motion/step-clock.ts` schedules absolute boundaries so many sequential operations do not accumulate fractional-frame drift. `motion/player.ts` serializes seeks/replays. Direct jumps and backward navigation settle a step; forward adjacent navigation and replay run the authored transition. Speed changes affect playback without restarting the expression.

Do not shorten a slot, add an unbounded wait, or replace absolute scheduling without updating and running `tests/timing.test.ts`. Test long sequences at every supported speed, then inspect actual browser playback: passing geometry tests alone cannot establish a good visual explanation.
