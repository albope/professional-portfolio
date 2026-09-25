const {Easing, interpolate} = require('remotion');
const tw=(f,a,b,e)=>interpolate(f,[a,b],[0,1],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const E = {in: Easing.bezier(0.55,0,1,0.45), inOut: Easing.bezier(0.65,0,0.35,1), overlay: Easing.bezier(0.32,0.72,0,1)};
// geometry from the scene
const MODW = Math.round(212*.56)+Math.round(388*.56)+Math.round(440*.56)+4, MODH = Math.round(216*.56)+Math.round(80*.56)+6;
const S={w:48+688,h:48+44+32+48+5*48}, P={w:48+592,h:48+44+32+48+5*48}, L={w:48+616,h:48+44+32+56+4*60};
const ITEMS=[
 {id:'modA',x:1000,y:470,w:MODW,h:MODH,r:-5},
 {id:'modB',x:1196,y:560,w:MODW,h:MODH,r:4},
 {id:'socios',x:904,y:128,w:S.w,h:S.h,r:-3,at:-3,drop:1},
 {id:'pagos',x:1120,y:288,w:P.w,h:P.h,r:2,at:27,drop:1},
 {id:'phone',x:1584,y:548,w:216,h:468,r:4,at:63},
 {id:'liga',x:904,y:576,w:L.w,h:L.h,r:-1.5,at:57,drop:1},
];
const PILE={x:1364,y:564}, FC={x:960,y:540};
const HEAD=[[259,339,510],[351,431,662],[483,563,285],[575,655,645],[707,787,583],[799,879,842]];
function run(name, cpF, trF, scaleF){
  console.log('==',name);
  let prev=null;
  for (let f=88; f<=119; f++){
    const cp=cpF(f), tr=trF(f); const sc=scaleF(f,cp);
    let minGap=1e9, who='';
    const boxes=[];
    for (const it of ITEMS){
      const cx=it.x+it.w/2, cy=it.y+it.h/2; let dx=0,dy=0,r=it.r;
      for (const up of ITEMS){ if(up===it||!up.drop||(it.at!==undefined&&up.at<=it.at))continue;
        const vx=cx-(up.x+up.w/2), vy=cy-(up.y+up.h/2), len=Math.max(1,Math.hypot(vx,vy)); dx+=vx/len*8; dy+=vy/len*8; r+=Math.sign(it.r)*0.6; }
      const k=1-0.38*cp; const ox=(cx+dx-PILE.x)*k+PILE.x, oy=(cy+dy-PILE.y)*k+PILE.y; r+=Math.sign(it.r)*7*cp;
      // screen: scale about PILE then translate
      const sx=(ox-PILE.x)*sc+PILE.x+(FC.x-PILE.x)*tr, sy=(oy-PILE.y)*sc+PILE.y+(FC.y-PILE.y)*tr;
      const th=r*Math.PI/180, hw=it.w/2*sc, hh=it.h/2*sc;
      const pts=[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]].map(([a,b])=>[sx+a*Math.cos(th)-b*Math.sin(th), sy+a*Math.sin(th)+b*Math.cos(th)]);
      boxes.push({id:it.id,pts,sx,sy});
      // gap to headline lines: for each line y-band, min x of polygon within band
      for (const [y0,y1,x1] of HEAD){
        // sample polygon edges
        for (let i=0;i<4;i++){ const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%4];
          for (let s=0;s<=40;s++){ const px=ax+(bx-ax)*s/40, py=ay+(by-ay)*s/40; if(py>=y0&&py<=y1){ const g=px-x1; if(g<minGap){minGap=g;who=it.id+'@'+y0;} } } }
      }
    }
    const hudO = 1 - tw(f,110,118,E.in);
    const liga=boxes.find(b=>b.id==='liga');
    const v = prev? Math.hypot(liga.sx-prev.sx, liga.sy-prev.sy):0; prev=liga;
    console.log(f, 'cp',cp.toFixed(3),'sc',sc.toFixed(3),'tr',tr.toFixed(3),'gap',minGap.toFixed(0),who,'hud',hudO.toFixed(2),'ligaV',v.toFixed(1));
  }
}
const scaleF=(f,cp)=>tw(f,0,90,E.inOut)*0.02+1; 
const S0=(f,cp)=>(1+0.02*tw(f,0,90,E.inOut))*(1-0.4*cp);
run('current', f=>tw(f,90,119,E.in), f=>tw(f,104,119,E.in), S0);

const args=process.argv.slice(2);
if(args.length){ const [c0,c1,a,b,c,d]=args[0].split(',').map(Number); const [t0,t1,e,f2,g,h]=args[1].split(',').map(Number);
 const ec=Easing.bezier(a,b,c,d), et=Easing.bezier(e,f2,g,h);
 run('cand', f=>tw(f,c0,c1,ec), f=>tw(f,t0,t1,et), S0); }
