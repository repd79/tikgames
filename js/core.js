// Núcleo: feed vertical con snap, favoritos, ciclo de vida de cada juego
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem('tg_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('tg_'+k,JSON.stringify(v))}catch(e){}}};

// Orden del feed (los ids que no estén aquí se añaden al final en orden de carga)
const ORDER=['stack','lava','merge','orbit','egg','traffic','gravity','disco','gates','worm','sushi','shell','cloud','pinball','primes','bridge','western','ink','chameleon','ghost','hilo','candy','mole','binary','pizza','tightrope','sum10','road','frogs','count','numbers','ice','lander','bakery','zoo','bubbles'];
const BY={};GAMES.forEach(g=>BY[g.id]=g);
const LIST=ORDER.map(i=>BY[i]).filter(Boolean).concat(GAMES.filter(g=>ORDER.indexOf(g.id)<0));

const feed=$('#feed');
let favs=store.get('favs',[]),mode='all',started=false,active=null,cards=[],lastIdx=0,wt=0;

function roundRect(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

function safe(){const p=$('#probe'),s=getComputedStyle(p);return{t:parseFloat(s.paddingTop)||0,b:parseFloat(s.paddingBottom)||0}}

// ---------- Ejecución de un juego ----------
function mount(card){
  const g=card._g,stage=$('.stage',card),hudScore=$('.score',card),hintEl=$('.hint',card),toastEl=$('.toast',card),overEl=$('.over',card);
  const cv=document.createElement('canvas');
  cv.style.cssText='width:100%;height:100%;display:block;touch-action:pan-y';
  stage.appendChild(cv);
  const g2=cv.getContext('2d');
  let hs={down:[],move:[],up:[]},loops=[],timers=[],parts=[],floats=[],ptr={};
  let raf=0,last=0,shakeA=0,alive=true,inputSeen=false,overReady=0,toastT=0,dpr=1;
  const R=Math.random;
  const c={id:g.id,cv,g:g2,W:0,H:0,T:0,B:0,PH:0,dead:false,t:0,sc:0,best:store.get('best_'+g.id,0),ptr};

  function size(){
    const r=card.getBoundingClientRect(),s=safe();
    dpr=Math.min(window.devicePixelRatio||1,2);
    c.W=Math.round(r.width);c.H=Math.round(r.height);
    cv.width=c.W*dpr;cv.height=c.H*dpr;
    c.T=s.t+54;c.B=c.H-84-s.b;c.PH=c.B-c.T;
  }
  size();

  // utilidades
  c.R=(a,b)=>a+R()*(b-a); c.RI=(a,b)=>a+Math.floor(R()*(b-a+1)); c.pick=a=>a[Math.floor(R()*a.length)];
  c.clamp=(v,a,b)=>v<a?a:v>b?b:v; c.lerp=(a,b,t)=>a+(b-a)*t;
  c.loop=f=>loops.push(f); c.down=f=>hs.down.push(f); c.move=f=>hs.move.push(f); c.up=f=>hs.up.push(f);
  c.after=(ms,f)=>{const id=setTimeout(()=>{if(alive)f()},ms);timers.push(id);return id};
  c.setScore=n=>{c.sc=n;hudScore.textContent=n;hudScore.classList.remove('pop');void hudScore.offsetWidth;hudScore.classList.add('pop')};
  c.sfx=(n,p)=>window.Aud.sfx(n,p);
  c.vib=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};
  c.shake=n=>{shakeA=Math.max(shakeA,n)};
  c.say=(t,ms)=>{toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('on'),ms||2200)};
  c.rr=(x,y,w,h,r)=>roundRect(g2,x,y,w,h,r);
  c.rect=(x,y,w,h,col,r)=>{g2.fillStyle=col;if(r){g2.beginPath();roundRect(g2,x,y,w,h,r);g2.fill()}else g2.fillRect(x,y,w,h)};
  c.circle=(x,y,r,col)=>{g2.fillStyle=col;g2.beginPath();g2.arc(x,y,Math.max(0,r),0,6.2832);g2.fill()};
  c.f=s=>s+'px '+g.font;
  c.txt=(s,x,y,size,col,al,stroke)=>{g2.font=c.f(size);g2.textAlign=al||'center';g2.textBaseline='middle';if(stroke){g2.lineWidth=Math.max(2,size/7);g2.strokeStyle=stroke;g2.lineJoin='round';g2.strokeText(s,x,y)}g2.fillStyle=col||'#fff';g2.fillText(s,x,y)};
  c.emoji=(s,x,y,size,rot)=>{g2.save();g2.translate(x,y);if(rot)g2.rotate(rot);g2.font=size+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';g2.textAlign='center';g2.textBaseline='middle';g2.fillStyle='#000';g2.fillText(s,0,0);g2.restore()};
  c.bgGrad=(a,b,mid)=>{const gr=g2.createLinearGradient(0,0,0,c.H);gr.addColorStop(0,a);if(mid)gr.addColorStop(.5,mid);gr.addColorStop(1,b);g2.fillStyle=gr;g2.fillRect(0,0,c.W,c.H)};
  c.glow=(col,b)=>{g2.shadowColor=col;g2.shadowBlur=b};
  c.noglow=()=>{g2.shadowBlur=0};
  c.burst=(x,y,col,n,sp)=>{n=n||14;sp=sp||220;for(let i=0;i<n;i++){const a=R()*6.283,s=sp*(.3+R()*.7);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.5+R()*.4,col,r:2+R()*3})}};
  c.float=(txt,x,y,col)=>floats.push({txt,x,y,col:col||'#fff',life:.9});

  c.over=(title,sub)=>{
    if(c.dead)return;c.dead=true;
    const nb=c.sc>c.best&&c.sc>0;if(nb){c.best=c.sc;store.set('best_'+g.id,c.best)}
    c.after(520,()=>{
      $('.ot',overEl).textContent=title||'GAME OVER';
      $('.os',overEl).textContent=c.sc;
      $('.ob',overEl).textContent=nb?'🏆 ¡NUEVO RÉCORD!':('Récord: '+c.best)+(sub?' · '+sub:'');
      overEl.classList.add('show');overReady=performance.now()+450;
    });
  };
  function clearAll(){timers.forEach(clearTimeout);timers=[];hs={down:[],move:[],up:[]};loops=[];parts=[];floats=[];for(const k in ptr)delete ptr[k]}
  c.restart=()=>{
    clearAll();c.dead=false;c.t=0;overEl.classList.remove('show');toastEl.classList.remove('on');
    cv.style.transform='';c.setScore(0);start();
  };
  overEl.onpointerdown=e=>{e.stopPropagation();if(c.dead&&overReady&&performance.now()>overReady){overReady=0;c.restart()}};

  function start(){try{g.create(c)}catch(e){console.error('['+g.id+']',e)}}

  // entrada
  function P(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,id:e.pointerId}}
  function firstInput(){if(inputSeen)return;inputSeen=true;setTimeout(()=>hintEl.classList.remove('on'),1500)}
  cv.addEventListener('pointerdown',e=>{firstInput();const p=P(e);ptr[p.id]=p;try{cv.setPointerCapture(e.pointerId)}catch(_){}hs.down.slice().forEach(f=>f(p))});
  cv.addEventListener('pointermove',e=>{const p=P(e);if(ptr[p.id]){ptr[p.id]=p;hs.move.slice().forEach(f=>f(p))}});
  const end=e=>{const p=P(e);if(ptr[p.id]){delete ptr[p.id];hs.up.slice().forEach(f=>f(p))}};
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);

  // bucle
  function frame(ts){
    if(!alive)return;raf=requestAnimationFrame(frame);
    const dt=Math.min(.05,(ts-last)/1000||0);last=ts;c.t+=dt;
    g2.setTransform(dpr,0,0,dpr,0,0);g2.globalAlpha=1;g2.shadowBlur=0;g2.lineWidth=1;g2.setLineDash([]);
    const ls=loops.slice();
    for(let i=0;i<ls.length;i++){try{ls[i](dt,c.t)}catch(e){console.error('['+g.id+']',e);loops=loops.filter(f=>f!==ls[i])}}
    g2.shadowBlur=0;g2.globalAlpha=1;
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];p.life-=dt;if(p.life<=0){parts.splice(i,1);continue}
      p.vy+=520*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;g2.globalAlpha=Math.min(1,p.life*2.2);g2.fillStyle=p.col;g2.fillRect(p.x-p.r/2,p.y-p.r/2,p.r,p.r);
    }
    g2.globalAlpha=1;
    for(let i=floats.length-1;i>=0;i--){
      const f=floats[i];f.life-=dt;if(f.life<=0){floats.splice(i,1);continue}
      f.y-=55*dt;g2.globalAlpha=Math.min(1,f.life*2);c.txt(f.txt,f.x,f.y,22,f.col,'center','rgba(0,0,0,.6)');
    }
    g2.globalAlpha=1;
    if(shakeA>.3){cv.style.transform='translate('+((R()-.5)*shakeA).toFixed(1)+'px,'+((R()-.5)*shakeA).toFixed(1)+'px)';shakeA-=shakeA*7*dt}
    else if(shakeA>0){shakeA=0;cv.style.transform=''}
  }

  // arranque
  hudScore.textContent='0';
  $('span',hintEl).textContent=g.hint||'';
  timers.push(setTimeout(()=>{if(!inputSeen)hintEl.classList.add('on')},500));
  timers.push(setTimeout(()=>hintEl.classList.remove('on'),6500));
  start();
  last=performance.now();raf=requestAnimationFrame(frame);

  return{
    destroy(){
      alive=false;cancelAnimationFrame(raf);timers.forEach(clearTimeout);clearTimeout(toastT);
      if(cv.parentNode)cv.parentNode.removeChild(cv);
      overEl.classList.remove('show');toastEl.classList.remove('on');hintEl.classList.remove('on');
    },
    resize(){const w0=c.W;size();if(Math.abs(c.W-w0)>40)c.restart()}
  };
}

