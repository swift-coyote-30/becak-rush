export const FIELD = { width: 640, height: 1280, groundY: 1150 };
export const PLAYER = { width: 90, height: 70, speed: 620, invulnerable: 1.2 };
export const BLOCK = { interval: 0.85, minInterval: 0.35, intervalScale: 0.92, minWidth: 70, maxWidth: 150, height: 64, speed: 340, speedPerLevel: 35, speedJitter: 90, dodgePoints: 1 };
export const COIN = { size: 44, interval: 1.1, intervalJitter: 0.8, speed: 320, speedPerLevel: 25, points: 10 };
export const LEVEL = { seconds: 18, max: 8 };
export const LIVES = 3;
export const POOL_SIZE = 48;
export const FONT = "system-ui, sans-serif";
export const PALETTE = {
  backdrop: "#1a120b",
  sky: "#ffe9c4",
  ground: "#3a3a3a",
  road: "#4a4a4a",
  line: "#ffd23f",
  player: "#1f9d55",
  block: "#c0392b",
  coin: "#f1c40f",
  text: "#2b1a0a",
  muted: "#6b4a2a",
  panel: "#fff8e7"
};

export const BEST_KEY = 'becak-rush-best';
export const STEP = 1 / 60;
