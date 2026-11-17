// Becak Rush world: passengers, traffic, chickens, destinations.
import { FIELD, PASSENGER, TRAFFIC } from './config.js';

const NAMES = ['Bu Tini', 'Pak Budi', 'Mbak Sari', 'Mas Joko', 'Nek Minah', 'Dek Rani', 'Pak RT', 'Bu Warung'];
const STALLS = ['Warung Soto', 'Pasar Pagi', 'Sekolah SD', 'Masjid Al-Barokah', 'Stasiun', 'Puskesmas', 'Alun-Alun', 'Toko Kelontong'];
let nameIdx = 0;
let stallIdx = 0;

export function createWorld() {
  return {
    time: 0, spawnTimer: 1.2, trafficTimer: 0.6,
    waiting: [], onboard: null, traffic: [], chickens: [],
    delivered: 0, lost: 0, coins: [], floats: [],
  };
}

function randomX() { return 90 + Math.random() * (FIELD.width - 180); }
function randomRoadY() { return FIELD.roadTop + 40 + Math.random() * (FIELD.roadBottom - FIELD.roadTop - 90); }

export function spawnPassenger(world) {
  if (world.waiting.length >= PASSENGER.maxWaiting) return;
  const side = Math.random() < 0.5 ? 'left' : 'right';
  const dest = STALLS[stallIdx % STALLS.length]; stallIdx++;
  const name = NAMES[nameIdx % NAMES.length]; nameIdx++;
  world.waiting.push({
    id: world.time + Math.random(),
    name, dest,
    x: side === 'left' ? 62 : FIELD.width - 62,
    y: randomRoadY(),
    side, waitLeft: PASSENGER.waitSeconds,
    bob: Math.random() * 6.28,
    destX: 90 + Math.random() * (FIELD.width - 180),
    destY: randomRoadY(),
  });
}

export function spawnTraffic(world, level) {
  const isChicken = Math.random() < TRAFFIC.chickenChance;
  const speed = (TRAFFIC.speed + level * TRAFFIC.speedPerLevel) * (0.85 + Math.random() * 0.4);
  const fromLeft = Math.random() < 0.5;
  if (isChicken) {
    world.chickens.push({ x: randomX(), y: randomRoadY(), vx: (Math.random() < 0.5 ? -1 : 1) * 55, vy: 0, t: 0, peck: Math.random() * 6 });
  } else {
    world.traffic.push({
      x: fromLeft ? -90 : FIELD.width + 90,
      y: randomRoadY(),
      vx: fromLeft ? speed : -speed,
      w: 78, h: 40,
      color: ['#e5534b', '#4fc3f7', '#ff9f43', '#a55eea'][Math.floor(Math.random() * 4)],
      fromLeft,
    });
  }
}

export function updateWorld(world, dt, level) {
  world.time += dt;
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    spawnPassenger(world);
    world.spawnTimer = PASSENGER.spawnInterval + Math.random() * PASSENGER.spawnJitter;
  }
  world.trafficTimer -= dt;
  const interval = Math.max(TRAFFIC.minInterval, TRAFFIC.interval * Math.pow(TRAFFIC.intervalScale, level));
  if (world.trafficTimer <= 0) {
    spawnTraffic(world, level);
    world.trafficTimer = interval * (0.6 + Math.random() * 0.8);
  }
  // waiting timers
  for (let i = world.waiting.length - 1; i >= 0; i--) {
    const p = world.waiting[i];
    p.waitLeft -= dt; p.bob += dt * 4;
    if (p.waitLeft <= 0) { world.waiting.splice(i, 1); world.lost++; }
  }
  // traffic move
  for (let i = world.traffic.length - 1; i >= 0; i--) {
    const t = world.traffic[i];
    t.x += t.vx * dt;
    if (t.x < -140 || t.x > FIELD.width + 140) world.traffic.splice(i, 1);
  }
  // chickens wander + peck
  for (const c of world.chickens) {
    c.t += dt; c.peck += dt * 3;
    c.x += c.vx * dt;
    if (c.x < 50 || c.x > FIELD.width - 50) c.vx *= -1;
    if (Math.random() < 0.01) c.vx *= -1;
  }
  world.chickens = world.chickens.filter(c => c.t < 14);
  // coins + floats
  for (const c of world.coins) { c.y -= 40 * dt; c.life -= dt; }
  world.coins = world.coins.filter(c => c.life > 0);
  for (const f of world.floats) { f.y -= 32 * dt; f.life -= dt; }
  world.floats = world.floats.filter(f => f.life > 0);
}

export function addFloat(world, x, y, text, color) {
  world.floats.push({ x, y, text, color: color || '#ffffff', life: 1.4 });
}
export function addCoin(world, x, y, amount) {
  world.coins.push({ x, y, amount, life: 0.9 });
}
