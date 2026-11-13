(function(root){
'use strict';
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const norm=s=>s.toUpperCase().replace(/[ÁÀÄ]/g,'A').replace(/[ÉÈË]/g,'E').replace(/[ÍÌÏ]/g,'I').replace(/[ÓÒÖ]/g,'O').replace(/[ÚÙÜ]/g,'U');
function size(mode,age,level){return mode==='kids'?Math.min(age<=5?5:6,(age<=5?3:age===6?4:5)+Math.floor((level-1)/12)):Math.min(8,5+Math.floor((level-1)/15));}
function generateLegacy(mode,age,level,dict){const n=size(mode,age,level),r=rng(level*17041+age*101+(mode==='kids'?7:999)),min=mode==='kids'?3:4,max=mode==='kids'?(age<=5?Math.min(5,3+Math.floor((level-1)/6)):age===6?6:8):Math.min(12,7+Math.floor(level/10));
let pool=shuffle([...new Set(dict.map(norm))].filter(w=>w.length>=min&&w.length<=max&&/^[A-ZÑ]+$/.test(w)),r);
const dp=Array(n*n+1).fill(null);dp[0]=[];for(const word of pool){for(let k=n*n;k>=word.length;k--)if(!dp[k]&&dp[k-word.length])dp[k]=[...dp[k-word.length],word];}if(!dp[n*n])throw Error('No hay palabras suficientes para este tablero');
const words=shuffle(dp[n*n],r);let path=[];for(let y=0;y<n;y++)for(let x=0;x<n;x++)path.push(y*n+(y%2?n-1-x:x));
const adjacent=(a,b)=>Math.abs(a%n-b%n)+Math.abs(Math.floor(a/n)-Math.floor(b/n))===1;
// Backbite preserves a complete adjacent path; splitting it guarantees a solution.
for(let k=0;k<(mode==='kids'&&age===5&&level<7?0:n*n*30);k++){if(r()<.5)path.reverse();const opts=[];for(let j=3;j<path.length;j++)if(adjacent(path[0],path[j]))opts.push(j);if(opts.length){let j=opts[Math.floor(r()*opts.length)];path=[...path.slice(0,j).reverse(),...path.slice(j)];}}
const turns=Math.floor(r()*4),mirror=r()<.5;path=path.map(i=>{let x=i%n,y=Math.floor(i/n);if(mirror)x=n-1-x;for(let k=0;k<turns;k++)[x,y]=[n-1-y,x];return y*n+x;});
let offset=0;const cells=Array(n*n),solutions=words.map(word=>{let p=path.slice(offset,offset+word.length);offset+=word.length;p.forEach((i,j)=>cells[i]=word[j]);return{word,path:p};});return{n,cells,solutions};}


function generate(mode,age,level,dict){
 const n=size(mode,age,level),r=rng(level*17041+age*101+(mode==='kids'?7:999)),pool=[...new Set(dict.map(norm))].filter(w=>/^[A-ZÑ]+$/.test(w));
 let words,paths;
 if(level<20){
  words=shuffle(pool.filter(w=>w.length===n),r).slice(0,n);
  if(words.length!==n)throw Error('Faltan palabras para este tamaño');
  paths=[];
  for(let y=0;y<n;y+=2){
   if(level<=5||y===n-1){
    for(let row=y;row<Math.min(y+2,n);row++){let path=Array.from({length:n},(_,x)=>row*n+x);if(r()<.5)path.reverse();paths.push(path);}
   }else{
    let a=Array.from({length:n-1},(_,x)=>y*n+n-2-x);a.push((y+1)*n);
    let b=[y*n+n-1,...Array.from({length:n-1},(_,x)=>(y+1)*n+n-1-x)];
    if(r()<.5)a.reverse();if(r()<.5)b.reverse();paths.push(a,b);
   }
  }
 }else{
  const maxTurns=2+Math.floor((level-20)/10),min=mode==='kids'?3:4;
  const ageMax=mode==='kids'?(age<=5?5:age===6?6:8):12;
  const maxLength=Math.min(ageMax,maxTurns<4?n+1:12);
  const candidates=shuffle(pool.filter(w=>w.length>=min&&w.length<=maxLength),r),dp=Array(n*n+1).fill(null);dp[0]=[];
  for(const word of candidates)for(let k=n*n;k>=word.length;k--)if(!dp[k]&&dp[k-word.length])dp[k]=[...dp[k-word.length],word];
  if(!dp[n*n])throw Error('No hay palabras suficientes para este tablero');
  words=shuffle(dp[n*n],r);
  let path=[];for(let y=0;y<n;y++)for(let x=0;x<n;x++)path.push(y*n+(y%2?n-1-x:x));
  const adjacent=(a,b)=>Math.abs(a%n-b%n)+Math.abs(Math.floor(a/n)-Math.floor(b/n))===1;
  const allowed=candidate=>{let offset=0;for(const word of words){let last=null,turns=0;for(let j=1;j<word.length;j++){const direction=candidate[offset+j]-candidate[offset+j-1];if(last!==null&&direction!==last)turns++;last=direction;}if(turns>maxTurns)return false;offset+=word.length;}return true;};
  for(let k=0;k<n*n*(12+Math.min(40,level-20));k++){
   const base=r()<.5?[...path].reverse():path,opts=[];
   for(let j=3;j<base.length;j++)if(adjacent(base[0],base[j]))opts.push(j);
   if(!opts.length)continue;const j=opts[Math.floor(r()*opts.length)],candidate=[...base.slice(0,j).reverse(),...base.slice(j)];
   if(allowed(candidate))path=candidate;
  }
  let offset=0;paths=words.map(word=>{const part=path.slice(offset,offset+word.length);offset+=word.length;return part;});
 }
 const turns=Math.floor(r()*4),mirror=r()<.5;
 const transform=i=>{let x=i%n,y=Math.floor(i/n);if(mirror)x=n-1-x;for(let k=0;k<turns;k++)[x,y]=[n-1-y,x];return y*n+x;};
 const cells=Array(n*n),solutions=words.map((word,k)=>{const path=paths[k].map(transform);path.forEach((i,j)=>cells[i]=word[j]);return{word,path};});
 return{n,cells,solutions};
}

function samePath(a,b){return a.length===b.length&&(a.every((v,i)=>v===b[i])||a.every((v,i)=>v===b[b.length-1-i]));}
function resolvePath(puzzle,path,found,bonuses,isWord){
 const occupied=new Set(found.flatMap(f=>f.path));
 if(path.length<3||new Set(path).size!==path.length||path.some((i,k)=>!Number.isInteger(i)||i<0||i>=puzzle.cells.length||occupied.has(i)||(k&&Math.abs(i%puzzle.n-path[k-1]%puzzle.n)+Math.abs(Math.floor(i/puzzle.n)-Math.floor(path[k-1]/puzzle.n))!==1)))return{kind:'invalid'};
 const match=puzzle.solutions.find(s=>samePath(path,s.path)&&!found.some(f=>f.word===s.word));
 if(match)return{kind:'solution',word:match.word,points:match.word.length*10};
 const text=path.map(i=>puzzle.cells[i]).join(''),reverse=[...text].reverse().join('');
 const word=[text,reverse].find(w=>isWord(w));
 if(!word)return{kind:'invalid'};
 if(bonuses.some(b=>b.word===word))return{kind:'duplicate',word};
 return{kind:'bonus',word,points:word.length*5};
}
root.PalabrosEngine={generate,generateLegacy,size,norm,rng,samePath,resolvePath};if(typeof module!=='undefined')module.exports=root.PalabrosEngine;
})(typeof window!=='undefined'?window:globalThis);
