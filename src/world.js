import { BLOCK, COIN, FIELD, LEVEL, LIVES, PLAYER, POOL_SIZE } from './config.js';
export const KIND_BLOCK = 0;
export const KIND_COIN = 1;
export const KIND_BAKPIA = 2;
export const EVENT_HIT = 1;
export const EVENT_COIN = 2;
export const EVENT_OVER = 4;
export const EVENT_HEAL = 8;
function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
export function createWorld(random) {
  const player = { x: 0, y: FIELD.groundY - PLAYER.height, width: PLAYER.width, height: PLAYER.height, invulnerable: 0 };
  const items = [];
  for (let i = 0; i < POOL_SIZE; i++) items.push({ active: false, kind: KIND_BLOCK, x: 0, y: 0, width: 0, height: 0, speed: 0 });
  const state = { player, items, score: 0, lives: LIVES, level: 1, elapsed: 0, blockTimer: 0, coinTimer: 0, bakpiaTimer: 6 };
  function reset() {
    player.x = 275;
    player.invulnerable = 0;
    for (const it of items) it.active = false;
    state.score = 0; state.lives = LIVES; state.level = 1; state.elapsed = 0;
    state.blockTimer = BLOCK.interval; state.coinTimer = COIN.interval; state.bakpiaTimer = 6;
  }
  function freeItem() {
    for (let i = 0; i < items.length; i++) if (!items[i].active) return items[i];
    return null;
  }
  function spawnBlock() {
    const it = freeItem(); if (!it) return;
    it.active = true; it.kind = KIND_BLOCK;
    it.width = BLOCK.minWidth + random() * (BLOCK.maxWidth - BLOCK.minWidth);
    it.height = BLOCK.height; it.x = 100 + random() * (440 - it.width); it.y = -it.height;
    it.speed = BLOCK.speed + BLOCK.speedPerLevel * (state.level - 1) + random() * BLOCK.speedJitter;
  }
  function spawnCoin() {
    const it = freeItem(); if (!it) return;
    it.active = true; it.kind = KIND_COIN;
    it.width = COIN.size; it.height = COIN.size;
    it.x = 100 + random() * (440 - it.width); it.y = -it.height;
    it.speed = COIN.speed + COIN.speedPerLevel * (state.level - 1);
  }
  function spawnBakpia() {
    const it = freeItem(); if (!it) return;
    it.active = true; it.kind = KIND_BAKPIA;
    it.width = 46; it.height = 36;
    it.x = 100 + random() * (440 - it.width); it.y = -it.height;
    it.speed = COIN.speed + COIN.speedPerLevel * (state.level - 1);
  }
  function blockInterval() { return Math.max(BLOCK.minInterval, BLOCK.interval * Math.pow(BLOCK.intervalScale, state.level - 1)); }
  function step(dt, direction, harmless) {
    let events = 0;
    state.elapsed += dt;
    state.level = Math.min(LEVEL.max, 1 + Math.floor(state.elapsed / LEVEL.seconds));
    player.x = Math.min(450, Math.max(100, player.x + direction * PLAYER.speed * dt));
    if (player.invulnerable > 0) player.invulnerable = Math.max(0, player.invulnerable - dt);
    state.blockTimer -= dt; state.coinTimer -= dt; state.bakpiaTimer -= dt;
    if (state.blockTimer <= 0) { spawnBlock(); state.blockTimer = blockInterval(); }
    if (state.coinTimer <= 0) { spawnCoin(); state.coinTimer = COIN.interval + random() * COIN.intervalJitter; }
    if (state.bakpiaTimer <= 0) { spawnBakpia(); state.bakpiaTimer = 9 + random() * 6; }
    for (const it of items) {
      if (!it.active) continue;
      it.y += it.speed * dt;
      if (it.y > FIELD.height) {
        it.active = false;
        if (it.kind === KIND_BLOCK && !harmless) state.score += BLOCK.dodgePoints;
        continue;
      }
      if (harmless || player.invulnerable > 0) continue;
      if (!overlaps(player, it)) continue;
      it.active = false;
      if (it.kind === KIND_COIN) { state.score += COIN.points; events |= EVENT_COIN; }
      else if (it.kind === KIND_BAKPIA) { if (state.lives < LIVES) state.lives += 1; state.score += 5; events |= EVENT_HEAL; }
      else { state.lives -= 1; player.invulnerable = PLAYER.invulnerable; events |= EVENT_HIT; if (state.lives <= 0) events |= EVENT_OVER; }
    }
    return events;
  }
  return { state, reset, step };
}
