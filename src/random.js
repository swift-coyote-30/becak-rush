// A small seeded random number generator (mulberry32): the same seed gives the same game,
// which is what makes the screenshot scenes repeatable.

export function createRandom(seed) {
  let a = seed | 0;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rand(min, max) { return min + Math.random() * (max - min); }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function dist(a, b, c, d) { if (typeof c === 'number') return Math.hypot(a - c, b - d); return Math.hypot(a.x - b.x, a.y - b.y); }
