// ============ 47. VECTOR CORE (vectorial, fósforo) ============
def({id:'vector',title:'VECTOR CORE',emoji:'☄️',tag:'vectorial',hint:'👆 MANTÉN y ARRASTRA para apuntar. La nave dispara sola',style:'vector',skin:'flat',
colors:['#000000','#03110c','#7dffc4'],font:"'Orbitron',sans-serif",
music:{bpm:100,root:43,scale:'minor',lead:'sawtooth',bassw:'square',bass:'pulse',drums:'four',density:.45,vol:.1,len:.7,oct:1},
create(c){
  const g=c.g,cx=c.W/2,cy=c.T+c.PH*.52,COL='#9dffd6';
  let ang=-1.5708,fire=.3,B=[],A=[],L=[],spT=.6,first=true;
  const poly=r=>{const n=c.RI(8,11),p=[];for(let i=0;i<n;i++)p.push({a:i/n*6.2832,r:r*c.R(.72,1.12)});return p};
  const spawn=(x,y,size,vx,vy)=>{const r=[0,15,27,46][size];A.push({x,y,size,r,vx,vy,rot:c.R(0,6),vr:c.R(-1.2,1.2),pts:poly(r)})};
  const aim=p=>{ang=Math.atan2(p.y-cy,p.x-cx)};c.down(aim);c.move(aim);
  const lines=(x,y,n,sp)=>{for(let i=0;i<n;i++){const a=c.R(0,6.28);L.push({x,y,a,len:c.R(6,16),vx:Math.cos(a)*c.R(30,sp),vy:Math.sin(a)*c.R(30,sp),l:c.R(.4,.9)})}};
  c.loop((dt,t)=>{
    if(!c.dead){
      fire-=dt;if(fire<=0){fire=.26;B.push({x:cx+Math.cos(ang)*22,y:cy+Math.sin(ang)*22,vx:Math.cos(ang)*660,vy:Math.sin(ang)*660,l:1.1});c.sfx('tick')}
      spT-=dt;if(spT<=0){const s=c.RI(0,3),e=s===0?{x:-50,y:c.R(0,c.H)}:s===1?{x:c.W+50,y:c.R(0,c.H)}:s===2?{x:c.R(0,c.W),y:-50}:{x:c.R(0,c.W),y:c.H+50};
        const a=Math.atan2(cy-e.y+c.R(-140,140),cx-e.x+c.R(-140,140)),v=c.R(46,86)+c.sc*.9;spawn(e.x,e.y,3,Math.cos(a)*v,Math.sin(a)*v);spT=Math.max(.65,2.1-c.sc*.025)}
      B.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt});B=B.filter(b=>b.l>0);
      A.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.rot+=a.vr*dt});A=A.filter(a=>a.x>-130&&a.x<c.W+130&&a.y>-130&&a.y<c.H+130);
      for(const b of B){for(const a of A){if(!a.dead&&!b.dead&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+3){a.dead=b.dead=true;c.setScore(c.sc+(4-a.size));c.sfx('hit');lines(a.x,a.y,6+a.size*3,160);
        if(a.size>1){for(let k=0;k<2;k++){const ba=Math.atan2(a.vy,a.vx)+(k?1:-1)*c.R(.5,1.1),v=Math.hypot(a.vx,a.vy)*c.R(1.1,1.5)+20;spawn(a.x,a.y,a.size-1,Math.cos(ba)*v,Math.sin(ba)*v)}}}}}
      A=A.filter(a=>!a.dead);B=B.filter(b=>!b.dead);
      for(const a of A)if(Math.hypot(a.x-cx,a.y-cy)<a.r+9){lines(cx,cy,28,260);c.sfx('lose');c.shake(10);c.over('NAVE DESTRUIDA');break}
    }
    L.forEach(l=>{l.x+=l.vx*dt;l.y+=l.vy*dt;l.l-=dt});L=L.filter(l=>l.l>0);
    // fósforo: no se borra del todo, deja estela
    if(first){c.rect(0,0,c.W,c.H,'#000');first=false}else{g.fillStyle='rgba(0,6,3,.34)';g.fillRect(0,0,c.W,c.H)}
    g.lineJoin='round';g.lineCap='round';g.strokeStyle=COL;g.shadowColor='#4dffb0';g.shadowBlur=8;g.lineWidth=2;
    A.forEach(a=>{g.beginPath();a.pts.forEach((p,i)=>{const x=a.x+Math.cos(p.a+a.rot)*p.r,y=a.y+Math.sin(p.a+a.rot)*p.r;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.stroke()});
    g.strokeStyle='#fff';g.lineWidth=2.5;B.forEach(b=>{g.beginPath();g.moveTo(b.x,b.y);g.lineTo(b.x-b.vx*.02,b.y-b.vy*.02);g.stroke()});
    g.strokeStyle='#ffb347';g.shadowColor='#ff9b2f';g.lineWidth=1.5;L.forEach(l=>{g.globalAlpha=Math.min(1,l.l*2);g.beginPath();g.moveTo(l.x,l.y);g.lineTo(l.x+Math.cos(l.a)*l.len,l.y+Math.sin(l.a)*l.len);g.stroke()});g.globalAlpha=1;
    if(!c.dead){g.save();g.translate(cx,cy);g.rotate(ang);g.strokeStyle='#fff';g.shadowColor='#fff';g.lineWidth=2.2;g.beginPath();g.moveTo(20,0);g.lineTo(-13,-12);g.lineTo(-7,0);g.lineTo(-13,12);g.closePath();g.stroke();
      if(Math.floor(t*20)%2){g.strokeStyle='#ffb347';g.beginPath();g.moveTo(-9,-4);g.lineTo(-20,0);g.lineTo(-9,4);g.stroke()}g.restore()}
    g.shadowBlur=0;
  });
}});

