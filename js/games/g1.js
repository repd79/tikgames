// ============ 1. NEON STACK ============
def({id:'stack',title:'NEON STACK',emoji:'🌆',tag:'synthwave',hint:'👆 TOCA para soltar el bloque',
colors:['#14002e','#4a0a5e','#ff2e93'],font:"'Bungee',Impact,sans-serif",
music:{bpm:112,root:45,scale:'minor',lead:'sawtooth',bassw:'sawtooth',bass:'walk',drums:'four',density:.6,vol:.14,len:1.5,oct:1},
create(c){
  const g=c.g,BH=30;let B,cur,dir,sp,cam,deb,combo;
  const W0=()=>Math.min(c.W*.58,240);
  const yOf=lv=>c.B-40-(lv-cam)*BH;
  const col=n=>'hsl('+((300+n*14)%360)+',100%,60%)';
  const stars=[];for(let i=0;i<40;i++)stars.push({x:Math.random(),y:Math.random()*.6,p:Math.random()*6});
  function place(w,left){cur={x:left?0:c.W-w,w};dir=left?1:-1}
  {const w=W0();B=[{x:(c.W-w)/2,w}];place(w,true);sp=190;cam=0;deb=[];combo=0}
  c.down(()=>{
    if(c.dead||!cur)return;
    const top=B[B.length-1],l=Math.max(cur.x,top.x),r=Math.min(cur.x+cur.w,top.x+top.w),ov=r-l,lv=B.length;
    if(ov<=2){deb.push({x:cur.x,w:cur.w,lv,y:0,vy:0,col:col(lv)});cur=null;c.sfx('lose');c.shake(10);c.vib(60);c.over();return}
    let nx=l,nw=ov;
    if(Math.abs(cur.x-top.x)<8){
      nx=top.x;nw=top.w;combo++;c.sfx('coin',1+Math.min(combo,8)*.08);
      c.float(combo>1?'PERFECT x'+combo:'PERFECT',c.W/2,yOf(lv)-10,'#fff');c.burst(c.W/2,yOf(lv),col(lv),16);
      if(combo>=3){const w2=Math.min(nw+10,W0());nx=c.clamp(nx-(w2-nw)/2,0,c.W-w2);nw=w2}
    }else{
      combo=0;c.sfx('tap',.8+lv*.01);
      if(cur.x<l)deb.push({x:cur.x,w:l-cur.x,lv,y:0,vy:0,col:col(lv)});
      if(cur.x+cur.w>r)deb.push({x:r,w:cur.x+cur.w-r,lv,y:0,vy:0,col:col(lv)});
    }
    B.push({x:nx,w:nw});c.setScore(B.length-1);sp=Math.min(190+B.length*6,430);place(nw,B.length%2===0);
    if(B.length===4)c.say('¡Cuanto más exacto, más grande!');
  });
  c.loop((dt,t)=>{
    if(cur&&!c.dead){cur.x+=dir*sp*dt;if(cur.x<0){cur.x=0;dir=1}if(cur.x+cur.w>c.W){cur.x=c.W-cur.w;dir=-1}}
    cam+=(Math.max(0,B.length-7)-cam)*Math.min(1,dt*4);
    c.bgGrad('#14002e','#5a0f6b');
    stars.forEach(s=>{g.globalAlpha=.4+.4*Math.sin(t*2+s.p);c.rect(s.x*c.W,s.y*c.H,2,2,'#fff')});g.globalAlpha=1;
    const sy=c.H*.5+cam*7,sr=Math.min(c.W*.28,110);
    const gr=g.createLinearGradient(0,sy-sr,0,sy+sr);gr.addColorStop(0,'#ffe14d');gr.addColorStop(1,'#ff2e93');
    g.save();g.beginPath();g.arc(c.W/2,sy,sr,0,6.2832);g.clip();g.fillStyle=gr;g.fillRect(0,sy-sr,c.W,sr*2);
    for(let i=0;i<7;i++){g.fillStyle='#4a0a5e';g.fillRect(0,sy+i*sr/4-4+((t*8)%(sr/4)),c.W,2+i*1.6)}g.restore();
    g.strokeStyle='rgba(255,46,147,.35)';g.lineWidth=1;
    for(let i=-6;i<=6;i++){g.beginPath();g.moveTo(c.W/2+i*20,c.H*.7);g.lineTo(c.W/2+i*90,c.H);g.stroke()}
    for(let i=0;i<6;i++){const y=c.H*.7+Math.pow((i+(t*.6%1))/6,2)*c.H*.3;g.beginPath();g.moveTo(0,y);g.lineTo(c.W,y);g.stroke()}
    const draw=(x,y,w,cl)=>{g.shadowColor=cl;g.shadowBlur=14;c.rect(x,y,w,BH-3,cl,4);g.shadowBlur=0;c.rect(x,y,w,5,'rgba(255,255,255,.55)',3)};
    for(let i=0;i<B.length;i++){const y=yOf(i);if(y>-BH&&y<c.H)draw(B[i].x,y,B[i].w,col(i))}
    if(cur)draw(cur.x,yOf(B.length),cur.w,col(B.length));
    for(let i=deb.length-1;i>=0;i--){const d=deb[i];d.vy+=1100*dt;d.y+=d.vy*dt;g.globalAlpha=Math.max(0,1-d.y/400);draw(d.x,yOf(d.lv)+d.y,d.w,d.col);g.globalAlpha=1;if(d.y>500)deb.splice(i,1)}
  });
}});

// ============ 2. LAVA RAIN ============
def({id:'lava',title:'LAVA RAIN',emoji:'🌋',tag:'volcán',hint:'👉 ARRASTRA ↔ para esquivar y coger gemas',
colors:['#1a0500','#6b1500','#ff6a00'],font:"'Bangers',Impact,sans-serif",
music:{bpm:140,root:40,scale:'phrygian',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'break',density:.5,vol:.13,len:1,oct:1},
create(c){
  const g=c.g;let px=c.W/2,tx=px,rocks=[],gems=[],rt=.5,gt=1.5,time=0,gemsN=0,sx=0;
  const embers=[];for(let i=0;i<30;i++)embers.push({x:Math.random(),y:Math.random(),s:.2+Math.random()*.6});
  c.down(p=>{sx=p.x;c._px0=px});
  c.move(p=>{tx=c.clamp(c._px0+(p.x-sx)*1.15,20,c.W-20)});
  const py=()=>c.B-26;
  c.loop((dt,t)=>{
    if(!c.dead){
      time+=dt;px+=(tx-px)*Math.min(1,dt*16);
      rt-=dt;if(rt<=0){rt=Math.max(.2,.75-time*.008);const r=c.R(12,28)+Math.min(time*.2,10);rocks.push({x:c.R(20,c.W-20),y:c.T-30,r,v:c.R(230,320)+time*3,rot:0})}
      gt-=dt;if(gt<=0){gt=c.R(1.2,2.2);gems.push({x:c.R(30,c.W-30),y:c.T-20,v:200})}
      for(const r of rocks){r.y+=r.v*dt;r.rot+=dt*3;if(Math.hypot(r.x-px,r.y-py())<r.r+14){c.sfx('hit');c.shake(14);c.vib(80);c.burst(px,py(),'#ff6a00',30,320);c.over();break}}
      for(let i=gems.length-1;i>=0;i--){const m=gems[i];m.y+=m.v*dt;if(Math.hypot(m.x-px,m.y-py())<26){gems.splice(i,1);gemsN++;c.sfx('coin');c.burst(m.x,m.y,'#5ff',10);c.float('+5',m.x,m.y)}else if(m.y>c.H)gems.splice(i,1)}
      rocks=rocks.filter(r=>r.y<c.H+40);
      c.setScore(Math.floor(time)+gemsN*5);
      if(time>6&&time<6.1)c.say('¡Las gemas dan +5!');
    }
    c.bgGrad('#1a0500','#7a1d00');
    const vg=g.createRadialGradient(c.W/2,c.B,10,c.W/2,c.B,c.W);vg.addColorStop(0,'rgba(255,106,0,.55)');vg.addColorStop(1,'rgba(255,106,0,0)');g.fillStyle=vg;g.fillRect(0,0,c.W,c.H);
    g.fillStyle='#2b0a02';g.beginPath();g.moveTo(0,c.B-10);g.lineTo(c.W*.25,c.T+c.PH*.5);g.lineTo(c.W*.42,c.T+c.PH*.45);g.lineTo(c.W*.5,c.T+c.PH*.52);g.lineTo(c.W*.58,c.T+c.PH*.45);g.lineTo(c.W*.78,c.T+c.PH*.55);g.lineTo(c.W,c.B-10);g.fill();
    embers.forEach(e=>{const y=((e.y-t*.05*e.s)%1+1)%1;c.circle(e.x*c.W+Math.sin(t+e.y*9)*10,y*c.H,1.5+e.s*2,'rgba(255,170,60,'+(.3+e.s)+')')});
    const lava=g.createLinearGradient(0,c.B,0,c.H);lava.addColorStop(0,'#ff9a00');lava.addColorStop(1,'#c21b00');g.fillStyle=lava;g.fillRect(0,c.B+4,c.W,c.H);
    g.fillStyle='#3a1308';g.fillRect(0,c.B-2,c.W,8);
    for(const m of gems){g.save();g.translate(m.x,m.y);g.rotate(t*3);g.shadowColor='#5ff';g.shadowBlur=14;c.rect(-9,-9,18,18,'#5ff',3);g.restore()}
    for(const r of rocks){g.save();g.translate(r.x,r.y);g.shadowColor='#ff6a00';g.shadowBlur=20;c.circle(0,-r.r*1.3,r.r*.6,'rgba(255,120,0,.4)');g.rotate(r.rot);c.circle(0,0,r.r,'#3b1b10');g.shadowBlur=0;c.circle(-r.r*.25,-r.r*.2,r.r*.35,'#ff6a00');g.restore()}
    if(!c.dead){c.circle(px,py()+6,15,'#ffcf8a');c.rect(px-16,py()-12,32,10,'#ffd60a',5);c.circle(px-5,py()+3,2.5,'#000');c.circle(px+5,py()+3,2.5,'#000')}
  });
}});

