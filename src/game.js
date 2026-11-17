import { FIELD, PASSENGERS, DESTINATIONS, SPEEDS } from './config.js';
import { rand, pick, dist } from './random.js';
export const GEDUNG=[];
{let cols=['#e07a5f','#81b29a','#f2cc8f','#a8dadc','#ffc8dd','#95d5b2','#e9c46a','#90be6d']; let k=0; for(let bx=0;bx<Math.ceil(FIELD.width/180);bx++)for(let by=0;by<Math.ceil(FIELD.height/180);by++){let ox=bx*180+100, oy=by*180+60; let s1=Math.abs(Math.sin((bx*5+by)*127.1)*43758.5453)%1; let s2=Math.abs(Math.sin((bx*5+by+1)*311.7)*43758.5453)%1; let w=45+Math.floor(s1*50), h=40+Math.floor(s2*45); let x=ox+10+Math.floor(s2*(90-w+20)), y=oy+8+Math.floor(s1*(90-h+20)); GEDUNG.push({x,y,w,h,c:cols[k++%8]});}}
function hitG(x,y){
  for(const g of GEDUNG){
    if(x>g.x-14 && x<g.x+g.w+14 && y>g.y-14 && y<g.y+g.h+14) return true;
  }
  return false;
}
export function createState() {
  return { phase: 'playing', score: 0, lives: 3, delivered: 0, combo: 0, comboTimer: 0, bossMsg: '', bossMsgTimer: 0, timeLeft: 90, becak: { x: FIELD.width / 2, y: FIELD.height / 2, angle: 0, speed: 0, vx: 0, vy: 0, hasPassenger: false }, passengers: [], currentPassenger: null, spawnTimer: 0 };
}
export function resetRun(s) {
  const fresh = createState();
  Object.assign(s, fresh);
  for (let i = 0; i < 3; i++) spawnPassenger(s);
}
export function spawnPassenger(s) {
  const spots = [{ x: 80, y: 80 }, { x: FIELD.width - 80, y: 80 }, { x: 80, y: FIELD.height - 80 }, { x: FIELD.width - 80, y: FIELD.height - 80 }, { x: FIELD.width / 2, y: 80 }, { x: FIELD.width / 2, y: FIELD.height - 80 }];
  const spot = pick(spots);
  const name = pick(PASSENGERS);
  const destName = pick(DESTINATIONS);
  s.passengers.push({ x: spot.x + rand(-20, 20), y: spot.y + rand(-20, 20), name, dest: destName, destX: FIELD.width / 2 + rand(-150, 150), destY: FIELD.height / 2 + rand(-100, 100), bob: rand(0, 6) });
}
export function tryPickup(s) {
  if (s.becak.hasPassenger) return;
  for (let i = 0; i < s.passengers.length; i++) {
    const p = s.passengers[i];
    if (dist(s.becak.x, s.becak.y, p.x, p.y) < 42) {
      s.becak.hasPassenger = true;
      s.currentPassenger = p;
      s.passengers.splice(i, 1);
      s.score += 10;
      return;
    }
  }
}
export function update(s, input, dt) {
  // Auto-angkut
  tryPickup(s);
  s.timeLeft -= dt; if(s.comboTimer>0){s.comboTimer-=dt; if(s.comboTimer<=0) s.combo=0;} if(s.bossMsgTimer>0) s.bossMsgTimer-=dt;
  if (s.timeLeft <= 0) { s.timeLeft = 0; s.phase = 'over'; return; }
  const b = s.becak;
  let ax = 0, ay = 0;
  if (input.up) ay -= 1;
  if (input.down) ay += 1;
  if (input.left) ax -= 1;
  if (input.right) ax += 1;
  if (input.joy && input.joy.active && (input.joy.dx || input.joy.dy)) { ax = input.joy.dx; ay = input.joy.dy; } else if (input.touch && input.touch.active) {
    const dx = input.touch.x - b.x, dy = input.touch.y - b.y;
    const d = Math.hypot(dx, dy);
    if (d > 12) { ax = dx / d; ay = dy / d; }
  }
  const len = Math.hypot(ax, ay) || 1;
  ax /= len; ay /= len;
  const speed = (input.shift||input.boost||input.space) ? 380 : 230;
if(window.__DPAD && (window.__DPAD.up||window.__DPAD.down||window.__DPAD.left||window.__DPAD.right)){ax=(window.__DPAD.right?1:0)-(window.__DPAD.left?1:0); ay=(window.__DPAD.down?1:0)-(window.__DPAD.up?1:0);} if(window.__DPAD && window.__DPAD.gas){}
const tx=ax*speed, ty=ay*speed; b.vx+=(tx-b.vx)*Math.min(1,dt*6); b.vy+=(ty-b.vy)*Math.min(1,dt*6);
  let _px=b.x,_py=b.y; b.x += b.vx * dt; if(hitG(b.x,b.y)){b.x -= b.vx * dt; b.vx=0;} b.y += b.vy * dt; if(hitG(b.x,b.y)){b.y -= b.vy * dt; b.vy=0;}
  let ta=Math.atan2(b.vy,b.vx); if(Math.hypot(b.vx,b.vy)>20){let d=ta-b.angle; while(d>3.14)d-=6.28; while(d<-3.14)d+=6.28; b.angle+=d*Math.min(1,dt*10);}
  b.x = Math.max(24, Math.min(FIELD.width - 24, b.x));
  b.y = Math.max(24, Math.min(FIELD.height - 24, b.y));
  tryPickup(s);
  if (b.hasPassenger && s.currentPassenger) {
    const p = s.currentPassenger;
    if (dist(b.x, b.y, p.destX, p.destY) < 52) {
      b.hasPassenger = false;
      s.currentPassenger = null;
      s.delivered += 1;
      s.combo+=1; s.comboTimer=5; s.score+=50*s.combo; if(s.delivered%5==0){s.score+=150; s.timeLeft+=10; s.bossMsg='BOSS PAK LURAH! +150'; s.bossMsgTimer=3;}
      s.timeLeft += 5;
    }
  }
  s.spawnTimer += dt;
  if (s.spawnTimer > 4 && s.passengers.length < 4) { s.spawnTimer = 0; spawnPassenger(s); }
}
