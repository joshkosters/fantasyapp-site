/* ================= rules engine (no DOM) ================= */
let M,R,C,N,ORDER,TW='',WA=1,WD=1;
const T=v=>v&7;
function setup(mode,twist){M=MODES[mode];R=M.rows;C=M.cols;N=M.need;TW=twist||'';
  ORDER=[...Array(C).keys()].sort((a,b)=>Math.abs(a-(C-1)/2)-Math.abs(b-(C-1)/2));}
function landing(b,c){if(b[0][c])return -1;let r=0;while(r+1<R&&!b[r+1][c])r++;return r;}
function topRow(b,c){for(let r=0;r<R;r++)if(b[r][c])return r;return -1;}
function settle(b){for(let c=0;c<C;c++){let w=R-1;for(let r=R-1;r>=0;r--){const v=b[r][c];if(v){b[r][c]=0;b[w--][c]=v;}}}}
function flipB(b){for(let c=0;c<C;c++){const s=[];for(let r=0;r<R;r++)if(b[r][c]){s.push(b[r][c]);b[r][c]=0;}let w=R-1;for(const v of s)b[w--][c]=v;}}
function newState(starter,hands){
  const s={b:Array.from({length:R},()=>Array(C).fill(0)),turn:starter,count:0,over:0,hands:[null,hands?hands[1].slice():[],hands?hands[2].slice():[]],
    frozen:Array(C).fill(0),holes:[],lines:[0,0,0],nid:1,ev:[]};
  if(M.blocks){let left=M.blocks;const per=Array(C).fill(0);
    while(left){const c=Math.random()*C|0;if(per[c]>=2)continue;per[c]++;s.b[landing(s.b,c)][c]=3|(s.nid++<<3);left--;}}
  if(TW==='space'){const cs=[...Array(C).keys()].sort(()=>Math.random()-.5).slice(0,2);
    for(const c of cs)s.holes.push((1+(Math.random()*2|0))*C+c);}
  return s;}
function clone(s){return{b:s.b.map(r=>r.slice()),turn:s.turn,count:s.count,over:0,hands:[null,s.hands[1].slice(),s.hands[2].slice()],
  frozen:s.frozen.slice(),holes:s.holes.slice(),lines:s.lines.slice(),nid:s.nid,ev:[]};}
function moves(s){const p=s.turn,b=s.b,m=[];
  for(const c of ORDER)if(!s.frozen[c]&&!b[0][c])m.push({c});
  if(M.pop)for(const c of ORDER)if(!s.frozen[c]&&T(b[R-1][c])===p)m.push({c,pop:1});
  for(const pw of new Set(s.hands[p])){
    if(pw==='flip'){m.push({c:-1,pw});continue;}
    for(const c of ORDER){if(s.frozen[c])continue;const t=topRow(b,c);
      if(pw==='wild'||pw==='stone'){if(!b[0][c])m.push({c,pw});}
      else if(pw==='bomb'||pw==='anvil'){if(t>=0)m.push({c,pw});}
      else if(pw==='swap'){if(t>0&&T(b[t][c])===3-p)m.push({c,pw});}
      else if(pw==='freeze')m.push({c,pw});}}
  return m;}
function lines(b,collect){let mask=0;const cells=collect?[]:null;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){if(!b[r][c])continue;const t0=T(b[r][c]);if(t0===3)continue;
    for(const[dr,dc]of DIRS){const er=r+dr*(N-1),ec=c+dc*(N-1);if(er>=R||ec<0||ec>=C)continue;
      let ok=t0===4?3:t0;
      for(let k=1;k<N&&ok;k++){const t=T(b[r+dr*k][c+dc*k]);if(t===4)continue;if(t===1||t===2)ok&=t;else ok=0;}
      if(ok){mask|=ok;if(collect)for(let k=0;k<N;k++)cells.push((r+dr*k)*C+c+dc*k);}}}
  return collect?{mask,cells}:mask;}
