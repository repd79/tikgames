// ============ Clásicos de recreativa (años 80): reinterpretaciones propias ============
const AF="'Press Start 2P',monospace";

// ---- DEFENSA (estilo Missile Command) ----
def({id:'missile',title:'DEFENSA',emoji:'🚀',tag:'arcade · 1980',hint:'👆 TOCA el cielo para interceptar los misiles antes de que caigan',style:'arcade-night',skin:'flat',
colors:['#000010','#00102a','#ff4d4d'],font:AF,
music:{bpm:150,root:45,scale:'phrygian',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'break',density:.8,vol:.1,len:.5,oct:1},
create(c){
  const g=c.g,W=c.W,gy=Math.round(c.B-18),bx=W/2;
  let cities,enemies=[],shots=[],booms=[],wave=0,toSpawn=0,spT=0,cd=0,waveWait=1;
  cities=[0,1,2,3,4].map(i=>({x:30+i*((W-60)/4)+(i>1?0:0),alive:true}));
  cities.forEach((ct,i)=>{if(i>=2)ct.x=ct.x});
  const nextWave=()=>{wave++;toSpawn=6+wave*3;spT=0;waveWait=0;c.say('OLEADA '+wave,900)};
  nextWave();
  c.down(p=>{if(c.dead||cd>0||p.y>gy-30)return;cd=.28;const d=Math.hypot(p.x-bx,p.y-gy);shots.push({x:bx,y:gy-6,tx:p.x,ty:p.y,t:0,d,sp:650});c.sfx('tap',1.5)});
  c.loop((dt,t)=>{
    if(!c.dead){
      cd=Math.max(0,cd-dt);
      if(toSpawn>0){spT-=dt;if(spT<=0){spT=Math.max(.35,1.3-wave*.08)*c.R(.6,1.2);toSpawn--;
        const tg=c.pick(cities.filter(q=>q.alive).concat([{x:bx}]));const sx=c.R(10,W-10);
        enemies.push({x0:sx,y0:c.T-10,x:sx,y:c.T-10,tx:tg.x+c.R(-8,8),ty:gy-8,sp:60+wave*10+c.R(0,25),t:0})}}
      else if(!enemies.length&&!booms.length){waveWait+=dt;if(waveWait>1.2)nextWave()}
      for(const s of shots){s.t+=dt*s.sp/s.d;s.x=bx+(s.tx-bx)*Math.min(1,s.t);s.y=gy-6+(s.ty-(gy-6))*Math.min(1,s.t);if(s.t>=1){s.dead=true;booms.push({x:s.tx,y:s.ty,t:0,mine:true})}}
      shots=shots.filter(s=>!s.dead);
      for(const b of booms){b.t+=dt}
      booms=booms.filter(b=>b.t<(b.mine?1.1:.8));
      for(const e of enemies){const L=Math.hypot(e.tx-e.x0,e.ty-e.y0);e.t+=dt*e.sp/L;const k=Math.min(1,e.t);e.x=e.x0+(e.tx-e.x0)*k;e.y=e.y0+(e.ty-e.y0)*k;
        for(const b of booms){if(!b.mine)continue;const r=b.t<.35?b.t/.35*44:b.t<.8?44:44*(1-(b.t-.8)/.3);if(Math.hypot(e.x-b.x,e.y-b.y)<r){e.dead=true;c.setScore(c.sc+5);c.sfx('pop',1.1);booms.push({x:e.x,y:e.y,t:0,mine:true,small:true});break}}
        if(!e.dead&&e.t>=1){e.dead=true;c.sfx('hit');c.shake(8);booms.push({x:e.tx,y:gy-6,t:0,mine:false});
          for(const q of cities)if(q.alive&&Math.abs(q.x-e.tx)<26){q.alive=false}
          if(cities.every(q=>!q.alive)){c.after(900,()=>c.over('CIUDADES PERDIDAS'))}}}
      enemies=enemies.filter(e=>!e.dead);
    }
    c.rect(0,0,W,c.H,'#000010');
    g.fillStyle='#07103a';for(let y=0;y<gy;y+=3)g.fillRect(0,y,W,1);
    for(const e of enemies){g.strokeStyle='#ff4d4d';g.lineWidth=2;g.beginPath();g.moveTo(e.x0,e.y0);g.lineTo(e.x,e.y);g.stroke();c.rect(e.x-3,e.y-3,6,6,'#fff')}
    for(const s of shots){g.strokeStyle='#4dffea';g.lineWidth=2;g.beginPath();g.moveTo(bx,gy-6);g.lineTo(s.x,s.y);g.stroke();c.rect(s.tx-5,s.ty-1,10,2,'#4dffea');c.rect(s.tx-1,s.ty-5,2,10,'#4dffea')}
    for(const b of booms){const r=b.t<.35?b.t/.35*44:b.t<.8?44:44*(1-(b.t-.8)/.3);const rr=(b.small?r*.55:r)*(b.mine?1:.8);const f=Math.floor(t*14)%2;
      c.circle(b.x,b.y,Math.max(0,rr),f?'#fff':(b.mine?'#ffd23a':'#ff8040'));c.circle(b.x,b.y,Math.max(0,rr*.55),f?(b.mine?'#ff4d4d':'#ffd23a'):'#fff')}
    c.rect(0,gy,W,c.H-gy,'#c8641a');c.rect(0,gy,W,4,'#ffb347');
    for(const q of cities){if(q.alive){c.rect(q.x-20,gy-16,40,16,'#4dffea');c.rect(q.x-14,gy-26,12,10,'#4dffea');c.rect(q.x+4,gy-22,14,6,'#4dffea');g.fillStyle='#003a40';for(let i=0;i<4;i++)g.fillRect(q.x-16+i*9,gy-11,4,5)}
      else{c.rect(q.x-18,gy-6,36,6,'#5a2a10');c.rect(q.x-8,gy-10,10,4,'#5a2a10')}}
    c.rect(bx-18,gy-8,36,8,'#ffd23a');c.rect(bx-8,gy-16,16,8,'#ffd23a');
    ST.scan(g,W,c.H,.18);
  });
}});

