// ============ 6. DISCO BEAT ============
def({id:'disco',title:'DISCO BEAT',emoji:'🪩',tag:'ritmo',hint:'👆 TOCA la columna cuando la nota llegue a la línea',
colors:['#1a0033','#5b0b86','#ff5de0'],font:"'Righteous',sans-serif",
music:{bpm:120,root:45,scale:'dorian',lead:'square',bassw:'sawtooth',bass:'walk',drums:'four',density:.3,vol:.12,len:1,oct:2},
create(c){
  const g=c.g,LC=['#ff5de0','#5dfcff','#ffe14d'],PENT=[0,2,4,7,9,12];
  let notes=[],nt=.5,lives=3,combo=0,pulse=0,hits=0,t0=0;
  const lw=()=>Math.min(c.W/3,125),lx=i=>c.W/2+(i-1)*lw(),line=()=>c.B-70,V=360;
  c.down(p=>{
    if(c.dead)return;
    const ln=c.clamp(Math.floor((p.x-(c.W/2-lw()*1.5))/lw()),0,2);pulse=1;
    let best=null;for(const n of notes)if(n.l===ln&&!n.hit&&Math.abs(n.y-line())<62&&(!best||Math.abs(n.y-line())<Math.abs(best.y-line())))best=n;
    if(!best){c.sfx('bump',.6);return}
    const d=Math.abs(best.y-line());best.hit=true;hits++;combo++;
    const pts=d<20?2:1;c.setScore(c.sc+pts);c.sfx('note',60+c.pick(PENT)+ln*0);c.burst(lx(ln),line(),LC[ln],14);
    c.float(d<20?'PERFECT':'BIEN',lx(ln),line()-34,LC[ln]);
    if(hits===6)c.say('¡Mantén el ritmo!');
  });
  const miss=()=>{lives--;combo=0;c.sfx('hit');c.shake(8);c.vib(40);if(lives<=0){c.sfx('lose');c.over()}};
  c.loop((dt,t)=>{
    t0+=dt;pulse=Math.max(0,pulse-dt*4);
    if(!c.dead){
      nt-=dt;if(nt<=0){nt+=.25;if(Math.random()<Math.min(.7,.35+hits*.008)&&(hits>0||t0>1.2))notes.push({l:c.RI(0,2),y:c.T-20,hit:false})}
      const v=V+Math.min(hits*2,140);
      for(const n of notes){n.y+=v*dt;if(!n.hit&&n.y>line()+64){n.hit=true;n.miss=true;miss()}}
      notes=notes.filter(n=>n.y<c.H+30&&!(n.hit&&!n.miss&&n.y>line()+400));
    }
    const b=(Math.floor(t*2)%2);
    c.bgGrad('#12002a','#4b0a73');
    for(let i=0;i<3;i++){g.fillStyle=LC[i];g.globalAlpha=.07+pulse*.05*(i===1?1:.5);g.fillRect(lx(i)-lw()/2,c.T,lw(),c.H)}g.globalAlpha=1;
    // bola disco
    const bx=c.W/2,by=c.T+30,br=36;g.strokeStyle='rgba(255,255,255,.4)';g.beginPath();g.moveTo(bx,0);g.lineTo(bx,by-br);g.stroke();
    g.save();g.beginPath();g.arc(bx,by,br,0,6.2832);g.clip();const bg=g.createRadialGradient(bx-10,by-10,4,bx,by,br);bg.addColorStop(0,'#fff');bg.addColorStop(1,'#8a8aa8');g.fillStyle=bg;g.fillRect(bx-br,by-br,br*2,br*2);
    for(let i=0;i<7;i++)for(let j=0;j<7;j++){const on=Math.sin(t*3+i*1.7+j*2.3)>.6;if(on)c.rect(bx-br+i*11,by-br+j*11,10,10,'rgba(255,93,224,.8)')}g.restore();
    g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=2;for(let i=0;i<=3;i++){const x=c.W/2+(i-1.5)*lw();g.beginPath();g.moveTo(x,c.T+80);g.lineTo(x,c.B);g.stroke()}
    for(let i=0;i<3;i++){g.shadowColor=LC[i];g.shadowBlur=12+pulse*20;g.strokeStyle=LC[i];g.lineWidth=4;g.beginPath();g.arc(lx(i),line(),24,0,6.2832);g.stroke();g.shadowBlur=0}
    for(const n of notes){if(n.hit&&!n.miss)continue;g.globalAlpha=n.miss?.3:1;g.shadowColor=LC[n.l];g.shadowBlur=16;c.circle(lx(n.l),n.y,19,LC[n.l]);g.shadowBlur=0;c.circle(lx(n.l),n.y,9,'#fff');g.globalAlpha=1}
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#ff5d8f');
    if(combo>2)c.txt('x'+combo,c.W/2,c.B-130,34,'#fff','center','rgba(0,0,0,.4)');
  });
}});

