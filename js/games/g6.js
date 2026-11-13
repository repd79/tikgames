// ============ 27. FUSIÓN 2048 ============
def({id:'merge',title:'FUSIÓN 2048',emoji:'🔢',tag:'números',hint:'👆 TOCA una columna para soltar la ficha. Las iguales se fusionan',
colors:['#fff4e0','#ffd9a8','#ff7a45'],font:"'Archivo Black',sans-serif",
music:{bpm:100,root:62,scale:'pent',lead:'triangle',bassw:'sine',bass:'off',drums:'tick',density:.45,vol:.14,len:1.5,oct:0,arp:true},
create(c){
  const g=c.g,COLS=5,ROWS=6;
  const cell=Math.min((c.W-24)/COLS,(c.PH-130)/ROWS),x0=(c.W-cell*COLS)/2,yb=c.B-8;
  let cols=[[],[],[],[],[]],hover=2;
  const mx=()=>{let m=2;cols.forEach(a=>a.forEach(v=>{if(v>m)m=v}));return m};
  const pick=()=>{const p=[2,2,4,4,8];const m=mx();if(m>=64)p.push(16);if(m>=256)p.push(32);return c.pick(p)};
  let cur=pick(),nxt=pick();
  const col=v=>'hsl('+((Math.log2(v)*38+14)%360)+',78%,58%)';
  function resolve(){
    let chain=0,gain=0;
    for(let guard=0;guard<40;guard++){
      let did=false;
      for(let ci=0;ci<COLS&&!did;ci++)for(let r=0;r<cols[ci].length&&!did;r++){
        const v=cols[ci][r];if(v==null)continue;
        const grp=[],st=[[ci,r]],vis={};
        while(st.length){const [a,b]=st.pop(),k=a*10+b;if(vis[k])continue;vis[k]=1;if(cols[a][b]!==v)continue;grp.push([a,b]);
          [[a+1,b],[a-1,b],[a,b+1],[a,b-1]].forEach(([p,q])=>{if(p>=0&&p<COLS&&q>=0&&q<cols[p].length)st.push([p,q])})}
        if(grp.length>=2){
          grp.sort((m,n)=>m[1]-n[1]);const t=grp[0];
          cols[t[0]][t[1]]=v*2;for(let i=1;i<grp.length;i++)cols[grp[i][0]][grp[i][1]]=null;
          chain++;gain+=v*2*chain;
          const px=x0+(t[0]+.5)*cell,py=yb-(t[1]+.5)*cell;
          c.burst(px,py,col(v*2),12);c.sfx('note',58+Math.min(26,Math.round(Math.log2(v)*3)+chain*2));
          if(chain>1)c.float('x'+chain,px,py-22,'#222');did=true;
        }
      }
      if(!did)break;cols=cols.map(a=>a.filter(v=>v!=null));
    }
    return gain;
  }
  const colAt=x=>c.clamp(Math.floor((x-x0)/cell),0,COLS-1);
  c.move(p=>{hover=colAt(p.x)});
  c.down(p=>{
    if(c.dead)return;const k=colAt(p.x);hover=k;
    if(cols[k].length>=ROWS){c.sfx('bump',.5);c.shake(5);return}
    cols[k].push(cur);c.sfx('tap',1.1);cur=nxt;
    const gain=resolve();nxt=pick();if(gain)c.setScore(c.sc+gain);
    if(cols.every(a=>a.length>=ROWS)){c.sfx('lose');c.over('¡Tablero lleno!')}
    if(c.sc>0&&c.sc<20)c.say('¡Iguales juntas = se fusionan!',1600);
  });
  const tile=(v,x,y,s)=>{c.rect(x-s/2+2,y-s/2+2,s-4,s-4,col(v),s*.16);c.rect(x-s/2+2,y-s/2+2,s-4,(s-4)*.35,'rgba(255,255,255,.22)',s*.16);c.txt(String(v),x,y+1,s*(v>999?.3:v>99?.38:.48),'#fff','center','rgba(0,0,0,.25)')};
  c.loop(()=>{
    c.bgGrad('#fff4e0','#ffd9a8');
    g.fillStyle='rgba(255,122,69,.07)';for(let i=0;i<8;i++)g.fillRect(0,i*c.H/8,c.W,c.H/16);
    c.rect(x0-6,yb-ROWS*cell-6,cell*COLS+12,cell*ROWS+12,'#3b2f2f',16);
    g.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<COLS;i++)if(i%2===0)g.fillRect(x0+i*cell,yb-ROWS*cell,cell,cell*ROWS);
    if(!c.dead){g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x0+hover*cell,yb-ROWS*cell,cell,cell*ROWS)}
    cols.forEach((a,ci)=>a.forEach((v,r)=>tile(v,x0+(ci+.5)*cell,yb-(r+.5)*cell,cell)));
    const ty=yb-ROWS*cell-cell*.75;
    if(!c.dead)tile(cur,x0+(hover+.5)*cell,ty,cell*.9);
    c.txt('SIGUE',c.W-46,c.T+36,13,'#3b2f2f');tile(nxt,c.W-46,c.T+66,cell*.6);
    c.txt('MAX '+mx(),24,c.T+80,16,'#3b2f2f','left');
  });
}});