// ---- CIEMPIÉS (estilo Centipede) ----
def({id:'centi',title:'CIEMPIÉS',emoji:'🐛',tag:'arcade · 1981',hint:'👆 ARRASTRA para moverte · disparas solo. ¡Parte el ciempiés!',style:'arcade-garden',skin:'flat',
colors:['#000000','#05200a','#46e05a'],font:AF,
music:{bpm:158,root:52,scale:'minpent',lead:'square',bassw:'square',bass:'walk',drums:'hats',density:.85,vol:.1,len:.5,oct:1},
create(c){
  const g=c.g,W=c.W,cs=Math.floor((W-12)/13),cols=13,ox=Math.round((W-cols*cs)/2),oy=Math.round(c.T+8),rows=Math.floor((c.PH-12)/cs),zone=rows-5;
  const key=(a,b)=>b*cols+a;
  let mush,chains=[],px=W/2,py=0,bl=[],fire=0,lives=3,inv=0,stepT=0,lvl=0,flash=0;
  function init(){mush=Array(cols*rows).fill(0);for(let i=0,n=18;i<n;i++){const a=c.RI(0,cols-1),b=c.RI(1,zone-1);mush[key(a,b)]=4}spawn()}
  function spawn(){lvl++;const n=Math.min(14,9+lvl);chains=[{seg:Array.from({length:n},(_,i)=>({c:-i,r:0})),dir:1,vd:1}];}
  py=oy+(rows-1)*cs+cs/2;
  const mv=p=>{px=c.clamp(p.x,ox+cs/2,ox+cols*cs-cs/2);py=c.clamp(p.y-50,oy+zone*cs+cs/2,oy+rows*cs-cs/2)};
  c.down(mv);c.move(mv);init();
  const blocked=(a,b)=>a<0||a>=cols||(b>=0&&b<rows&&mush[key(a,b)]>0);
  c.loop((dt,t)=>{
    if(!c.dead){
      inv=Math.max(0,inv-dt);fire-=dt;if(fire<=0){fire=.17;bl.push({x:px,y:py-14});c.sfx('tick')}
      for(const b of bl){b.y-=760*dt;const a=Math.floor((b.x-ox)/cs),r=Math.floor((b.y-oy)/cs);
        if(r>=0&&r<rows&&a>=0&&a<cols&&mush[key(a,r)]>0){mush[key(a,r)]--;b.dead=true;c.setScore(c.sc+1);c.sfx('pop',.7);continue}
        for(let ci=0;ci<chains.length&&!b.dead;ci++){const ch=chains[ci];const i=ch.seg.findIndex(s=>s.c===a&&s.r===r);
          if(i>=0){b.dead=true;const s=ch.seg[i];if(s.r>=0&&s.r<rows)mush[key(s.c,s.r)]=4;c.setScore(c.sc+(i===0?100:10));c.sfx('hit',1.2);c.burst(ox+(s.c+.5)*cs,oy+(s.r+.5)*cs,'#46e05a',8,150);
            const left=ch.seg.slice(0,i),right=ch.seg.slice(i+1);chains.splice(ci,1);
            if(left.length)chains.push({seg:left,dir:ch.dir,vd:ch.vd});
            if(right.length)chains.push({seg:right,dir:-ch.dir,vd:ch.vd});}}
        if(b.y<oy)b.dead=true}
      bl=bl.filter(b=>!b.dead);
      stepT+=dt;const iv=Math.max(.06,.14-lvl*.006);
      if(stepT>=iv){stepT-=iv;
        for(const ch of chains){const h=ch.seg[0];let nc=h.c+ch.dir,nr=h.r;
          if(blocked(nc,nr)){nr=h.r+ch.vd;nc=h.c;ch.dir=-ch.dir;if(nr>=rows){ch.vd=-1;nr=h.r-1}else if(nr<zone&&ch.vd<0){ch.vd=1}}
          ch.seg.unshift({c:nc,r:nr});ch.seg.pop()}}
      if(!chains.length){c.sfx('win');c.say('¡OTRO CIEMPIÉS!',900);spawn()}
      if(inv<=0)for(const ch of chains)for(const s of ch.seg){const sx=ox+(s.c+.5)*cs,sy=oy+(s.r+.5)*cs;if(Math.hypot(sx-px,sy-py)<cs*.6){lives--;inv=1.8;flash=.3;c.sfx('lose');c.shake(10);c.burst(px,py,'#fff',16,200);if(lives<=0)c.over('TE COMIERON');break}}
    }
    flash=Math.max(0,flash-dt);
    c.rect(0,0,W,c.H,'#000');
    g.fillStyle='#05200a';g.fillRect(ox,oy+zone*cs,cols*cs,(rows-zone)*cs);
    for(let b=0;b<rows;b++)for(let a=0;a<cols;a++){const m=mush[key(a,b)];if(!m)continue;const X=ox+a*cs,Y=oy+b*cs,col=['','#ff4d4d','#ff9a3d','#ffe14d','#d96bff'][m];
      c.rect(X+3,Y+cs*.5,cs-6,cs*.5-2,'#f2e6c8');c.rect(X+1,Y+2,cs-2,cs*.55,col);c.rect(X+cs*.28,Y+cs*.2,4,4,'#fff');c.rect(X+cs*.6,Y+cs*.32,4,4,'#fff')}
    for(const ch of chains)ch.seg.forEach((s,i)=>{const X=ox+s.c*cs,Y=oy+s.r*cs;if(s.c<0||s.c>=cols)return;c.rect(X+1,Y+1,cs-2,cs-2,i===0?'#ff4d9e':'#46e05a');c.rect(X+4,Y+4,cs-8,cs-8,i===0?'#ff9ad0':'#8dff9a');
      if(i===0){c.rect(X+5,Y+6,4,4,'#000');c.rect(X+cs-9,Y+6,4,4,'#000')}else{c.rect(X-1,Y+cs*.5,3,3,'#46e05a');c.rect(X+cs-2,Y+cs*.5,3,3,'#46e05a')}});
    for(const b of bl)c.rect(b.x-1.5,b.y-8,3,12,'#ffe14d');
    if(inv<=0||Math.floor(t*14)%2){c.rect(px-8,py-3,16,10,'#ffe14d');c.rect(px-3,py-10,6,10,'#ffe14d');c.rect(px-12,py+4,24,4,'#ff9a3d')}
    for(let i=0;i<lives;i++)c.rect(14+i*16,c.T+2,10,10,'#ffe14d');
    ST.scan(g,W,c.H,.15);
  });
}});

