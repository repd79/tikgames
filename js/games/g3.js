// ============ 11. STICK BRIDGE ============
def({id:'bridge',title:'PUENTE REAL',emoji:'🏰',tag:'medieval',hint:'👆 MANTÉN para alargar el puente, SUELTA para tirarlo',
colors:['#0b1030','#3a2a6a','#ffd166'],font:"'Cinzel',serif",
music:{bpm:70,root:43,scale:'harm',lead:'triangle',bassw:'sine',bass:'root',drums:'half',density:.4,vol:.14,len:3,oct:1,pad:true},
create(c){
  const g=c.g,PW=54;
  let pil,cam=0,camT=0,st='idle',len=0,ang=0,hx,hy=0,hvy=0,tgtX=0,ok=false,perfect=false,walkTo=0,holding=false;
  const gy=()=>c.B-70;
  const mkp=(prev)=>{const w=c.RI(36,86),gap=c.RI(50,Math.max(80,c.W*.55));return{x:prev.x+prev.w+gap,w}};
  pil=[{x:30,w:PW}];pil.push(mkp(pil[0]));hx=pil[0].x+pil[0].w-14;
  const stars=[];for(let i=0;i<50;i++)stars.push({x:Math.random(),y:Math.random()*.55,p:Math.random()*6});
  c.down(()=>{if(st==='idle'&&!c.dead){st='grow';holding=true}});
  c.up(()=>{if(st==='grow'){st='fall';ang=0;c.sfx('whoosh')}});
  c.loop((dt,t)=>{
    const p0=pil[0],p1=pil[1],bx=p0.x+p0.w;
    if(st==='grow'){len=Math.min(len+260*dt,c.W*1.5);if(Math.floor(t*14)%2===0&&Math.random()<.2)c.sfx('tick')}
    else if(st==='fall'){
      ang+=dt*4.5;const lim=1.5708;
      if(ang>=lim){ang=lim;const tip=bx+len;ok=tip>=p1.x&&tip<=p1.x+p1.w;perfect=ok&&Math.abs(tip-(p1.x+p1.w/2))<5;
        if(ok){st='walk';walkTo=p1.x+p1.w-14;c.sfx('bump')}else{st='walk';walkTo=tip}}
    }else if(st==='walk'){
      hx+=Math.min(300*dt,walkTo-hx);
      if(hx>=walkTo-.5){
        if(ok){const pts=perfect?2:1;c.setScore(c.sc+pts);if(perfect){c.sfx('win');c.float('PERFECT +2',hx,gy()-60,'#ffd166');c.burst(hx,gy(),'#ffd166',18)}else c.sfx('coin');
          st='scroll';camT=p1.x-30;if(c.sc===1)c.say('¡Cuanto más centrado, mejor!')}
        else{st='drop';hvy=0}
      }
    }else if(st==='drop'){
      hvy+=1800*dt;hy+=hvy*dt;ang=Math.min(3.1416,ang+dt*3);
      if(hy>c.H-gy()+40&&!c.dead){c.sfx('lose');c.shake(8);c.over()}
    }else if(st==='scroll'){
      const d=(camT-cam)*Math.min(1,dt*6);cam+=d;
      if(Math.abs(camT-cam)<1){cam=camT;pil.shift();pil.push(mkp(pil[pil.length-1]));st='idle';len=0;ang=0}
    }
    c.bgGrad('#0b1030','#4b2f7a');
    stars.forEach(s=>{g.globalAlpha=.3+.6*Math.abs(Math.sin(t+s.p));c.rect(s.x*c.W,s.y*c.H,2,2,'#fff')});g.globalAlpha=1;
    c.glow('#ffe9a8',40);c.circle(c.W*.78,c.T+c.PH*.2,34,'#fff3c4');c.noglow();
    g.fillStyle='#1a1648';g.beginPath();g.moveTo(0,gy()+20);for(let x=0;x<=c.W;x+=30)g.lineTo(x,gy()-60-Math.abs(Math.sin((x+cam*.2)*.01))*70);g.lineTo(c.W,gy()+20);g.fill();
    // castillo de fondo
    g.fillStyle='#120f33';const cx0=-(cam*.3)%(c.W+300)+c.W*.3;g.fillRect(cx0,gy()-130,26,130);g.fillRect(cx0+50,gy()-100,30,100);g.fillRect(cx0+100,gy()-150,26,150);
    g.save();g.translate(-cam,0);
    pil.forEach(p=>{
      const gr=g.createLinearGradient(0,gy(),0,c.H);gr.addColorStop(0,'#2c2a4a');gr.addColorStop(1,'#14122a');g.fillStyle=gr;g.fillRect(p.x,gy(),p.w,c.H);
      c.rect(p.x,gy(),p.w,6,'#ffd166');
      if(p===pil[1]){c.rect(p.x+p.w/2-4,gy(),8,6,'#e63946')}
    });
    if(len>0){g.save();g.translate(bx,gy());g.rotate(ang);g.fillStyle='#e9c46a';g.fillRect(-3,-len,6,len);g.restore()}
    const hxx=hx;g.save();g.translate(hxx,gy()+hy);
    if(st==='drop')g.rotate(ang);
    c.rect(-7,-26,14,20,'#bfc3d0',3);c.circle(0,-31,8,'#d8dbe6');c.rect(-8,-35,16,5,'#8d93a8',2);c.rect(-1,-44,4,10,'#e63946',2);c.rect(7,-24,5,14,'#ffd166',2);
    g.restore();g.restore();
    c.txt('MANTÉN',c.W/2,c.B+10,12,'rgba(255,255,255,.0)');
  });
}});