// ============ 28. MATH RUN ============
def({id:'gates',title:'MATH RUN',emoji:'🏃',tag:'cálculo',hint:'👆 TOCA IZQ o DER: elige la puerta que deje el número más alto',
colors:['#031b34','#0a4d8c','#39ff88'],font:"'Rubik Mono One',sans-serif",
music:{bpm:132,root:50,scale:'major',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'four',density:.55,vol:.1,len:1,oct:1},
create(c){
  const g=c.g;let n=5,par=5,lane=0,px=0,gates=[],passed=0,sp=.32,flash=0,fc='#fff',idx=0;
  const cx=c.W/2,hz=c.T+50,py=()=>c.B-46;
  const lx=(l,k)=>cx+(l?1:-1)*(c.W*(.06+.18*k));
  const ap=(o,v)=>o.t==='+'?v+o.k:o.t==='−'?v-o.k:o.t==='×'?v*o.k:Math.floor(v/o.k);
  const mkop=()=>{const m=Math.max(4,Math.round(par*.6));const L=[{t:'+',k:c.RI(2,m)},{t:'×',k:c.pick([2,2,3])},{t:'−',k:c.RI(1,Math.max(2,Math.round(par*.5)))},{t:'÷',k:2},{t:'+',k:c.RI(2,m)}];return c.pick(L)};
  function spawn(){
    idx++;
    if(idx%5===0){const X=Math.max(6,Math.floor(par*.55));gates.push({z:1,boss:true,X});return}
    let a=mkop(),b=mkop(),tries=0;while(a.t===b.t&&a.k===b.k&&tries++<9)b=mkop();
    par=Math.max(1,Math.max(ap(a,par),ap(b,par)));gates.push({z:1,ops:[a,b]});
  }
  spawn();px=lx(0,1);
  c.down(p=>{if(c.dead)return;const nl=p.x<c.W/2?0:1;if(nl!==lane)c.sfx('whoosh');lane=nl});
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){
      sp=Math.min(.6,.32+passed*.008);
      px+=(lx(lane,1)-px)*Math.min(1,dt*14);
      gates.forEach(q=>q.z-=sp*dt);
      if(gates[gates.length-1].z<.5)spawn();
      const q=gates[0];
      if(q.z<=.02){
        gates.shift();
        if(q.boss){
          if(n>=q.X){passed++;c.setScore(passed);c.sfx('win');c.burst(cx,py()-40,'#39ff88',30,320);flash=.3;fc='#39ff88';c.float('¡JEFE VENCIDO!',cx,py()-90,'#39ff88')}
          else{c.sfx('lose');c.shake(12);flash=.4;fc='#ff3b3b';c.over('¡Muy débil! (necesitabas '+q.X+')')}
        }else{
          const o=q.ops[lane],nn=ap(o,n);n=nn;
          if(n<=0){c.sfx('lose');c.shake(12);flash=.4;fc='#ff3b3b';n=0;c.over('¡Te quedaste en 0!')}
          else{passed++;c.setScore(passed);const good=o.t==='+'||o.t==='×';c.sfx(good?'coin':'hit',good?1.2:.8);flash=.15;fc=good?'#39ff88':'#ff3b3b';c.burst(px,py(),fc,10);if(passed===3)c.say('Cada 5 puertas, un jefe',1800)}
        }
      }
    }
    c.bgGrad('#031b34','#0a4d8c');
    for(let i=0;i<30;i++){g.globalAlpha=.4;c.rect(((i*97)%c.W),(i*53)%(hz),2,2,'#fff')}g.globalAlpha=1;
    g.fillStyle='#0b2447';g.beginPath();g.moveTo(cx-c.W*.05,hz);g.lineTo(cx+c.W*.05,hz);g.lineTo(c.W,c.H);g.lineTo(0,c.H);g.fill();
    g.strokeStyle='rgba(57,255,136,.5)';g.lineWidth=3;g.beginPath();g.moveTo(cx-c.W*.05,hz);g.lineTo(0,c.H);g.moveTo(cx+c.W*.05,hz);g.lineTo(c.W,c.H);g.stroke();
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.setLineDash([14,18]);g.lineDashOffset=-(t*80);g.beginPath();g.moveTo(cx,hz);g.lineTo(cx,c.H);g.stroke();g.setLineDash([]);
    for(let i=gates.length-1;i>=0;i--){
      const q=gates[i],k=1-q.z;if(k<0)continue;const y=hz+(py()-hz)*k*k,s=.18+.82*k;
      if(q.boss){const w=c.W*(.1+.85*k),h=90*s;c.rect(cx-w/2,y-h,w,h,'rgba(255,59,59,.85)',10*s);c.txt('JEFE ≥'+q.X,cx,y-h/2,28*s+4,'#fff','center','rgba(0,0,0,.4)')}
      else for(let l=0;l<2;l++){
        const o=q.ops[l],good=o.t==='+'||o.t==='×',w=c.W*.4*s+8,h=80*s,x=lx(l,k);
        g.shadowColor=good?'#39a0ff':'#ff3b3b';g.shadowBlur=14*s;c.rect(x-w/2,y-h,w,h,good?'rgba(57,160,255,.85)':'rgba(255,59,59,.85)',10*s);g.shadowBlur=0;
        c.txt(o.t+o.k,x,y-h/2,34*s+3,'#fff','center','rgba(0,0,0,.35)');
      }
    }
    if(!c.dead){
      const y=py();c.rect(px-14,y-30,28,34,'#39ff88',8);c.circle(px,y-40,12,'#ffd6a5');c.rect(px-14,y-34,28,10,'#0a4d8c',4);
      const bw=Math.max(66,String(n).length*28);c.rect(px-bw/2,y-98,bw,40,'rgba(0,0,0,.6)',20);c.txt(String(n),px,y-78,30,'#fff');
      const leg=Math.sin(t*14)*8;g.strokeStyle='#39ff88';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(px-6,y+4);g.lineTo(px-6+leg,y+18);g.moveTo(px+6,y+4);g.lineTo(px+6-leg,y+18);g.stroke();
    }
    if(flash>0){g.globalAlpha=flash;g.fillStyle=fc;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
    c.txt('◀',c.W*.1,c.B+8,22,'rgba(255,255,255,.35)');c.txt('▶',c.W*.9,c.B+8,22,'rgba(255,255,255,.35)');
  });
}});