// ---- PIRÁMIDE (estilo Q*bert: saltar por cubos) ----
def({id:'pyramid',title:'PIRÁMIDE',emoji:'🔷',tag:'arcade · 1982',hint:'👆 TOCA hacia dónde saltar (diagonal). Pinta todos los cubos',style:'iso-pop',skin:'flat',
colors:['#1a0b3b','#2b1259','#ffcf3a'],font:AF,
music:{bpm:132,root:57,scale:'major',lead:'square',bassw:'triangle',bass:'walk',drums:'hats',density:.7,vol:.1,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W,N=6,cw=Math.min(62,Math.floor((W-30)/N)),chh=Math.round(cw*.55),top=Math.round(c.T+60),cx=W/2;
  const pos=(r,k)=>({x:cx+(k-r/2)*cw,y:top+r*(chh*.78+cw*.12)});
  let col,hero,balls=[],spawnT=2,lvl=1,hopT=0,fall=null,flash=0,painted;
  const CT=['#3a4fd8','#ffcf3a'];
  function reset(){col=[];for(let r=0;r<N;r++)col.push(Array(r+1).fill(0));hero={r:0,k:0,fr:null,to:null,t:0};balls=[];painted=0;col[0][0]=1;painted=1;spawnT=2}
  reset();
  const total=N*(N+1)/2;
  function hop(dr,dk){
    if(c.dead||hero.to||fall)return;
    const nr=hero.r+dr,nk=hero.k+dk;
    hero.fr={r:hero.r,k:hero.k};hero.to={r:nr,k:nk};hero.t=0;c.sfx('jump',1.3)}
  c.down(p=>{const h=pos(hero.r,hero.k);const dx=p.x-h.x,dy=p.y-(h.y-chh*.4);hop(dy<0?-1:1,dx<0?(dy<0?-1:0):(dy<0?0:1))});
  function land(){
    const{r,k}=hero.to;hero.r=r;hero.k=k;hero.fr=null;hero.to=null;
    if(r<0||r>=N||k<0||k>r){fall={t:0};c.sfx('lose');c.shake(8);c.after(700,()=>c.over('¡TE CAÍSTE!'));return}
    if(col[r][k]===0){col[r][k]=1;painted++;c.setScore(c.sc+25);c.sfx('coin',1+painted*.01)}
    if(painted>=total){lvl++;c.setScore(c.sc+200);c.sfx('win');c.say('¡PIRÁMIDE PINTADA!',1100);c.after(900,()=>{if(!c.dead)reset()})}
  }
  c.loop((dt,t)=>{
    if(!c.dead){
      if(hero.to){hero.t+=dt/.26;if(hero.t>=1)land()}
      if(fall)fall.t+=dt;
      spawnT-=dt;if(spawnT<=0&&painted<total){spawnT=Math.max(1.6,3.6-lvl*.2);balls.push({r:0,k:0,t:0,to:null})}
      for(const b of balls){b.t+=dt;if(!b.to&&b.t>Math.max(.45,.8-lvl*.04)){b.t=0;const d=Math.random()<.5?0:1;b.to={r:b.r+1,k:b.k+d};b.f=0}
        if(b.to){b.f+=dt/.3;if(b.f>=1){b.r=b.to.r;b.k=b.to.k;b.to=null;b.t=0;if(b.r>=N)b.dead=true}}
        if(!b.dead&&!hero.to&&!fall&&!b.to&&b.r===hero.r&&b.k===hero.k){flash=.4;fall={t:0};c.sfx('hit');c.shake(12);c.after(700,()=>c.over('¡TE ATRAPARON!'))}}
      balls=balls.filter(b=>!b.dead)}
    flash=Math.max(0,flash-dt);
    c.bgGrad('#1a0b3b','#2b1259');
    g.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<30;i++)g.fillRect((i*97)%W,(i*53+t*10)%c.H,2,2);
    // cubos
    for(let r=0;r<N;r++)for(let k=0;k<=r;k++){const p=pos(r,k),w=cw/2;
      g.fillStyle=CT[col[r][k]];g.beginPath();g.moveTo(p.x,p.y-chh/2);g.lineTo(p.x+w,p.y);g.lineTo(p.x,p.y+chh/2);g.lineTo(p.x-w,p.y);g.closePath();g.fill();
      g.fillStyle='#d8582c';g.beginPath();g.moveTo(p.x-w,p.y);g.lineTo(p.x,p.y+chh/2);g.lineTo(p.x,p.y+chh/2+cw*.34);g.lineTo(p.x-w,p.y+cw*.34);g.closePath();g.fill();
      g.fillStyle='#8f3314';g.beginPath();g.moveTo(p.x+w,p.y);g.lineTo(p.x,p.y+chh/2);g.lineTo(p.x,p.y+chh/2+cw*.34);g.lineTo(p.x+w,p.y+cw*.34);g.closePath();g.fill();
      g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(p.x,p.y-chh/2);g.lineTo(p.x+w,p.y);g.lineTo(p.x,p.y+chh/2);g.lineTo(p.x-w,p.y);g.closePath();g.stroke()}
    const at=(r,k,to,f)=>{let a=pos(r,k);if(to){const b=pos(to.r,to.k);const x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f-Math.sin(f*Math.PI)*cw*.55;return{x,y}}return{x:a.x,y:a.y}};
    for(const b of balls){const q=at(b.r,b.k,b.to,b.f||0);c.circle(q.x,q.y-chh*.35-cw*.08,cw*.2,'rgba(0,0,0,.35)');c.circle(q.x,q.y-chh*.35-cw*.2,cw*.22,'#ff4d6d');c.circle(q.x-cw*.06,q.y-chh*.35-cw*.26,cw*.07,'#fff')}
    // héroe: bolita saltarina con piernas
    let hp=at(hero.fr?hero.fr.r:hero.r,hero.fr?hero.fr.k:hero.k,hero.to,hero.to?Math.min(1,hero.t):0);
    let hy=hp.y-chh*.35;if(fall){hy+=fall.t*fall.t*900;g.globalAlpha=Math.max(0,1-fall.t*1.4)}
    const hr=cw*.3;
    c.rect(hp.x-hr*.7,hy+hr*.5,hr*.5,hr*.7,'#ffcf3a');c.rect(hp.x+hr*.2,hy+hr*.5,hr*.5,hr*.7,'#ffcf3a');
    c.circle(hp.x,hy-hr*.2,hr,'#3ad1ff');c.circle(hp.x-hr*.35,hy-hr*.35,hr*.28,'#fff');c.circle(hp.x+hr*.35,hy-hr*.35,hr*.28,'#fff');c.circle(hp.x-hr*.3,hy-hr*.3,hr*.12,'#000');c.circle(hp.x+hr*.4,hy-hr*.3,hr*.12,'#000');
    g.globalAlpha=1;
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
    c.txt('NIVEL '+lvl,W-60,c.T+4,10,'#ffcf3a','center');
  });
}});

