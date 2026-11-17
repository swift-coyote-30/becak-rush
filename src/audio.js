// Becak Rush audio: tiny WebAudio synth, no external files.
let ctx = null;
let muted = false;
let musicTimer = null;

export function isMuted() { return muted; }
export function toggleMuted() {
  muted = !muted;
  if (muted) stopMusic();
  else startMusic();
  return muted;
}

export function ensureAudio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, slideTo) {
  if (muted) return;
  const c = ensureAudio();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol || 0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export function playHonk() { tone(520, 0.16, 'square', 0.14, 380); tone(660, 0.16, 'square', 0.1, 520); }
export function playCoin() { tone(880, 0.09, 'sine', 0.16); setTimeout(() => tone(1320, 0.14, 'sine', 0.16), 70); }
export function playPickup() { tone(440, 0.1, 'triangle', 0.16, 660); setTimeout(() => tone(660, 0.12, 'triangle', 0.16, 880), 80); }
export function playDeliver() { tone(523, 0.1, 'triangle', 0.16); setTimeout(() => tone(659, 0.1, 'triangle', 0.16), 90); setTimeout(() => tone(784, 0.18, 'triangle', 0.18), 180); }
export function playCrash() { tone(180, 0.35, 'sawtooth', 0.2, 40); }
export function playLevelUp() { tone(523, 0.12, 'square', 0.12); setTimeout(() => tone(784, 0.16, 'square', 0.12), 110); }
export function playWin() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.16), i * 130)); }
export function playLose() { [400, 320, 240, 160].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'sawtooth', 0.1), i * 140)); }
export function playClick() { tone(700, 0.06, 'square', 0.08); }

export function startMusic() {
  if (muted || musicTimer) return;
  const notes = [262, 330, 392, 523, 392, 330];
  let i = 0;
  musicTimer = setInterval(() => {
    if (muted) return;
    tone(notes[i % notes.length], 0.18, 'triangle', 0.045);
    i++;
  }, 260);
}
export function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }
