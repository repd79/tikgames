// ============ 41. TIJERAS (papel recortado) ============
def({id:'rps',title:'PAPEL Y TIJERA',emoji:'✂️',tag:'papel recortado',hint:'👆 Toca lo que GANA a la mano. ¡Antes de que se acabe el tiempo!',style:'paper',skin:'light',
colors:['#f6efe3','#e9dcc3','#ef6f6c'],font:"'Fredoka',sans-serif",
music:{bpm:104,root:62,scale:'major',lead:'triangle',bassw:'sine',bass:'walk',drums:'hats',density:.55,vol:.12,len:1.1,oct:1},
create(c){
  const g=c.g,INK='#3b3a4a';
  let o,flip,tl,tmax,lives=3,fb=0,fbOk=true,wait=0,pop=0,conf=[],pick=-1;
  const btnH=116,by=c.B-btnH-6,bw=(c.W-48)/3,bx=i=>16+i*(bw+8);
  const ans=()=>flip?(o+2)%3:(o+1)%3;
  function next(){o=c.RI(0,2);flip=c.sc>=4&&Math.random()<.35;tmax=Math.max(.9,2.8-c.sc*.06);tl=tmax;pop=.25;pick=-1}
  next();
  function shape(k,x,y,s,rot){
    g.save();g.translate(x,y);g.rotate(rot||0);const h=s*.5;ST.paper(g,true,Math.max(3,s*.05));
    if(k===0){const P=[[-.9,.15],[-.6,-.6],[.1,-.9],[.8,-.5],[.95,.25],[.5,.8],[-.35,.85]];
      g.fillStyle='#98a0aa';g.beginPath();P.forEach((p,i)=>g[i?'lineTo':'moveTo'](p[0]*h,p[1]*h));g.closePath();g.fill();ST.paper(g,false);
      g.fillStyle='#b7bec7';g.beginPath();[[-.6,-.6],[.1,-.9],[.25,-.15],[-.45,-.05]].forEach((p,i)=>g[i?'lineTo':'moveTo'](p[0]*h,p[1]*h));g.fill();
      g.fillStyle='#7b838d';g.beginPath();[[.25,-.15],[.8,-.5],[.95,.25],[.5,.8],[.1,.3]].forEach((p,i)=>g[i?'lineTo':'moveTo'](p[0]*h,p[1]*h));g.fill()}
    else if(k===1){g.fillStyle='#fffdf7';g.fillRect(-.7*h,-.9*h,1.4*h,1.8*h);ST.paper(g,false);
      g.fillStyle='#e4ddc9';g.beginPath();g.moveTo(.2*h,-.9*h);g.lineTo(.7*h,-.9*h);g.lineTo(.7*h,-.4*h);g.closePath();g.fill();
      g.strokeStyle='#bcd0ea';g.lineWidth=Math.max(1.5,s*.018);for(let i=0;i<6;i++){g.beginPath();g.moveTo(-.5*h,(-.3+i*.22)*h);g.lineTo(.5*h,(-.3+i*.22)*h);g.stroke()}
      g.strokeStyle='#f3a6a6';g.beginPath();g.moveTo(-.38*h,-.9*h);g.lineTo(-.38*h,.9*h);g.stroke()}
    else{[1,-1].forEach(d=>{g.save();g.rotate(d*.42);g.fillStyle='#dfe3e8';g.beginPath();g.moveTo(-.12*h,.2*h);g.lineTo(-.1*h,-.95*h);g.lineTo(.12*h,-.2*h);g.lineTo(.12*h,.2*h);g.closePath();g.fill();ST.paper(g,false);
        g.strokeStyle='#ef6f6c';g.lineWidth=Math.max(3,s*.07);g.beginPath();g.arc(0,.62*h,.26*h,0,6.2832);g.stroke();g.restore();ST.paper(g,true,Math.max(3,s*.05))});
      g.fillStyle='#8a8f98';g.beginPath();g.arc(0,.05*h,.09*h,0,6.2832);g.fill()}
    ST.paper(g,false);g.restore();
  }
  c.down(p=>{
    if(c.dead||wait>0)return;
    for(let i=0;i<3;i++)if(ST.ptIn(p,bx(i),by,bw,btnH)){
      pick=i;fbOk=i===ans();fb=.5;wait=.5;
      if(fbOk){c.setScore(c.sc+1);c.sfx('coin',1+Math.min(c.sc,15)*.03);for(let k=0;k<16;k++)conf.push({x:p.x,y:p.y,vx:c.R(-220,220),vy:c.R(-380,-80),r:c.R(0,6),vr:c.R(-8,8),col:c.pick(['#ef6f6c','#f2b84b','#7bc8a4','#6ea8fe']),l:1})}
      else{lives--;c.sfx('hit');c.shake(7);if(lives<=0)c.over('¡SIN VIDAS!')}
      return}
  });
  c.loop((dt,t)=>{
    pop=Math.max(0,pop-dt);fb=Math.max(0,fb-dt);
    if(!c.dead){if(wait>0){wait-=dt;if(wait<=0)next()}else{tl-=dt;if(tl<=0){lives--;fbOk=false;fb=.5;wait=.5;pick=-1;c.sfx('hit');c.shake(7);if(lives<=0)c.over('¡SE ACABÓ EL TIEMPO!')}}}
    // fondo de capas de papel
    c.rect(0,0,c.W,c.H,'#f6efe3');
    const wave=(y0,amp,col,ph)=>{ST.paper(g,true,4);g.fillStyle=col;g.beginPath();g.moveTo(0,c.H);for(let x=0;x<=c.W+10;x+=10)g.lineTo(x,y0+Math.sin(x*.018+ph)*amp);g.lineTo(c.W,c.H);g.closePath();g.fill();ST.paper(g,false)};
    wave(c.H*.62,16,'#f3d9c4',0);wave(c.H*.72,14,'#e9c3b4',2);wave(c.H*.82,12,'#d99f94',4);
    ST.grain(g,c.W,c.H,.1);
    // marcador de tiempo: tira de papel
    const tw=c.W-110;ST.paper(g,true,3);c.rect(84,c.T+10,tw,14,'#fffdf7',7);ST.paper(g,false);c.rect(84,c.T+10,tw*Math.max(0,tl/tmax),14,tl/tmax>.3?'#7bc8a4':'#ef6f6c',7);
    for(let i=0;i<3;i++)c.txt('♥',c.W-26-i*24,c.T+40,22,i<lives?'#ef6f6c':'rgba(0,0,0,.18)');
    // consigna
    c.txt(flip?'¡PIERDE A ESTO!':'GANA A ESTO',c.W/2,c.T+64,flip?30:26,flip?'#d64550':INK);
    // carta con la mano rival
    const cy=(c.T+84+by)/2+6,cs=Math.min(c.W-70,by-c.T-120);
    g.save();g.translate(c.W/2,cy);g.rotate(-.03+Math.sin(t*1.5)*.012);ST.paper(g,true,7);c.rect(-cs/2,-cs/2,cs,cs,'#fffaf0',18);ST.paper(g,false);
    g.strokeStyle='#e8d9bf';g.lineWidth=3;g.setLineDash([8,7]);g.beginPath();c.rr(-cs/2+10,-cs/2+10,cs-20,cs-20,12);g.stroke();g.setLineDash([]);g.restore();
    const sc=1+Math.sin(Math.min(1,pop/.25)*3.1416)*.15;shape(o,c.W/2,cy,cs*.62*(pop>0?1.1-pop*.4:1)*sc,Math.sin(t*2)*.05);
    // botones
    for(let i=0;i<3;i++){
      const x=bx(i),pr=pick===i&&fb>0,dy=pr?4:0;
      ST.paper(g,true,pr?2:6);c.rect(x,by+dy,bw,btnH,pr?(fbOk?'#d4f0df':'#f8d3d0'):'#fffdf7',16);ST.paper(g,false);
      shape(i,x+bw/2,by+btnH/2+dy,bw*.62,0);
    }
    if(fb>0&&wait>0){g.globalAlpha=Math.min(1,fb*3);c.txt(fbOk?'✔':'✘',c.W/2,cy,cs*.9,fbOk?'rgba(76,175,120,.85)':'rgba(214,69,80,.85)');g.globalAlpha=1}
    for(let i=conf.length-1;i>=0;i--){const q=conf[i];q.l-=dt;if(q.l<=0){conf.splice(i,1);continue}q.vy+=700*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=q.vr*dt;g.save();g.translate(q.x,q.y);g.rotate(q.r);g.globalAlpha=Math.min(1,q.l*2);g.fillStyle=q.col;g.fillRect(-5,-3,10,6);g.restore()}
    g.globalAlpha=1;
  });
}});