// ---- JUSTA (estilo Joust: aletea y embiste desde arriba) ----
def({id:'joust',title:'JUSTA AÉREA',emoji:'🦅',tag:'arcade · 1982',hint:'👆 TOCA izq./der. para aletear y avanzar. ¡Embiste desde ARRIBA!',style:'arcade-lava',skin:'flat',
colors:['#14041a','#3a0a1f','#ff9a3d'],font:AF,
music:{bpm:140,root:50,scale:'harm',lead:'square',bassw:'sawtooth',bass:'walk',drums:'four',density:.8,vol:.1,len:.5,oct:1},
create(c){
  const g=c.g,W=c.W,lava=Math.round(c.B-6);
  const PL=[{x:W*.5-70,y:c.T+170,w:140},{x:-10,y:c.T+310,w:150},{x:W-140,y:c.T+310,w:150},{x:W*.5-80,y:c.T+450,w:160},{x:0,y:c.T+60,w:90},{x:W-90,y:c.T+60,w:90}].filter(p=>p.y<lava-60);
  const RID=["..yy....","..yyy...","bbbyyyy.","bbbbyyyyy","..yyyyyy.",".yyyyyy.","..y..y.."];
  let P,en=[],lives=3,wave=0,inv=0,eggs=[],flash=0;
  const mk=(x,y,ty)=>({x,y,vx:ty.vx,vy:0,r:ty.r,fl:c.R(.3,1),t:ty,dir:Math.random()<.5?-1:1,dead:false});
  function spawnWave(){wave++;const n=Math.min(7,2+wave);const TY=[{vx:70,r:'#ff4d4d',f:.9},{vx:100,r:'#4d9bff',f:.7},{vx:130,r:'#b266ff',f:.55}];
    for(let i=0;i<n;i++){const ty=TY[Math.min(TY.length-1,Math.floor((wave-1+i*.5)/2))];en.push(mk(c.R(30,W-30),c.T+30+(i%3)*10,ty));en[en.length-1].dir=i%2?1:-1}c.say('OLEADA '+wave,900)}
  function respawn(){P={x:W/2,y:PL[3]?PL[3].y-20:c.B-100,vx:0,vy:0,face:1};inv=2}
  respawn();spawnWave();
  const flap=d=>{if(c.dead)return;P.vy=Math.max(-340,P.vy-250);P.vx=c.clamp(P.vx+d*150,-230,230);P.face=d;c.sfx('tap',1.5)};
  c.down(p=>flap(p.x<W/2?-1:1));
  c.loop((dt,t)=>{
    if(!c.dead){
      inv=Math.max(0,inv-dt);
      P.vy+=720*dt;P.x+=P.vx*dt;P.y+=P.vy*dt;P.vx*=1-.25*dt;
      if(P.x<-10)P.x=W+10;if(P.x>W+10)P.x=-10;
      if(P.y<c.T+14){P.y=c.T+14;P.vy=Math.max(0,P.vy)}
      for(const pl of PL){if(P.vy>0&&P.x>pl.x-8&&P.x<pl.x+pl.w+8&&P.y+14>=pl.y&&P.y+14<=pl.y+16+P.vy*dt){P.y=pl.y-14;P.vy=0;P.vx*=.9}}
      if(P.y>lava-12){lives--;flash=.4;c.sfx('lose');c.shake(10);c.burst(P.x,lava,'#ff9a3d',20,240);if(lives<=0){c.over('A LA LAVA')}else respawn()}
      for(const e of en){
        e.fl-=dt;if(e.fl<=0){e.fl=c.R(.25,.9)*(e.t.f+.3);e.vy=Math.max(-300,e.vy-230)}
        e.vy+=720*dt;e.x+=e.dir*e.vx*dt;e.y+=e.vy*dt;
        if(e.x<-10)e.x=W+10;if(e.x>W+10)e.x=-10;if(e.y<c.T+14){e.y=c.T+14;e.vy=Math.max(0,e.vy)}
        for(const pl of PL){if(e.vy>0&&e.x>pl.x-8&&e.x<pl.x+pl.w+8&&e.y+14>=pl.y&&e.y+14<=pl.y+16+e.vy*dt){e.y=pl.y-14;e.vy=0;if(Math.random()<.5)e.dir=-e.dir}}
        if(e.y>lava-12){e.y=lava-12;e.vy=-320}
        if(!e.dead&&inv<=0&&Math.abs(P.x-e.x)<22&&Math.abs(P.y-e.y)<20){
          if(P.y<e.y-4){e.dead=true;c.setScore(c.sc+20);c.sfx('coin');c.burst(e.x,e.y,e.t.r,12,200);eggs.push({x:e.x,y:e.y,vy:-100,t:0})}
          else if(e.y<P.y-4){lives--;flash=.4;c.sfx('lose');c.shake(10);c.burst(P.x,P.y,'#fff',14,200);if(lives<=0)c.over('DERRIBADO');else respawn();break}
          else{const d=Math.sign(P.x-e.x)||1;P.vx=d*180;e.dir=-d;e.vy=-140;P.vy=-140;c.sfx('bump')}}}
      en=en.filter(e=>!e.dead);
      for(const e of eggs){e.vy+=720*dt;e.y+=e.vy*dt;for(const pl of PL){if(e.vy>0&&e.x>pl.x&&e.x<pl.x+pl.w&&e.y+6>=pl.y&&e.y<=pl.y+14){e.y=pl.y-6;e.vy=0}}
        if(Math.abs(e.x-P.x)<18&&Math.abs(e.y-P.y)<20){e.dead=true;c.setScore(c.sc+10);c.sfx('coin',1.4)}if(e.y>lava)e.dead=true;e.t+=dt;if(e.t>6)e.dead=true}
      eggs=eggs.filter(e=>!e.dead);
      if(!en.length){wave>0&&c.sfx('win');spawnWave()}
    }
    flash=Math.max(0,flash-dt);
    c.bgGrad('#14041a','#3a0a1f');g.fillStyle='rgba(255,154,61,.05)';for(let i=0;i<6;i++)g.fillRect(0,c.T+i*90,W,2);
    for(const pl of PL){c.rect(pl.x,pl.y,pl.w,12,'#8f5a2a');c.rect(pl.x,pl.y,pl.w,4,'#d8934a');g.fillStyle='#5a3414';for(let x=pl.x+8;x<pl.x+pl.w;x+=18)g.fillRect(x,pl.y+6,10,3)}
    c.rect(0,lava,W,c.H-lava,'#ff5a1a');for(let x=0;x<W;x+=22){c.rect(x,lava-4-Math.sin(t*4+x)*4,22,10,'#ffb347')}
    for(const e of eggs)c.circle(e.x,e.y-3,6,'#fff2c8');
    const bird=(o,body,rider,flip)=>{const px=3,fl=(o.vy<0?1:0);ST.spr(g,RID,o.x-4*px,o.y-6*px-(fl?2:0),px,{y:body,b:rider},flip<0);
      c.rect(o.x-6*px*.5,o.y+2*px,3,6,'#ffb347');c.rect(o.x+3,o.y+2*px,3,6,'#ffb347');
      c.rect(o.x+(flip<0?-1:1)*5*px*.6-2,o.y-6*px-1,3,3,'#fff');c.rect(o.x-10+(flip<0?2:0),o.y-4*px-(fl?10:0)-4,20,4,body)};
    for(const e of en)bird(e,e.t.r,'#ffe14d',e.dir);
    if(inv<=0||Math.floor(t*14)%2)bird(P,'#ffd23a','#3ad1ff',P.face);
    for(let i=0;i<lives;i++)c.rect(14+i*16,c.T+4,10,10,'#3ad1ff');
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
  });
}});

