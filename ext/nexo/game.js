'use strict';
(() => {
const $=s=>document.querySelector(s),E=NexoEngine,KEY='nexo.progress.v1';
const COLORS=['#0ec477','#6a97f4','#ff73dc','#feb42d','#ff6978','#41b9ce','#a88aee','#d4824f','#8aba4c','#de8cbd','#6c9fa9','#c3a538'];
let profile={schema:1,level:1,score:0,sound:true,found:[],bonuses:[],puzzle:null,awards:{},paceStartedAt:null},memoryOnly=false;
try{const old=JSON.parse(localStorage.getItem(KEY));if(old?.schema===1){profile={...profile,...old};if(!Number.isInteger(profile.level)||profile.level<1||profile.level>1000000)profile.level=1;if(!Number.isFinite(profile.score)||profile.score<0)profile.score=0;profile.sound=profile.sound!==false;}}catch{}
let puzzle,path=[],bonusPath=[],hintPath=[],pointer=null,dragging=false,moved=false,lastPoint=null,gesture=null,bonusTimer,hintTimer,finishTimer,nextTimer,audio,focusIndex=0,completed=false;
const board=$('#board');
function seed(){const a=new Uint32Array(1);if(window.crypto?.getRandomValues){crypto.getRandomValues(a);return a[0];}return Math.floor(Math.random()*4294967296);}
function save(){profile.puzzle=puzzle;try{localStorage.setItem(KEY,JSON.stringify(profile));}catch{memoryOnly=true;}$('#saveState').textContent=memoryOnly?'◌ Se guarda solo en esta sesión':'◉ Progreso guardado';}
async function note(freq,duration=.18,delay=0,type='triangle',volume=.12){
 if(!profile.sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state!=='running')await audio.resume();const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);}catch{}
}
function stepSound(len){const scale=[0,2,4,5,7,9,11],step=len-1;note(261.63*2**((scale[step%7]+12*Math.floor(step/7))/12),.2);}
function winSound(final=false){(final?[0,4,7,12,16,19,24]:[0,4,7,12]).forEach((v,i)=>note(523.25*2**(v/12),.24,i*.075,'sine',.08));}
function message(text,kind=''){const p=$('#message');p.textContent=text;p.className='message '+kind;}
function owner(i){return profile.found.find(id=>puzzle.solutions[id].path.includes(i));}
function load(){
 clearTimeout(bonusTimer);clearTimeout(hintTimer);clearTimeout(finishTimer);clearTimeout(nextTimer);path=[];bonusPath=[];hintPath=[];pointer=null;dragging=false;completed=false;
 if(!E.validate(profile.puzzle)||profile.puzzle.level!==profile.level||profile.puzzle.target>E.config(profile.level).targetMax){puzzle=E.generate(profile.level,seed());profile.found=[];profile.bonuses=[];profile.awards={};profile.paceStartedAt=null;}else puzzle=profile.puzzle;
 profile.found=Array.isArray(profile.found)?[...new Set(profile.found.filter(id=>Number.isInteger(id)&&id>=0&&id<puzzle.solutions.length))]:[];
 profile.bonuses=Array.isArray(profile.bonuses)?profile.bonuses.filter(k=>typeof k==='string'):[];
 profile.awards=profile.awards&&typeof profile.awards==='object'&&!Array.isArray(profile.awards)?profile.awards:{};if(!Number.isFinite(profile.paceStartedAt)||profile.paceStartedAt<=0)profile.paceStartedAt=null;
 board.style.setProperty('--n',puzzle.n);board.style.setProperty('--gap',puzzle.n>5?'5px':'7px');
 board.querySelectorAll('.tile').forEach(t=>t.remove());
 puzzle.cells.forEach((n,i)=>{const t=document.createElement('button');t.className='tile';t.dataset.i=i;t.type='button';t.textContent=n;t.tabIndex=i===0?0:-1;board.append(t);});
 $('#paths').innerHTML=puzzle.solutions.map(s=>`<span class="path-chip" data-path="${s.id}">${s.path.length} números</span>`).join('');
 message('Arrastra por números vecinos y suelta al terminar.');render();save();requestAnimationFrame(fitBoard);
 if(profile.found.length===puzzle.solutions.length){completed=true;finishTimer=setTimeout(complete,150);}
}
function render(){
 $('#level').textContent=profile.level;$('#score').textContent=profile.score.toLocaleString('es');$('#target').textContent=puzzle.target;
 $('#boardLabel').textContent=`${puzzle.n} × ${puzzle.n} · ${Math.min(...puzzle.solutions.map(s=>s.path.length))}–${Math.max(...puzzle.solutions.map(s=>s.path.length))} por camino`;
 $('#counter').textContent=`${profile.found.length} / ${puzzle.solutions.length}${profile.bonuses.length?' · ✦ '+profile.bonuses.length:''}`;
 const percent=profile.found.length/puzzle.solutions.length*100;$('#progressFill').style.width=percent+'%';$('.progress').setAttribute('aria-valuenow',String(Math.round(percent)));
 $('#sound').textContent=profile.sound?'♫':'♪';$('#sound').setAttribute('aria-label',profile.sound?'Silenciar sonido':'Activar sonido');$('#sound').setAttribute('aria-pressed',String(profile.sound));
 const sum=path.reduce((s,i)=>s+puzzle.cells[i],0),current=$('#currentSum');current.textContent=path.length?`${path.map(i=>puzzle.cells[i]).join(' + ')} = ${sum}`:'Une números vecinos';current.className=path.length?(sum>puzzle.target?'over':sum===puzzle.target?'exact':''):'';
 board.querySelectorAll('.tile').forEach((t,i)=>{
  const id=owner(i),found=id!==undefined;t.classList.toggle('found',found);t.classList.toggle('selected',path.includes(i));t.classList.toggle('bonus-flash',bonusPath.includes(i)&&!found);t.classList.toggle('hint',hintPath.includes(i));
  t.setAttribute('aria-label',`${puzzle.cells[i]}, fila ${Math.floor(i/puzzle.n)+1}, columna ${i%puzzle.n+1}${found?', camino completado':''}`);t.setAttribute('aria-pressed',String(path.includes(i)));t.setAttribute('aria-disabled',String(found));
  if(found)t.style.setProperty('--color',COLORS[id%COLORS.length]);else t.style.removeProperty('--color');
 });
 puzzle.solutions.forEach(s=>{const t=$(`[data-path="${s.id}"]`),found=profile.found.includes(s.id);t.classList.toggle('found',found);t.textContent=found?`✓ ${s.path.length} números`:`${s.path.length} números`;t.style.setProperty('--color',COLORS[s.id%COLORS.length]);});
 $('#check').disabled=path.length<2||completed;$('#hint').disabled=completed;$('#undo').disabled=!profile.found.length||completed;
 drawLines();
}
function drawLines(){
 const r=board.getBoundingClientRect(),svg=$('#connections');if(!r.width)return;
 svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);svg.innerHTML='';
 const groups=profile.found.map(id=>({path:puzzle.solutions[id].path,color:COLORS[id%COLORS.length]}));if(path.length>1)groups.push({path,color:'#e2ec95'});if(bonusPath.length>1)groups.push({path:bonusPath,color:'#33b9c6'});
 for(const g of groups){const p=document.createElementNS('http://www.w3.org/2000/svg','polyline');p.setAttribute('points',g.path.map(i=>{const t=board.querySelector(`[data-i="${i}"]`).getBoundingClientRect();return `${t.x+t.width/2-r.x},${t.y+t.height/2-r.y}`;}).join(' '));p.setAttribute('stroke',g.color);p.setAttribute('stroke-width',Math.max(6,r.width/puzzle.n*.21));svg.append(p);}
}
function fitBoard(){const width=$('.board-wrap').clientWidth,game=$('.game').getBoundingClientRect(),height=board.getBoundingClientRect().height,overhead=game.height-height;const available=window.innerHeight-Math.max(0,game.top)-overhead-16;const side=Math.floor(Math.min(width,Math.max(puzzle.n*25,available)));board.style.width=side+'px';board.style.setProperty('--number',Math.max(20,Math.min(66,side/puzzle.n*.46))+'px');drawLines();}
function add(i){
 if(!Number.isInteger(i)||i<0||i>=puzzle.cells.length||owner(i)!==undefined)return false;
 if(path.length>1&&path.at(-2)===i){path.pop();render();return true;}
 if(path.includes(i)||(path.length&&!E.adjacent(path.at(-1),i,puzzle.n)))return false;
 path.push(i);stepSound(path.length);hintPath=[];render();return true;
}
function clear(){path=[];render();}
function start(i,extend=false){if(completed||owner(i)!==undefined)return false;if(!profile.paceStartedAt){profile.paceStartedAt=Date.now();save();}clearTimeout(bonusTimer);bonusPath=[];if(!extend)path=[];add(i);return true;}
function finish(){
 if(completed||path.length<2)return;
 const drawn=[...path],result=E.resolve(puzzle,drawn,profile.found,profile.bonuses);path=[];
 if(result.kind==='solution'){
  const speed=E.speedPoints(drawn.length,Date.now()-(profile.paceStartedAt||Date.now())),points=result.points+speed;profile.awards[result.id]=points;profile.paceStartedAt=Date.now();profile.found.push(result.id);profile.score+=points;save();render();winSound();message(speed?`¡Camino encontrado! +${speed} puntos extra por rapidez.`:'¡Camino encontrado! Se queda de su color.','success');reward(points,false,speed);if(navigator.vibrate)navigator.vibrate(25);
  if(profile.found.length===puzzle.solutions.length){completed=true;render();finishTimer=setTimeout(complete,250);}
 }else if(result.kind==='bonus'){
  profile.bonuses.push(result.key);profile.score+=result.points;bonusPath=drawn;save();render();message('¡Bonus! La suma vale. Las casillas siguen libres.','bonus');reward(result.points,true);[0,7,12].forEach((v,i)=>note(440*2**(v/12),.2,i*.08));bonusTimer=setTimeout(()=>{bonusPath=[];render();},1000);
 }else if(result.kind==='duplicate'){
  render();message('Ese camino bonus ya ha puntuado. Prueba otro recorrido.','bonus');
 }else{
  render();message(`${drawn.map(i=>puzzle.cells[i]).join(' + ')} = ${result.sum??drawn.reduce((s,i)=>s+puzzle.cells[i],0)}. Busca ${puzzle.target}.`);board.classList.add('shake');setTimeout(()=>board.classList.remove('shake'),300);note(175,.12,0,'sine',.06);
 }
}
function reward(points,bonus=false,speed=0){const e=$('#reward');e.textContent=(bonus?'BONUS +':'+')+points+' ✦'+(speed?' · +'+speed+' rapidez':'');e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function confetti(){const e=$('#confetti');e.innerHTML='';for(let i=0;i<40;i++){const c=document.createElement('i');c.style.cssText=`left:${Math.random()*100}%;background:${COLORS[i%COLORS.length]};--drift:${Math.random()*200-100}px;animation-delay:${Math.random()*.3}s;border-radius:${i%2?50:2}%`;e.append(c);}setTimeout(()=>e.innerHTML='',2500);}
function modal(html){$('#modalContent').innerHTML=html;if(!$('#modal').open)$('#modal').showModal();}
function complete(){
 completed=true;winSound(true);confetti();modal(`<div class="big">✺</div><span class="eyebrow">NIVEL ${profile.level} COMPLETADO</span><h2 id="modalTitle">¡Todo de colores!</h2><div class="stars">★★★</div><p>Todos los caminos suman ${puzzle.target}.<br>En un momento, otro objetivo…</p><div class="result"><div><b>${puzzle.solutions.length}</b><small>caminos</small></div><div><b>${profile.bonuses.length}</b><small>bonus</small></div></div><button class="primary" id="nextLevel">Siguiente nivel →</button>`);
 const finishedLevel=profile.level;
 const advance=()=>{if(profile.level!==finishedLevel||!completed)return;clearTimeout(nextTimer);const old=puzzle.target;profile.level++;profile.puzzle=null;profile.found=[];profile.bonuses=[];profile.awards={};profile.paceStartedAt=null;let fresh;do{fresh=E.generate(profile.level,seed());}while(fresh.target===old);profile.puzzle=fresh;$('#modal').close();load();note(523.25,.18);};
 $('#nextLevel').onclick=advance;nextTimer=setTimeout(advance,1500);
}
$('#help').onclick=()=>{
 if(completed)return;modal('<div class="big">☝</div><h2 id="modalTitle">Un número lleva a otro</h2><p>Une números vecinos, arriba, abajo, izquierda o derecha. Puedes girar. No puedes saltar, ir en diagonal ni repetir una casilla.</p><p>El total debe ser el objetivo de arriba. Los caminos oficiales se quedan de un color: todos juntos llenan el tablero.</p><p>Otras sumas válidas dan puntos bonus y se apagan al momento para mantener la solución. Un bonus cuenta una sola vez, también si lo haces al revés.</p><p>Cada número de un camino oficial da 10 puntos. Encontrarlo rápido da hasta un 50 % extra. No hay cuenta atrás: los puntos base siempre cuentan.</p><p>Arrastra y suelta, o toca las casillas y pulsa Comprobar. Con teclado: Espacio empieza, flechas añaden vecinos, Intro comprueba y Escape cancela. Deshacer libera el último camino oficial.</p><button class="primary" id="closeHelp">¡Entendido!</button>');$('#closeHelp').onclick=()=>$('#modal').close();
};
$('#sound').onclick=()=>{profile.sound=!profile.sound;save();render();if(profile.sound)note(660,.2);};
$('#check').onclick=()=>finish();
$('#hint').onclick=()=>{
 if(completed)return;clearTimeout(hintTimer);clear();const s=puzzle.solutions.find(s=>!profile.found.includes(s.id));if(!s)return;hintPath=[s.path[0]];render();message(`Aquí empieza un camino de ${s.path.length} números que suman ${puzzle.target}.`);hintTimer=setTimeout(()=>{hintPath=[];render();},3500);
};
$('#undo').onclick=()=>{if(completed)return;const id=profile.found.pop();if(id===undefined)return;profile.score=Math.max(0,profile.score-(profile.awards[id]||puzzle.solutions[id].path.length*10));delete profile.awards[id];profile.paceStartedAt=Date.now();clear();save();message('Camino libre. Sus puntos se han descontado.');};
$('#another').onclick=()=>{
 if(completed)return;modal('<h2 id="modalTitle">¿Otro tablero?</h2><p>Conservas tu nivel y los puntos ganados. Esta partida se cambia por otra con un nuevo objetivo.</p><button class="primary" id="confirmAnother">Otro tablero del mismo nivel</button><button class="secondary" id="cancelAnother">Seguir con este</button>');$('#cancelAnother').onclick=()=>$('#modal').close();$('#confirmAnother').onclick=()=>{const old=puzzle.target;let fresh;do{fresh=E.generate(profile.level,seed());}while(fresh.target===old);profile.puzzle=fresh;profile.found=[];profile.bonuses=[];profile.awards={};profile.paceStartedAt=null;$('#modal').close();load();};
};
board.addEventListener('pointerdown',e=>{
 if(e.button!==0||pointer!==null||completed)return;const t=e.target.closest('[data-i]');if(!t)return;const i=Number(t.dataset.i);if(owner(i)!==undefined)return;
 e.preventDefault();gesture={start:i,prefix:[...path],x:e.clientX,y:e.clientY};const extend=path.length>0&&(E.adjacent(path.at(-1),i,puzzle.n)||path.at(-1)===i);if(path.at(-1)!==i||!extend)start(i,extend);
 pointer=e.pointerId;dragging=true;moved=false;lastPoint=[e.clientX,e.clientY];board.setPointerCapture(pointer);
});
board.addEventListener('pointermove',e=>{
 if(!dragging||e.pointerId!==pointer)return;e.preventDefault();
 if(!moved&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8){moved=true;if(gesture.prefix.length){path=[];add(gesture.start);}}
 const prev=lastPoint||[e.clientX,e.clientY],dx=e.clientX-prev[0],dy=e.clientY-prev[1],steps=Math.min(100,Math.max(1,Math.ceil(Math.hypot(dx,dy)/6)));
 for(let k=1;k<=steps;k++){const t=document.elementFromPoint(prev[0]+dx*k/steps,prev[1]+dy*k/steps)?.closest('[data-i]');if(moved&&t&&board.contains(t)&&Number(t.dataset.i)!==path.at(-1))add(Number(t.dataset.i));}
 lastPoint=[e.clientX,e.clientY];
});
board.addEventListener('pointerup',e=>{
 if(e.pointerId!==pointer)return;pointer=null;dragging=false;lastPoint=null;if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId);
 if(moved&&path.length<2){clear();message('Une al menos dos números vecinos, sin diagonales.');}else if(moved||(path.length>=2&&path.reduce((s,i)=>s+puzzle.cells[i],0)===puzzle.target))finish();gesture=null;
});
board.addEventListener('pointercancel',()=>{pointer=null;dragging=false;lastPoint=null;clear();message('Gesto cancelado. Puedes volver a empezar.');});
board.addEventListener('lostpointercapture',()=>{pointer=null;dragging=false;lastPoint=null;});
board.addEventListener('click',e=>e.preventDefault());
board.addEventListener('keydown',e=>{
 const t=e.target.closest('[data-i]');if(!t||completed)return;const i=Number(t.dataset.i),moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-puzzle.n,ArrowDown:puzzle.n};
 if(e.key in moves){e.preventDefault();const j=i+moves[e.key];if(E.adjacent(i,j,puzzle.n)){focusIndex=j;board.querySelectorAll('.tile').forEach((b,k)=>b.tabIndex=k===j?0:-1);board.querySelector(`[data-i="${j}"]`).focus();if(path.length)add(j);}}
 else if(e.key===' '){e.preventDefault();if(!path.length)start(i);else add(i);}
 else if(e.key==='Enter'){e.preventDefault();if(path.length>=2)finish();else if(!path.length)start(i);}
 else if(e.key==='Escape'){e.preventDefault();clear();message('Elige otro camino.');}
 else if(e.key==='Backspace'){e.preventDefault();path.pop();render();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&!$('#modal').open&&!completed){clear();message('Elige otro camino.');}});
$('#modal').addEventListener('cancel',e=>{if(completed)e.preventDefault();});
new ResizeObserver(fitBoard).observe($('.game'));window.addEventListener('resize',fitBoard);
window.Nexo={getState:()=>({puzzle:JSON.parse(JSON.stringify(puzzle)),found:[...profile.found],bonuses:[...profile.bonuses],path:[...path],score:profile.score,level:profile.level,sound:profile.sound,completed,awards:{...profile.awards},paceStartedAt:profile.paceStartedAt}),version:'1.0.1'};
load();
})();
