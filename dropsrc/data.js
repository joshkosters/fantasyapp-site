const MODES={
  classic:{name:'Classic',desc:'Line up four.',rows:6,cols:7,need:4},
  popout:{name:'Pop Out',desc:'Drop a disc, or pop one of yours out of the bottom row.',rows:6,cols:7,need:4,pop:true},
  flip:{name:'Gravity Flip',desc:'Every 6th move the board turns upside down.',rows:6,cols:7,need:4,flip:6},
  blocks:{name:'Roadblocks',desc:'Five neutral stones start on the board.',rows:6,cols:7,need:4,blocks:5},
  five:{name:'Five Alive',desc:'A 9 by 7 board. Five in a row wins.',rows:7,cols:9,need:5},
  mayhem:{name:'Mayhem',desc:'Every 4th move the board deals a surprise event.',rows:6,cols:7,need:4,mayhem:4}
};
const EVENTS={
  quake:['Quake','The bottom row dropped out.'],
  meteor:['Meteor','A meteor took the top of a column.'],
  conveyor:['Conveyor','The bottom row slid one step to the right.'],
  turncoat:['Turncoat','One disc switched sides.'],
  flip:['Flip','The board turned upside down.'],
  frost:['Frost','A column froze for three turns.'],
  gift:['Gift','Both players were dealt a power.']
};
const WORLDS={
  classic:{name:'Classic',p:['Red','Yellow'],c:['#f0352b','#ffc61a'],hole:41},
  space:{name:'Deep Space',p:['Cyan','Magenta'],c:['#35c8ff','#ff4fd8'],hole:41,twist:'space'},
  arcade:{name:'Arcade',p:['Gold','Pink'],c:['#ffd400','#ff3b8d'],hole:12,twist:'arcade',lock:1},
  haunt:{name:'Haunted',p:['Pumpkin','Ghost'],c:['#ff8a1f','#dff7ea'],hole:41,twist:'haunt',lock:2},
  grid:{name:'Gridiron',p:['Home','Away'],c:['#c8102e','#f2f4f8'],hole:41,twist:'grid',lock:3},
  wood:{name:'Tabletop',p:['Black','White'],c:['#2a2c30','#f3ead8'],hole:41,lock:4},
  custom:{name:'Your world',p:['Player 1','Player 2'],c:['#ff6a3d','#3ad1ff'],hole:41}
};
const TWISTS={
  space:{n:'Black holes',d:'Two black holes hang over the board. Each swallows the first disc dropped through it, then collapses.'},
  arcade:{n:'Line clear',d:'Fill the bottom row and it clears. Everything above drops a level.'},
  haunt:{n:'Vanishing',d:'Discs fade from sight a few turns after they land. Play from memory.'},
  grid:{n:'First to three',d:'A line scores a touchdown and its discs leave the field. First to three touchdowns wins.'}
};
const POWERS={
  bomb:{n:'Bomb',d:'Blasts the top disc of a column and the discs on either side of it.'},
  anvil:{n:'Anvil',d:'Flattens a whole column. The anvil stays behind as a neutral stone.'},
  swap:{n:'Undercut',d:'Play on an opponent’s top disc. Yours takes its spot and theirs moves up one.'},
  freeze:{n:'Freeze',d:'Locks a column. Nobody can use it for the next three turns.'},
  wild:{n:'Wild',d:'A disc that counts for both players.'},
  stone:{n:'Stone',d:'A neutral disc that counts for nobody.'},
  flip:{n:'Flip',d:'Turns the whole board upside down. Tap any column to use it.'}
};
const LADDER=[
  {n:'Dot',b:'Brand new. Drops wherever looks fun.',depth:1,rand:.4,atk:1,def:1,prize:'Arcade world'},
  {n:'Brick',b:'Blocks everything, builds nothing.',depth:2,rand:.12,atk:.6,def:1.6,prize:'Haunted world'},
  {n:'Blitz',b:'All attack, all the time.',depth:3,rand:.05,atk:1.6,def:.7,prize:'Gridiron world'},
  {n:'Sage',b:'Patient. Sees a few moves ahead.',depth:4,rand:0,atk:1,def:1,prize:'Tabletop world'},
  {n:'Quad',b:'The house champion.',depth:5,rand:0,atk:1,def:1.1,prize:'Gold champion trim'}
];
const QUIPS=[
  {start:['Which one is my color again?','I like the middle. It’s cozy.'],smug:['I did that on purpose. Definitely.','Ha! Was that good? That felt good.'],worried:['Uh oh. That looks bad, right?','Wait, you can do that?'],win:['I won?! I WON!'],lose:['Good game! I learned a thing.']},
  {start:['You shall not pass.','I brought extra bricks.'],smug:['Denied.','Nothing gets through.'],worried:['I can’t block both. Unacceptable.','This wall has a crack in it.'],win:['Walls win games.'],lose:['A crack in the wall. It won’t happen again.']},
  {start:['Let’s go, let’s go, let’s go.','I only know one direction: forward.'],smug:['Not today. Back to attacking.','Blocked. Now watch this.'],worried:['Fine. Defense. Ugh.','Okay, that was fast. Respect.'],win:['Too fast for you.'],lose:['I’ll be back, and faster.']},
  {start:['Take your time. I will.','Every disc tells me something.'],smug:['I saw that several moves ago.','As expected.'],worried:['Interesting. I did not expect that.','You have my full attention now.'],win:['Patience wins.'],lose:['Well played. Truly.']},
  {start:['Welcome to my house.','Many have tried.'],smug:['Predictable.','You’ll need more than that.'],worried:['Hm. You’ve been practicing.','That was not in my plan.'],win:['The house always wins.'],lose:['The crown is yours. For now.']}
];
LADDER.forEach((L,i)=>L.q=QUIPS[i]);
const ACH={
  first:['First Drop','Win a game'],fast:['Speedrun','Win within your first seven moves'],purist:['Purist','Win a power game without using a power'],
  boom3:['Demolition','Destroy three discs with one bomb'],wildwin:['Wild Finish','Win with a line that includes a wild'],flipwin:['Upside','Win on a board flip'],
  five:['High Five','Win a game of Five Alive'],mayhem:['Chaos Theory','Win a game of Mayhem'],hole:['Event Horizon','Feed a black hole'],clear:['Line Clear','Clear a row in Arcade'],
  ghost:['Sixth Sense','Win a Haunted game with vanishing discs'],td:['Shutout','Win a Gridiron game 3 to 0'],comeback:['Comeback','Win a series after losing game one'],
  tourist:['Tourist','Play a match in every built-in world'],maker:['World Builder','Design your own world'],ladder1:['On the Board','Beat Dot'],champ:['House Champion','Beat Quad'],
  puzzler:['Puzzler','Solve a daily puzzle'],regular:['Regular','Reach a 3-day puzzle streak'],devoted:['Devoted','Reach a 7-day puzzle streak'],
  rush5:['Quick Study','Solve 5 in one Puzzle Rush'],rush10:['Rush Hour','Solve 10 in one Puzzle Rush']
};
const DIRS=[[0,1],[1,0],[1,1],[1,-1]],GOAL=3;