function resolve(s){const b=s.b;
  for(let g=0;g<30;g++){
    if(TW==='grid'){const{mask,cells}=lines(b,true);
      if(mask){if(mask&1)s.lines[1]++;if(mask&2)s.lines[2]++;s.ev.push({t:'score',mask,cells});
        for(const i of cells)b[i/C|0][i%C]=0;settle(b);
        if(s.lines[1]>=GOAL||s.lines[2]>=GOAL){s.over=s.lines[1]===s.lines[2]?3:s.lines[1]>s.lines[2]?1:2;return;}
        continue;}}
    else{const mask=lines(b);if(mask){s.over=mask;return;}}
    if(TW==='arcade'&&b[R-1].every(v=>v)){for(let r=R-1;r>0;r--)b[r]=b[r-1];b[0]=Array(C).fill(0);s.ev.push({t:'rowclear'});continue;}
    return;}}
function apply(st,m){const s=clone(st),b=s.b,p=s.turn,c=m.c,ev=s.ev;
  const put=type=>{const r=landing(b,c),hi=s.holes.findIndex(h=>h%C===c&&(h/C|0)<=r);
    if(hi>=0){ev.push({t:'swallow',cell:s.holes[hi],type});s.holes.splice(hi,1);return;}
    b[r][c]=type|(s.nid++<<3);ev.push({t:'drop',r,c});};
  if(m.pw){const h=s.hands[p];h.splice(h.indexOf(m.pw),1);}
  if(m.pop){ev.push({t:'pop',c,id:b[R-1][c]>>3});for(let r=R-1;r>0;r--)b[r][c]=b[r-1][c];b[0][c]=0;}
  else if(!m.pw)put(p);
  else if(m.pw==='wild')put(4);
  else if(m.pw==='stone')put(3);
  else if(m.pw==='bomb'){const r=topRow(b,c),cells=[];
    for(let d=-1;d<=1;d++){const cc=c+d;if(cc>=0&&cc<C&&b[r][cc]){b[r][cc]=0;cells.push(r*C+cc);}}
    ev.push({t:'boom',cells});settle(b);}
  else if(m.pw==='anvil'){for(let r=0;r<R;r++)b[r][c]=0;b[R-1][c]=3|(s.nid++<<3);ev.push({t:'crush',c});}
  else if(m.pw==='swap'){const r=topRow(b,c);b[r-1][c]=b[r][c];b[r][c]=p|(s.nid++<<3);ev.push({t:'swap',r,c});}
  else if(m.pw==='freeze'){s.frozen[c]=4;ev.push({t:'freeze',c});}
  else if(m.pw==='flip'){flipB(b);ev.push({t:'flip'});}
  s.count++;
  if(M.flip&&s.count%M.flip===0){flipB(b);ev.push({t:'flip'});}
  for(let i=0;i<C;i++)if(s.frozen[i])s.frozen[i]--;
  resolve(s);
  if(!s.over){s.turn=3-p;if(!moves(s).length)s.over=TW==='grid'&&s.lines[1]!==s.lines[2]?(s.lines[1]>s.lines[2]?1:2):3;}
  return s;}
function evalS(s,p){const b=s.b,o=3-p;let sc=0;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++)for(const[dr,dc]of DIRS){
    const er=r+dr*(N-1),ec=c+dc*(N-1);if(er>=R||ec<0||ec>=C)continue;
    let a=0,e=0,dead=false;
    for(let k=0;k<N;k++){const t=T(b[r+dr*k][c+dc*k]);if(t===p)a++;else if(t===o)e++;else if(t===3)dead=true;}
    if(dead||(a&&e))continue;sc+=WA*a*a*a-WD*e*e*e;}
  sc+=6*(s.hands[p].length-s.hands[o].length);
  if(TW==='grid')sc+=400*(s.lines[p]-s.lines[o]);
  return sc;}
function val(s,p,d,al,be){
  if(s.over)return s.over===3?0:s.over===p?1e6+d:-(1e6+d);
  if(d<=0)return evalS(s,p);
  return -nm(s,d-1,-be,-al);}