// ---------- Tarjetas ----------
function makeCard(g){
  const el=document.createElement('section');el.className='card';el._g=g;
  el.style.setProperty('--c1',g.colors[0]);el.style.setProperty('--c2',g.colors[1]);el.style.setProperty('--ac',g.colors[2]);el.style.setProperty('--font',g.font);
  el.innerHTML='<div class="poster"><div class="pe">'+g.emoji+'</div><div class="pt">'+g.title+'</div><div class="ps">toca para jugar</div></div>'+
    '<div class="stage"></div><div class="hud"><div class="score"></div><div class="hint"><span></span></div><div class="toast"></div></div>'+
    '<div class="intro">'+g.title+'</div>'+
    '<div class="over"><div class="ot"></div><div class="os"></div><div class="ob"></div><div class="or">TOCA PARA REINTENTAR</div></div>'+
    '<div class="meta"><div><b>'+g.emoji+' '+g.title+'</b><span>#'+g.tag+'</span></div><button class="heart" aria-label="favorito">♥</button></div>';
  const hb=$('.heart',el);hb.classList.toggle('on',favs.indexOf(g.id)>=0);
  hb.addEventListener('pointerdown',e=>e.stopPropagation());
  hb.addEventListener('click',e=>{e.stopPropagation();toggleFav(g.id,hb)});
  el.addEventListener('contextmenu',e=>e.preventDefault());
  return el;
}
function endCard(){
  const el=document.createElement('section');el.className='card';el.style.setProperty('--c1','#111');el.style.setProperty('--c2','#2b1055');
  el.innerHTML='<div class="endcard"><div style="font-size:70px">✨</div><h2>¡Eso es todo por ahora!</h2><p style="opacity:.7">Pronto habrá más juegos.</p><button>↑ Volver al inicio</button></div>';
  $('button',el).onclick=()=>feed.scrollTo({top:0,behavior:'smooth'});
  return el;
}
function emptyCard(){
  const el=document.createElement('section');el.className='card';el.style.setProperty('--c1','#111');el.style.setProperty('--c2','#3a0a2b');
  el.innerHTML='<div class="endcard"><div style="font-size:70px">♥</div><h2>Aún no tienes favoritos</h2><p style="opacity:.7">Dale al corazón de los juegos que te gusten.</p><button>Ir a "Para ti"</button></div>';
  $('button',el).onclick=()=>setMode('all');
  return el;
}