// ============ 3. ORBITA ============
def({id:'orbit',title:'ORBITA',emoji:'🪐',tag:'espacio',hint:'👆 TOCA para cambiar de órbita',
colors:['#02031a','#1b0f4d','#7df9ff'],font:"'Orbitron',sans-serif",
music:{bpm:84,root:50,scale:'lydian',lead:'sine',bassw:'sine',bass:'root',drums:'none',density:.4,vol:.14,len:3,oct:1,arp:true,pad:true},
create(c){
  const g=c.g,cx=c.W/2,cy=(c.T+c.B)/2,R1=Math.min(c.W*.25,100),R2=Math.min(c.W*.42,165);
  let ring=0,rad=R1,ang=-Math.PI/2,spd=1.5,items=[],trail=[],sp=.6,time=0,scr=0;
  const stars=[];for(let i=0;i<60;i++)stars.push({x:Math.random(),y:Math.random(),s:Math.random()});
  const wrap=a=>{a%=6.2832;if(a>3.1416)a-=6.2832;if(a<-3.1416)a+=6.2832;return a};
  c.down(()=>{if(c.dead)return;ring=1-ring;c.sfx('jump',1+ring*.3);if(scr===0&&time>3)scr=1});
  function spawn(){
    const rk=Math.random()<Math.min(.7,.35+scr*.02);const rg=Math.random()<.5?0:1;
    items.push({a:ang+c.R(1.7,4.4),ring:rg,rock:rk,life:14,w:c.R(-.7,-.3),sd:c.R(0,9),r:rk?c.R(11,16):9});
  }
  c.loop((dt,t)=>{
    if(!c.dead){
      time+=dt;spd=Math.min(3.2,1.5+scr*.025);ang+=spd*dt;rad+=((ring?R2:R1)-rad)*Math.min(1,dt*10);
      sp-=dt;if(sp<=0){sp=Math.max(.35,.9-scr*.015);spawn()}
      const sx=cx+Math.cos(ang)*rad,sy=cy+Math.sin(ang)*rad;trail.push({x:sx,y:sy});if(trail.length>26)trail.shift();
      for(let i=items.length-1;i>=0;i--){
        const it=items[i];it.life-=dt;if(it.rock)it.a+=it.w*dt*.6;
        const ir=it.ring?R2:R1,ix=cx+Math.cos(it.a)*ir,iy=cy+Math.sin(it.a)*ir;
        if(Math.hypot(ix-sx,iy-sy)<it.r+11){
          if(it.rock){c.sfx('hit');c.shake(12);c.burst(sx,sy,'#7df9ff',26,300);c.vib(80);c.over();break}
          items.splice(i,1);scr++;c.setScore(scr);c.sfx('coin',1+scr*.02);c.burst(ix,iy,'#ffe14d',10);if(scr===1)c.say('¡Evita las rocas!');
        }else if(it.life<0)items.splice(i,1);
      }
    }
    c.bgGrad('#02031a','#1b0f4d');
    stars.forEach(s=>{g.globalAlpha=.3+.6*Math.abs(Math.sin(t*s.s+s.x*9));c.circle(s.x*c.W,s.y*c.H,s.s*1.6,'#fff')});g.globalAlpha=1;
    g.strokeStyle='rgba(125,249,255,.25)';g.lineWidth=2;g.setLineDash([6,8]);
    [R1,R2].forEach(r=>{g.beginPath();g.arc(cx,cy,r,0,6.2832);g.stroke()});g.setLineDash([]);
    const pg=g.createRadialGradient(cx-14,cy-14,4,cx,cy,44);pg.addColorStop(0,'#ffb86b');pg.addColorStop(1,'#a3237a');
    g.fillStyle=pg;g.shadowColor='#ff6ad5';g.shadowBlur=30;g.beginPath();g.arc(cx,cy,42,0,6.2832);g.fill();g.shadowBlur=0;
    g.strokeStyle='rgba(255,220,255,.5)';g.lineWidth=3;g.beginPath();g.ellipse(cx,cy,64,16,-.3,0,6.2832);g.stroke();
    for(const it of items){
      const ir=it.ring?R2:R1,ix=cx+Math.cos(it.a)*ir,iy=cy+Math.sin(it.a)*ir;
      if(it.rock){g.save();g.translate(ix,iy);g.rotate(t+it.sd);g.fillStyle='#8a8fa8';g.shadowColor='#f55';g.shadowBlur=10;g.beginPath();for(let k=0;k<8;k++){const rr=it.r*(k%2?.7:1.05);g.lineTo(Math.cos(k*.785)*rr,Math.sin(k*.785)*rr)}g.closePath();g.fill();g.restore()}
      else{g.shadowColor='#ffe14d';g.shadowBlur=14;c.emoji('⭐',ix,iy,22,Math.sin(t*3+it.sd)*.3);g.shadowBlur=0}
    }
    trail.forEach((p,i)=>{g.globalAlpha=i/trail.length*.6;c.circle(p.x,p.y,2+i*.15,'#7df9ff')});g.globalAlpha=1;
    if(!c.dead){const sx=cx+Math.cos(ang)*rad,sy=cy+Math.sin(ang)*rad;g.save();g.translate(sx,sy);g.rotate(ang+1.5708);g.shadowColor='#7df9ff';g.shadowBlur=16;g.fillStyle='#fff';g.beginPath();g.moveTo(0,-13);g.lineTo(9,10);g.lineTo(0,5);g.lineTo(-9,10);g.closePath();g.fill();g.restore()}
  });
}});