// ============ 48. TÚNEL (vectorial, wireframe) ============
def({id:'tunnel',title:'TÚNEL',emoji:'🛸',tag:'wireframe',hint:'👉 ARRASTRA ↔ y pasa por el hueco de cada muro',style:'vector',skin:'flat',
colors:['#05000f','#14002e','#55e6ff'],font:"'Audiowide',sans-serif",
music:{bpm:128,root:41,scale:'phrygian',lead:'square',bassw:'sawtooth',bass:'walk',drums:'four',density:.55,vol:.1,len:.6,oct:1,arp:true},
create(c){
  const g=c.g,vx0=c.W/2,vy0=c.T+c.PH*.34,F=c.W*.95;
  const proj=(x,y,z)=>{const s=F/(z+1.1);return[vx0+x*s*.55,vy0+y*s*.55]};
  let px=0,tx=0,spd=15,scroll=0,walls=[],nz=28,pass=0,flash=0;
  const add=()=>{const gw=Math.max(.5,1.05-pass*.018),ga=c.R(-.95,.95-gw);walls.push({z:nz,a:ga,b:ga+gw,done:false});nz+=c.R(15,21)};
  for(let i=0;i<4;i++)add();
  const tgt=p=>{tx=c.clamp((p.x-vx0)/(c.W*.38),-.92,.92)};c.down(tgt);c.move(tgt);
  c.loop((dt,t)=>{
    if(!c.dead){
      px+=(tx-px)*Math.min(1,dt*9);spd=Math.min(36,15+pass*.55);scroll=(scroll+spd*dt)%4;nz-=spd*dt;
      for(const w of walls){w.z-=spd*dt;if(!w.done&&w.z<.5){w.done=true;if(px>w.a-.02&&px<w.b+.02){pass++;c.setScore(pass);c.sfx('coin',1+Math.min(pass,12)*.04);flash=.15}else{c.sfx('lose');c.shake(12);c.over('¡CHOQUE!')}}}
      walls=walls.filter(w=>w.z>-3);while(walls.length<5)add();
    }
    flash=Math.max(0,flash-dt);
    c.bgGrad('#05000f','#1a0040');
    // sol
    g.fillStyle='#ff3d9a';g.beginPath();g.arc(vx0,vy0,22,0,6.2832);g.fill();
    const edge=(z,a)=>{g.strokeStyle='rgba(85,230,255,'+a+')';const P=[proj(-1,-.5,z),proj(1,-.5,z),proj(1,.5,z),proj(-1,.5,z)];g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.stroke()};
    g.lineWidth=1.5;g.shadowColor='#55e6ff';g.shadowBlur=6;
    for(let k=14;k>=0;k--){const z=k*4-scroll;if(z<0)continue;edge(z,Math.max(.12,1-z/60))}
    g.strokeStyle='rgba(85,230,255,.7)';[[-1,-.5],[1,-.5],[1,.5],[-1,.5]].forEach(q=>{const a=proj(q[0],q[1],0),b=proj(q[0],q[1],60);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()});
    g.strokeStyle='rgba(255,61,154,.5)';for(let i=-3;i<=3;i++){const a=proj(i/3,.5,0),b=proj(i/3,.5,60);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
    // muros (de lejos a cerca)
    walls.slice().sort((a,b)=>b.z-a.z).forEach(w=>{if(w.z>62||w.z<-.8)return;const z=Math.max(w.z,-.8),al=Math.max(.2,1-w.z/62);
      const quad=(x1,x2)=>{const P=[proj(x1,-.5,z),proj(x2,-.5,z),proj(x2,.5,z),proj(x1,.5,z)];g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle='rgba(255,61,154,'+(.22*al)+')';g.fill();g.strokeStyle='rgba(255,120,190,'+al+')';g.lineWidth=2;g.shadowColor='#ff3d9a';g.stroke();
        g.lineWidth=1;g.beginPath();g.moveTo(P[0][0],P[0][1]);g.lineTo(P[2][0],P[2][1]);g.moveTo(P[1][0],P[1][1]);g.lineTo(P[3][0],P[3][1]);g.stroke()};
      if(w.a>-1)quad(-1,w.a);if(w.b<1)quad(w.b,1)});
    // nave
    const[sx,sy]=proj(px,.42,.7),sz=c.W*.075;g.shadowColor='#fff';g.strokeStyle='#fff';g.lineWidth=2.5;
    if(!c.dead||Math.floor(t*14)%2){g.beginPath();g.moveTo(sx,sy-sz);g.lineTo(sx+sz*.9,sy+sz*.55);g.lineTo(sx,sy+sz*.25);g.lineTo(sx-sz*.9,sy+sz*.55);g.closePath();g.stroke()}
    g.shadowBlur=0;
    if(flash>0){g.globalAlpha=flash*2;c.rect(0,0,c.W,c.H,'#55e6ff');g.globalAlpha=1}
  });
}});

// ============ 49. TRES EN RAYA (risografía) ============
def({id:'tictac',title:'3 EN RAYA',emoji:'⭕',tag:'risografía',hint:'👆 TOCA una casilla. Tres en línea para ganar al ordenador',style:'riso',skin:'light',
colors:['#f4eee2','#e9dfca','#ff5c93'],font:"'Archivo Black',sans-serif",
music:{bpm:98,root:60,scale:'pent',lead:'triangle',bassw:'sine',bass:'walk',drums:'hats',density:.5,vol:.12,len:1.2,oct:1},
create(c){
  const g=c.g,PINK='#ff5c93',TEAL='#10a9a0',L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const bs=Math.min(c.W-64,c.PH-190),bx=Math.round((c.W-bs)/2),by=Math.round(c.T+100+(c.PH-190-bs)/2),cs=bs/3;
  let b,turn,res=null,line=null,wait=0,msg='',mt=0,drawn=[];
  const win=bd=>{for(const l of L)if(bd[l[0]]&&bd[l[0]]===bd[l[1]]&&bd[l[1]]===bd[l[2]])return l;return null};
  function mm(bd,t){const w=win(bd);if(w)return bd[w[0]]==='O'?1:-1;if(bd.every(x=>x))return 0;let best=t==='O'?-2:2;
    for(let i=0;i<9;i++)if(!bd[i]){bd[i]=t;const s=mm(bd,t==='O'?'X':'O');bd[i]=null;best=t==='O'?Math.max(best,s):Math.min(best,s)}return best}
  function ai(){
    const em=[];for(let i=0;i<9;i++)if(!b[i])em.push(i);if(!em.length)return;
    const err=Math.max(.14,.62-.08*c.sc);let mv;
    if(Math.random()<err)mv=c.pick(em);else{let best=-9,bm=[];em.forEach(i=>{b[i]='O';const s=mm(b,'X');b[i]=null;if(s>best){best=s;bm=[i]}else if(s===best)bm.push(i)});mv=c.pick(bm)}
    b[mv]='O';drawn[mv]=0;c.sfx('tap',.8);
  }
  function fresh(){b=new Array(9).fill(null);drawn=new Array(9).fill(1);res=null;line=null;turn=(c.sc%2===0)?'X':'O';if(turn==='O'){wait=.5}}
  fresh();
  function end(){
    const w=win(b);
    if(w){line=w;if(b[w[0]]==='X'){res='win';c.setScore(c.sc+1);c.sfx('win');say('¡GANASTE!')}else{res='lose';c.sfx('lose');say('GANA EL ORDENADOR');c.after(900,()=>c.over('¡PERDISTE!'))}return true}
    if(b.every(x=>x)){res='draw';say('EMPATE');return true}return false;
  }
  function say(m){msg=m;mt=1.2}
  c.down(p=>{
    if(c.dead||res||turn!=='X')return;const ci=Math.floor((p.x-bx)/cs),ri=Math.floor((p.y-by)/cs);if(ci<0||ci>2||ri<0||ri>2)return;const i=ri*3+ci;if(b[i])return;
    b[i]='X';drawn[i]=0;c.sfx('tap',1.3);if(end()){if(res!=='lose')wait=1.1;return}turn='O';wait=.45;
  });
  c.loop((dt,t)=>{
    mt=Math.max(0,mt-dt);for(let i=0;i<9;i++)drawn[i]=Math.min(1,drawn[i]+dt*5);
    if(!c.dead&&wait>0){wait-=dt;if(wait<=0){if(res==='win'||res==='draw'){fresh()}else if(turn==='O'&&!res){ai();if(!end())turn='X'}}}
    c.rect(0,0,c.W,c.H,'#f4eee2');ST.grain(g,c.W,c.H,.16,'#7a5c3a');
    ST.halftone(g,0,c.H*.6,c.W,c.H*.4,'rgba(16,169,160,.14)',7,.7,true);
    g.save();g.globalCompositeOperation='multiply';
    // título a dos tintas, desalineadas
    const title='3 EN RAYA';g.font='44px '+'Archivo Black, sans-serif';c.txt(title,c.W/2+3,c.T+70,40,PINK);c.txt(title,c.W/2,c.T+68,40,TEAL);
    // tablero
    g.lineCap='round';g.strokeStyle=TEAL;g.lineWidth=9;
    [1,2].forEach(i=>{g.beginPath();g.moveTo(bx+i*cs,by+6);g.lineTo(bx+i*cs+2,by+bs-6);g.moveTo(bx+6,by+i*cs);g.lineTo(bx+bs-6,by+i*cs-2);g.stroke()});
    for(let i=0;i<9;i++){
      if(!b[i])continue;const x=bx+(i%3+.5)*cs,y=by+Math.floor(i/3)*cs+cs/2,r=cs*.3,k=drawn[i];
      if(b[i]==='X'){g.strokeStyle=PINK;g.lineWidth=11;g.beginPath();g.moveTo(x-r+4,y-r-3);g.lineTo(x-r+4+(2*r)*Math.min(1,k*2),y-r-3+(2*r)*Math.min(1,k*2));g.stroke();
        if(k>.5){g.beginPath();g.moveTo(x+r+3,y-r+2);g.lineTo(x+r+3-(2*r)*(k-.5)*2,y-r+2+(2*r)*(k-.5)*2);g.stroke()}}
      else{g.strokeStyle=TEAL;g.lineWidth=11;g.beginPath();g.arc(x,y,r,-1.2,-1.2+6.28*k);g.stroke()}
    }
    if(line){g.strokeStyle=b[line[0]]==='X'?PINK:TEAL;g.lineWidth=7;g.globalAlpha=.85;const a=line[0],z=line[2];g.beginPath();g.moveTo(bx+(a%3+.5)*cs,by+Math.floor(a/3)*cs+cs/2);g.lineTo(bx+(z%3+.5)*cs,by+Math.floor(z/3)*cs+cs/2);g.stroke();g.globalAlpha=1}
    g.restore();
    c.txt(res?'':(turn==='X'?'TU TURNO · ✕':'PENSANDO…'),c.W/2,by+bs+34,20,'#3a3a46');
    if(mt>0){g.save();g.globalCompositeOperation='multiply';g.globalAlpha=Math.min(1,mt*3);c.txt(msg,c.W/2+3,by+bs/2+3,46,PINK);c.txt(msg,c.W/2,by+bs/2,46,TEAL);g.restore()}
  });
}});

// ============ 50. DESLIZA (risografía, laberinto de hielo) ============
def({id:'slide',title:'DESLIZA',emoji:'🧊',tag:'risografía',hint:'👉 DESLIZA el dedo: la bola no para hasta chocar. Llega a la diana',style:'riso',skin:'light',
colors:['#f1ead9','#e3d9bf','#ff6a3d'],font:"'Archivo Black',sans-serif",
music:{bpm:108,root:57,scale:'major',lead:'sine',bassw:'triangle',bass:'walk',drums:'hats',density:.5,vol:.12,len:1.3,oct:1},
create(c){
  const g=c.g,OR='#ff6a3d',BL='#2b50aa',COLS=6,cs=Math.floor((c.W-44)/COLS),ROWS=Math.max(6,Math.min(9,Math.floor((c.PH-196)/cs)));
  const x0=Math.round((c.W-cs*COLS)/2),y0=Math.round(c.T+100+(c.PH-196-cs*ROWS)/2);
  let blk,start,goal,ball,tgt,moves=0,par=0,tl=45,lvl=0,sx=0,sy=0,lock=0,flash=0,moving=false;
  const D=[[1,0],[-1,0],[0,1],[0,-1]];
  const open=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS&&!blk[y*COLS+x];
  const slide=(x,y,d)=>{while(open(x+d[0],y+d[1])){x+=d[0];y+=d[1]}return{x,y}};
  function gen(){
    for(let tries=0;tries<300;tries++){
      blk=new Array(COLS*ROWS).fill(false);const n=Math.round(COLS*ROWS*c.R(.2,.3));for(let i=0;i<n;i++)blk[c.RI(0,COLS*ROWS-1)]=true;
      start={x:c.RI(0,COLS-1),y:c.RI(0,ROWS-1)};if(blk[start.y*COLS+start.x])continue;
      const dep=new Map([[start.y*COLS+start.x,0]]),q=[start];
      while(q.length){const p=q.shift(),dp=dep.get(p.y*COLS+p.x);for(const d of D){const e=slide(p.x,p.y,d),k=e.y*COLS+e.x;if(!dep.has(k)){dep.set(k,dp+1);q.push(e)}}}
      const lo=Math.min(3+Math.floor(lvl/2),6),hi=Math.min(5+lvl,9),cand=[...dep.entries()].filter(e=>e[1]>=lo&&e[1]<=hi);
      if(!cand.length)continue;const e=c.pick(cand);goal={x:e[0]%COLS,y:Math.floor(e[0]/COLS)};par=e[1];
      ball={x:start.x,y:start.y,px:start.x,py:start.y};tgt=null;moves=0;moving=false;return}
    blk=new Array(COLS*ROWS).fill(false);start={x:0,y:0};goal={x:COLS-1,y:0};par=1;ball={x:0,y:0,px:0,py:0};
  }
  gen();
  const reset=()=>{ball={x:start.x,y:start.y,px:start.x,py:start.y};tgt=null;moving=false;moves=0;c.sfx('whoosh')};
  c.down(p=>{sx=p.x;sy=p.y;if(Math.hypot(p.x-(c.W-40),p.y-(c.B-30))<28&&!c.dead){reset();sx=-999}});
  c.up(p=>{
    if(c.dead||moving||sx===-999)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)<22)return;
    const d=Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)];
    let x=ball.x,y=ball.y;while(open(x+d[0],y+d[1])){x+=d[0];y+=d[1];if(x===goal.x&&y===goal.y)break}
    if(x===ball.x&&y===ball.y){c.sfx('bump',.7);return}
    tgt={x,y};moving=true;moves++;c.sfx('whoosh');
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡SE ACABÓ EL TIEMPO!')}
      if(moving&&tgt){const dx=tgt.x-ball.px,dy=tgt.y-ball.py,d=Math.hypot(dx,dy),st=16*dt;
        if(d<=st){ball.px=tgt.x;ball.py=tgt.y;ball.x=tgt.x;ball.y=tgt.y;moving=false;tgt=null;c.sfx('bump',1);c.shake(3);
          if(ball.x===goal.x&&ball.y===goal.y){c.setScore(c.sc+1);c.sfx('win');tl=Math.min(60,tl+7);flash=.3;c.say(moves<=par?'¡PERFECTO!':'¡DIANA!',1100);lvl++;for(let i=0;i<14;i++)c.burst(x0+(goal.x+.5)*cs,y0+(goal.y+.5)*cs,c.pick([OR,BL]),1,260);c.after(500,()=>{if(!c.dead)gen()})}}
        else{ball.px+=dx/d*st;ball.py+=dy/d*st}}}
    c.rect(0,0,c.W,c.H,'#f1ead9');ST.grain(g,c.W,c.H,.16,'#6b5a3a');
    g.save();g.globalCompositeOperation='multiply';
    c.txt('DESLIZA',c.W/2+3,c.T+60,38,OR);c.txt('DESLIZA',c.W/2,c.T+58,38,BL);
    // zona
    g.fillStyle='rgba(43,80,170,.07)';g.fillRect(x0,y0,COLS*cs,ROWS*cs);
    for(let i=0;i<=COLS;i++){g.fillStyle='rgba(43,80,170,.2)';g.fillRect(x0+i*cs-1,y0,2,ROWS*cs)}for(let j=0;j<=ROWS;j++){g.fillStyle='rgba(43,80,170,.2)';g.fillRect(x0,y0+j*cs-1,COLS*cs,2)}
    for(let i=0;i<blk.length;i++)if(blk[i]){const x=x0+(i%COLS)*cs,y=y0+Math.floor(i/COLS)*cs;g.fillStyle=BL;g.beginPath();c.rr(x+3,y+3,cs-6,cs-6,8);g.fill();ST.halftone(g,x+3,y+3,cs-6,cs-6,'rgba(255,255,255,.35)',6,.45,true)}
    // inicio y diana
    const sxp=x0+(start.x+.5)*cs,syp=y0+(start.y+.5)*cs;g.strokeStyle=BL;g.lineWidth=3;g.beginPath();g.moveTo(sxp-9,syp-9);g.lineTo(sxp+9,syp+9);g.moveTo(sxp+9,syp-9);g.lineTo(sxp-9,syp+9);g.stroke();
    const gxp=x0+(goal.x+.5)*cs,gyp=y0+(goal.y+.5)*cs;for(let k=3;k>=1;k--){g.fillStyle=k%2?OR:'#f1ead9';g.beginPath();g.arc(gxp,gyp,cs*.14*k+Math.sin(t*3)*1.5,0,6.2832);g.fill()}
    // bola (dos tintas desalineadas)
    g.restore();
    const bx2=x0+(ball.px+.5)*cs,by2=y0+(ball.py+.5)*cs;g.fillStyle='rgba(43,80,170,.85)';g.beginPath();g.arc(bx2+4,by2+4,cs*.3,0,6.2832);g.fill();g.fillStyle=OR;g.beginPath();g.arc(bx2,by2,cs*.3,0,6.2832);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(bx2-cs*.1,by2-cs*.1,cs*.08,0,6.2832);g.fill();
    c.txt('PAR '+par+'  ·  MOV '+moves,x0,y0+ROWS*cs+26,16,'#3a3a46','left');
    c.txt(Math.max(0,tl).toFixed(0)+'s',x0+COLS*cs,y0+ROWS*cs+26,18,tl>10?'#3a3a46':'#d6322a','right');
    c.rect(x0,c.T+84,COLS*cs,7,'rgba(0,0,0,.1)',3);c.rect(x0,c.T+84,COLS*cs*Math.max(0,tl/60),7,tl>10?BL:'#d6322a',3);
    g.strokeStyle=BL;g.lineWidth=3;g.beginPath();g.arc(c.W-40,c.B-30,18,.5,5.9);g.stroke();g.beginPath();g.moveTo(c.W-52,c.B-46);g.lineTo(c.W-40+2,c.B-48);g.lineTo(c.W-46,c.B-36);g.stroke();
    if(flash>0){g.globalAlpha=flash;c.rect(0,0,c.W,c.H,OR);g.globalAlpha=1}
  });
}});

