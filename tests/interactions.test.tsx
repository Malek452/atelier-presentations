import React from 'react';
import { it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { getActivity, exercises } from './fixtures';
import { ui } from '../src/ui';
import { ProseSlide } from '../src/components/ProseSlide';
import { ModelPlot } from '../src/components/ModelPlot';
import { Lesson } from '../src/components/Lesson';
import type { Activity } from '../src/types';

beforeEach(() => {
  window.location.hash = '';
});
const jump = (i: number) =>
  fireEvent.change(screen.getByRole('combobox', { name: ui.chooseStep }), {
    target: { value: String(i) },
  });

it('opens on one presentation board without answer fields', () => {
  const { container } = render(<App sections={exercises} />);
  assert.equal(container.querySelectorAll('.reading-board').length, 1);
  assert.equal(screen.queryByRole('textbox'), null);
  assert.equal(
    (screen.getByRole('combobox', { name: ui.chooseSection }) as HTMLSelectElement).options.length,
    exercises.length,
  );
});
it('direct links, jumps and backward navigation retain the matching explanation', () => {
  window.location.hash = '#activity/distributivity';
  const { container } = render(<App sections={exercises} />);
  const activity = getActivity('distributivity')!;
  jump(4);
  assert.equal(
    container.querySelector('.reading-explanation p')!.textContent,
    activity.steps[4].why,
  );
  fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
  assert.equal(
    container.querySelector('.reading-explanation p')!.textContent,
    activity.steps[3].why,
  );
  fireEvent.keyDown(screen.getByRole('combobox', { name: ui.chooseStep }), {
    key: 'ArrowRight',
  });
  assert.equal(
    container.querySelector('.reading-explanation p')!.textContent,
    activity.steps[3].why,
  );
  jump(activity.steps.length - 1);
  assert.equal(
    (screen.getByRole('button', { name: ui.nextStep }) as HTMLButtonElement).disabled,
    true,
  );
});
it('changing chapter writes a stable activity URL and resets the lesson', async () => {
  render(<App sections={exercises} />);
  fireEvent.change(screen.getByRole('combobox', { name: ui.chooseSection }), {
    target: { value: '5' },
  });
  await waitFor(() =>
    assert.ok(screen.getByRole('heading', { name: 'Choisir la population de référence' })),
  );
  assert.equal(window.location.hash, '#activity/proportions');
  assert.ok(screen.getByText('Une proportion compare l’effectif d’un groupe à l’effectif total.'));
});
it('French sign tables reveal rows, render infinity and distinguish a pole from an included zero', () => {
  window.location.hash = '#activity/sign-table';
  const { container } = render(<App sections={exercises} />);
  const a = getActivity('sign-table')!,
    first = a.steps.findIndex((s) => s.table);
  jump(first);
  assert.equal(screen.getByRole('table').querySelectorAll('tbody td .math').length, 0);
  assert.ok(screen.getByRole('table').textContent!.includes('∞'));
  jump(first + 1);
  assert.ok(screen.getByRole('table').querySelectorAll('tbody td .math').length > 0);
  jump(a.steps.findIndex((s) => s.table?.selectedIntervals));
  assert.ok(screen.getByRole('img', { name: ui.forbidden }));
  assert.equal(container.querySelectorAll('.sign-selected').length, 3);
  assert.equal(container.querySelectorAll('.sign-selected .sign-forbidden').length, 0);
  const region = screen.getByRole('region', { name: ui.tableRegion });
  Object.defineProperty(region, 'scrollWidth', { value: 900 });
  Object.defineProperty(region, 'clientWidth', { value: 300 });
  const before = container.querySelector('.reading-explanation')!.textContent;
  fireEvent.keyDown(region, { key: 'ArrowRight' });
  assert.equal(container.querySelector('.reading-explanation')!.textContent, before);
});
it('deliberate horizontal swipes navigate but vertical scrolling does not', () => {
  const { container } = render(<App sections={exercises} />),
    surface = container.querySelector('.slide-surface')!;
  const finger = (x: number, y: number) => ({ identifier: 1, clientX: x, clientY: y });
  const start = container.querySelector('h1')!.textContent;
  fireEvent.touchStart(surface, { touches: [finger(300, 200)] });
  fireEvent.touchMove(surface, { touches: [finger(280, 400)] });
  fireEvent.touchEnd(surface, { touches: [], changedTouches: [finger(280, 400)] });
  assert.equal(container.querySelector('h1')!.textContent, start);
  fireEvent.touchStart(surface, { touches: [finger(300, 200)] });
  fireEvent.touchEnd(surface, { touches: [], changedTouches: [finger(100, 205)] });
  assert.notEqual(container.querySelector('h1')!.textContent, start);
});
it('text slides render text safely and pause their movement', () => {
  const { container, rerender } = render(
    <ProseSlide paragraphs={['<script>bad()</script>']} animate speed={1} pauseSignal={0} />,
  );
  assert.equal(container.querySelector('script'), null);
  assert.ok(screen.getByText('<script>bad()</script>'));
  rerender(
    <ProseSlide paragraphs={['<script>bad()</script>']} animate speed={1} pauseSignal={1} />,
  );
  assert.equal(
    (container.querySelector('.prose-slide') as HTMLElement).style.animationPlayState,
    'paused',
  );
});

it('model graphs have a named accessible description and retain the threshold annotation', () => {
  const { container, rerender } = render(<ModelPlot kind="production" />);
  assert.ok(screen.getByRole('img', { name: /Production cumulée et pause/ }));
  assert.match(container.querySelector('desc')!.textContent!, /plateau entre t = 3 et t = 5/);
  rerender(<ModelPlot kind="bacteria" />);
  assert.ok(screen.getByRole('img', { name: /Croissance bactérienne et seuil/ }));
  assert.ok(screen.getByText('50 000 à ≈ 16,97 h'));
  assert.equal(container.querySelectorAll('[data-model-curve]').length, 1);
});

it('jumping through graph steps preserves the explanation and returns to the formula', () => {
  const activity: Activity = {
    id: 'plot-navigation',
    label: 'Courbe',
    prompt: 'Tracer',
    tex: 'N(0)=0',
    result: 'N(11)=9r',
    visual: 'algebra',
    steps: [
      { title: 'Départ', tex: 'N(0)=0', why: 'Le cumul commence à zéro.' },
      {
        title: 'Courbe de production',
        tex: 'N(11)=9r',
        why: 'La pause laisse le cumul constant.',
        plot: 'production',
        statement: true,
      },
      { title: 'Total', tex: 'N(11)=9r', why: 'Neuf heures de production.' },
    ],
  };
  const { container } = render(<Lesson activity={activity} reduced />);
  jump(1);
  assert.ok(screen.getByRole('img', { name: /Production cumulée et pause/ }));
  assert.equal(container.querySelector('.animation')!.getAttribute('data-playback'), 'settled');
  assert.equal(
    container.querySelector('.reading-explanation p')!.textContent,
    activity.steps[1].why,
  );
  fireEvent.click(screen.getByRole('button', { name: ui.replay }));
  assert.ok(screen.getByRole('img', { name: /Production cumulée et pause/ }));
  jump(2);
  assert.equal(screen.queryByRole('img'), null);
  assert.ok(container.querySelector('.animation-fallback .katex'));
  fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
  assert.ok(screen.getByRole('img', { name: /Production cumulée et pause/ }));
});
