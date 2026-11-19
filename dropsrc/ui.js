/* ================= UI ================= */
if(typeof document!=='undefined'){
const $=id=>document.getElementById(id);
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const KEY='dropfour2';
const store={pref:{opp:'two',cpu:0,world:'classic',twist:true,mode:'classic',series:1,powers:true,mute:false,clock:0},ladder:0,all:false,names:['',''],rival:{},ach:{},seen:{},rush:0,
  custom:{board:'#7a3cff',bg:'#15121f',p1:'#ff6a3d',p2:'#3ad1ff',emblem:'star',shape:'round',twist:''},
  stats:{games:0,p1:0,p2:0,draws:0,cpuW:0,cpuL:0,streak:0,best:0,modes:{}},daily:{last:'',streak:0,best:0,solved:0}};
try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');for(const k in store)if(d[k]!=null){if(typeof store[k]==='object')Object.assign(store[k],d[k]);else store[k]=d[k];}}catch(e){}
const pref=store.pref,persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}};
const open_=k=>k==='custom'||store.all||!WORLDS[k].lock||store.ladder>=WORLDS[k].lock;
if(!WORLDS[pref.world]||!open_(pref.world))pref.world='classic';if(!MODES[pref.mode])pref.mode='classic';
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dayKey(new Date()),yesterday=()=>{const d=new Date();d.setDate(d.getDate()-1);return dayKey(d);};
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),pick=a=>a[Math.random()*a.length|0];

/* ---- worlds ---- */
const artCache={},CV=['--bg','--ink','--muted','--panel','--pi','--pm','--line','--accent','--on-accent','--shadow','--board','--hole','--disc-r','--hole-r'];
const arts=(k,cu)=>k==='custom'?artFor(k,cu||store.custom):artCache[k]||(artCache[k]=artFor(k));
const colorsOf=k=>k==='custom'?[store.custom.p1,store.custom.p2]:WORLDS[k].c;
const holeOf=k=>k==='custom'&&store.custom.shape==='square'?12:WORLDS[k].hole;
const twistOf=k=>k==='custom'?store.custom.twist:WORLDS[k].twist||'';
function applyWorld(node,k,cu){node.dataset.w=k;const a=arts(k==='lobby'?'classic':k,cu),st=node.style;
  st.setProperty('--art1',a[0]);st.setProperty('--art2',a[1]);st.setProperty('--artw',a[2]);st.setProperty('--arts',a[3]);
  for(const v of CV)st.removeProperty(v);
  if(k==='custom'){const c=cu||store.custom,dark=lum(c.bg)<.5,ink=dark?'#ffffff':'#141414',sq=c.shape==='square';
    const set={'--bg':c.bg,'--ink':ink,'--muted':mix(ink,c.bg,.4),'--panel':dark?mix(c.bg,'#ffffff',.1):'#ffffff','--pi':ink,'--pm':mix(ink,c.bg,.4),'--line':mix(c.bg,ink,.25),
      '--accent':c.p1,'--on-accent':lum(c.p1)<.6?'#ffffff':'#141414','--shadow':mix(c.bg,'#000000',.55),'--board':c.board,'--hole':mix(c.bg,'#000000',.3),'--disc-r':sq?'14%':'50%','--hole-r':sq?'15%':'50%'};
    for(const v in set)st.setProperty(v,set[v]);}}
function maskFor(rows,cols,rx){let d=`M0 0H${cols*100}V${rows*100}H0Z`;const s=82-2*rx;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)d+=`M${c*100+9+rx} ${r*100+9}h${s}a${rx} ${rx} 0 0 1 ${rx} ${rx}v${s}a${rx} ${rx} 0 0 1 ${-rx} ${rx}h${-s}a${rx} ${rx} 0 0 1 ${-rx} ${-rx}v${-s}a${rx} ${rx} 0 0 1 ${rx} ${-rx}z`;
  return`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${cols*100} ${rows*100}' preserveAspectRatio='none'><path fill-rule='evenodd' d='${d}'/></svg>`)}")`;}
function mkBoard(inner,interactive){const B={discs:new Map(),born:new Map()};inner.innerHTML='';
  B.back=el('div','back');B.layer=el('div','layer');B.face=el('div','face');B.plate=el('div','plate');inner.append(B.back,B.layer,B.face,B.plate);
  if(interactive){B.cols=el('div','cols');inner.appendChild(B.cols);}
  B.reset=(rows,cols,rx)=>{const bd=inner.parentNode;bd.style.setProperty('--cols',cols);bd.style.setProperty('--rows',rows);
    B.discs.clear();B.born.clear();B.layer.innerHTML='';B.back.innerHTML='';B.plate.innerHTML='';
    for(let i=0;i<rows*cols;i++){B.back.appendChild(el('div'));B.plate.appendChild(el('div'));}
    const m=maskFor(rows,cols,rx);B.face.style.webkitMaskImage=m;B.face.style.maskImage=m;
    if(B.cols){B.cols.innerHTML='';for(let c=0;c<cols;c++){const b=el('button');b.type='button';b.dataset.c=c;b.setAttribute('aria-label','Column '+(c+1));B.cols.appendChild(b);}}};
  B.sync=(s,o={})=>{const seen=new Set();
    for(let r=0;r<R;r++)for(let c=0;c<C;c++){const v=s.b[r][c];if(!v)continue;const id=v>>3,t=T(v);seen.add(id);let d=B.discs.get(id);
      if(!d){d=el('div','disc','<i></i>');d.style.setProperty('--r',-1.2);d.style.setProperty('--c',c);B.layer.appendChild(d);B.discs.set(id,d);B.born.set(id,s.count);void d.offsetWidth;}
      if(d._t!==t){d.classList.remove('t'+d._t);d._t=t;d.classList.add('t'+t);}
      d.style.setProperty('--r',r);d.style.setProperty('--c',c);d._i=r*C+c;
      d.classList.toggle('fade',!!o.fade&&t!==3&&s.count-B.born.get(id)>=5);}
    for(const[id,d]of B.discs)if(!seen.has(id)){B.discs.delete(id);
      if(o.drop&&d._i>=(R-1)*C){d.style.setProperty('--r',R+2);d.classList.add('spill');}else d.classList.add('gone');
      setTimeout(()=>d.remove(),900);}
    B.layer.querySelectorAll('.bh').forEach(x=>x.remove());
    for(const h of s.holes){const x=el('div','bh');x.style.setProperty('--r',h/C|0);x.style.setProperty('--c',h%C);B.layer.prepend(x);}};
  B.celebrate=(s,spill)=>{if(s.over===3||!s.over||TW==='grid')return;const set=[...new Set(lines(s.b,true).cells)];
    for(const d of B.discs.values()){const i=set.indexOf(d._i);if(i>=0){d.classList.add('win');d.style.setProperty('--i',i);}}
    if(spill)setTimeout(()=>{for(const d of B.discs.values())if(!d.classList.contains('win')&&d.isConnected){d.style.setProperty('--r',R+2);d.classList.add('spill');}},1300);};
  return B;}

