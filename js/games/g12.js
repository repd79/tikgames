// ============ 53. TORRE DE HANÓI (madera pintada) ============
def({id:'hanoi',title:'TORRE DE HANÓI',emoji:'🗼',tag:'juguete de madera',hint:'👆 TOCA una varilla para coger el disco de arriba y otra para soltarlo. Pasa la torre a la DERECHA',style:'wood',skin:'dark',
colors:['#a8744a','#7a4e2d','#ffd166'],font:"'Luckiest Guy',sans-serif",
music:{bpm:96,root:55,scale:'major',lead:'triangle',bassw:'sine',bass:'walk',drums:'tick',density:.45,vol:.13,len:1.2,oct:1},
create(c){
  const g=c.g,COL=['#e63946','#f4a261','#ffd166','#52b788','#4cc9f0','#8d5cf6','#f072b6'];
  const baseY=Math.round(c.B-70),px=i=>c.W*(i*2+1)/6,pw=c.W/3-14,dh=Math.min(30,Math.floor((baseY-c.T-170)/8));
  let n=3,P,sel=-1,moves=0,tl,tmax,lvl=0,flash=0,shake=0,anim={};
  const best=k=>Math.pow(2,k)-1;
  function init(){P=[[],[],[]];for(let i=n;i>=1;i--)P[0].push(i);sel=-1;moves=0;tmax=best(n)*1.35+9;tl=tmax;anim={}}
  init();
  const wOf=d=>34+(pw-34)*(d-1)/Math.max(1,6);
  const pos=(pg,idx)=>({x:px(pg),y:baseY-dh*(idx+.5)-6});
  c.down(p=>{
    if(c.dead||flash>0)return;const i=Math.floor(p.x/(c.W/3));if(i<0||i>2)return;
    if(sel<0){if(P[i].length){sel=i;c.sfx('tap',1.2)}}
    else if(sel===i){sel=-1;c.sfx('tap',.8)}
    else{const d=P[sel][P[sel].length-1],top=P[i][P[i].length-1];
      if(top&&top<d){c.sfx('hit');c.shake(5);sel=-1;shake=.25;return}
      P[sel].pop();P[i].push(d);anim[d]={f:pos(sel,P[sel].length),t:0};sel=-1;moves++;c.sfx('tap',1);
      if(P[2].length===n){c.setScore(c.sc+1);c.sfx('win');flash=1.1;c.say(moves<=best(n)?'¡PERFECTO!':'¡TORRE COMPLETA!',1200);c.after(1100,()=>{if(!c.dead){n=Math.min(7,n+1);flash=0;init()}})}}
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt);
    if(!c.dead&&flash<=0){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡SE ACABÓ EL TIEMPO!')}}
    // tablones de madera
    c.rect(0,0,c.W,c.H,'#a8744a');
    for(let i=0;i<14;i++){const y=i*c.H/14;c.rect(0,y,c.W,c.H/14,i%2?'#a06c43':'#ae7a50');g.fillStyle='rgba(60,30,10,.28)';g.fillRect(0,y,c.W,2);
      g.strokeStyle='rgba(70,40,15,.13)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(0,y+8+k*9);for(let x=0;x<=c.W;x+=20)g.lineTo(x,y+8+k*9+Math.sin(x*.03+i+k)*2);g.stroke()}}
    ST.grain(g,c.W,c.H,.12,'#3b2210');
    // base y varillas
    c.rect(14,baseY,c.W-28,22,'#5b3a1f',8);c.rect(14,baseY,c.W-28,8,'#7d5230',6);
    for(let i=0;i<3;i++){const x=px(i);c.rect(x-7,baseY-dh*9,14,dh*9+2,'#5b3a1f',6);c.rect(x-7,baseY-dh*9,5,dh*9+2,'rgba(255,255,255,.12)',3)}
    c.rect(px(2)-pw/2,baseY-4,pw,6,'rgba(255,209,102,.8)',3);c.txt('META',px(2),baseY+11,14,'#ffd166');
    // discos
    for(let pg=0;pg<3;pg++)for(let k=0;k<P[pg].length;k++){
      const d=P[pg][k],q=pos(pg,k),lifted=sel===pg&&k===P[pg].length-1;let x=q.x,y=q.y;const w=wOf(d);
      if(anim[d]){anim[d].t=Math.min(1,anim[d].t+dt*6);const a=anim[d],e=a.t;x=a.f.x+(q.x-a.f.x)*e;y=a.f.y+(q.y-a.f.y)*e-Math.sin(e*3.14)*40;if(e>=1)delete anim[d]}
      if(lifted)y=baseY-dh*9-18;
      const dx=shake>0&&lifted?Math.sin(t*90)*3:0;
      g.save();g.translate(x+dx,y);c.rect(-w/2+3,-dh/2+5,w,dh,'rgba(40,20,5,.35)',dh/2);c.rect(-w/2,-dh/2,w,dh,COL[(d-1)%7],dh/2);c.rect(-w/2+5,-dh/2+3,w-10,dh*.3,'rgba(255,255,255,.35)',dh*.15);
      c.rect(-w/2,dh/2-6,w,6,'rgba(0,0,0,.14)',3);g.restore();
    }
    // marcador
    c.txt('MOV '+moves+'  /  MEJOR '+best(n),c.W/2,c.T+30,20,'#fff3d6');
    c.rect(24,c.T+50,c.W-48,10,'rgba(0,0,0,.28)',5);c.rect(24,c.T+50,(c.W-48)*Math.max(0,tl/tmax),10,tl/tmax>.25?'#ffd166':'#e63946',5);
    c.txt(n+' DISCOS',c.W/2,c.T+84,14,'rgba(255,243,214,.8)');
  });
}});

// ============ 54. RESCATE (pantalla LCD de bolsillo) ============
def({id:'rescue',title:'RESCATE LCD',emoji:'🚒',tag:'lcd de bolsillo',hint:'👆 TOCA el carril (izq / centro / der) para mover la camilla bajo los que saltan',style:'lcd',skin:'light flat',
colors:['#c9c4b2','#a8a28f','#d33f2a'],font:"'Share Tech Mono',monospace",
music:{bpm:140,root:64,scale:'pent',lead:'square',bassw:'square',bass:'pulse',drums:'hats',density:.7,vol:.09,len:.5,oct:1},
create(c){
  const g=c.g,ON='#1f2a18',OFF='rgba(31,42,24,.11)',LCD='#b4c19b';
  const sw=c.W-36,sh=Math.min(c.PH-70,sw*1.25),sx=18,sy=Math.round(c.T+34+(c.PH-70-sh)/2),px=Math.max(3,Math.floor(sw/70));
  const PE=[["..##..","..##..",".####.","#.##.#","..##..",".#..#.","#....#"],["..##..","..##..","#.##.#",".####.","..##..",".####.",".#..#."]];
  const FL=[["..#....","#.##..#",".####.#","#####.#",".####.."],["...#...","..###..",".#####.","#######",".#####."]];
  const FM=["..##..","..##..",".####.","#.##.#","..##..",".#..#.",".#..#."];
  const LX=i=>sx+sw*(.32+i*.26),STEPS=6,top=sy+sh*.12,land=sy+sh*.8;
  const pt=(lane,s)=>{const u=s/(STEPS-1);return{x:sx+sw*.2+(LX(lane)-(sx+sw*.2))*u,y:top+(land-top)*u*u*.7+(land-top)*u*.3-Math.sin(u*3.14)*sh*.12}};
  let J=[],lane=1,iv=.55,tm=0,miss=0,gap=0,flash=0,pose=0,msg=0;
  const lane2=x=>c.clamp(Math.floor((x-sx)/(sw/3)),0,2);
  c.down(p=>{if(!c.dead){lane=lane2(p.x);c.sfx('tick')}});
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);msg=Math.max(0,msg-dt);
    if(!c.dead){tm+=dt;if(tm>=iv){tm-=iv;pose^=1;
      J.forEach(j=>j.s++);
      J.filter(j=>j.s>=STEPS).forEach(j=>{if(j.lane===lane){c.setScore(c.sc+1);c.sfx('coin',1+Math.min(c.sc,15)*.03);iv=Math.max(.19,iv-.006)}else{miss++;msg=.6;flash=.35;c.sfx('hit');c.shake(5);if(miss>=3){c.sfx('lose');c.over('¡DEMASIADOS FALLOS!')}}});
      J=J.filter(j=>j.s<STEPS);gap--;
      if(gap<=0&&J.length<3&&!c.dead){const free=[0,1,2].filter(l=>!J.some(j=>j.lane===l&&j.s<2));if(free.length){J.push({lane:c.pick(free),s:0});gap=c.RI(2,3);c.sfx('tap',.7)}}}}
    // carcasa
    c.rect(0,0,c.W,c.H,'#cfc9b6');c.rect(0,0,c.W,c.H,'rgba(255,255,255,.08)');
    c.rect(sx-10,sy-30,sw+20,sh+60,'#b8b19b',16);c.rect(sx-10,sy-30,sw+20,6,'#d33f2a');c.rect(sx-10,sy-22,sw+20,3,'#e0a82e');
    c.rect(sx-4,sy-4,sw+8,sh+8,'#5a5a52',10);c.rect(sx,sy,sw,sh,LCD,6);
    // sombras de la pantalla
    g.save();g.beginPath();c.rr(sx,sy,sw,sh,6);g.clip();const sh2=g.createLinearGradient(0,sy,0,sy+sh);sh2.addColorStop(0,'rgba(0,0,0,.14)');sh2.addColorStop(.3,'rgba(0,0,0,0)');g.fillStyle=sh2;g.fillRect(sx,sy,sw,sh);
    // marcador 7 segmentos
    ST.seg7(g,'8888',sx+sw-14,sy+10,26,OFF,OFF,4);ST.seg7(g,c.sc,sx+sw-14,sy+10,26,ON,OFF,4);
    // fallos
    for(let i=0;i<3;i++){const x=sx+16+i*24,y=sy+18;g.strokeStyle=i<miss?ON:OFF;g.lineWidth=3;g.beginPath();g.moveTo(x-7,y-7);g.lineTo(x+7,y+7);g.moveTo(x+7,y-7);g.lineTo(x-7,y+7);g.stroke()}
    // edificio ardiendo
    c.rect(sx+8,top-6,sw*.2,land-top+46,OFF.replace('.11','.2'));
    for(let i=0;i<3;i++)for(let k=0;k<2;k++)c.rect(sx+16+k*sw*.08,top+8+i*52,sw*.05,34,Math.floor(t*3+i)%2?ON:OFF);
    ST.spr(g,FL[Math.floor(t*4)%2],sx+10,top-6-5*px,px,{'#':ON});ST.spr(g,FL[(Math.floor(t*4)+1)%2],sx+sw*.1,top-6-5*px+6,px,{'#':ON});
    // fantasmas (posiciones apagadas) y jugadores activos
    for(let l=0;l<3;l++)for(let s=0;s<STEPS;s++){const p=pt(l,s);ST.spr(g,PE[s&1],p.x-3*px,p.y-3.5*px,px*.82,{'#':OFF})}
    J.forEach(j=>{const p=pt(j.lane,j.s);ST.spr(g,PE[(j.s+pose)&1],p.x-3*px,p.y-3.5*px,px*.82,{'#':ON})});
    // ambulancia a la derecha y camilla
    c.rect(sx+sw-34,land+18,28,38,OFF.replace('.11','.2'));
    for(let l=0;l<3;l++){const x=LX(l);ST.spr(g,FM,x-34-3*px*.9,land-3,px*.9,{'#':l===lane?OFF.replace('.11','.18'):'rgba(31,42,24,.05)'});ST.spr(g,FM,x+34-3*px*.9,land-3,px*.9,{'#':l===lane?OFF.replace('.11','.18'):'rgba(31,42,24,.05)'})}
    {const x=LX(lane);ST.spr(g,FM,x-36-3*px*.9,land-3,px*.9,{'#':ON});ST.spr(g,FM,x+36-3*px*.9,land-3,px*.9,{'#':ON});g.fillStyle=ON;g.fillRect(x-38,land+8,76,5);g.fillRect(x-38,land+8,5,12);g.fillRect(x+33,land+8,5,12)}
    g.fillStyle=ON;g.fillRect(sx,land+34,sw,3);
    for(let l=0;l<3;l++)g.fillRect(LX(l)-1,land+30,2,5);
    if(msg>0)c.txt('MISS',sx+sw/2,sy+sh*.45,26,ON);
    g.restore();
    // botones de la consola
    for(let i=0;i<3;i++){c.circle(sx+sw*(.2+i*.3)+0,sy+sh+16,12,i===lane?'#a32a18':'#d33f2a');c.circle(sx+sw*(.2+i*.3)-3,sy+sh+12,4,'rgba(255,255,255,.3)')}
    c.txt('TIK & WATCH',sx+sw/2,sy-14,13,'#4a4a42');
    if(flash>0){g.globalAlpha=flash*.5;c.rect(sx,sy,sw,sh,ON);g.globalAlpha=1}
  });
}});