// ============ 42. GLOBO (papel, capas al atardecer) ============
def({id:'balloon',title:'GLOBO',emoji:'🎈',tag:'papel',hint:'👉 ARRASTRA ↔ para esquivar pájaros y alfileres. Coge estrellas',style:'paper',skin:'light',
colors:['#ffd1a1','#f08a8a','#c93f5a'],font:"'Baloo 2',sans-serif",
music:{bpm:92,root:60,scale:'lydian',lead:'sine',bassw:'sine',bass:'root',drums:'none',density:.4,vol:.14,len:2.4,oct:1,pad:true},
create(c){
  const g=c.g;
  let bx=c.W/2,tx=c.W/2,by=c.B-120,dist=0,sp=120,obs=[],sp2=0,clouds=[],gold=0,flash=0,ang=0;
  for(let i=0;i<7;i++)clouds.push({x:c.R(0,c.W),y:c.R(0,c.H),s:c.R(.7,1.6),z:c.R(.3,1)});
  c.down(p=>{tx=p.x});c.move(p=>{tx=p.x});
  const mix=(a,b,t)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=h(a),B=h(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
  c.loop((dt,t)=>{
    if(!c.dead){
      bx+=(tx-bx)*Math.min(1,dt*7);ang=(tx-bx)*.004;dist+=sp*dt;sp=Math.min(310,120+dist*.012);
      const sc=Math.floor(dist/120)+gold*3;if(sc!==c.sc)c.setScore(sc);
      sp2-=dt;if(sp2<=0){sp2=c.R(.45,1)*(260/sp);const r=Math.random();
        if(r<.38)obs.push({k:'bird',x:Math.random()<.5?-40:c.W+40,y:-40,vx:0,vy:c.R(10,50),dir:0});
        else if(r<.7)obs.push({k:'pin',x:c.R(30,c.W-30),y:-50,vx:0,vy:c.R(120,220)});
        else obs.push({k:'star',x:c.R(40,c.W-40),y:-40,vx:0,vy:0});
        const o=obs[obs.length-1];if(o.k==='bird'){o.dir=o.x<0?1:-1;o.vx=o.dir*c.R(90,170)}}
      for(const o of obs){o.y+=(sp+o.vy)*dt;o.x+=o.vx*dt;
        const d=Math.hypot(o.x-bx,o.y-by);
        if(o.k==='star'&&d<40){o.dead=true;gold++;c.sfx('coin');c.burst(o.x,o.y,'#f7c948',12);c.float('+3',o.x,o.y,'#b8860b')}
        else if(o.k!=='star'&&d<(o.k==='pin'?30:34)){c.sfx('pop',1);c.sfx('lose');c.shake(9);flash=.3;for(let i=0;i<5;i++)c.burst(bx,by,'#e84a5f',10,260);c.over('¡PLOP!');}}
      obs=obs.filter(o=>!o.dead&&o.y<c.H+60);
    }
    flash=Math.max(0,flash-dt);
    const al=Math.min(1,dist/14000);
    const sky=g.createLinearGradient(0,0,0,c.H);sky.addColorStop(0,mix('#ffd1a1','#2b2250',al));sky.addColorStop(1,mix('#f08a8a','#6a4c93',al));g.fillStyle=sky;g.fillRect(0,0,c.W,c.H);
    if(al>.45){g.globalAlpha=(al-.45)*1.6;for(let i=0;i<26;i++){const x=(i*97%c.W),y=((i*61)+dist*.02*(1+i%3))%c.H;c.rect(x,y,3,3,'#fff3b0')}g.globalAlpha=1}
    // nubes de papel en capas con paralaje
    clouds.forEach((k,i)=>{k.y+=sp*k.z*.55*dt;if(k.y>c.H+60){k.y=-60;k.x=c.R(0,c.W)}
      ST.paper(g,true,4+k.z*5);g.fillStyle=mix('#fff3ea','#8f7fb8',al*.8+(1-k.z)*.1);
      g.beginPath();g.arc(k.x,k.y,26*k.s,0,6.2832);g.arc(k.x+28*k.s,k.y+6*k.s,22*k.s,0,6.2832);g.arc(k.x-28*k.s,k.y+8*k.s,20*k.s,0,6.2832);g.fill();ST.paper(g,false)});
    ST.grain(g,c.W,c.H,.1);
    for(const o of obs){
      if(o.k==='star'){g.save();g.translate(o.x,o.y);g.rotate(t*1.5);ST.paper(g,true,4);ST.burst(g,0,0,10,22,5,'#f7c948','#d9a21c',2);ST.paper(g,false);g.restore()}
      else if(o.k==='pin'){ST.paper(g,true,4);c.rect(o.x-1.5,o.y-8,3,34,'#c9ced6');c.circle(o.x,o.y-12,9,'#d64550');ST.paper(g,false);c.circle(o.x-3,o.y-15,3,'rgba(255,255,255,.6)')}
      else{g.save();g.translate(o.x,o.y);g.scale(o.dir,1);ST.paper(g,true,5);g.fillStyle='#3d3b52';g.beginPath();g.moveTo(26,0);g.lineTo(-20,-8);g.lineTo(-30,0);g.lineTo(-20,8);g.closePath();g.fill();
        const w=Math.sin(t*14+o.x)*16;g.fillStyle='#5d5a7a';g.beginPath();g.moveTo(6,0);g.lineTo(-12,-22+w);g.lineTo(-20,0);g.closePath();g.fill();ST.paper(g,false);g.fillStyle='#fff';g.fillRect(16,-4,3,3);g.restore()}
    }
    // globo
    g.save();g.translate(bx,by);g.rotate(ang+Math.sin(t*2)*.04);
    g.strokeStyle='#6b4a3a';g.lineWidth=1.5;g.beginPath();g.moveTo(-10,30);g.lineTo(-6,56);g.moveTo(10,30);g.lineTo(6,56);g.stroke();
    ST.paper(g,true,6);c.rect(-9,56,18,13,'#c58b52',3);
    g.fillStyle='#e84a5f';g.beginPath();g.ellipse(0,0,31,38,0,0,6.2832);g.fill();ST.paper(g,false);
    g.fillStyle='#f4a3ae';g.beginPath();g.ellipse(-13,-4,8,28,0,0,6.2832);g.fill();g.fillStyle='#fff3d6';g.beginPath();g.ellipse(13,-4,8,28,-.0,0,6.2832);g.fill();
    g.fillStyle='#b92f45';g.beginPath();g.moveTo(-7,36);g.lineTo(7,36);g.lineTo(0,43);g.closePath();g.fill();
    g.restore();
    if(flash>0){g.globalAlpha=flash*2;c.rect(0,0,c.W,c.H,'#fff');g.globalAlpha=1}
  });
}});

// ============ 43. CIRCUITO (plano técnico) ============
def({id:'circuit',title:'CIRCUITO',emoji:'🔌',tag:'plano técnico',hint:'👆 TOCA las piezas para girarlas y conectar ENTRADA con SALIDA',style:'blueprint',skin:'dark',
colors:['#0b3d91','#082a66','#9fe8ff'],font:"'Space Mono',monospace",
music:{bpm:112,root:50,scale:'dorian',lead:'square',bassw:'triangle',bass:'walk',drums:'tick',density:.5,vol:.1,len:.8,oct:1,arp:true},
create(c){
  const g=c.g,D=[[0,-1],[1,0],[0,1],[-1,0]];
  let COLS,ROWS,ts,x0,y0,T,tl=40,lvl=0,solved=false,sw=0,pulse=0,flash=0;
  const base=k=>k==='s'?[0,2]:[0,1];
  const sides=q=>q.k==='e'?[]:base(q.k).map(s=>(s+q.r)%4);
  function gen(){
    COLS=Math.min(5,3+Math.floor(lvl/2));ROWS=Math.min(7,Math.max(COLS+1,Math.floor((c.PH-150)/Math.floor((c.W-104)/COLS))));
    ts=Math.min(Math.floor((c.W-104)/COLS),Math.floor((c.PH-150)/ROWS));x0=Math.round((c.W-ts*COLS)/2);y0=Math.round(c.T+70+(c.PH-150-ts*ROWS)/2);
    for(;;){
      // camino aleatorio (DFS) desde arriba-izquierda hasta abajo-derecha
      const seen=new Set(),path=[];let ok=false;
      const dfs=(x,y)=>{seen.add(y*COLS+x);path.push({x,y});if(x===COLS-1&&y===ROWS-1){ok=true;return true}
        for(const d of ST.shuffle([0,1,2,3])){const nx=x+D[d][0],ny=y+D[d][1];if(nx<0||ny<0||nx>=COLS||ny>=ROWS||seen.has(ny*COLS+nx))continue;if(dfs(nx,ny))return true}
        path.pop();return false};
      dfs(0,0);if(!ok||path.length<COLS+ROWS+1)continue;
      T=[];for(let i=0;i<COLS*ROWS;i++){const k=c.pick(['s','c','c','e']);T.push({k,r:c.RI(0,3),a:0,sol:null})}
      path.forEach((p,i)=>{
        const en=i===0?3:(()=>{const q=path[i-1];return(D.findIndex(d=>d[0]===q.x-p.x&&d[1]===q.y-p.y))})();
        const ex=i===path.length-1?1:D.findIndex(d=>d[0]===path[i+1].x-p.x&&d[1]===path[i+1].y-p.y);
        const q=T[p.y*COLS+p.x];q.k=(en+2)%4===ex?'s':'c';q.path=true;
        for(let r=0;r<4;r++){const s=base(q.k).map(v=>(v+r)%4);if(s.indexOf(en)>=0&&s.indexOf(ex)>=0){q.sol=r;break}}
        q.r=(q.sol+c.RI(1,3))%4;});
      T.forEach(q=>q.a=q.r*1.5708);
      if(!check().ok)break;
    }
    solved=false;
  }
  function check(){
    const lit=new Set();let x=0,y=0,en=3;
    for(let n=0;n<COLS*ROWS+2;n++){
      const q=T[y*COLS+x],s=sides(q);if(s.indexOf(en)<0)return{ok:false,lit};
      lit.add(y*COLS+x);const ex=s.find(v=>v!==en);
      if(q.k==='s'&&(en+2)%4!==ex)return{ok:false,lit};
      if(x===COLS-1&&y===ROWS-1&&ex===1)return{ok:true,lit};
      const nx=x+D[ex][0],ny=y+D[ex][1];if(nx<0||ny<0||nx>=COLS||ny>=ROWS)return{ok:false,lit};x=nx;y=ny;en=(ex+2)%4;
    }
    return{ok:false,lit};
  }
  gen();
  c.down(p=>{
    if(c.dead||solved)return;const ci=Math.floor((p.x-x0)/ts),ri=Math.floor((p.y-y0)/ts);if(ci<0||ci>=COLS||ri<0||ri>=ROWS)return;
    const q=T[ri*COLS+ci];q.r=(q.r+1)%4;c.sfx('tick');c.sfx('tap',1.1);
    if(check().ok){solved=true;sw=.9;c.setScore(c.sc+1);c.sfx('win');tl=Math.min(45,tl+8);flash=.4;c.after(900,()=>{if(!c.dead){lvl++;gen()}})}
  });
  c.loop((dt,t)=>{
    if(!c.dead){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡SIN TIEMPO!')}}
    sw=Math.max(0,sw-dt);flash=Math.max(0,flash-dt);pulse+=dt;
    c.bgGrad('#0b3d91','#082a66');
    g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;for(let x=0;x<c.W;x+=20){g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,c.H);g.stroke()}for(let y=0;y<c.H;y+=20){g.beginPath();g.moveTo(0,y+.5);g.lineTo(c.W,y+.5);g.stroke()}
    g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=1;for(let x=0;x<c.W;x+=100){g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,c.H);g.stroke()}for(let y=0;y<c.H;y+=100){g.beginPath();g.moveTo(0,y+.5);g.lineTo(c.W,y+.5);g.stroke()}
    const lit=check().lit;
    // marco de plano y cajetín
    g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(x0-14,y0-14,ts*COLS+28,ts*ROWS+28);g.lineWidth=1;g.strokeRect(x0-9,y0-9,ts*COLS+18,ts*ROWS+18);
    for(let i=0;i<COLS*ROWS;i++){
      const q=T[i],x=x0+(i%COLS)*ts,y=y0+Math.floor(i/COLS)*ts,on=lit.has(i);
      q.a+=(q.r*1.5708-q.a)*Math.min(1,dt*16);
      g.strokeStyle='rgba(255,255,255,.18)';g.setLineDash([3,4]);g.strokeRect(x+3.5,y+3.5,ts-7,ts-7);g.setLineDash([]);
      if(q.k==='e')continue;
      g.save();g.translate(x+ts/2,y+ts/2);g.rotate(q.a);
      const path=()=>{g.beginPath();if(q.k==='s'){g.moveTo(0,-ts/2);g.lineTo(0,ts/2)}else{g.moveTo(0,-ts/2);g.lineTo(0,0);g.lineTo(ts/2,0)}};
      path();g.lineCap='butt';g.lineJoin='round';g.strokeStyle=on?'rgba(159,232,255,.35)':'rgba(255,255,255,.2)';g.lineWidth=ts*.26;g.stroke();
      path();g.strokeStyle=on?'#9fe8ff':'#fff';g.lineWidth=on?4:2.5;if(on){g.shadowColor='#9fe8ff';g.shadowBlur=14}g.stroke();g.shadowBlur=0;
      if(on){path();g.setLineDash([6,10]);g.lineDashOffset=-pulse*50;g.strokeStyle='#fff';g.lineWidth=2;g.stroke();g.setLineDash([])}
      g.restore();
    }
    // entrada y salida
    const ex=x0-14,ey=y0+ts/2,sx=x0+COLS*ts+14,sy=y0+(ROWS-.5)*ts;
    g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(ex-26,ey);g.lineTo(x0,ey);g.moveTo(sx,sy);g.lineTo(sx+26,sy);g.stroke();
    c.txt('IN',ex-10,ey-14,12,'#fff');c.txt('OUT',sx+16,sy-14,12,'#fff');
    c.circle(ex-26,ey,5,'#fff');c.circle(sx+26,sy,5,solved?'#9fe8ff':'#082a66');g.strokeStyle='#fff';g.beginPath();g.arc(sx+26,sy,5,0,6.2832);g.stroke();
    // cronómetro
    c.txt('T-'+Math.max(0,tl).toFixed(1)+'s',c.W/2,c.T+14,20,tl>10?'#fff':'#ff8a8a');
    c.rect(24,c.T+30,c.W-48,6,'rgba(255,255,255,.2)',3);c.rect(24,c.T+30,(c.W-48)*Math.max(0,tl/45),6,tl>10?'#9fe8ff':'#ff8a8a',3);
    c.txt('ESC 1:50   PLANO Nº '+(lvl+1),x0-14,y0+ts*ROWS+34,11,'rgba(255,255,255,.6)','left');
    if(sw>0){g.globalAlpha=Math.min(1,sw*2);c.txt('¡CONECTADO!',c.W/2,y0+ts*ROWS/2,34,'#fff',null,'#0b3d91');g.globalAlpha=1}
    if(flash>0){g.globalAlpha=flash*.5;c.rect(0,0,c.W,c.H,'#9fe8ff');g.globalAlpha=1}
  });
}});