function toggleFav(id,btn){
  const i=favs.indexOf(id),on=i<0;
  if(on)favs.push(id);else favs.splice(i,1);
  store.set('favs',favs);btn.classList.remove('on');void btn.offsetWidth;btn.classList.toggle('on',on);
  updateTabs();
  if(on){
    for(let k=0;k<6;k++){const h=document.createElement('div');h.className='fh';h.textContent='♥';h.style.right=(24+Math.random()*30)+'px';h.style.bottom='46px';h.style.setProperty('--dx',((Math.random()-.5)*80)+'px');h.style.animationDelay=(k*.04)+'s';btn.closest('.card').appendChild(h);setTimeout(()=>h.remove(),1100)}
  }
}
function updateTabs(){$('#tab-favs').textContent='Favoritos ♥'+(favs.length?' '+favs.length:'')}

function build(){
  io&&io.disconnect();feed.innerHTML='';cards=[];
  const list=mode==='favs'?LIST.filter(g=>favs.indexOf(g.id)>=0):LIST;
  if(!list.length){const e=emptyCard();feed.appendChild(e);cards.push(e);return}
  list.forEach(g=>{const el=makeCard(g);feed.appendChild(el);cards.push(el)});
  if(mode==='all'){const e=endCard();feed.appendChild(e);cards.push(e)}
  cards.forEach(el=>io&&io.observe(el));
}

