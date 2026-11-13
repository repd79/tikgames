// Audio procedural: efectos + música generativa distinta por juego (sin ficheros de audio)
(function(){
'use strict';
const A=window.Aud={ac:null,on:true,timer:0,mus:null};
const SC={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],phrygian:[0,1,3,5,7,8,10],lydian:[0,2,4,6,7,9,11],pent:[0,2,4,7,9],minpent:[0,3,5,7,10],blues:[0,3,5,6,7,10],whole:[0,2,4,6,8,10],harm:[0,2,3,5,7,8,11],hira:[0,2,3,7,8]};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(str){let h=7;for(let i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))|0;return h}

A.init=function(){
  if(A.ac)return;
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
  const ac=A.ac=new AC();
  const m=A.master=ac.createGain(); m.gain.value=A.on?0.85:0;
  const comp=ac.createDynamicsCompressor(); m.connect(comp); comp.connect(ac.destination);
  A.mg=ac.createGain(); A.mg.gain.value=.55; A.mg.connect(m);
  A.sg=ac.createGain(); A.sg.gain.value=.8; A.sg.connect(m);
  const b=ac.createBuffer(1,ac.sampleRate,ac.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  A.nb=b;
};
A.resume=function(){if(A.ac&&A.ac.state==='suspended')A.ac.resume()};
A.pause=function(){if(A.ac&&A.ac.state==='running')A.ac.suspend()};
A.setOn=function(v){A.on=v;if(A.master)A.master.gain.setTargetAtTime(v?.85:0,A.ac.currentTime,.02)};

function tone(dest,f,t,dur,type,vol,slide,att){
  const ac=A.ac,o=ac.createOscillator(),g=ac.createGain();
  o.type=type||'sine'; o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+dur);
  g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(vol,t+(att||.005));
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t+dur+.03);
}
function noise(dest,t,dur,vol,hp){
  const ac=A.ac,s=ac.createBufferSource(); s.buffer=A.nb;
  const f=ac.createBiquadFilter(); f.type=hp?'highpass':'lowpass'; f.frequency.value=hp||1500;
  const g=ac.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f); f.connect(g); g.connect(dest); s.start(t); s.stop(t+dur+.03);
}
A.sfx=function(n,p){
  if(!A.ac||!A.on)return; p=p||1; const t=A.ac.currentTime,d=A.sg;
  switch(n){
    case 'tap':tone(d,520*p,t,.07,'square',.22);break;
    case 'coin':tone(d,880*p,t,.07,'square',.2);tone(d,1320*p,t+.07,.14,'square',.2);break;
    case 'jump':tone(d,300*p,t,.2,'sine',.45,750*p);break;
    case 'pop':tone(d,750*p,t,.1,'triangle',.5,220);break;
    case 'hit':noise(d,t,.22,.7);tone(d,160,t,.22,'sawtooth',.4,40);break;
    case 'lose':tone(d,420,t,.55,'sawtooth',.3,60);tone(d,210,t+.1,.5,'square',.18,40);break;
    case 'win':[523,659,784,1047].forEach((f,i)=>tone(d,f*p,t+i*.07,.16,'triangle',.32));break;
    case 'tick':noise(d,t,.03,.45,3000);break;
    case 'ding':tone(d,1200*p,t,.4,'sine',.4);break;
    case 'note':tone(d,mtof(p),t,.3,'triangle',.45);break;
    case 'whoosh':noise(d,t,.25,.3,800);break;
    case 'bump':tone(d,200*p,t,.12,'square',.3,500*p);break;
  }
};

A.stop=function(){clearInterval(A.timer);A.timer=0;A.mus=null};
A.play=function(cfg,id){
  A.stop(); if(!A.ac||!cfg)return;
  const ac=A.ac,r=rng(cfg.seed?cfg.seed*977+hash(id):hash(id));
  const sc=SC[cfg.scale||'minor'],root=cfg.root||48,oct=cfg.oct==null?1:cfg.oct,dens=cfg.density==null?.5:cfg.density;
  const sn=d=>{const L=sc.length,o=Math.floor(d/L);return sc[((d%L)+L)%L]+12*o};
  const lead=[];let deg=2;
  for(let i=0;i<32;i++){
    if(cfg.arp){lead.push(i%2===0?[0,2,4,2,4,6,4,7][(i>>1)%8]:null);continue}
    if(r()<dens){deg+=[-2,-1,-1,0,1,1,2,3][Math.floor(r()*8)];deg=Math.max(-2,Math.min(9,deg));lead.push(deg)}else lead.push(null);
  }
  const prog=cfg.prog||[0,5,3,4], sd=60/(cfg.bpm||110)/4, sw=cfg.swing||0, lv=cfg.vol==null?.16:cfg.vol;
  const lw=cfg.lead||'triangle', bw=cfg.bassw||'triangle', bs=cfg.bass||'root', dr=cfg.drums||'none', len=cfg.len||1.5;
  let step=0,next=ac.currentTime+.12;
  const dst=A.mg;
  function sched(i,t){
    const bar=Math.floor(i/16)%prog.length, sh=sn(prog[bar]), s16=i%16;
    const L=lead[i%32];
    if(L!=null)tone(dst,mtof(root+12*oct+sn(L)+sh),t,sd*len*(cfg.arp?1.6:1),lw,lv,null,.004);
    if(cfg.pad&&s16===0){[0,2,4].forEach(k=>tone(dst,mtof(root+sn(k)+sh),t,sd*15,'sine',lv*.55,null,sd*4))}
    if(bs!=='off'){
      const bm=root-12+sh;
      if(bs==='root'&&(s16===0||s16===8))tone(dst,mtof(bm),t,sd*6,bw,lv*1.3);
      else if(bs==='walk'&&s16%4===0)tone(dst,mtof(bm+(s16%8===4?7:0)),t,sd*3,bw,lv*1.3);
      else if(bs==='pulse'&&s16%2===0)tone(dst,mtof(bm+(s16%8===6?7:0)),t,sd*1.6,bw,lv*1.1);
    }
    const kick=()=>tone(dst,130,t,.14,'sine',.5,40), snare=()=>{noise(dst,t,.12,.22,1800)}, hat=v=>noise(dst,t,.04,v||.12,6000);
    if(dr==='four'){if(s16%4===0)kick();if(s16===4||s16===12)snare();if(s16%4===2)hat()}
    else if(dr==='half'){if(s16===0)kick();if(s16===8)snare();if(s16%4===2)hat(.1)}
    else if(dr==='break'){if(s16===0||s16===6||s16===10)kick();if(s16===4||s16===12)snare();if(s16%2===0)hat(.09)}
    else if(dr==='hats'){if(s16%4===2)hat(.1);if(s16===0)kick()}
    else if(dr==='tick'){if(s16%4===0)noise(dst,t,.02,.12,4000)}
  }
  A.mus=cfg;
  A.timer=setInterval(()=>{
    if(!A.ac||A.ac.state!=='running'){next=ac.currentTime+.12;return}
    while(next<ac.currentTime+.18){
      sched(step,next+((step&1)?sd*sw:0)); next+=sd; step++;
    }
  },40);
};
})();
