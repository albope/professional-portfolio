const {Easing, interpolate} = require('remotion');
const tw=(f,a,b,e)=>interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const E = {in: Easing.bezier(0.55,0,1,0.45), inOut: Easing.bezier(0.65,0,0.35,1)};
const MODW = Math.round(212*.56)+Math.round(388*.56)+Math.round(440*.56)+4, MODH = Math.round(216*.56)+Math.round(80*.56)+6;
const S={w:48+688,h:48+44+32+48+5*48}, P={w:48+592,h:48+44+32+48+5*48}, L={w:48+616,h:48+44+32+56+4*60};
const ITEMS=[{id:'modA',x:1000,y:470,w:MODW,h:MODH,r:-5},{id:'modB',x:1196,y:560,w:MODW,h:MODH,r:4},{id:'socios',x:904,y:128,w:S.w,h:S.h,r:-3,at:-3,drop:1},{id:'pagos',x:1120,y:288,w:P.w,h:P.h,r:2,at:27,drop:1},{id:'phone',x:1584,y:548,w:216,h:468,r:4,at:63},{id:'liga',x:904,y:576,w:L.w,h:L.h,r:-1.5,at:57,drop:1}];
const PILE={x:1364,y:564}, FC={x:960,y:540};
const HEAD=[[259,339,510],[351,431,662],[483,563,285],[575,655,645],[707,787,583],[799,879,842]];
const base=ITEMS.map(it=>{const cx=it.x+it.w/2, cy=it.y+it.h/2; let dx=0,dy=0,r=it.r;
 for (const up of ITEMS){ if(up===it||!up.drop||(it.at!==undefined&&up.at<=it.at))continue; const vx=cx-(up.x+up.w/2), vy=cy-(up.y+up.h/2), len=Math.max(1,Math.hypot(vx,vy)); dx+=vx/len*8; dy+=vy/len*8; r+=Math.sign(it.r)*0.6;}
 return {...it,cx:cx+dx,cy:cy+dy,r0:r};});
function frameGeom(cp,tr,sc){ let gap=1e9; const cs=[];
 for (const it of base){ const k=1-0.38*cp; const ox=(it.cx-PILE.x)*k, oy=(it.cy-PILE.y)*k; const r=it.r0+Math.sign(it.r)*7*cp;
  const sx=ox*sc+PILE.x+(FC.x-PILE.x)*tr, sy=oy*sc+PILE.y+(FC.y-PILE.y)*tr; const th=r*Math.PI/180, hw=it.w/2*sc, hh=it.h/2*sc;
  const pts=[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]].map(([a,b])=>[sx+a*Math.cos(th)-b*Math.sin(th), sy+a*Math.sin(th)+b*Math.cos(th)]);
  cs.push(...pts);
  for (const [y0,y1,x1] of HEAD) for (let i=0;i<4;i++){ const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%4]; for (let s=0;s<=60;s++){ const px=ax+(bx-ax)*s/60, py=ay+(by-ay)*s/60; if(py>=y0&&py<=y1) gap=Math.min(gap,px-x1);} } }
 return {gap,cs}; }
const S0=(f,cp)=>(1+0.02*tw(f,0,90,E.inOut))*(1-0.4*cp);
function evalC(c1,a,c,t0,e,g, print){ const ec=a<0?E.in:Easing.bezier(a,0,c,1), et=e<0?E.in:Easing.bezier(e,0,g,1);
 let worst=1e9, peak=0, prev=null, endV=0; const rows=[];
 for (let f=90; f<=119; f++){ const cp=tw(f,90,c1,ec), tr=tw(f,t0,119,et), sc=S0(f,cp); const {gap,cs}=frameGeom(cp,tr,sc);
  const hud=1-tw(f,110,118,E.in); if(hud>0.45) worst=Math.min(worst,gap);
  let v=0; if(prev){ for(let i=0;i<cs.length;i++) v=Math.max(v,Math.hypot(cs[i][0]-prev[i][0],cs[i][1]-prev[i][1])); } prev=cs; peak=Math.max(peak,v); if(f===119) endV=v;
  rows.push([f,cp.toFixed(3),tr.toFixed(3),gap.toFixed(0),hud.toFixed(2),v.toFixed(1)]); }
 if(print) rows.forEach(r=>console.log(r.join('\t')));
 return {worst,peak,endV}; }
if (process.argv[2]) { const a=process.argv[2].split(',').map(Number); console.log(evalC(...a,true)); process.exit(0); }
let best=[];
for (const c1 of [108,110,112,114,116,119]) for (const a of [0.3,0.4,0.5,0.6]) for (const c of [0.1,0.2,0.3,0.4]) for (const t0 of [90,94,96,98,100,102,104]) for (const e of [0.4,0.5,0.6,0.7]) for (const g of [0.2,0.3,0.4]) {
 const r=evalC(c1,a,c,t0,e,g,false); if(r.worst>=12 && r.endV<3) best.push({c1,a,c,t0,e,g,...r}); }
best.sort((x,y)=>x.peak-y.peak); console.log(best.slice(0,12));
