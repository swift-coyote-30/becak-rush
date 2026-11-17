/**
 * @fileoverview Becak Rush - Game World & Physics Simulation
 * Manages game state, entity object pooling, collision detection, item spawning,
 * level progression curves, and event dispatching.
 */

import { BLOCK, COIN, FIELD, LEVEL, LIVES, PLAYER, POOL_SIZE } from './config.js';

/** Entity kind: Obstacle (traffic / barrier) */
export const KIND_BLOCK = 0;

/** Entity kind: Passenger coin */
export const KIND_COIN = 1;

/** Entity kind: Bakpia Pathok (healing & bonus item) */
export const KIND_BAKPIA = 2;

/** Event flag: Player hit obstacle (-1 life) */
export const EVENT_HIT = 1;

/** Event flag: Passenger coin collected */
export const EVENT_COIN = 2;

/** Event flag: Game over (lives reached 0) */
export const EVENT_OVER = 4;

/** Event flag: Bakpia collected (+1 life or bonus points) */
export const EVENT_HEAL = 8;

/**
 * Checks axis-aligned bounding box (AABB) overlap between two entities.
 * 
 * @param {Object} a - First entity with x, y, width, height
 * @param {Object} b - Second entity with x, y, width, height
 * @returns {boolean} True if entities overlap
 */
function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Creates and initializes the Becak Rush game world simulation.
 * 
 * @param {Function} random - Random number generator function (returns 0 to 1)
 * @returns {Object} World controller interface containing `state`, `reset`, and `step`.
 */
