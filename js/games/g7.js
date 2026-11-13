// ============ 31. SUMA OBJETIVO ============
def({id:'sum10',title:'SUMA OBJETIVO',emoji:'🧮',tag:'plano',hint:'👆 TOCA fichas que sumen exactamente el objetivo',
colors:['#0a3b8c','#0d2a66','#ffe14d'],font:"'Special Elite',monospace",
music:{bpm:118,root:57,scale:'dorian',lead:'triangle',bassw:'sine',bass:'walk',drums:'tick',density:.5,vol:.14,len:1,oct:1},
create(c){
  const g=c.g,N=4,GR=4;
  const ts=Math.min((c.W-40)/N,(c.PH-170)/GR),x0=(c.W-ts*N)/2,y0=c.T+120;
  let grid=[],sel=[],target=0,tl=26,flash=0,fc='#fff';
  for(let i=0;i<N*GR;i++)grid.push({v:c.RI(1,9),s:false,pop:0});
  const newTarget=()=>{const k=c.RI(2,3),idx=[];while(idx.length<k){const i=c.RI(0,grid.length-1);if(idx.indexOf(i)<0)idx.push(i)}target=idx.reduce((s,i)=>s+grid[i].v,0)};
  newTarget();
  const sum=()=>grid.reduce((s,t)=>s+(t.s?t.v:0),0);
  c.down(p=>{
    if(c.dead)return;
    const ci=Math.floor((p.x-x0)/ts),ri=Math.floor((p.y-y0)/ts);if(ci<0||ci>=N||ri<0||ri>=GR)return;
    const t=grid[ri*N+ci];t.s=!t.s;t.pop=.15;c.sfx('tap',t.s?1.2:.9);
    const s=sum();
    if(s===target){let n=0;grid.forEach((q,i)=>{if(q.s){n++;c.burst(x0+(i%N+.5)*ts,y0+(Math.floor(i/N)+.5)*ts,'#ffe14d',8);q.v=c.RI(1,9);q.s=false;q.pop=.3}});
      c.setScore(c.sc+1);c.sfx('win');tl=Math.min(30,tl+3+n);flash=.2;fc='#ffe14d';newTarget();if(c.sc===1)c.say('¡Siempre hay solución!',1600)}
    else if(s>target){grid.forEach(q=>q.s=false);tl-=2;c.sfx('hit');c.shake(7);flash=.2;fc='#f55'}
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){tl-=dt;if(tl<=0){c.sfx('lose');c.over('¡Se acabó el tiempo!')}}
    c.bgGrad('#0a3b8c','#0d2a66');
    g.strokeStyle='rgba(255,255,255,.1)';g.lineWidth=1;for(let x=0;x<c.W;x+=24){g.beginPath();g.moveTo(x,0);g.lineTo(x,c.H);g.stroke()}for(let y=0;y<c.H;y+=24){g.beginPath();g.moveTo(0,y);g.lineTo(c.W,y);g.stroke()}
    const s=sum();
    c.circle(c.W/2,c.T+50,36,'#ffe14d');c.txt(String(target),c.W/2,c.T+51,38,'#0a3b8c');
    c.txt('OBJETIVO',c.W/2,c.T+96,14,'#fff');
    c.txt('SUMA '+s,c.W-16,c.T+50,24,s>target?'#f55':'#fff','right');
    c.rect(20,c.T+106,c.W-40,6,'rgba(255,255,255,.2)',3);c.rect(20,c.T+106,(c.W-40)*Math.max(0,tl/30),6,tl>8?'#ffe14d':'#f55',3);
    grid.forEach((q,i)=>{
      q.pop=Math.max(0,q.pop-dt);const x=x0+(i%N+.5)*ts,y=y0+(Math.floor(i/N)+.5)*ts,sc=1+q.pop*1.5;
      g.save();g.translate(x,y);g.scale(sc,sc);
      c.rect(-ts/2+4,-ts/2+4,ts-8,ts-8,q.s?'#ffe14d':'rgba(255,255,255,.08)',10);
      g.strokeStyle=q.s?'#fff':'rgba(255,255,255,.7)';g.lineWidth=2;g.beginPath();c.rr(-ts/2+4,-ts/2+4,ts-8,ts-8,10);g.stroke();
      c.txt(String(q.v),0,2,ts*.5,q.s?'#0a3b8c':'#fff');g.restore();
    });
    if(flash>0){g.globalAlpha=flash;g.fillStyle=fc;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 32. CUENTA RÁPIDA ============
def({id:'count',title:'CUENTA RÁPIDA',emoji:'👁️',tag:'reflejos',hint:'👀 Mira los puntos un instante y elige cuántos eran',
colors:['#0a0a0f','#1a1030','#ff5d73'],font:"'Bebas Neue',sans-serif",
music:{bpm:90,root:52,scale:'minpent',lead:'sine',bassw:'sine',bass:'root',drums:'tick',density:.3,vol:.13,len:2.5,oct:1,pad:true},
create(c){
  const g=c.g,PAL=['#ff5d73','#ffd166','#06d6a0','#4cc9f0','#c77dff'];
  let st='intro',tm=.9,N=3,dots=[],opts=[],ans=0,lives=3,tl=3.6,fb=0,fbc='#0f0',pick=-1;
  const bw=()=>(c.W-48)/3;
  function round(){
    N=Math.min(12,3+Math.floor(c.sc/2));dots=[];
    for(let i=0,tries=0;i<N&&tries<500;tries++){const x=c.R(40,c.W-40),y=c.R(c.T+60,c.B-190);if(!dots.some(d=>Math.hypot(d.x-x,d.y-y)<44)){dots.push({x,y,c:PAL[i%5],r:c.R(11,17)});i++}}
    N=dots.length;ans=N;const s=new Set([N]);while(s.size<3){const v=N+c.RI(-2,2);if(v>0)s.add(v)}opts=[...s].sort(()=>Math.random()-.5);
    st='show';tm=.6+N*.1;
  }
  c.after(900,round);
  const lose=()=>{lives--;c.sfx('hit');c.shake(8);fb=.5;fbc='#f33';if(lives<=0){c.sfx('lose');c.over()}else{st='intro';tm=.9;c.after(900,round)}};
  c.down(p=>{
    if(c.dead||st!=='ask')return;
    for(let i=0;i<3;i++){const x=24+i*(bw()+0)+0,y=c.B-130;if(p.x>x&&p.x<x+bw()-8&&p.y>y&&p.y<y+100){
      pick=i;if(opts[i]===ans){c.setScore(c.sc+1);c.sfx('coin',1+c.sc*.03);fb=.4;fbc='#0f8';st='intro';tm=.7;c.after(700,round);if(c.sc===3)c.say('Cada vez más puntos…',1500)}else{st='wrong';lose()}
      return}}
  });
  c.loop((dt,t)=>{
    fb=Math.max(0,fb-dt);
    if(!c.dead){
      if(st==='show'){tm-=dt;if(tm<=0){st='ask';tl=Math.max(2,3.8-c.sc*.05)}}
      else if(st==='ask'){tl-=dt;if(tl<=0){st='wrong';lose()}}
    }
    c.bgGrad('#0a0a0f','#1a1030');
    const cy=(c.T+c.B)/2-60;
    if(st==='show'){dots.forEach(d=>{g.shadowColor=d.c;g.shadowBlur=22;c.circle(d.x,d.y,d.r,d.c);g.shadowBlur=0});c.rect(30,c.T+40,(c.W-60)*Math.max(0,tm/(.6+N*.1)),4,'#fff')}
    else if(st==='ask'||st==='wrong'){
      c.txt('¿CUÁNTOS?',c.W/2,cy,64,'#fff');
      for(let i=0;i<3;i++){const x=24+i*bw(),y=c.B-130,hit=pick===i&&st==='wrong';c.rect(x,y,bw()-8,100,hit?'rgba(255,60,60,.35)':'rgba(255,255,255,.07)',20);g.strokeStyle=st==='wrong'&&opts[i]===ans?'#0f8':'#ff5d73';g.lineWidth=3;g.beginPath();c.rr(x,y,bw()-8,100,20);g.stroke();c.txt(String(opts[i]),x+(bw()-8)/2,y+52,64,'#fff')}
      if(st==='ask'){c.rect(30,c.T+40,(c.W-60)*Math.max(0,tl/3.8),4,'#ff5d73')}
    }else c.txt(c.sc===0&&st==='intro'?'MIRA…':'🙂',c.W/2,cy,c.sc===0?72:60,'#fff');
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+14,22,'#ff5d73');
    if(fb>0){g.globalAlpha=fb*.5;g.fillStyle=fbc;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 33. BINARIO ============
def({id:'binary',title:'BINARIO',emoji:'💾',tag:'retro tech',hint:'👆 ENCIENDE interruptores para que sumen el número',
colors:['#d8cdb0','#a89a78','#ff7b00'],font:"'Share Tech Mono',monospace",
music:{bpm:126,root:45,scale:'minpent',lead:'square',bassw:'square',bass:'pulse',drums:'four',density:.45,vol:.09,len:.8,oct:2},
create(c){
  const g=c.g;let bits=4,on=[0,0,0,0,0,0],target=0,tl=8,lim=8,lives=3,flash=0,fc='#fff';
  const vals=()=>{const a=[];for(let i=bits-1;i>=0;i--)a.push(1<<i);return a};
  const sum=()=>{const v=vals();return v.reduce((s,x,i)=>s+(on[i]?x:0),0)};
  const nt=()=>{bits=c.sc>=12?6:c.sc>=5?5:4;on=[0,0,0,0,0,0];do{target=c.RI(1,(1<<bits)-1)}while(false);lim=tl=Math.max(4,9-c.sc*.15)};
  nt();
  const sw=()=>Math.min((c.W-30)/bits,72),sx0=()=>(c.W-sw()*bits)/2,sy=()=>(c.T+c.B)/2+70;
  const lose=()=>{lives--;c.sfx('hit');c.shake(8);flash=.25;fc='#f33';if(lives<=0){c.sfx('lose');c.over()}else nt()};
  c.down(p=>{
    if(c.dead)return;const i=Math.floor((p.x-sx0())/sw());if(i<0||i>=bits||Math.abs(p.y-sy())>90)return;
    on[i]=on[i]?0:1;c.sfx('tap',on[i]?1.3:.8);
    if(sum()===target){c.setScore(c.sc+1);c.sfx('win');flash=.2;fc='#ffe14d';c.burst(c.W/2,c.T+80,'#ff7b00',20);nt();if(c.sc===1)c.say('Suben de más a menos: 8·4·2·1',1800)}
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){tl-=dt;if(tl<=0)lose()}
    c.bgGrad('#d8cdb0','#a89a78');
    [[14,14],[c.W-14,14],[14,c.H-14],[c.W-14,c.H-14]].forEach(([x,y])=>{c.circle(x,y,6,'#7a6f54');c.rect(x-4,y-1,8,2,'#4b4332')});
    c.rect(24,c.T+14,c.W-48,100,'#15110d',14);g.strokeStyle='#4b4332';g.lineWidth=4;g.beginPath();c.rr(24,c.T+14,c.W-48,100,14);g.stroke();
    g.shadowColor='#ff7b00';g.shadowBlur=24;c.txt(String(target),c.W/2,c.T+66,80,'#ff9a2e');g.shadowBlur=0;
    c.rect(34,c.T+120,c.W-68,8,'#7a6f54',4);c.rect(34,c.T+120,(c.W-68)*Math.max(0,tl/lim),8,tl/lim>.3?'#2a9d8f':'#e63946',4);
    c.txt('TU SUMA = '+sum(),c.W/2,c.T+150,22,'#3b3322');
    const v=vals();
    for(let i=0;i<bits;i++){
      const x=sx0()+(i+.5)*sw(),y=sy(),w=sw()-10,o=on[i];
      c.txt(String(v[i]),x,y-84,28,'#3b3322');
      c.circle(x,y-52,8,o?'#ff3b30':'#5a1a16');if(o){g.shadowColor='#ff3b30';g.shadowBlur=16;c.circle(x,y-52,6,'#ff7a6b');g.shadowBlur=0}
      c.rect(x-w/2,y-34,w,110,'#2b2519',12);c.rect(x-w/2+4,y-30,w-8,102,'#3b3322',10);
      const ly=o?y-18:y+44;c.rect(x-w/2+8,ly-12,w-16,48,o?'#ff7b00':'#c9bfa4',10);c.rect(x-w/2+8,ly-12,w-16,10,'rgba(255,255,255,.35)',6);
      c.txt(o?'1':'0',x,y+96,26,'#3b3322');
    }
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-26-i*24,c.B+18,20,'#c1121f');
    if(flash>0){g.globalAlpha=flash;g.fillStyle=fc;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});