// ============ 29. LLUVIA DE NÚMEROS ============
def({id:'primes',title:'LLUVIA NUMÉRICA',emoji:'🌧️',tag:'matrix',hint:'👆 TOCA solo los números que cumplan la regla de arriba',
colors:['#000a02','#002a0c','#00ff66'],font:"'Space Mono',monospace",
music:{bpm:128,root:36,scale:'minor',lead:'square',bassw:'sawtooth',bass:'pulse',drums:'break',density:.35,vol:.1,len:.7,oct:2},
create(c){
  const g=c.g;
  const isP=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
  const RULES=[['PARES',n=>n%2===0],['MÚLTIPLOS DE 5',n=>n%5===0],['MAYORES QUE 60',n=>n>60],['MÚLTIPLOS DE 3',n=>n%3===0],['PRIMOS',isP],['IMPARES > 50',n=>n%2===1&&n>50]];
  let ri=0,hits=0,tiles=[],sp=.4,lives=3,flash=0,fc='#0f6';
  const cols=[];for(let i=0;i<14;i++)cols.push({x:i/14,o:Math.random(),s:.15+Math.random()*.3});
  const rule=()=>RULES[ri%RULES.length];
  const num=()=>{const want=Math.random()<.42;for(let i=0;i<40;i++){const n=c.RI(2,99);if(!!rule()[1](n)===want)return n}return c.RI(2,99)};
  const lose=(w)=>{lives--;flash=.25;fc='#f33';c.sfx('hit');c.shake(7);if(lives<=0){c.sfx('lose');c.over(w||'')}};
  c.down(p=>{
    if(c.dead)return;
    for(let i=tiles.length-1;i>=0;i--){const t=tiles[i];if(Math.abs(p.x-t.x)<34&&Math.abs(p.y-t.y)<28){
      if(rule()[1](t.n)){hits++;c.setScore(c.sc+1);c.sfx('note',60+(t.n%12)+7);c.burst(t.x,t.y,'#00ff66',10);tiles.splice(i,1);
        if(hits%8===0){ri++;tiles=[];c.say('¡NUEVA REGLA!',1500);c.sfx('win')}}
      else{tiles.splice(i,1);lose('¡Número equivocado!')}
      return}}
  });
  c.loop((dt,t)=>{
    flash=Math.max(0,flash-dt);
    if(!c.dead){
      sp-=dt;if(sp<=0){sp=Math.max(.42,.95-c.sc*.012);tiles.push({x:c.R(40,c.W-40),y:c.T+40,n:num(),v:c.R(80,120)+c.sc*1.6})}
      for(let i=tiles.length-1;i>=0;i--){const q=tiles[i];q.y+=q.v*dt;if(q.y>c.B){tiles.splice(i,1);if(rule()[1](q.n))lose('¡Se te escapó uno!')}}
    }
    c.bgGrad('#000a02','#002a0c');
    g.font='14px "Space Mono",monospace';g.textAlign='center';
    cols.forEach(k=>{for(let j=0;j<18;j++){const y=((k.o*c.H+t*k.s*c.H*1+j*22)%c.H);g.fillStyle='rgba(0,255,102,'+(.05+.2*(1-j/18))+')';g.fillText(String((j*7+Math.floor(k.x*99))%10),k.x*c.W+10,y)}});
    c.rect(0,c.B-3,c.W,3,'#00ff66');
    c.rect(10,c.T+4,c.W-20,34,'rgba(0,255,102,.15)',8);c.txt('> '+rule()[0],c.W/2,c.T+21,18,'#00ff66');
    for(const q of tiles){c.glow('#00ff66',8);c.rect(q.x-30,q.y-22,60,44,'rgba(0,40,12,.9)',8);g.strokeStyle='#00ff66';g.lineWidth=2;g.beginPath();c.rr(q.x-30,q.y-22,60,44,8);g.stroke();c.noglow();c.txt(String(q.n),q.x,q.y+1,26,'#caffd9')}
    for(let i=0;i<3;i++)c.txt(i<lives?'♥':'♡',c.W-20-i*24,c.T+54,20,'#00ff66');
    if(flash>0){g.globalAlpha=flash;g.fillStyle=fc;g.fillRect(0,0,c.W,c.H);g.globalAlpha=1}
  });
}});