/* ---- sound ---- */
let AC=null;
function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
const wave=()=>pref.world==='arcade'?'square':pref.world==='space'?'sine':'triangle';
function tone(f,d,vol=.14,when=0,slide=0,type){if(pref.mute||!AC)return;try{const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();
  o.type=type||wave();o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02);}catch(e){}}
function noise(d,vol=.2,when=0,fc=900){if(pref.mute||!AC)return;try{const n=AC.sampleRate*d|0,buf=AC.createBuffer(1,n,AC.sampleRate),a=buf.getChannelData(0);
  for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const src=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
  src.buffer=buf;f.type='lowpass';f.frequency.value=fc;g.gain.value=vol;src.connect(f).connect(g).connect(AC.destination);src.start(AC.currentTime+when);}catch(e){}}
const fallT=()=>pref.world==='space'?.6:pref.world==='arcade'?.36:.33;
const sfx={
  ui(){tone(520,.06,.08);},
  drop(run){const w=fallT();noise(.07,.25,w,1400);tone(196*Math.pow(2,(run-1)*4/12),.16,.13,w);},
  buzz(){tone(110,.18,.12,0,80,'sawtooth');},
  boom(){noise(.5,.5,0,500);tone(120,.4,.25,0,35,'sine');},
  crush(){noise(.3,.45,0,300);tone(80,.3,.25,0,40,'sine');},
  freeze(){[1568,2093,2637].forEach((f,i)=>tone(f,.25,.06,i*.06,0,'sine'));},
  whoosh(){tone(220,.5,.1,0,880,'sine');},
  suck(){tone(660,.6,.12,.15,60,'sine');},
  pop(){tone(300,.12,.12,0,600);},
  event(){[330,415,330,494].forEach((f,i)=>tone(f,.12,.11,i*.07));},
  score(){[523,659,784].forEach((f,i)=>tone(f,.14,.12,i*.08));},
  win(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,.13,i*.11));},
  lose(){[392,330,262].forEach((f,i)=>tone(f,.28,.12,i*.16));}
};
/* ---- particles, sky, wipe ---- */
const cv=$('fx'),cx=cv.getContext('2d');let parts=[],raf=0;
function burst(x,y,cols,n,pow=6,grav=.28){if(reduced)return;
  if(cv.width!==innerWidth||cv.height!==innerHeight){cv.width=innerWidth;cv.height=innerHeight;}
  for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*pow*2,vy:(Math.random()-.8)*pow*1.6,g:grav,c:cols[i%cols.length],l:45+Math.random()*35,s:3+Math.random()*5,round:pref.world!=='arcade'});
  if(!raf)raf=requestAnimationFrame(tick);}
function tick(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.l-->0);
  for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;cx.globalAlpha=Math.min(1,p.l/20);cx.fillStyle=p.c;
    if(p.round){cx.beginPath();cx.arc(p.x,p.y,p.s/1.6,0,7);cx.fill();}else cx.fillRect(p.x,p.y,p.s,p.s);}
  raf=parts.length?requestAnimationFrame(tick):0;}
const palette=()=>[...colorsOf(pref.world),'#ffffff'];
function cellXY(i){const b=GB.layer.getBoundingClientRect();return[b.left+(i%C+.5)*b.width/C,b.top+((i/C|0)+.5)*b.height/R];}
function confetti(){for(let i=0;i<7;i++)setTimeout(()=>burst(Math.random()*innerWidth,-10,palette(),26,7,.18),i*140);}
let stars=null,skyOn=false;
function sky(){const c=$('sky');if(document.body.dataset.w!=='space'){skyOn=false;return;}
  if(c.width!==innerWidth||c.height!==innerHeight||!stars){c.width=innerWidth;c.height=innerHeight;stars=Array.from({length:150},()=>({x:Math.random(),y:Math.random(),z:.3+Math.random(),p:Math.random()*6}));}
  const g=c.getContext('2d'),t=performance.now()/1000;g.clearRect(0,0,c.width,c.height);
  for(const s of stars){const x=((s.x-t*.004*s.z)%1+1)%1*c.width;g.globalAlpha=.35+.65*Math.abs(Math.sin(t*s.z+s.p));g.fillStyle=s.z>1.1?'#bfe9ff':'#fff';g.fillRect(x,s.y*c.height,s.z*1.6,s.z*1.6);}
  if(reduced){skyOn=false;return;}requestAnimationFrame(sky);}
function setScene(k,lobby){applyWorld(document.body,k);document.body.classList.toggle('lobby',!!lobby);document.body.classList.toggle('champ',!lobby&&(store.ladder>=5||store.all));if(k==='space'&&!skyOn){skyOn=true;sky();}}
function wipe(x,y,color,fn){const w=$('wipe');if(reduced)return fn();w.style.background=color;w.style.setProperty('--x',x+'px');w.style.setProperty('--y',y+'px');w.className='in';
  setTimeout(()=>{fn();w.className='out';setTimeout(()=>{w.className='';},420);},460);}

