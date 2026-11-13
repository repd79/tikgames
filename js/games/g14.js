// ============ Pack 8 bits: cada juego con la paleta de un ordenador/consola de los 80 ============
const PF="'Press Start 2P',monospace";

// ---- LADRILLOS (Amstrad CPC) ----
def({id:'brick',title:'LADRILLOS',emoji:'🧱',tag:'amstrad cpc',hint:'👆 ARRASTRA para mover la pala',style:'cpc',skin:'flat',
colors:['#000080','#00004a','#ffff00'],font:PF,
music:{bpm:132,root:55,scale:'minpent',lead:'square',bassw:'square',bass:'walk',drums:'tick',density:.7,vol:.1,len:.6,oct:1},
create(c){
  const g=c.g,W=c.W,cols=8,rows=6,bw=Math.floor((W-24)/cols),bh=18,ox=Math.round((W-cols*bw)/2),oy=Math.round(c.T+40);
  const COL=['#ff0000','#ff8000','#ffff00','#00ff00','#00ffff','#ff00ff'];
  const py=Math.round(c.B-26),pad={x:W/2,w:80};
  let br=[],ball,lives=3,lvl=1,wait=0,left=0;
  function fill(){br=[];for(let r=0;r<rows;r++)for(let i=0;i<cols;i++)br.push({x:ox+i*bw,y:oy+r*(bh+3),c:COL[r],r,a:true});left=br.length}
  function serve(){ball={x:pad.x,y:py-10,vx:0,vy:0,s:300+lvl*28};wait=.9}
  fill();serve();
  const mv=p=>{pad.x=c.clamp(p.x,pad.w/2+4,W-pad.w/2-4)};
  c.down(mv);c.move(mv);
  c.loop((dt,t)=>{
    if(!c.dead){
      if(wait>0){wait-=dt;ball.x=pad.x;ball.y=py-10;if(wait<=0){const a=-Math.PI/2+c.R(-.5,.5);ball.vx=ball.s*Math.cos(a);ball.vy=ball.s*Math.sin(a)}}
      else{
        const n=Math.ceil(Math.max(Math.abs(ball.vx),Math.abs(ball.vy))*dt/4)||1,d=dt/n;
        for(let k=0;k<n&&!c.dead&&wait<=0;k++){
          ball.x+=ball.vx*d;ball.y+=ball.vy*d;
          if(ball.x<5){ball.x=5;ball.vx=Math.abs(ball.vx);c.sfx('tick')}
          if(ball.x>W-5){ball.x=W-5;ball.vx=-Math.abs(ball.vx);c.sfx('tick')}
          if(ball.y<oy-18){ball.y=oy-18;ball.vy=Math.abs(ball.vy);c.sfx('tick')}
          if(ball.vy>0&&ball.y+5>=py&&ball.y-5<=py+10&&Math.abs(ball.x-pad.x)<pad.w/2+5){
            const rel=c.clamp((ball.x-pad.x)/(pad.w/2),-1,1),a=rel*1.05;
            ball.vx=ball.s*Math.sin(a);ball.vy=-ball.s*Math.cos(a);ball.y=py-6;c.sfx('tap',1.2)}
          for(const b of br){if(!b.a)continue;
            if(ball.x+4>b.x&&ball.x-4<b.x+bw&&ball.y+4>b.y&&ball.y-4<b.y+bh){
              const ox1=Math.min(ball.x+4-b.x,b.x+bw-(ball.x-4)),oy1=Math.min(ball.y+4-b.y,b.y+bh-(ball.y-4));
              if(ox1<oy1)ball.vx=-ball.vx;else ball.vy=-ball.vy;
              b.a=false;left--;c.setScore(c.sc+1);c.sfx('pop',1+(rows-b.r)*.12);c.burst(b.x+bw/2,b.y+bh/2,b.c,6,140);
              ball.s=Math.min(560,ball.s+3);const sp=Math.hypot(ball.vx,ball.vy)||1;ball.vx*=ball.s/sp;ball.vy*=ball.s/sp;break}}
          if(left<=0){lvl++;fill();serve();c.sfx('win');c.say('NIVEL '+lvl);break}
          if(ball.y>c.H-70){lives--;c.sfx('lose');c.shake(8);if(lives<=0){c.over('SIN VIDAS')}else serve();break}
        }
      }
    }
    c.rect(0,0,W,c.H,'#000080');
    g.fillStyle='#0000c0';for(let y=0;y<c.H;y+=4)g.fillRect(0,y,W,1);
    c.rect(2,oy-24,W-4,c.H-(oy-24)-62,'rgba(0,0,0,.22)');
    for(const b of br){if(!b.a)continue;c.rect(b.x+1,b.y,bw-2,bh,b.c);c.rect(b.x+1,b.y,bw-2,3,'rgba(255,255,255,.55)');c.rect(b.x+1,b.y+bh-3,bw-2,3,'rgba(0,0,0,.4)')}
    c.rect(pad.x-pad.w/2,py,pad.w,10,'#fff');c.rect(pad.x-pad.w/2,py,8,10,'#00ffff');c.rect(pad.x+pad.w/2-8,py,8,10,'#00ffff');
    c.rect(Math.round(ball.x)-4,Math.round(ball.y)-4,8,8,'#fff');
    for(let i=0;i<lives;i++)c.rect(14+i*16,c.T+8,10,10,'#ff0000');
  });
}});

