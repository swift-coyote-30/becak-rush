export const ACTION_CONFIRM=1,ACTION_PAUSE=2;
const L=new Set(['ArrowLeft','KeyA']),R=new Set(['ArrowRight','KeyD']),C=new Set(['Space','Enter']),P=new Set(['KeyP','Escape']);
export function createInput(t){
let l=0,r=0,a=0,pd=0,pa=0;
t.style.touchAction='none';
const up=e=>{let x=e.clientX-t.getBoundingClientRect().left;pd=x<t.getBoundingClientRect().width/2?-1:1};
addEventListener('keydown',e=>{if(L.has(e.code))l=1;else if(R.has(e.code))r=1;else if(C.has(e.code)){if(!e.repeat)a|=1}else if(P.has(e.code)){if(!e.repeat)a|=2}else return;e.preventDefault()});
addEventListener('keyup',e=>{if(L.has(e.code))l=0;if(R.has(e.code))r=0});
addEventListener('blur',()=>{l=r=pa=pd=0});
t.addEventListener('pointerdown',e=>{e.preventDefault();pa=1;up(e);a|=1});
t.addEventListener('pointermove',e=>{if(pa)up(e)});
t.addEventListener('pointerup',()=>pa=pd=0);
t.addEventListener('pointercancel',()=>pa=pd=0);
return{direction:()=>pa?pd:r-l,takeActions:()=>{let v=a;a=0;return v}};
}