// ============ 30. MAYOR O MENOR ============
def({id:'hilo',title:'MAYOR O MENOR',emoji:'🃏',tag:'casino',hint:'👆 MITAD SUPERIOR = mayor · MITAD INFERIOR = menor',
colors:['#052e16','#0c5a2a','#ffd166'],font:"'Abril Fatface',serif",
music:{bpm:92,root:48,scale:'blues',lead:'triangle',bassw:'triangle',bass:'walk',drums:'half',density:.4,vol:.14,len:1.5,oct:1,swing:.3},
create(c){
  const g=c.g,LB=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'],SU=['♠','♥','♦','♣'];
  let cur=c.RI(1,13),su=c.RI(0,3),nxt=null,nsu=0,st='ask',tm=3.4,lim=3.4,flip=0,res=0,streak=0;
  const decide=up=>{
    if(c.dead||st!=='ask')return;
    do{nxt=c.RI(1,13)}while(nxt===cur);nsu=c.RI(0,3);st='flip';flip=0;
    const ok=(nxt>cur)===up;res=ok?1:-1;
    c.after(550,()=>{
      if(ok){streak++;c.setScore(streak);c.sfx('coin',1+Math.min(streak,10)*.05);c.burst(c.W/2,(c.T+c.B)/2,'#ffd166',14);if(streak===3)c.say('¡Racha!',1200)}
      else{c.sfx('lose');c.shake(10);c.over('Era '+LB[nxt])}
    });
    c.after(1250,()=>{if(res===1){cur=nxt;su=nsu;nxt=null;st='ask';lim=Math.max(1.6,3.4-streak*.12);tm=lim}});
  };
  c.down(p=>decide(p.y<(c.T+c.B)/2));
  const card=(v,s,x,y,w,h,sx)=>{
    g.save();g.translate(x,y);g.scale(sx,1);g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=22;c.rect(-w/2,-h/2,w,h,'#fffdf5',16);g.shadowBlur=0;
    const r=s===1||s===2;c.txt(LB[v],0,-8,h*.34,r?'#d62828':'#111');c.txt(SU[s],0,h*.26,h*.22,r?'#d62828':'#111');
    c.txt(LB[v],-w/2+20,-h/2+26,22,r?'#d62828':'#111');c.txt(SU[s],-w/2+20,-h/2+50,18,r?'#d62828':'#111');g.restore();
  };
  c.loop((dt,t)=>{
    if(!c.dead&&st==='ask'){tm-=dt;if(tm<=0){c.sfx('lose');st='x';c.over('¡Tiempo!')}}
    if(st==='flip')flip=Math.min(1,flip+dt*2.6);
    c.bgGrad('#052e16','#0c5a2a');
    const vg=g.createRadialGradient(c.W/2,c.H/2,40,c.W/2,c.H/2,c.H*.7);vg.addColorStop(0,'rgba(255,255,255,.08)');vg.addColorStop(1,'rgba(0,0,0,.5)');g.fillStyle=vg;g.fillRect(0,0,c.W,c.H);
    const cy=(c.T+c.B)/2,hp=(13-cur)/12,lp=(cur-1)/12;
    g.strokeStyle='rgba(255,209,102,.5)';g.lineWidth=3;g.beginPath();c.rr(18,c.T+6,c.W-36,c.B-c.T-12,26);g.stroke();
    c.txt('▲ MAYOR',c.W/2,c.T+44,24,'#ffd166');c.txt(Math.round(hp*100)+'%',c.W/2,c.T+74,20,'rgba(255,255,255,.7)');
    c.txt('▼ MENOR',c.W/2,c.B-44,24,'#ffd166');c.txt(Math.round(lp*100)+'%',c.W/2,c.B-74,20,'rgba(255,255,255,.7)');
    if(st==='flip'||st==='x'){const k=Math.abs(Math.cos(Math.min(1,flip)*3.1416/2*0+0));}
    const cw=140,ch=196;
    if(st==='ask')card(cur,su,c.W/2,cy,cw,ch,1);
    else{const k=flip;if(k<.5)card(cur,su,c.W/2,cy,cw,ch,1-k*2);else card(nxt,nsu,c.W/2,cy,cw,ch,(k-.5)*2)}
    if(st==='ask'){c.rect(40,c.T+90,c.W-80,6,'rgba(255,255,255,.15)',3);c.rect(40,c.T+90,(c.W-80)*Math.max(0,tm/lim),6,tm/lim>.35?'#ffd166':'#e63946',3)}
  });
}});