// ---- BOMBAS (Atari 2600) ----
def({id:'kaboom',title:'BOMBAS',emoji:'💣',tag:'atari 2600',hint:'👆 ARRASTRA para atrapar las bombas con los cubos',style:'atari',skin:'flat',
colors:['#7a3b00','#4a2200','#ffd23a'],font:PF,
music:{bpm:150,root:52,scale:'pent',lead:'square',bassw:'square',bass:'pulse',drums:'hats',density:.8,vol:.1,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W,by=Math.round(c.T+30),BANDS=[['#d4a45c','#b87c30'],['#58b858','#2c7c2c'],['#5c8cd4','#3860a4'],['#d45c5c','#a43030']];
  let px=W/2,bx=W/2,dir=1,bombs=[],dropT=1,buckets=3,pause=0,flash=0;
  const top=()=>c.B-26-(buckets-1)*16;
  const mv=p=>{px=c.clamp(p.x,38,W-38)};c.down(mv);c.move(mv);
  c.loop((dt,t)=>{
    if(!c.dead){
      const sp=150+Math.min(c.sc,60)*4;
      if(pause>0)pause-=dt;
      else{
        bx+=dir*sp*dt;if(bx<24){bx=24;dir=1}if(bx>W-24){bx=W-24;dir=-1}
        if(c.R(0,1)<dt*.9)dir=-dir;
        dropT-=dt;if(dropT<=0){dropT=Math.max(.3,.95-c.sc*.012);bombs.push({x:bx,y:by+30,v:230+Math.min(c.sc,60)*5});c.sfx('tick')}
      }
      for(let i=bombs.length-1;i>=0;i--){const b=bombs[i];b.y+=b.v*dt;
        const ty=top();
        if(b.y+8>=ty&&b.y<=ty+14&&Math.abs(b.x-px)<38){bombs.splice(i,1);c.setScore(c.sc+1);c.sfx('coin',1+Math.min(c.sc,30)*.02);c.burst(px,ty,'#fff',6,120);continue}
        if(b.y>c.B-6){
          bombs=[];buckets--;flash=.35;c.sfx('hit');c.shake(10);c.burst(b.x,c.B-8,'#ffd23a',22,260);pause=1.1;dropT=1;
          if(buckets<=0)c.over('¡BOOM!');break}}
    }
    flash=Math.max(0,flash-dt);
    const lv=Math.floor(c.sc/12)%BANDS.length,bd=BANDS[lv];
    for(let y=0,i=0;y<c.H;y+=26,i++)c.rect(0,y,W,26,bd[i%2]);
    c.rect(0,0,W,c.T+4,'rgba(0,0,0,.35)');
    // bombardero (rayas de preso)
    const x0=Math.round(bx);c.rect(x0-18,by,36,10,'#000');c.rect(x0-10,by-14,20,16,'#f0d0a0');c.rect(x0-10,by-14,20,5,'#000');c.rect(x0-6,by-8,4,4,'#000');c.rect(x0+3,by-8,4,4,'#000');
    for(let i=0;i<5;i++)c.rect(x0-18,by+10+i*6,36,3,'#fff'),c.rect(x0-18,by+13+i*6,36,3,'#000');
    c.rect(x0-26,by+12,8,18,'#f0d0a0');c.rect(x0+18,by+12,8,18,'#f0d0a0');
    for(const b of bombs){const x=Math.round(b.x),y=Math.round(b.y);c.rect(x-7,y,14,14,'#000');c.rect(x-3,y-6,6,6,'#000');c.rect(x-1,y-10,2,5,'#fff');c.rect(x-7,y+2,3,3,'#fff')}
    for(let i=0;i<buckets;i++){const y=top()+i*16;c.rect(px-38,y,76,14,'#fff');c.rect(px-38,y+10,76,4,'#c8c8c8');c.rect(px-30,y+3,60,3,'#bbb')}
    if(flash>0){g.globalAlpha=flash*2;g.fillStyle='#fff';g.fillRect(0,0,W,c.H);g.globalAlpha=1}
  });
}});

