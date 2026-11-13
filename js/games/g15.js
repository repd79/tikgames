// ============ Juegos de mesa y lógica: contra la máquina o puzles sin fin ============
const FF="'Fredoka',sans-serif";

// ---- CONECTA 4 (contra la IA) ----
def({id:'connect4',title:'CONECTA 4',emoji:'🔴',tag:'vs máquina',hint:'👆 TOCA una columna para soltar tu ficha. ¡Une cuatro!',style:'toy',skin:'flat',
colors:['#2ec4b6','#1a8f85','#ffd23a'],font:FF,
music:{bpm:112,root:55,scale:'major',lead:'triangle',bassw:'sine',bass:'root',drums:'tick',density:.45,vol:.1,len:.8,oct:1},
create(c){
  const g=c.g,W=c.W,N=7,M=6,cs=Math.floor(Math.min((W-24)/N,(c.PH-120)/M)),bx=Math.round((W-N*cs)/2),by=Math.round(c.T+(c.PH-M*cs)/2+24);
  const WIN=[];for(let r=0;r<M;r++)for(let k=0;k<N;k++){[[0,1],[1,0],[1,1],[1,-1]].forEach(d=>{const e=[];for(let i=0;i<4;i++){const rr=r+d[0]*i,cc=k+d[1]*i;if(rr<0||rr>=M||cc<0||cc>=N)return;e.push(rr*N+cc)}WIN.push(e)})}
  const ORD=[3,2,4,1,5,0,6];
  let b,h,turn,anim=null,win=null,wins=0,games=0,aiT=0,next=0;
  function reset(){b=Array(N*M).fill(0);h=Array(N).fill(M);turn=games%2===0?1:2;anim=null;win=null;aiT=0;next=0;games++}
  function ev(me){let s=0;for(const w of WIN){let a=0,o=0;for(const i of w){if(b[i]===me)a++;else if(b[i])o++}
    if(a&&o)continue;if(a===4)return 1e5;if(o===4)return -1e5;if(a)s+=[0,1,6,40][a];else if(o)s-=[0,1,7,45][o]}
    for(let r=0;r<M;r++){const v=b[r*N+3];if(v===me)s+=3;else if(v)s-=3}return s}
  function nm(d,al,be,me){const e=ev(me);if(e<=-1e5)return e-d;if(e>=1e5)return e+d;if(d===0)return e;
    let best=-1e9,any=false;for(const k of ORD){if(h[k]===0)continue;any=true;h[k]--;b[h[k]*N+k]=me;const v=-nm(d-1,-be,-al,3-me);b[h[k]*N+k]=0;h[k]++;
      if(v>best)best=v;if(best>al)al=best;if(al>=be)break}
    return any?best:0}
  function aiMove(){
    const depth=Math.min(6,2+wins),sc=[];
    for(const k of ORD){if(h[k]===0)continue;h[k]--;b[h[k]*N+k]=2;const v=-nm(depth-1,-1e9,1e9,1);b[h[k]*N+k]=0;h[k]++;sc.push([k,v+c.R(0,wins<2?30:2)])}
    sc.sort((x,y)=>y[1]-x[1]);return(wins===0&&Math.random()<.25)?sc[Math.min(sc.length-1,1)][0]:sc[0][0]}
  function findWin(who){for(const w of WIN)if(w.every(i=>b[i]===who))return w;return null}
  function dropIn(k,who){if(h[k]===0||anim)return false;const r=h[k]-1;anim={k,r,who,y:by-cs,v:0};h[k]--;c.sfx('tick');return true}
  reset();
  c.down(p=>{if(c.dead||turn!==1||anim||win||next)return;const k=Math.floor((p.x-bx)/cs);if(k>=0&&k<N)dropIn(k,1)});
  c.loop((dt,t)=>{
    if(!c.dead){
      if(anim){anim.v+=2600*dt;anim.y+=anim.v*dt;const ty=by+anim.r*cs+cs/2;
        if(anim.y>=ty){anim.y=ty;if(anim.v>260){anim.v=-anim.v*.28;c.sfx('bump',1.2)}else{
          b[anim.r*N+anim.k]=anim.who;const who=anim.who;anim=null;c.sfx('pop',who===1?1:.8);
          const w=findWin(who);
          if(w){win=w;next=1.4;if(who===1){wins++;c.setScore(wins);c.sfx('win');c.say('¡GANAS!',900)}else{c.sfx('lose');c.shake(8);c.after(900,()=>c.over('TE GANÓ LA MÁQUINA'))}}
          else if(b.every(v=>v)){next=1;c.say('¡TABLAS!',900)}
          else turn=3-who}}}
      else if(turn===2&&!win&&!next){aiT+=dt;if(aiT>.55){aiT=0;dropIn(aiMove(),2)}}
      if(next>0&&!c.dead){next-=dt;if(next<=0)reset()}
    }
    c.bgGrad('#2ec4b6','#1a8f85');
    c.txt(turn===1&&!win?'TU TURNO':win?'':'PENSANDO…',W/2,c.T+8,15,'#fff','center','rgba(0,0,0,.25)');
    // fichas
    const disc=(x,y,who,a)=>{c.circle(x,y,cs*.4,who===1?'#e63946':'#ffd23a');c.circle(x,y,cs*.29,who===1?'#c1121f':'#e9b700');c.circle(x-cs*.1,y-cs*.1,cs*.07,'rgba(255,255,255,.55)')};
    if(anim)disc(bx+anim.k*cs+cs/2,anim.y,anim.who);
    for(let r=0;r<M;r++)for(let k=0;k<N;k++){const v=b[r*N+k];if(v)disc(bx+k*cs+cs/2,by+r*cs+cs/2,v)}
    // tablero con agujeros
    g.save();g.beginPath();g.rect(bx-8,by-8,N*cs+16,M*cs+16);for(let r=0;r<M;r++)for(let k=0;k<N;k++){g.moveTo(bx+k*cs+cs/2+cs*.42,by+r*cs+cs/2);g.arc(bx+k*cs+cs/2,by+r*cs+cs/2,cs*.42,0,6.2832,true)}
    g.fillStyle='#1d4ed8';g.fill('evenodd');g.restore();
    c.rect(bx-8,by+M*cs+8,N*cs+16,8,'#12349b',4);
    if(win){const on=Math.floor(t*6)%2;if(on)for(const i of win)c.circle(bx+(i%N)*cs+cs/2,by+Math.floor(i/N)*cs+cs/2,cs*.18,'#fff')}
  });
}});