/* ---- lobby ---- */
const MINI=(()=>{const m={10:'a',16:'b',17:'a',18:'b',21:'a',22:'b',23:'a',24:'a',25:'b'};let s='';for(let i=0;i<28;i++)s+=`<i${m[i]?` class="${m[i]}"`:''}></i>`;return s;})();
let lastW='';
function btn(cls,html,pressed,fn,disabled){const b=el('button',cls,html);b.type='button';b.setAttribute('aria-pressed',!!pressed);b.disabled=!!disabled;b.onclick=()=>{audio();sfx.ui();fn();persist();drawMenu();};return b;}
function fill(box,list){box.innerHTML='';for(const b of list)box.appendChild(b);}
function drawMenu(){
  if(lastW!==pref.world){lastW=pref.world;AS=null;setScene(pref.world,true);}
  const d=store.daily,done=d.last===today(),live=done||d.last===yesterday()?d.streak:0;
  const q=$('quick');q.innerHTML='';
  const mk=(h,f)=>{const b=el('button','qt',h);b.type='button';b.onclick=()=>{audio();sfx.ui();f();};q.appendChild(b);};
  mk(`${done?'':'<span class="dot"></span>'}Daily puzzle <small>${done?'solved':'new'}, streak ${live}</small>`,startDaily);
  mk(`Puzzle rush <small>best ${store.rush}</small>`,startRush);
  mk(`Stats <small>${Object.keys(store.ach).length} of ${Object.keys(ACH).length} badges</small>`,showStats);
  mk(`How to play`,showHelp);
  fill($('opp'),[
    btn('opt',`<span class="faces"><i class="av k1"></i><i class="av k2"></i></span><span><b>Two players</b><small>Pass one device back and forth</small></span>`,pref.opp==='two',()=>pref.opp='two'),
    btn('opt',`<span class="faces"><i class="av k1"></i><i class="bot">CPU</i></span><span><b>CPU ladder</b><small>Beat five opponents to unlock worlds</small></span>`,pref.opp==='cpu',()=>pref.opp='cpu')]);
  if(pref.opp==='cpu'&&pref.cpu>store.ladder&&!store.all)pref.cpu=Math.min(store.ladder,4);
  fill($('ladder'),pref.opp!=='cpu'?[]:LADDER.map((L,i)=>{const beat=i<store.ladder,locked=i>store.ladder&&!store.all;
    return btn('opt rung',`<span class="rk">${beat?ico('check'):i+1}</span><span class="n">${L.n}</span><small>${L.b}</small><em>${locked?ico('lock'):beat?'Beaten':'Wins you<br>'+L.prize}</em>`,pref.cpu===i,()=>pref.cpu=i,locked);}));
  const nm=$('names');nm.innerHTML='';nm.className=pref.opp==='two'?'names':'';
  if(pref.opp==='two')[0,1].forEach(i=>{const l=el('label','',`<span class="av k${i+1}"></span>`),inp=el('input');inp.id='name'+i;inp.maxLength=12;inp.placeholder='Player '+(i+1)+' name';
    inp.value=store.names[i];inp.setAttribute('aria-label','Player '+(i+1)+' name');inp.oninput=()=>{store.names[i]=inp.value;persist();};l.appendChild(inp);nm.appendChild(l);});
  const wb=$('worlds'),sx=wb.scrollLeft;
  fill(wb,Object.keys(WORLDS).map(k=>{const w=WORLDS[k],ok=open_(k),tw=twistOf(k);
    const b=btn('wcard',`<span class="mini"><span class="mb">${MINI}</span></span><span class="cap"><b>${w.name}</b><small>${!ok?ico('lock')+' Beat '+LADDER[w.lock-1].n:k==='custom'?'Design it yourself':tw?'Twist: '+TWISTS[tw].n:'No twist'}</small></span>`,pref.world===k,()=>pref.world=k,!ok);
    applyWorld(b,k);return b;}));
  wb.scrollLeft=sx;$('wn').textContent=WORLDS[pref.world].name;
  const tw=twistOf(pref.world),tb=$('twistBox');tb.innerHTML='';
  if(tw){const l=el('label','twist',`<input type="checkbox" id="twistOn" ${pref.twist?'checked':''}><div><b>World twist: ${TWISTS[tw].n}</b><br><span>${TWISTS[tw].d}</span></div>`);
    l.querySelector('input').onchange=e=>{pref.twist=e.target.checked;persist();};tb.appendChild(l);}
  if(pref.world==='custom'){const a=el('div','acts'),b=el('button','ghost','Edit your world');b.type='button';b.onclick=()=>{sfx.ui();editWorld();};a.style.justifyContent='flex-start';a.appendChild(b);tb.appendChild(a);}
  fill($('modes'),Object.keys(MODES).map(k=>btn('opt',`<span class="pg">${ico('m_'+k)}</span><span><b>${MODES[k].name}</b><small>${MODES[k].desc}</small></span>`,pref.mode===k,()=>pref.mode=k)));
  const pills=(id,list,key)=>fill($(id),list.map(([k,n])=>btn('pill',n,pref[key]===k,()=>pref[key]=k)));
  pills('series',[[1,'Single'],[3,'Best of 3'],[5,'Best of 5']],'series');pills('pw',[[true,'Draft 3 each'],[false,'Off']],'powers');pills('clockSeg',[[0,'Off'],[15,'15 sec'],[8,'8 sec']],'clock');
  $('sum').textContent=`${MODES[pref.mode].name} rules in ${WORLDS[pref.world].name}. ${pref.series===1?'Single game':'Best of '+pref.series}${pref.powers?', powers on':''}.`;
}
function modal(html,sticky){$('sheet').innerHTML=html;$('modal').hidden=false;$('modal').dataset.sticky=sticky?1:'';}
function closeModal(){$('modal').hidden=true;}
$('modal').onclick=e=>{if(e.target===$('modal')&&!$('modal').dataset.sticky)closeModal();};
function showHelp(){modal(`<h3>How to play</h3><p>Take turns dropping discs. The first to line up four in a row, across, down or diagonally, wins. A glowing ring marks a spot where someone is one disc from winning.</p>
  <h4>Power discs</h4><p>Before each game you draft three powers each. A power replaces your normal drop and works once. Tap the card, then a column.</p>
  <ul>${Object.entries(POWERS).map(([k,p])=>`<li><b>${p.n}.</b> ${p.d}</li>`).join('')}</ul>
  <h4>World twists</h4><ul>${Object.keys(TWISTS).map(k=>`<li><b>${WORLDS[k].name}, ${TWISTS[k].n.toLowerCase()}.</b> ${TWISTS[k].d}</li>`).join('')}</ul>
  <h4>Rules</h4><ul>${Object.values(MODES).map(m=>`<li><b>${m.name}.</b> ${m.desc}</li>`).join('')}</ul>
  <h4>Mayhem events</h4><ul>${Object.values(EVENTS).map(e=>`<li><b>${e[0]}.</b> ${e[1]}</li>`).join('')}</ul>
  <div class="acts"><button class="go" id="mc">Got it</button></div>`);$('mc').onclick=closeModal;}