// ---- PONG 64 (Commodore 64) ----
def({id:'pong64',title:'PONG 64',emoji:'🏓',tag:'commodore 64',hint:'👆 ARRASTRA para mover tu pala',style:'c64',skin:'flat',
colors:['#40318d','#352879','#a0a0ff'],font:PF,
music:{bpm:118,root:48,scale:'minor',lead:'square',bassw:'sawtooth',bass:'walk',drums:'four',density:.6,vol:.1,len:.7,oct:1},
create(c){
  const g=c.g,W=c.W,F={x:16,y:Math.round(c.T-2),w:W-32,h:Math.round(c.B-c.T+8)};
  const py=F.y+F.h-26,ay=F.y+30,pw=72,LB='#a59fff',BG='#40318d';
  let me=W/2,ai=W/2,ball,lives=3,wait=1,aiErr=0,toward=1;
  const spd=()=>Math.min(640,310+c.sc*14);
  function serve(dirY){ball={x:W/2,y:(py+ay)/2,vx:0,vy:0};wait=.9;toward=dirY}
  serve(1);
  const mv=p=>{me=c.clamp(p.x,F.x+pw/2,F.x+F.w-pw/2)};c.down(mv);c.move(mv);
  c.loop((dt,t)=>{
    if(!c.dead){
      if(wait>0){wait-=dt;if(wait<=0){const a=c.R(-.6,.6),s=spd();ball.vx=s*Math.sin(a);ball.vy=toward*s*Math.cos(a)}}
      else{
        const n=Math.ceil(Math.max(Math.abs(ball.vx),Math.abs(ball.vy))*dt/5)||1,d=dt/n;
        for(let k=0;k<n&&!c.dead&&wait<=0;k++){
          ball.x+=ball.vx*d;ball.y+=ball.vy*d;
          if(ball.x<F.x+6){ball.x=F.x+6;ball.vx=Math.abs(ball.vx);c.sfx('tick')}
          if(ball.x>F.x+F.w-6){ball.x=F.x+F.w-6;ball.vx=-Math.abs(ball.vx);c.sfx('tick')}
          if(ball.vy>0&&ball.y+6>=py&&ball.y-6<=py+10&&Math.abs(ball.x-me)<pw/2+6){
            const rel=c.clamp((ball.x-me)/(pw/2),-1,1),s=Math.min(640,Math.hypot(ball.vx,ball.vy)+8),a=rel*1.0;
            ball.vx=s*Math.sin(a);ball.vy=-s*Math.cos(a);ball.y=py-7;aiErr=c.R(-34,34);c.sfx('tap',1.1)}
          if(ball.vy<0&&ball.y-6<=ay+10&&ball.y+6>=ay&&Math.abs(ball.x-ai)<pw/2+6){
            const rel=c.clamp((ball.x-ai)/(pw/2),-1,1),s=Math.hypot(ball.vx,ball.vy),a=rel*1.0;
            ball.vx=s*Math.sin(a);ball.vy=s*Math.cos(a);ball.y=ay+17;c.sfx('tap',.9)}
          if(ball.y<F.y+8){c.setScore(c.sc+1);c.sfx('coin');c.burst(ball.x,F.y+10,'#fff',10,160);serve(1);break}
          if(ball.y>F.y+F.h-6){lives--;c.sfx('lose');c.shake(8);if(lives<=0)c.over('GAME OVER');else serve(-1);break}
        }
        // IA
        const tgt=ball.vy<0?ball.x+aiErr:W/2,as=150+Math.min(c.sc,25)*9;
        ai+=c.clamp(tgt-ai,-as*dt,as*dt);ai=c.clamp(ai,F.x+pw/2,F.x+F.w-pw/2);
      }
    }
    c.rect(0,0,W,c.H,LB);c.rect(F.x,F.y,F.w,F.h,BG);
    c.txt('**** TIKGAMESX 64 BASIC V2 ****',W/2,F.y+10,8,LB,'center');
    g.fillStyle=LB;for(let x=F.x+8;x<F.x+F.w-8;x+=22)g.fillRect(x,(py+ay)/2-2,12,4);
    c.rect(Math.round(ai-pw/2),ay,pw,10,'#fff');c.rect(Math.round(ai-pw/2),ay+10,pw,3,LB);
    c.rect(Math.round(me-pw/2),py,pw,10,'#fff');c.rect(Math.round(me-pw/2),py+10,pw,3,LB);
    c.rect(Math.round(ball.x)-6,Math.round(ball.y)-6,12,12,'#fff');
    for(let i=0;i<lives;i++)c.rect(F.x+10+i*16,F.y+F.h-18,10,10,LB);
    if(Math.floor(t*2)%2===0&&wait>0)c.rect(F.x+10,F.y+F.h-40,12,16,LB);
  });
}});

