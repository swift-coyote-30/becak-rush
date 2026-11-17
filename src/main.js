/**
 * @fileoverview Becak Rush - Main Entry Point & Game Loop Controller
 * Manages game booting, fixed-timestep physics accumulation (60 FPS), state machine transitions 
 * (Title, Play, Paused, Game Over), screenshot staging mode, high-score persistence, 
 * and accessibility status announcements.
 * 
 * URL Query Parameters Support:
 * - `?seed=N`: Fixes the random number generator seed for deterministic falling patterns.
 * - `?shot=start|play|end`: Stages a specific scene for automated screenshot testing.
 */

import { BEST_KEY, LIVES, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_HIT, EVENT_OVER, EVENT_HEAL, EVENT_COIN } from './world.js';
import { ACTION_CONFIRM, ACTION_PAUSE, createInput } from './input.js';
import { createRenderer, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';

/** Maximum delta time accumulator cap to prevent spiral-of-death stalls (e.g. when tab is hidden). */
const MAX_FRAME = 0.25;

// Parse URL query parameters for debugging, seeding, and screenshot staging
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

// Initialize core engine subsystems
const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);

/**
 * Retrieves the persisted high score from localStorage safely.
 * @returns {number} The high score, or 0 if unavailable or corrupted.
 */
function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

/**
 * Persists the high score to localStorage safely.
 * @param {number} value - The new high score to save.
 */
function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // LocalStorage might be disabled in private browsing modes; score remains session-only.
  }
}

/**
 * Stages and paints a predefined screenshot scene for testing/verification.
 * 
 * @param {string} name - Screenshot scene name ('start', 'play', or 'end')
 */
function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;

  function paint() {
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) {
      requestAnimationFrame(paint);
    } else {
      window.__shotReady = true;
    }
  }

  requestAnimationFrame(paint);
}

/**
 * Initializes and runs the main gameplay loop and state machine.
 */
function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  /**
   * Updates accessibility status text for screen readers and DOM observers.
   * @param {string} message - Status update message
   */
  function announce(message) {
    status.textContent = message;
  }

  /**
   * Starts a new game session.
   */
  function startGame() {
    world.reset();
    accumulator = 0;
    screen = SCREEN_PLAY;
    announce(`Playing. ${LIVES} lives.`);
  }

  /**
   * Handles game over state, updating and persisting high score if broken.
   */
  function endGame() {
    screen = SCREEN_OVER;
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
    announce(`Game over. Score ${world.state.score}. Best ${best}.`);
  }

  /**
   * Processes one-shot actions (confirm, pause) triggered via input controller.
   */
  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_OVER)) {
      startGame();
    } else if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    } else if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && screen === SCREEN_PAUSED) {
      screen = SCREEN_PLAY;
      announce('Playing.');
    }
  }

  /**
   * Advances a single fixed time step simulation.
   */
  function step() {
    if (screen === SCREEN_TITLE) {
      world.step(STEP, 0, true);
      return;
    }
    const events = world.step(STEP, input.direction(), false);
    if (events & EVENT_OVER) {
      endGame();
    } else if (events & EVENT_HEAL) {
      announce('Bakpia! +1 nyawa.');
    } else if (events & EVENT_COIN) {
      announce('Penumpang naik!');
    } else if (events & EVENT_HIT) {
      announce(world.state.lives === 1 ? 'Hit. 1 life left.' : `Hit. ${world.state.lives} lives left.`);
    }
  }

  /**
   * Main animation frame loop utilizing fixed-timestep accumulation (60 FPS).
   * 
   * @param {DOMHighResTimeStamp} now - Current timestamp from requestAnimationFrame
   */
  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;

    handleActions();

    if (screen === SCREEN_TITLE || screen === SCREEN_PLAY) {
      while (accumulator >= STEP && (screen === SCREEN_TITLE || screen === SCREEN_PLAY)) {
        step();
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }

    renderer.draw(world.state, screen, best);
  }

  // Automatically pause the game if the tab or browser window loses visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Becak Rush. Press Space or tap to start.');
  requestAnimationFrame(frame);
}

// Bootstrap application: run screenshot test runner if requested, otherwise run normal game loop
if (shot) {
  runShot(shot);
} else {
  runGame();
}