/* ---------- disc art: every disc is a small SVG ---------- */
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,t)=>{const x=hx(a),y=hx(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const lum=h=>{const[r,g,b]=hx(h);return(.299*r+.587*g+.114*b)/255;};
const svgUrl=(inner,defs)=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs>${defs||''}</defs>${inner}</svg>`)}")`;
const rg=(id,a,b,c)=>`<radialGradient id='${id}' cx='.36' cy='.3' r='.8'><stop offset='0' stop-color='${a}'/><stop offset='.55' stop-color='${b}'/><stop offset='1' stop-color='${c}'/></radialGradient>`;
const starP=(cx,cy,R,r)=>{let p='';for(let i=0;i<10;i++){const a=Math.PI*i/5-Math.PI/2,q=i%2?r:R;p+=(i?'L':'M')+(cx+q*Math.cos(a)).toFixed(1)+' '+(cy+q*Math.sin(a)).toFixed(1);}return p+'Z';};
const gloss=`<ellipse cx='36' cy='29' rx='14' ry='7' fill='#fff' opacity='.3' transform='rotate(-32 36 29)'/>`;
const px=(rows,cell,fill)=>{const w=rows[0].length*cell,h=rows.length*cell,x0=50-w/2,y0=50-h/2;let s='';
  rows.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=='.')s+=`<rect x='${x0+x*cell}' y='${y0+y*cell}' width='${cell+.4}' height='${cell+.4}' fill='${fill}'/>`;}));return s;};