export function createWorld(random) {
  // Initialize player (Becak) positioned at the ground Y coordinate
  const player = {
    x: 0,
    y: FIELD.groundY - PLAYER.height,
    width: PLAYER.width,
    height: PLAYER.height,
    invulnerable: 0
  };

  // Pre-allocate entity object pool to avoid garbage collection overhead during gameplay
  const items = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    items.push({
      active: false,
      kind: KIND_BLOCK,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      speed: 0
    });
  }

  // Core mutable game state
  const state = {
    player,
    items,
    score: 0,
    lives: LIVES,
    level: 1,
    elapsed: 0,
    blockTimer: 0,
    coinTimer: 0,
    bakpiaTimer: 6
  };

  /**
   * Resets the game world to initial starting conditions.
   */
  function reset() {
    player.x = 275; // Centered on Malioboro road
    player.invulnerable = 0;
    for (const it of items) {
      it.active = false;
    }
    state.score = 0;
    state.lives = LIVES;
    state.level = 1;
    state.elapsed = 0;
    state.blockTimer = BLOCK.interval;
    state.coinTimer = COIN.interval;
    state.bakpiaTimer = 6;
  }

  /**
   * Retrieves an inactive item slot from the pre-allocated object pool.
   * @returns {Object|null} Available item object or null if pool is exhausted
   */
  function freeItem() {
    for (let i = 0; i < items.length; i++) {
      if (!items[i].active) return items[i];
    }
    return null;
  }

  /**
   * Spawns a moving traffic obstacle (block) within the road boundaries.
   */
  function spawnBlock() {
    const it = freeItem();
    if (!it) return;
    it.active = true;
    it.kind = KIND_BLOCK;
    it.width = BLOCK.minWidth + random() * (BLOCK.maxWidth - BLOCK.minWidth);
    it.height = BLOCK.height;
    it.x = FIELD.roadLeft + random() * (FIELD.roadWidth - it.width);
    it.y = -it.height;
    it.speed = BLOCK.speed + BLOCK.speedPerLevel * (state.level - 1) + random() * BLOCK.speedJitter;
  }

  /**
   * Spawns a passenger coin within the road boundaries.
   */
  function spawnCoin() {
    const it = freeItem();
    if (!it) return;
    it.active = true;
    it.kind = KIND_COIN;
    it.width = COIN.size;
    it.height = COIN.size;
    it.x = FIELD.roadLeft + random() * (FIELD.roadWidth - it.width);
    it.y = -it.height;
    it.speed = COIN.speed + COIN.speedPerLevel * (state.level - 1);
  }

  /**
   * Spawns a Bakpia Pathok healing / bonus item.
   */
  function spawnBakpia() {
    const it = freeItem();
    if (!it) return;
    it.active = true;
    it.kind = KIND_BAKPIA;
    it.width = 46;
    it.height = 36;
    it.x = FIELD.roadLeft + random() * (FIELD.roadWidth - it.width);
    it.y = -it.height;
    it.speed = COIN.speed + COIN.speedPerLevel * (state.level - 1);
  }

  /**
   * Computes the current block spawn interval scaled by difficulty level.
   * @returns {number} Spawn interval in seconds
   */
  function blockInterval() {
    return Math.max(
      BLOCK.minInterval,
      BLOCK.interval * Math.pow(BLOCK.intervalScale, state.level - 1)
    );
  }

  /**
   * Advances the simulation by delta time `dt`.
   * 
   * @param {number} dt - Time step in seconds (e.g., 1/60)
   * @param {number} direction - Steering direction (-1 for left, 1 for right, 0 for neutral)
   * @param {boolean} harmless - If true, collisions with obstacles do not damage the player (used for title screen demo)
   * @returns {number} Bitmask of triggered game events (EVENT_HIT, EVENT_COIN, EVENT_OVER, EVENT_HEAL)
   */
  function step(dt, direction, harmless) {
    let events = 0;
    state.elapsed += dt;
    state.level = Math.min(LEVEL.max, 1 + Math.floor(state.elapsed / LEVEL.seconds));

    // Update player horizontal position constrained within road boundaries
    player.x = Math.min(
      FIELD.roadRight - PLAYER.width,
      Math.max(FIELD.roadLeft, player.x + direction * PLAYER.speed * dt)
    );

    // Update invulnerability timer
    if (player.invulnerable > 0) {
      player.invulnerable = Math.max(0, player.invulnerable - dt);
    }

    // Update spawn timers
    state.blockTimer -= dt;
    state.coinTimer -= dt;
    state.bakpiaTimer -= dt;

    if (state.blockTimer <= 0) {
      spawnBlock();
      state.blockTimer = blockInterval();
    }
    if (state.coinTimer <= 0) {
      spawnCoin();
      state.coinTimer = COIN.interval + random() * COIN.intervalJitter;
    }
    if (state.bakpiaTimer <= 0) {
      spawnBakpia();
      state.bakpiaTimer = 9 + random() * 6;
    }

    // Update all active entities in the pool
    for (const it of items) {
      if (!it.active) continue;

      it.y += it.speed * dt;

      // Deactivate entity when it scrolls offscreen below the canvas
      if (it.y > FIELD.height) {
        it.active = false;
        // Award dodge points for successfully passed obstacles
        if (it.kind === KIND_BLOCK && !harmless) {
          state.score += BLOCK.dodgePoints;
        }
        continue;
      }

      // Skip collision checks if harmless demo mode or player is currently invulnerable
      if (harmless || player.invulnerable > 0) continue;

      // Check collision between player and active entity
      if (!overlaps(player, it)) continue;

      // Handle collision based on entity kind
      it.active = false;
      if (it.kind === KIND_COIN) {
        state.score += COIN.points;
        events |= EVENT_COIN;
      } else if (it.kind === KIND_BAKPIA) {
        if (state.lives < LIVES) {
          state.lives += 1;
        }
        state.score += BAKPIA.points;
        events |= EVENT_HEAL;
      } else {
        // Obstacle hit
        state.lives -= 1;
        player.invulnerable = PLAYER.invulnerable;
        events |= EVENT_HIT;
        if (state.lives <= 0) {
          events |= EVENT_OVER;
        }
      }
    }

    return events;
  }

  return { state, reset, step };
}