// ---- REVERSI (contra la IA) ----
def({id:'reversi',title:'REVERSI',emoji:'⚫',tag:'vs máquina',hint:'👆 TOCA una casilla marcada para colocar ficha y voltear las rivales',style:'felt',skin:'flat',
colors:['#0b6b3a','#064d29','#f5f5f5'],font:FF,
music:{bpm:100,root:50,scale:'dorian',lead:'sine',bassw:'sine',bass:'root',drums:'none',density:.4,vol:.1,len:.9,oct:1},
create(c){
  const g=c.g,W=c.W,N=8,cs=Math.floor((W-20)/N),bx=Math.round((W-N*cs)/2),by=Math.round(c.T+(c.PH-N*cs)/2+6);
  const WT=[[100,-20,10,5,5,10,-20,100],[-20,-50,-2,-2,-2,-2,-50,-20],[10,-2,3,1,1,3,-2,10],[5,-2,1,0,0,1,-2,5],[5,-2,1,0,0,1,-2,5],[10,-2,3,1,1,3,-2,10],[-20,-50,-2,-2,-2,-2,-50,-20],[100,-20,10,5,5,10,-20,100]];
  const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let B,turn,wins=0,games=0,aiT,end=0,last=null,pop=[];
  const ins=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
  function flips(Bd,x,y,who){if(Bd[y][x])return[];const out=[];for(const d of DIRS){let cx=x+d[0],cy=y+d[1];const line=[];while(ins(cx,cy)&&Bd[cy][cx]===3-who){line.push([cx,cy]);cx+=d[0];cy+=d[1]}
      if(line.length&&ins(cx,cy)&&Bd[cy][cx]===who)out.push(...line)}return out}
  function moves(Bd,who){const m=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){const f=flips(Bd,x,y,who);if(f.length)m.push({x,y,f})}return m}
  const cnt=(Bd,w)=>{let n=0;Bd.forEach(r=>r.forEach(v=>{if(v===w)n++}));return n};
  const copy=Bd=>Bd.map(r=>r.slice());
  function apply(Bd,m,who){Bd[m.y][m.x]=who;m.f.forEach(p=>{Bd[p[1]][p[0]]=who})}
  function score(Bd){let s=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(Bd[y][x]===2)s+=WT[y][x];else if(Bd[y][x]===1)s-=WT[y][x]}return s}
  function aiPick(){const ms=moves(B,2);if(!ms.length)return null;
    if(Math.random()>Math.min(1,.45+wins*.2))return c.pick(ms);
    let best=null,bv=-1e9;for(const m of ms){const b2=copy(B);apply(b2,m,2);const rep=moves(b2,1);let worst=1e9;
      if(!rep.length)worst=score(b2)+25;else for(const r of rep){const b3=copy(b2);apply(b3,r,1);worst=Math.min(worst,score(b3))}
      const v=worst+c.R(0,3);if(v>bv){bv=v;best=m}}return best}
  function reset(){B=Array.from({length:N},()=>Array(N).fill(0));B[3][3]=2;B[4][4]=2;B[3][4]=1;B[4][3]=1;turn=1;aiT=0;end=0;last=null;games++}
  function place(m,who){apply(B,m,who);last={x:m.x,y:m.y};c.sfx('tap',who===1?1.2:.9);m.f.forEach(p=>pop.push({x:p[0],y:p[1],t:0}));turn=3-who;aiT=0;check()}
  function check(){
    const mine=moves(B,turn);
    if(mine.length)return;
    const other=moves(B,3-turn);
    if(other.length){c.say(turn===1?'No tienes jugada: pasas':'La máquina pasa',1100);turn=3-turn;aiT=0;return}
    const a=cnt(B,1),b=cnt(B,2);end=1.8;turn=0;
    if(a>b){wins++;c.setScore(wins);c.sfx('win');c.say('¡GANAS '+a+'–'+b+'!',1400)}
    else if(a<b){c.sfx('lose');c.shake(6);c.after(1200,()=>c.over('PERDISTE '+a+'–'+b))}
    else c.say('¡EMPATE!',1200)}
  reset();
  c.down(p=>{if(c.dead||turn!==1)return;const x=Math.floor((p.x-bx)/cs),y=Math.floor((p.y-by)/cs);if(!ins(x,y))return;const f=flips(B,x,y,1);if(f.length)place({x,y,f},1)});
  c.loop((dt,t)=>{
    if(!c.dead){
      if(turn===2){aiT+=dt;if(aiT>.7){const m=aiPick();if(m)place(m,2);else{turn=1;check()}}}
      if(end>0){end-=dt;if(end<=0&&!c.dead)reset()}
    }
    pop=pop.filter(q=>(q.t+=dt)<.35);
    c.bgGrad('#0b6b3a','#064d29');
    g.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<c.H;y+=6)g.fillRect(0,y,W,1);
    c.rect(bx-6,by-6,N*cs+12,N*cs+12,'#3b2a14',8);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){c.rect(bx+x*cs+1,by+y*cs+1,cs-2,cs-2,(x+y)%2?'#0f8a4a':'#0d7e43')}
    if(turn===1){const mv=moves(B,1);for(const m of mv)c.circle(bx+m.x*cs+cs/2,by+m.y*cs+cs/2,cs*.12,'rgba(255,255,255,.55)')}
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=B[y][x];if(!v)continue;
      const q=pop.find(o=>o.x===x&&o.y===y),k=q?Math.abs(Math.cos(q.t/.35*Math.PI)):1,cx=bx+x*cs+cs/2,cy=by+y*cs+cs/2;
      g.save();g.translate(cx,cy);g.scale(k,1);c.circle(2,3,cs*.4,'rgba(0,0,0,.3)');c.circle(0,0,cs*.4,v===1?'#161616':'#f2f2f2');c.circle(-cs*.08,-cs*.08,cs*.22,v===1?'#2a2a2a':'#fff');g.restore()}
    if(last)g.strokeStyle='#ffd23a',g.lineWidth=3,g.strokeRect(bx+last.x*cs+3,by+last.y*cs+3,cs-6,cs-6);
    const a=cnt(B,1),b=cnt(B,2);
    c.circle(bx+14,by-22,11,'#161616');c.txt(String(a),bx+34,by-21,18,'#fff','left');
    c.circle(bx+N*cs-60,by-22,11,'#f2f2f2');c.txt(String(b),bx+N*cs-40,by-21,18,'#fff','left');
    c.txt(turn===1?'TU TURNO':turn===2?'PENSANDO…':'',W/2,by+N*cs+26,15,'#fff','center');
  });
}});