const EMB={
  none:()=>'',star:c=>`<path d='${starP(50,51,17,7.5)}' fill='${c}' opacity='.55'/>`,
  ring:c=>`<circle cx='50' cy='50' r='13' fill='none' stroke='${c}' stroke-width='6' opacity='.55'/>`,
  heart:c=>`<path d='M50 68C30 54 28 40 38 36c6-2 10 2 12 6 2-4 6-8 12-6 10 4 8 18-12 32z' fill='${c}' opacity='.55'/>`,
  bolt:c=>`<path d='M56 24L34 54h13l-5 22 24-32H53z' fill='${c}' opacity='.55'/>`,
  dot:c=>`<circle cx='50' cy='50' r='9' fill='${c}' opacity='.55'/>`
};
function toy(c,emb,square){const hi=mix(c,'#ffffff',.5),lo=mix(c,'#000000',.38),e=(EMB[emb]||EMB.none)(lo);
  if(square)return svgUrl(`<rect x='3' y='3' width='94' height='94' rx='15' fill='${lo}'/><rect x='8' y='7' width='84' height='84' rx='11' fill='url(#g)'/><rect x='20' y='20' width='60' height='60' rx='7' fill='none' stroke='${lo}' stroke-width='2.5' opacity='.5'/>${e}${gloss}`,rg('g',hi,c,lo));
  return svgUrl(`<circle cx='50' cy='50' r='48' fill='${lo}'/><circle cx='50' cy='50' r='44.5' fill='none' stroke='${c}' stroke-width='7' stroke-dasharray='3.2 2.4'/><circle cx='50' cy='50' r='39' fill='url(#g)'/><circle cx='50' cy='50' r='29' fill='none' stroke='${lo}' stroke-width='2.5' opacity='.5'/><circle cx='50' cy='51.2' r='29' fill='none' stroke='${hi}' stroke-width='1.2' opacity='.6'/>${e}${gloss}`,rg('g',hi,c,lo));}