// ============ 4. HATCH! ============
def({id:'egg',title:'¡ECLOSIÓN!',emoji:'🥚',tag:'kawaii',hint:'👆 TOCA rápido para dar calor al huevo',
colors:['#ffd6ec','#c9f0ff','#ff6fb5'],font:"'Fredoka',sans-serif",
music:{bpm:128,root:60,scale:'major',lead:'triangle',bassw:'sine',bass:'walk',drums:'hats',density:.65,vol:.15,len:1,oct:0},
create(c){
  const g=c.g,ZOO=[['🐣','¡Pollito!'],['🐲','¡Dragoncito!'],['🦖','¡Dino!'],['🐢','¡Tortuga!'],['🐊','¡Cocodrilo!'],['🦎','¡Lagarto!'],['🦕','¡Diplodocus!'],['🐧','¡Pingüino!'],['🦆','¡Patito!'],['🦜','¡Loro!'],['🦅','¡Águila!'],['🐍','¡Serpiente!']];
  let warm=1,taps=0,need=8,lvl=0,sq=0,wob=0,baby=null,bt=0,hue=330;
  const spark=[];for(let i=0;i<24;i++)spark.push({x:Math.random(),y:Math.random(),p:Math.random()*6});
  c.down(()=>{
    if(c.dead||baby)return;
    taps++;warm=Math.min(1,warm+.11);sq=1;wob=(Math.random()-.5)*.5;c.sfx('tap',.8+taps/need*.8);c.vib(8);
    const ex=c.W/2,ey=(c.T+c.B)/2+20;c.burst(ex+c.R(-30,30),ey+c.R(-40,20),'hsl('+hue+',80%,85%)',4,140);
    if(lvl===0&&taps===3)c.say('¡Sigue o se enfría!');
    if(taps>=need){
      const a=c.pick(ZOO);baby={e:a[0],n:a[1]};bt=0;lvl++;c.setScore(lvl);c.sfx('win');c.burst(ex,ey,'#fff',30,380);c.burst(ex,ey,'#ffd60a',20,300);c.shake(6);
    }
  });
  c.loop((dt,t)=>{
    const ex=c.W/2,ey=(c.T+c.B)/2+20;
    if(!c.dead){
      if(baby){bt+=dt;warm=Math.max(warm,.7);if(bt>1.1){baby=null;taps=0;need=Math.min(8+lvl*2,26);hue=(hue+47)%360}}
      else{warm-=dt*(.2+lvl*.025);if(warm<=0){warm=0;c.sfx('lose');c.over('¡Se enfrió!')}}
    }
    sq*=Math.pow(.0005,dt);wob*=Math.pow(.02,dt);
    c.bgGrad('#ffd6ec','#c9f0ff');
    spark.forEach(s=>{g.globalAlpha=.3+.5*Math.sin(t*2+s.p);c.emoji('✨',s.x*c.W,s.y*c.H,14)});g.globalAlpha=1;
    // termómetro
    const bx=24,bw=c.W-48,by=c.T+44;
    c.rect(bx,by,bw,14,'rgba(255,255,255,.7)',7);
    c.rect(bx,by,bw*warm,14,warm>.35?'#ff7a45':'#4aa8ff',7);
    c.txt(warm>.35?'🔥':'🥶',bx+bw*warm,by+7,22);
    if(baby){
      const k=Math.min(1,bt*3),s=60+k*70+Math.sin(bt*14)*8;
      c.emoji(baby.e,ex,ey-bt*20-Math.abs(Math.sin(bt*9))*40,s);
      c.txt(baby.n,ex,ey+110,36,'#fff','center','#ff6fb5');
    }else{
      g.save();g.translate(ex,ey+90);g.scale(1+sq*.12,1-sq*.12);g.translate(0,-90);g.rotate(wob+Math.sin(t*(warm<.3?30:3))*(warm<.3?.03:.02));
      const w=62+Math.min(need,16)*.4,h=w*1.3;
      g.shadowColor='rgba(0,0,0,.2)';g.shadowBlur=20;
      const eg=g.createRadialGradient(-w*.3,-h*.4,5,0,0,h);eg.addColorStop(0,'hsl('+hue+',90%,96%)');eg.addColorStop(1,'hsl('+hue+',80%,72%)');
      g.fillStyle=eg;g.beginPath();g.ellipse(0,0,w,h,0,0,6.2832);g.fill();g.shadowBlur=0;
      for(let i=0;i<6;i++)c.circle(Math.cos(i*2.1)*w*.55,Math.sin(i*3.7)*h*.55,6+i%3*3,'hsla('+(hue+40)+',90%,70%,.5)');
      const cr=Math.floor(taps/need*6);g.strokeStyle='#5a3a4a';g.lineWidth=3;g.lineCap='round';g.beginPath();
      for(let i=0;i<cr;i++){const a=i*1.05+.3,x0=Math.cos(a)*w*.2,y0=Math.sin(a)*h*.2;g.moveTo(x0,y0);g.lineTo(Math.cos(a)*w*.55,Math.sin(a)*h*.55+8);g.lineTo(Math.cos(a)*w*.9,Math.sin(a)*h*.9-4)}
      g.stroke();g.restore();
    }
  });
}});

