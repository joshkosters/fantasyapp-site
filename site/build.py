import os
FONTS=''
def head(title,desc,p):
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><meta name="description" content="{desc}">{FONTS}<link rel="stylesheet" href="{p}assets/style.css?v=1107e"></head><body><div class="wrap">'
def nav(p):
    return f'''<header class="nav"><a class="logo" href="{p or './'}">fantasyapp<span class="o">.io</span></a>
<nav class="links"><a class="hide" href="{p}#games">All games</a><a class="hide" href="{p}#games" data-cat="sports">Sports</a><a class="hide" href="{p}#games" data-cat="trivia">Trivia</a><a class="hide" href="{p}#games" data-cat="learn">Learn</a>
<span class="cta"><a class="btn ink" style="padding:13px 22px" href="{p}cfb/demo/">Play a demo</a><span class="cir" aria-hidden="true">↗</span></span></nav></header>'''
def foot(p):
    return f'''<footer class="panel foot"><div class="row2"><div class="d hd" style="font-size:clamp(34px,4.6vw,56px)">Sign up to be notified<br>about <span class="o">every drop.</span> No spam.</div>
<form id="signup" action="#" onsubmit="return su(event)"><input type="email" required maxlength="200" placeholder="you@example.com" aria-label="Email address"><button class="btn" type="submit">Sign me up</button></form></div>
<p class="fine">One short email each week when a new game drops. See our <a class="o" href="{p}privacy/">privacy page</a>. No spam, leave any time.<span id="sumsg" role="status"></span></p>
<div class="d mark" aria-hidden="true">fantasyapp<span>.io</span></div></footer>
<script>
function su(e){{e.preventDefault();var f=e.target,b=f.querySelector('button'),m=document.getElementById('sumsg');b.disabled=true;var fl={{email:{{stringValue:f.querySelector('input').value.trim()}},createdAt:{{timestampValue:new Date().toISOString()}}}};if(f.dataset.interest)fl.interest={{stringValue:f.dataset.interest}};m=f.parentNode.querySelector('.msg')||m;
fetch('https://firestore.googleapis.com/v1/projects/fantasyapp-io/databases/(default)/documents/signups?key=AIzaSyDdnswvuiieByPB8mg5NURVt9P5CZDTra8',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{fields:fl}})}})
.then(function(r){{if(!r.ok)throw 0;var d=new URLSearchParams({{email:f.querySelector('input').value.trim()}});if(f.dataset.interest)d.append('tag',f.dataset.interest);fetch('https://buttondown.com/api/emails/embed-subscribe/kosters',{{method:'POST',mode:'no-cors',body:d}}).catch(function(){{}});b.textContent='Thanks!';f.querySelector('input').value='';m.textContent=' You are on the list.'}})
.catch(function(){{b.disabled=false;m.textContent=' Could not sign you up. Try again later.'}});return false}}
</script>'''
def end(): return '</div></body></html>'
games=[
 ('cfb','Fantasy CFB','sports','Sports · League','College fantasy football with friends.','big','background:var(--orange)','live'),
 ('marquee-grid','Marquee Grid','trivia','Trivia · Movies','Spin the wheel and fill the grid with movie knowledge.','','background:var(--ink);color:var(--cream)','live'),
 ('crew-chief','NASCAR Crew Chief','sports','Sports · Coming 2027','Build a crew. Out-wrench your friends.','','background:var(--yellow)','live'),
 ('m2','Mystery game','mystery','Game 04','Something new.','','background:var(--card);border:2px solid var(--ink)','mystery'),
 ('m3','Mystery game','mystery','Game 05','Something new.','','background:var(--dark2);color:var(--cream)','mystery'),
 ('m4','Mystery game','mystery','Game 06 · Unlocks in 4 weeks','Something new.','wide','background:var(--orange)','mystery'),
]
def gcard(g):
    s,n,c,tag,d,cls,st,stat=g
    tagc='color:var(--orange)' if 'ink' in st and 'cream' in st else ''
    cl=('g '+cls).strip()+(' topo-k' if s=='marquee-grid' else '')
    inner=f'<div class="eb" style="{tagc}">{tag}</div><div><div class="d">{n.replace(" ","<br>",1) if cls!="wide" else n}</div>'+(f'<div style="font-weight:700;margin-top:8px;font-size:15px">{d}</div></div>' if cls=='big' else '</div>')
    if cls=='wide': inner=f'<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><span class="eb" style="color:var(--orange)">{tag}</span><span class="d">{n}</span></div>'
    if stat=='mystery':
        return f'<div class="{cl} mys" data-cat="{c}" style="{st}"><div class="blur" aria-hidden="true">{inner}</div><span class="soon">NEXT UP</span><span class="q d" aria-hidden="true">?</span></div>'
    if stat=='live':
        return f'<a class="{cl}" data-cat="{c}" style="{st}" href="{"marquee" if s=="marquee-grid" else s}/">{inner}<span class="cir" style="position:absolute;right:20px;top:20px;background:var(--ink);color:var(--cream)">↗</span></a>'
    return f'<div class="{cl}" data-cat="{c}" style="{st}">{inner}<span class="soon">COMING SOON</span></div>'
