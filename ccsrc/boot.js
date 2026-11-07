const PRE=((location.hash||'').slice(1)||'lineup');
document.documentElement.classList.add('embed','p-'+PRE);
function seasonAt(w){newSeason();G.auto=true;advance();refresh();for(let i=0;i<w&&G.w<N;i++)runRace();refresh()}
const TABS={lineup:'team',match:'match',cards:'waivers',waivers:'waivers',sched:'sched',league:'league',coll:'coll',rules:'rules',fan:'team'};
if(PRE==='draft'){newSeason();tab='draft'}
else{seasonAt(PRE==='league'?14:8);tab=TABS[PRE]||'team'}
render();
if(PRE==='fan'){const picks=PKS.map(pk=>[pk,NOS.slice().sort((a,b)=>RK[pk][a]-RK[pk][b])[0]]),n=picks.length,mid=(n-1)/2;
 $('view').innerHTML=`<div class="handw"><div class="hand">${picks.map(([pk,no],i)=>{const d=i-mid;return`<button class="hc" data-card="${pk}:${no}" data-cap="" style="--r:${(d*4.5).toFixed(1)}deg;--y:${(d*d*5).toFixed(0)}px;--pc:${PCOL[pk]};z-index:${i+1}"><div class="pc">${cardHTML(no,pk)}</div></button>`}).join('')}</div></div>`}
const post=o=>{try{parent.postMessage(Object.assign({cc:1,p:PRE},o),'*')}catch(e){}};
let MM=false;
const measure=()=>{if(MM)return;const w=document.querySelector('.wrap');post({h:Math.ceil(w.getBoundingClientRect().bottom+window.scrollY)+(PRE==="fan"?14:28)})};
new ResizeObserver(measure).observe(document.querySelector('.wrap'));window.addEventListener('load',measure);setTimeout(measure,400);setTimeout(measure,1500);
new MutationObserver(()=>{const on=$('ov').classList.contains('on');if(on===MM)return;MM=on;document.documentElement.classList.toggle('mm',on);post({modal:on});if(!on)setTimeout(measure,60)}).observe($('ov'),{attributes:true,attributeFilter:['class']});