function nm(s,d,al,be){const p=s.turn;let best=-Infinity;
  for(const m of moves(s)){const v=val(apply(s,m),p,d,al,be);if(v>best)best=v;if(v>al)al=v;if(al>=be)break;}
  return best;}
function cpuPick(s,prof){const ms=moves(s),p=s.turn,plainOf=l=>{const q=l.filter(m=>!m.pw);return q.length?q:l;};
  if(Math.random()<prof.rand){const q=plainOf(ms);return q[Math.random()*q.length|0];}
  WA=prof.atk;WD=prof.def;let d=prof.depth;if(ms.length>20)d=Math.min(d,3);else if(ms.length>9)d=Math.min(d,4);
  let best=-Infinity,pick=[];
  for(const m of ms){const v=val(apply(s,m),p,d-1,-Infinity,Infinity);if(v>best){best=v;pick=[m];}else if(v===best)pick.push(m);}
  WA=WD=1;const q=plainOf(pick);return q[Math.random()*q.length|0];}
/* daily puzzle */
function rng(seed){return()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function winIn(s,k){const p=s.turn;
  for(const m of moves(s)){const a=apply(s,m);if(a.over===p)return true;if(a.over||k===1)continue;
    if(moves(a).every(r=>{const z=apply(a,r);return !z.over&&winIn(z,k-1);}))return true;}
  return false;}
function winners(s,k){const p=s.turn;return moves(s).filter(m=>{const a=apply(s,m);if(a.over===p)return true;if(a.over||k===1)return false;
  return moves(a).every(r=>{const z=apply(a,r);return !z.over&&winIn(z,k-1);});});}
function makePuzzle(seed,k){setup('classic','');const rnd=rng(seed);
  for(let t=0;t<(k>2?500:5000);t++){let s=newState(1,null),ok=true;const plies=8+2*(rnd()*7|0);
    for(let i=0;i<plies&&ok;i++){const ms=moves(s);s=apply(s,ms[rnd()*rnd()*ms.length|0]);if(s.over)ok=false;}
    if(!ok||winIn(s,k-1))continue;
    const w=winners(s,k);if(w.length===1||w.length===2){s.ev=[];return{start:s,k};}}
  return k>2?makePuzzle(seed,2):null;}

function event(st,name,r){const s=clone(st),b=s.b;s.ev.push({t:'event',name});
  if(name==='quake'){for(let q=R-1;q>0;q--)b[q]=b[q-1];b[0]=Array(C).fill(0);}
  else if(name==='meteor'){const cs=[];for(let c=0;c<C;c++)if(b[R-1][c])cs.push(c);
    if(cs.length){const c=cs[r[0]*cs.length|0],t=topRow(b,c),cells=[t*C+c];b[t][c]=0;if(t+1<R&&b[t+1][c]){b[t+1][c]=0;cells.push((t+1)*C+c);}s.ev.push({t:'boom',cells});}}
  else if(name==='conveyor'){const row=b[R-1];row.unshift(row.pop());settle(b);}
  else if(name==='turncoat'){const cs=[];for(let q=0;q<R;q++)for(let c=0;c<C;c++){const t=T(b[q][c]);if(t===1||t===2)cs.push(q*C+c);}
    if(cs.length){const i=cs[r[0]*cs.length|0],v=b[i/C|0][i%C];b[i/C|0][i%C]=(v&~7)|(3-T(v));s.ev.push({t:'turn',cell:i});}}
  else if(name==='flip'){flipB(b);s.ev.push({t:'flip'});}
  else if(name==='frost'){const c=r[0]*C|0;s.frozen[c]=3;s.ev.push({t:'freeze',c});}
  else if(name==='gift'){const ks=Object.keys(POWERS);for(const p of[1,2])if(s.hands[p].length<4)s.hands[p].push(ks[r[p-1]*ks.length|0]);}
  resolve(s);if(!s.over&&!moves(s).length)s.over=3;return s;}