function showStats(){const s=store.stats,d=store.daily,fav=Object.entries(s.modes).sort((a,b)=>b[1]-a[1])[0];
  modal(`<h3>Stats</h3><table>
  <tr><td>Games played</td><td>${s.games}</td></tr>
  <tr><td>Two players: first, second, draws</td><td>${s.p1} / ${s.p2} / ${s.draws}</td></tr>
  <tr><td>Against the CPU: wins, losses</td><td>${s.cpuW} / ${s.cpuL}</td></tr>
  <tr><td>CPU win streak (best)</td><td>${s.streak} (${s.best})</td></tr>
  <tr><td>Ladder opponents beaten</td><td>${store.ladder} of 5</td></tr>
  <tr><td>Daily puzzles solved</td><td>${d.solved}</td></tr>
  <tr><td>Daily streak (best)</td><td>${d.last===today()||d.last===yesterday()?d.streak:0} (${d.best})</td></tr>
  <tr><td>Puzzle rush best</td><td>${store.rush}</td></tr>
  <tr><td>Most played rules</td><td>${fav&&MODES[fav[0]]?MODES[fav[0]].name:'None yet'}</td></tr></table>
  <h4>Badges</h4><div class="badges">${Object.entries(ACH).map(([k,a])=>`<div class="badge${store.ach[k]?'':' off'}"><b>${ico(store.ach[k]?'check':'lock')} ${a[0]}</b>${a[1]}</div>`).join('')}</div>
  <div class="acts"><button class="ghost" id="ua">${store.all?'Lock worlds again':'Unlock everything'}</button><button class="ghost" id="rs">Reset stats</button><button class="go" id="mc">Close</button></div>`);
  $('mc').onclick=closeModal;$('ua').onclick=()=>{store.all=!store.all;persist();drawMenu();showStats();};
  $('rs').onclick=()=>{Object.assign(store.stats,{games:0,p1:0,p2:0,draws:0,cpuW:0,cpuL:0,streak:0,best:0,modes:{}});persist();showStats();};}
function editWorld(){const c={...store.custom},opts=(list,v)=>list.map(([k,n])=>`<option value="${k}"${k===v?' selected':''}>${n}</option>`).join('');
  modal(`<h3>Your world</h3><div class="mini" id="cwp"><span class="mb">${MINI}</span></div>
  <div class="form"><label>Board<input type="color" id="cw_board" value="${c.board}"></label><label>Background<input type="color" id="cw_bg" value="${c.bg}"></label>
  <label>Player 1 discs<input type="color" id="cw_p1" value="${c.p1}"></label><label>Player 2 discs<input type="color" id="cw_p2" value="${c.p2}"></label>
  <label>Disc shape<select id="cw_shape">${opts([['round','Round'],['square','Square']],c.shape)}</select></label>
  <label>Emblem<select id="cw_emblem">${opts([['star','Star'],['ring','Ring'],['heart','Heart'],['bolt','Bolt'],['dot','Dot'],['none','None']],c.emblem)}</select></label>
  <label>Twist<select id="cw_twist">${opts([['','None'],...Object.keys(TWISTS).map(k=>[k,TWISTS[k].n])],c.twist)}</select></label></div>
  <div class="acts"><button class="ghost" id="cwx">Cancel</button><button class="go" id="cws">Save world</button></div>`);
  const upd=()=>applyWorld($('cwp'),'custom',c);upd();
  for(const k of['board','bg','p1','p2','shape','emblem','twist'])$('cw_'+k).oninput=e=>{c[k]=e.target.value;upd();};
  $('cwx').onclick=closeModal;$('cws').onclick=()=>{store.custom=c;pref.world='custom';lastW='';persist();closeModal();drawMenu();award('maker');};}
/* attract board in the hero */
let AB=null,AS=null;
function attract(){setTimeout(attract,AS&&AS.over?2400:850);if($('menu').hidden||!$('modal').hidden||document.hidden)return;
  setup('classic','');
  if(!AS||AS.over){AS=newState(1,null);AB.reset(R,C,holeOf(pref.world));return;}
  AS=apply(AS,cpuPick(AS,{depth:2,rand:.3,atk:1,def:1}));AB.sync(AS);if(AS.over)AB.celebrate(AS,false);}

/* ---- game ---- */
let G=null,S=null,sel=null,busy=false,gen=0,replaying=false,toasts=[],toasting=false,clockT=0;
const GB=mkBoard($('inner'),true);
const later=(f,ms)=>{const g=gen;setTimeout(()=>{if(g===gen)f();},ms);};
const vsCpu=()=>G.cpu||!!G.puzzle;
const raw=p=>vsCpu()?(p===1?'You':G.puzzle?'CPU':G.prof.n):(store.names[p-1].trim()||WORLDS[pref.world].p[p-1]);
const label=p=>esc(raw(p));
const human=()=>S&&!S.over&&!busy&&!replaying&&!(vsCpu()&&S.turn===2);
function award(k){if(store.ach[k])return;store.ach[k]=1;persist();toasts.push('Badge earned: '+ACH[k][0]+'. '+ACH[k][1]+'.');pump();}
function pump(){if(toasting||!toasts.length)return;toasting=true;const t=$('toast');t.textContent=toasts.shift();t.classList.add('on');sfx.score();
  setTimeout(()=>{t.classList.remove('on');setTimeout(()=>{toasting=false;pump();},400);},2800);}
function shout(t){const c=$('call');c.textContent=t;c.classList.remove('go2');void c.offsetWidth;c.classList.add('go2');}
function winCells(s,p){const out=[];for(let c=0;c<C;c++){if(s.frozen[c])continue;const r=landing(s.b,c);
  if(r<0||s.holes.some(h=>h%C===c&&(h/C|0)<=r))continue;s.b[r][c]=p;const hit=lines(s.b)&p;s.b[r][c]=0;if(hit)out.push(r*C+c);}return out;}
function stopClock(){if(G&&G.rush)return;clearTimeout(clockT);const bar=$('clock').firstChild;bar.style.transition='none';bar.style.width='0';}
function armClock(){if(G.rush)return;stopClock();const n=G.puzzle?0:pref.clock;$('clock').hidden=!n;if(!n||!human())return;const bar=$('clock').firstChild;
  bar.style.width='100%';void bar.offsetWidth;bar.style.transition='width '+n+'s linear';bar.style.width='0';const g=gen,cnt=S.count;
  clockT=setTimeout(()=>{if(g!==gen||!human()||S.count!==cnt)return;const ms=moves(S),q=ms.filter(x=>!x.pw&&!x.pop),l=q.length?q:ms;sel=null;sfx.buzz();doMove(pick(l),'TIME!');},n*1000);}