# ---------- index
p=''
h=head('fantasyapp.io · Games to play with friends','A new game every week to test your knowledge, your fandom or your creativity. Free to try.',p)
h+=nav(p)
h+='''<section class="panel hero"><div class="strip topo" aria-hidden="true"></div>
<div class="eb o" style="margin-bottom:20px">A new game every week</div>
<h1 class="d">Games to<br>play with<br><span class="o">friends.</span></h1>
<p class="blurb">A game a week to test your knowledge, fandom or creativity. Think you know movies? Always wanted a fantasy league, but for college football? Start here.</p>
<div class="acts"><a class="btn" href="cfb/demo/">▶ Play a demo</a><span class="cir" style="background:var(--cream)" aria-hidden="true">↗</span></div>
<div class="fan" aria-hidden="true">
<div class="c" style="left:0;top:60px;background:var(--dark2);color:var(--cream);transform:rotate(-14deg)"><div class="d">Marquee<br>Grid</div></div>
<div class="c" style="left:110px;top:20px;background:var(--yellow);transform:rotate(-2deg)"><div class="d">Defense<br>IQ</div></div>
<div class="c" style="left:220px;top:56px;background:var(--orange);transform:rotate(11deg)"><div class="d">Fantasy<br>CFB</div><div style="margin-top:90px;background:var(--ink);color:var(--cream);border-radius:14px;padding:12px 14px;font-size:12px;font-weight:700"><div style="display:flex;justify-content:space-between"><span>You</span><span>98.4</span></div><div style="height:6px;border-radius:9px;background:#3a3834;margin:8px 0"><div style="width:61%;height:6px;border-radius:9px;background:var(--orange)"></div></div><div style="display:flex;justify-content:space-between;color:var(--mute)"><span>Sam</span><span>71.2</span></div></div></div></div>
<span class="sticker" style="position:absolute;left:600px;top:470px;z-index:4">FREE TO TRY</span></section>
<div class="sec-h"><h2 class="d">What's in<br>the box<span class="o">.</span></h2><p>Think you know movies? Ever wanted a fantasy league, but for college football? Every game has a quick tour and a demo. Nothing to install, no account.</p></div>
<section class="bento">
<div class="t tall" style="grid-row:span 2;background:var(--orange)"><div class="eb">New game, every week</div><div class="d big" style="font-size:420px;left:20px;bottom:-70px;color:var(--ink)">1</div></div>
<div class="t" style="background:var(--ink);color:var(--cream)"><div class="eb" style="color:var(--mute)">Ads</div><div class="d big o">0</div></div>
<div class="t" style="background:var(--yellow)"><div class="eb">Tour length</div><div class="d big">20s</div></div>
<div class="t topo" style="grid-column:span 2;display:flex;align-items:flex-end"><div class="d" style="font-size:clamp(30px,5vw,54px);background:var(--ink);color:var(--cream);padding:12px 18px;border-radius:16px">Test your knowledge. Your fandom. Your creativity.</div></div>
</section>
<section style="position:relative;padding:36px 14px 8px"><h2 class="d" style="font-size:clamp(48px,6vw,72px);margin-bottom:22px">Follow the<br>white rabbit</h2>
<div class="rows">
<div class="row"><span class="n">01</span><span class="tx">Browse the games</span><a class="cir" href="#games" aria-label="Browse the games">↗</a></div>
<div class="row"><span class="n">02</span><span class="tx">Filter by sports, trivia or learning</span><a class="cir" href="#games" aria-label="Filter the games">↗</a></div>
<div class="row on"><span class="n">03</span><span class="tx">Open one and play</span><a class="cir" href="#grid" aria-label="Open a game">↗</a></div>
<div class="row"><span class="n">04</span><span class="tx">Get a new game every week</span><a class="cir" href="#signup" aria-label="Join the list">↗</a></div></div></div>
<div class="pop" aria-hidden="true"><div class="eb" style="color:var(--mute2);margin-bottom:10px">Week 9 · In progress</div><div style="height:8px;border-radius:9px;background:#e9e1c4"><div style="width:61%;height:8px;border-radius:9px;background:var(--orange)"></div></div><div style="display:flex;justify-content:space-between;font-weight:800;font-size:14px;margin-top:12px"><span>Jordan Hart</span><span style="background:var(--ink);color:var(--cream);padding:2px 8px;border-radius:6px;font-size:12px">24.6</span></div><div style="display:flex;justify-content:space-between;font-weight:700;font-size:14px;margin-top:8px"><span>Marcus Cole</span><span style="background:var(--yellow);padding:2px 8px;border-radius:6px;font-size:12px">LIVE</span></div></div></section>
<section id="games" style="padding:40px 14px 0;display:flex;flex-direction:column;gap:20px"><div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px"><h2 class="d" style="font-size:clamp(52px,7.5vw,96px)">Shall we play<br>a game?</h2>
<div class="tabs" role="tablist"><button class="on" data-f="all">All</button><button data-f="sports">Sports</button><button data-f="trivia">Trivia</button><button data-f="learn">Learn</button></div></div></section>
<section class="games" id="grid">'''+''.join(gcard(g) for g in games)+'</section>'
h+=foot(p)+'''<script>
(function(){var b=document.querySelectorAll('.tabs button'),c=document.querySelectorAll('#grid>[data-cat]');
function f(k){b.forEach(function(x){x.classList.toggle('on',x.dataset.f===k)});c.forEach(function(x){x.style.display=(k==='all'||x.dataset.cat===k)?'':'none'})}
b.forEach(function(x){x.addEventListener('click',function(){f(x.dataset.f)})});
document.querySelectorAll('[data-cat].nav a, .links a[data-cat]').forEach(function(a){a.addEventListener('click',function(){f(a.dataset.cat)})});
var h=location.hash;})();
</script>'''+end()
open('index.html','w').write(h)
# ---------- cfb game page
p='../'
def feat(n,t,d,bg,fg,ex=''):
    bc='var(--ink)' if bg!='var(--ink)' else 'var(--orange)'
    return f'<div class="feat" style="background:{bg};color:{fg};{ex}"><div class="d big" style="color:{bc}">{n}</div><div class="in"><div class="d">{t}</div><p>{d}</p></div></div>'