// ---------- Activación ----------
function setActive(card){
  if(active&&active.card===card)return;
  if(active){active.run&&active.run.destroy();active.card.classList.remove('active');active=null}
  window.Aud.stop();
  if(!card)return;
  card.classList.add('active');
  if(card._g){active={card,run:mount(card)};window.Aud.play(card._g.music,card._g.id)}
  else active={card,run:null};
}
function curIdx(){return Math.max(0,Math.min(cards.length-1,Math.round(feed.scrollTop/(feed.clientHeight||1))))}
function want(card){clearTimeout(wt);wt=setTimeout(()=>{if(started)setActive(card)},90)}
const io=window.IntersectionObserver?new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting&&e.intersectionRatio>=.5)want(e.target)},{root:feed,threshold:[.5]}):null;
let st=0;
feed.addEventListener('scroll',()=>{
  if(feed.scrollTop>30)hideSwipe(true);
  clearTimeout(st);st=setTimeout(()=>{if(started&&cards[curIdx()])want(cards[curIdx()])},160);
},{passive:true});

function setMode(m){
  if(m===mode)return;
  if(mode==='all')lastIdx=curIdx();
  setActive(null);mode=m;build();
  $('#tab-all').classList.toggle('on',m==='all');$('#tab-favs').classList.toggle('on',m==='favs');
  feed.scrollTop=(m==='all'&&lastIdx)?lastIdx*feed.clientHeight:0;
  if(started)want(cards[curIdx()]);
}

// ---------- Pistas de swipe ----------
const swipeEl=$('#swipe');let swipeT=0;
function hideSwipe(done){swipeEl.classList.remove('on');clearTimeout(swipeT);if(done)store.set('swiped',true)}

// ---------- Arranque ----------
updateTabs();build();
$('#tab-all').onclick=()=>setMode('all');
$('#tab-favs').onclick=()=>setMode('favs');
const muteBtn=$('#mute');
window.Aud.on=!store.get('mute',false);muteBtn.textContent=window.Aud.on?'🔊':'🔇';
muteBtn.onclick=()=>{window.Aud.setOn(!window.Aud.on);store.set('mute',!window.Aud.on);muteBtn.textContent=window.Aud.on?'🔊':'🔇'};
$('#splash').addEventListener('click',()=>{
  if(started)return;started=true;window.Aud.init();window.Aud.resume();
  const sp=$('#splash');sp.classList.add('out');setTimeout(()=>sp.remove(),600);
  setActive(cards[curIdx()]);
  if(!store.get('swiped',false))swipeT=setTimeout(()=>{if(feed.scrollTop<30)swipeEl.classList.add('on')},5500);
});
document.addEventListener('pointerup',()=>window.Aud.resume(),{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)window.Aud.pause();else window.Aud.resume()});
window.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();feed.scrollBy({top:feed.clientHeight,behavior:'smooth'})}
  else if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();feed.scrollBy({top:-feed.clientHeight,behavior:'smooth'})}
});
let rt=0;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{active&&active.run&&active.run.resize()},200)});
window.TG={setMode,setActive,get cards(){return cards},get active(){return active},start(){document.getElementById('splash')&&document.getElementById('splash').click()}};
})();
