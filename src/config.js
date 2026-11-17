// Becak Rush - Kampoeng Delivery
// Every tuning number and colour in one place. Logical playfield 1280x720.

export const FIELD = { width: 1280, height: 720, roadTop: 96, roadBottom: 700 };
export const STEP = 1 / 60;

export const BECAK = {
  width: 92, height: 56, speedX: 520, speedY: 420,
  startX: 640, startY: 560, invulnerable: 1.2,
};

export const LIVES = 3;
export const TARGET_MONEY = 250;
export const SHIFT_SECONDS = 150;

export const PASSENGER = {
  waitSeconds: 22, baseFare: 18, perSecondBonus: 2,
  spawnInterval: 2.6, spawnJitter: 1.2, maxWaiting: 3,
};

export const TRAFFIC = {
  speed: 260, speedPerLevel: 28, interval: 0.85,
  intervalScale: 0.92, minInterval: 0.32, chickenChance: 0.22,
};

export const PICKUP = { radius: 78, deliverRadius: 92 };

export const LEVEL = { seconds: 25, max: 8 };

export const COMBO = { window: 4.0, max: 8 };

export const PALETTE = {
  sky: '#ffd98a', skyTop: '#ff9d5c', road: '#3a3f4a',
  roadEdge: '#f2c94c', grass: '#5aa654', grass2: '#4c9247',
  becak: '#ff4d4d', becakRoof: '#2b2f3a', passenger: '#4fc3f7',
  motor: '#e5534b', chicken: '#ffffff', coin: '#f2c94c',
  panel: '#1c2230', panelEdge: '#f2c94c', text: '#ffffff',
  muted: '#c8cedb', danger: '#ff3b30', good: '#2ee66b',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const BEST_KEY = 'becak-rush.best';
export const MONEY_KEY = 'becak-rush.money';

export const PASSENGERS = ['Budi', 'Siti', 'Andi', 'Dewi', 'Rudi', 'Ani', 'Joko', 'Putri'];
export const DESTINATIONS = ['Pasar Gede', 'Stasiun', 'Alun-Alun', 'Kampung Kauman', 'Terminal', 'Sekolah', 'Masjid Agung', 'Rumah Sakit'];
export const SPEEDS = { slow: 120, normal: 230, fast: 340 };