h=head('Fantasy CFB · fantasyapp.io','College fantasy football with friends: a real snake draft, lineups that lock at kickoff, and a live win tracker.',p)
h+=nav(p)
h+=f'''<section class="panel hero" style="min-height:560px;padding-bottom:56px"><div class="strip topo" style="width:200px" aria-hidden="true"></div>
<div class="eb" style="color:var(--mute)"><a class="o" href="{p}">All games</a> / Sports / Fantasy CFB</div>
<h1 class="d" style="font-size:clamp(70px,14.5vw,190px);margin-top:22px">Fantasy<br><span class="o">CFB.</span></h1>
<p style="margin:26px 0 0;max-width:420px;font-size:18px;line-height:1.6;color:var(--mute);font-weight:500;position:relative;z-index:1">Your Saturday league, your rules. Draft with friends, set lineups that lock at kickoff, and watch the win tracker move as games finish.</p>
<div style="display:flex;gap:10px;align-items:center;margin-top:30px;position:relative;z-index:3;flex-wrap:wrap"><a class="btn" href="demo/">▶ Play the demo</a><span class="cir" style="background:var(--cream)" aria-hidden="true">↗</span><a class="btn line" style="margin-left:8px;color:var(--cream)" href="start/">Start your own league</a></div>
<div class="hide-s" style="position:absolute;right:120px;top:70px;width:330px;z-index:2;transform:rotate(6deg);background:var(--cream);color:var(--ink);border-radius:26px;padding:22px;box-shadow:0 22px 50px rgba(0,0,0,.5)">
<div class="eb" style="color:var(--mute2)">Week 9 · Matchup</div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px"><span class="d" style="font-size:78px">98.4</span><span class="d" style="font-size:40px;color:#8a826f">71.2</span></div>
<div style="height:10px;border-radius:9px;background:#e1d7b4;margin:12px 0"><div style="width:61%;height:10px;border-radius:9px;background:var(--orange)"></div></div><div style="font-weight:800;font-size:13px">Win tracker · 61%</div><div style="font-size:12px;color:var(--mute2);margin-top:6px">Example matchup, made-up teams.</div></div>
</section>
<div class="sec-h"><h2 class="d">Why it's<br>fun<span class="o">.</span></h2><p>Built for a small group of friends who want a real draft and a real Saturday.</p></div>
<section class="bench">{feat('01','Live snake draft','A pick clock, a queue and a ticker that lights up each new pick.','var(--orange)','var(--ink)')}{feat('02','Lineups that lock',"Each slot locks when that player's game kicks off.",'var(--ink)','var(--cream)','margin-top:34px;')}{feat('03','Free to run yourself','Open source, on your own free Firebase project.','var(--yellow)','var(--ink)')}</section>
<section style="padding:34px 14px 6px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><a class="btn ink" href="start/">Start your own league</a><a class="btn line" style="color:var(--ink)" href="demo/">▶ Try the demo first</a><span style="font-weight:700;color:#4a463c;font-size:15px">Free. About 30 to 45 minutes to set up.</span></section>
<div class="sec-h" style="padding-bottom:0"><h2 class="d" style="font-size:clamp(48px,6vw,72px)">Other projects</h2></div>
<section class="more"><a class="d" style="background:var(--yellow)" href="{p}crew-chief/">NASCAR Crew Chief</a><a class="d topo-k" style="color:var(--cream)" href="{p}marquee/">Marquee Grid</a><a class="d" style="background:var(--card);border:2px solid var(--ink)" href="{p}#games">All games →</a></section>'''
h+=foot(p)+end()
h=h.replace('class="hide-s"','class="hide-s"')
open('cfb/index.html','w').write(h)