// ---- BLOQUES (ZX Spectrum) ----
def({id:'zxblocks',title:'BLOQUES ZX',emoji:'🟦',tag:'zx spectrum',hint:'👆 TOCA girar · ARRASTRA ↔ mover · DESLIZA ↓ soltar',style:'zx',skin:'flat',
colors:['#000000','#101018','#00d7d7'],font:PF,
music:{bpm:128,root:57,scale:'minor',lead:'square',bassw:'square',bass:'walk',drums:'half',density:.75,vol:.1,len:.6,oct:1},
create(c){
  const g=c.g,W=c.W,cols=10;
  const cs=Math.floor(Math.min((W-36)/cols,(c.PH-50)/18)),rows=Math.min(20,Math.floor((c.PH-46)/cs));
  const ox=Math.round((W-cols*cs)/2),oy=Math.round(c.B-rows*cs);
  const COL=['#00d7d7','#d7d700','#d700d7','#00d700','#d70000','#0000d7','#d7d7d7'];
  const SH=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
  const rot=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
  let grid=Array.from({length:rows},()=>Array(cols).fill(0)),cur,nxt=Math.floor(Math.random()*7),tm=0,lines=0,flash=[],fl=0;
  const fits=(m,x,y)=>{for(let j=0;j<m.length;j++)for(let i=0;i<m[0].length;i++)if(m[j][i]){const gx=x+i,gy=y+j;if(gx<0||gx>=cols||gy>=rows)return false;if(gy>=0&&grid[gy][gx])return false}return true};
  function spawn(){const k=nxt;nxt=Math.floor(Math.random()*7);const m=SH[k].map(r=>r.slice());cur={k,m,x:Math.floor((cols-m[0].length)/2),y:-1};if(!fits(m,cur.x,cur.y)){c.sfx('lose');c.shake(8);c.over('LLENO')}}
  function lock(){
    cur.m.forEach((r,j)=>r.forEach((v,i)=>{if(v&&cur.y+j>=0)grid[cur.y+j][cur.x+i]=cur.k+1}));
    let n=0;for(let y=rows-1;y>=0;y--){if(grid[y].every(v=>v)){grid.splice(y,1);grid.unshift(Array(cols).fill(0));n++;y++}}
    if(n){lines+=n;c.setScore(c.sc+[0,100,300,500,800][n]);c.sfx('win',1+n*.1);c.shake(4+n*2);fl=.25}else c.sfx('bump',.7);
    spawn();
  }
  const drop=()=>{if(fits(cur.m,cur.x,cur.y+1)){cur.y++;return true}lock();return false};
  spawn();
  let sx=0,sy=0,sc0=0,moved=false,hard=false,t0=0;
  c.down(p=>{sx=p.x;sy=p.y;sc0=cur?cur.x:0;moved=false;hard=false;t0=performance.now()});
  c.move(p=>{if(c.dead||!cur)return;const tx=sc0+Math.round((p.x-sx)/(cs*.9));
    if(Math.abs(p.x-sx)>10)moved=true;
    while(cur.x<tx&&fits(cur.m,cur.x+1,cur.y)){cur.x++;c.sfx('tick')}
    while(cur.x>tx&&fits(cur.m,cur.x-1,cur.y)){cur.x--;c.sfx('tick')}
    if(!hard&&!moved&&p.y-sy>cs*2.2||(!hard&&p.y-sy>cs*2.8)){hard=true;let guard=0;const k=cur;while(cur===k&&guard++<40&&!c.dead)drop()}});
  c.up(p=>{if(c.dead||!cur||moved||hard)return;if(performance.now()-t0>350)return;
    const m=rot(cur.m);for(const dx of[0,-1,1,-2,2]){if(fits(m,cur.x+dx,cur.y)){cur.m=m;cur.x+=dx;c.sfx('tap',1.3);break}}});
  c.loop((dt,t)=>{
    if(!c.dead){tm+=dt;const iv=Math.max(.08,.72-Math.floor(lines/5)*.06);if(tm>=iv){tm=0;drop()}}
    fl=Math.max(0,fl-dt);
    c.rect(0,0,W,c.H,'#000');
    // borde de carga ZX
    const SS=['#d70000','#d7d700','#00d700','#00d7d7','#d700d7','#0000d7'];for(let i=0;i<SS.length;i++){c.rect(0,i*5,W,5,SS[(i+Math.floor(t*6))%SS.length])}
    c.rect(ox-6,oy-6,cols*cs+12,rows*cs+12,'#d7d7d7');c.rect(ox-3,oy-3,cols*cs+6,rows*cs+6,'#000');
    const cell=(x,y,k)=>{const col=COL[k];c.rect(x,y,cs,cs,col);c.rect(x+2,y+2,cs-4,cs-4,'#000');c.rect(x+3,y+3,cs-6,cs-6,col);c.rect(x+cs/2-1,y+cs/2-1,3,3,'#000')};
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(grid[y][x])cell(ox+x*cs,oy+y*cs,grid[y][x]-1);
    if(cur&&!c.dead){let gy=cur.y;while(fits(cur.m,cur.x,gy+1))gy++;
      cur.m.forEach((r,j)=>r.forEach((v,i)=>{if(v&&gy+j>=0){g.strokeStyle=COL[cur.k];g.lineWidth=1;g.strokeRect(ox+(cur.x+i)*cs+2.5,oy+(gy+j)*cs+2.5,cs-5,cs-5)}}));
      cur.m.forEach((r,j)=>r.forEach((v,i)=>{if(v&&cur.y+j>=0)cell(ox+(cur.x+i)*cs,oy+(cur.y+j)*cs,cur.k)}))}
    // siguiente
    c.txt('NEXT',W-48,c.T+4,8,'#d7d7d7','center');
    const nm=SH[nxt],ps=10;nm.forEach((r,j)=>r.forEach((v,i)=>{if(v)c.rect(W-48-nm[0].length*ps/2+i*ps,c.T+16+j*ps,ps-1,ps-1,COL[nxt])}));
    if(fl>0){g.globalAlpha=fl*1.6;g.fillStyle='#fff';g.fillRect(ox,oy,cols*cs,rows*cs);g.globalAlpha=1}
  });
}});

