// ============ 34. TRES VASOS ============
def({id:'shell',title:'TRES VASOS',emoji:'🎩',tag:'magia',hint:'👀 SIGUE la bola y TOCA el vaso donde está',
colors:['#2a0845','#5b1a7a','#ffd166'],font:"'Playfair Display',serif",
music:{bpm:96,root:50,scale:'harm',lead:'triangle',bassw:'sine',bass:'walk',drums:'half',density:.4,vol:.13,len:1.5,oct:1,swing:.2},
create(c){
  const g=c.g;let n=3,cups=[],ball=1,st='show',tm=.5,swaps=[],si=0,sT=0,dur=.5,res=0,msg='',round=0;
  const cw=()=>Math.min(c.W/(n+.8),104),sx=s=>c.W/2+(s-(n-1)/2)*(cw()*1.12),ty=()=>(c.T+c.B)/2+50;
  function setup(){
    n=c.sc>=6?4:3;cups=[];for(let i=0;i<n;i++)cups.push({id:i,slot:i,x:sx(i),lift:0,y:0});
    ball=c.RI(0,n-1);st='show';tm=.35;res=0;
  }
  setup();
  const mkswaps=()=>{swaps=[];const k=Math.min(16,4+Math.floor(c.sc*1.4));let last=-1;for(let i=0;i<k;i++){let a,b;do{a=c.RI(0,n-1);b=c.RI(0,n-1)}while(a===b||a*10+b===last||b*10+a===last);last=a*10+b;swaps.push([a,b])}si=0;sT=0;dur=Math.max(.17,.5-c.sc*.03)};
  c.down(p=>{
    if(c.dead||st!=='pick')return;
    for(const k of cups){if(Math.abs(p.x-k.x)<cw()/2+6&&p.y>ty()-cw()*1.2&&p.y<ty()+20){
      k.lift=1;st='res';
      if(k.id===ball){c.setScore(c.sc+1);c.sfx('win');c.burst(k.x,ty(),'#ffd166',20);res=1.1;if(c.sc===1)c.say('¡Cada vez más rápido!',1400)}
      else{cups[ball].lift=1;c.sfx('lose');c.shake(8);res=-1;c.after(900,()=>c.over('¡Ahí no estaba!'))}
      return}}
  });
  c.loop((dt,t)=>{
    cups.forEach(k=>{const tgt=(st==='show'&&k.id===ball&&tm<=0)||k.lift===1&&st==='res'?1:0;if(st==='show'){k.lift=k.id===ball&&tm<=1.1?1:0}});
    if(!c.dead){
      if(st==='show'){tm+=dt;if(tm>1.4){cups.forEach(k=>k.lift=0);st='cover';tm=0}}
      else if(st==='cover'){tm+=dt;if(tm>.4){mkswaps();st='swap'}}
      else if(st==='swap'){
        sT+=dt;const e=Math.min(1,sT/dur),[a,b]=swaps[si],ca=cups.find(k=>k.slot===a),cb=cups.find(k=>k.slot===b),ee=e*e*(3-2*e);
        ca.x=sx(a)+(sx(b)-sx(a))*ee;cb.x=sx(b)+(sx(a)-sx(b))*ee;ca.y=-Math.sin(e*3.1416)*26;cb.y=Math.sin(e*3.1416)*14;
        if(e>=1){ca.slot=b;cb.slot=a;ca.x=sx(b);cb.x=sx(a);ca.y=cb.y=0;si++;sT=0;c.sfx('tick');if(si>=swaps.length){st='pick';c.say('¿Dónde está?',1200)}}
      }
      else if(st==='res'&&res>0){res-=dt;if(res<=0)setup()}
    }
    c.bgGrad('#2a0845','#5b1a7a');
    const sp=g.createRadialGradient(c.W/2,c.T-20,10,c.W/2,ty(),c.H*.7);sp.addColorStop(0,'rgba(255,230,160,.5)');sp.addColorStop(1,'rgba(255,230,160,0)');g.fillStyle=sp;g.beginPath();g.moveTo(c.W/2-30,c.T-20);g.lineTo(c.W/2+30,c.T-20);g.lineTo(c.W,c.B);g.lineTo(0,c.B);g.fill();
    g.fillStyle='#7a1530';g.fillRect(0,0,24,c.H);g.fillRect(c.W-24,0,24,c.H);
    g.fillStyle='#4a2410';g.fillRect(0,ty()+4,c.W,c.H);c.rect(0,ty()+4,c.W,8,'#8a5a2b');
    const w=cw();
    // bola
    if(cups[ball]&&cups[ball].lift>0){const k=cups[ball];c.circle(k.x,ty()-10,12,'#ffd166');c.circle(k.x-4,ty()-14,4,'#fff')}
    else if(st==='show'||st==='cover'){}
    cups.forEach(k=>{
      const y=ty()+k.y-k.lift*w*.9;
      g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(k.x,ty()+6,w*.45,8,0,0,6.2832);g.fill();
      g.fillStyle='#d62828';g.beginPath();g.moveTo(k.x-w*.34,y-w*.95);g.lineTo(k.x+w*.34,y-w*.95);g.lineTo(k.x+w*.46,y);g.lineTo(k.x-w*.46,y);g.closePath();g.fill();
      g.fillStyle='#ffd166';g.fillRect(k.x-w*.4,y-w*.55,w*.8,8);c.rect(k.x-w*.34,y-w*.95,w*.68,8,'#ff6b6b',4);
    });
    c.txt(st==='swap'?'🌀':st==='pick'?'👆':'',c.W/2,c.T+60,34);
  });
}});