// ============ 12. QUICK DRAW ============
def({id:'western',title:'DUELO',emoji:'🤠',tag:'far west',hint:'👆 Espera… y TOCA en cuanto salga ¡FUEGO!',
colors:['#ff9a3c','#7a1f1f','#ffe066'],font:"'Rye',serif",
music:{bpm:76,root:40,scale:'minpent',lead:'sawtooth',bassw:'triangle',bass:'walk',drums:'half',density:.3,vol:.11,len:1.5,oct:2},
create(c){
  const g=c.g;let st='intro',tm=1.2,limit=.8,round=0,react=0,msg='',res=0,wl=0,flash=0;
  const gnd=()=>c.B-30;let tumble=-60;
  const man=(x,dir,fall,draw,col)=>{
    g.save();g.translate(x,gnd());g.scale(dir,1);if(fall)g.rotate(-fall*1.2);
    g.fillStyle=col;g.fillRect(-12,-52,10,52);g.fillRect(2,-52,10,52);g.fillRect(-16,-96,32,50);
    g.beginPath();g.arc(0,-108,13,0,6.2832);g.fill();g.fillRect(-26,-120,52,6);g.fillRect(-14,-136,28,18);
    g.fillRect(14,-86,draw?34:10,7);
    if(draw){c.circle(50,-82,5,'#ffd60a')}
    g.restore();
  };
  const begin=()=>{st='wait';tm=c.R(1.2,3.6);msg='';flash=0};
  c.down(()=>{
    if(c.dead)return;
    if(st==='wait'){st='res';wl=0;msg='¡Demasiado pronto!';c.sfx('lose');c.shake(8);res=.5;c.over('¡Demasiado pronto!')}
    else if(st==='draw'){
      react=Math.round(tm*1000);
      if(tm<limit){st='res';wl=1;res=1.3;round++;c.setScore(round);c.sfx('hit');c.shake(10);c.vib(50);flash=.25;msg=react+' ms';c.float(react+' ms',c.W/2,gnd()-190,'#fff')}
    }
  });
  c.loop((dt,t)=>{
    tumble+=dt*70;if(tumble>c.W+60)tumble=-60;
    flash=Math.max(0,flash-dt);
    if(!c.dead){
      if(st==='intro'){tm-=dt;if(tm<=0)begin()}
      else if(st==='wait'){tm-=dt;if(tm<=0){st='draw';tm=0;c.sfx('ding',1.5);flash=.18;limit=Math.max(.3,.8-round*.05)}}
      else if(st==='draw'){tm+=dt;if(tm>=limit){st='res';wl=-1;res=.4;flash=.3;c.sfx('hit');c.shake(14);c.over('¡Te han disparado!',react?'':'')}}
      else if(st==='res'&&wl===1){res-=dt;if(res<=0)begin()}
    }
    c.bgGrad('#ffb347','#7a1f1f','#ff6b4a');
    c.glow('#ffe066',60);c.circle(c.W/2,c.T+c.PH*.32,58,'#ffe9a0');c.noglow();
    g.fillStyle='#5a1818';g.beginPath();g.moveTo(0,gnd());g.lineTo(40,gnd()-60);g.lineTo(90,gnd()-20);g.lineTo(150,gnd()-90);g.lineTo(220,gnd()-30);g.lineTo(c.W,gnd()-70);g.lineTo(c.W,gnd());g.fill();
    g.fillStyle='#3b0d0d';g.fillRect(0,gnd(),c.W,c.H);
    for(let i=0;i<3;i++){const x=c.W*(.2+i*.3);g.fillStyle='#2a0808';g.fillRect(x,gnd()-70,10,70);g.fillRect(x-14,gnd()-52,12,8);g.fillRect(x+10,gnd()-60,12,8)}
    g.save();g.translate(tumble,gnd()-14);g.rotate(tumble*.1);g.strokeStyle='#7a4a1a';g.lineWidth=2;for(let i=0;i<6;i++){g.beginPath();g.ellipse(0,0,13,6+i,i,0,6.2832);g.stroke()}g.restore();
    const px=c.W*.25,ox=c.W*.75,draw=(st==='draw');
    const fallMe=(st==='res'&&wl!==1)||c.dead&&wl!==1?Math.min(1,(.4-res+.4)):0;
    man(px,1,c.dead&&wl===-1?1:0,draw||(c.dead),'#120505');
    man(ox,-1,wl===1?1:0,draw||wl===-1,'#120505');
    if(st==='wait'||st==='intro')c.txt('…',c.W/2,c.T+c.PH*.3,60,'#fff','center','#7a1f1f');
    if(draw)c.txt('¡FUEGO!',c.W/2,c.T+c.PH*.26,64,'#fff','center','#d00000');
    if(st==='intro')c.txt('DUELO',c.W/2,c.T+c.PH*.18,28,'#ffe066','center','#3b0d0d');
    if(msg&&wl===1)c.txt(msg,c.W/2,c.T+c.PH*.18,30,'#ffe066','center','#3b0d0d');
    if(round>0&&st!=='res')c.txt('límite '+Math.round(limit*1000)+' ms',c.W/2,c.B+16,12,'rgba(255,255,255,.5)');
    if(flash>0){g.globalAlpha=Math.min(1,flash*3);g.fillStyle='#fff';g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 13. COLOR JUNGLE ============
def({id:'chameleon',title:'CAMALEÓN',emoji:'🦎',tag:'selva',hint:'👆 TOCA para cambiar de color y comer solo lo igual',
colors:['#06240f','#0b5a2a','#b6ff3b'],font:"'Luckiest Guy',sans-serif",
music:{bpm:122,root:60,scale:'pent',lead:'triangle',bassw:'sine',bass:'walk',drums:'hats',density:.7,vol:.15,len:.8,oct:0},
create(c){
  const g=c.g,COL=['#ff4d6d','#ffd60a','#4cc9f0','#c77dff'];let ci=0,objs=[],gap=0,sp=200,eat=0,blink=0,sq=0;
  const nc=()=>c.sc>=20?4:c.sc>=8?3:2;
  const py=()=>c.B-70;
  const leaves=[];for(let i=0;i<14;i++)leaves.push({x:Math.random(),y:Math.random(),r:30+Math.random()*50,a:Math.random()*6});
  c.down(()=>{if(c.dead)return;ci=(ci+1)%nc();sq=1;c.sfx('tap',.9+ci*.2);if(c.sc===0&&!objs.length)c.say('Cada toque cambia tu color')});
  c.loop((dt,t)=>{
    sq=Math.max(0,sq-dt*5);
    if(!c.dead){
      sp=Math.min(190+c.sc*7,480);gap-=sp*dt;
      if(gap<=0){objs.push({y:c.T-20,c:c.RI(0,nc()-1)});gap=c.R(170,270)}
      for(let i=objs.length-1;i>=0;i--){
        const o=objs[i];o.y+=sp*dt;
        if(o.y>=py()-34){
          if(o.c===ci){objs.splice(i,1);c.setScore(c.sc+1);c.sfx('coin',1+c.sc*.015);c.burst(c.W/2,py()-20,COL[o.c],14);blink=.2;if(c.sc===8)c.say('¡Nuevo color!');if(c.sc===20)c.say('¡Y otro más!')}
          else{c.sfx('hit');c.shake(12);c.vib(70);c.burst(c.W/2,py(),COL[o.c],26,300);c.over('¡Color equivocado!');break}
        }
      }
    }
    blink=Math.max(0,blink-dt);
    c.bgGrad('#06240f','#0f6a30');
    leaves.forEach(l=>{g.save();g.translate(l.x*c.W,l.y*c.H);g.rotate(l.a+Math.sin(t*.8+l.a)*.1);g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(0,0,l.r,l.r*.35,0,0,6.2832);g.fill();g.restore()});
    g.strokeStyle='#0a3d1a';g.lineWidth=6;[.08,.92].forEach(x=>{g.beginPath();g.moveTo(x*c.W,0);for(let y=0;y<c.H;y+=40)g.lineTo(x*c.W+Math.sin(y*.05+t)*8,y);g.stroke()});
    for(const o of objs){c.glow(COL[o.c],18);c.circle(c.W/2,o.y,22,COL[o.c]);c.noglow();c.circle(c.W/2-7,o.y-7,6,'rgba(255,255,255,.55)')}
    // camaleón
    const x=c.W/2,y=py(),col=COL[ci];
    g.save();g.translate(x,y);g.scale(1+sq*.12,1-sq*.12);
    g.strokeStyle=col;g.lineWidth=10;g.lineCap='round';g.beginPath();g.arc(48,10,16,3.2,8);g.stroke();
    c.glow(col,22);c.circle(0,0,34,col);c.noglow();c.circle(0,10,20,'rgba(255,255,255,.2)');
    c.circle(-8,-16,13,'#fff');c.circle(-8,-16,13,'#fff');const tgt=objs[0];const lk=tgt?c.clamp((tgt.y-y)/200,-1,0):0;
    c.circle(-8,-16,6,'#111');c.circle(-8+1,-16+lk*3-1,2,'#fff');
    g.strokeStyle='#073b1a';g.lineWidth=3;g.beginPath();g.arc(-12,6,10,.3,2.4);g.stroke();
    if(blink>0){g.strokeStyle='#ff5d8f';g.lineWidth=5;g.beginPath();g.moveTo(-16,2);g.lineTo(-16,-50);g.stroke();c.circle(-16,-54,7,'#ff5d8f')}
    g.restore();
    // paleta actual
    for(let i=0;i<nc();i++){c.circle(c.W/2-(nc()-1)*14+i*28,c.B+4,i===ci?9:5,COL[i])}
  });
}});

// ============ 14. HAUNTED FLY ============
def({id:'ghost',title:'FANTASMITA',emoji:'👻',tag:'noche de brujas',hint:'👆 MANTÉN para subir, SUELTA para bajar',
colors:['#10001f','#2d0a4e','#9dff7a'],font:"'Creepster',cursive",
music:{bpm:66,root:41,scale:'phrygian',lead:'sine',bassw:'sine',bass:'root',drums:'none',density:.25,vol:.15,len:3,oct:1,pad:true},
create(c){
  const g=c.g;let y=(c.T+c.B)/2,vy=0,s=0,dist=0,candles=0,got={};
  const gx=()=>c.W*.28,R=15,seed=Math.random()*100;
  const gap=x=>Math.max(175,300-x*.012);
  const mid=x=>{const m=(c.T+c.B)/2,A=(c.PH-gap(x))/2-14;return m+A*(Math.sin(x*.004+seed)*.6+Math.sin(x*.011+seed*2)*.4)};
  const tp=x=>mid(x)-gap(x)/2,bt=x=>mid(x)+gap(x)/2;
  const cand=i=>{const x=600+i*520;return{x,y:mid(x)+Math.sin(i*7.3)*(gap(x)/2-34)}};
  const fog=[];for(let i=0;i<8;i++)fog.push({x:Math.random(),y:Math.random(),r:60+Math.random()*80});
  c.loop((dt,t)=>{
    let holding=false;for(const k in c.ptr)holding=true;
    if(!c.dead){
      vy+=(holding?-1150:950)*dt;vy=c.clamp(vy,-340,400);y+=vy*dt;dist+=Math.min(260+dist*.02,360)*dt;
      const wx=dist+gx();
      for(const dx of[-R*.7,0,R*.7])if(y-R<tp(wx+dx)+2||y+R>bt(wx+dx)-2){c.sfx('hit');c.shake(12);c.vib(60);c.burst(gx(),y,'#9dff7a',24);c.over();break}
      for(let i=Math.floor((wx-700)/520);i<=Math.ceil((wx+400)/520);i++){if(i<0||got[i])continue;const cd=cand(i);if(Math.hypot(cd.x-wx,cd.y-y)<26){got[i]=1;candles++;c.sfx('coin');c.float('+5',gx(),y-24,'#ffd60a');c.burst(gx(),y,'#ffd60a',10)}}
      c.setScore(Math.floor(dist/40)+candles*5);
      if(dist<80)c.say('¡Mantén para subir!',1800);
    }
    c.bgGrad('#10001f','#2d0a4e');
    c.glow('#fff',40);c.circle(c.W*.8,c.T+70,30,'#f4eaff');c.noglow();
    const w0=dist;
    g.beginPath();g.moveTo(0,0);for(let x=0;x<=c.W+8;x+=8)g.lineTo(x,tp(w0+x));g.lineTo(c.W,0);g.closePath();g.fillStyle='#0a0014';g.fill();
    g.beginPath();g.moveTo(0,c.H);for(let x=0;x<=c.W+8;x+=8)g.lineTo(x,bt(w0+x));g.lineTo(c.W,c.H);g.closePath();g.fill();
    g.strokeStyle='#9dff7a';g.lineWidth=3;g.shadowColor='#9dff7a';g.shadowBlur=12;
    g.beginPath();for(let x=0;x<=c.W+8;x+=8){const yy=tp(w0+x);x?g.lineTo(x,yy):g.moveTo(x,yy)}g.stroke();
    g.beginPath();for(let x=0;x<=c.W+8;x+=8){const yy=bt(w0+x);x?g.lineTo(x,yy):g.moveTo(x,yy)}g.stroke();g.shadowBlur=0;
    for(let i=Math.max(0,Math.floor((w0-100)/520)-1);i<=Math.ceil((w0+c.W)/520);i++){if(got[i])continue;const cd=cand(i),sx=cd.x-w0;if(sx<-30||sx>c.W+30)continue;
      c.rect(sx-5,cd.y,10,24,'#f4eaff',2);g.shadowColor='#ffb703';g.shadowBlur=18;g.fillStyle='#ffb703';g.beginPath();g.ellipse(sx,cd.y-8,5,10+Math.sin(t*12+i)*2,0,0,6.2832);g.fill();g.shadowBlur=0}
    fog.forEach(f=>{g.globalAlpha=.07;c.circle(((f.x*c.W-t*10)%(c.W+200)+c.W+200)%(c.W+200)-100,f.y*c.H,f.r,'#c9a7ff')});g.globalAlpha=1;
    if(!c.dead){
      g.save();g.translate(gx(),y);g.rotate(vy*.0012);g.shadowColor='#fff';g.shadowBlur=22;g.fillStyle='#fff';g.beginPath();g.arc(0,-2,R,3.14,6.28);g.lineTo(R,R);for(let i=0;i<4;i++)g.quadraticCurveTo(R-i*R/2+2,R+8+Math.sin(t*10+i)*3,R-(i+1)*R/2,R);g.lineTo(-R,R);g.closePath();g.fill();g.shadowBlur=0;
      c.circle(-5,-4,3,'#222');c.circle(5,-4,3,'#222');c.circle(0,4,3,'#222');g.restore();
    }
  });
}});

// ============ 15. CANDY DROP ============
def({id:'candy',title:'CANDY DROP',emoji:'🍭',tag:'dulces',hint:'👆 TOCA para soltar el caramelo en la cesta',
colors:['#ffc2e6','#b8f5e0','#ff5fa8'],font:"'Pacifico',cursive",
music:{bpm:116,root:62,scale:'major',lead:'triangle',bassw:'sine',bass:'walk',drums:'hats',density:.6,vol:.15,len:1,oct:0,swing:.15},
create(c){
  const g=c.g;let lives=3,t0=0,amp=.9,w=2.2,cd=null,bx=c.W/2,bd=1,bw=100,pause=0,L;
  const px=()=>c.W/2,py=()=>c.T+34,by=()=>c.B-24,CAN=['#ff5fa8','#ffd23f','#3bceac','#6a4cff'];let col=0;
  const conf=[];for(let i=0;i<30;i++)conf.push({x:Math.random(),y:Math.random(),c:CAN[i%4],s:Math.random()});
  const setup=()=>{L=Math.min(c.PH*.34,230)};setup();
  const pos=tt=>{const th=amp*Math.sin(w*tt);return{th,x:px()+Math.sin(th)*L,y:py()+Math.cos(th)*L,vx:Math.cos(th)*L*amp*w*Math.cos(w*tt),vy:-Math.sin(th)*L*amp*w*Math.cos(w*tt)}};
  c.down(()=>{if(c.dead||cd||pause>0)return;const p=pos(t0);cd={x:p.x,y:p.y,vx:p.vx,vy:p.vy};c.sfx('whoosh');if(c.sc===0)c.say('¡Suelta cuando esté sobre la cesta!')});
  const lose=()=>{lives--;c.sfx('hit');c.shake(8);cd=null;pause=.6;if(lives<=0){c.sfx('lose');c.over()}};
  c.loop((dt,t)=>{
    if(!c.dead){
      t0+=dt;pause-=dt;bw=Math.max(56,100-c.sc*3);
      bx+=bd*(80+Math.min(c.sc*9,200))*dt;if(bx<bw/2+6){bx=bw/2+6;bd=1}if(bx>c.W-bw/2-6){bx=c.W-bw/2-6;bd=-1}
      if(cd){
        cd.vy+=1200*dt;cd.x+=cd.vx*dt;cd.y+=cd.vy*dt;
        if(cd.x<10||cd.x>c.W-10){cd.vx*=-.6;cd.x=c.clamp(cd.x,10,c.W-10)}
        if(cd.vy>0&&cd.y>=by()-18&&cd.y<by()+14){
          if(Math.abs(cd.x-bx)<bw/2-4){const sw=Math.abs(cd.x-bx)<10;c.setScore(c.sc+(sw?2:1));c.sfx('coin',sw?1.4:1);c.burst(cd.x,by(),CAN[col],16);if(sw)c.float('¡SWISH!',cd.x,by()-40,'#ff5fa8');cd=null;col=(col+1)%4;pause=.35;amp=Math.min(1.25,.9+c.sc*.012);w=Math.min(3.4,2.2+c.sc*.03)}
        }
        if(cd&&cd.y>c.H+20)lose();
      }
    }
    c.bgGrad('#ffc2e6','#b8f5e0');
    conf.forEach(f=>{g.save();g.translate(f.x*c.W,((f.y+t*.03*(.4+f.s))%1)*c.H);g.rotate(t+f.s*6);c.rect(-3,-1,6,3,f.c);g.restore()});
    g.globalAlpha=.8;[[.2,.35],[.75,.5],[.4,.62]].forEach(([x,y])=>{c.circle(c.W*x,c.H*y,38,'#fff');c.circle(c.W*x+30,c.H*y+8,28,'#fff');c.circle(c.W*x-30,c.H*y+10,26,'#fff')});g.globalAlpha=1;
    // cesta
    const y0=by();g.fillStyle='#ff5fa8';g.beginPath();g.moveTo(bx-bw/2,y0-18);g.lineTo(bx+bw/2,y0-18);g.lineTo(bx+bw/2-12,y0+22);g.lineTo(bx-bw/2+12,y0+22);g.closePath();g.fill();
    g.fillStyle='#fff';for(let i=0;i<4;i++){g.beginPath();g.moveTo(bx-bw/2+i*bw/4+4,y0-18);g.lineTo(bx-bw/2+i*bw/4+bw/8+2,y0-18);g.lineTo(bx-bw/2+12+i*(bw-24)/4+(bw-24)/8,y0+22);g.lineTo(bx-bw/2+12+i*(bw-24)/4,y0+22);g.fill()}
    c.rect(bx-bw/2-4,y0-24,bw+8,10,'#ff2f8e',5);
    // péndulo
    if(!cd&&pause<=0||(!cd)){const p=pos(t0);g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(px(),py());g.lineTo(p.x,p.y);g.stroke();c.circle(px(),py(),6,'#ff5fa8');drawC(p.x,p.y,t*2)}
    else if(cd){g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=3;g.beginPath();g.moveTo(px(),py());g.lineTo(px(),py()+10);g.stroke();drawC(cd.x,cd.y,cd.x*.05)}
    function drawC(x,y,r){g.save();g.translate(x,y);g.rotate(r);c.circle(0,0,15,CAN[col]);g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(0,0,9,0,4.5);g.stroke();g.beginPath();g.arc(0,0,4,0,4.5);g.stroke();g.restore()}
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#ff2f8e');
  });
}});