// ============ 55. MARCIANOS (CGA 4 colores) ============
def({id:'invaders',title:'MARCIANOS',emoji:'👾',tag:'cga',hint:'👉 ARRASTRA ↔ para mover el cañón. Dispara solo',style:'cga',skin:'flat',
colors:['#000000','#12002b','#55ffff'],font:"'Press Start 2P',monospace",
music:{bpm:118,root:41,scale:'minor',lead:'square',bassw:'square',bass:'pulse',drums:'half',density:.5,vol:.09,len:.5,oct:1,arp:true},
create(c){
  const g=c.g,CY='#55ffff',MG='#ff55ff',WH='#ffffff',px=3;
  const SPR=[
   [["....###....","..#######..",".#########.","##.##.##.##","###########","..#.....#..",".#..###..#.","#..#...#..#"],["....###....","..#######..",".#########.","##.##.##.##","###########",".#.#...#.#.","#..#####..#",".#.......#."]],
   [["#.#.....#.#","..#.....#..","..#######..",".##.###.##.","###########","#.#######.#","#.#.....#.#","..##...##.."],["..#.....#..","#.#.....#.#","#.#######.#","###.###.###","###########",".#########.","..#.....#..",".#.......#."]],
   [["...#####...",".#########.","###.###.###","###.###.###","###########","..##...##..",".##.###.##.","##.......##"],["...#####...",".#########.","###.###.###","###.###.###","###########",".###...###.","##..###..##",".#.......#."]]];
  const SH=["......#......","....#####....","..#########..","#############","#############"],COLS=6,ROWS=4,GX=46,GY=34;
  let ax,ay,dir=1,al,B=[],E=[],shipX=c.W/2,fire=0,fr=0,tm=0,wave=1,spd,stars=[],boom=[],flash=0,sdelay=0;
  for(let i=0;i<40;i++)stars.push({x:c.R(0,c.W),y:c.R(0,c.H),w:c.pick([1,2,2,3])});
  const wy=()=>c.T+54;
  function mk(){al=[];for(let r=0;r<ROWS;r++)for(let k=0;k<COLS;k++)al.push({r,k,a:true});ax=(c.W-COLS*GX)/2;ay=wy()+18;dir=1;spd=34+wave*7;B=[];E=[]}
  mk();
  const tgt=p=>{shipX=c.clamp(p.x,26,c.W-26)};c.down(tgt);c.move(tgt);
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){
      fire-=dt;if(fire<=0&&B.length<3){fire=.34;B.push({x:shipX,y:c.B-48});c.sfx('tick')}
      const live=al.filter(a=>a.a),left=live.length;if(!left){wave++;c.setScore(c.sc+10);c.sfx('win');mk();return}
      const sp=spd*(1+(ROWS*COLS-left)*.045);ax+=dir*sp*dt;
      const mn=Math.min.apply(null,live.map(a=>a.k)),mx=Math.max.apply(null,live.map(a=>a.k));
      if(ax+mx*GX+34>c.W-8&&dir>0||ax+mn*GX<8&&dir<0){dir*=-1;ay+=18;c.sfx('bump',.6)}
      tm+=dt*(1+(ROWS*COLS-left)*.06);fr=Math.floor(tm*2)%2;
      sdelay-=dt;if(sdelay<=0){const sh=c.pick(live);E.push({x:ax+sh.k*GX+17,y:ay+sh.r*GY+24,t:0});sdelay=Math.max(.35,1.1-wave*.1)*c.R(.6,1.2)}
      B.forEach(b=>b.y-=520*dt);B=B.filter(b=>b.y>c.T);E.forEach(e=>{e.y+=170*dt;e.t+=dt});
      for(const b of B)for(const a of live){const x=ax+a.k*GX,y=ay+a.r*GY;if(a.a&&!b.dead&&b.x>x&&b.x<x+34&&b.y>y&&b.y<y+26){a.a=false;b.dead=true;c.setScore(c.sc+[5,3,2,1][a.r]);c.sfx('hit');c.sfx('pop',1.4);boom.push({x:x+17,y:y+12,l:.35})}}
      B=B.filter(b=>!b.dead);E=E.filter(e=>e.y<c.H);
      for(const e of E)if(Math.abs(e.x-shipX)<17&&e.y>c.B-52&&e.y<c.B-26){boom.push({x:shipX,y:c.B-40,l:.8});c.sfx('lose');c.shake(10);flash=.3;c.over('¡INVASIÓN!')}
      for(const a of live)if(a.a&&ay+a.r*GY+26>c.B-56){c.sfx('lose');c.over('¡HAN ATERRIZADO!')}
    }
    boom.forEach(b=>b.l-=dt);boom=boom.filter(b=>b.l>0);
    c.rect(0,0,c.W,c.H,'#000');stars.forEach(s=>{if(Math.floor(t*2+s.x)%7)c.rect(s.x,s.y,s.w,s.w,s.w>2?CY:WH)});
    // aliens
    al.forEach(a=>{if(!a.a)return;const x=ax+a.k*GX,y=ay+a.r*GY,col=a.r===0?MG:a.r===1?CY:WH;ST.spr(g,SPR[a.r%3][fr],x,y,px,{'#':col})});
    // disparos
    B.forEach(b=>c.rect(b.x-1.5,b.y,3,12,WH));
    E.forEach(e=>{const z=Math.floor(e.t*10)%2;c.rect(e.x-(z?3:1),e.y,4,5,MG);c.rect(e.x-(z?1:3),e.y+5,4,5,MG);c.rect(e.x-(z?3:1),e.y+10,4,5,MG)});
    boom.forEach(b=>{g.fillStyle=Math.floor(b.l*20)%2?WH:MG;for(let i=0;i<8;i++){const a=i*.785,r=(1-b.l*2)*22;g.fillRect(b.x+Math.cos(a)*r-2,b.y+Math.sin(a)*r-2,5,5)}});
    // cañón y suelo
    if(!c.dead||Math.floor(t*10)%2)ST.spr(g,SH,shipX-6.5*px,c.B-48,px,{'#':CY});
    c.rect(0,c.B-14,c.W,3,MG);c.txt('OLEADA '+wave,c.W-16,c.B+6,12,CY,'right');
    ST.scan(g,c.W,c.H,.45);
    if(flash>0){g.globalAlpha=flash;c.rect(0,0,c.W,c.H,'#fff');g.globalAlpha=1}
  });
}});