// ============ 7. GLOW WORM ============
def({id:'worm',title:'GLOW WORM',emoji:'🪱',tag:'abismo',hint:'👆 MANTÉN izquierda o derecha para girar',
colors:['#00061a','#00203f','#00ffd5'],font:"'Audiowide',sans-serif",
music:{bpm:78,root:52,scale:'dorian',lead:'sine',bassw:'sine',bass:'root',drums:'tick',density:.5,vol:.13,len:3,oct:1,arp:true,pad:true},
create(c){
  const g=c.g;let x=c.W/2,y=(c.T+c.B)/2,a=-1.57,trail=[],len=34,eaten=0,food=[],bub=[];
  for(let i=0;i<3;i++)food.push(null);
  const rnd=()=>({x:c.R(24,c.W-24),y:c.R(c.T+20,c.B-20),p:Math.random()*6});
  for(let i=0;i<3;i++)food[i]=rnd();
  for(let i=0;i<25;i++)bub.push({x:Math.random(),y:Math.random(),s:.3+Math.random()});
  c.loop((dt,t)=>{
    if(!c.dead){
      let turn=0;for(const k in c.ptr){turn+=c.ptr[k].x<c.W/2?-1:1}
      a+=Math.sign(turn)*3.4*dt;const sp=105+Math.min(eaten*2.5,70);
      x+=Math.cos(a)*sp*dt;y+=Math.sin(a)*sp*dt;
      if(x<0)x=c.W;if(x>c.W)x=0;if(y<c.T)y=c.B;if(y>c.B)y=c.T;
      const l=trail[trail.length-1];if(!l||Math.hypot(l.x-x,l.y-y)>4)trail.push({x,y});while(trail.length>len)trail.shift();
      for(let i=0;i<trail.length-26;i++)if(Math.hypot(trail[i].x-x,trail[i].y-y)<6.5){c.sfx('hit');c.shake(10);c.burst(x,y,'#00ffd5',24);c.over('¡Te mordiste!');break}
      for(let i=0;i<food.length;i++)if(Math.hypot(food[i].x-x,food[i].y-y)<16){c.burst(food[i].x,food[i].y,'#ff5de0',8);food[i]=rnd();eaten++;len+=9;c.setScore(eaten);c.sfx('pop',1+eaten*.02);if(eaten===3)c.say('¡Cuidado con tu cola!')}
    }
    c.bgGrad('#00061a','#003a5c');
    bub.forEach(b=>{const yy=((b.y-t*.03*b.s)%1+1)%1;c.circle(b.x*c.W+Math.sin(t+b.y*8)*8,yy*c.H,2+b.s*3,'rgba(120,220,255,.18)')});
    for(const f of food){g.shadowColor='#ff5de0';g.shadowBlur=18;c.circle(f.x,f.y,6+Math.sin(t*4+f.p)*1.5,'#ff9ae9');g.shadowBlur=0;c.circle(f.x,f.y,3,'#fff')}
    for(let i=0;i<trail.length;i++){const k=i/trail.length,p=trail[i];if(i%3===0){g.shadowColor='#00ffd5';g.shadowBlur=10}else g.shadowBlur=0;c.circle(p.x,p.y,3+k*5,'hsl('+(170+(1-k)*110)+',100%,'+(45+k*20)+'%)')}
    g.shadowBlur=0;
    if(!c.dead){c.circle(x,y,9,'#c8fff4');c.circle(x+Math.cos(a-.6)*5,y+Math.sin(a-.6)*5,2.5,'#000');c.circle(x+Math.cos(a+.6)*5,y+Math.sin(a+.6)*5,2.5,'#000')}
  });
}});

