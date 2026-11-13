(function(root){
'use strict';
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function config(level){
 const n=level<=3?2:level<=8?3:level<=16?4:level<=28?5:level<=44?6:level<=64?7:8;
 const min=n===2?2:n===3?(level<7?2:3):n-1;
 const max=n===2?2:n===3?3:Math.min(12,n+Math.floor((level-(n===4?9:n===5?17:n===6?29:n===7?45:65))/4));
 const targetMin=level<=8?4:level<=16?8:level<=28?10:level<=44?12:level<=64?16:20;
 const targetMax=level<=8?10:level<=16?15:level<=44?20:level<=64?30:40;
 return {n,min,max,targetMin,targetMax};
}
const adjacent=(a,b,n)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<n*n&&b<n*n&&Math.abs(a%n-b%n)+Math.abs(Math.floor(a/n)-Math.floor(b/n))===1;
const samePath=(a,b)=>a.length===b.length&&(a.every((v,i)=>v===b[i])||a.every((v,i)=>v===b[b.length-1-i]));
function key(path){const a=path.join(','),b=path.slice().reverse().join(',');return a<b?a:b;}
function generate(level,seed){
 const {n,min,max,targetMin,targetMax}=config(level),r=rng(seed),total=n*n;
 // Split a complete adjacent route. Every cell belongs to exactly one official sum.
 let route=[];for(let y=0;y<n;y++)for(let x=0;x<n;x++)route.push(y*n+(y%2?n-1-x:x));
 if(level>5)for(let k=0;k<total*12;k++){
  if(r()<.5)route.reverse();const opts=[];
  for(let j=3;j<route.length;j++)if(adjacent(route[0],route[j],n))opts.push(j);
  if(opts.length){const j=opts[Math.floor(r()*opts.length)];route=[...route.slice(0,j).reverse(),...route.slice(j)];}
 }
 const turns=Math.floor(r()*4),mirror=r()<.5;
 route=route.map(i=>{let x=i%n,y=Math.floor(i/n);if(mirror)x=n-1-x;for(let k=0;k<turns;k++)[x,y]=[n-1-y,x];return y*n+x;});
 const reachable=Array(total+1).fill(false);reachable[0]=true;
 for(let s=1;s<=total;s++)reachable[s]=Array.from({length:max-min+1},(_,k)=>min+k).some(l=>s>=l&&reachable[s-l]);
 const lengths=[];let left=total;
 while(left){const options=Array.from({length:max-min+1},(_,k)=>min+k).filter(l=>left>=l&&reachable[left-l]);const len=options[Math.floor(r()*options.length)];lengths.push(len);left-=len;}
 const low=Math.max(Math.max(...lengths),targetMin),high=Math.min(Math.min(...lengths)*9,targetMax);
 const target=low+Math.floor(r()*(high-low+1)),cells=Array(total),solutions=[];let offset=0;
 for(const len of lengths){
  const path=route.slice(offset,offset+len);offset+=len;let remaining=target;
  // Positive digits mean a partial sum cannot already equal the target.
  const digits=[];for(let j=0;j<len;j++){const slots=len-j-1,lo=Math.max(1,remaining-slots*9),hi=Math.min(9,remaining-slots);const v=lo+Math.floor(r()*(hi-lo+1));digits.push(v);remaining-=v;}
  const values=shuffle(digits,r);path.forEach((i,j)=>cells[i]=values[j]);solutions.push({id:solutions.length,path});
 }
 return {schema:1,level,seed,n,target,cells,solutions};
}
function validate(p){
 if(!p||p.schema!==1||!Number.isInteger(p.n)||p.n<2||p.n>8||!Array.isArray(p.cells)||p.cells.length!==p.n*p.n||!p.cells.every(v=>Number.isInteger(v)&&v>=1&&v<=9)||!Number.isInteger(p.target)||!Array.isArray(p.solutions)||!p.solutions.length)return false;
 const seen=new Set();for(let id=0;id<p.solutions.length;id++){const s=p.solutions[id];if(s.id!==id||!Array.isArray(s.path)||s.path.length<2)return false;let sum=0;for(let k=0;k<s.path.length;k++){const i=s.path[k];if(!Number.isInteger(i)||i<0||i>=p.cells.length||seen.has(i)||(k&&!adjacent(s.path[k-1],i,p.n)))return false;seen.add(i);sum+=p.cells[i];}if(sum!==p.target)return false;}return seen.size===p.cells.length;
}
function resolve(p,path,found=[],bonuses=[]){
 const used=new Set(found.flatMap(id=>p.solutions[id]?.path||[]));
 if(!Array.isArray(path)||path.length<2||new Set(path).size!==path.length||path.some((i,k)=>!Number.isInteger(i)||i<0||i>=p.cells.length||used.has(i)||(k&&!adjacent(path[k-1],i,p.n))))return {kind:'invalid'};
 const sum=path.reduce((s,i)=>s+p.cells[i],0);if(sum!==p.target)return {kind:'invalid',sum};
 const official=p.solutions.find(s=>samePath(s.path,path));
 if(official)return {kind:'solution',id:official.id,points:path.length*10};
 const canonical=key(path);if(bonuses.includes(canonical))return {kind:'duplicate',key:canonical};
 return {kind:'bonus',key:canonical,points:path.length*5};
}
function speedPoints(length,elapsedMs){const base=length*10,budget=Math.max(6000,length*3000);return Math.max(0,Math.ceil(base*.5*(1-Math.max(0,elapsedMs)/budget)));}
const api={generate,config,validate,resolve,adjacent,samePath,key,speedPoints};root.NexoEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
