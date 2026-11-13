// ============ 21. NUMBER DASH ============
def({id:'numbers',title:'NÚMEROS A TIZA',emoji:'🔢',tag:'pizarra',hint:'👆 TOCA los números en orden: 1, 2, 3…',
colors:['#10291f','#1d4d3a','#ffe66d'],font:"'Caveat Brush',cursive",
music:{bpm:124,root:55,scale:'major',lead:'triangle',bassw:'sine',bass:'walk',drums:'tick',density:.5,vol:.14,len:.8,oct:1},
create(c){
  const g=c.g,CH=['#ffe66d','#ff9fb2','#9be7ff','#b5f5a0','#ffc48a','#d6b3ff'];
  let N=4,nums=[],nxt=1,tl=0,tmax=0,lvl=0,pen=0;
  const r=()=>c.W<400?24:27;
  const board=()=>{
    nums=[];const R=r();
    for(let i=1;i<=N;i++){let tries=0,x,y;do{x=c.R(R+10,c.W-R-10);y=c.R(c.T+60,c.B-R-10);tries++}while(tries<200&&nums.some(n=>Math.hypot(n.x-x,n.y-y)<R*2.3));nums.push({n:i,x,y,c:CH[i%6],done:false,rot:c.R(-.3,.3)})}
    nxt=1;tmax=tl=2.6+N*1.05;
  };
  board();
  c.down(p=>{
    if(c.dead)return;
    for(const n of nums){if(!n.done&&Math.hypot(n.x-p.x,n.y-p.y)<r()+8){
      if(n.n===nxt){n.done=true;nxt++;c.setScore(c.sc+1);c.sfx('note',60+n.n*2%14+(n.n>7?5:0));c.burst(n.x,n.y,n.c,8,150);
        if(nxt>N){N=Math.min(N+1,16);lvl++;tl+=0;c.sfx('win');c.float('¡Tablero!',c.W/2,c.T+80,'#ffe66d');c.after(250,board);nxt=999}}
      else{pen=.3;c.sfx('bump',.5);c.shake(6);tl=Math.max(.1,tl-1)}
      return}}
  });
  c.loop((dt,t)=>{
    pen=Math.max(0,pen-dt);
    if(!c.dead&&nxt<900){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡Se acabó el tiempo!')}}
    c.bgGrad('#10291f','#1d4d3a');
    g.globalAlpha=.07;for(let i=0;i<40;i++)c.circle((i*97)%c.W,(i*53)%c.H,10+(i%5)*6,'#fff');g.globalAlpha=1;
    g.strokeStyle='#8b5a2b';g.lineWidth=10;g.strokeRect(5,c.T-4,c.W-10,c.H-c.T-70);
    c.rect(c.W*.1,c.T+34,c.W*.8,6,'rgba(255,255,255,.2)',3);c.rect(c.W*.1,c.T+34,c.W*.8*Math.max(0,tl/tmax),6,tl/tmax>.3?'#ffe66d':'#ff6b6b',3);
    for(const n of nums){
      if(n.done)continue;g.save();g.translate(n.x,n.y);g.rotate(n.rot);
      g.strokeStyle=n.c;g.lineWidth=4;g.beginPath();g.arc(0,0,r(),0,6.2832);g.stroke();
      if(lvl<2&&n.n===nxt){g.setLineDash([5,5]);g.beginPath();g.arc(0,0,r()+8,t*2,t*2+6.2832);g.stroke();g.setLineDash([])}
      c.txt(String(n.n),0,2,r()*1.15,n.c);g.restore();
    }
    if(pen>0){g.globalAlpha=pen;g.fillStyle='#f00';g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 22. ICE BREAKER ============
def({id:'ice',title:'ROMPEHIELO',emoji:'🧊',tag:'ártico',hint:'👉 ARRASTRA ↔ el trineo para rebotar la bola',
colors:['#021a3a','#0b4a7a','#9ff3ff'],font:"'Bowlby One',sans-serif",
music:{bpm:110,root:53,scale:'lydian',lead:'sine',bassw:'triangle',bass:'root',drums:'hats',density:.45,vol:.13,len:2,oct:1,pad:true},
create(c){
  const g=c.g;let px=c.W/2,tx=px,sx=0,px0=0,lives=3,level=0,bricks=[],ball={x:0,y:0,vx:0,vy:0,on:true},spd=340,hold=.8,pw=84;
  const snow=[];for(let i=0;i<40;i++)snow.push({x:Math.random(),y:Math.random(),s:Math.random()});
  const py=()=>c.B-26;
  const build=()=>{
    bricks=[];const cols=7,bw=(c.W-20)/cols,rows=Math.min(4+level,8),top=c.T+50;
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){if(level%3===1&&(k+r)%3===0)continue;bricks.push({x:10+k*bw,y:top+r*24,w:bw-3,h:20,hp:(r<Math.floor(level/2)+1&&level>0)?2:1})}
  };
  const reset=()=>{ball={x:px,y:py()-12,vx:0,vy:0,on:true};hold=.8};
  build();reset();
  c.down(p=>{sx=p.x;px0=tx;if(ball.on&&hold<.5)launch()});
  c.move(p=>{tx=c.clamp(px0+(p.x-sx)*1.2,pw/2,c.W-pw/2)});
  const launch=()=>{if(!ball.on)return;ball.on=false;const a=c.R(-.5,.5);ball.vx=Math.sin(a)*spd;ball.vy=-Math.cos(a)*spd};
  c.loop((dt,t)=>{
    px+=(tx-px)*Math.min(1,dt*18);
    if(!c.dead){
      if(ball.on){ball.x=px;ball.y=py()-12;hold-=dt;if(hold<=0)launch()}
      else{
        const N=3,h=dt/N;
        for(let s=0;s<N;s++){
          ball.x+=ball.vx*h;ball.y+=ball.vy*h;
          if(ball.x<8){ball.x=8;ball.vx=Math.abs(ball.vx)}if(ball.x>c.W-8){ball.x=c.W-8;ball.vx=-Math.abs(ball.vx)}
          if(ball.y<c.T+4){ball.y=c.T+4;ball.vy=Math.abs(ball.vy)}
          if(ball.vy>0&&ball.y>py()-14&&ball.y<py()+4&&Math.abs(ball.x-px)<pw/2+7){const o=c.clamp((ball.x-px)/(pw/2),-1,1),a=o*1.1;const sp=Math.hypot(ball.vx,ball.vy);ball.vx=Math.sin(a)*sp;ball.vy=-Math.cos(a)*sp;c.sfx('bump',1);}
          for(const b of bricks){
            if(b.hp<=0)continue;
            const nx=c.clamp(ball.x,b.x,b.x+b.w),ny=c.clamp(ball.y,b.y,b.y+b.h);
            if(Math.hypot(ball.x-nx,ball.y-ny)<7){
              const dx=Math.abs(ball.x-(b.x+b.w/2))/(b.w/2+7),dy=Math.abs(ball.y-(b.y+b.h/2))/(b.h/2+7);
              if(dx>dy)ball.vx*=-1;else ball.vy*=-1;
              b.hp--;if(b.hp<=0){c.setScore(c.sc+1);c.sfx('pop',1+c.RI(0,4)*.1);c.burst(b.x+b.w/2,b.y+b.h/2,'#cffaff',10,200);c.vib(8)}else c.sfx('tick');
              const sp=Math.hypot(ball.vx,ball.vy)*1.003;const k=Math.min(sp,640)/Math.hypot(ball.vx,ball.vy);ball.vx*=k;ball.vy*=k;
              break;
            }
          }
        }
        if(ball.y>c.B+30){lives--;c.sfx('hit');c.shake(8);if(lives<=0){c.sfx('lose');c.over()}else reset()}
        if(!bricks.some(b=>b.hp>0)){level++;spd=Math.min(340+level*25,520);c.sfx('win');c.say('¡Nivel '+(level+1)+'!');build();reset()}
      }
    }
    c.bgGrad('#021a3a','#0b4a7a');
    for(let i=0;i<3;i++){g.globalAlpha=.16;g.strokeStyle=['#5dffb0','#b06bff','#5dd7ff'][i];g.lineWidth=26;g.beginPath();for(let x=0;x<=c.W;x+=12){const y=c.T+70+i*36+Math.sin(x*.012+t*.6+i)*26;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}g.globalAlpha=1;
    snow.forEach(s=>{c.circle(((s.x*c.W+Math.sin(t+s.y*9)*14)+c.W)%c.W,((s.y+t*.04*(.5+s.s))%1)*c.H,1+s.s*2,'rgba(255,255,255,.7)')});
    for(const b of bricks){if(b.hp<=0)continue;c.rect(b.x,b.y,b.w,b.h,b.hp>1?'#5fb8e8':'#b8f1ff',5);c.rect(b.x+3,b.y+2,b.w-6,5,'rgba(255,255,255,.65)',3);if(b.hp>1){g.strokeStyle='#e6fbff';g.lineWidth=2;g.beginPath();g.moveTo(b.x+4,b.y+4);g.lineTo(b.x+b.w-4,b.y+b.h-4);g.stroke()}}
    g.fillStyle='#fff';g.shadowColor='#9ff3ff';g.shadowBlur=12;c.circle(ball.x,ball.y,7,'#fff');g.shadowBlur=0;
    c.rect(px-pw/2,py()-6,pw,12,'#a0652d',6);g.strokeStyle='#d7d9de';g.lineWidth=3;g.beginPath();g.moveTo(px-pw/2-4,py()+10);g.lineTo(px+pw/2+4,py()+10);g.stroke();
    c.emoji('🐧',px,py()-20,28);
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#9ff3ff');
    if(ball.on&&hold>0)c.txt('¡Listo!',c.W/2,(c.T+c.B)/2+60,26,'#fff');
  });
}});

// ============ 23. MOON LANDER ============
def({id:'lander',title:'ALUNIZAJE',emoji:'🚀',tag:'retro',hint:'👆 MANTÉN izq/der para empujar. ¡Aterriza suave!',
colors:['#000a05','#001a0d','#00ff9c'],font:"'VT323',monospace",
music:{bpm:60,root:36,scale:'whole',lead:'sine',bassw:'sine',bass:'root',drums:'none',density:.22,vol:.15,len:4,oct:2},
create(c){
  const g=c.g,GR=55,TH=170,SD=90;
  let lvl=0,x,y,vx,vy,fuel,ter=[],pad,padW,thr=0,landed=false,boom=false;
  const stars=[];for(let i=0;i<50;i++)stars.push({x:Math.random(),y:Math.random()});
  function gen(){
    ter=[];padW=Math.max(40,90-lvl*8);const n=14,seg=c.W/n,padI=c.RI(1,n-3);
    let h=c.B-30-c.R(0,40);
    for(let i=0;i<=n;i++){
      if(i===padI||i===padI+1){}else h=c.clamp(h+c.R(-1,1)*(30+lvl*10),c.B-150,c.B-10);
      ter.push({x:i*seg,y:h});
    }
    ter[padI+1].y=ter[padI].y;pad={x1:ter[padI].x,x2:ter[padI+1].x,y:ter[padI].y};
    x=c.R(40,c.W-40);y=c.T+30;vx=c.R(-40,40);vy=0;fuel=Math.max(60,100-lvl*4);landed=false;
  }
  gen();
  const tY=xx=>{for(let i=0;i<ter.length-1;i++)if(xx>=ter[i].x&&xx<=ter[i+1].x){const k=(xx-ter[i].x)/(ter[i+1].x-ter[i].x);return ter[i].y+(ter[i+1].y-ter[i].y)*k}return c.B};
  c.loop((dt,t)=>{
    let l=false,r=false;for(const k in c.ptr){if(c.ptr[k].x<c.W/2)l=true;else r=true}
    thr=0;
    if(!c.dead&&!landed){
      if((l||r)&&fuel>0){thr=1;vy-=TH*dt;vx+=(l&&!r?-SD:r&&!l?SD:0)*dt;fuel-=13*dt;if(Math.random()<.5)c.burst(x,y+14,'#ffb703',1,60)}
      vy+=GR*dt;x+=vx*dt;y+=vy*dt;
      if(x<0)x=c.W;if(x>c.W)x=0;if(y<c.T)y=c.T,vy=Math.max(0,vy);
      const gy=Math.max(tY(x-9),tY(x),tY(x+9));
      if(y+13>=gy){
        const onPad=x-9>=pad.x1&&x+9<=pad.x2&&Math.abs(gy-pad.y)<2;
        if(onPad&&vy<48&&Math.abs(vx)<26){landed=true;y=pad.y-13;c.setScore(c.sc+1);c.sfx('win');c.float('¡ATERRIZAJE!',c.W/2,c.T+120,'#00ff9c');lvl++;c.after(1300,gen);if(lvl===1)c.say('¡Cada vez más difícil!')}
        else{boom=true;c.sfx('hit');c.shake(16);c.vib(100);c.burst(x,y,'#ffb703',40,360);c.burst(x,y,'#fff',20,260);c.over(onPad?'¡Demasiado rápido!':'¡Estrellado!')}
      }
    }
    c.bgGrad('#000a05','#001a0d');
    stars.forEach(s=>c.rect(s.x*c.W,s.y*c.H*.8,1.5,1.5,'rgba(0,255,156,.6)'));
    g.strokeStyle='#00ff9c';g.lineWidth=2;g.shadowColor='#00ff9c';g.shadowBlur=8;g.beginPath();ter.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();
    g.fillStyle='rgba(0,255,156,.06)';g.lineTo(c.W,c.H);g.lineTo(0,c.H);g.fill();
    g.strokeStyle='#ffe14d';g.lineWidth=5;g.shadowColor='#ffe14d';g.beginPath();g.moveTo(pad.x1,pad.y);g.lineTo(pad.x2,pad.y);g.stroke();g.shadowBlur=0;
    c.txt('x2',(pad.x1+pad.x2)/2,pad.y+14,16,'#ffe14d');
    if(!boom){
      g.save();g.translate(x,y);g.strokeStyle='#00ff9c';g.lineWidth=2;g.shadowColor='#00ff9c';g.shadowBlur=8;
      g.beginPath();g.moveTo(0,-14);g.lineTo(9,6);g.lineTo(13,13);g.moveTo(0,-14);g.lineTo(-9,6);g.lineTo(-13,13);g.moveTo(-9,6);g.lineTo(9,6);g.stroke();
      if(thr){g.strokeStyle='#ffb703';g.shadowColor='#ffb703';g.beginPath();g.moveTo(-5,8);g.lineTo(0,22+Math.random()*10);g.lineTo(5,8);g.stroke()}
      g.restore();g.shadowBlur=0;
    }
    const okv=vy<48&&Math.abs(vx)<26;
    c.txt('COMB '+Math.max(0,Math.ceil(fuel)),12,c.T+50,24,'#00ff9c','left');
    c.rect(12,c.T+64,90,6,'rgba(0,255,156,.2)');c.rect(12,c.T+64,90*Math.max(0,fuel/100),6,'#00ff9c');
    if(lvl>0||c.t>3){c.txt('VERT '+Math.round(vy),c.W-12,c.T+50,22,vy<48?'#00ff9c':'#ff5555','right');c.txt('HORIZ '+Math.round(vx),c.W-12,c.T+72,22,Math.abs(vx)<26?'#00ff9c':'#ff5555','right')}
  });
}});

// ============ 24. BAKERY MATCH ============
def({id:'bakery',title:'PASTELERÍA PAREJAS',emoji:'🧁',tag:'dulce',hint:'👆 TOCA cartas y encuentra las parejas',
colors:['#fff0e6','#ffc8dd','#ff6fa5'],font:"'Lobster',cursive",
music:{bpm:104,root:65,scale:'major',lead:'sine',bassw:'sine',bass:'off',drums:'tick',density:.4,vol:.15,len:2,oct:0,arp:true,swing:.12},
create(c){
  const g=c.g,EM=['🧁','🍩','🥐','🍪','🍰','🥧','🍞','🥯','🍮','🍫','🍬','🥮'];
  let lvl=0,cards=[],first=null,lock=false,tl,tmax,cols=4,rows=3,matched=0;
  const layout=()=>{const rowsN=[3,4,5][Math.min(lvl,2)];rows=rowsN;return rowsN};
  function build(){
    layout();const n=cols*rows/2,pick=EM.slice().sort(()=>Math.random()-.5).slice(0,n),arr=pick.concat(pick).sort(()=>Math.random()-.5);
    const gap=10,cw=(c.W-28-gap*(cols-1))/cols,ch=Math.min(cw*1.2,(c.PH-50-gap*(rows-1))/rows),ox=14,oy=c.T+46+(c.PH-50-(ch*rows+gap*(rows-1)))/2;
    cards=arr.map((e,i)=>({e,x:ox+(i%cols)*(cw+gap),y:oy+Math.floor(i/cols)*(ch+gap),w:cw,h:ch,f:0,tgt:0,done:false,k:0}));
    first=null;lock=false;matched=0;tmax=tl=(lvl===0?40:48)+lvl*4;
  }
  build();
  c.down(p=>{
    if(c.dead||lock)return;
    for(const k of cards){if(!k.done&&k.tgt===0&&p.x>k.x&&p.x<k.x+k.w&&p.y>k.y&&p.y<k.y+k.h){
      k.tgt=1;c.sfx('tap',1+Math.random()*.3);
      if(!first)first=k;
      else{
        const a=first,b=k;first=null;lock=true;
        c.after(550,()=>{
          if(a.e===b.e){a.done=b.done=true;c.setScore(c.sc+1);c.sfx('coin');c.burst(a.x+a.w/2,a.y+a.h/2,'#ff6fa5',10);c.burst(b.x+b.w/2,b.y+b.h/2,'#ffd23f',10);matched++;
            if(matched*2>=cards.length){lvl++;c.sfx('win');tl+=0;c.after(500,()=>{build();if(lvl===1)c.say('¡Más cartas!')})}}
          else{a.tgt=0;b.tgt=0;c.sfx('bump',.6)}
          lock=false;
        });
      }
      return}}
  });
  c.loop((dt,t)=>{
    if(!c.dead&&!(matched*2>=cards.length)){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡Se acabó el tiempo!')}}
    c.bgGrad('#fff0e6','#ffc8dd');
    g.globalAlpha=.4;for(let i=0;i<20;i++)c.emoji('🍬',((i*61+t*8)%c.W),((i*89)%c.H),18);g.globalAlpha=1;
    c.rect(20,c.T+24,c.W-40,10,'rgba(0,0,0,.1)',5);c.rect(20,c.T+24,(c.W-40)*Math.max(0,tl/tmax),10,tl/tmax>.3?'#ff6fa5':'#e63946',5);
    for(const k of cards){
      k.f+=(k.tgt-k.f)*Math.min(1,dt*12);
      const sc=Math.abs(Math.cos(k.f*3.1416)),face=k.f>.5;
      g.save();g.translate(k.x+k.w/2,k.y+k.h/2);g.scale(Math.max(.02,sc),1);
      if(k.done){g.globalAlpha=.35}
      if(face){c.rect(-k.w/2,-k.h/2,k.w,k.h,'#fff',12);g.strokeStyle=k.done?'#7ddc8a':'#ffc8dd';g.lineWidth=3;g.beginPath();c.rr(-k.w/2,-k.h/2,k.w,k.h,12);g.stroke();c.emoji(k.e,0,2,Math.min(k.w,k.h)*.62)}
      else{c.rect(-k.w/2,-k.h/2,k.w,k.h,'#ff6fa5',12);g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();c.rr(-k.w/2+5,-k.h/2+5,k.w-10,k.h-10,8);g.stroke();c.txt('♥',0,2,k.w*.4,'rgba(255,255,255,.8)')}
      g.restore();g.globalAlpha=1;
    }
  });
}});

// ============ 25. ZOO SÍ / NO ============
def({id:'zoo',title:'ZOO SÍ / NO',emoji:'🦜',tag:'animales',hint:'👉 DESLIZA → SÍ  ·  ← NO (o toca los lados)',
colors:['#ffe29a','#ff9a76','#2a9d8f'],font:"'Sniglet',sans-serif",
music:{bpm:118,root:58,scale:'pent',lead:'triangle',bassw:'sine',bass:'walk',drums:'half',density:.55,vol:.14,len:1,oct:1},
create(c){
  const g=c.g;
  const A=[['🦁','León',{m:1,f:0,s:0,eg:0,h:1,p4:1}],['🐘','Elefante',{m:1,f:0,eg:0,p4:1}],['🦅','Águila',{m:0,f:1,s:0,eg:1,p4:0,h:0}],['🐧','Pingüino',{m:0,f:0,s:1,eg:1,p4:0,h:0}],['🐬','Delfín',{m:1,f:0,s:1,eg:0,p4:0,h:0}],['🐢','Tortuga',{m:0,f:0,eg:1,p4:1,h:0}],['🦇','Murciélago',{m:1,f:1,eg:0,h:1,p4:0}],['🐸','Rana',{m:0,f:0,s:1,eg:1,p4:1,h:0}],['🦆','Pato',{m:0,f:1,s:1,eg:1,p4:0,h:0}],['🐄','Vaca',{m:1,f:0,s:0,eg:0,h:1,p4:1}],['🐙','Pulpo',{m:0,f:0,s:1,eg:1,p4:0,h:0}],['🦋','Mariposa',{m:0,f:1,eg:1,p4:0}],['🐊','Cocodrilo',{m:0,f:0,s:1,eg:1,p4:1,h:0}],['🐑','Oveja',{m:1,f:0,s:0,eg:0,h:1,p4:1}],['🦉','Búho',{m:0,f:1,s:0,eg:1,p4:0,h:0}],['🐿️','Ardilla',{m:1,f:0,s:0,eg:0,h:1,p4:1}],['🐻','Oso',{m:1,f:0,eg:0,h:1,p4:1}],['🐝','Abeja',{m:0,f:1,s:0,eg:1,p4:0}],['🐠','Pez',{m:0,f:0,s:1,p4:0,h:0}],['🐓','Gallina',{m:0,eg:1,p4:0,h:0}]];
  const Q={f:'¿VUELA?',s:'¿NADA?',m:'¿ES MAMÍFERO?',eg:'¿PONE HUEVOS?',h:'¿TIENE PELO?',p4:'¿TIENE 4 PATAS?'};
  let cur,tl,tmax,lives=3,dx=0,drag=false,sx=0,gone=null,asked=0,prev='';
  const next=()=>{
    for(let tries=0;tries<30;tries++){
      const a=c.pick(A),keys=Object.keys(a[2]),k=c.pick(keys);
      if(a[1]+k===prev)continue;
      const want=Math.random()<.5;if(!!a[2][k]!==want&&tries<10)continue;
      cur={e:a[0],n:a[1],k,ans:!!a[2][k]};prev=a[1]+k;break;
    }
    tmax=tl=Math.max(1.7,3.8-c.sc*.06);dx=0;asked++;
  };
  next();
  const answer=yes=>{
    if(c.dead||!cur||gone)return;
    gone={x:yes?1:-1,t:0,e:cur.e};
    if(yes===cur.ans){c.setScore(c.sc+1);c.sfx('coin',1+c.sc*.02);c.burst(c.W/2+(yes?80:-80),(c.T+c.B)/2,yes?'#2a9d8f':'#e76f51',14);if(c.sc===4)c.say('¡Más rápido!')}
    else miss();
    cur=null;c.after(160,()=>{gone=null;if(!c.dead)next()});
  };
  const miss=()=>{lives--;c.sfx('hit');c.shake(8);c.vib(40);if(lives<=0){c.sfx('lose');c.over()}};
  c.down(p=>{drag=true;sx=p.x;dx=0});
  c.move(p=>{if(drag&&cur)dx=p.x-sx});
  c.up(p=>{
    if(!drag)return;drag=false;
    if(Math.abs(dx)>c.W*.2)answer(dx>0);
    else if(Math.abs(dx)<14)answer(p.x>c.W/2);
    dx=0;
  });
  c.loop((dt,t)=>{
    if(!c.dead&&cur&&!gone){tl-=dt;if(tl<=0){miss();cur=null;next()}}
    c.bgGrad('#ffe29a','#ff9a76');
    const cy=(c.T+c.B)/2;
    g.globalAlpha=.1;for(let i=0;i<14;i++)c.emoji(['🐾','🌿'][i%2],(i*71)%c.W,(i*113+t*10)%c.H,34);g.globalAlpha=1;
    const gl=dx<-20?Math.min(1,-dx/(c.W*.2)):0,gr=dx>20?Math.min(1,dx/(c.W*.2)):0;
    g.fillStyle='rgba(231,111,81,'+(.12+gl*.4)+')';g.fillRect(0,c.T,c.W*.28,c.PH);g.fillStyle='rgba(42,157,143,'+(.12+gr*.4)+')';g.fillRect(c.W*.72,c.T,c.W*.28,c.PH);
    c.txt('✗ NO',c.W*.14,cy,24,'rgba(120,30,10,.7)');c.txt('SÍ ✓',c.W*.86,cy,24,'rgba(10,80,70,.8)');
    c.rect(c.W*.15,c.T+34,c.W*.7,8,'rgba(0,0,0,.12)',4);if(cur)c.rect(c.W*.15,c.T+34,c.W*.7*Math.max(0,tl/tmax),8,tl/tmax>.35?'#2a9d8f':'#e63946',4);
    if(cur){
      g.save();g.translate(c.W/2+dx,cy);g.rotate(dx*.0012);
      g.shadowColor='rgba(0,0,0,.25)';g.shadowBlur=24;c.rect(-125,-165,250,330,'#fff',34);g.shadowBlur=0;
      c.emoji(cur.e,0,-55,120);c.txt(cur.n,0,45,28,'#666');c.txt(Q[cur.k],0,105,30,dx>20?'#2a9d8f':dx<-20?'#e76f51':'#222');
      g.restore();
    }
    if(gone){gone.t+=dt*5;g.save();g.translate(c.W/2+gone.x*gone.t*c.W*.5,cy);g.rotate(gone.x*gone.t*.5);g.globalAlpha=Math.max(0,1-gone.t);c.emoji(gone.e,0,0,100);g.restore();g.globalAlpha=1}
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#e63946');
  });
}});

// ============ 26. BUBBLE POP ============
def({id:'bubbles',title:'BURBUJAS',emoji:'🫧',tag:'océano',hint:'👆 TOCA las burbujas antes de que lleguen arriba',
colors:['#001b44','#0077b6','#90e0ef'],font:"'Londrina Solid',cursive",
music:{bpm:96,root:60,scale:'pent',lead:'sine',bassw:'sine',bass:'off',drums:'hats',density:.5,vol:.13,len:2,oct:1,arp:true,pad:true},
create(c){
  const g=c.g;let bs=[],sp=.5,lives=3,fish=[],weed=[];
  for(let i=0;i<6;i++)weed.push({x:i*c.W/5+10,h:50+Math.random()*60,p:Math.random()*6});
  for(let i=0;i<4;i++)fish.push({x:Math.random()*c.W,y:c.T+c.PH*(.15+Math.random()*.7),v:(20+Math.random()*30)*(Math.random()<.5?-1:1),s:.5+Math.random()*.5});
  const lose=()=>{lives--;c.sfx('hit');c.shake(7);if(lives<=0){c.sfx('lose');c.over()}};
  c.down(p=>{
    if(c.dead)return;
    for(let i=bs.length-1;i>=0;i--){const b=bs[i];if(Math.hypot(p.x-b.x,p.y-b.y)<b.r+10){
      if(b.k==='u'){lose();c.burst(b.x,b.y,'#f55',16)}
      else{c.setScore(c.sc+(b.k==='g'?5:b.r<28?2:1));c.sfx('pop',1+(40-b.r)*.02);c.burst(b.x,b.y,b.k==='g'?'#ffd60a':'#caf0f8',12);if(b.k==='g')c.float('+5',b.x,b.y,'#ffd60a');c.vib(6);
        if(c.sc>=8&&!c._u){c._u=1;c.say('¡Cuidado con los erizos!')}}
      bs.splice(i,1);return}}
  });
  c.loop((dt,t)=>{
    if(!c.dead){
      sp-=dt;if(sp<=0){sp=Math.max(.28,.7-c.sc*.01);const u=c.sc>=8&&Math.random()<.18,gd=!u&&Math.random()<.08;bs.push({x:c.R(40,c.W-40),y:c.B+30,r:u?24:c.R(22,40),v:c.R(70,120)+c.sc*1.2,p:Math.random()*6,k:u?'u':gd?'g':'n'})}
      for(let i=bs.length-1;i>=0;i--){const b=bs[i];b.y-=b.v*dt;b.x+=Math.sin(t*2+b.p)*20*dt;if(b.y<c.T-10){bs.splice(i,1);if(b.k==='n'||b.k==='g')lose()}}
    }
    c.bgGrad('#0096c7','#001b44');
    g.globalAlpha=.1;g.fillStyle='#fff';for(let i=0;i<4;i++){g.beginPath();g.moveTo(c.W*(.1+i*.25)+Math.sin(t*.4+i)*20,0);g.lineTo(c.W*(.05+i*.25)-60,c.H);g.lineTo(c.W*(.05+i*.25)+40,c.H);g.fill()}g.globalAlpha=1;
    fish.forEach(f=>{f.x+=f.v*dt;if(f.x>c.W+40)f.x=-40;if(f.x<-40)f.x=c.W+40;c.emoji('🐟',f.x,f.y,40*f.s,f.v>0?0:0);});
    weed.forEach(w=>{g.strokeStyle='#2d936c';g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(w.x,c.H);for(let k=1;k<=5;k++)g.lineTo(w.x+Math.sin(t+w.p+k*.5)*10*k/2,c.H-w.h*k/5);g.stroke()});
    for(const b of bs){
      if(b.k==='u'){g.save();g.translate(b.x,b.y);g.rotate(t);g.strokeStyle='#bb2';g.lineWidth=3;for(let a=0;a<12;a++){g.beginPath();g.moveTo(Math.cos(a*.5236)*b.r*.7,Math.sin(a*.5236)*b.r*.7);g.lineTo(Math.cos(a*.5236)*b.r*1.25,Math.sin(a*.5236)*b.r*1.25);g.stroke()}c.circle(0,0,b.r*.8,'#3b1c5a');c.circle(-5,-3,3,'#fff');c.circle(5,-3,3,'#fff');g.restore();continue}
      const gd=b.k==='g';g.fillStyle=gd?'rgba(255,214,10,.35)':'rgba(202,240,248,.18)';g.strokeStyle=gd?'#ffd60a':'rgba(255,255,255,.8)';g.lineWidth=2.5;
      if(gd){g.shadowColor='#ffd60a';g.shadowBlur=16}
      g.beginPath();g.arc(b.x,b.y,b.r,0,6.2832);g.fill();g.stroke();g.shadowBlur=0;
      g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3;g.beginPath();g.arc(b.x,b.y,b.r*.65,3.6,4.6);g.stroke();
    }
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#ff6b8b');
  });
}});