// ============ 35. SEMÁFORO LOCO ============
def({id:'traffic',title:'SEMÁFORO LOCO',emoji:'🚦',tag:'ciudad',hint:'👆 TOCA para cambiar el semáforo. ¡Evita choques!',
colors:['#8fd694','#4a9b5a','#ff5252'],font:"'Rubik Mono One',sans-serif",
music:{bpm:108,root:50,scale:'major',lead:'square',bassw:'triangle',bass:'walk',drums:'hats',density:.5,vol:.1,len:1,oct:1,swing:.1},
create(c){
  const g=c.g,L=34,Wd=18,CL=['#e63946','#f4a261','#4361ee','#9b5de5','#ffd166','#06d6a0','#ffffff'];
  const cx=c.W/2,cy=(c.T+c.B)/2+10,SL=50,RW=40;
  let cars=[],axis=0,clearT=0,sp=1,blocked=[0,0,0,0],passed=0;
  const D=[[1,0],[-1,0],[0,1],[0,-1]];
  const lane=d=>d===0?{x:-30,y:cy+16}:d===1?{x:c.W+30,y:cy-16}:d===2?{x:cx-16,y:c.T-30}:{x:cx+16,y:c.B+30};
  const sOf=(car)=>car.x*D[car.d][0]+car.y*D[car.d][1];
  const stopS=d=>d===0?cx-SL:d===1?-(cx+SL):d===2?cy-SL:-(cy+SL);
  const rect=car=>{const h=car.d<2;const w=h?L:Wd,hh=h?Wd:L;return{x:car.x-w/2,y:car.y-hh/2,w,h:hh}};
  let spT=.6;
  c.down(()=>{if(c.dead)return;axis=1-axis;clearT=.75;c.sfx('tap',1.2);if(c.sc===0)c.say('Cuidado: pausa en rojo para todos',1800)});
  c.loop((dt,t)=>{
    if(!c.dead){
      clearT=Math.max(0,clearT-dt);
      sp=Math.min(1.9,1+passed*.02);
      spT-=dt;
      if(spT<=0){spT=Math.max(.45,1.15-passed*.015)*c.R(.7,1.2);const d=c.RI(0,3),ln=lane(d);
        if(cars.some(k=>k.d===d&&Math.hypot(k.x-ln.x,k.y-ln.y)<L+16)){blocked[d]+=1;if(blocked[d]>4){c.sfx('lose');c.over('¡Atasco!')}}
        else{blocked[d]=0;cars.push({d,x:ln.x,y:ln.y,v:100,c:c.pick(CL)})}}
      for(let d=0;d<4;d++)cars.filter(k=>k.d===d).sort((a,b)=>sOf(b)-sOf(a));
      for(const k of cars){
        const dd=D[k.d],s=sOf(k),front=s+L/2,gap=stopS(k.d)-front,green=(k.d<2?0:1)===axis&&clearT<=0;
        let vt=105*sp;
        if(!green&&gap>-2)vt=Math.min(vt,Math.max(0,gap)*3.2);
        let ahead=1e9;for(const o of cars)if(o!==k&&o.d===k.d){const gp=sOf(o)-L/2-front-8;if(gp>-L&&gp<ahead&&sOf(o)>s)ahead=gp}
        if(ahead<1e8)vt=Math.min(vt,Math.max(0,ahead)*3.2);
        k.v+=(vt-k.v)*Math.min(1,dt*6);k.x+=dd[0]*k.v*dt;k.y+=dd[1]*k.v*dt;
      }
      for(let i=cars.length-1;i>=0;i--){const k=cars[i];if(k.x<-60||k.x>c.W+60||k.y<c.T-60||k.y>c.B+60){if(k.x>-40&&k.x<c.W+40||true){}cars.splice(i,1);passed++;c.setScore(passed);if(passed%5===0)c.sfx('coin')}}
      for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++){
        const a=cars[i],b=cars[j];if((a.d<2)===(b.d<2))continue;
        const r=rect(a),q=rect(b);
        if(r.x+2<q.x+q.w&&r.x+r.w-2>q.x&&r.y+2<q.y+q.h&&r.y+r.h-2>q.y){c.sfx('hit');c.shake(16);c.vib(100);c.burst(a.x,a.y,'#ffb703',30,300);c.burst(b.x,b.y,'#fff',16,240);c.over('¡CHOQUE!');i=1e9;break}
      }
    }
    c.bgGrad('#8fd694','#4a9b5a');
    for(let i=0;i<8;i++){const x=(i*97)%c.W,y=c.T+((i*131)%(c.PH));if(Math.abs(x-cx)>RW+18&&Math.abs(y-cy)>RW+18){c.rect(x,y,50,34,'rgba(0,0,0,.12)',6);c.circle(x+12,y+8,10,'#2d7a3d')}}
    g.fillStyle='#4a4f57';g.fillRect(0,cy-RW,c.W,RW*2);g.fillRect(cx-RW,0,RW*2,c.H);
    g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.setLineDash([16,14]);g.beginPath();g.moveTo(0,cy);g.lineTo(cx-RW,cy);g.moveTo(cx+RW,cy);g.lineTo(c.W,cy);g.moveTo(cx,0);g.lineTo(cx,cy-RW);g.moveTo(cx,cy+RW);g.lineTo(cx,c.H);g.stroke();g.setLineDash([]);
    g.fillStyle='rgba(255,255,255,.75)';g.fillRect(cx-SL-3,cy,4,RW);g.fillRect(cx+SL-1,cy-RW,4,RW);g.fillRect(cx-RW,cy-SL-3,RW,4);g.fillRect(cx,cy+SL-1,RW,4);
    for(const k of cars){const r=rect(k);c.rect(r.x,r.y,r.w,r.h,k.c,5);c.rect(r.x+(k.d===0?r.w*.55:k.d===1?r.w*.1:2),r.y+(k.d===2?r.h*.55:k.d===3?r.h*.1:2),k.d<2?r.w*.3:r.w-4,k.d<2?r.h-4:r.h*.3,'rgba(190,225,255,.85)',3)}
    const lamp=(x,y,ax)=>{const green=ax===axis&&clearT<=0;c.rect(x-9,y-17,18,34,'#111',6);c.circle(x,y-8,6,green?'#222':'#ff3b30');c.circle(x,y+8,6,green?'#38d96b':'#222')};
    lamp(cx-RW-14,cy-RW-18,0);lamp(cx+RW+14,cy+RW+18,0);lamp(cx+RW+14,cy-RW-18,1);lamp(cx-RW-14,cy+RW+18,1);
    c.txt(clearT>0?'TODO ROJO':axis===0?'◀ ▶ VERDE':'▲ ▼ VERDE',cx,c.B+8,14,'rgba(255,255,255,.85)');
  });
}});