// ---- RÍO (estilo River Raid: vuela por el río) ----
def({id:'river',title:'RÍO DE FUEGO',emoji:'✈️',tag:'atari · 1982',hint:'👆 ARRASTRA ↔ para pilotar. Dispara a los depósitos de FUEL para repostar',style:'river-2600',skin:'flat',
colors:['#1f4fd0','#143a9a','#ffe14d'],font:AF,
music:{bpm:152,root:55,scale:'major',lead:'square',bassw:'square',bass:'pulse',drums:'hats',density:.8,vol:.1,len:.5,oct:1},
create(c){
  const g=c.g,W=c.W,RH=18;
  let rows=[],ent=[],bl=[],pl={x:W/2,y:c.B-60},fuel=100,sp=140,dist=0,cen=W/2,wid=W*.6,lives=3,inv=0,flash=0,nextBridge=1600,scroll=0;
  const addRow=()=>{cen+=c.R(-26,26);wid+=c.R(-18,18);wid=c.clamp(wid,150,W*.78);cen=c.clamp(cen,wid/2+16,W-wid/2-16);
    const y=rows.length?rows[rows.length-1].y-RH:c.B;rows.push({y,l:cen-wid/2,r:cen+wid/2,br:false});
    const row=rows[rows.length-1];
    if(dist+(c.B-y)>=nextBridge){row.br=true;nextBridge+=1900;row.l=Math.max(row.l-20,12);row.r=Math.min(row.r+20,W-12)}
    else if(Math.random()<.12){const k=Math.random(),x=row.l+30+Math.random()*(row.r-row.l-60);
      if(k<.4)ent.push({k:'ship',x,y:y-10,dir:Math.random()<.5?-1:1,hp:1});else if(k<.7)ent.push({k:'heli',x,y:y-10,dir:Math.random()<.5?-1:1,hp:1});else ent.push({k:'fuel',x,y:y-10,hp:1})}}
  for(let i=0;i<Math.ceil(c.H/RH)+6;i++)addRow();
  const mv=p=>{pl.x=c.clamp(p.x,20,W-20)};c.down(mv);c.move(mv);
  const rowAt=y=>rows.find(r=>y>=r.y&&y<r.y+RH)||rows[0];
  let fire=0;
  c.loop((dt,t)=>{
    if(!c.dead){
      inv=Math.max(0,inv-dt);sp=140+Math.min(120,dist/80);
      const d=sp*dt;dist+=d;rows.forEach(r=>r.y+=d);ent.forEach(e=>e.y+=d);bl.forEach(b=>b.y+=d*0);
      while(rows[rows.length-1].y>-RH)addRow();
      rows=rows.filter(r=>r.y<c.H+RH);ent=ent.filter(e=>e.y<c.H+40);
      fire-=dt;if(fire<=0){fire=.2;bl.push({x:pl.x,y:pl.y-16});c.sfx('tick')}
      for(const b of bl){b.y-=620*dt;const rw=rowAt(b.y);if(rw&&rw.br&&Math.abs(b.y-(rw.y+RH/2))<RH){rw.br=false;rw.l=Math.max(12,cen-wid/2);rw.r=Math.min(W-12,cen+wid/2);b.dead=true;c.setScore(c.sc+500);c.sfx('win');c.shake(10);c.burst(W/2,rw.y,'#ffe14d',30,300)}
        for(const e of ent){if(e.dead)continue;if(Math.abs(b.x-e.x)<20&&Math.abs(b.y-e.y)<14){e.dead=true;b.dead=true;c.setScore(c.sc+(e.k==='fuel'?80:e.k==='heli'?60:30));c.sfx('pop');c.burst(e.x,e.y,e.k==='fuel'?'#ff4d4d':'#ffe14d',14,200);break}}
        if(b.y<0)b.dead=true}
      bl=bl.filter(b=>!b.dead);ent=ent.filter(e=>!e.dead);
      fuel-=dt*5.5;
      for(const e of ent){if(e.k==='ship'||e.k==='heli'){e.x+=e.dir*(e.k==='heli'?70:50)*dt;const rw=rowAt(e.y);if(rw&&(e.x<rw.l+22||e.x>rw.r-22))e.dir=-e.dir}
        if(Math.abs(pl.x-e.x)<22&&Math.abs(pl.y-e.y)<18){if(e.k==='fuel'){fuel=Math.min(100,fuel+dt*45)}else if(inv<=0)hit()}}
      const rw=rowAt(pl.y);if(inv<=0&&rw&&(pl.x-12<rw.l||pl.x+12>rw.r||rw.br))hit();
      if(fuel<=0){fuel=0;if(!c.dead){c.sfx('lose');c.over('SIN COMBUSTIBLE')}}
      c.setScore(c.sc)}
    function hit(){lives--;inv=2;flash=.4;c.sfx('hit');c.shake(12);c.burst(pl.x,pl.y,'#ff9a3d',22,240);fuel=Math.max(fuel,60);const r2=rowAt(pl.y);pl.x=r2&&!r2.br?(r2.l+r2.r)/2:W/2;if(lives<=0)c.over('DERRIBADO')}
    flash=Math.max(0,flash-dt);
    c.rect(0,0,W,c.H,'#1f4fd0');
    for(const r of rows){c.rect(0,r.y,r.l,RH+1,'#2f9f3a');c.rect(r.r,r.y,W-r.r,RH+1,'#2f9f3a');c.rect(r.l-4,r.y,4,RH+1,'#1d6b27');c.rect(r.r,r.y,4,RH+1,'#1d6b27');
      if(r.br){c.rect(0,r.y,W,RH,'#7a7a7a');c.rect(0,r.y+3,W,3,'#bdbdbd');c.rect(0,r.y+RH-4,W,4,'#4a4a4a');g.fillStyle='#ffe14d';for(let x=6;x<W;x+=28)g.fillRect(x,r.y+8,14,2)}}
    for(const e of ent){const X=Math.round(e.x),Y=Math.round(e.y);
      if(e.k==='fuel'){c.rect(X-14,Y-16,28,32,'#fff');for(let i=0;i<4;i++)c.rect(X-14,Y-16+i*8,28,4,'#e63946');c.txt('F',X,Y,10,'#000')}
      else if(e.k==='ship'){c.rect(X-18,Y-4,36,10,'#1b1b1b');c.rect(X-10,Y-12,20,8,'#8a8a8a');c.rect(X+4,Y-16,3,6,'#ff4d4d')}
      else{c.rect(X-12,Y-4,24,8,'#ff9a3d');c.rect(X-18,Y-10,36,3,'#fff');c.rect(X+10,Y-3,10,3,'#ff9a3d');c.rect(X-3,Y-10,6,6,'#c85a10')}}
    for(const b of bl)c.rect(b.x-2,b.y-8,4,12,'#ffe14d');
    if(inv<=0||Math.floor(t*14)%2){const X=Math.round(pl.x),Y=Math.round(pl.y);c.rect(X-3,Y-18,6,36,'#ffe14d');c.rect(X-18,Y-2,36,8,'#ffe14d');c.rect(X-9,Y+10,18,5,'#ffe14d');c.rect(X-2,Y-12,4,8,'#1f4fd0')}
    // medidor de combustible
    c.rect(W/2-70,c.T+2,140,16,'#000');c.rect(W/2-67,c.T+5,Math.max(0,134*fuel/100),10,fuel<25&&Math.floor(t*6)%2?'#ff4d4d':'#ffe14d');c.txt('FUEL',W/2,c.T+30,9,'#fff','center');
    for(let i=0;i<lives;i++)c.rect(14+i*16,c.T+4,10,10,'#ffe14d');
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
  });
}});