# ---------- cfb start page
os.makedirs('cfb/start',exist_ok=True)
p='../../'
h=head('Start your own league · Fantasy CFB','How to run your own Fantasy CFB league for you and your friends, free.',p)
h+=nav(p)
h+=f'''<section class="panel hero" style="min-height:420px;padding-bottom:56px"><div class="strip topo" style="width:160px" aria-hidden="true"></div>
<div class="eb" style="color:var(--mute)"><a class="o" href="{p}cfb/">Fantasy CFB</a> / Start your own league</div>
<h1 class="d" style="font-size:clamp(60px,11vw,150px);margin-top:22px">Start your<br><span class="o">own league.</span></h1>
<p style="margin:26px 0 0;max-width:520px;font-size:18px;line-height:1.6;color:var(--mute);font-weight:500;position:relative;z-index:1">Always wanted a fantasy league, but for college football? You can run one for your friends, free. Setup takes about 30 to 45 minutes and you will need a computer.</p>
<div style="margin-top:30px;position:relative;z-index:3"><a class="btn" href="https://github.com/joshkosters/fantasy-cfb">Get the code on GitHub</a></div></section>
<div class="sec-h"><h2 class="d">Look under<br>the hood<span class="o">.</span></h2><p>Real screens from the app, in a demo league with made-up teams. Swipe through.</p></div>
<section class="shots"><figure class="shot" style="background:var(--orange)"><img src="img/draft.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Live snake draft"><figcaption><b class="d">Live snake draft</b><span>A pick clock, a queue and a ticker for every pick.</span></figcaption></figure><figure class="shot" style="background:var(--yellow)"><img src="img/matchup.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Matchup + win tracker"><figcaption><b class="d">Matchup + win tracker</b><span>Watch your odds move as games finish.</span></figcaption></figure><figure class="shot" style="background:var(--cream)"><img src="img/lineup.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Lineups that lock"><figcaption><b class="d">Lineups that lock</b><span>Each slot locks when that player kicks off.</span></figcaption></figure><figure class="shot" style="background:var(--orange)"><img src="img/queue.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Every player, searchable"><figcaption><b class="d">Every player, searchable</b><span>Filter by position, flag your guys, see projections.</span></figcaption></figure><figure class="shot" style="background:var(--yellow)"><img src="img/standings.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Standings + playoffs"><figcaption><b class="d">Standings + playoffs</b><span>Top four make the playoffs. Recaps every week.</span></figcaption></figure><figure class="shot" style="background:var(--cream)"><img src="img/commish.jpg" width="320" height="655" loading="lazy" alt="Fantasy CFB demo: Commissioner tools"><figcaption><b class="d">Commissioner tools</b><span>Waivers, trades, injury statuses and league settings.</span></figcaption></figure></section>
<div class="sec-h"><h2 class="d">Six steps<span class="o">.</span></h2><p>Comfortable with a terminal? Easy. The full written guide is in the code's README.</p></div>
<section style="padding:0 14px"><div class="rows"><div class="row" style="align-items:flex-start"><span class="n">01</span><span class="tx"><b style="display:block">Make a free Firebase project</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Go to console.firebase.google.com, create a project, turn on Google sign-in, and create a Firestore database. It holds your league. The free plan is plenty for friends.</span></span></div><div class="row" style="align-items:flex-start"><span class="n">02</span><span class="tx"><b style="display:block">Download the code</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Get it from GitHub (button at the top). It is one web page plus a few setup files. Nothing to build.</span></span></div><div class="row" style="align-items:flex-start"><span class="n">03</span><span class="tx"><b style="display:block">Add your email as commissioner</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Run one short command that puts your Google email into the league config. You become the commissioner who runs the draft.</span></span></div><div class="row" style="align-items:flex-start"><span class="n">04</span><span class="tx"><b style="display:block">Publish it</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Install the Firebase tool, sign in, and run <code>firebase deploy</code>. You get your own web address for the league.</span></span></div><div class="row" style="align-items:flex-start"><span class="n">05</span><span class="tx"><b style="display:block">Load the players and add your friends</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Open the admin page on your new site, load the Big Ten, SEC and Big 12 players, and add each friend by their Google email.</span></span></div><div class="row" style="align-items:flex-start"><span class="n">06</span><span class="tx"><b style="display:block">Draft, then play every Saturday</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a463c;display:block;margin-top:4px">Friends claim a team, you start the draft, and on game days you tap one button to pull the stats and score the week.</span></span></div></div></section>
<section class="panel" style="margin-top:36px;background:var(--yellow);color:var(--ink);padding:48px 56px;position:relative"><div class="eb">Rather not set it up?</div>
<h2 class="d" style="font-size:clamp(44px,6vw,80px);margin:10px 0 12px">We could host<br>it for you.</h2>
<p style="max-width:520px;font-size:17px;line-height:1.6;font-weight:600;margin:0 0 22px">Tell us you would use a hosted version: no Firebase, no terminal, just create a league and send friends a link. If enough people want it, we will build it. We will email you once.</p>
<div><form data-interest="cfb-hosted" onsubmit="return su(event)" style="display:flex;gap:10px;flex-wrap:wrap"><input type="email" required maxlength="200" placeholder="you@example.com" aria-label="Email address" style="flex:1 1 240px;padding:16px 20px;border-radius:99px;border:2px solid var(--ink);background:var(--cream);font:inherit;font-size:16px"><button class="btn ink" type="submit">Tell me when it exists</button></form><span class="msg" role="status" style="display:block;margin-top:10px;font-weight:700"></span></div></section>'''
h+=foot(p)+end()
open('cfb/start/index.html','w').write(h)
# ---------- marquee page
import os
os.makedirs('marquee',exist_ok=True)
p='../'
h=head('Marquee Grid · fantasyapp.io','Six movie trivia mini-games for people who think they know their stuff. Spin the wheel, play solo or pass the device.',p)
h+=nav(p)
h+=f'''<section class="panel hero" style="min-height:560px;padding-bottom:56px"><div class="strip topo" style="width:200px" aria-hidden="true"></div>
<div class="eb" style="color:var(--mute)"><a class="o" href="{p}">All games</a> / Trivia / Marquee Grid</div>
<h1 class="d" style="font-size:clamp(70px,14.5vw,190px);margin-top:22px">Marquee<br><span class="o">Grid.</span></h1>
<p style="margin:26px 0 0;max-width:440px;font-size:18px;line-height:1.6;color:var(--mute);font-weight:500;position:relative;z-index:1">Think you know movies? Spin the wheel and find out. Six quick cinema mini-games for the person who always wins movie night. Free in your browser.</p>
<div style="margin-top:30px;position:relative;z-index:3"><a class="btn" href="play/">▶ Play now</a></div></section>'''
h+='''<div class="sec-h"><h2 class="d">Six games.<br>One wheel<span class="o">.</span></h2><p>Each turn the wheel picks the game, so you never know what is coming. Bring your film knowledge, not just your favorites.</p></div>
<section class="mg"><article class="mgc" style="background:var(--orange)"><div class="mh"><span class="d nn">01</span><h3 class="d">Marquee Grid</h3></div><div class="mv"><div class="mgrid"><span></span><b>Tom Hanks</b><b>Christian Bale</b><b>Leonardo DiCaprio</b><b>Steven Spielberg</b><i class="f">Saving Private Ryan</i><i>+</i><i>+</i><b>Martin Scorsese</b><i>+</i><i>+</i><i class="f">The Departed</i><b>Christopher Nolan</b><i>+</i><i class="f">The Dark Knight</i><i>+</i></div></div><p class="tg">Nine squares. Two clues each. One film that fits both.</p><p>Every row and column is a star, a director, a genre or a decade. Name a movie that satisfies the row and the column at once. Any credited role counts for actors, each film works once, and you get nine guesses. A wrong guess costs one. Miss a square and the game shows you what would have fit.</p><p class="rl">1 point per square, plus a bonus for a perfect grid.</p></article><article class="mgc" style="background:var(--yellow)"><div class="mh"><span class="d nn">02</span><h3 class="d">Mystery Movie</h3></div><div class="mv"><div class="mmys"><div><span>Guess 1</span><span class="mc y">Lead</span><span class="mc n">Director</span><span class="mc y">Genre</span><span class="mc n">Decade</span></div><div><span>Guess 2</span><span class="mc y">Lead</span><span class="mc y">Director</span><span class="mc y">Genre</span><span class="mc y">Decade</span></div></div></div><p class="tg">A hidden film. Eight guesses. Every miss teaches you something.</p><p>Guess any movie and the game tells you what it shares with the mystery film: lead actors, director, genre, decade. Narrow it down like a detective. Stuck after three guesses? Buy a hint for a point: a one-line plot, the genre and era, or a link through a shared cast member.</p><p class="rl">Starts at 10 points and drops with each extra guess or hint.</p></article><article class="mgc" style="background:var(--cream)"><div class="mh"><span class="d nn">03</span><h3 class="d">Cast Reveal</h3></div><div class="mv"><div class="mclue"><div class=""><em>01</em><span>Supporting</span><b>A smaller role</b></div><div class=""><em>02</em><span>Released</span><b>The year</b></div><div class=""><em>03</em><span>Directed by</span><b>The filmmaker</b></div><div class="lk"><em>04</em><span>Locked</span><b></b></div><div class="lk"><em>05</em><span>Locked</span><b></b></div></div></div><p class="tg">Name the film from the credits, smallest role first.</p><p>Clues arrive one at a time, starting with the bit parts nobody remembers, then the year, the director, the co-star and finally the top-billed name. Think you can place it from the supporting cast? Say so early and bank the points. Guess wrong and the next clue unlocks.</p><p class="rl">10 points on the first clue, falling to 2.</p></article><article class="mgc" style="background:var(--orange)"><div class="mh"><span class="d nn">04</span><h3 class="d">Box Office Connections</h3></div><div class="mv"><div class="mtiles"><i class="">Jaws</i><i class="">Pulp Fiction</i><i class="">Big</i><i class="s">Inception</i><i class="">Cast Away</i><i class="">Munich</i><i class="s">Memento</i><i class="">Jackie Brown</i><i class="">Splash</i><i class="s">Dunkirk</i><i class="">Jurassic Park</i><i class="">Death Proof</i><i class="">Philadelphia</i><i class="">E.T.</i><i class="s">Interstellar</i><i class="">Django Unchained</i></div></div><p class="tg">Sixteen movies. Four secret groups of four.</p><p>Find four films that share something: a star, a director, a famous pairing, an IMDb rating range, a title quirk, an Oscar and more. Pick the four that belong together. Four mistakes and the round is over.</p><p class="rl">2 points per group, plus 2 for a flawless round.</p></article><article class="mgc" style="background:var(--yellow)"><div class="mh"><span class="d nn">05</span><h3 class="d">Reel Timeline</h3></div><div class="mv"><div class="mtl"><span class="ax">Oldest</span><div><em>1</em>Titanic<u>↑↓</u></div><div><em>2</em>Casablanca<u>↑↓</u></div><div><em>3</em>The Matrix<u>↑↓</u></div><div><em>4</em>Jaws<u>↑↓</u></div><div><em>5</em>Back to the Future<u>↑↓</u></div><span class="ax">Newest</span></div></div><p class="tg">Five movies. Oldest to newest. One shot.</p><p>Put five films in release order using the arrows, then lock it in. You only get one submission, so this one separates the people who remember when a film came out from the people who just remember it.</p><p class="rl">2 points for every film in the right spot, up to 10.</p></article><article class="mgc" style="background:var(--cream)"><div class="mh"><span class="d nn">06</span><h3 class="d">Six Degrees</h3></div><div class="mv"><div class="mdeg"><b>Kevin Bacon</b><i>Apollo 13</i><b>Tom Hanks</b><i>Sleepless in Seattle</i><b>Meg Ryan</b></div></div><p class="tg">Connect two actors through the movies they share.</p><p>You get two actors and have to link them, film by film, in as few steps as you can. It is the old Kevin Bacon game, with a library of film credits behind it.</p><p class="rl">Up to 10 points. Shorter chains score more.</p></article></section>
<section class="panel" style="margin-top:36px;background:var(--ink);color:var(--cream);padding:44px 56px"><div class="eb o">Movie night, upgraded</div><h2 class="d" style="font-size:clamp(40px,5.5vw,72px);margin:10px 0 14px">Play solo.<br>Or settle it with friends<span class="o">.</span></h2>
<p style="max-width:620px;font-size:17px;line-height:1.65;font-weight:500;margin:0 0 22px">Pass the device between one and six players. Play a set number of rounds or race to a score, add a turn timer (a tension track kicks in when the clock starts), and let the wheel decide. Answers come from a built-in library of about 1,700 films, so there is nothing to look up and no account to make.</p>
<a class="btn" href="play/">▶ Play now</a></section>'''
h+=f'''<div class="sec-h" style="padding-bottom:0"><h2 class="d" style="font-size:clamp(48px,6vw,72px)">Other projects</h2></div>
<section class="more"><a class="d" style="background:var(--yellow)" href="{p}crew-chief/">NASCAR Crew Chief</a><a class="d" style="background:var(--orange)" href="{p}cfb/">Fantasy CFB</a><a class="d" style="background:var(--card);border:2px solid var(--ink)" href="{p}#games">All games →</a></section>'''
h+=foot(p)+end()
open('marquee/index.html','w').write(h)
# ---------- privacy page