// ============ 5. GRAVITY BOT ============
def({id:'gravity',title:'GRAVITY BOT',emoji:'🤖',tag:'fábrica',hint:'👆 TOCA para invertir la gravedad',
colors:['#1b1f27','#3a2a1a','#ff9f1c'],font:"'Black Ops One',Impact,sans-serif",
music:{bpm:130,root:38,scale:'minor',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'four',density:.5,vol:.13,len:1,oct:2},
create(c){
  const g=c.g;let y,vy=0,gd=1,sp=250,dist=0,obs=[],nx,coins=[],flip=0;
  const SZ=30,bx=()=>c.W*.25,top=()=>c.T+24,bot=()=>c.B-14;
  y=bot()-SZ;nx=c.W+200;
  const pipes=[];for(let i=0;i<8;i++)pipes.push({x:Math.random()*c.W,w:20+Math.random()*30,y:Math.random()});
  c.down(()=>{if(c.dead)return;gd=-gd;flip=.2;c.sfx('jump',gd>0?.8:1.1);if(dist<30)c.say('¡Esquiva los pinchos!')});
  function spawn(){
    const side=Math.random()<.5?'f':'c',w=c.RI(1,3)*26,h=34;
    obs.push({x:nx,w,side,h});
    if(Math.random()<.5)coins.push({x:nx+w/2,y:side==='f'?top()+50:bot()-50,got:false});
    nx+=w+sp*c.R(.85,1.3)+120;
  }
  c.loop((dt,t)=>{
    if(!c.dead){
      sp=Math.min(250+dist*.06,430);dist+=sp*dt;nx-=sp*dt;
      while(nx<c.W+300)spawn();
      obs.forEach(o=>o.x-=sp*dt);coins.forEach(m=>m.x-=sp*dt);
      obs=obs.filter(o=>o.x+o.w>-20);coins=coins.filter(m=>m.x>-20&&!m.got);
      vy+=gd*2400*dt;y+=vy*dt;
      if(y>bot()-SZ){y=bot()-SZ;vy=0}if(y<top()){y=top();vy=0}
      c.setScore(Math.floor(dist/40));
      for(const o of obs){
        const oy=o.side==='f'?bot()-o.h+6:top(),by=o.side==='f'?bot()-o.h:top()+0;
        if(bx()+SZ-5>o.x+4&&bx()+5<o.x+o.w-4&&y+SZ-4>(o.side==='f'?bot()-o.h+8:top())&&y+4<(o.side==='f'?bot():top()+o.h-8)){c.sfx('hit');c.shake(14);c.vib(80);c.burst(bx()+15,y+15,'#ff9f1c',30,320);c.over();break}
      }
      for(const m of coins)if(Math.abs(m.x-bx()-15)<24&&Math.abs(m.y-y-15)<26){m.got=true;dist+=200;c.sfx('coin');c.float('+5',m.x,m.y);c.burst(m.x,m.y,'#ffd60a',8)}
    }
    flip=Math.max(0,flip-dt);
    c.bgGrad('#14171d','#2d2118');
    pipes.forEach(p=>{const x=((p.x-dist*.3)%(c.W+60)+c.W+60)%(c.W+60)-30;c.rect(x,c.T,p.w,c.H,'rgba(255,255,255,.04)');c.rect(x-4,c.T+p.y*c.PH,p.w+8,10,'rgba(255,159,28,.15)')});
    for(let i=0;i<5;i++){const x=((i*140-dist*.5)%(c.W+140)+c.W+140)%(c.W+140)-70,yy=c.T+c.PH*(.3+.4*((i*37)%10)/10);g.save();g.translate(x,yy);g.rotate(dist*.004*(i%2?1:-1));g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=8;g.beginPath();g.arc(0,0,34,0,6.2832);g.stroke();g.setLineDash([10,8]);g.beginPath();g.arc(0,0,48,0,6.2832);g.stroke();g.restore()}
    const hz=(yy,hh)=>{g.fillStyle='#ff9f1c';g.fillRect(0,yy,c.W,hh);g.fillStyle='#111';for(let x=-20+((dist*.5)%40);x<c.W;x+=40){g.beginPath();g.moveTo(x,yy);g.lineTo(x+20,yy);g.lineTo(x+10,yy+hh);g.lineTo(x-10,yy+hh);g.fill()}};
    hz(bot(),14);hz(top()-14,14);
    for(const o of obs){
      g.fillStyle='#d9dde4';g.shadowColor='#ff3b30';g.shadowBlur=8;
      for(let x=o.x;x<o.x+o.w-1;x+=26){g.beginPath();if(o.side==='f'){g.moveTo(x,bot());g.lineTo(x+13,bot()-o.h);g.lineTo(x+26,bot())}else{g.moveTo(x,top());g.lineTo(x+13,top()+o.h);g.lineTo(x+26,top())}g.fill()}
      g.shadowBlur=0;
    }
    for(const m of coins){c.glow('#ffd60a',12);c.circle(m.x,m.y,9,'#ffd60a');c.noglow();c.circle(m.x,m.y,5,'#ff9f1c')}
    if(!c.dead){
      g.save();g.translate(bx()+15,y+15);if(gd<0)g.scale(1,-1);g.scale(1+flip,1-flip);
      c.glow('#ff9f1c',14);c.rect(-15,-15,30,30,'#ff9f1c',7);c.noglow();c.rect(-10,-9,20,12,'#1b1f27',4);c.circle(-4,-3,3,'#7df9ff');c.circle(5,-3,3,'#7df9ff');
      c.rect(-3,-22,6,8,'#d9dde4');c.circle(0,-24,3,'#ff3b30');g.restore();
    }
  });
}});