// ============ 44. CATAPULTA (pergamino) ============
def({id:'catapult',title:'CATAPULTA',emoji:'🏹',tag:'pergamino',hint:'👆 ARRASTRA hacia atrás desde la catapulta y SUELTA. Derriba la torre',style:'parchment',skin:'light',
colors:['#ead9a8','#c9a96a','#8c2f1b'],font:"'Cinzel',serif",
music:{bpm:84,root:52,scale:'harm',lead:'triangle',bassw:'sine',bass:'root',drums:'half',density:.4,vol:.13,len:1.6,oct:1},
create(c){
  const g=c.g,INK='#4a3320',gy=Math.round(c.B-50),cx=64,cyy=gy-34,G=860;
  let ammo=4,pr=null,aim=null,tx,th,tv,tm,hits=0,splat=[],msg=0,clouds=[];
  for(let i=0;i<4;i++)clouds.push({x:c.R(0,c.W),y:c.R(c.T+30,c.T+150),s:c.R(.8,1.5)});
  function newT(){tx=c.R(c.W*.48,c.W-50);th=c.RI(3,6);tv=c.sc>=4?c.R(20,50):0;tm=c.R(0,6)}
  newT();
  const flag=()=>({x:tx+(tv?Math.sin(tm)*60:0),y:gy-th*22-26});
  c.down(p=>{if(c.dead||pr)return;if(Math.hypot(p.x-cx,p.y-cyy)<120)aim={x:p.x,y:p.y}});
  c.move(p=>{if(aim){aim.x=p.x;aim.y=p.y}});
  c.up(()=>{
    if(!aim||pr||c.dead)return;
    let vx=(cx-aim.x),vy=(cyy-aim.y);const L=Math.hypot(vx,vy);if(L<18){aim=null;return}
    const k=Math.min(L,130)/L;vx*=k;vy*=k;
    pr={x:cx,y:cyy-10,vx:vx*5.6,vy:vy*5.6,tr:[]};aim=null;ammo--;c.sfx('whoosh')
  });
  c.loop((dt,t)=>{
    tm+=dt*1.3;
    if(pr){pr.vy+=G*dt;pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.tr.push({x:pr.x,y:pr.y});if(pr.tr.length>40)pr.tr.shift();
      const f=flag();
      if(Math.hypot(pr.x-f.x,pr.y-f.y)<(th*10+30)&&pr.y>f.y-40&&Math.abs(pr.x-f.x)<34+th*3&&Math.abs(pr.y-(f.y+th*11))<th*11+30){
        hits++;c.setScore(c.sc+1);ammo=Math.min(5,ammo+1);c.sfx('hit');c.sfx('win');c.shake(8);splat.push({x:f.x,y:f.y+th*11,l:1});msg=1.2;pr=null;newT()}
      else if(pr.y>gy||pr.x>c.W+60){splat.push({x:pr.x,y:gy,l:.8,s:.4});c.sfx('bump',.7);pr=null;if(ammo<=0)c.after(500,()=>c.over('¡SIN PROYECTILES!'))}}
    msg=Math.max(0,msg-dt);
    // pergamino
    c.bgGrad('#ead9a8','#d9bd80');ST.grain(g,c.W,c.H,.16,'#5a3b1a');
    const vg=g.createRadialGradient(c.W/2,c.H/2,c.H*.25,c.W/2,c.H/2,c.H*.75);vg.addColorStop(0,'rgba(120,70,20,0)');vg.addColorStop(1,'rgba(120,70,20,.45)');g.fillStyle=vg;g.fillRect(0,0,c.W,c.H);
    g.strokeStyle=INK;g.lineWidth=2;g.lineCap='round';g.lineJoin='round';
    // nubes dibujadas a tinta
    clouds.forEach(k=>{k.x+=6*dt;if(k.x>c.W+60)k.x=-60;g.beginPath();g.arc(k.x,k.y,12*k.s,3.4,6.1);g.arc(k.x+16*k.s,k.y-5*k.s,15*k.s,3.3,6.2);g.arc(k.x+34*k.s,k.y,12*k.s,3.5,6.0);g.stroke()});
    // rosa de los vientos
    g.save();g.translate(c.W-46,c.T+80);g.globalAlpha=.6;g.beginPath();g.arc(0,0,22,0,6.2832);g.stroke();for(let i=0;i<4;i++){g.rotate(1.5708);g.beginPath();g.moveTo(0,-30);g.lineTo(5,-5);g.lineTo(-5,-5);g.closePath();g.fillStyle=i%2?INK:'#8c2f1b';g.fill()}g.restore();g.globalAlpha=1;
    // colinas con sombreado a rayas
    g.beginPath();g.moveTo(0,gy);for(let x=0;x<=c.W;x+=8)g.lineTo(x,gy+Math.sin(x*.03)*3);g.stroke();
    g.lineWidth=1;for(let x=0;x<c.W;x+=7){g.beginPath();g.moveTo(x,gy+6);g.lineTo(x-6,gy+20+((x*7)%12));g.stroke()}g.lineWidth=2;
    c.rect(0,gy+24,c.W,c.H,'rgba(140,90,40,.18)');
    // torre y bandera objetivo
    const f=flag(),bw2=46+th*3,bx2=f.x-bw2/2;
    for(let i=0;i<th;i++){const y=gy-(i+1)*22;c.rect(bx2,y,bw2,22,i%2?'#d9c08a':'#cdb078');g.strokeRect(bx2,y,bw2,22);g.beginPath();g.moveTo(bx2+bw2/2,y);g.lineTo(bx2+bw2/2,y+22);g.stroke()}
    for(let i=0;i<4;i++)c.rect(bx2+i*bw2/4+2,gy-th*22-10,bw2/4-4,10,'#cdb078');
    g.beginPath();g.moveTo(f.x,gy-th*22-10);g.lineTo(f.x,f.y);g.stroke();
    g.fillStyle='#8c2f1b';g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+30,f.y+7+Math.sin(t*5)*2);g.lineTo(f.x,f.y+15);g.closePath();g.fill();g.stroke();
    // catapulta
    g.fillStyle='#7a5230';g.beginPath();g.moveTo(cx-34,gy);g.lineTo(cx-10,gy-34);g.lineTo(cx+20,gy-34);g.lineTo(cx+36,gy);g.closePath();g.fill();g.stroke();
    c.circle(cx-22,gy-8,10,'#9a6b3f');c.circle(cx+22,gy-8,10,'#9a6b3f');g.beginPath();g.arc(cx-22,gy-8,10,0,6.2832);g.arc(cx+22,gy-8,10,0,6.2832);g.stroke();
    let arm=-.9,pull=0;if(aim){const vx=cx-aim.x,vy=cyy-aim.y,L=Math.min(130,Math.hypot(vx,vy));pull=L/130;arm=.5+pull*.5}else if(pr)arm=-1.1;
    g.save();g.translate(cx,cyy);g.rotate(aim?Math.atan2(aim.y-cyy,aim.x-cx)*.0+(.2+pull*.7):-.9);g.fillStyle='#5b3b1f';g.fillRect(-60*(aim?.5+pull*.5:.4),-4,90,8);g.strokeRect(-60*(aim?.5+pull*.5:.4),-4,90,8);g.restore();
    if(aim){const vx=cx-aim.x,vy=cyy-aim.y,L=Math.hypot(vx,vy),k=Math.min(L,130)/L;let px=cx,py=cyy-10,qx=vx*k*5.6,qy=vy*k*5.6;
      g.fillStyle=INK;for(let i=0;i<14;i++){qy+=G*.045;px+=qx*.045;py+=qy*.045;c.circle(px,py,2.6-i*.1,INK)}
      g.setLineDash([4,5]);g.beginPath();g.moveTo(cx,cyy);g.lineTo(cx+(aim.x-cx)*Math.min(1,130/Math.hypot(aim.x-cx,aim.y-cyy)),cyy+(aim.y-cyy)*Math.min(1,130/Math.hypot(aim.x-cx,aim.y-cyy)));g.stroke();g.setLineDash([]);
      c.circle(cx,cyy-10,9,'#6b6b70')}
    else if(!pr)c.circle(cx-6,cyy-24,9,'#6b6b70');
    if(pr){pr.tr.forEach((q,i)=>c.circle(q.x,q.y,1+i*.05,'rgba(74,51,32,.5)'));c.circle(pr.x,pr.y,9,'#5d5d63');g.beginPath();g.arc(pr.x,pr.y,9,0,6.2832);g.stroke()}
    splat.forEach(s=>{s.l-=dt;g.globalAlpha=Math.max(0,s.l);ST.burst(g,s.x,s.y,10*(s.s?.5:1),26*(s.s?.5:1),9,'#8c2f1b',INK,2,s.x);g.globalAlpha=1});splat=splat.filter(s=>s.l>0);
    // munición
    for(let i=0;i<5;i++){c.circle(24+i*22,c.T+66,8,i<ammo?'#5d5d63':'rgba(0,0,0,.12)');}
    c.txt('PROYECTILES',24,c.T+88,11,INK,'left');
    if(msg>0){g.globalAlpha=Math.min(1,msg*2);c.txt('¡EN LA BANDERA!',c.W/2,c.T+130,28,'#8c2f1b',null,'#ead9a8');g.globalAlpha=1}
  });
}});