// ---- SALTOS (NES) ----
def({id:'hop8',title:'SALTITOS',emoji:'🍄',tag:'nes',hint:'👆 ARRASTRA ↔ para moverte · rebotas solo',style:'nes',skin:'flat',
colors:['#5c94fc','#3868d8','#fc9838'],font:PF,
music:{bpm:160,root:60,scale:'major',lead:'square',bassw:'triangle',bass:'walk',drums:'hats',density:.85,vol:.1,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W,H=c.H,SPR=["..GGGGGG..",".GGGGGGGG.",".SSSSSSSS.",".SKSSSSKS.",".SSSSSSSS.","..BBBBBB..",".BBBBBBBB.",".BB.BB.BB.","..BB..BB.."];
  const PAL={G:'#00a800',S:'#fcbcb0',K:'#000',B:'#a04c10'},px=3,hw=10*px;
  let h={x:W/2,y:c.B-40,vy:-820,face:1},tx=W/2,camY=0,P=[],topY=0,best=0,clouds=[];
  const start=h.y;
  P.push({x:0,y:c.B-10,w:W,t:'floor'});topY=c.B-10;
  function gen(){while(topY>camY-200){const hgt=(start-topY)/12,gap=c.R(62,Math.min(150,92+hgt*.12));topY-=gap;
    const r=Math.random(),w=64;let t='n';if(hgt>25&&r<.2)t='m';else if(hgt>12&&r<.4)t='c';
    const p={x:c.R(6,W-w-6),y:topY,w,t,ph:c.R(0,6),s:0};if(t==='n'&&Math.random()<.1)p.s=1;P.push(p)}}
  for(let i=0;i<5;i++)clouds.push({x:c.R(0,W),y:c.R(0,H),s:c.RI(2,4)});
  c.down(p=>{tx=p.x});c.move(p=>{tx=p.x});
  c.loop((dt,t)=>{
    if(!c.dead){
      h.vy+=1500*dt;const ox=h.x;h.x+=c.clamp(tx-h.x,-520*dt,520*dt);if(Math.abs(h.x-ox)>.5)h.face=h.x>ox?1:-1;
      const oy=h.y;h.y+=h.vy*dt;
      if(h.vy>0){for(const p of P){if(p.dead)continue;const px0=p.t==='m'?p.x+Math.sin(t*1.6+p.ph)*70:p.x;
        if(h.x+hw/2-4>px0&&h.x-hw/2+4<px0+p.w&&oy+9*px<=p.y+4&&h.y+9*px>=p.y){
          if(p.t==='c'){p.dead=true;c.sfx('bump');c.burst(px0+p.w/2,p.y,'#fc9838',10,120);continue}
          h.y=p.y-9*px;h.vy=p.s?-1200:-800;c.sfx(p.s?'jump':'tap',p.s?1.5:1.1);if(p.s)c.say('¡MUELLE!',700);break}}}
      camY=Math.min(camY,h.y-H*.45);gen();
      const sc=Math.floor((start-camY)/12);if(sc>best){best=sc;c.setScore(sc)}
      if(h.y-camY>H+30){c.sfx('lose');c.shake(8);c.over('¡CAÍSTE!')}
    }
    c.rect(0,0,W,H,'#5c94fc');
    for(const k of clouds){const y=((k.y-camY*.25)%(H+60)+H+60)%(H+60)-30;g.fillStyle='#fff';const s=k.s*6;g.fillRect(k.x,y,s*6,s);g.fillRect(k.x+s,y-s,s*4,s);g.fillRect(k.x+s*2,y-2*s,s*2,s)}
    for(const p of P){if(p.dead)continue;const y=Math.round(p.y-camY);if(y<-20||y>H+20)continue;
      const x=Math.round(p.t==='m'?p.x+Math.sin(t*1.6+p.ph)*70:p.x);
      if(p.t==='floor'){for(let i=0;i<W;i+=16){c.rect(i,y,16,16,'#c84c0c');c.rect(i,y,16,3,'#fcbcb0');c.rect(i+15,y,1,16,'#000')}continue}
      const bc=p.t==='m'?'#0058f8':p.t==='c'?'#fcd8a8':'#00a800',dk=p.t==='m'?'#003088':p.t==='c'?'#c8a070':'#005800';
      for(let i=0;i<p.w;i+=16){c.rect(x+i,y,16,14,bc);c.rect(x+i,y,16,3,'rgba(255,255,255,.45)');c.rect(x+i,y+11,16,3,dk);c.rect(x+i+15,y,1,14,'#000')}
      if(p.t==='c'){g.fillStyle='#000';g.fillRect(x+20,y,2,8);g.fillRect(x+40,y+4,2,10)}
      if(p.s){c.rect(x+p.w/2-6,y-8,12,8,'#d82800');c.rect(x+p.w/2-4,y-12,8,4,'#fc9838')}}
    const fr=Math.floor(t*10)%2;g.save();const hx=Math.round(h.x),hy=Math.round(h.y-camY);
    ST.spr(g,SPR,hx-hw/2,hy-9*px+(h.vy<0&&fr?-2:0),px,PAL,h.face<0);g.restore();
  });
}});

