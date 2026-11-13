// ============ 16. MOLE MASH ============
def({id:'mole',title:'MOLE MASH',emoji:'🐹',tag:'jardín',hint:'👆 TOCA a los topos antes de que se escondan',
colors:['#7ad7ff','#5cc15a','#ffd23f'],font:"'Chewy',cursive",
music:{bpm:132,root:55,scale:'major',lead:'square',bassw:'triangle',bass:'pulse',drums:'half',density:.55,vol:.11,len:1,oct:1},
create(c){
  const g=c.g;let holes=[],lives=3,st=.8,hammer=null,cloud=0;
  const cw=Math.min(c.W/3.2,112),ox=c.W/2-cw,oy=c.T+c.PH*.18+cw*.4;
  for(let r=0;r<3;r++)for(let k=0;k<3;k++)holes.push({x:ox+k*cw,y:oy+r*cw*1.05,t:0,max:1,kind:'n',hp:1,hit:0});
  const lose=()=>{lives--;c.sfx('hit');c.shake(7);if(lives<=0){c.sfx('lose');c.over()}};
  c.down(p=>{
    if(c.dead)return;hammer={x:p.x,y:p.y,t:.18};
    for(const h of holes){
      if(h.t>0&&h.hit<=0&&Math.hypot(p.x-h.x,p.y-h.y+cw*.15)<cw*.5){
        if(h.kind==='b'){h.t=0;lose();c.burst(h.x,h.y,'#f55',20);return}
        h.hp--;if(h.hp>0){c.sfx('bump');h.hit=.12;return}
        h.hit=.25;c.setScore(c.sc+1);c.sfx('pop',1+Math.min(c.sc,20)*.03);c.burst(h.x,h.y-20,'#ffd23f',12);c.vib(15);
        if(c.sc===10)c.say('¡Los cascos aguantan 2 golpes!');if(c.sc===16)c.say('¡No toques las bombas!');
        return;
      }
    }
  });
  c.loop((dt,t)=>{
    if(!c.dead){
      st-=dt;
      if(st<=0){
        st=Math.max(.38,.95-c.sc*.02);const free=holes.filter(h=>h.t<=0&&h.hit<=0);
        if(free.length){const h=c.pick(free);h.max=h.t=Math.max(.55,1.3-c.sc*.025);h.kind='n';h.hp=1;
          if(c.sc>=10&&Math.random()<.25){h.kind='h';h.hp=2}else if(c.sc>=16&&Math.random()<.2){h.kind='b'}}
      }
      for(const h of holes){
        if(h.hit>0){h.hit-=dt;if(h.hit<=0)h.t=0}
        else if(h.t>0){h.t-=dt;if(h.t<=0&&h.kind!=='b')lose()}
      }
    }
    if(hammer){hammer.t-=dt;if(hammer.t<=0)hammer=null}
    c.bgGrad('#7ad7ff','#c8f08f');
    c.glow('#fff',20);c.circle(c.W*.82,c.T+20,30,'#fff3a0');c.noglow();
    cloud=(cloud+dt*10)%(c.W+160);[[.2],[.6]].forEach(([x],i)=>{const cx=((x*c.W+cloud*(1+i*.4))%(c.W+160))-80;g.globalAlpha=.9;c.circle(cx,c.T+50+i*30,22,'#fff');c.circle(cx+24,c.T+56+i*30,17,'#fff');c.circle(cx-22,c.T+58+i*30,15,'#fff');g.globalAlpha=1});
    g.fillStyle='#4fae4a';g.fillRect(0,c.T+c.PH*.14,c.W,c.H);
    for(let i=0;i<30;i++){const x=(i*53)%c.W,y=c.T+c.PH*.14+((i*97)%c.PH);g.fillStyle='rgba(0,80,0,.12)';g.fillRect(x,y,3,9)}
    for(const h of holes){
      g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(h.x,h.y+cw*.18,cw*.36,cw*.14,0,0,6.2832);g.fill();
      g.fillStyle='#2b1608';g.beginPath();g.ellipse(h.x,h.y+cw*.12,cw*.33,cw*.12,0,0,6.2832);g.fill();
      if(h.t>0||h.hit>0){
        const up=h.hit>0?1:Math.min(1,(h.max-h.t)*6,h.t*6);
        g.save();g.beginPath();g.rect(h.x-cw/2,h.y-cw,cw,cw*1.12);g.clip();
        const yy=h.y+cw*.5-up*cw*.62+(h.hit>0?10:0);
        c.emoji(h.kind==='b'?'💣':'🐹',h.x,yy,cw*.7);
        if(h.kind==='h')c.emoji('⛑️',h.x,yy-cw*.32,cw*.4);
        g.restore();
        if(h.hit>0&&h.kind!=='b')c.emoji('⭐',h.x+Math.cos(t*14)*18,h.y-cw*.4+Math.sin(t*14)*8,20);
      }
      g.fillStyle='#8a5a2b';g.beginPath();g.ellipse(h.x,h.y+cw*.2,cw*.42,cw*.12,0,0,3.1416);g.fill();
    }
    if(hammer){c.emoji('🔨',hammer.x+10,hammer.y-18,50,-1.2*(1-hammer.t/.18)+.4)}
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+20,22,'#e63946');
  });
}});