// ---- CAJAS (sokoban infinito, niveles generados y siempre resolubles) ----
def({id:'boxes',title:'CAJAS',emoji:'📦',tag:'puzle · almacén',hint:'👆 DESLIZA o toca hacia dónde ir. Empuja las cajas a los puntos',style:'warehouse',skin:'flat',
colors:['#3a2a1e','#26190f','#ffb347'],font:"'Silkscreen',monospace",
music:{bpm:96,root:48,scale:'minor',lead:'square',bassw:'triangle',bass:'walk',drums:'half',density:.5,vol:.09,len:.7,oct:1},
create(c){
  const g=c.g,W=c.W,NX=7,NY=8,cs=Math.floor(Math.min((W-24)/NX,(c.PH-96)/NY)),ox=Math.round((W-NX*cs)/2),oy=Math.round(c.T+36);
  const PL=["..GG..","..GGGG","..SSSS","..SKSK","BBBBBB","BBBBBB",".B..B."];
  const BX=["BBBBBBBB","BddddddB","BdBddBdB","BddBBddB","BddBBddB","BdBddBdB","BddddddB","BBBBBBBB"];
  let solved=0,time=150,wall,goal,box,P,moves,undo,flash=0,done=0,tmr=0;
  const key=(x,y)=>y*NX+x;
  function gen(){
    const nb=Math.min(4,1+Math.floor(solved/2)),steps=60+solved*25;
    for(let tries=0;tries<200;tries++){
      wall=Array(NX*NY).fill(0);for(let x=0;x<NX;x++){wall[key(x,0)]=wall[key(x,NY-1)]=1}for(let y=0;y<NY;y++){wall[key(0,y)]=wall[key(NX-1,y)]=1}
      for(let i=0,k=3+Math.floor(Math.random()*4);i<k;i++){const x=1+Math.floor(Math.random()*(NX-2)),y=1+Math.floor(Math.random()*(NY-2));wall[key(x,y)]=1}
      const free=[];for(let y=1;y<NY-1;y++)for(let x=1;x<NX-1;x++)if(!wall[key(x,y)])free.push([x,y]);
      if(free.length<nb+6)continue;ST.shuffle(free);
      goal=Array(NX*NY).fill(0);box=Array(NX*NY).fill(0);
      for(let i=0;i<nb;i++){goal[key(free[i][0],free[i][1])]=1;box[key(free[i][0],free[i][1])]=1}
      let p={x:free[nb][0],y:free[nb][1]};
      for(let s=0;s<steps;s++){const d=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(Math.random()*4)],nx=p.x+d[0],ny=p.y+d[1];
        if(wall[key(nx,ny)]||box[key(nx,ny)])continue;
        const bx=p.x-d[0],by=p.y-d[1];
        if(box[key(bx,by)]&&Math.random()<.8){box[key(bx,by)]=0;box[key(p.x,p.y)]=1}
        p={x:nx,y:ny}}
      let off=0;for(let i=0;i<NX*NY;i++)if(box[i]&&!goal[i])off++;
      if(off>=Math.max(1,nb-1)){P=p;moves=0;undo=[];return}
    }
    // respaldo trivial
    wall=Array(NX*NY).fill(0);for(let x=0;x<NX;x++){wall[key(x,0)]=wall[key(x,NY-1)]=1}for(let y=0;y<NY;y++){wall[key(0,y)]=wall[key(NX-1,y)]=1}
    goal=Array(NX*NY).fill(0);box=Array(NX*NY).fill(0);goal[key(4,3)]=1;box[key(3,3)]=1;P={x:2,y:3};moves=0;undo=[];
  }
  function step(dx,dy){
    if(c.dead||done)return;
    const nx=P.x+dx,ny=P.y+dy;if(wall[key(nx,ny)])return;
    if(box[key(nx,ny)]){const bx=nx+dx,by=ny+dy;if(wall[key(bx,by)]||box[key(bx,by)]){c.sfx('bump',.6);return}
      undo.push({p:{x:P.x,y:P.y},b:[nx,ny,bx,by]});box[key(nx,ny)]=0;box[key(bx,by)]=1;c.sfx('tap',.8)}
    else{undo.push({p:{x:P.x,y:P.y}});c.sfx('tick')}
    P={x:nx,y:ny};moves++;
    if(goal.every((v,i)=>!v||box[i])){done=1.0;solved++;c.setScore(solved);time+=40;c.sfx('win');c.say('¡NIVEL! +40 s',900);flash=.4}
  }
  function back(){if(!undo.length||done)return;const u=undo.pop();if(u.b){box[key(u.b[2],u.b[3])]=0;box[key(u.b[0],u.b[1])]=1}P=u.p;moves--;c.sfx('tick',.6)}
  gen();
  const btn=(i)=>({x:ox+i*(NX*cs/2),y:oy+NY*cs+10,w:NX*cs/2-6,h:34});
  let sx=0,sy=0,sw=false;
  c.down(p=>{sx=p.x;sy=p.y;sw=false;
    for(let i=0;i<2;i++){const b=btn(i);if(ST.ptIn(p,b.x,b.y,b.w,b.h)){sw=true;if(i===0)back();else{gen();c.sfx('tick')}return}}
    const px=ox+(P.x+.5)*cs,py=oy+(P.y+.5)*cs,dx=p.x-px,dy=p.y-py;if(Math.abs(dx)>Math.abs(dy))step(dx>0?1:-1,0);else step(0,dy>0?1:-1)});
  c.move(p=>{if(sw)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>30){sw=true;if(Math.abs(dx)>Math.abs(dy))step(dx>0?1:-1,0);else step(0,dy>0?1:-1)}});
  c.loop((dt,t)=>{
    if(!c.dead){tmr+=dt;time-=dt;if(time<=0){time=0;c.sfx('lose');c.over('SE ACABÓ EL TIEMPO')}
      if(done>0){done-=dt;if(done<=0){done=0;gen()}}}
    flash=Math.max(0,flash-dt);
    c.rect(0,0,W,c.H,'#26190f');g.fillStyle='#2f2014';for(let y=0;y<c.H;y+=16)for(let x=((y/16)%2)*16;x<W;x+=32)g.fillRect(x,y,16,16);
    {const tc=time<20?'#ff6b6b':'#ffb347';c.icon('_timer',W/2-34,c.T+10,16,tc,2.4);c.txt(Math.ceil(time)+'s',W/2+10,c.T+10,14,tc,'center')}
    const px=cs/8;
    for(let y=0;y<NY;y++)for(let x=0;x<NX;x++){const X=ox+x*cs,Y=oy+y*cs,k=key(x,y);
      if(wall[k]){c.rect(X,Y,cs,cs,'#7a4a2a');c.rect(X,Y,cs,3,'#a8693d');c.rect(X,Y+cs-3,cs,3,'#4a2a14');g.fillStyle='#4a2a14';g.fillRect(X+cs/2,Y,2,cs/2);g.fillRect(X,Y+cs/2,cs,2)}
      else{c.rect(X,Y,cs,cs,(x+y)%2?'#5a4330':'#523c2b');if(goal[k]){c.circle(X+cs/2,Y+cs/2,cs*.14,'#ffb347');c.circle(X+cs/2,Y+cs/2,cs*.07,'#3a2a1e')}}
      if(box[k]){ST.spr(g,BX,X+2,Y+2,(cs-4)/8,{B:goal[k]?'#1f7a3a':'#7a4a12',d:goal[k]?'#58d36e':'#d9953a'})}}
    ST.spr(g,PL,ox+P.x*cs+cs*.1,oy+P.y*cs+cs*.05,cs*.8/6,{G:'#58d36e',S:'#fcbcb0',K:'#000',B:'#3a6fd8'});
    for(let i=0;i<2;i++){const b=btn(i);c.rect(b.x,b.y,b.w,b.h,'#7a4a2a',6);c.icon(i===0?'_undo':'_retry',b.x+b.w/2-52,b.y+b.h/2,16,'#ffe0b0',2.4);c.txt(i===0?'DESHACER':'REINICIAR',b.x+b.w/2+10,b.y+b.h/2+1,10,'#ffe0b0','center')}
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
  });
}});