const helmet=(a,b,c,stripe)=>svgUrl(`<circle cx='50' cy='50' r='45' fill='url(#g)'/><g clip-path='url(#k)'><rect x='43' y='0' width='14' height='100' fill='${stripe}'/></g><path d='M24 69q26 15 52 0M29 78q21 12 42 0M50 75v13' fill='none' stroke='#cfd4dc' stroke-width='4.5' stroke-linecap='round'/><circle cx='50' cy='50' r='45' fill='none' stroke='#000' stroke-opacity='.25' stroke-width='2'/>${gloss}`,rg('g',a,b,c)+`<clipPath id='k'><circle cx='50' cy='50' r='45'/></clipPath>`);
const ARTS={
  classic:()=>[toy('#f0352b','star'),toy('#ffc61a','star')],
  space:()=>[
    svgUrl(`<g transform='rotate(-18 50 50)'><ellipse cx='50' cy='50' rx='47' ry='12' fill='none' stroke='#9fe9ff' stroke-width='4' opacity='.7'/></g><circle cx='50' cy='50' r='33' fill='url(#g)'/><g clip-path='url(#k)' fill='#fff' opacity='.24'><rect y='37' width='100' height='5'/><rect y='51' width='100' height='8'/><rect y='66' width='100' height='3'/></g><g transform='rotate(-18 50 50)'><path d='M3 50A47 12 0 0 0 97 50' fill='none' stroke='#e6fbff' stroke-width='4'/></g>`,rg('g','#d9fbff','#35c8ff','#0a4f80')+`<clipPath id='k'><circle cx='50' cy='50' r='33'/></clipPath>`),
    svgUrl(`<circle cx='50' cy='50' r='42' fill='url(#g)'/><g fill='#7a1466' opacity='.5'><circle cx='63' cy='61' r='9'/><circle cx='36' cy='45' r='6.5'/><circle cx='59' cy='28' r='4.5'/><circle cx='34' cy='69' r='4'/><circle cx='76' cy='42' r='3'/></g><circle cx='50' cy='50' r='42' fill='none' stroke='#ffd3f5' stroke-opacity='.5' stroke-width='1.5'/>`,rg('g','#ffd3f5','#ff4fd8','#7a1466'))],
  arcade:()=>{const tile=(c,g)=>svgUrl(`<rect x='5' y='5' width='90' height='90' rx='9' fill='${c}'/><path d='M5 5H95L83 17H17V83L5 95Z' fill='#fff' opacity='.42'/><path d='M95 95H5L17 83H83V17L95 5Z' fill='#000' opacity='.3'/>${g}`);
    return[tile('#ffd400',px(['..XX..','.XXXX.','XXXXXX','XXXXXX','.XXXX.','..XX..'],8,'#7a4d00')),tile('#ff3b8d',px(['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'],7,'#fff'))];},
  haunt:()=>[
    svgUrl(`<path d='M45 17q2-11 10-12l3 5q-5 2-5 8z' fill='#4c7a2a'/><ellipse cx='50' cy='55' rx='45' ry='39' fill='url(#g)'/><g fill='none' stroke='#a84300' stroke-width='2' opacity='.55'><ellipse cx='50' cy='55' rx='24' ry='39'/><ellipse cx='50' cy='55' rx='8' ry='39'/></g><g fill='#ffe27a'><path d='M26 48l10-13 8 13zM56 48l8-13 10 13zM26 63l8 5 6-5 6 6 4-6 4 6 6-6 6 5 8-5q-6 19-24 19T26 63z'/></g>`,rg('g','#ffc46b','#ff8a1f','#a84300')),
    svgUrl(`<path d='M12 52a38 40 0 0 1 76 0v34l-10-8-9 9-9-9-10 9-9-9-10 9-9-9-10 8z' fill='url(#g)'/><g fill='#1b1226'><ellipse cx='38' cy='46' rx='6' ry='8.5'/><ellipse cx='62' cy='46' rx='6' ry='8.5'/><ellipse cx='50' cy='65' rx='5.5' ry='7.5'/></g>`,rg('g','#ffffff','#dff7ea','#86ab97'))],
  grid:()=>[helmet('#ef5a6e','#c8102e','#7d0a1c','#fff'),helmet('#ffffff','#f2f4f8','#aab1bf','#1b3a8f')],
  wood:()=>[
    svgUrl(`<circle cx='50' cy='50' r='45' fill='url(#g)'/><ellipse cx='37' cy='31' rx='15' ry='8' fill='#fff' opacity='.16' transform='rotate(-32 37 31)'/>`,rg('g','#757a82','#2a2c30','#0b0c0e')),
    svgUrl(`<circle cx='50' cy='50' r='45' fill='url(#g)'/><g fill='none' stroke='#c9b998' stroke-width='1.1' opacity='.55'><path d='M12 44q38-14 76 4M10 56q40-12 80 6M16 68q34-8 68 6'/></g><ellipse cx='37' cy='31' rx='15' ry='8' fill='#fff' opacity='.55' transform='rotate(-32 37 31)'/>`,rg('g','#ffffff','#f3ead8','#b3a486'))]
};
function artFor(k,cu){const w=WORLDS[k],c=k==='custom'?[cu.p1,cu.p2]:w.c,sq=k==='custom'&&cu.shape==='square';
  const a=k==='custom'?[toy(cu.p1,cu.emblem,sq),toy(cu.p2,cu.emblem,sq)]:ARTS[k]();
  const wild=svgUrl(`<path d='M50 4a46 46 0 0 0 0 92z' fill='${c[0]}'/><path d='M50 4a46 46 0 0 1 0 92z' fill='${c[1]}'/><circle cx='50' cy='50' r='44.5' fill='none' stroke='#fff' stroke-width='3'/><path d='${starP(50,51,25,11)}' fill='#fff' stroke='#141414' stroke-width='3' stroke-linejoin='round'/>`);
  const stone=svgUrl(`<path d='M50 6L84 20 94 54 76 90 36 95 8 66 14 28Z' fill='#868fa3'/><path d='M50 6L84 20 58 42 14 28Z' fill='#b4bccb'/><path d='M58 42L94 54 76 90 52 70Z' fill='#626a7c'/><path d='M14 28L58 42 52 70 8 66Z' fill='#99a1b4'/>`);
  return[a[0],a[1],wild,stone];}