// ---- MOTOS (estilo Tron: encierra al rival con tu estela) ----
def({id:'tron',title:'MOTOS DE LUZ',emoji:'🏍️',tag:'arcade · 1982',hint:'👆 TOCA izq./der. para girar. No choques con las estelas',style:'tron-grid',skin:'flat',
colors:['#000812','#001a2e','#00e5ff'],font:AF,
music:{bpm:138,root:43,scale:'minor',lead:'sawtooth',bassw:'sawtooth',bass:'walk',drums:'four',density:.75,vol:.09,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W,cs=Math.floor((W-12)/26),cols=26,rows=Math.floor((c.PH-4)/cs),ox=Math.round((W-cols*cs)/2),oy=Math.round(c.T+(c.PH-rows*cs)/2);
  const D=[[1,0],[0,1],[-1,0],[0,-1]];
  let G,me,ai,tick=0,wins=0,end=0,round=0;
  const free=(x,y)=>x>=0&&y>=0&&x<cols&&y<rows&&!G[y*cols+x];
  function reset(){G=Array(cols*rows).fill(0);me={x:3,y:rows>>1,d:0,alive:true};ai={x:cols-4,y:rows>>1,d:2,alive:true};G[me.y*cols+me.x]=1;G[ai.y*cols+ai.x]=2;tick=0;end=0;round++}
  reset();
  c.down(p=>{if(c.dead||!me.alive||end)return;me.nd=(me.d+(p.x<W/2?3:1))%4;c.sfx('tick',1.4)});
  function aiTurn(){
    const look=d=>{let n=0,x=ai.x,y=ai.y;while(n<12){x+=D[d][0];y+=D[d][1];if(!free(x,y))break;n++}return n};
    const f=look(ai.d),L=look((ai.d+3)%4),R=look((ai.d+1)%4);
    const rnd=Math.random();
    if(f<3||(rnd<.05+Math.max(0,.04-wins*.005)&&f>0)){const opts=[[L,(ai.d+3)%4],[R,(ai.d+1)%4]].sort((a,b)=>b[0]-a[0]);if(opts[0][0]>0||f===0)ai.d=opts[0][0]>=opts[1][0]?opts[0][1]:opts[1][1];if(f>=3&&Math.random()<.5&&opts[0][0]<4)return}
    else if(wins>1&&f<7&&Math.random()<.4){const best=[[L,(ai.d+3)%4],[R,(ai.d+1)%4]].sort((a,b)=>b[0]-a[0])[0];if(best[0]>f+3)ai.d=best[1]}
  }
  c.loop((dt,t)=>{
    if(!c.dead){
      if(end>0){end-=dt;if(end<=0&&!c.dead)reset()}
      else{
        tick+=dt;const iv=Math.max(.045,.11-wins*.006);
        while(tick>=iv&&!end){tick-=iv;
          if(me.nd!=null){me.d=me.nd;me.nd=null}
          aiTurn();
          const m={x:me.x+D[me.d][0],y:me.y+D[me.d][1]},a={x:ai.x+D[ai.d][0],y:ai.y+D[ai.d][1]};
          const mc=!free(m.x,m.y),ac=!free(a.x,a.y)||(m.x===a.x&&m.y===a.y);
          if(!mc){me.x=m.x;me.y=m.y;G[me.y*cols+me.x]=1}
          if(!ac){ai.x=a.x;ai.y=a.y;G[ai.y*cols+ai.x]=2}
          if(mc||ac){
            if(mc&&ac){c.sfx('hit');c.say('¡EMPATE!',900);end=1.2;me.alive=ai.alive=false}
            else if(mc){me.alive=false;c.sfx('lose');c.shake(12);c.burst(ox+me.x*cs,oy+me.y*cs,'#00e5ff',24,260);end=2;c.after(800,()=>c.over('TE ENCERRARON'))}
            else{ai.alive=false;wins++;c.setScore(wins);c.sfx('win');c.burst(ox+ai.x*cs,oy+ai.y*cs,'#ff9a3d',24,260);c.say('¡RONDA TUYA!',900);end=1.4}}}}
    }
    c.rect(0,0,W,c.H,'#000812');
    g.strokeStyle='rgba(0,229,255,.12)';g.lineWidth=1;for(let x=0;x<=cols;x++){g.beginPath();g.moveTo(ox+x*cs+.5,oy);g.lineTo(ox+x*cs+.5,oy+rows*cs);g.stroke()}for(let y=0;y<=rows;y++){g.beginPath();g.moveTo(ox,oy+y*cs+.5);g.lineTo(ox+cols*cs,oy+y*cs+.5);g.stroke()}
    g.strokeStyle='#00e5ff';g.lineWidth=2;g.strokeRect(ox-1,oy-1,cols*cs+2,rows*cs+2);
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const v=G[y*cols+x];if(!v)continue;const col=v===1?'#00e5ff':'#ff9a3d';c.rect(ox+x*cs+1,oy+y*cs+1,cs-2,cs-2,col);c.rect(ox+x*cs+3,oy+y*cs+3,cs-6,cs-6,v===1?'#bff8ff':'#ffe0b8')}
    for(const [b,col] of [[me,'#fff'],[ai,'#ffd28a']])if(b.alive)c.rect(ox+b.x*cs-1,oy+b.y*cs-1,cs+2,cs+2,col);
    c.txt('RONDA '+round,W/2,c.T-6,10,'#00e5ff','center');
    ST.scan(g,W,c.H,.12);
  });
}});