// ---- NONOGRAMA (pixel puzzle, siempre con solución) ----
def({id:'nonogram',title:'NONOGRAMA',emoji:'🧩',tag:'puzle · lógica',hint:'👆 TOCA/ARRASTRA para pintar · otro toque marca ✕. Los números dicen cuántas casillas seguidas',style:'pico',skin:'light flat',
colors:['#fff1e6','#ffd9c0','#ff6b6b'],font:"'Silkscreen',monospace",
music:{bpm:92,root:60,scale:'pent',lead:'triangle',bassw:'sine',bass:'root',drums:'none',density:.4,vol:.09,len:.9,oct:1},
create(c){
  const g=c.g,W=c.W;
  let n,cs,kk,gx,gy,sol,rowC,colC,st,solved=0,time=120,done=0,pv=0,last=-1,flash=0;
  const runs=a=>{const r=[];let k=0;a.forEach(v=>{if(v)k++;else if(k){r.push(k);k=0}});if(k)r.push(k);return r.length?r:[0]};
  function gen(){
    n=solved<2?5:solved<5?6:7;const cc=Math.ceil(n/2);
    cs=Math.floor(Math.min((W-24)/(n+cc*.6),(c.PH-120)/(n+cc*.6)));kk=cs*.6;
    gx=Math.round((W-(n*cs+cc*kk))/2+cc*kk);gy=Math.round(c.T+34+cc*kk);
    for(let tries=0;tries<100;tries++){
      sol=Array.from({length:n},()=>Array.from({length:n},()=>Math.random()<.55?1:0));
      rowC=sol.map(r=>runs(r));colC=Array.from({length:n},(_,x)=>runs(sol.map(r=>r[x])));
      if(rowC.every(r=>r[0]>0)&&colC.every(r=>r[0]>0))break}
    st=Array.from({length:n},()=>Array(n).fill(0));done=0;
  }
  const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
  const rowOk=y=>same(runs(st[y].map(v=>v===1?1:0)),rowC[y]),colOk=x=>same(runs(st.map(r=>r[x]===1?1:0)),colC[x]);
  function chk(){for(let y=0;y<n;y++)if(!rowOk(y))return;for(let x=0;x<n;x++)if(!colOk(x))return;
    done=1.1;solved++;c.setScore(solved);time+=30;c.sfx('win');c.say('¡RESUELTO! +30 s',900);flash=.4}
  gen();
  const cellAt=p=>{const x=Math.floor((p.x-gx)/cs),y=Math.floor((p.y-gy)/cs);return x>=0&&y>=0&&x<n&&y<n?[x,y]:null};
  c.down(p=>{if(c.dead||done)return;const q=cellAt(p);if(!q)return;pv=(st[q[1]][q[0]]+1)%3;st[q[1]][q[0]]=pv;last=q[0]+q[1]*n;c.sfx(pv===1?'tap':'tick',pv===1?1.2:.8);chk()});
  c.move(p=>{if(c.dead||done)return;const q=cellAt(p);if(!q)return;const k=q[0]+q[1]*n;if(k===last)return;last=k;if(st[q[1]][q[0]]!==pv){st[q[1]][q[0]]=pv;c.sfx('tick',1.1);chk()}});
  c.loop((dt,t)=>{
    if(!c.dead){time-=dt;if(time<=0){time=0;c.sfx('lose');c.over('SE ACABÓ EL TIEMPO')}
      if(done>0){done-=dt;if(done<=0){done=0;gen()}}}
    flash=Math.max(0,flash-dt);
    c.bgGrad('#fff1e6','#ffd9c0');
    {const tc=time<20?'#d62828':'#5a3a2a';c.icon('_timer',W/2-34,c.T+8,16,tc,2.4);c.txt(Math.ceil(time)+'s',W/2+10,c.T+8,14,tc,'center')}
    const cc=Math.ceil(n/2);
    c.rect(gx-cc*kk-4,gy-cc*kk-4,n*cs+cc*kk+8,n*cs+cc*kk+8,'#fff',8);
    for(let y=0;y<n;y++){const ok=rowOk(y);rowC[y].slice().reverse().forEach((v,i)=>c.txt(String(v),gx-6-i*kk-kk/2,gy+y*cs+cs/2,Math.floor(cs*.42),ok?'#b8a090':'#3a2418','center'))}
    for(let x=0;x<n;x++){const ok=colOk(x);colC[x].slice().reverse().forEach((v,i)=>c.txt(String(v),gx+x*cs+cs/2,gy-6-i*kk-kk/2,Math.floor(cs*.42),ok?'#b8a090':'#3a2418','center'))}
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){const X=gx+x*cs,Y=gy+y*cs,v=st[y][x];
      c.rect(X+1,Y+1,cs-2,cs-2,(x>>0)%2===(y>>0)%2?'#f4ece4':'#efe4d9');
      if(v===1){c.rect(X+2,Y+2,cs-4,cs-4,'#3a2418');c.rect(X+4,Y+4,cs-10,3,'rgba(255,255,255,.25)')}
      else if(v===2){g.strokeStyle='#ff6b6b';g.lineWidth=3;g.beginPath();g.moveTo(X+cs*.28,Y+cs*.28);g.lineTo(X+cs*.72,Y+cs*.72);g.moveTo(X+cs*.72,Y+cs*.28);g.lineTo(X+cs*.28,Y+cs*.72);g.stroke()}}
    g.strokeStyle='#3a2418';g.lineWidth=2;for(let i=0;i<=n;i+=5){}
    g.strokeRect(gx,gy,n*cs,n*cs);
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
  });
}});