// ============ 8. SUSHI ORDER ============
def({id:'sushi',title:'SUSHI ORDER',emoji:'🍣',tag:'tokio',hint:'👆 TOCA el plato que pide el cliente',
colors:['#2a0a0a','#8c1020','#ffd166'],font:"'Dela Gothic One',sans-serif",
music:{bpm:108,root:57,scale:'hira',lead:'triangle',bassw:'sine',bass:'off',drums:'tick',density:.45,vol:.17,len:.9,oct:1},
create(c){
  const g=c.g,TYPES=['🍣','🍙','🍤','🍡','🥟','🍥','🍘','🍱'];
  let lives=3,want,limit=6,tl=6,items=[],flash=0,flashC='#0f0';
  const ys=()=>[c.T+c.PH*.46,c.T+c.PH*.66,c.T+c.PH*.86];
  const nextType=()=>(want&&!items.some(i=>i.t===want))?want:c.pick(TYPES);
  want=c.pick(TYPES);
  for(let b=0;b<3;b++)for(let k=0;k<4;k++)items.push({b,x:(k+Math.random()*.5)*c.W/3.4,t:TYPES[(b*4+k+c.RI(0,3))%8]});
  if(!items.some(i=>i.t===want))items[0].t=want;
  const order=()=>{want=c.pick(items).t;tl=limit=Math.max(2.4,6-c.sc*.18)};
  order();
  const lose=()=>{lives--;c.sfx('hit');c.shake(8);c.vib(40);flash=.3;flashC='#f33';if(lives<=0){c.sfx('lose');c.over()}else order()};
  c.down(p=>{
    if(c.dead)return;const Y=ys();
    for(const it of items){const x=it.x,y=Y[it.b];if(Math.hypot(p.x-x,p.y-y)<36){
      if(it.t===want){c.setScore(c.sc+1);c.sfx('coin',1+c.sc*.02);c.burst(x,y,'#ffd166',14);c.float('+1',x,y-30,'#ffd166');flash=.15;flashC='#4f4';it.t=nextType();order();if(c.sc===5)c.say('¡Más rápido!')}
      else lose();
      return}}
  });
  c.loop((dt,t)=>{
    const Y=ys();
    if(!c.dead){
      tl-=dt;if(tl<=0)lose();
      for(const it of items){const d=it.b%2?-1:1;it.x+=d*(55+Math.min(c.sc*3,70))*dt;if(it.x>c.W+40){it.x=-40;it.t=nextType()}if(it.x<-40){it.x=c.W+40;it.t=nextType()}}
    }
    flash=Math.max(0,flash-dt);
    c.bgGrad('#2a0a0a','#5c0a14');
    for(let i=0;i<5;i++)c.rect(i*c.W/5,0,2,c.H,'rgba(0,0,0,.18)');
    for(let i=0;i<3;i++){c.glow('#ffd166',14);c.circle(40+i*(c.W-80)/2,c.T+8,18,'#d62828');c.noglow();c.rect(40+i*(c.W-80)/2-4,c.T-18,8,12,'#222')}
    // pedido
    const bx=c.W/2,by=c.T+c.PH*.17;
    c.rect(bx-110,by-60,220,120,'rgba(255,255,255,.95)',26);g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.moveTo(bx-14,by+58);g.lineTo(bx,by+78);g.lineTo(bx+14,by+58);g.fill();
    c.txt('QUIERO…',bx,by-38,16,'#8c1020');c.emoji(want,bx,by+8,62);
    c.rect(bx-90,by+44,180,8,'#ddd',4);c.rect(bx-90,by+44,180*Math.max(0,tl/limit),8,tl/limit>.35?'#2a9d8f':'#e63946',4);
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#ffd166');
    for(let b=0;b<3;b++){
      const y=Y[b];c.rect(0,y-34,c.W,68,'#1b1b1f');c.rect(0,y-34,c.W,5,'#555');c.rect(0,y+29,c.W,5,'#555');
      g.fillStyle='rgba(255,255,255,.07)';const off=((t*60*(b%2?-1:1))%40+40)%40;for(let x=-40+off;x<c.W;x+=40)g.fillRect(x,y-28,14,56);
    }
    for(const it of items){const y=Y[it.b];g.fillStyle='#fff';g.beginPath();g.ellipse(it.x,y+10,30,12,0,0,6.2832);g.fill();c.emoji(it.t,it.x,y-2,40)}
    if(flash>0){g.globalAlpha=flash*.8;g.fillStyle=flashC;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 9. CLOUD HOPPER ============
def({id:'cloud',title:'CLOUD HOPPER',emoji:'☁️',tag:'cielo',hint:'👉 ARRASTRA ↔ para mover al saltarín',
colors:['#6ec6ff','#ffd1f0','#ff7ac8'],font:"'Baloo 2',sans-serif",
music:{bpm:100,root:64,scale:'pent',lead:'sine',bassw:'sine',bass:'off',drums:'none',density:.5,vol:.13,len:2,oct:0,arp:true,pad:true},
create(c){
  const g=c.g;let px=c.W/2,py=c.B-60,vy=-700,tx=px,sx=0,px0=0,plats=[],top=c.B,climb=0,sq=0;
  const mk=(y,first)=>{const r=Math.random(),w=first?c.W:c.R(62,86);plats.push({x:first?0:c.R(0,c.W-w),y,w,type:first?'n':(climb>400&&r<.18?'m':(climb>250&&r<.3?'c':'n')),dir:Math.random()<.5?-1:1,spr:!first&&Math.random()<.08,gone:false})};
  mk(c.B-20,true);top=c.B-20;
  const fill=()=>{while(top>c.T-120){top-=c.R(62,70+Math.min(climb*.02,50));mk(top)}};fill();
  c.down(p=>{sx=p.x;px0=tx});c.move(p=>{tx=c.clamp(px0+(p.x-sx)*1.3,-10,c.W+10)});
  c.loop((dt,t)=>{
    if(!c.dead){
      px+=(tx-px)*Math.min(1,dt*14);if(px<-10)px+=c.W+20,tx+=c.W+20;if(px>c.W+10)px-=c.W+20,tx-=c.W+20;
      const pvy=vy;vy+=1500*dt;py+=vy*dt;sq=Math.max(0,sq-dt*4);
      if(py<c.H*.42){const d=c.H*.42-py;py=c.H*.42;plats.forEach(p=>p.y+=d);top+=d;climb+=d;c.setScore(Math.floor(climb/10))}
      for(const p of plats){
        if(p.type==='m'){p.x+=p.dir*60*dt;if(p.x<0||p.x+p.w>c.W)p.dir*=-1}
        if(p.gone)continue;
        if(vy>0&&py+16>p.y&&py+16-vy*dt<=p.y+4&&px>p.x-8&&px<p.x+p.w+8){vy=p.spr?-1150:-740;sq=1;c.sfx(p.spr?'jump':'bump',p.spr?1.4:1.2);if(p.type==='c')p.gone=true;if(p.spr)c.burst(px,py+16,'#ffd60a',12)}
      }
      plats=plats.filter(p=>p.y<c.H+40&&!p.gone);fill();
      if(py>c.H+30){c.sfx('lose');c.over()}
      if(climb>60&&climb<75)c.say('¡Sube sin parar!');
    }
    const h=Math.min(1,climb/6000);
    c.bgGrad('hsl('+(205+h*60)+',80%,'+(65-h*40)+'%)','hsl('+(320-h*80)+',90%,'+(85-h*50)+'%)');
    for(let i=0;i<4;i++){const x=((i*160+t*8*(1+i*.3))%(c.W+200))-100,y=((i*220+climb*.2*(1+i*.2))%c.H);g.globalAlpha=.35;c.circle(x,y,40,'#fff');c.circle(x+30,y+6,30,'#fff');c.circle(x-30,y+8,26,'#fff');g.globalAlpha=1}
    for(const p of plats){
      const col=p.type==='c'?'#e8d8ff':p.type==='m'?'#ffe9a8':'#fff';
      g.shadowColor='rgba(0,0,0,.15)';g.shadowBlur=8;c.rect(p.x,p.y,p.w,18,col,9);c.circle(p.x+16,p.y+4,11,col);c.circle(p.x+p.w-18,p.y+3,12,col);c.circle(p.x+p.w/2,p.y,13,col);g.shadowBlur=0;
      if(p.spr){c.rect(p.x+p.w/2-10,p.y-9,20,10,'#ffd60a',4);c.rect(p.x+p.w/2-6,p.y-14,12,6,'#ff7a00',3)}
    }
    if(!c.dead){g.save();g.translate(px,py);g.scale(1-sq*.12,1+sq*.18);c.circle(0,0,17,'#ff7ac8');c.circle(-6,-3,5,'#fff');c.circle(6,-3,5,'#fff');c.circle(-5,-3,2.2,'#222');c.circle(7,-3,2.2,'#222');g.strokeStyle='#222';g.lineWidth=2;g.beginPath();g.arc(0,4,5,.2,2.9);g.stroke();c.rect(-3,-22,6,8,'#ffd60a',3);g.restore()}
  });
}});

// ============ 10. MINI PINBALL ============
def({id:'pinball',title:'MINI PINBALL',emoji:'🕹️',tag:'arcade',hint:'👆 TOCA IZQ / DER para mover las palas',
colors:['#08001a','#1a0040','#00f0ff'],font:"'Press Start 2P',monospace",
music:{bpm:150,root:48,scale:'harm',lead:'square',bassw:'square',bass:'pulse',drums:'break',density:.7,vol:.11,len:1,oct:1},
create(c){
  const g=c.g,BR=9,L=60,TH=8;
  const fy=c.B-48,fxL=c.W/2-78,fxR=c.W/2+78;
  const F=[{px:fxL,py:fy,rest:.5,up:-.5,a:.5,w:0,dir:1},{px:fxR,py:fy,rest:Math.PI-.5,up:Math.PI+.5,a:Math.PI-.5,w:0,dir:-1}];
  const walls=[[10,c.T+6,10,fy-130],[c.W-10,c.T+6,c.W-10,fy-130],[10,c.T+6,c.W-10,c.T+6],[10,fy-130,fxL,fy],[c.W-10,fy-130,fxR,fy],[10,c.T+6,50,c.T+46],[c.W-10,c.T+6,c.W-50,c.T+46]];
  const bumpers=[{x:c.W*.3,y:c.T+c.PH*.27,r:24},{x:c.W*.7,y:c.T+c.PH*.27,r:24},{x:c.W*.5,y:c.T+c.PH*.43,r:24},{x:c.W*.2,y:c.T+c.PH*.52,r:13},{x:c.W*.8,y:c.T+c.PH*.52,r:13}];
  let ball=null,balls=3,wait=.5,lit=[0,0,0,0,0];
  const spawn=()=>{ball={x:c.R(c.W*.3,c.W*.7),y:c.T+20,vx:c.R(-120,120),vy:60}};
  function hitSeg(ax,ay,bx,by,rad,px,py,w,e){
    const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;let t=((ball.x-ax)*dx+(ball.y-ay)*dy)/l2;t=t<0?0:t>1?1:t;
    const qx=ax+t*dx,qy=ay+t*dy;let nx=ball.x-qx,ny=ball.y-qy;const d=Math.hypot(nx,ny);
    if(d>=rad+BR||d===0)return false;
    nx/=d;ny/=d;ball.x=qx+nx*(rad+BR);ball.y=qy+ny*(rad+BR);
    const sx=-w*(qy-py),sy=w*(qx-px);const vn=(ball.vx-sx)*nx+(ball.vy-sy)*ny;
    if(vn<0){ball.vx-=(1+e)*vn*nx;ball.vy-=(1+e)*vn*ny}
    return true;
  }
  c.loop((dt,t)=>{
    let l=false,r=false;for(const k in c.ptr){if(c.ptr[k].x<c.W/2)l=true;else r=true}
    F.forEach((f,i)=>{const tgt=(i?r:l)?f.up:f.rest,pa=f.a,s=16*dt;f.a+=c.clamp(tgt-f.a,-s,s);f.w=(f.a-pa)/dt});
    if(!c.dead){
      if(!ball){wait-=dt;if(wait<=0){wait=.9;if(balls>0)spawn()}}
      else{
        const N=4,h=dt/N;
        for(let s=0;s<N;s++){
          ball.vy+=900*h;ball.x+=ball.vx*h;ball.y+=ball.vy*h;
          const sp=Math.hypot(ball.vx,ball.vy);if(sp>950){ball.vx*=950/sp;ball.vy*=950/sp}
          for(const w of walls)hitSeg(w[0],w[1],w[2],w[3],2,0,0,0,.5);
          F.forEach(f=>{const bx=f.px+Math.cos(f.a)*L,by=f.py+Math.sin(f.a)*L;if(hitSeg(f.px,f.py,bx,by,TH,f.px,f.py,f.w,.45)&&Math.abs(f.w)>3)c.sfx('bump',1.3)});
          bumpers.forEach((b,i)=>{const dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy);if(d<b.r+BR&&d>0){const nx=dx/d,ny=dy/d;ball.x=b.x+nx*(b.r+BR);ball.y=b.y+ny*(b.r+BR);const vn=ball.vx*nx+ball.vy*ny;if(vn<0){ball.vx-=2*vn*nx;ball.vy-=2*vn*ny}ball.vx+=nx*260;ball.vy+=ny*260;lit[i]=.2;c.setScore(c.sc+1);c.sfx('coin',1+i*.12);c.burst(ball.x,ball.y,'#00f0ff',6,160);c.vib(10)}});
          if(ball.x<12)ball.x=12;if(ball.x>c.W-12)ball.x=c.W-12;
        }
        if(ball.y>c.B+50){ball=null;balls--;c.sfx('hit');if(balls<=0){c.sfx('lose');c.over()}}
      }
    }
    c.bgGrad('#08001a','#240055');
    g.strokeStyle='rgba(0,240,255,.07)';g.lineWidth=1;for(let x=0;x<c.W;x+=30){g.beginPath();g.moveTo(x,c.T);g.lineTo(x,c.H);g.stroke()}
    g.strokeStyle='#ff2e93';g.lineWidth=4;g.shadowColor='#ff2e93';g.shadowBlur=12;g.lineCap='round';
    walls.forEach(w=>{g.beginPath();g.moveTo(w[0],w[1]);g.lineTo(w[2],w[3]);g.stroke()});g.shadowBlur=0;
    bumpers.forEach((b,i)=>{lit[i]=Math.max(0,lit[i]-dt);const k=lit[i]>0;g.shadowColor='#00f0ff';g.shadowBlur=k?30:12;c.circle(b.x,b.y,b.r,k?'#fff':'#0a2a4a');g.strokeStyle='#00f0ff';g.lineWidth=4;g.beginPath();g.arc(b.x,b.y,b.r,0,6.2832);g.stroke();g.shadowBlur=0;c.circle(b.x,b.y,b.r*.4,k?'#00f0ff':'#ff2e93')});
    F.forEach(f=>{g.strokeStyle='#ffe14d';g.lineWidth=TH*2;g.lineCap='round';g.shadowColor='#ffe14d';g.shadowBlur=10;g.beginPath();g.moveTo(f.px,f.py);g.lineTo(f.px+Math.cos(f.a)*L,f.py+Math.sin(f.a)*L);g.stroke();g.shadowBlur=0});
    if(ball){g.shadowColor='#fff';g.shadowBlur=14;c.circle(ball.x,ball.y,BR,'#fff');g.shadowBlur=0}
    for(let i=0;i<3;i++)c.circle(c.W-24-i*22,c.T+22,7,i<balls?'#ffe14d':'rgba(255,255,255,.15)');
    c.txt('◀ IZQ',c.W*.25,c.B+14,10,'rgba(255,255,255,.3)');c.txt('DER ▶',c.W*.75,c.B+14,10,'rgba(255,255,255,.3)');
  });
}});