// ---- NAVES (Master System) ----
def({id:'shmup',title:'ESCUADRÓN',emoji:'🚀',tag:'master system',hint:'👆 ARRASTRA para pilotar · disparas solo',style:'sms',skin:'flat',
colors:['#0000aa','#000066','#55ffff'],font:PF,
music:{bpm:146,root:50,scale:'harm',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'break',density:.8,vol:.1,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W,H=c.H;
  const SHIP=["....W....","....W....","...WCW...","..WCCCW..",".WCCCCCW.",".WCWWWCW.","WW.CCC.WW","R..RRR..R"];
  const E1=[".GG..GG.","GGGGGGGG","GWKGGWKG","GGGGGGGG",".G.GG.G.","G......G"];
  const E2=["..OOOO..",".OOOOOO.","OOKOOKOO","OOOOOOOO","O.OOOO.O","O..OO..O"];
  const PS={W:'#fff',C:'#55ffff',R:'#ff5555'},P1={G:'#55ff55',W:'#fff',K:'#000'},P2={O:'#ffaa00',K:'#000'};
  const px=3;let ship={x:W/2,y:c.B-50,tx:W/2,ty:c.B-50},bl=[],en=[],eb=[],it=[],fire=0,lvl=1,lives=3,inv=0,spawnT=1,wave=0,bgY=0,stars=[];
  for(let i=0;i<40;i++)stars.push({x:c.R(0,W),y:c.R(0,H),s:c.RI(1,3)});
  const mv=p=>{ship.tx=c.clamp(p.x,20,W-20);ship.ty=c.clamp(p.y-60,c.T+60,c.B-14)};c.down(mv);c.move(mv);
  function wave1(){wave++;const k=wave%4,n=5;
    for(let i=0;i<n;i++){
      if(k===1)en.push({x:W*(i+.5)/n,y:c.T-20-i*34,t:1,hp:1,ph:i*.7,vx:0,vy:110+wave*3,sh:0});
      else if(k===2)en.push({x:-20-i*40,y:c.T+30+i*18,t:1,hp:1,ph:0,vx:150+wave*2,vy:34,sh:0});
      else if(k===3)en.push({x:W+20+i*40,y:c.T+30+i*18,t:1,hp:1,ph:0,vx:-(150+wave*2),vy:34,sh:0});
      else if(i%2===0)en.push({x:W*(i+.5)/n,y:c.T-30,t:2,hp:3,ph:0,vx:0,vy:60,sh:c.R(.5,1.6)})}}
  c.loop((dt,t)=>{
    bgY=(bgY+60*dt)%H;
    if(!c.dead){
      ship.x+=c.clamp(ship.tx-ship.x,-700*dt,700*dt);ship.y+=c.clamp(ship.ty-ship.y,-700*dt,700*dt);inv=Math.max(0,inv-dt);
      fire-=dt;if(fire<=0){fire=.17;const L=Math.min(3,lvl);const o=L===1?[0]:L===2?[-9,9]:[-12,0,12];o.forEach(d=>bl.push({x:ship.x+d,y:ship.y-18,vx:L===3&&d?d*4:0}));c.sfx('tap',1.6)}
      spawnT-=dt;if(spawnT<=0&&en.length<8){spawnT=Math.max(1.5,3.3-wave*.1);wave1()}
      for(const b of bl){b.y-=620*dt;b.x+=b.vx*dt}bl=bl.filter(b=>b.y>c.T-30);
      for(const e of en){
        if(e.t===1&&e.vx===0){e.y+=e.vy*dt;e.x+=Math.sin(t*3+e.ph)*60*dt}else{e.x+=e.vx*dt;e.y+=e.vy*dt*(e.t===1?.35:1)+(e.t===1?Math.sin(t*3+e.x*.02)*30*dt:0)}
        if(e.t===2){e.sh-=dt;if(e.sh<=0){e.sh=1.5;const a=Math.atan2(ship.y-e.y,ship.x-e.x);eb.push({x:e.x,y:e.y+10,vx:Math.cos(a)*190,vy:Math.sin(a)*190})}}
        for(const b of bl){if(b.dead)continue;if(Math.abs(b.x-e.x)<16&&Math.abs(b.y-e.y)<14){b.dead=true;e.hp--;c.burst(b.x,b.y,'#fff',3,90);if(e.hp<=0){e.dead=true;c.setScore(c.sc+(e.t===2?30:10));c.sfx('pop',e.t===2?.7:1.2);c.burst(e.x,e.y,e.t===2?'#ffaa00':'#55ff55',14,200);if(Math.random()<.14)it.push({x:e.x,y:e.y})}break}}
        if(!e.dead&&inv<=0&&Math.abs(ship.x-e.x)<18&&Math.abs(ship.y-e.y)<16){e.dead=true;hurt()}}
      en=en.filter(e=>!e.dead&&e.y<H+30&&e.x>-90&&e.x<W+90);bl=bl.filter(b=>!b.dead);
      for(const b of eb){b.x+=b.vx*dt;b.y+=b.vy*dt;if(inv<=0&&Math.hypot(b.x-ship.x,b.y-ship.y)<10){b.dead=true;hurt()}}eb=eb.filter(b=>!b.dead&&b.y<H&&b.y>0&&b.x>0&&b.x<W);
      for(const i of it){i.y+=90*dt;if(Math.hypot(i.x-ship.x,i.y-ship.y)<22){i.dead=true;lvl=Math.min(3,lvl+1);c.sfx('win',1.2);c.say('¡DISPARO '+lvl+'!',900)}}it=it.filter(i=>!i.dead&&i.y<H);
    }
    function hurt(){lives--;inv=1.6;c.sfx('hit');c.shake(10);c.burst(ship.x,ship.y,'#55ffff',20,220);lvl=Math.max(1,lvl-1);if(lives<=0)c.over('DERRIBADO')}
    // dibujo
    c.rect(0,0,W,H,'#0000aa');
    g.fillStyle='#0000dd';for(let y=-40;y<H;y+=80){const yy=(y+bgY)%(H+80)-40;g.fillRect(40,yy,70,26);g.fillRect(W-130,yy+40,90,26)}
    g.fillStyle='#00aa00';for(let k=0;k<3;k++){const yy=((k*300+bgY*1.5)%(H+120))-80;g.fillRect(W*.15+k*40,yy,64,40);g.fillRect(W*.15+k*40+16,yy-14,32,14)}
    for(const s of stars){const y=(s.y+bgY*s.s*.6)%H;c.rect(s.x,y,s.s,s.s,'#aaaaff')}
    for(const e of en)ST.spr(g,e.t===1?E1:E2,e.x-4*px*(e.t===2?1.4:1),e.y-3*px*(e.t===2?1.4:1),px*(e.t===2?1.4:1),e.t===1?P1:P2);
    for(const b of bl)c.rect(b.x-2,b.y-8,4,12,'#ffff55');
    for(const b of eb){c.rect(b.x-3,b.y-3,6,6,'#ff5555')}
    for(const i of it){c.rect(i.x-9,i.y-9,18,18,'#ffff55');c.rect(i.x-7,i.y-7,14,14,'#ff5555');c.txt('P',i.x,i.y+1,9,'#fff')}
    if(!c.dead&&(inv<=0||Math.floor(t*14)%2))ST.spr(g,SHIP,ship.x-4.5*px,ship.y-4*px,px,PS);
    for(let i=0;i<lives;i++)c.rect(W-26-i*16,c.T+4,10,10,'#55ffff');
  });
}});

