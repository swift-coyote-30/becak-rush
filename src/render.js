let D=null,W2=[];
export function drawGedung(ctx){let cols=['#e07a5f','#81b29a','#f2cc8f','#a8dadc','#ffc8dd','#95d5b2','#e9c46a','#90be6d']; let k=0; for(let bx=0;bx<Math.ceil(window.innerWidth/180);bx++)for(let by=0;by<Math.ceil(window.innerHeight/180);by++){let ox=bx*180+100, oy=by*180+60; let s1=Math.abs(Math.sin((bx*5+by)*127.1)*43758.5453)%1; let s2=Math.abs(Math.sin((bx*5+by+1)*311.7)*43758.5453)%1; let w=45+Math.floor(s1*50), h=40+Math.floor(s2*45); let x=ox+10+Math.floor(s2*(90-w+20)), y=oy+8+Math.floor(s1*(90-h+20)); let c=cols[k++%8]; ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x+4,y+6,w,h);ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x+5,y+5,w-10,7);ctx.fillStyle='rgba(255,220,0,.8)';for(let i=0;i<3;i++)ctx.fillRect(x+8+i*15,y+18,9,9);}}
export function drawBackground(ctx,t){
  let W=ctx.canvas.width,H=ctx.canvas.height;
let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0f0b26');g.addColorStop(1,'#241543');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
let rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();};
// taman bulat + pohon
for(let x=90;x<W;x+=180)for(let y=90;y<H;y+=180){ctx.fillStyle='#1c2f22';rr(x,y,70,70,20);ctx.fill();ctx.fillStyle='#2e7d4f';ctx.beginPath();ctx.arc(x+20,y+20,12,0,7);ctx.arc(x+50,y+45,10,0,7);ctx.fill();}
// jalan lembut
ctx.fillStyle='#33334a';
for(let y=0;y<H;y+=180){rr(0,y,W,100,20);ctx.fill();}
for(let x=0;x<W;x+=180){rr(x,0,100,H,20);ctx.fill();}
// garis tengah halus
ctx.strokeStyle='rgba(255,220,90,.7)';ctx.setLineDash([18,14]);ctx.lineWidth=2;
for(let y=50;y<H;y+=180){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
for(let x=50;x<W;x+=180){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
ctx.setLineDash([]);
drawGedung(ctx);
// lampu glow
for(let x=50;x<W;x+=180)for(let y=50;y<H;y+=180){let lg=ctx.createRadialGradient(x,y,0,x,y,60);lg.addColorStop(0,'rgba(255,200,80,.4)');lg.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=lg;ctx.beginPath();ctx.arc(x,y,60,0,7);ctx.fill();}
}

export function drawDestination(ctx,p){
D={x:p.destX,y:p.destY,name:p.dest};
ctx.fillStyle='#00c98a';ctx.fillRect(p.destX-28,p.destY-22,56,48);
ctx.fillStyle='#ffd166';ctx.fillRect(p.destX-28,p.destY-22,56,10);
ctx.font='bold 13px sans-serif';ctx.textAlign='center';
ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(p.destX-55,p.destY-48,110,20);
ctx.fillStyle='white';ctx.fillText('📍 '+p.dest,p.destX,p.destY-34);
}
export function drawPassengerWaiting(ctx,p){
if(W2.length>20)W2=[];W2.push(p);ctx.font='28px sans-serif';ctx.textAlign='center';
ctx.fillText('🧍',p.x,p.y+10);
ctx.font='bold 11px sans-serif';ctx.fillStyle='white';ctx.fillText(p.name,p.x,p.y-28);
}
export function drawBecak(ctx,b,t){
let tg=b.hasPassenger?D:W2[0];
if(W2.length&&!b.hasPassenger){let bd=1e9;for(let p of W2){let d=(p.x-b.x)**2+(p.y-b.y)**2;if(d<bd){bd=d;tg=p;}}}
if(tg){ctx.strokeStyle=b.hasPassenger?'#00ffaa':'#ffdd55';ctx.lineWidth=4;ctx.setLineDash([12,10]);
ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(tg.x,tg.y);ctx.stroke();ctx.setLineDash([]);
ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillStyle='white';
ctx.fillText(b.hasPassenger?'→ '+tg.name:'→ JEMPUT '+tg.name,(b.x+tg.x)/2,(b.y+tg.y)/2-10);}
ctx.font='42px sans-serif';ctx.textAlign='center';ctx.fillText('🛺',b.x,b.y+14);
if(b.hasPassenger){ctx.font='20px sans-serif';ctx.fillText('🧑',b.x,b.y-22);}
}
export function drawHUD(ctx,s){
if(s.currentPassenger){let p=s.currentPassenger,b=s.becak||s.player||{x:0,y:0};
ctx.strokeStyle='#00ffaa';ctx.lineWidth=5;ctx.setLineDash([14,10]);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(p.destX,p.destY);ctx.stroke();ctx.setLineDash([]);
ctx.fillStyle='#00c98a';ctx.fillRect(p.destX-30,p.destY-24,60,50);ctx.fillStyle='#ffd166';ctx.fillRect(p.destX-30,p.destY-24,60,12);
ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';ctx.textAlign='center';ctx.fillText('🏥',p.destX,p.destY+10);
ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(p.destX-60,p.destY-52,120,22);ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.fillText('📍 '+p.dest,p.destX,p.destY-36);
ctx.fillStyle='#00ffaa';ctx.font='bold 16px sans-serif';ctx.fillText('▲ KE SINI ▲',p.destX,Math.max(20,p.destY-70));}

let W=ctx.canvas.width;ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.roundRect(10,10,170,64,16);ctx.fill();ctx.beginPath();ctx.roundRect(W-210,10,200,64,16);ctx.fill();
ctx.fillStyle='white';ctx.textAlign='left';ctx.font='bold 20px sans-serif';
ctx.fillText('SKOR '+(s.score||0),20,36);
ctx.font='13px sans-serif';ctx.fillStyle='#ffd166';ctx.fillText('⏱ '+Math.ceil(s.timeLeft||0)+'s',20,58);
if(s.combo>1){ctx.fillStyle='#ff00aa';ctx.fillText('COMBO x'+s.combo,20,82);}
ctx.textAlign='right';
if(s.currentPassenger){ctx.fillStyle='#00ffaa';ctx.fillText('ANTAR: '+s.currentPassenger.name,W-20,36);ctx.fillStyle='white';ctx.fillText('→ '+s.currentPassenger.dest,W-20,58);}
else{ctx.fillStyle='white';ctx.fillText('IKUTI GARIS KUNING',W-20,45);}
}
export function drawGameOver(ctx,s){
let W=ctx.canvas.width,H=ctx.canvas.height;ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,W,H);
ctx.fillStyle='white';ctx.textAlign='center';ctx.font='bold 30px sans-serif';ctx.fillText('WAKTU HABIS!',W/2,H/2);
ctx.font='18px sans-serif';ctx.fillText('Skor: '+(s.score||0),W/2,H/2+30);
}