// ============ 56. BALANCÍN (Memphis pop) ============
def({id:'swing',title:'BALANCÍN',emoji:'🪀',tag:'memphis',hint:'👆 TOCA para soltarte y volar hasta el siguiente gancho',style:'memphis',skin:'light',
colors:['#ffd6e8','#bde6ff','#ff5d8f'],font:"'Shrikhand',cursive",
music:{bpm:116,root:62,scale:'major',lead:'square',bassw:'triangle',bass:'walk',drums:'break',density:.6,vol:.1,len:.7,oct:1,swing:.2},
create(c){
  const g=c.g,GR=1500,K='#1b1b1f',PINK='#ff5d8f',YEL='#ffd23f',TEAL='#00c2a8',BLU='#3a86ff';
  const top=c.T+70,mid=c.T+c.PH*.34;
  let A=[],cur=0,ang=1.0,om=0,mode='sw',L=180,P={x:0,y:0,vx:0,vy:0},camX=0,pops=0,tt=0,blink=0,rel=0;
  const addA=()=>{const l=A[A.length-1];A.push({x:l.x+c.R(130,180),y:c.clamp(l.y+c.R(-50,70),top,top+c.PH*.32),r:c.RI(0,2)})};
  A.push({x:c.W*.32,y:mid-10,r:0});for(let i=0;i<8;i++)addA();
  function setP(){P.x=A[cur].x+Math.sin(ang)*L;P.y=A[cur].y+Math.cos(ang)*L}
  setP();
  c.dbg={get mode(){return mode},get ang(){return ang},get om(){return om},get cur(){return cur},get P(){return P}};
  c.down(()=>{if(c.dead||mode!=='sw')return;
    const v=om*L;P.vx=v*Math.cos(ang)*1.05;P.vy=-v*Math.sin(ang)*1.05;mode='fly';c.sfx('jump',1.1);rel=.2});
  c.loop((dt,t)=>{
    tt+=dt;blink-=dt;if(blink<0)blink=c.R(1.5,3.5);
    if(!c.dead){
      if(mode==='sw'){L+=(180-L)*Math.min(1,dt*8);om+=-(GR/L)*Math.sin(ang)*dt;om+=Math.sign(om||1)*Math.max(0,2.0-Math.abs(ang))*dt*2.6;ang+=om*dt;ang=c.clamp(ang,-1.55,1.55);setP();}
      else{P.vy+=GR*dt;P.x+=P.vx*dt;P.y+=P.vy*dt;
        const n=A[cur+1];if(n&&Math.hypot(P.x-n.x,P.y-n.y)<105){cur++;L=Math.max(60,Math.hypot(P.x-n.x,P.y-n.y));ang=Math.atan2(P.x-n.x,P.y-n.y);const vt=P.vx*Math.cos(ang)-P.vy*Math.sin(ang);om=c.clamp(vt/L,-4.2,4.2);if(Math.abs(om)<2.2)om=2.2*Math.sign(om||1);mode='sw';pops++;c.setScore(pops);c.sfx('coin',1+Math.min(pops,12)*.04);c.burst(n.x,n.y,PINK,10);while(A.length<cur+8)addA()}
        if(P.y>c.B+80){c.sfx('lose');c.shake(8);c.over('¡AL SUELO!')}}
      camX+=((P.x-c.W*.38)-camX)*Math.min(1,dt*5);
    }
    // fondo memphis
    c.rect(0,0,c.W,c.H,'#ffd6e8');
    const par=camX*.5;
    const pat=[[60,120,'tri',TEAL],[220,300,'sq',YEL],[110,520,'dot',BLU],[300,640,'zig',K],[40,420,'circ',PINK],[260,60,'zig',BLU],[330,470,'tri',YEL],[170,200,'dot',K],[90,680,'sq',TEAL]];
    for(let rep=-1;rep<4;rep++)pat.forEach(q=>{const x=((q[0]+rep*420-par)%1260+1260)%1260-200,y=q[1];if(x<-80||x>c.W+80)return;g.save();g.translate(x,y);g.rotate(q[0]*.02);g.fillStyle=q[3];g.strokeStyle=K;g.lineWidth=3;
      if(q[2]==='tri'){g.beginPath();g.moveTo(0,-22);g.lineTo(22,18);g.lineTo(-22,18);g.closePath();g.fill();g.stroke()}
      else if(q[2]==='sq'){g.fillRect(-18,-18,36,36);g.strokeRect(-18,-18,36,36)}
      else if(q[2]==='circ'){g.beginPath();g.arc(0,0,20,0,6.2832);g.fill();g.stroke()}
      else if(q[2]==='dot'){for(let i=0;i<3;i++)for(let j=0;j<3;j++){g.beginPath();g.arc(i*14-14,j*14-14,3,0,6.2832);g.fill()}}
      else{g.beginPath();for(let i=0;i<=40;i+=2)g.lineTo(i*2-40,Math.sin(i*.6)*8);g.lineWidth=5;g.strokeStyle=q[3];g.stroke()}
      g.restore()});
    ST.halftone(g,0,c.H*.7,c.W,c.H*.3,'rgba(58,134,255,.25)',8,.6,false);
    g.save();g.translate(-camX,0);
    // ganchos
    A.forEach((a,i)=>{if(a.x-camX<-60||a.x-camX>c.W+60)return;
      c.rect(a.x-3,a.y-300,6,300,K);c.circle(a.x,a.y,17,i===cur+1&&mode==='fly'?PINK:YEL);g.strokeStyle=K;g.lineWidth=4;g.beginPath();g.arc(a.x,a.y,17,0,6.2832);g.stroke();c.circle(a.x,a.y,5,K)});
    {const n=A[cur+1];if(n){g.strokeStyle=K;g.lineWidth=3;g.setLineDash([6,8]);g.lineDashOffset=-tt*30;g.globalAlpha=.55;g.beginPath();g.arc(n.x,n.y,105+Math.sin(tt*5)*3,0,6.2832);g.stroke();g.setLineDash([]);g.globalAlpha=1}}
    // cuerda
    if(mode==='sw'){const a=A[cur];g.strokeStyle=K;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(P.x,P.y);g.stroke()}
    // personaje
    const sq=mode==='fly'?1+Math.min(.12,Math.abs(P.vy)*.0002):1;g.save();g.translate(P.x,P.y);g.rotate(mode==='sw'?-ang*.6:Math.atan2(P.vy,Math.max(60,P.vx))*.35);g.scale(1/sq,sq);
    g.fillStyle=PINK;g.strokeStyle=K;g.lineWidth=4;g.beginPath();g.arc(0,0,22,0,6.2832);g.fill();g.stroke();
    g.fillStyle='#fff';[-8,8].forEach(x=>{g.beginPath();g.ellipse(x,-4,6,blink<.12?1:7,0,0,6.2832);g.fill();g.stroke()});g.fillStyle=K;[-8,8].forEach(x=>{g.beginPath();g.arc(x+1.5,-3,2.6,0,6.2832);g.fill()});
    g.beginPath();g.arc(0,6,9,.2,2.9);g.lineWidth=3.5;g.stroke();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(-12,-14,4,0,6.2832);g.fill();g.restore();
    g.restore();
  });
}});

