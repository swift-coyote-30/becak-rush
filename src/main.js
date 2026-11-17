import { FIELD } from './config.js';
import { createState, resetRun, spawnPassenger, update, tryPickup } from './game.js';
import { drawBackground, drawPassengerWaiting, drawDestination, drawBecak, drawHUD, drawGameOver } from './render.js';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = createState();
let keys = {};
let touch = { active: false, x: 0, y: 0 };
let joy={active:false,ox:0,oy:0,dx:0,dy:0};
let cam={x:0,y:0};
addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'Enter' && state.phase === 'over') resetRun(state);
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
});
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
canvas.addEventListener('touchstart', e => {
  const r = canvas.getBoundingClientRect();
  const t = e.touches[0];
  joy.active=true; joy.ox=(t.clientX - r.left) * canvas.width / r.width; joy.oy=(t.clientY - r.top) * canvas.height / r.height; joy.dx=0; joy.dy=0;
touch.active = true; touch.x = (t.clientX - r.left) * canvas.width / r.width; touch.y = (t.clientY - r.top) * canvas.height / r.height;
  if (state.phase === 'over') resetRun(state);
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  const r = canvas.getBoundingClientRect();
  const t = e.touches[0];
  touch.x = (t.clientX - r.left) * canvas.width / r.width; touch.y = (t.clientY - r.top) * canvas.height / r.height;
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchend', () => {touch.active=false; joy.active=false; joy.dx=0; joy.dy=0;});
let last = performance.now();
function loop(now){
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const input = { up: keys['w'] || keys['arrowup'], down: keys['s'] || keys['arrowdown'], left: keys['a'] || keys['arrowleft'], right: keys['d'] || keys['arrowright'], touch, joy };
  if (state.phase === 'playing') update(state, input, dt);
  let zw=1.2; let tx=state.becak.x-window.innerWidth/zw/2, ty=state.becak.y-window.innerHeight/zw/2; tx=Math.max(0,Math.min(1600-window.innerWidth/zw,tx)); ty=Math.max(0,Math.min(1400-window.innerHeight/zw,ty)); cam.x+=(tx-cam.x)*1; cam.y+=(ty-cam.y)*1; ctx.save(); ctx.scale(zw,zw); ctx.translate(-cam.x,-cam.y);
drawBackground(ctx, now / 1000);
  if (state.currentPassenger) drawDestination(ctx, state.currentPassenger);
  for (const p of state.passengers) drawPassengerWaiting(ctx, p);
  drawBecak(ctx, state.becak, now / 1000);
  ctx.restore(); drawHUD(ctx, state);
if(joy.active){ctx.fillStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.arc(joy.ox,joy.oy,60,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(joy.ox+joy.dx*40,joy.oy+joy.dy*40,26,0,7);ctx.fill();}
  if (state.phase === 'over') drawGameOver(ctx, state);
  requestAnimationFrame(loop);
}
for (let i = 0; i < 3; i++) spawnPassenger(state);
requestAnimationFrame(loop);
// D-PAD - tombol arah HP
let dp=document.createElement('div'); dp.innerHTML=`<button id="dpL" style="position:fixed;left:12px;bottom:90px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.9);font-size:28px;z-index:99;border:0">◀</button><button id="dpR" style="position:fixed;left:92px;bottom:90px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.9);font-size:28px;z-index:99;border:0">▶</button><button id="dpU" style="position:fixed;left:52px;bottom:170px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.9);font-size:28px;z-index:99;border:0">▲</button><button id="dpD" style="position:fixed;left:52px;bottom:14px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.9);font-size:28px;z-index:99;border:0">▼</button><button id="dpG" style="position:fixed;right:16px;bottom:90px;width:80px;height:80px;border-radius:50%;background:#ffcc00;font-size:16px;z-index:99;border:0">GAS</button>`; document.body.appendChild(dp);
window.__DPAD={up:false,down:false,left:false,right:false,gas:false};
function bind(id,name){let el=document.getElementById(id); let on=e=>{e.preventDefault(); window.__DPAD[name]=true;}; let off=e=>{e.preventDefault(); window.__DPAD[name]=false;}; el.addEventListener('touchstart',on,{passive:false}); el.addEventListener('touchend',off); el.addEventListener('touchcancel',off); el.addEventListener('mousedown',on); el.addEventListener('mouseup',off); el.addEventListener('mouseleave',off);}
bind('dpL','left'); bind('dpR','right'); bind('dpU','up'); bind('dpD','down'); bind('dpG','gas');

document.getElementById('btnFS')?.addEventListener('click',()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
});
// biar pas pencet MULAI / GAS pertama kali langsung fullscreen juga
document.addEventListener('pointerdown',()=>{ if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); },{once:true});

let _c=document.querySelector('canvas'),_x=_c.getContext('2d');
_c.style.position='fixed'; _c.style.top='0'; _c.style.left='0';
_c.style.margin='0'; _c.style.display='block';
document.documentElement.style.height='100%';
document.body.style.height='100%'; document.body.style.margin='0'; document.body.style.overflow='hidden'; document.body.style.background='#111';
let ZOOM=1;
function fixSize(){
  let w=document.documentElement.clientWidth, h=document.documentElement.clientHeight;
  let d=devicePixelRatio||1;
  _c.width=Math.floor(w*d); _c.height=Math.floor(h*d);
  _c.style.width=w+'px'; _c.style.height=h+'px';
  _x.setTransform(1,0,0,1,0,0); _x.clearRect(0,0,_c.width,_c.height);
  _x.setTransform(d,0,0,d,0,0);
  ZOOM=1;
  if(typeof cam!=='undefined' && typeof player!=='undefined'){ cam.x=player.x-(w/ZOOM)/2; cam.y=player.y-(h/ZOOM)/2; }
}
addEventListener('resize',fixSize);
addEventListener('orientationchange',()=>setTimeout(fixSize,300));
fixSize();