exec(open('cc_page.py').read())
os.makedirs('privacy',exist_ok=True)
p='../'
def sec(t,b): return f'<h2 class="d" style="font-size:34px;margin:34px 0 10px">{t}</h2><p style="font-size:17px;line-height:1.65;margin:0;font-weight:500">{b}</p>'
h=head('Privacy · fantasyapp.io','What fantasyapp.io collects and why.',p)
h+=nav(p)
h+=f'''<section class="panel" style="background:var(--card);color:var(--ink);padding:56px clamp(24px,5vw,64px)"><div class="eb" style="color:var(--mute)"><a class="o" href="{p}">Home</a> / Privacy</div>
<h1 class="d" style="font-size:clamp(56px,9vw,110px);margin:18px 0 6px">Privacy<span class="o">.</span></h1><p style="margin:0;color:var(--mute);font-weight:700">Last updated November 7, 2026</p>
<div style="max-width:720px">'''
h+=sec('The short version','fantasyapp.io is a small site made by one person. The only thing we ask you for is your email address, and only if you want to hear when a new game launches. We show no ads and do not sell or share your email.')
h+=sec('What we collect','If you sign up, we store your email address and the time you signed up. That is all. Playing the demos and games needs no account, and nothing you do in them is saved to our servers.')
h+=sec('Why we collect it','To send you a short email when a new game launches, about once a week. We use it for nothing else.')
h+=sec('Where it is stored','In a Firebase (Google Cloud Firestore) database that only the site owner can read. Our website hosting is Cloudflare, which, like any host, sees your IP address and basic request details when you visit.')
h+=sec('Third parties','Some pages load fonts or images from other services, such as Google Fonts and ESPN team logos. Those services can see your IP address when your browser fetches them, as with any website. We use Cloudflare Web Analytics for simple, cookieless traffic counts (pages viewed, country, device). It does not track you across sites or build profiles. We run no advertising trackers.')
h+=sec('Email','If you sign up for updates, your email address is stored with Google Firebase and Buttondown, the service we use to send the newsletter. Every email has an unsubscribe link, and we only use your address to tell you about new games.')
h+=sec('Leaving the list','Ask to be removed and we will delete your email. Use the contact address below.')
h+=sec('Contact','Questions or removal requests: <a class="o" href="mailto:hello@fantasyapp.io">hello@fantasyapp.io</a>')
h+=sec('Changes','If this page changes in a meaningful way, we will update the date above.')
h+='</div></section>'+foot(p)+end()
open('privacy/index.html','w').write(h)
# ---------- demo page
p='../../'
def chap(t,n,d,bg,fg):
    cs=' style="background:var(--ink);color:var(--cream)"' if bg=='var(--orange)' else ''
    return f'<div class="chap" style="background:{bg};color:{fg}"><div class="top"><span class="d t1">{t}</span><span class="cir"{cs} aria-hidden="true">▶</span></div><div><div class="d t2">{n}</div><p>{d}</p></div></div>'