// ============ 45. INTRUSO (periódico) ============
def({id:'odd',title:'EL INTRUSO',emoji:'📰',tag:'periódico',hint:'👆 TOCA la letra distinta antes de que se agote el tiempo',style:'newsprint',skin:'light',
colors:['#efe6cf','#ddd0b0','#c8281e'],font:"'Special Elite',monospace",
music:{bpm:120,root:55,scale:'blues',lead:'triangle',bassw:'sine',bass:'walk',drums:'break',density:.5,vol:.12,len:.9,oct:1,swing:.25},
create(c){
  const g=c.g,PAIRS=[['O','Q'],['b','d'],['E','F'],['6','9'],['M','N'],['C','G'],['P','R'],['I','l'],['h','n'],['V','W'],['8','B'],['A','R'],['U','V'],['S','5'],['Z','2'],['K','X']];
  let cols,rows,cs,x0,y0,G,odd,pair,tl=20,fb=0,fbi=-1,fbok=true,round=0;
  function make(){
    cols=Math.min(7,4+Math.floor(round/3));rows=Math.min(cols+2,Math.floor((c.PH-170)/Math.floor((c.W-30)/cols)));
    cs=Math.min(Math.floor((c.W-30)/cols),Math.floor((c.PH-170)/rows));x0=Math.round((c.W-cs*cols)/2);y0=Math.round(c.T+106+(c.PH-170-cs*rows)/2);
    pair=c.pick(PAIRS);if(Math.random()<.5)pair=[pair[1],pair[0]];odd=c.RI(0,cols*rows-1);
    G=[];for(let i=0;i<cols*rows;i++)G.push({r:c.R(-.12,.12),dx:c.R(-3,3),dy:c.R(-3,3)});fbi=-1;
  }
  make();
  c.down(p=>{
    if(c.dead||fb>.25)return;const ci=Math.floor((p.x-x0)/cs),ri=Math.floor((p.y-y0)/cs);if(ci<0||ci>=cols||ri<0||ri>=rows)return;
    const i=ri*cols+ci;fbi=i;
    if(i===odd){fbok=true;fb=.45;round++;c.setScore(c.sc+1);tl=Math.min(24,tl+1.2);c.sfx('coin');c.after(300,()=>{if(!c.dead)make()})}
    else{fbok=false;fb=.45;tl-=3;c.sfx('hit');c.shake(6)}
  });
  c.loop((dt,t)=>{
    fb=Math.max(0,fb-dt);if(!c.dead){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡CIERRE DE EDICIÓN!')}}
    c.rect(0,0,c.W,c.H,'#efe6cf');ST.grain(g,c.W,c.H,.22,'#6b5a35');
    ST.halftone(g,0,0,c.W,c.T+100,'rgba(120,100,60,.09)',5,.6,true);
    // cabecera del periódico
    const INK='#1b1b1b';
    c.txt('THE TIK TIMES',c.W/2,c.T+32,30,INK,null);
    g.fillRect(16,c.T+52,c.W-32,3);g.fillRect(16,c.T+57,c.W-32,1);
    c.txt('EDICIÓN ESPECIAL · ENCUENTRA AL INTRUSO',c.W/2,c.T+70,11,INK);
    g.fillRect(16,c.T+80,c.W-32,1);
    // tiempo como columna de tinta
    c.rect(16,c.T+86,c.W-32,8,'rgba(0,0,0,.1)');c.rect(16,c.T+86,(c.W-32)*Math.max(0,tl/24),8,tl>6?INK:'#c8281e');
    // letras
    g.fillStyle='rgba(0,0,0,.18)';for(let i=1;i<cols;i++)g.fillRect(x0+i*cs-.5,y0,1,rows*cs);
    for(let i=0;i<G.length;i++){
      const q=G[i],x=x0+(i%cols+.5)*cs,y=y0+(Math.floor(i/cols)+.5)*cs,ch=i===odd?pair[1]:pair[0];
      g.save();g.translate(x+q.dx,y+q.dy);g.rotate(q.r);
      c.txt(ch,1.5,1.5,cs*.74,'rgba(200,40,30,.35)');c.txt(ch,0,0,cs*.74,INK);g.restore();
    }
    if(fbi>=0&&fb>0){const i=fbi,x=x0+(i%cols+.5)*cs,y=y0+(Math.floor(i/cols)+.5)*cs;g.globalAlpha=Math.min(1,fb*4);
      g.strokeStyle=fbok?'#c8281e':'#1b1b1b';g.lineWidth=5;g.beginPath();if(fbok){g.ellipse(x,y,cs*.5,cs*.44,-.15,0,6.2832)}else{g.moveTo(x-cs*.3,y-cs*.3);g.lineTo(x+cs*.3,y+cs*.3);g.moveTo(x+cs*.3,y-cs*.3);g.lineTo(x-cs*.3,y+cs*.3)}g.stroke();g.globalAlpha=1}
    c.txt('EDICIÓN Nº '+(round+1)+'  ·  '+Math.max(0,tl).toFixed(0)+'s',c.W/2,y0+rows*cs+22,13,INK);
  });
}});

// ============ 46. TIRO AL PLATO (cómic) ============
def({id:'skeet',title:'TIRO AL PLATO',emoji:'🎯',tag:'cómic',hint:'👆 TOCA los platos para dispararles antes de que caigan',style:'comic',skin:'light',
colors:['#ffe45c','#38c8ff','#e8222d'],font:"'Bangers',Impact,sans-serif",
music:{bpm:132,root:55,scale:'major',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'break',density:.65,vol:.1,len:.6,oct:1},
create(c){
  const g=c.g,gy=Math.round(c.B-64);
  let D=[],lives=3,spawn=1,hits=[],words=[],bits=[],tt=0;
  const WORDS=['¡PUM!','¡BANG!','¡ZAS!','¡POW!','¡CRAC!'];
  const launch=()=>{const L=Math.random()<.5,x=L?-20:c.W+20,sp=c.R(c.W*.5,c.W*.8)+c.sc*3;D.push({x,y:gy-c.R(0,40),vx:(L?1:-1)*sp*c.R(.45,.8),vy:-c.R(520,760),r:c.R(20,26),rot:0})};
  c.down(p=>{
    if(c.dead)return;let hit=false;
    for(const d of D){if(Math.hypot(d.x-p.x,d.y-p.y)<d.r+24){d.dead=true;hit=true;c.setScore(c.sc+1);words.push({x:d.x,y:d.y,t:c.pick(WORDS),l:.55,r:c.R(-.3,.3)});c.sfx('hit');c.sfx('pop',1.3);for(let i=0;i<8;i++)bits.push({x:d.x,y:d.y,vx:c.R(-260,260),vy:c.R(-420,-60),l:.8,r:c.R(0,6)});break}}
    hits.push({x:p.x,y:p.y,l:.18});if(!hit)c.sfx('tick');D=D.filter(d=>!d.dead);
  });
  c.loop((dt,t)=>{
    tt+=dt;
    if(!c.dead){spawn-=dt;if(spawn<=0){launch();if(c.sc>8&&Math.random()<.4)launch();spawn=Math.max(.5,1.5-c.sc*.035)}
      for(const d of D){d.vy+=900*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.rot+=dt*6;if(d.y>gy&&d.vy>0){d.dead=true;lives--;c.sfx('lose');c.shake(8);words.push({x:d.x,y:gy-20,t:'¡UPS!',l:.6,r:0});if(lives<=0)c.over('¡TE QUEDASTE SIN VIDAS!')}}
      D=D.filter(d=>!d.dead)}
    // fondo: cielo con rayos y medios tonos
    c.rect(0,0,c.W,c.H,'#38c8ff');
    g.save();g.translate(c.W*.5,gy-40);for(let i=0;i<14;i++){g.rotate(6.2832/14);if(i%2){g.fillStyle='#8bdcff';g.beginPath();g.moveTo(0,0);g.lineTo(c.H*1.3,-c.W*.12);g.lineTo(c.H*1.3,c.W*.12);g.closePath();g.fill()}}g.restore();
    ST.halftone(g,0,0,c.W,gy,'rgba(0,70,160,.28)',9,.55,true);
    // sol de cómic
    ST.burst(g,c.W*.8,c.T+110,40,70,16,'#ffe45c','#111',4,t*.3);c.circle(c.W*.8,c.T+110,36,'#fff176');
    // suelo
    c.rect(0,gy,c.W,c.H-gy,'#35c759');ST.halftone(g,0,gy,c.W,c.H-gy,'rgba(0,80,30,.35)',8,.6,false);g.fillStyle='#111';g.fillRect(0,gy-2,c.W,5);
    // platos
    D.forEach(d=>{g.save();g.translate(d.x,d.y);g.rotate(Math.sin(d.rot)*.15);g.fillStyle='#ff7a1a';g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.ellipse(0,0,d.r*1.2,d.r*.5,0,0,6.2832);g.fill();g.stroke();
      g.fillStyle='#ffd0a0';g.beginPath();g.ellipse(0,-d.r*.14,d.r*.7,d.r*.2,0,0,6.2832);g.fill();g.restore()});
    bits.forEach(b=>{b.l-=dt;b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.r+=dt*9;g.save();g.translate(b.x,b.y);g.rotate(b.r);g.fillStyle='#ff7a1a';g.strokeStyle='#111';g.lineWidth=2;g.fillRect(-6,-4,12,8);g.strokeRect(-6,-4,12,8);g.restore()});bits=bits.filter(b=>b.l>0);
    // onomatopeyas
    words.forEach(w=>{w.l-=dt;const s=Math.min(1,(.55-w.l)*8+.4);g.save();g.translate(w.x,w.y-10);g.rotate(w.r);g.scale(s,s);ST.burst(g,0,0,38,64,10,'#ffe45c','#111',4);c.txt(w.t,0,2,34,'#e8222d',null,'#111');g.restore()});words=words.filter(w=>w.l>0);
    hits.forEach(h=>{h.l-=dt;g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.arc(h.x,h.y,12+(0.18-h.l)*120,0,6.2832);g.stroke()});hits=hits.filter(h=>h.l>0);
    // vidas
    for(let i=0;i<3;i++)c.txt('♥',c.W-26-i*30,c.T+30,30,i<lives?'#e8222d':'rgba(0,0,0,.25)',null,i<lives?'#111':null);
    // cartel inferior
    c.txt('¡DISPARA!',c.W/2,gy+22,26,'#fff',null,'#111');
  });
}});