function rivalKey(){const a=store.names[0].trim().toLowerCase(),b=store.names[1].trim().toLowerCase();if(G.cpu||G.puzzle||!a||!b||a===b)return null;return{k:[a,b].sort().join('|'),flip:a>b};}
function show(id){$('menu').hidden=id!=='menu';$('game').hidden=id!=='game';window.scrollTo(0,0);}
function startMatch(){gen++;replaying=false;G={mode:pref.mode,need:(pref.series+1)/2,wins:[0,0,0],starter:1,cpu:pref.opp==='cpu',prof:LADDER[pref.cpu],puzzle:null,rush:null,no:0,first:0,quip:'',note:''};
  if(G.cpu)G.quip=pick(G.prof.q.start);store.seen[pref.world]=1;persist();if(Object.keys(WORLDS).every(k=>k==='custom'||store.seen[k]))award('tourist');
  setScene(pref.world,false);show('game');beginGame();}
function beginGame(){G.no++;G.note='';setup(G.mode,pref.twist?twistOf(pref.world):'');$('result').hidden=true;
  if(pref.powers)draft(h=>launch(newState(G.starter,h)));else launch(newState(G.starter,null));}
function launch(state){S=state;sel=null;busy=false;replaying=false;G.log=G.puzzle?null:{start:clone(state),steps:[]};
  GB.reset(R,C,holeOf(pref.world));GB.pv=el('div','disc pv','<i></i>');GB.pv.hidden=true;GB.layer.appendChild(GB.pv);
  render();if(!G.puzzle&&G.need>1&&(G.wins[1]===G.need-1||G.wins[2]===G.need-1))shout('MATCH POINT');cpuTurn();armClock();}
function render(){const ok=human(),ev=S.ev||[];$('board').classList.toggle('locked',!ok);
  GB.sync(S,{fade:TW==='haunt'&&!S.over&&!replaying,drop:ev.some(e=>e.t==='rowclear'||e.t==='pop'||(e.t==='event'&&e.name==='quake'))});
  const pl=GB.plate.children,wc=colorsOf(pref.world);for(const x of pl){x.className='';delete x.dataset.p;}
  if(!S.over&&TW!=='haunt'&&!G.puzzle&&!replaying)for(const p of[1,2])for(const i of winCells(S,p)){const x=pl[i];x.classList.add('th');x.style.setProperty('--tc',x.dataset.p?'#fff':wc[p-1]);x.dataset.p=p;}
  if(M.pop&&ok&&!sel)for(let c=0;c<C;c++)if(!S.frozen[c]&&T(S.b[R-1][c])===S.turn)pl[(R-1)*C+c].classList.add('popme');
  const legal=sel&&ok?moves(S).filter(m=>m.pw===sel):null,hit=c=>legal.some(m=>m.c===c||m.c===-1);
  [...GB.cols.children].forEach((b,c)=>{b.classList.toggle('fz',!!S.frozen[c]);b.dataset.n=S.frozen[c]||'';b.classList.toggle('ok',!!legal&&hit(c));b.classList.toggle('no',!!legal&&!hit(c));});
  for(const p of[1,2]){const sd=$('sd'+p);sd.classList.toggle('on',!S.over&&S.turn===p);sd.classList.toggle('won',S.over===p);
    sd.innerHTML=`<div class="who"><span class="av k${p}"></span><b>${label(p)}</b>${TW==='grid'?`<span class="td" aria-label="${S.lines[p]} touchdowns">${'●'.repeat(Math.min(GOAL,S.lines[p]))}${'○'.repeat(Math.max(0,GOAL-S.lines[p]))}</span>`:''}</div>`;
    const h=$('h'+p);h.innerHTML='';if(!G.puzzle)S.hands[p].forEach(k=>{const b=el('button','card',pchip(k)+`<span>${POWERS[k].n}</span>`);b.type='button';b.disabled=!(ok&&S.turn===p);
      b.setAttribute('aria-pressed',ok&&S.turn===p&&sel===k);b.title=POWERS[k].d;b.onclick=()=>{sel=sel===k?null:k;sfx.ui();render();};h.appendChild(b);});}
  $('s1').textContent=G.wins[1];$('s2').textContent=G.wins[2];
  $('sl').textContent=G.rush?`Puzzle rush: ${G.rush.score} solved, ${3-G.rush.strikes} ${3-G.rush.strikes===1?'life':'lives'} left`:G.puzzle?'Daily puzzle':
    G.need>1?`${MODES[G.mode].name}, game ${G.no} (first to ${G.need})`:MODES[G.mode].name+(TW?' with '+TWISTS[TW].n.toLowerCase():'');
  let s='',t='';const who=raw(S.turn);
  if(replaying)t='Replay';
  else if(S.over)t=S.over===3?'Draw':raw(S.over)==='You'?'You win!':raw(S.over)+' wins!';
  else{t=who==='You'?'Your turn':vsCpu()?who+' is thinking…':who+'’s turn';
    if(sel)s+=POWERS[sel].n+': '+POWERS[sel].d;
    else if(G.puzzle)s+=`Find the move that forces a win within ${G.puzzle.k} ${G.puzzle.k>1?'moves':'move'}.`+(G.puzzle.tries?` Attempt ${G.puzzle.tries+1}.`:'');
    else{const bits=[];if(G.note)bits.push(G.note);
      if(M.mayhem){const n=M.mayhem-S.count%M.mayhem;bits.push(n===1?'An event hits after this move.':`Next event in ${n} moves.`);}
      if(M.flip){const n=M.flip-S.count%M.flip;bits.push(n===1?'The board flips after this move.':`The board flips in ${n} moves.`);}
      if(M.pop&&ok)bits.push('Tap the arrow on your bottom-row disc to pop it out.');
      if(N===5&&S.count<2)bits.push('Five in a row wins.');
      if(TW==='haunt'&&S.count<4)bits.push('Discs vanish a few turns after they land.');
      s+=bits.join(' ');}}
  $('st').textContent=t;$('ss').textContent=s;$('qq').textContent=G.cpu&&G.quip&&!S.over?G.prof.n+': “'+G.quip+'”':'';if(GB.pv)GB.pv.hidden=true;}