// ============ 51. PENALTIS (diseño suizo, plano) ============
def({id:'penalty',title:'PENALTIS',emoji:'⚽',tag:'diseño suizo',hint:'👆 DESLIZA desde el balón hacia donde quieras chutar. Más largo = más alto',style:'swiss',skin:'light',
colors:['#f2efe6','#e6e1d3','#e63946'],font:"'Archivo Black',sans-serif",
music:{bpm:120,root:52,scale:'minpent',lead:'square',bassw:'triangle',bass:'pulse',drums:'four',density:.5,vol:.1,len:.8,oct:1},
create(c){
  const g=c.g,RED='#e63946',BLU='#1d3557',YEL='#ffb703',gx=36,gw=c.W-72,gt=c.T+74,gh=Math.min(160,c.PH*.25),gb=gt+gh,bx0=c.W/2,by0=c.B-62,R=22;
  let st='aim',ball={x:bx0,y:by0,s:1},kp={x:bx0,y:gb-50,dir:0},lives=3,fl=null,t0=0,tgt,res,sx,sy,pt=0,msgT=0,msg='',keepTo=0;
  const reset=()=>{st='aim';ball={x:bx0,y:by0,s:1};kp.x=c.W/2;fl=null;res=null};
  c.down(p=>{if(st==='aim'&&!c.dead&&Math.hypot(p.x-bx0,p.y-by0)<90){sx=p.x;sy=p.y;st='drag'}});
  c.up(p=>{
    if(st!=='drag')return;const dx=p.x-sx,dy=p.y-sy,L=Math.hypot(dx,dy);if(dy>-30||L<40){st='aim';return}
    // la dirección decide hacia dónde (x en la línea de gol); la longitud, cuánta altura
    const ux=dx/L,uy=dy/L,yg=gb-gh*.45;tgt={x:bx0+ux/(-uy)*(by0-yg),y:gb-12-(gh-26)*c.clamp((L-70)/170,0,1)};
    // el portero decide
    const smart=Math.min(.65,.22+c.sc*.035),side=tgt.x<c.W/2-gw*.16?-1:tgt.x>c.W/2+gw*.16?1:0;
    keepTo=c.W/2+(Math.random()<smart?side:c.pick([-1,0,1]))*gw*.27;
    st='fly';t0=0;c.sfx('whoosh');
  });
  c.loop((dt,t)=>{
    msgT=Math.max(0,msgT-dt);
    if(st==='fly'){t0+=dt/.62;const k=Math.min(1,t0);ball.x=bx0+(tgt.x-bx0)*k;ball.y=by0+(tgt.y-by0)*k-Math.sin(k*3.14)*50;ball.s=1-k*.55;kp.x+=(keepTo-kp.x)*Math.min(1,dt*7);
      if(k>=1){
        const on=tgt.y>gt-6&&tgt.y<gb&&tgt.x>gx+6&&tgt.x<gx+gw-6;
        if(!on){res='out';msg='¡FUERA!'}else if(Math.abs(tgt.x-kp.x)<58&&Math.abs(tgt.y-(gb-56))<92){res='save';msg='¡PARADÓN!'}else{res='goal';msg='¡GOL!'}
        st='res';pt=1.3;msgT=1.3;
        if(res==='goal'){c.setScore(c.sc+1);c.sfx('win');c.shake(6);for(let i=0;i<12;i++)c.burst(tgt.x,tgt.y,c.pick([RED,YEL,BLU]),1,300)}else{lives--;c.sfx('lose');c.vib(40)}
        if(lives<=0)c.after(1000,()=>c.over('¡FIN DEL PARTIDO!'))}}
    else if(st==='res'){pt-=dt;if(pt<=0&&!c.dead&&lives>0)reset()}
    else kp.x+=(c.W/2+Math.sin(t*1.6)*gw*.08-kp.x)*Math.min(1,dt*4);
    // fondo plano: grada, portería, césped a franjas
    c.rect(0,0,c.W,c.H,'#f2efe6');
    for(let i=0;i<14;i++)c.rect(i*c.W/14,c.T+14,c.W/14+1,56,[RED,BLU,YEL,'#f2efe6'][(i*3+(i>6?1:0))%4]);
    c.rect(0,gb,c.W,c.H-gb,'#2a9d5c');for(let i=0;i<8;i++)if(i%2)c.rect(0,gb+i*(c.H-gb)/8,c.W,(c.H-gb)/8+1,'#33b36b');
    c.rect(gx,gt,gw,gh,BLU);g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=1.5;for(let x=-gh;x<gw;x+=16){g.beginPath();g.moveTo(gx+x,gt);g.lineTo(gx+x+gh,gb);g.stroke()}
    g.fillStyle='#fff';g.fillRect(gx-7,gt-7,gw+14,8);g.fillRect(gx-7,gt-7,8,gh+7);g.fillRect(gx+gw-1,gt-7,8,gh+7);
    // portero geométrico
    g.save();g.translate(kp.x,gb-52);const lean=(st==='fly'||st==='res')?(keepTo-c.W/2)/(gw*.27)*.9:0;g.rotate(lean);
    c.rect(-24,-8,48,60,YEL,4);c.rect(-58,-4,40,14,YEL,6);c.rect(18,-4,40,14,YEL,6);c.circle(-62,3,10,RED);c.circle(62,3,10,RED);c.circle(0,-22,15,'#f4c9a0');c.rect(-14,48,12,28,BLU,3);c.rect(2,48,12,28,BLU,3);g.restore();
    c.circle(c.W/2,by0-26,3,'#fff');
    // balón
    const bs=R*ball.s;c.circle(ball.x+5,ball.y+bs*.9+(st==='fly'?10:0),bs*.9,'rgba(0,0,0,.25)');c.circle(ball.x,ball.y,bs,'#fff');g.strokeStyle='#111';g.lineWidth=3*ball.s;g.beginPath();g.arc(ball.x,ball.y,bs,0,6.2832);g.stroke();
    g.fillStyle='#111';g.beginPath();for(let i=0;i<5;i++){const a=i*1.2566-1.57+(st==='fly'?t*12:0);g.lineTo(ball.x+Math.cos(a)*bs*.45,ball.y+Math.sin(a)*bs*.45)}g.closePath();g.fill();
    if(st==='drag'||false){const p=c.ptr;const q=Object.values(p)[0];if(q){const dx=q.x-sx,dy=q.y-sy;g.strokeStyle=RED;g.lineWidth=6;g.setLineDash([2,12]);g.lineCap='round';g.beginPath();g.moveTo(bx0,by0);g.lineTo(bx0+dx*1.6,by0+dy*1.6);g.stroke();g.setLineDash([])}}
    for(let i=0;i<3;i++){c.circle(c.W-28-i*28,c.B-8,11,i<lives?RED:'rgba(0,0,0,.18)');g.strokeStyle='#111';g.lineWidth=2.5;g.beginPath();g.arc(c.W-28-i*28,c.B-8,11,0,6.2832);g.stroke()}
    if(msgT>0){g.save();g.translate(c.W/2,gt+gh+70);g.rotate(-.05);const col=res==='goal'?YEL:RED;c.txt(msg,3,3,50,'#111');c.txt(msg,0,0,50,col);g.restore()}
  });
}});