// ---- QUESOS (arcade clásico, laberinto) ----
def({id:'cheese',title:'RATA QUESO',emoji:'🧀',tag:'arcade',hint:'👆 DESLIZA o toca hacia dónde ir. ¡Huye de los gatos!',style:'arcade8',skin:'flat',
colors:['#000000','#06061a','#ffb000'],font:PF,
music:{bpm:140,root:55,scale:'minpent',lead:'square',bassw:'square',bass:'walk',drums:'hats',density:.8,vol:.1,len:.55,oct:1},
create(c){
  const g=c.g,W=c.W;
  const MAZE=["###########","#o...#...o#","#.##.#.##.#","#.........#","#.##.#.##.#","#....#....#","####.#.####","#.........#","####.#.####","#....#....#","#.##.#.##.#","#.........#","#.##.#.##.#","#o...#...o#","###########"];
  const R=MAZE.length,C=11,cs=Math.floor(Math.min((W-20)/C,(c.PH-6)/R)),ox=Math.round((W-C*cs)/2),oy=Math.round(c.T+(c.PH-R*cs)/2+4);
  const MOUSE=["gg....gg","gpg..gpg","gggggggg","gkgggkgg","ggggggpg","gggggggg",".gggggg.","tt.gg.g."];
  const CAT=["o......o","oo....oo","oooooooo","owkoowko","oooooooo","oooMMooo","oooooooo","o.o..o.o"];
  const CC=['#ff5555','#ffaa00','#ff55ff'];
  let dots,left,m,cats,lives=3,lvl=1,scared=0,qd={x:0,y:0},tm=0;
  const open=(x,y)=>x>=0&&y>=0&&x<C&&y<R&&MAZE[y][x]!=='#';
  function reset(){m={tx:5,ty:11,dx:0,dy:0,p:0,f:1};cats=[{tx:3,ty:7,dx:0,dy:0,p:0,w:0,i:0},{tx:5,ty:7,dx:0,dy:0,p:0,w:1.5,i:1},{tx:7,ty:7,dx:0,dy:0,p:0,w:3,i:2}];qd={x:0,y:0}}
  function fill(){dots=MAZE.map(r=>r.split('').map(ch=>ch==='.'?1:ch==='o'?2:0));dots[11][5]=0;dots[7][3]=dots[7][5]=dots[7][7]=0;left=0;dots.forEach(r=>r.forEach(v=>{if(v)left++}))}
  fill();reset();
  const want=(dx,dy)=>{qd={x:dx,y:dy};if(m.dx===0&&m.dy===0&&open(m.tx+dx,m.ty+dy)){m.dx=dx;m.dy=dy;m.p=0}else if(dx===-m.dx&&dy===-m.dy&&(dx||dy)){m.tx+=m.dx;m.ty+=m.dy;m.p=1-m.p;m.dx=dx;m.dy=dy}};
  const mpos=e=>({x:ox+(e.tx+e.dx*e.p+.5)*cs,y:oy+(e.ty+e.dy*e.p+.5)*cs});
  let sx=0,sy=0,sw=false;
  c.down(p=>{sx=p.x;sy=p.y;sw=false;const mp=mpos(m),dx=p.x-mp.x,dy=p.y-mp.y;if(Math.abs(dx)>Math.abs(dy))want(dx>0?1:-1,0);else want(0,dy>0?1:-1)});
  c.move(p=>{if(sw)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>26){sw=true;if(Math.abs(dx)>Math.abs(dy))want(dx>0?1:-1,0);else want(0,dy>0?1:-1)}});
  function stepEnt(e,sp,dt,pick){
    if(e.dx===0&&e.dy===0){pick(e);return}
    e.p+=sp*dt;
    while(e.p>=1){e.tx+=e.dx;e.ty+=e.dy;e.p-=1;pick(e);if(e.dx===0&&e.dy===0){e.p=0;break}}
  }
  function pickMouse(e){
    if(qd.x||qd.y){if(open(e.tx+qd.x,e.ty+qd.y)){e.dx=qd.x;e.dy=qd.y;e.f=qd.x||e.f;return}}
    if(!open(e.tx+e.dx,e.ty+e.dy)){e.dx=0;e.dy=0}
  }
  function pickCat(e){
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>open(e.tx+d[0],e.ty+d[1])),back=dirs.filter(d=>!(d[0]===-e.dx&&d[1]===-e.dy&&(e.dx||e.dy)));
    const cand=back.length?back:dirs;let best;
    if(Math.random()<(scared>0?.5:.75)){const s=scared>0?-1:1;best=cand.slice().sort((a,b)=>s*(Math.abs(e.tx+a[0]-m.tx)+Math.abs(e.ty+a[1]-m.ty)-Math.abs(e.tx+b[0]-m.tx)-Math.abs(e.ty+b[1]-m.ty)))[0]}
    else best=cand[Math.floor(Math.random()*cand.length)];
    e.dx=best[0];e.dy=best[1];
  }
  c.loop((dt,t)=>{
    if(!c.dead){
      tm+=dt;scared=Math.max(0,scared-dt);
      stepEnt(m,5.4,dt,pickMouse);
      const mp0=m.p>.5?{x:m.tx+m.dx,y:m.ty+m.dy}:{x:m.tx,y:m.ty};
      if(dots[mp0.y]&&dots[mp0.y][mp0.x]){const v=dots[mp0.y][mp0.x];dots[mp0.y][mp0.x]=0;left--;c.setScore(c.sc+(v===2?5:1));
        if(v===2){scared=6;c.sfx('win');c.say('¡QUESO PICANTE!',900)}else c.sfx('tick');
        if(left<=0){lvl++;fill();reset();c.sfx('win');c.say('NIVEL '+lvl);return}}
      for(const k of cats){if(k.w>0){k.w-=dt;continue}stepEnt(k,(scared>0?3.2:3.6+Math.min(lvl,6)*.25),dt,pickCat);
        const a=mpos(k),b=mpos(m);
        if(Math.hypot(a.x-b.x,a.y-b.y)<cs*.55){
          if(scared>0){c.setScore(c.sc+10);c.sfx('coin',1.4);c.float('+10',b.x,b.y-10,'#ffb000');k.tx=5;k.ty=7;k.dx=0;k.dy=0;k.p=0;k.w=2.5}
          else{lives--;c.sfx('lose');c.shake(10);if(lives<=0){c.over('¡ATRAPADO!');break}else{reset();for(const q of cats)q.w=1.2;scared=0;break}}}}
    }
    c.rect(0,0,W,c.H,'#000');
    for(let y=0;y<R;y++)for(let x=0;x<C;x++){
      if(MAZE[y][x]==='#'){c.rect(ox+x*cs+1,oy+y*cs+1,cs-2,cs-2,'#2121de');c.rect(ox+x*cs+5,oy+y*cs+5,cs-10,cs-10,'#000')}
      else{const v=dots[y][x];if(v===1)c.rect(ox+(x+.5)*cs-2,oy+(y+.5)*cs-2,4,4,'#ffb8ae');else if(v===2&&Math.floor(t*4)%2)c.rect(ox+(x+.5)*cs-6,oy+(y+.5)*cs-6,12,12,'#ffb000')}}
    const sp=cs/8;
    for(const k of cats){const p=mpos(k),sc=scared>0&&!(scared<1.5&&Math.floor(t*8)%2);
      ST.spr(g,CAT,p.x-cs*.45,p.y-cs*.45,cs*.9/8,{o:sc?'#2121de':CC[k.i],w:'#fff',k:sc?'#fff':'#000',M:sc?'#fff':'#000'})}
    const p=mpos(m);ST.spr(g,MOUSE,p.x-cs*.45,p.y-cs*.45,cs*.9/8,{g:'#c8c8c8',p:'#ff8fb0',k:'#000',t:'#ff8fb0'},m.f<0);
    for(let i=0;i<lives;i++)c.rect(14+i*16,c.T+8,10,10,'#c8c8c8');
  });
}});