function fx(ev){const bd=$('board'),kick=(cls,ms,delay=0)=>setTimeout(()=>{bd.classList.remove(cls);void bd.offsetWidth;bd.classList.add(cls);setTimeout(()=>bd.classList.remove(cls),ms);},delay);
  for(const e of ev){
    if(e.t==='drop'){let run=1;const me=T(S.b[e.r][e.c]);
      if(me===1||me===2)for(const[dr,dc]of DIRS){let n=1;for(const sg of[1,-1]){let r=e.r+dr*sg,c=e.c+dc*sg;
        while(r>=0&&r<R&&c>=0&&c<C&&(T(S.b[r][c])===me||T(S.b[r][c])===4)){n++;r+=dr*sg;c+=dc*sg;}}run=Math.max(run,n);}
      sfx.drop(Math.min(run,N));kick('shake',230,fallT()*1000);}
    else if(e.t==='swallow'){const d=el('div','disc t'+e.type,'<i></i>');d.style.setProperty('--r',-1.2);d.style.setProperty('--c',e.cell%C);GB.layer.appendChild(d);void d.offsetWidth;
      d.style.setProperty('--r',e.cell/C|0);setTimeout(()=>d.classList.add('sucked'),350);setTimeout(()=>d.remove(),1100);sfx.suck();}
    else if(e.t==='boom'){sfx.boom();kick('quake',460);for(const i of e.cells){const[x,y]=cellXY(i);burst(x,y,['#ffb300','#ff5a1f','#fff','#555'],16,7);}}
    else if(e.t==='crush'){sfx.crush();kick('quake',460);for(let r=0;r<R;r++){const[x,y]=cellXY(r*C+e.c);burst(x,y,['#999','#666','#ccc'],5,4);}}
    else if(e.t==='freeze')sfx.freeze();
    else if(e.t==='swap'||e.t==='pop')sfx.pop();
    else if(e.t==='flip'){sfx.whoosh();kick('flip',720);}
    else if(e.t==='score'){sfx.score();for(const i of e.cells){const[x,y]=cellXY(i);burst(x,y,palette(),6,5);}}
    else if(e.t==='rowclear'){sfx.score();kick('shake',230);}
    else if(e.t==='event'){sfx.event();if(e.name==='quake'||e.name==='conveyor')kick('quake',460);}
    else if(e.t==='turn'){for(const d of GB.discs.values())if(d._i===e.cell){d.classList.add('turn');setTimeout(()=>d.classList.remove('turn'),650);}}
  }}
function paint(){const fl=S.ev.some(e=>e.t==='flip');if(fl)GB.layer.classList.add('snap');render();if(fl){void GB.layer.offsetWidth;GB.layer.classList.remove('snap');}fx(S.ev);}
function react(p,hum,before,forced){const ev=S.ev,has=t=>ev.find(e=>e.t===t);let call=forced||'';
  if(!call){if(has('boom'))call='BOOM!';else if(has('crush'))call='CRUSHED!';else if(has('swallow'))call='SWALLOWED!';else if(has('score'))call=pref.world==='grid'?'TOUCHDOWN!':'SCORE!';
    else if(has('rowclear'))call='LINE CLEAR!';else if(has('flip'))call='FLIP!';else if(has('freeze'))call='FROZEN!';}
  if(G.puzzle){if(call)shout(call);return;}
  if(!S.over){const mine=winCells(S,p),theirs=winCells(S,3-p);
    if(mine.length>=2){call=call||'DOUBLE THREAT!';if(G.cpu)G.quip=pick(hum?G.prof.q.worried:G.prof.q.smug);}
    else if(before.length&&theirs.length<before.length){call=call||'BLOCKED!';if(G.cpu)G.quip=hum?'':pick(G.prof.q.smug);}
    else if(G.cpu&&hum)G.quip='';}
  if(call)shout(call);
  if(!hum)return;
  const b=has('boom');if(b&&b.cells.length===3)award('boom3');if(has('swallow'))award('hole');if(has('rowclear'))award('clear');
  if(S.over===p){award('first');if(has('flip'))award('flipwin');if(N===5)award('five');if(M.mayhem)award('mayhem');if(TW==='haunt')award('ghost');
    if(TW==='grid'&&!S.lines[3-p])award('td');if(pref.powers&&S.hands[p].length===3)award('purist');if(S.count<=13)award('fast');
    if(TW!=='grid'&&lines(S.b,true).cells.some(i=>T(S.b[i/C|0][i%C])===4))award('wildwin');}}
function tryMove(m){if(!human())return;
  if(!moves(S).some(x=>x.c===m.c&&!x.pop===!m.pop&&x.pw===m.pw)){sfx.buzz();return;}
  doMove(m);}
function doMove(m,forced){if(S.over)return;const p=S.turn,hum=!(vsCpu()&&p===2);stopClock();
  if(G.puzzle&&p===1&&!winners(S,G.puzzle.k).some(g=>g.c===m.c))return puzzleFail(m);
  const before=G.puzzle?[]:winCells(S,3-p);G.note='';
  S=apply(S,m);sel=null;if(G.log)G.log.steps.push({m});react(p,hum,before,forced);paint();
  if(S.over)return endGame();
  if(M.mayhem&&S.count%M.mayhem===0){busy=true;render();return later(()=>{const name=pick(Object.keys(EVENTS)),r=[Math.random(),Math.random()];
    S=event(S,name,r);G.log.steps.push({e:name,r});G.note=EVENTS[name][1];shout(EVENTS[name][0].toUpperCase()+'!');busy=false;paint();
    if(S.over)return endGame();next();},1100);}
  next();}
function next(){if(G.puzzle&&S.turn===2)G.puzzle.k--;cpuTurn();armClock();}
function cpuTurn(){if(S.over||!vsCpu()||S.turn!==2)return;busy=true;render();
  later(()=>{busy=false;doMove(cpuPick(S,G.puzzle?LADDER[4]:G.prof));},G.rush?450:750);}
function puzzleFail(m){busy=true;sfx.buzz();S=apply(S,m);render();
  if(G.rush){G.rush.strikes++;shout('MISS');render();return later(G.rush.strikes>=3?endRush:nextRush,1000);}
  G.puzzle.tries++;$('ss').textContent='Not that one. That move lets them off the hook. Resetting.';
  later(()=>{G.puzzle.k=G.puzzle.k0;launch(clone(G.puzzle.start));},1400);}
