// ============ 37. SERPIENTE (Game Boy) ============
def({id:'snake',title:'SERPIENTE',emoji:'🐍',tag:'game boy',hint:'👆 TOCA hacia donde quieras girar (o desliza)',style:'gameboy',skin:'flat',
colors:['#0f380f','#306230','#9bbc0f'],font:"'Press Start 2P',monospace",
music:{bpm:136,root:57,scale:'pent',lead:'square',bassw:'square',bass:'pulse',drums:'hats',density:.75,vol:.1,len:.7,oct:1},
create(c){
  const g=c.g,P=['#0f380f','#306230','#8bac0f','#9bbc0f'];
  const cols=12,cs=Math.floor((c.W-44)/cols),rows=Math.max(8,Math.floor((c.PH-30)/cs));
  const ox=Math.round((c.W-cols*cs)/2),oy=Math.round(c.T+(c.PH-rows*cs)/2);
  let sn,dir,nd,apple,tm,iv,flash=0;
  function free(){let x,y;do{x=c.RI(0,cols-1);y=c.RI(0,rows-1)}while(sn.some(s=>s.x===x&&s.y===y));return{x,y}}
  sn=[{x:5,y:rows>>1},{x:4,y:rows>>1},{x:3,y:rows>>1}];dir={x:1,y:0};nd=dir;apple=free();tm=0;iv=.2;
  const turn=(dx,dy)=>{if(dx===-dir.x&&dy===-dir.y)return;nd={x:dx,y:dy}};
  let sx=0,sy=0,sw=false;
  c.down(p=>{sx=p.x;sy=p.y;sw=false;
    const hx=ox+(sn[0].x+.5)*cs,hy=oy+(sn[0].y+.5)*cs,dx=p.x-hx,dy=p.y-hy;
    if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?1:-1)});
  c.move(p=>{if(sw)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>26){sw=true;if(Math.abs(dx)>Math.abs(dy))turn(dx>0?1:-1,0);else turn(0,dy>0?1:-1)}});
  c.loop((dt,t)=>{
    if(!c.dead){tm+=dt;if(tm>=iv){tm-=iv;dir=nd;
      const h={x:sn[0].x+dir.x,y:sn[0].y+dir.y};
      if(h.x<0||h.y<0||h.x>=cols||h.y>=rows||sn.some((s,i)=>i<sn.length-1&&s.x===h.x&&s.y===h.y)){c.sfx('lose');c.shake(8);flash=.3;c.over('¡CHOQUE!')}
      else{sn.unshift(h);if(h.x===apple.x&&h.y===apple.y){c.setScore(c.sc+1);c.sfx('coin',1+Math.min(c.sc,12)*.03);apple=free();iv=Math.max(.075,.2-c.sc*.0045)}else sn.pop();c.sfx('tick')}}}
    flash=Math.max(0,flash-dt);
    // carcasa de la consola y pantalla LCD
    c.rect(0,0,c.W,c.H,'#4a4d52');c.rect(0,0,c.W,c.H,'rgba(255,255,255,.05)');
    c.rect(ox-18,oy-18,cols*cs+36,rows*cs+36,'#2c2e33',14);
    c.rect(ox-10,oy-10,cols*cs+20,rows*cs+20,P[3],6);
    g.fillStyle=P[2];for(let i=1;i<cols;i++)g.fillRect(ox+i*cs-.5,oy,1,rows*cs);for(let j=1;j<rows;j++)g.fillRect(ox,oy+j*cs-.5,cols*cs,1);
    g.strokeStyle=P[1];g.lineWidth=2;g.strokeRect(ox-1,oy-1,cols*cs+2,rows*cs+2);
    c.txt('TIKBOY',c.W/2,oy-27>c.T?oy-27:c.T-2,10,'#b8bcc4','center');
    // serpiente y manzana: celdas con "píxel" de LCD
    const cell=(x,y,col,k)=>{c.rect(ox+x*cs+k,oy+y*cs+k,cs-2*k,cs-2*k,col)};
    sn.forEach((s,i)=>{cell(s.x,s.y,P[0],1);if(i===0){c.rect(ox+s.x*cs+cs*.55,oy+s.y*cs+cs*.25,cs*.2,cs*.2,P[3])}});
    const ap=Math.floor(t*4)%2;cell(apple.x,apple.y,P[1],ap?3:2);g.fillStyle=P[0];g.fillRect(ox+apple.x*cs+cs*.4,oy+apple.y*cs+cs*.1,cs*.2,cs*.25);
    if(flash>0){g.globalAlpha=flash*2;g.fillStyle=P[0];g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 38. CACTUS RUN (1 bit, Mac clásico) ============
def({id:'cactus',title:'CACTUS RUN',emoji:'🌵',tag:'1 bit',hint:'👆 TOCA para saltar (más tiempo = más alto)',style:'1bit',skin:'light flat',
colors:['#f1f1ea','#c9c9c0','#111111'],font:"'Silkscreen',monospace",
music:{bpm:150,root:60,scale:'minpent',lead:'square',bassw:'square',bass:'walk',drums:'break',density:.6,vol:.1,len:.6,oct:1},
create(c){
  const g=c.g,px=4,gy=Math.round(c.B-34);
  const CAT=["........#...#","........##.##","........#####","........#o###","........#####","#.......####.","##.#########.",".###########.","..##########."];
  const LA=["..#..#..#..#.","..#..#..#..#."],LB=["...##....##..","...##....##.."],LJ=["..##.....##..","............."];
  const CAC=["...##...","...##...",".#.##.#.",".#.##.#.",".#.##.#.",".######.","...##...","...##...","...##...","...##..."];
  const BA=["#...#.....","##.##.....",".#####..#.","..#####.##","...###...."],BB=["..........","..####..#.",".######.##","##.###....","#...#....."];
  const cw=13*px,ch=11*px;
  let y=0,vy=0,on=true,held=false,dist=0,sp=330,obs=[],gap=500,inv=false,flash=0,clouds=[],pebs=[];
  for(let i=0;i<4;i++)clouds.push({x:c.R(0,c.W),y:c.R(c.T+40,c.T+190),s:c.RI(2,3)});
  for(let i=0;i<30;i++)pebs.push({x:c.R(0,c.W),y:c.R(6,26),w:c.RI(2,7)});
  const jump=()=>{if(on&&!c.dead){vy=-780;on=false;c.sfx('jump',1.2)}};
  c.down(()=>{held=true;jump()});c.up(()=>{held=false});
  c.loop((dt,t)=>{
    const fg=inv?'#f1f1ea':'#111',bg=inv?'#111':'#f1f1ea';
    if(!c.dead){
      dist+=sp*dt;sp=Math.min(760,330+dist*.03);
      vy+=(held&&vy<0?1100:2600)*dt;y+=vy*dt;if(y>=0){y=0;vy=0;on=true}
      const sc=Math.floor(dist/14);if(sc!==c.sc){c.setScore(sc);if(sc>0&&sc%100===0){inv=!inv;flash=.18;c.sfx('win')}}
      gap-=sp*dt;if(gap<=0){const b=c.sc>120&&Math.random()<.3,n=c.RI(1,3);obs.push(b?{t:'b',x:c.W+40,h:c.pick([0,1])}:{t:'c',x:c.W+40,n});gap=c.R(380,640)+sp*.35}
      obs.forEach(o=>o.x-=sp*dt);obs=obs.filter(o=>o.x>-120);
      const bx=64,by=gy+y-ch;
      for(const o of obs){
        let ox,oy,ow,oh;
        if(o.t==='c'){ow=8*px*o.n-4;oh=10*px;ox=o.x;oy=gy-oh}
        else{ow=10*px;oh=5*px;ox=o.x;oy=o.h?gy-ch-26:gy-oh-4}
        if(bx+8<ox+ow&&bx+cw-8>ox&&by+8<oy+oh&&by+ch-4>oy){c.sfx('lose');c.shake(8);c.over('¡AUCH!');break}
      }
    }
    clouds.forEach(k=>{k.x-=sp*.12*dt;if(k.x<-80)k.x=c.W+40});
    // cielo con tramado en bandas
    c.rect(0,0,c.W,c.H,bg);
    for(let i=0;i<6;i++){ST.dither(g,0,gy-90-i*70<0?0:gy-90-i*70,c.W,70,.34-i*.06,3,fg)}
    c.rect(0,gy-90,c.W,2,bg);
    clouds.forEach(k=>{c.rect(k.x,k.y,k.s*22,k.s*7,bg,6);g.strokeStyle=fg;g.lineWidth=2;g.beginPath();c.rr(k.x,k.y,k.s*22,k.s*7,6);g.stroke()});
    // suelo
    c.rect(0,gy,c.W,c.H-gy,bg);c.rect(0,gy,c.W,3,fg);
    pebs.forEach(p=>{p.x-=sp*dt;if(p.x<-10){p.x=c.W+10;p.y=c.R(6,26)}c.rect(p.x,gy+p.y,p.w,2,fg)});
    ST.dither(g,0,gy+30,c.W,c.H-gy-30,.5,3,fg);
    // personaje y obstáculos
    const pal={'#':fg,o:bg},fr=!on?LJ:(Math.floor(t*9)%2?LA:LB);
    const body=CAT.concat(fr);
    // sombra
    ST.spr(g,body,64,gy+y-ch,px,pal);
    obs.forEach(o=>{if(o.t==='c'){for(let i=0;i<o.n;i++)ST.spr(g,CAC,o.x+i*8*px,gy-10*px,px,{'#':fg})}
      else ST.spr(g,Math.floor(t*6)%2?BA:BB,o.x,o.h?gy-ch-26:gy-5*px-4,px,{'#':fg})});
    // marco tipo ventana de Mac
    c.rect(0,c.T-2,c.W,20,bg);c.rect(0,c.T+16,c.W,2,fg);for(let i=0;i<5;i++)c.rect(34,c.T+1+i*3,c.W-68,1,fg);
    c.rect(c.W/2-52,c.T-2,104,20,bg);c.txt('Gato.app',c.W/2,c.T+9,12,fg);
    if(flash>0){g.globalAlpha=flash*4;c.rect(0,0,c.W,c.H,'#888');g.globalAlpha=1}
  });
}});

// ============ 39. DETECTOR (1 bit, buscaminas) ============
def({id:'mines',title:'DETECTOR',emoji:'💣',tag:'1 bit',hint:'👆 TOCA las casillas seguras. Los números cuentan minas vecinas',style:'1bit',skin:'light flat',
colors:['#e8e8e0','#bdbdb4','#111111'],font:"'VT323',monospace",
music:{bpm:96,root:52,scale:'minor',lead:'triangle',bassw:'square',bass:'root',drums:'tick',density:.35,vol:.1,len:1.5,oct:1},
create(c){
  const g=c.g,COLS=6,cs=Math.floor((c.W-36)/COLS),ROWS=Math.max(6,Math.min(9,Math.floor((c.PH-104)/cs)));
  const ox=Math.round((c.W-COLS*cs)/2),oy=Math.round(c.T+82+Math.max(0,(c.PH-(ROWS*cs+96))/2));
  const BOMB=["....#....",".#..#..#.","..#####..","..#####..","#########","..#####..","..#####..",".#..#..#.","....#...."];
  let G,placed=false,nm,left,sc2=0,boom=null,fl=0;
  const mk=()=>{G=[];for(let i=0;i<COLS*ROWS;i++)G.push({m:false,r:false,n:0,s:0});placed=false;nm=Math.min(5+sc2,Math.floor(COLS*ROWS*.28));left=COLS*ROWS-nm};
  mk();
  const nb=i=>{const x=i%COLS,y=Math.floor(i/COLS),o=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<COLS&&b<ROWS)o.push(b*COLS+a)}return o};
  const place=safe=>{const ban=new Set([safe].concat(nb(safe)));let k=0;while(k<nm){const i=c.RI(0,COLS*ROWS-1);if(!ban.has(i)&&!G[i].m){G[i].m=true;k++}}
    G.forEach((q,i)=>{q.n=nb(i).filter(j=>G[j].m).length});placed=true};
  function reveal(i){const st=[i];while(st.length){const k=st.pop(),q=G[k];if(q.r||q.m)continue;q.r=true;q.s=.2;left--;if(q.n===0)nb(k).forEach(j=>st.push(j))}}
  c.down(p=>{
    if(c.dead)return;const ci=Math.floor((p.x-ox)/cs),ri=Math.floor((p.y-oy)/cs);if(ci<0||ci>=COLS||ri<0||ri>=ROWS)return;
    const i=ri*COLS+ci,q=G[i];if(q.r)return;if(!placed)place(i);
    if(q.m){boom=i;G.forEach(z=>{if(z.m)z.r=true});c.sfx('hit');c.shake(10);fl=.25;c.over('¡BOOM!');return}
    reveal(i);c.sfx('tap',1.2);
    if(left<=0){sc2++;c.setScore(sc2);c.sfx('win');c.say('¡Despejado! +1 mina',1400);c.after(700,()=>{if(!c.dead)mk()})}
  });
  c.loop((dt,t)=>{
    fl=Math.max(0,fl-dt);
    c.rect(0,0,c.W,c.H,'#e8e8e0');ST.dither(g,0,0,c.W,c.H,.22,3,'#111');
    // ventana
    const wx=ox-12,wy=oy-48,ww=COLS*cs+24,wh=ROWS*cs+60;
    c.rect(wx+5,wy+5,ww,wh,'#111');c.rect(wx,wy,ww,wh,'#f4f4ee');g.strokeStyle='#111';g.lineWidth=3;g.strokeRect(wx,wy,ww,wh);
    for(let i=0;i<5;i++)c.rect(wx+40,wy+6+i*3,ww-80,1,'#111');c.rect(wx+ww/2-48,wy+2,96,18,'#f4f4ee');c.txt('Minas.app',wx+ww/2,wy+11,16,'#111');
    c.rect(wx,wy+22,ww,2,'#111');
    c.txt('MINAS: '+nm,wx+14,wy+36,20,'#111','left');c.txt(boom==null?'🙂':'😵',wx+ww-22,wy+36,18,'#111','center');
    for(let i=0;i<G.length;i++){
      const q=G[i],x=ox+(i%COLS)*cs,y=oy+Math.floor(i/COLS)*cs;q.s=Math.max(0,q.s-dt);
      if(q.r){
        c.rect(x,y,cs,cs,'#f4f4ee');ST.dither(g,x+1,y+1,cs-2,cs-2,q.m?0:.18,3,'#111');g.strokeStyle='#111';g.lineWidth=1;g.strokeRect(x+.5,y+.5,cs-1,cs-1);
        if(q.m){if(i===boom)c.rect(x+2,y+2,cs-4,cs-4,'#111');ST.spr(g,BOMB,x+(cs-27)/2,y+(cs-27)/2,3,{'#':i===boom?'#f4f4ee':'#111'})}
        else if(q.n)c.txt(String(q.n),x+cs/2,y+cs/2+2,cs*.72,'#111');
      }else{
        c.rect(x,y,cs,cs,'#f4f4ee');g.fillStyle='#111';g.fillRect(x,y,cs,2);g.fillRect(x,y,2,cs);g.fillRect(x,y+cs-2,cs,2);g.fillRect(x+cs-2,y,2,cs);
        g.fillStyle='#8e8e86';g.fillRect(x+cs-5,y+3,3,cs-6);g.fillRect(x+3,y+cs-5,cs-6,3);
      }
    }
    if(fl>0){g.globalAlpha=fl*3;c.rect(0,0,c.W,c.H,'#111');g.globalAlpha=1}
  });
}});

// ============ 40. MAZMORRA ASCII (terminal) ============
def({id:'rogue',title:'MAZMORRA ASCII',emoji:'⌨️',tag:'terminal',hint:'👆 TOCA hacia donde quieras andar. Coge $ y llega a >',style:'terminal',skin:'flat',
colors:['#021a08','#06300f','#33ff66'],font:"'VT323',monospace",
music:{bpm:86,root:45,scale:'phrygian',lead:'sawtooth',bassw:'sine',bass:'root',drums:'tick',density:.28,vol:.11,len:2,oct:1,pad:true},
create(c){
  const g=c.g,COLS=9,cs=Math.floor((c.W-20)/COLS),ROWS=Math.max(9,Math.floor((c.PH-80)/cs));
  const ox=Math.round((c.W-COLS*cs)/2),oy=Math.round(c.T+34);
  let W,pl,coins,mons,exit,lv=1,got=0,msg='',mi=0,ml='',hp;
  const wall=(x,y)=>x<0||y<0||x>=COLS||y>=ROWS||W[y*COLS+x];
  function say(s){msg=s;mi=0}
  function reach(a){const seen=new Set([a.y*COLS+a.x]),q=[a];while(q.length){const p=q.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{const x=p.x+d[0],y=p.y+d[1];if(!wall(x,y)&&!seen.has(y*COLS+x)){seen.add(y*COLS+x);q.push({x,y})}})}return seen}
  function level(){
    for(let tries=0;tries<80;tries++){
      W=new Array(COLS*ROWS).fill(0);for(let i=0;i<c.RI(7,12)+lv;i++){const x=c.RI(0,COLS-1),y=c.RI(0,ROWS-1);W[y*COLS+x]=1;if(Math.random()<.5){const d=c.pick([[1,0],[0,1]]);const a=x+d[0],b=y+d[1];if(a<COLS&&b<ROWS)W[b*COLS+a]=1}}
      pl={x:c.RI(0,COLS-1),y:ROWS-1};W[pl.y*COLS+pl.x]=0;
      const R=reach(pl),cells=[...R].filter(i=>Math.abs(i%COLS-pl.x)+Math.abs(Math.floor(i/COLS)-pl.y)>3);
      if(cells.length<10)continue;ST.shuffle(cells);
      const at=i=>({x:i%COLS,y:Math.floor(i/COLS)});
      exit=at(cells.pop());coins=[];for(let i=0;i<3;i++)coins.push(at(cells.pop()));
      mons=[];const mn=Math.min(6,1+Math.floor(lv/2));for(let i=0;i<mn;i++){const p=at(cells.pop());if(Math.abs(p.x-pl.x)+Math.abs(p.y-pl.y)>4)mons.push(p)}
      if(!mons.length)mons.push(at(cells.pop()));
      got=0;say('Nivel '+lv+'. Hay '+mons.length+' goblin'+(mons.length>1?'s':'')+'.');return}
  }
  level();
  function step(dx,dy){
    const nx=pl.x+dx,ny=pl.y+dy;if(wall(nx,ny)){c.sfx('bump',.8);return}
    pl.x=nx;pl.y=ny;c.sfx('tick');
    const ci=coins.findIndex(k=>k.x===nx&&k.y===ny);if(ci>=0){coins.splice(ci,1);got++;c.setScore(c.sc+1);c.sfx('coin');say('Recoges oro. ($)');if(!coins.length)say('Se abre la salida >')}
    if(!coins.length&&nx===exit.x&&ny===exit.y){lv++;c.setScore(c.sc+3);c.sfx('win');level();return}
    if(mons.some(m=>m.x===nx&&m.y===ny)){die();return}
    mons.forEach(m=>{
      if(Math.random()<.3)return;
      const dx2=pl.x-m.x,dy2=pl.y-m.y,opts=Math.abs(dx2)>Math.abs(dy2)?[[Math.sign(dx2),0],[0,Math.sign(dy2)]]:[[0,Math.sign(dy2)],[Math.sign(dx2),0]];
      for(const o of opts){if(!o[0]&&!o[1])continue;const x=m.x+o[0],y=m.y+o[1];if(!wall(x,y)&&!mons.some(z=>z!==m&&z.x===x&&z.y===y)){m.x=x;m.y=y;break}}
    });
    if(mons.some(m=>m.x===pl.x&&m.y===pl.y))die();
  }
  function die(){c.sfx('lose');c.shake(8);say('Un goblin te ha devorado...');c.over('HAS MUERTO')}
  c.down(p=>{
    if(c.dead)return;const hx=ox+(pl.x+.5)*cs,hy=oy+(pl.y+.5)*cs,dx=p.x-hx,dy=p.y-hy;
    if(Math.abs(dx)>Math.abs(dy))step(dx>0?1:-1,0);else step(0,dy>0?1:-1);
  });
  c.loop((dt,t)=>{
    mi=Math.min(msg.length,mi+dt*38);
    c.rect(0,0,c.W,c.H,'#021a08');
    g.font=c.f(Math.round(cs*.82));g.textAlign='center';g.textBaseline='middle';
    g.shadowColor='#33ff66';g.shadowBlur=8;
    c.txt('NIVEL '+lv+'   ORO '+got+'/'+(got+coins.length)+'   PTS '+c.sc,c.W/2,oy-18,22,'#33ff66');
    for(let i=0;i<W.length;i++){const x=ox+(i%COLS+.5)*cs,y=oy+(Math.floor(i/COLS)+.5)*cs;
      if(W[i])c.txt('#',x,y,cs*.9,'#1f9a40');else c.txt('.',x,y-cs*.12,cs*.6,'rgba(51,255,102,.28)')}
    const open=!coins.length;c.txt('>',ox+(exit.x+.5)*cs,oy+(exit.y+.5)*cs,cs*.95,open?(Math.floor(t*4)%2?'#fff':'#33ff66'):'rgba(51,255,102,.25)');
    coins.forEach(k=>c.txt('$',ox+(k.x+.5)*cs,oy+(k.y+.5)*cs,cs*.9,'#ffd24a'));
    mons.forEach(m=>c.txt('g',ox+(m.x+.5)*cs,oy+(m.y+.5)*cs,cs,'#ff5a4a'));
    c.txt('@',ox+(pl.x+.5)*cs,oy+(pl.y+.5)*cs,cs*1.05,c.dead?'#ff5a4a':'#e8ffee');
    g.shadowBlur=0;
    const line='> '+msg.slice(0,Math.floor(mi))+(Math.floor(t*2)%2?'█':' ');
    c.txt(line,14,oy+ROWS*cs+20,22,'#33ff66','left');
    ST.scan(g,c.W,c.H,1);
  });
}});
