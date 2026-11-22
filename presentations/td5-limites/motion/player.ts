import { theme } from '../src/theme';
import { Player, Stage, Vector2 } from '@motion-canvas/core';
import project from './project?project';
import type { Activity } from '../src/types';
import { STEP_SECONDS as STEP, SETTLED_SECONDS } from './timing';
const FPS = 30;
export interface Controller {
  seek(step: number): void;
  replay(step: number, speed: number): void;
  pause(): void;
  setSpeed(speed: number): void;
  destroy(): void;
}
export function mount(
  host: HTMLElement,
  activity: Activity,
  onReady: () => void,
  onError: (message: string) => void,
): Controller {
  const stage = new Stage();
  stage.configure({ size: new Vector2(1000, 400), resolutionScale: 1, background: theme.board });
  stage.finalBuffer.setAttribute('aria-hidden', 'true');
  host.replaceChildren(stage.finalBuffer);
  const player = new Player(
    { ...project, variables: { activity } },
    { fps: FPS, size: new Vector2(1000, 400) },
    { loop: false, muted: true },
    0,
  );
  let disposed = false,
    initialized = false,
    stopAt = -1;
  const unrender = player.onRender.subscribe(async () => {
    try {
      if (!disposed)
        await stage.render(player.playback.currentScene, player.playback.previousScene);
    } catch (e) {
      onError(String(e));
      player.deactivate();
    }
  });
  const uncalc = player.onRecalculated.subscribe(() => {
    // setSpeed recalculates the timeline too. Only the first calculation should
    // initialize the selected step; later ones restore the player's own frame.
    if (!disposed && !initialized) {
      initialized = true;
      onReady();
    }
  });
  const unframe = player.onFrameChanged.subscribe((frame) => {
    if (stopAt >= 0 && frame >= stopAt) {
      player.togglePlayback(false);
      stopAt = -1;
    }
  });
  const unlog = player.logger.onLogged.subscribe((payload) => {
    if (payload.level === 'error') onError(payload.message);
  });
  return {
    seek(step) {
      stopAt = -1;
      player.togglePlayback(false);
      player.requestSeek(Math.round((step * STEP + SETTLED_SECONDS) * FPS));
    },
    replay(step, speed) {
      player.setSpeed(speed);
      const begin = Math.max(0, step * STEP);
      stopAt = Math.round((begin + SETTLED_SECONDS) * FPS);
      // Playing from the end resets Motion Canvas to frame zero. Apply our
      // explicit step seek afterwards so that reset cannot overwrite it.
      player.togglePlayback(true);
      player.requestSeek(Math.round(begin * FPS));
    },
    pause() {
      player.togglePlayback(false);
      stopAt = -1;
    },
    setSpeed(speed) {
      player.setSpeed(speed);
    },
    destroy() {
      disposed = true;
      player.deactivate();
      unrender();
      uncalc();
      unframe();
      unlog();
      host.replaceChildren();
    },
  };
}