function endGame(){busy=true;stopClock();const w=S.over,st=store.stats;render();
  if(G.rush){if(w===1){G.rush.score++;sfx.score();shout('SOLVED!');}else{G.rush.strikes++;sfx.buzz();}render();return later(G.rush.strikes>=3?endRush:nextRush,900);}
  GB.celebrate(S,true);shout(w===3?'DRAW':raw(w)==='You'?'YOU WIN!':raw(w).toUpperCase()+' WINS!');
  if(w===3)sfx.lose();else if(vsCpu()&&w===2)later(sfx.lose,300);else later(sfx.win,300);
  if(G.puzzle){later(showResult,1500);return;}
  st.games++;st.modes[G.mode]=(st.modes[G.mode]||0)+1;
  if(G.cpu){if(w===1){st.cpuW++;st.streak++;st.best=Math.max(st.best,st.streak);}else if(w===2){st.cpuL++;st.streak=0;}}
  else if(w===3)st.draws++;else st['p'+w]++;
  if(w!==3){G.wins[w]++;if(!G.first)G.first=w;const rk=rivalKey();if(rk){const a=store.rival[rk.k]||(store.rival[rk.k]=[0,0]);a[(w===1)!==rk.flip?0:1]++;}}
  G.starter=w===3?3-G.starter:3-w;persist();
  later(showResult,w===3?900:2300);}
function showResult(){const w=S.over,box=$('result');box.hidden=false;$('s1').textContent=G.wins[1];$('s2').textContent=G.wins[2];
  const acts=(...b)=>{const a=el('div','acts');for(const x of b){if(!x)continue;const[t,f,cls]=x,bt=el('button',cls||'ghost',t);bt.type='button';bt.onclick=()=>{sfx.ui();f();};a.appendChild(bt);}box.appendChild(a);};
  const menu=['Menu',toMenu],rep=G.log&&G.log.steps.length?['Watch replay',replay]:null;
  if(G.puzzle){const d=store.daily,first=d.last!==today();
    if(first){d.streak=d.last===yesterday()?d.streak+1:1;d.best=Math.max(d.best,d.streak);d.solved++;d.last=today();persist();}
    award('puzzler');if(d.streak>=3)award('regular');if(d.streak>=7)award('devoted');
    confetti();box.innerHTML=`<h3>Puzzle solved</h3><p>${G.puzzle.tries?`Cracked it on attempt ${G.puzzle.tries+1}.`:'First try.'} Daily streak: ${d.streak}. A new puzzle arrives tomorrow.</p><p id="cp"></p>`;
    const txt=`Drop Four daily puzzle ${today()}: solved ${G.puzzle.tries?'on attempt '+(G.puzzle.tries+1):'first try'}, streak ${d.streak}`,note=t=>{$('cp').textContent=t;};
    acts(['Copy result',()=>{try{navigator.clipboard.writeText(txt).then(()=>note('Copied: '+txt),()=>note(txt));}catch(e){note(txt);}},'go'],menu);return;}
  const done=G.wins[1]>=G.need||G.wins[2]>=G.need||G.need===1;
  if(done){const mw=G.wins[1]>G.wins[2]?1:G.wins[2]>G.wins[1]?2:0;let extra='';
    if(G.cpu&&mw===1&&pref.cpu===store.ladder&&store.ladder<5){store.ladder++;persist();extra=`<p>You beat ${G.prof.n}. Unlocked: <b>${G.prof.prize}</b>.</p>`;award('ladder1');if(store.ladder>=5)award('champ');}
    if(G.cpu&&mw)extra+=`<p><i>${G.prof.n}: “${pick(mw===2?G.prof.q.win:G.prof.q.lose)}”</i></p>`;
    if(G.need>1&&mw&&G.first&&G.first!==mw&&!(G.cpu&&mw===2))award('comeback');
    const rk=rivalKey();if(rk&&store.rival[rk.k]){const a=store.rival[rk.k];extra+=`<p>All-time: ${label(1)} ${a[rk.flip?1:0]}, ${label(2)} ${a[rk.flip?0:1]}</p>`;}
    if(mw&&!(G.cpu&&mw===2))confetti();
    box.innerHTML=`<h3>${mw?(label(mw)==='You'?'You win':label(mw)+' wins')+(G.need>1?' the match':''):'It’s a draw'}</h3>${G.need>1?`<p>Final score ${G.wins[1]} to ${G.wins[2]}</p>`:''}${extra}`;
    acts(['Rematch',startMatch,'go'],rep,menu);return;}
  const loser=w===3?0:3-w;box.innerHTML=`<h3>${w===3?'Draw':'Game '+G.no+' goes to '+(label(w)==='You'?'you':label(w))}</h3><p>Match score ${G.wins[1]} to ${G.wins[2]}. First to ${G.need} wins.</p>`;
  if(loser&&G.cpu&&loser===2){const ks=Object.keys(MODES).filter(k=>k!==G.mode);G.mode=pick(ks);box.appendChild(el('p','',`${G.prof.n} lost, so ${G.prof.n} picks the next rules: <b>${MODES[G.mode].name}</b>.`));}
  else if(loser){box.appendChild(el('p','',`${label(loser)==='You'?'You pick':label(loser)+' picks'} the next rules:`));const ch=el('div','chips');
    const draw=()=>{ch.innerHTML='';for(const k in MODES){const b=el('button','opt',MODES[k].name);b.type='button';b.setAttribute('aria-pressed',G.mode===k);b.onclick=()=>{G.mode=k;sfx.ui();draw();};ch.appendChild(b);}};draw();box.appendChild(ch);}
  acts(['Next game',beginGame,'go'],rep,menu);}
function replay(){const lg=G.log;if(!lg)return;gen++;const g=gen;replaying=true;busy=true;$('result').hidden=true;S=clone(lg.start);
  GB.reset(R,C,holeOf(pref.world));GB.pv=null;render();let i=0;
  const step=()=>{if(g!==gen)return;
    if(i>=lg.steps.length){GB.celebrate(S,false);return setTimeout(()=>{if(g===gen){replaying=false;$('result').hidden=false;render();}},1900);}
    const st=lg.steps[i++];S=st.m?apply(S,st.m):event(S,st.e,st.r);if(st.e)shout(EVENTS[st.e][0].toUpperCase()+'!');paint();setTimeout(step,st.e?950:600);};
  setTimeout(step,800);}