// ============ 52. MINIGOLF (pastel plano) ============
def({id:'golf',title:'MINIGOLF',emoji:'⛳',tag:'menta',hint:'👆 ARRASTRA hacia atrás y SUELTA, como un tirachinas. Máximo 6 golpes',style:'mint',skin:'light',
colors:['#e6f7ec','#c7ecd6','#2d6a4f'],font:"'Righteous',sans-serif",
music:{bpm:90,root:60,scale:'lydian',lead:'sine',bassw:'sine',bass:'walk',drums:'hats',density:.45,vol:.12,len:1.5,oct:1,pad:true},
create(c){
  const g=c.g,F={x:20,y:c.T+56,w:c.W-40,h:c.B-c.T-62},R=10;
  let ball,hole,obs,vx=0,vy=0,mv=false,strokes=0,aim=null,sink=0,msgT=0,msg='',stuck=0;
  function hole2(){
    for(let tries=0;tries<200;tries++){
      ball={x:c.R(F.x+40,F.x+F.w-40),y:F.y+F.h-40};hole={x:c.R(F.x+40,F.x+F.w-40),y:F.y+46};obs=[];
      const n=Math.min(5,2+Math.floor(c.sc/2));
      for(let i=0;i<n;i++){const w=c.R(70,150),h=c.R(18,30),x=c.R(F.x+10,F.x+F.w-w-10),y=c.R(F.y+110,F.y+F.h-110);obs.push({x,y,w,h,col:c.pick(['#f7b267','#b8a3e8','#f58fa0'])})}
      const bad=obs.some(o=>Math.hypot(Math.max(o.x,Math.min(ball.x,o.x+o.w))-ball.x,Math.max(o.y,Math.min(ball.y,o.y+o.h))-ball.y)<50||Math.hypot(Math.max(o.x,Math.min(hole.x,o.x+o.w))-hole.x,Math.max(o.y,Math.min(hole.y,o.y+o.h))-hole.y)<50);
      if(!bad)break}
    vx=vy=0;mv=false;strokes=0;aim=null;sink=0;stuck=0;
  }
  hole2();
  c.down(p=>{if(!mv&&!sink&&!c.dead)aim={sx:p.x,sy:p.y,x:p.x,y:p.y}});c.move(p=>{if(aim){aim.x=p.x;aim.y=p.y}});
  c.up(()=>{if(!aim)return;const dx=aim.sx-aim.x,dy=aim.sy-aim.y,L=Math.hypot(dx,dy);aim=null;if(L<14)return;const k=Math.min(150,L)/L;vx=dx*k*5.4;vy=dy*k*5.4;mv=true;strokes++;c.sfx('tap',.7)});
  function bounce(o){
    const qx=Math.max(o.x,Math.min(ball.x,o.x+o.w)),qy=Math.max(o.y,Math.min(ball.y,o.y+o.h));let dx=ball.x-qx,dy=ball.y-qy,d=Math.hypot(dx,dy);
    if(d<R){if(d<.001){dx=0;dy=-1;d=1}const nx=dx/d,ny=dy/d;ball.x=qx+nx*R;ball.y=qy+ny*R;const dot=vx*nx+vy*ny;if(dot<0){vx-=1.8*dot*nx;vy-=1.8*dot*ny;c.sfx('bump',1.2)}}
  }
  c.loop((dt,t)=>{
    msgT=Math.max(0,msgT-dt);
    if(mv&&!sink){
      for(let s=0;s<3;s++){const h=dt/3;ball.x+=vx*h;ball.y+=vy*h;
        if(ball.x<F.x+R){ball.x=F.x+R;vx=Math.abs(vx)*.85}if(ball.x>F.x+F.w-R){ball.x=F.x+F.w-R;vx=-Math.abs(vx)*.85}
        if(ball.y<F.y+R){ball.y=F.y+R;vy=Math.abs(vy)*.85}if(ball.y>F.y+F.h-R){ball.y=F.y+F.h-R;vy=-Math.abs(vy)*.85}
        obs.forEach(bounce);
        const dh=Math.hypot(ball.x-hole.x,ball.y-hole.y),sp=Math.hypot(vx,vy);
        if(dh<26&&sp<340){vx+=(hole.x-ball.x)*9*h;vy+=(hole.y-ball.y)*9*h}
        if(dh<12&&sp<520){sink=1;mv=false;vx=vy=0;ball.x=hole.x;ball.y=hole.y;const n=strokes;c.setScore(c.sc+(n<=2?3:n<=4?2:1));c.sfx('win');msg=n===1?'¡HOYO EN UNO!':'¡EN '+n+'!';msgT=1.3;c.after(1300,()=>{if(!c.dead)hole2()});break}}
      const f=Math.pow(.28,dt);vx*=f;vy*=f;
      if(!sink&&Math.hypot(vx,vy)<14){vx=vy=0;mv=false;if(strokes>=6)c.after(400,()=>c.over('¡DEMASIADOS GOLPES!'))}
    }
    sink=sink>0?sink+dt:0;
    // fondo y campo
    c.rect(0,0,c.W,c.H,'#e6f7ec');
    ST.paper(g,false);c.rect(F.x+4,F.y+6,F.w,F.h,'rgba(45,106,79,.35)',22);c.rect(F.x-8,F.y-8,F.w+16,F.h+16,'#2d6a4f',26);c.rect(F.x,F.y,F.w,F.h,'#95d5b2',18);
    g.save();g.beginPath();c.rr(F.x,F.y,F.w,F.h,18);g.clip();for(let i=0;i<14;i++)if(i%2)c.rect(F.x,F.y+i*F.h/14,F.w,F.h/14+1,'rgba(255,255,255,.14)');g.restore();
    obs.forEach(o=>{c.rect(o.x+4,o.y+5,o.w,o.h,'rgba(45,106,79,.45)',8);c.rect(o.x,o.y,o.w,o.h,o.col,8)});
    // hoyo y bandera
    c.circle(hole.x,hole.y,15,'#1b4332');c.circle(hole.x,hole.y+2,12,'#0b2a1f');
    if(!sink){g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(hole.x,hole.y);g.lineTo(hole.x,hole.y-46);g.stroke();g.fillStyle='#f58fa0';g.beginPath();g.moveTo(hole.x,hole.y-46);g.lineTo(hole.x+24,hole.y-38);g.lineTo(hole.x,hole.y-30);g.closePath();g.fill()}
    // guía
    if(aim){const dx=aim.sx-aim.x,dy=aim.sy-aim.y,L=Math.min(150,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);
      for(let i=1;i<=7;i++){const d=i*(L/4.5);c.circle(ball.x+Math.cos(a)*d,ball.y+Math.sin(a)*d,5-i*.4,'rgba(45,106,79,'+(.9-i*.1)+')')}
      c.rect(F.x+10,F.y+F.h-22,(F.w-20)*L/150,8,L>110?'#f58fa0':'#2d6a4f',4)}
    if(sink<=0){c.circle(ball.x+3,ball.y+4,R,'rgba(27,67,50,.4)');c.circle(ball.x,ball.y,R,'#fff');c.circle(ball.x-3,ball.y-3,3,'rgba(0,0,0,.08)')}
    else{c.circle(hole.x,hole.y,Math.max(0,R*(1-sink*1.6)),'#fff')}
    c.txt('GOLPES '+strokes+' / 6',c.W/2,c.T+30,20,'#2d6a4f');
    if(msgT>0){g.globalAlpha=Math.min(1,msgT*2);c.txt(msg,c.W/2,c.T+180,36,'#2d6a4f',null,'#e6f7ec');g.globalAlpha=1}
  });
}});