// ============ 17. PIZZA TIMER ============
def({id:'pizza',title:'PIZZA PERFECTA',emoji:'🍕',tag:'cocina',hint:'👆 TOCA cuando la aguja esté en la zona verde',
colors:['#2b0f06','#8a2a0b','#ffb703'],font:"'Titan One',sans-serif",
music:{bpm:96,root:50,scale:'dorian',lead:'triangle',bassw:'triangle',bass:'walk',drums:'half',density:.5,vol:.15,len:1,oct:1,swing:.25},
create(c){
  const g=c.g;let th=3.1416,dir=1,v=2.3,zone=4.7,hw=.5,tops=[],fail=0,flash=0,cheese=0;
  const cx=c.W/2,cy=c.T+c.PH*.52,R=Math.min(c.W*.4,160);
  const newZone=()=>{zone=c.R(3.1416+hw+.1,6.2832-hw-.1)};newZone();
  const TOP=[['#c0392b',9],['#2ecc71',5],['#f1c40f',4],['#8e44ad',6]];
  c.down(()=>{
    if(c.dead||fail)return;
    const d=Math.abs(th-zone);
    if(d<hw){const pf=d<hw*.3;c.setScore(c.sc+(pf?2:1));c.sfx(pf?'win':'coin',1+c.sc*.02);c.vib(20);flash=.2;c.burst(cx,cy-60,'#ffb703',16);if(pf)c.float('¡PERFECTA!',cx,cy-R*.9,'#ffe066');
      for(let i=0;i<(pf?4:2);i++){const a=Math.random()*6.28,r=Math.random()*R*.58,k=c.pick(TOP);tops.push({x:Math.cos(a)*r,y:Math.sin(a)*r*.5,c:k[0],r:k[1]})}
      cheese=Math.min(1,cheese+.12);hw=Math.max(.13,hw-.025);v=Math.min(5.5,v+.18);newZone();if(c.sc===1)c.say('Cada vez más estrecho…')}
    else{fail=1;c.sfx('lose');c.shake(10);c.after(300,()=>c.over('¡Quemada!'))}
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead&&!fail){th+=dir*v*dt;if(th>6.2832){th=6.2832;dir=-1}if(th<3.1416){th=3.1416;dir=1}}
    c.bgGrad('#2b0f06','#8a2a0b');
    for(let i=0;i<14;i++){const x=i*c.W/13,h=30+Math.sin(t*6+i*1.7)*14+((i*37)%20);const fg=g.createLinearGradient(0,c.H-h,0,c.H);fg.addColorStop(0,'rgba(255,183,3,0)');fg.addColorStop(1,'rgba(255,100,0,.7)');g.fillStyle=fg;g.beginPath();g.ellipse(x,c.H-h/2,26,h,0,0,6.2832);g.fill()}
    // pizza
    const py=cy+R*.2;g.save();g.translate(cx,py);g.scale(1,.5);
    g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=20;c.circle(0,0,R*.72,'#d99a4e');g.shadowBlur=0;c.circle(0,0,R*.62,'#f3c66b');
    c.circle(0,0,R*.6,fail?'#2a1608':'#e9553a');c.circle(0,0,R*.6*(.3+cheese*.7),fail?'#3a1d0a':'#ffd86b');g.restore();
    tops.forEach(p=>{c.circle(cx+p.x,py+p.y,p.r,fail?'#222':p.c)});
    // reloj/dial
    const dy=cy-R*.35;
    g.lineCap='round';g.lineWidth=22;g.strokeStyle='rgba(0,0,0,.5)';g.beginPath();g.arc(cx,dy+R*.5,R,3.1416,6.2832);g.stroke();
    g.strokeStyle='#2ecc71';g.shadowColor='#2ecc71';g.shadowBlur=16;g.beginPath();g.arc(cx,dy+R*.5,R,zone-hw,zone+hw);g.stroke();g.shadowBlur=0;
    g.strokeStyle='#fff7';g.lineWidth=2;for(let i=0;i<=12;i++){const a=3.1416+i*.2618;g.beginPath();g.moveTo(cx+Math.cos(a)*(R+16),dy+R*.5+Math.sin(a)*(R+16));g.lineTo(cx+Math.cos(a)*(R+24),dy+R*.5+Math.sin(a)*(R+24));g.stroke()}
    g.strokeStyle='#fff';g.lineWidth=5;g.shadowColor='#fff';g.shadowBlur=10;g.beginPath();g.moveTo(cx,dy+R*.5);g.lineTo(cx+Math.cos(th)*(R+6),dy+R*.5+Math.sin(th)*(R+6));g.stroke();g.shadowBlur=0;c.circle(cx,dy+R*.5,9,'#ffb703');
    if(fail)c.txt('🔥',cx,py-10,80);
    if(flash>0){g.globalAlpha=flash;g.fillStyle='#ffb703';g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 18. TIGHTROPE ============
def({id:'tightrope',title:'EQUILIBRISTA',emoji:'🎪',tag:'circo',hint:'👆 MANTÉN izquierda o derecha para equilibrarte',
colors:['#7a0c1c','#ffb703','#fff3b0'],font:"'Shrikhand',cursive",
music:{bpm:136,root:48,scale:'major',lead:'square',bassw:'triangle',bass:'walk',drums:'half',density:.55,vol:.1,len:1,oct:1},
create(c){
  const g=c.g;let th=c.R(-.1,.1),om=0,time=0,wind=0,wt=3,wTarget=0,gust=0;
  const ry=()=>(c.T+c.B)/2+40;
  c.loop((dt,t)=>{
    if(!c.dead){
      time+=dt;let u=0;for(const k in c.ptr)u+=c.ptr[k].x<c.W/2?-1:1;u=Math.sign(u);
      wt-=dt;if(wt<=0){wt=c.R(2,4);wTarget=time>10&&Math.random()<.8?c.pick([-1,1])*Math.min(3.2,1.2+time*.04):0;gust=wTarget?1:0}
      wind+=(wTarget-wind)*Math.min(1,dt*1.5);
      const acc=3.6*Math.sin(th)+wind+u*9-om*1.2;om+=acc*dt;th+=om*dt;
      c.setScore(Math.floor(time*2));
      if(time>1&&time<1.1)c.say('¡Contrarresta la inclinación!');
      if(Math.abs(th)>1.1){c.sfx('lose');c.shake(8);c.over('¡Caíste!')}
      if(Math.floor(time*3)!==Math.floor((time-dt)*3)&&Math.abs(th)<.15)c.sfx('tick');
    }
    c.bgGrad('#7a0c1c','#ffb703');
    for(let i=0;i<9;i++){g.fillStyle=i%2?'rgba(255,255,255,.14)':'rgba(0,0,0,.08)';g.beginPath();g.moveTo(c.W/2,c.T-40);g.lineTo(i*c.W/8-c.W*.06,c.H);g.lineTo((i+1)*c.W/8-c.W*.06,c.H);g.fill()}
    g.globalAlpha=.22;g.fillStyle='#fff';[c.W*.2,c.W*.8].forEach(x=>{g.beginPath();g.moveTo(x,c.T);g.lineTo(x-60,c.B);g.lineTo(x+60,c.B);g.fill()});g.globalAlpha=1;
    for(let i=0;i<14;i++){const x=i*c.W/13;c.circle(x,c.H-6-((i*7)%3)*8,22,['#2a9d8f','#e76f51','#264653','#e9c46a'][i%4]);c.circle(x,c.H-26-((i*7)%3)*8,10,'#f4d6a0')}
    const y=ry();g.strokeStyle='#3b2a1a';g.lineWidth=5;g.beginPath();g.moveTo(0,y+2);g.lineTo(c.W,y+2);g.stroke();
    g.fillStyle='#3b2a1a';for(let x=((-time*90)%160);x<c.W;x+=160){g.fillRect(x-4,y,8,c.H)}
    g.save();g.translate(c.W/2,y);
    g.rotate(th*.6);
    g.strokeStyle='#1d1d1d';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(0,0);g.lineTo(0,-62);g.stroke();
    g.strokeStyle='#ff5d8f';g.lineWidth=7;g.beginPath();g.moveTo(0,-50);g.lineTo(0,-24);g.stroke();
    c.circle(0,-72,11,'#f5d0a0');c.rect(-12,-87,24,10,'#e63946',4);
    g.save();g.translate(0,-48);g.rotate(-th*1.3);g.strokeStyle='#4a2c10';g.lineWidth=5;g.beginPath();g.moveTo(-100,0);g.lineTo(100,0);g.stroke();c.circle(-100,0,6,'#e63946');c.circle(100,0,6,'#e63946');g.restore();
    g.strokeStyle='#1d1d1d';g.lineWidth=5;g.beginPath();g.moveTo(0,-4);g.lineTo(-8,0);g.moveTo(0,-4);g.lineTo(8,0);g.stroke();
    g.restore();
    if(Math.abs(wind)>.5){const wy=c.T+c.PH*.22;c.emoji('💨',c.W/2+(wind>0?-34:34),wy,40);c.txt(wind>0?'→':'←',c.W/2+(wind>0?18:-18),wy,38,'#fff','center','#7a0c1c')}
    if(Math.abs(th)>.7){c.txt('¡CUIDADO!',c.W/2,c.T+c.PH*.34,30,'#fff','center','#d00000')}
    c.txt('◀',c.W*.1,c.B+8,22,'rgba(255,255,255,.4)');c.txt('▶',c.W*.9,c.B+8,22,'rgba(255,255,255,.4)');
  });
}});

// ============ 19. ROAD HOP ============
def({id:'road',title:'ROAD HOP',emoji:'🐔',tag:'pixel',hint:'👆 TOCA ARRIBA = avanzar · LADOS = moverte',
colors:['#2e7d32','#1b5e20','#ffeb3b'],font:"'Silkscreen',monospace",
music:{bpm:144,root:52,scale:'pent',lead:'square',bassw:'square',bass:'pulse',drums:'four',density:.6,vol:.1,len:1,oct:1},
create(c){
  const g=c.g,COLS=9,cell=Math.floor(c.W/COLS),ox=(c.W-cell*COLS)/2;
  let rows={},col=4,row=0,hop=0,hcol=4,hrow=0,cam=0,idle=0,best=0,lastType='g';
  const CARC=['#e63946','#4361ee','#f4a261','#9b5de5','#06d6a0'];
  function lane(r){
    if(rows[r])return rows[r];
    let type=r<3?'g':(lastType==='r'&&Math.random()<.25?'g':(Math.random()<.65?'r':'g'));
    if(type==='g'&&rows[r-1]&&rows[r-1].type==='g'&&Math.random()<.5&&r>=3)type='r';
    lastType=type;
    const L={type,cars:[],trees:[],dir:Math.random()<.5?-1:1,speed:c.R(55,120)+r*.8};
    if(type==='g'){for(let i=0;i<COLS;i++)if((r>0&&Math.random()<.18&&i!==4)||(r<3&&(i<1||i>COLS-2)&&Math.random()<.5))L.trees.push(i)}
    else{const n=c.RI(2,3),span=(COLS+4)*cell;for(let i=0;i<n;i++)L.cars.push({x:i*span/n+c.R(0,30),w:c.R(1.4,2.2)*cell,c:c.pick(CARC)})}
    return rows[r]=L;
  }
  const ry=r=>c.B-52-(r-cam)*cell;
  c.down(p=>{
    if(c.dead||hop>0)return;
    let dc=0,dr=0;const z=p.x/c.W;if(z<.3)dc=-1;else if(z>.7)dc=1;else dr=1;
    const nc=c.clamp(col+dc,0,COLS-1),nr=row+dr;
    if(lane(nr).trees.indexOf(nc)>=0){c.sfx('bump',.6);return}
    hcol=col;hrow=row;col=nc;row=nr;hop=.001;c.sfx('tap',1+row*.01);
    if(dr){idle=0;if(row>best){best=row;c.setScore(best)}if(best===3)c.say('¡Cuidado con los coches!')}
  });
  c.loop((dt,t)=>{
    if(!c.dead){
      if(hop>0){hop+=dt/.11;if(hop>=1)hop=0}
      idle+=dt;if(idle>3.6&&idle<3.7)c.say('¡Muévete o te atrapa el águila!',1500);
      if(idle>5.5){c.sfx('hit');c.shake(10);c.over('¡El águila te cogió!')}
      cam+=(row-cam)*Math.min(1,dt*5);
      const L=lane(row);
      if(L.type==='r'&&hop===0)for(const k of L.cars){const x=ox+k.x-2*cell;if(Math.abs(x+k.w/2-(ox+col*cell+cell/2))<k.w/2+cell*.28){c.sfx('hit');c.shake(14);c.vib(80);c.burst(ox+col*cell+cell/2,ry(row),'#fff',24,300);c.over('¡Atropellado!');break}}
    }
    // update cars
    const span=(COLS+4)*cell;
    for(let r=Math.floor(cam)-3;r<Math.floor(cam)+Math.ceil(c.PH/cell)+4;r++){const l=lane(r);if(l.type==='r')for(const k of l.cars){if(!c.dead||true)k.x=((k.x+l.dir*l.speed*dt)%span+span)%span}}
    for(let r=Math.floor(cam)+Math.ceil(c.PH/cell)+4;r>=Math.floor(cam)-3;r--){
      const l=lane(r),y=ry(r);if(y<-cell||y>c.H+cell)continue;
      if(l.type==='g'){g.fillStyle=((r%2)?'#4caf50':'#43a047');g.fillRect(0,y-cell/2,c.W,cell)}
      else{g.fillStyle='#37474f';g.fillRect(0,y-cell/2,c.W,cell);g.fillStyle='rgba(255,255,255,.35)';for(let x=-((t*20)%30);x<c.W;x+=30)g.fillRect(x,y-1,16,3)}
      for(const i of l.trees){const x=ox+i*cell;c.rect(x+cell*.4,y-cell*.1,cell*.2,cell*.4,'#6d4c41');c.rect(x+cell*.12,y-cell*.55,cell*.76,cell*.55,'#1b5e20');c.rect(x+cell*.12,y-cell*.55,cell*.76,cell*.14,'#2e7d32')}
      if(l.type==='r')for(const k of l.cars){const x=ox+k.x-2*cell;c.rect(x,y-cell*.38,k.w,cell*.72,k.c,5);c.rect(x+(l.dir>0?k.w*.55:k.w*.1),y-cell*.3,k.w*.32,cell*.3,'#bde0fe',3);c.rect(x,y+cell*.22,k.w,cell*.12,'rgba(0,0,0,.25)')}
    }
    if(!c.dead||c.sc>=0){
      let x=ox+col*cell+cell/2,y=ry(row);
      if(hop>0){const k=hop;x=ox+(hcol+(col-hcol)*k)*cell+cell/2;y=ry(hrow+(row-hrow)*k)-Math.sin(k*3.1416)*cell*.45}
      if(!c.dead){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-cell*.3,y+cell*.28,cell*.6,cell*.1);
        c.rect(x-cell*.3,y-cell*.35,cell*.6,cell*.62,'#fff',4);c.rect(x-cell*.08,y-cell*.5,cell*.16,cell*.18,'#e63946');c.rect(x+cell*.1,y-cell*.1,cell*.2,cell*.1,'#ff9800');c.rect(x+cell*.04,y-cell*.22,cell*.08,cell*.08,'#000')}
    }
    if(idle>3.6&&!c.dead){c.txt('🦅',c.W/2+Math.sin(t*6)*30,c.T+30+Math.min(1,(idle-3.6)/1.9)*(c.PH*.6),50)}
  });
}});

// ============ 20. FROG SIMON ============
def({id:'frogs',title:'RANAS MÚSICAS',emoji:'🐸',tag:'estanque',hint:'👀 MIRA la secuencia y repítela',
colors:['#021b1a','#06453f','#7dffb2'],font:"'Patrick Hand',cursive",
music:{bpm:72,root:48,scale:'pent',lead:'sine',bassw:'sine',bass:'off',drums:'none',density:0,vol:.12,len:3,oct:1,pad:true},
create(c){
  const g=c.g,PC=['#7dff5a','#ffd23f','#ff6fb5','#58b4ff'],NOTE=[60,64,67,72];
  let seq=[c.RI(0,3)],st='ready',tm=1,idx=0,pos=0,lit=-1,lt=0,fl=[],rip=[];
  const pads=[[.3,.38],[.7,.38],[.3,.7],[.7,.7]],pr=()=>Math.min(c.W*.18,72);
  const pp=i=>({x:c.W*pads[i][0],y:c.T+c.PH*pads[i][1]});
  for(let i=0;i<20;i++)fl.push({x:Math.random(),y:Math.random(),p:Math.random()*6});
  const light=(i,d)=>{lit=i;lt=d||.4;c.sfx('note',NOTE[i]);const p=pp(i);rip.push({x:p.x,y:p.y,r:pr(),a:1});c.burst(p.x,p.y,PC[i],8,120)};
  c.say('Mira…',1400);
  c.down(p=>{
    if(c.dead||st!=='input')return;
    let b=-1,bd=1e9;for(let i=0;i<4;i++){const q=pp(i),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;b=i}}
    if(bd>pr()*1.5)return;light(b,.3);
    if(b===seq[pos]){pos++;if(pos>=seq.length){c.setScore(seq.length);st='gap';tm=.9;c.sfx('win')}}
    else{c.sfx('lose');c.shake(8);st='fail';c.after(500,()=>c.over('¡Ups! Era otra'))}
  });
  c.loop((dt,t)=>{
    if(!c.dead){
      tm-=dt;lt-=dt;if(lt<=0)lit=-1;
      if(st==='ready'&&tm<=0){st='show';idx=0;tm=.3}
      else if(st==='show'&&tm<=0){if(idx<seq.length){light(seq[idx],.45);idx++;tm=Math.max(.35,.75-seq.length*.03)}else{st='input';pos=0;c.say('¡Tu turno!',1200)}}
      else if(st==='gap'&&tm<=0){seq.push(c.RI(0,3));st='show';idx=0;tm=.4;c.say('Mira…',1000)}
    }
    c.bgGrad('#021b1a','#06453f');
    for(let i=rip.length-1;i>=0;i--){const r=rip[i];r.r+=90*dt;r.a-=dt*1.4;if(r.a<=0){rip.splice(i,1);continue}g.globalAlpha=r.a*.5;g.strokeStyle='#bfffe0';g.lineWidth=2;g.beginPath();g.ellipse(r.x,r.y,r.r,r.r*.5,0,0,6.2832);g.stroke()}g.globalAlpha=1;
    for(let i=0;i<5;i++){g.globalAlpha=.08;g.strokeStyle='#bfffe0';g.beginPath();g.ellipse(c.W*(.2+i*.15),c.T+c.PH*(.2+(i*37%10)/12),30+Math.sin(t+i)*6,12,0,0,6.2832);g.stroke()}g.globalAlpha=1;
    for(let i=0;i<4;i++){
      const p=pp(i),on=lit===i,r=pr();
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(p.x,p.y+8,r,r*.5,0,0,6.2832);g.fill();
      g.save();g.translate(p.x,p.y);if(on){g.shadowColor=PC[i];g.shadowBlur=40}
      g.fillStyle=on?PC[i]:'#1f7a4a';g.beginPath();g.ellipse(0,0,r,r*.55,0,.35,6.2832-.1);g.lineTo(0,0);g.fill();g.shadowBlur=0;
      g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=2;g.beginPath();g.ellipse(0,0,r*.7,r*.38,0,0,6.2832);g.stroke();
      const j=on?-18:0;
      c.circle(0,-6+j,r*.34,on?'#fff':'#58d68d');c.circle(-r*.14,-r*.28+j,r*.1,'#fff');c.circle(r*.14,-r*.28+j,r*.1,'#fff');c.circle(-r*.14,-r*.28+j,r*.045,'#000');c.circle(r*.14,-r*.28+j,r*.045,'#000');
      c.circle(0,-r*.55+j+r*.26,1,'#0000');
      g.restore();
      c.circle(p.x+r*.55,p.y-r*.2,8,PC[i]);c.circle(p.x+r*.55,p.y-r*.2,3,'#fff');
    }
    fl.forEach(f=>{const a=.3+.7*Math.abs(Math.sin(t*1.5+f.p));g.globalAlpha=a;c.circle(((f.x*c.W+Math.sin(t*.4+f.p)*30)+c.W)%c.W,f.y*c.H,2.2,'#e6ff8a');g.globalAlpha=1});
    if(st==='input'){for(let i=0;i<seq.length;i++)c.circle(c.W/2-(seq.length-1)*7+i*14,c.B+2,i<pos?5:3,i<pos?'#7dffb2':'rgba(255,255,255,.3)')}
  });
}});