// ============ 57. OLA GRANDE (estampa japonesa) ============
def({id:'wave',title:'OLA GRANDE',emoji:'🌊',tag:'ukiyo-e',hint:'👆 MANTÉN para hundirte en las bajadas y coger velocidad. SUELTA para volar',style:'ukiyo',skin:'light',
colors:['#efe2c0','#e4cf9c','#c8452b'],font:"'Rye',serif",
music:{bpm:76,root:57,scale:'hira',lead:'triangle',bassw:'sine',bass:'root',drums:'half',density:.35,vol:.14,len:2,oct:1,pad:true},
create(c){
  const g=c.g,IND='#1b3b6f',IND2='#2a5a9c',SKY='#8fb8d6',PAPER='#efe2c0',RED='#c8452b';
  let N=[{x:-200,y:-20}],X=0,Y=-20,vx=380,vy=0,held=false,stall=0,camY=0,dist=0,spray=[];
  const gen=to=>{while(N[N.length-1].x<to){const l=N[N.length-1],peak=N.length%2===0,k=Math.min(1,.25+N.length*.09);N.push({x:l.x+c.R(340,480),y:peak?-c.R(20,70)*k:c.R(30,70)*k})}};
  gen(c.W*3);
  const ty=x=>{let i=0;while(i<N.length-2&&N[i+1].x<x)i++;const a=N[i],b=N[i+1],u=c.clamp((x-a.x)/(b.x-a.x),0,1);return a.y+(b.y-a.y)*(1-Math.cos(Math.PI*u))/2};
  const sl=x=>(ty(x+2)-ty(x-2))/4;
  X=0;Y=ty(0);
  c.dbg={get slope(){return sl(X)},get vx(){return vx},get x(){return X},get air(){return Y<ty(X)-2}};
  c.down(()=>{held=true});c.up(()=>{held=false});
  const tile=ST.cache('seigaiha',44,22,(q,w,h)=>{q.strokeStyle='rgba(143,184,214,.55)';q.lineWidth=2;for(const [cx,cy] of [[0,h],[w/2,h/2],[w,h],[w/2,h*1.5]])for(let r=4;r<=18;r+=5){q.beginPath();q.arc(cx,cy,r,Math.PI,0);q.stroke()}});
  c.loop((dt,t)=>{
    if(!c.dead){
      vy+=(1500+(held?2600:0))*dt;X+=vx*dt;Y+=vy*dt;
      const h=ty(X);
      if(Y>=h){const s=sl(X),n=Math.sqrt(1+s*s);let vt=(vx+vy*s)/n;Y=h;vt=Math.max(vt,60);vx=vt/n;vy=vt*s/n;vt*=Math.exp(-.16*dt);vx=vt/n;vy=vt*s/n;
        if(held&&s>0)c.sfx('tick')}
      else vx*=Math.exp(-.02*dt);
      if(held&&Y>=h-1&&sl(X)>0){vx=Math.min(vx+380*dt,760)}
      gen(X+c.W*2.2);
      if(vx<150){stall+=dt;if(stall>(X<2500?2.4:1.4)){c.sfx('lose');c.over('¡SIN VIENTO!')}}else stall=Math.max(0,stall-dt);
      dist=X;const sc=Math.floor(X/120);if(sc!==c.sc)c.setScore(sc);
      if(Math.random()<dt*10&&Y>=h-1)spray.push({x:X,y:Y,vx:-vx*.2+c.R(-40,40),vy:c.R(-160,-60),l:.6});
    }
    spray.forEach(p=>{p.l-=dt;p.vy+=500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt});spray=spray.filter(p=>p.l>0);
    const cam=X-c.W*.3,wantY=Y-(c.T+c.PH*.52);camY+=(wantY-camY)*Math.min(1,dt*3.5);
    // papel y cielo en degradado de grabado
    c.rect(0,0,c.W,c.H,PAPER);const sk=g.createLinearGradient(0,0,0,c.H*.7);sk.addColorStop(0,'rgba(143,184,214,.0)');sk.addColorStop(1,'rgba(143,184,214,.55)');g.fillStyle=sk;g.fillRect(0,0,c.W,c.H);
    ST.grain(g,c.W,c.H,.14,'#6b5430');
    // sol rojo y monte Fuji
    c.circle(c.W*.72,c.T+90,46,RED);g.fillStyle=IND;g.beginPath();g.moveTo(-40,c.H*.58-camY*.1);g.lineTo(c.W*.34,c.H*.38-camY*.1);g.lineTo(c.W*.4,c.H*.385-camY*.1);g.lineTo(c.W*.8,c.H*.58-camY*.1);g.closePath();g.fill();
    g.fillStyle='#fff';g.beginPath();g.moveTo(c.W*.34,c.H*.38-camY*.1);g.lineTo(c.W*.4,c.H*.385-camY*.1);g.lineTo(c.W*.43,c.H*.42-camY*.1);g.lineTo(c.W*.38,c.H*.405-camY*.1);g.lineTo(c.W*.35,c.H*.425-camY*.1);g.lineTo(c.W*.3,c.H*.42-camY*.1);g.closePath();g.fill();
    // nubes en bandas
    g.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<3;i++){const x=((i*260-cam*.1)%(c.W+300)+c.W+300)%(c.W+300)-150;g.fillRect(x,c.T+170+i*34,150,9);g.fillRect(x+30,c.T+183+i*34,110,6)}
    // olas: dos capas con patrón seigaiha
    g.save();g.translate(0,0);
    // capa trasera más clara
    g.fillStyle=IND2;g.beginPath();g.moveTo(-10,c.H+60);for(let x=-10;x<=c.W+10;x+=8)g.lineTo(x,ty((cam+x)*.8+200)*.7+c.H*.58-camY*.3);g.lineTo(c.W+10,c.H+60);g.closePath();g.fill();
    // capa principal
    g.fillStyle=IND;g.beginPath();g.moveTo(-10,c.H+80);for(let x=-10;x<=c.W+10;x+=6)g.lineTo(x,ty(cam+x)-camY);g.lineTo(c.W+10,c.H+80);g.closePath();g.fill();
    g.save();g.clip();g.translate(-((cam*.9)%44+44)%44,-(camY*.9%22));g.fillStyle=g.createPattern(tile,'repeat');g.fillRect(0,0,c.W+88,c.H+88);g.restore();
    g.restore();
    // espuma en la cresta (garras blancas)
    g.fillStyle='#fff';for(let x=0;x<c.W;x+=13){const wx=cam+x,y=ty(wx)-camY,s=sl(wx),w=Math.sin(wx*.05+t*2)*2;g.beginPath();g.arc(x,y+2,6+w+(s<0?3:0),Math.PI,0);g.fill();if((Math.floor(wx/13))%3===0){g.beginPath();g.moveTo(x,y-3);g.lineTo(x+6,y-14-w*2);g.lineTo(x+10,y-2);g.closePath();g.fill()}}
    g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();for(let x=0;x<=c.W;x+=6){const y=ty(cam+x)-camY;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
    spray.forEach(p=>{g.globalAlpha=Math.min(1,p.l*2);c.circle(p.x-cam,p.y-camY,3,'#fff')});g.globalAlpha=1;
    // barquito
    {const s=sl(X),ang=Math.atan(vy/Math.max(80,vx))*.9;g.save();g.translate(c.W*.3,Y-camY-6);g.rotate(Y>=ty(X)-1?Math.atan(s):ang);
      g.fillStyle=RED;g.beginPath();g.moveTo(-28,-6);g.lineTo(30,-10);g.lineTo(20,8);g.lineTo(-18,8);g.closePath();g.fill();g.strokeStyle='#111';g.lineWidth=2.5;g.stroke();
      g.fillStyle='#fff';g.beginPath();g.moveTo(-2,-8);g.lineTo(-2,-44);g.lineTo(22,-12);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(-2,-8);g.lineTo(-2,-48);g.stroke();
      g.fillStyle='#111';g.fillRect(-4,-8,4,6);g.restore()}
    // marco de estampa
    g.strokeStyle='#111';g.lineWidth=3;g.strokeRect(10,c.T+20,c.W-20,c.PH-26);
    c.rect(c.W-44,c.T+30,26,80,RED,3);c.txt('波',c.W-31,c.T+52,22,'#fff');c.txt('乗',c.W-31,c.T+84,22,'#fff');
    c.rect(24,c.T+30,(c.W-130)*Math.min(1,vx/700),6,RED,3);c.txt('VELOCIDAD',24,c.T+50,11,IND,'left');
  });
}});