const IC={
  bomb:"<circle cx='10' cy='15' r='7' fill='currentColor' stroke='none'/><path d='M14.5 9.5l3-3m0 0l.5-3.5m-.5 3.5l3.5.5m-3.5-.5l2.5-2.5'/>",
  anvil:"<path d='M3 7h13v3c3 0 5-1 5-3h1c0 4-3 6-7 6v2l3 4H5l3-4v-2C5 13 3 10 3 7z' fill='currentColor' stroke='none'/>",
  swap:"<path d='M7 20V5m0 0L3 9m4-4l4 4M17 4v15m0 0l-4-4m4 4l4-4'/>",
  freeze:"<path d='M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5'/>",
  wild:"<path d='M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7z' fill='currentColor' stroke='none'/>",
  stone:"<path d='M12 3l7 3 2 7-4 7-8 1-6-6 1-8z' fill='currentColor' stroke='none'/>",
  flip:"<path d='M4 10a8 8 0 0 1 14.5-3M20 4v4h-4M20 14a8 8 0 0 1-14.5 3M4 20v-4h4'/>",
  back:"<path d='M15 5l-7 7 7 7'/>",
  son:"<path d='M4 9v6h4l5 4V5L8 9z' fill='currentColor' stroke='none'/><path d='M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11'/>",
  soff:"<path d='M4 9v6h4l5 4V5L8 9z' fill='currentColor' stroke='none'/><path d='M16.5 9.5l5 5m0-5l-5 5'/>",
  lock:"<rect x='5' y='11' width='14' height='9' rx='2' fill='currentColor' stroke='none'/><path d='M8 11V8a4 4 0 0 1 8 0v3'/>",
  check:"<path d='M5 12.5l4.5 4.5L19 7'/>",
  m_classic:"<g fill='currentColor' stroke='none'><circle cx='4.5' cy='19.5' r='2.7'/><circle cx='9.5' cy='14.5' r='2.7'/><circle cx='14.5' cy='9.5' r='2.7'/><circle cx='19.5' cy='4.5' r='2.7'/></g>",
  m_popout:"<circle cx='12' cy='7.5' r='5' fill='currentColor' stroke='none'/><path d='M12 15v7m0 0l-3.2-3.2M12 22l3.2-3.2'/>",
  m_blocks:"<path d='M12 3l7 3 2 7-4 7-8 1-6-6 1-8z' fill='currentColor' stroke='none'/>",
  m_five:"<g fill='currentColor' stroke='none'><circle cx='3' cy='12' r='2'/><circle cx='7.5' cy='12' r='2'/><circle cx='12' cy='12' r='2'/><circle cx='16.5' cy='12' r='2'/><circle cx='21' cy='12' r='2'/></g>",
  m_mayhem:"<path d='M13.5 2L5 13.5h5.2L9 22l9-12.5h-5.3z' fill='currentColor' stroke='none'/>"
};
IC.m_flip=IC.flip;
const PCOL={bomb:'#e5484d',anvil:'#5b6477',swap:'#8e4ec6',freeze:'#0a9fd0',wild:'#e89a0c',stone:'#7d8590',flip:'#2f9e68'};
const pchip=k=>`<span class="pc" style="--pc:${PCOL[k]}">${ico(k)}</span>`;
const ico=k=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