function toMenu(){gen++;replaying=false;if(G&&G.rush)clearTimeout(G.rush.t);G&&(G.rush=null);stopClock();closeModal();$('result').hidden=true;setScene(pref.world,true);drawMenu();show('menu');}
function draft(cb){const pool=Object.keys(POWERS),hands=[null,[],[]],a=3-G.starter,order=[a,3-a,3-a,a,a,3-a];let i=0;const g=gen;
  const isCpu=p=>G.cpu&&p===2;
  function take(k){if(g!==gen||i>=6)return;hands[order[i]].push(k);pool.splice(pool.indexOf(k),1);i++;sfx.ui();step();}
  function step(){draw();if(i>=6)return later(()=>{closeModal();cb(hands);},700);
    if(isCpu(order[i]))later(()=>take(pick(pool)),800);}
  function draw(){const p=order[i];
    modal(`<h3>Draft your powers</h3><p>${i>=6?'All set. Good luck.':`<span class="chip k${p}"></span> <b>${label(p)==='You'?'Your pick':label(p)+(isCpu(p)?' is picking…':'’s pick')}</b>, ${i+1} of 6. Each power works once, in place of a normal drop.`}</p>
      <div class="pool" id="pool"></div>
      <div class="dh"><span><span class="chip k1"></span> ${hands[1].map(pchip).join('')}</span><span>${hands[2].map(pchip).join('')} <span class="chip k2"></span></span></div>
      <div class="acts"><button class="ghost" id="qd">Quick deal</button></div>`,true);
    for(const k of pool){const b=el('button','opt',pchip(k)+`<span><b>${POWERS[k].n}</b><small>${POWERS[k].d}</small></span>`);b.type='button';b.disabled=i>=6||isCpu(p);b.onclick=()=>take(k);$('pool').appendChild(b);}
    $('qd').hidden=i>=6;$('qd').onclick=()=>{gen++;const g2=gen;while(i<6){hands[order[i]].push(pool.splice(Math.random()*pool.length|0,1)[0]);i++;}
      draw();setTimeout(()=>{if(g2===gen){closeModal();cb(hands);}},500);};}
  step();}
function puzzleGame(pz,rush){G={mode:'classic',need:1,wins:[0,0,0],starter:1,cpu:false,prof:LADDER[4],puzzle:{start:pz.start,k:pz.k,k0:pz.k,tries:0},rush,no:1,first:0,quip:'',note:''};
  setup('classic','');$('result').hidden=true;launch(clone(pz.start));}
function startDaily(){gen++;setScene(pref.world,false);const d=new Date(),seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(),wk=d.getDay()%6===0;
  const pz=makePuzzle(seed,wk?3:2);if(!pz)return;show('game');puzzleGame(pz,null);}
function startRush(){gen++;const rush={score:0,strikes:0,t:0};setScene(pref.world,false);show('game');
  puzzleGame(makePuzzle(Math.random()*2147483647|0,2),rush);
  const bar=$('clock').firstChild;$('clock').hidden=false;bar.style.transition='none';bar.style.width='100%';void bar.offsetWidth;bar.style.transition='width 120s linear';bar.style.width='0';
  rush.t=setTimeout(()=>{if(G&&G.rush===rush)endRush();},120000);}
function nextRush(){const r=G.rush;if(!r)return;puzzleGame(makePuzzle(Math.random()*2147483647|0,2),r);}
function endRush(){const r=G.rush;if(!r)return;gen++;clearTimeout(r.t);busy=true;G.rush=null;stopClock();$('clock').hidden=true;const best=r.score>store.rush;store.rush=Math.max(store.rush,r.score);persist();
  if(r.score>=5)award('rush5');if(r.score>=10)award('rush10');if(best&&r.score)confetti();sfx.win();
  const box=$('result');box.hidden=false;box.innerHTML=`<h3>${r.score} solved</h3><p>${r.strikes>=3?'Three misses ended the run.':'Time is up.'} ${best&&r.score?'That is a new best.':'Your best is '+store.rush+'.'}</p>`;
  const a=el('div','acts');for(const[t,f,c]of[['Go again',startRush,'go'],['Menu',toMenu,'ghost']]){const b=el('button',c,t);b.type='button';b.onclick=()=>{sfx.ui();f();};a.appendChild(b);}box.appendChild(a);}

/* ---- input ---- */
function colMove(c,y,btn){if(sel==='flip')return{c:-1,pw:'flip'};if(sel)return{c,pw:sel};
  if(M.pop&&y){const r=btn.getBoundingClientRect();if((y-r.top)/r.height>(R-1)/R&&T(S.b[R-1][c])===S.turn)return{c,pop:1};}
  return{c};}
GB.cols.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;audio();tryMove(colMove(+b.dataset.c,e.clientY,b));});
GB.cols.addEventListener('keydown',e=>{const b=e.target.closest('button');if(b&&e.key==='p'&&M.pop)tryMove({c:+b.dataset.c,pop:1});});
GB.cols.addEventListener('pointermove',e=>{const b=e.target.closest('button'),pv=GB.pv;if(!pv)return;if(!b||e.pointerType!=='mouse'||!human()||sel==='flip'){pv.hidden=true;return;}
  const c=+b.dataset.c,act=sel==='bomb'||sel==='anvil'||sel==='swap'||sel==='freeze',top=topRow(S.b,c),r=act?(top<0?R-1:top):landing(S.b,c);
  if(r<0||S.frozen[c]){pv.hidden=true;return;}
  pv.hidden=false;pv.className='disc pv'+(act?'':' t'+(sel==='wild'?4:sel==='stone'?3:S.turn));pv.firstChild.innerHTML=act?ico(sel):'';pv.style.setProperty('--r',r);pv.style.setProperty('--c',c);});
GB.cols.addEventListener('pointerleave',()=>{if(GB.pv)GB.pv.hidden=true;});
$('play').onclick=$('play2').onclick=e=>{audio();sfx.ui();const r=e.currentTarget.getBoundingClientRect();wipe(r.left+r.width/2,r.top+r.height/2,colorsOf(pref.world)[0],startMatch);};
$('back').innerHTML=ico('back');$('back').onclick=toMenu;
const muteIcon=()=>{$('mute').innerHTML=ico(pref.mute?'soff':'son');};
$('mute').onclick=()=>{pref.mute=!pref.mute;persist();muteIcon();audio();sfx.ui();};
AB=mkBoard($('attract').firstElementChild,false);setup('classic','');AB.reset(6,7,41);muteIcon();drawMenu();attract();
}
