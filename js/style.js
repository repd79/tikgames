// Utilidades de estilo compartidas por los juegos nuevos: píxel-art, tramados, medios tonos, scanlines, 7 segmentos...
(function(){
'use strict';
const ST=window.ST={},C={};

// Lienzo fuera de pantalla cacheado por clave (para texturas que no hay que repintar cada frame)
ST.cache=(key,w,h,fn)=>{let c=C[key];if(!c){c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));fn(c.getContext('2d'),c.width,c.height);C[key]=c}return c};

// Sprite desde filas de texto. '.' = transparente; el resto se busca en pal. flip = espejo horizontal
ST.spr=(g,rows,x,y,px,pal,flip)=>{
  const w=rows[0].length;
  for(let j=0;j<rows.length;j++){const r=rows[j];
    for(let i=0;i<w;i++){const ch=r[flip?w-1-i:i];if(ch==='.'||ch===' ')continue;const col=pal[ch];if(!col)continue;
      g.fillStyle=col;g.fillRect(Math.round(x+i*px),Math.round(y+j*px),Math.ceil(px),Math.ceil(px))}}
};
ST.sprW=(rows,px)=>rows[0].length*px;

// Tramado ordenado (Bayer 4x4) como en los Mac de 1 bit. lv 0..1
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
ST.dither=(g,x,y,w,h,lv,px,col)=>{
  px=px||3;const k='dth'+Math.round(lv*16)+'_'+px+'_'+col;
  const cv=ST.cache(k,px*8,px*8,(c)=>{c.fillStyle=col;for(let j=0;j<8;j++)for(let i=0;i<8;i++)if(BAY[(j&3)*4+(i&3)]/16<lv)c.fillRect(i*px,j*px,px,px)});
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=g.createPattern(cv,'repeat');g.translate(x,y);g.fillRect(0,0,w,h);g.restore();
};

// Medios tonos (puntos de cómic / imprenta). Ocupa x,y,w,h; r máximo del punto = sp*.5*k
ST.halftone=(g,x,y,w,h,col,sp,k,angled)=>{
  const key='ht'+col+'_'+sp+'_'+k+'_'+(angled?1:0);
  const cv=ST.cache(key,sp*2,sp*2,(c)=>{c.fillStyle=col;const pts=angled?[[0,0],[sp,sp]]:[[sp/2,sp/2],[sp*1.5,sp*1.5],[sp*1.5,sp/2],[sp/2,sp*1.5]];
    pts.forEach(p=>{c.beginPath();c.arc(p[0],p[1],sp*.5*k,0,6.2832);c.fill()})});
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=g.createPattern(cv,'repeat');g.translate(x,y);g.fillRect(0,0,w,h);g.restore();
};

// Scanlines + viñeta de monitor CRT
ST.scan=(g,W,H,a)=>{
  const cv=ST.cache('scan'+W+'x'+H,W,H,(c,w,h)=>{
    c.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<h;y+=3)c.fillRect(0,y,w,1);
    const r=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.max(w,h)*.75);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=r;c.fillRect(0,0,w,h)});
  g.globalAlpha=a==null?1:a;g.drawImage(cv,0,0);g.globalAlpha=1;
};

// Grano de papel
ST.grain=(g,W,H,a,col)=>{
  const cv=ST.cache('gr'+(col||'k'),128,128,(c)=>{c.fillStyle=col||'#000';for(let i=0;i<420;i++){c.globalAlpha=Math.random()*.5;c.fillRect(Math.random()*128,Math.random()*128,1+Math.random()*1.4,1+Math.random()*1.4)}});
  g.save();g.globalAlpha=a==null?.12:a;g.fillStyle=g.createPattern(cv,'repeat');g.fillRect(0,0,W,H);g.restore();
};

// Sombra suave tipo papel recortado: ST.paper(g,true) ... dibujar ... ST.paper(g,false)
ST.paper=(g,on,d)=>{if(on){g.shadowColor='rgba(40,30,20,.28)';g.shadowBlur=(d||6)*1.6;g.shadowOffsetX=0;g.shadowOffsetY=d||5}else{g.shadowColor='transparent';g.shadowBlur=0;g.shadowOffsetX=0;g.shadowOffsetY=0}};

// Dígitos de 7 segmentos (estilo LCD). Alineado a la derecha en x. Los apagados se ven tenues, como en las pantallas de verdad
const SEG={'0':'abcdef','1':'bc','2':'abdeg','3':'abcdg','4':'bcfg','5':'acdfg','6':'acdefg','7':'abc','8':'abcdefg','9':'abcdfg','-':'g',' ':''};
ST.seg7=(g,str,x,y,h,on,off,digits)=>{
  str=String(str);if(digits)while(str.length<digits)str=' '+str;
  const w=h*.55,t=Math.max(2,h*.13),gap=h*.3;
  for(let n=str.length-1,cx=x;n>=0;n--,cx-=w+gap){
    const act=SEG[str[n]]||'';
    const seg=(nm,sx,sy,sw,sh)=>{g.fillStyle=act.indexOf(nm)>=0?on:off;g.beginPath();
      if(sw>sh){g.moveTo(sx+t*.5,sy);g.lineTo(sx+sw-t*.5,sy);g.lineTo(sx+sw,sy+sh/2);g.lineTo(sx+sw-t*.5,sy+sh);g.lineTo(sx+t*.5,sy+sh);g.lineTo(sx,sy+sh/2)}
      else{g.moveTo(sx+sw/2,sy);g.lineTo(sx+sw,sy+t*.5);g.lineTo(sx+sw,sy+sh-t*.5);g.lineTo(sx+sw/2,sy+sh);g.lineTo(sx,sy+sh-t*.5);g.lineTo(sx,sy+t*.5)}
      g.closePath();g.fill()};
    const x0=cx-w,y0=y;
    seg('a',x0+t*.4,y0,w-t*.8,t);seg('g',x0+t*.4,y0+h/2-t/2,w-t*.8,t);seg('d',x0+t*.4,y0+h-t,w-t*.8,t);
    seg('f',x0,y0+t*.4,t,h/2-t*.8);seg('b',x0+w-t,y0+t*.4,t,h/2-t*.8);seg('e',x0,y0+h/2+t*.4,t,h/2-t*.8);seg('c',x0+w-t,y0+h/2+t*.4,t,h/2-t*.8);
  }
};

// Estrella de cómic (¡BANG!)
ST.burst=(g,x,y,r1,r2,n,fill,stroke,lw,rot)=>{
  g.beginPath();for(let i=0;i<n*2;i++){const a=(i/(n*2))*6.2832+(rot||0),r=i%2?r1:r2;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.closePath();
  if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.lineWidth=lw||3;g.lineJoin='round';g.strokeStyle=stroke;g.stroke()}
};

// Utilidades varias
ST.ptIn=(p,x,y,w,h)=>p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;
ST.shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a};
// Ruido determinista 1D suave para colinas / olas
ST.noise=(x,seed)=>{const f=Math.floor(x),t=x-f,r=n=>{const s=Math.sin((n+seed*13.7)*127.1)*43758.5453;return s-Math.floor(s)};const a=r(f),b=r(f+1),u=t*t*(3-2*t);return a+(b-a)*u};
})();