def prow(l,r,bg=''): return f'<div style="display:flex;justify-content:space-between;padding:10px 14px;{bg}"><span>{l}</span><span>{r}</span></div>'
h=head('Try the Fantasy CFB demo · fantasyapp.io','Play a Fantasy CFB league with made-up teams, or watch the 20-second tour. No sign-in.',p)
h+=nav(p)
h+=f'''<section class="panel" style="padding:48px 56px;display:flex;flex-wrap:wrap;gap:36px;align-items:center;justify-content:space-between"><div class="strip topo" style="width:90px" aria-hidden="true"></div>
<div style="flex:1 1 340px;min-width:0;position:relative;z-index:2"><div class="eb o">Fantasy CFB · Demo league</div><h1 class="d" style="font-size:clamp(70px,9.4vw,120px);margin-top:14px">Try it<br><span class="o">now.</span></h1>
<p style="margin:22px 0 0;max-width:380px;font-size:17px;line-height:1.6;color:var(--mute);font-weight:500">Play a league with made-up teams, or watch the 20-second tour. No sign-in, nothing saves.</p></div>
<div style="flex:1 1 480px;min-width:0;position:relative;z-index:2;display:flex;flex-direction:column;gap:12px">
<div class="tabs" id="dt"><button class="on" data-p="play" style="color:var(--cream)">▶ Play</button><button data-p="watch" style="color:var(--cream)">Watch</button></div>
<div id="play"><div class="frame" style="transform:rotate(1.5deg)"><div class="bar"><i></i><i style="opacity:.5"></i><i style="opacity:.25"></i><span class="url">fantasyapp.io/cfb/demo</span></div><iframe title="Fantasy CFB demo league" src="play/" style="width:100%;height:640px;border:0;display:block;background:#fff"></iframe></div><p style="margin:14px 4px 0;font-size:13px;color:var(--mute)">Try the Matchup tab, move a lineup, or flip to Draft mode in the yellow bar. <a class="o" href="play/" target="_blank" rel="noopener" style="font-weight:800">Open full screen ↗</a></p></div>
<div id="watch" class="frame" hidden style="display:none;background:#ff6a13;overflow:hidden"><video id="tour" controls playsinline preload="metadata" poster="tour-poster.jpg" style="width:100%;display:block;aspect-ratio:16/10" aria-label="20-second tour of the Fantasy CFB demo"><source src="tour.mp4" type="video/mp4"><source src="tour.webm" type="video/webm"></video></div>
</div></section>
<div class="sec-h"><h2 class="d">The 20-second<br>tour<span class="o">.</span></h2><p>Same demo, recorded. Pick a chapter to jump to it.</p></div>
<section class="chaps">{chap('0:00','Draft a player','The ticker lights up as each pick lands.','var(--orange)','var(--ink)')}{chap('0:06','Set your lineup',"Slots lock when that player's game starts.",'var(--ink)','var(--cream)')}{chap('0:11','Watch the matchup','Scores move as games finish.','var(--yellow)','var(--ink)')}{chap('0:16','Check the tracker','See your chance of winning change.','var(--dark2)','var(--cream)')}</section>
<section class="cta-band topo"><div class="d">Like it? Run your own.</div><div style="display:flex;gap:10px;align-items:center"><a class="btn ink" href="{p}cfb/start/">Start your own league</a><span class="cir" style="background:var(--ink);color:var(--cream)" aria-hidden="true">↗</span></div></section>'''
h+=foot(p)+'''<script>
(function(){if(location.hash==='#watch')setTimeout(function(){document.querySelector('#dt [data-p=watch]').click()});var t=document.querySelectorAll('#dt button'),pl=document.getElementById('play'),w=document.getElementById('watch');
t.forEach(function(b){b.addEventListener('click',function(){t.forEach(function(x){x.classList.toggle('on',x===b)});var wt=b.dataset.p==='watch';pl.style.display=wt?'none':'';w.style.display=wt?'flex':'none';w.hidden=!wt;if(!wt)document.getElementById('tour').pause()})});
document.querySelectorAll('.chap').forEach(function(c){c.style.cursor='pointer';c.addEventListener('click',function(){var m=c.querySelector('.t1').textContent.split(':'),v=document.getElementById('tour');document.querySelector('#dt [data-p=watch]').click();v.currentTime=(+m[0])*60+(+m[1]);v.play();window.scrollTo({top:0,behavior:'smooth'})})});})();
</script>'''+end()
open('cfb/demo/index.html','w').write(h)
