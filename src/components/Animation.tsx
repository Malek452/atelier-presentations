import { useEffect, useRef, useState } from 'react';
import type { Activity } from '../types';
import type { Controller } from '../../motion/player';
import { MathView } from './Math';
import { highlightedTex } from './focus';
import { SignTable } from './SignTable';
import { ProseSlide } from './ProseSlide';
import { ModelPlot } from './ModelPlot';
import { ui } from '../ui';
declare const __MOTION_PLAYER_URL__: string;
export function Animation({
  activity,
  step,
  reduced,
  replay,
  animate,
  speed,
  pauseSignal,
  onAvailable,
}: {
  activity: Activity;
  step: number;
  reduced: boolean;
  replay: number;
  animate: boolean;
  speed: number;
  pauseSignal: number;
  onAvailable: (available: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    controller = useRef<Controller | null>(null),
    current = useRef(step),
    pendingReplay = useRef(false),
    liveSpeed = useRef(speed);
  liveSpeed.current = speed;
  current.current = step;
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const table = activity.steps[step].table;
  const prose = activity.steps[step].prose;
  const plot = activity.steps[step].plot;
  useEffect(() => {
    onAvailable(!!table || !!prose || !!plot || reduced || state !== 'loading');
  }, [table, prose, plot, reduced, state, onAvailable]);
  useEffect(() => {
    let cancelled = false;
    setState('loading');
    if (reduced || activity.steps.every((s) => s.prose || s.plot || s.table)) return;
    const playerUrl =
      typeof __MOTION_PLAYER_URL__ === 'string' ? __MOTION_PLAYER_URL__ : 'animations/player.js';
    const url = new URL(playerUrl, document.baseURI).href;
    import(/* @vite-ignore */ url)
      .then(({ mount }) => {
        if (cancelled || !host.current) return;
        controller.current = mount(
          host.current,
          activity,
          () => {
            if (cancelled) return;
            setState('ready');
            if (pendingReplay.current)
              controller.current?.replay(current.current, liveSpeed.current);
            else controller.current?.seek(current.current);
          },
          () => {
            if (!cancelled) setState('error');
          },
        );
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
      controller.current?.destroy();
      controller.current = null;
    };
  }, [activity, reduced]);
  useEffect(() => {
    pendingReplay.current = false;
    controller.current?.pause();
  }, [pauseSignal]);
  useEffect(() => {
    pendingReplay.current = animate && replay > 0 && !reduced && !table && !prose && !plot;
    if (table || prose || plot) controller.current?.pause();
    else if (pendingReplay.current) controller.current?.replay(step, liveSpeed.current);
    else controller.current?.seek(step);
  }, [step, replay, animate, reduced, table, prose, plot]);
  useEffect(() => {
    controller.current?.setSpeed(speed);
  }, [speed]);
  return (
    <div
      className={'animation' + (table || plot ? ' has-table' : '')}
      aria-label={ui.visual}
      data-playback={animate && !reduced && !plot ? 'animate' : 'settled'}
    >
      {!reduced && (
        <div
          hidden={!!table || !!prose || !!plot}
          ref={host}
          className={'canvas-host ' + (state === 'ready' ? 'is-ready' : '')}
        />
      )}
      {prose && (
        <ProseSlide
          key={`${step}-${replay}`}
          paragraphs={prose}
          animate={animate && !reduced}
          speed={speed}
          pauseSignal={pauseSignal}
        />
      )}
      {plot && <ModelPlot kind={plot} />}
      {table && (
        <SignTable
          key={`${step}-${replay}`}
          frame={table}
          reduced={reduced || !animate}
          speed={speed}
          pauseSignal={pauseSignal}
        />
      )}
      {!table && !prose && !plot && (reduced || state !== 'ready') && (
        <div className="animation-fallback">
          <MathView display tex={highlightedTex(activity.steps[step])} />
          <p>{state === 'error' ? ui.animationError : reduced ? '' : ui.loading}</p>
        </div>
      )}
      {!table && !prose && !plot && state === 'ready' && !reduced && (
        <div className="sr-only">
          <MathView display tex={activity.steps[step].tex} />
        </div>
      )}
    </div>
  );
}