// ============ 36. GOTA DE TINTA ============
def({id:'ink',title:'GOTA DE TINTA',emoji:'🎨',tag:'arte',hint:'👆 MANTÉN para hacer crecer la gota. SUELTA antes de tocar nada',
colors:['#fbf7ee','#efe5cf','#7b2cbf'],font:"'Permanent Marker',cursive",
music:{bpm:84,root:60,scale:'lydian',lead:'sine',bassw:'sine',bass:'off',drums:'none',density:.4,vol:.14,len:3,oct:0,arp:true,pad:true},
create(c){
  const g=c.g;let C=[],cur=null,hue=260;
  const free=(x,y,r)=>x-r>4&&x+r<c.W-4&&y-r>c.T&&y+r<c.B&&C.every(o=>Math.hypot(o.x-x,o.y-y)>o.r+r);
  const addObs=()=>{for(let i=0;i<60;i++){const r=c.RI(10,22),x=c.R(r+6,c.W-r-6),y=c.R(c.T+r+6,c.B-r-6);if(free(x,y,r+6)){C.push({x,y,r,o:true,h:0});return true}}return false};
  for(let i=0;i<4;i++)addObs();
  c.down(p=>{
    if(c.dead||cur)return;
    if(C.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<o.r+3))return;
    cur={x:p.x,y:p.y,r:5,h:hue};hue=(hue+57)%360;
  });
  c.up(()=>{
    if(!cur)return;const k=cur;cur=null;
    if(k.r<14){c.sfx('lose');c.over('¡Muy pequeña!');return}
    C.push({x:k.x,y:k.y,r:k.r,o:false,h:k.h});c.setScore(c.sc+Math.floor(k.r/4));c.sfx('note',55+Math.min(24,Math.floor(k.r/4)*2));c.burst(k.x,k.y,'hsl('+k.h+',70%,50%)',12,160);
    if(!addObs()){c.sfx('win');c.over('¡Tablero lleno!')}
    if(c.sc>0&&c.sc<8)c.say('¡Cuanto más grande, más puntos!',1500);
  });
  c.loop((dt,t)=>{
    if(cur&&!c.dead){
      cur.r+=(55+cur.r*.45)*dt;
      if(!free(cur.x,cur.y,cur.r)){c.sfx('hit');c.shake(10);c.burst(cur.x,cur.y,'hsl('+cur.h+',80%,50%)',30,300);const k=cur;cur=null;c.vib(60);c.over('¡Salpicaste!')}
    }
    c.bgGrad('#fbf7ee','#efe5cf');
    for(let i=0;i<60;i++){g.fillStyle='rgba(120,90,40,.05)';g.fillRect((i*89)%c.W,(i*57)%c.H,2,2)}
    g.strokeStyle='rgba(123,44,191,.25)';g.lineWidth=3;g.setLineDash([8,8]);g.beginPath();c.rr(4,c.T,c.W-8,c.B-c.T,18);g.stroke();g.setLineDash([]);
    const draw=o=>{
      if(o.o){g.fillStyle='#1a1a1a';g.beginPath();g.arc(o.x,o.y,o.r,0,6.2832);g.fill();g.strokeStyle='#1a1a1a';g.lineWidth=2;g.beginPath();g.arc(o.x+1,o.y+1,o.r+3,0,6.2832);g.stroke();return}
      const gr=g.createRadialGradient(o.x-o.r*.3,o.y-o.r*.3,o.r*.1,o.x,o.y,o.r);gr.addColorStop(0,'hsla('+o.h+',80%,65%,.9)');gr.addColorStop(1,'hsla('+o.h+',75%,42%,.95)');
      g.fillStyle=gr;g.beginPath();g.arc(o.x,o.y,o.r,0,6.2832);g.fill();g.strokeStyle='hsl('+o.h+',70%,30%)';g.lineWidth=2;g.beginPath();g.arc(o.x,o.y,o.r,0,6.2832);g.stroke();
    };
    C.forEach(draw);if(cur){draw(cur);c.txt(String(Math.floor(cur.r/4)),cur.x,cur.y,Math.max(14,cur.r*.5),'#fff')}
  });
}});
