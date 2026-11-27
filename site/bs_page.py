# Broadside landing page. exec'd from build.py, so head/nav/foot/feat/end are in scope.
# The game itself lives in broadside/play/index.html, built by bssrc/make_play.py.
import os
os.makedirs('broadside',exist_ok=True)
p='../'
# hero board: . sea, s ship, h hit, x sunk, m miss
B=['..........','.m....m...','..sss.....','......h...','.m....h..m','..m...h...','xxxx......','.....m..m.','..m.......','.......ss.']
cells=''.join(f'<i class="{ {"s":"s","h":"h","x":"x","m":"m"}.get(ch,"") }"></i>' for row in B for ch in row)
WORLDS=[('Fleet Command','#0b2340','#1b5c8e','#ffc93c','Steel hulls, big guns, the classic look.'),
 ('Deep Space','#05060f','#141a3d','#7cf3ff','Motherships and stealth pods among the stars.'),
 ('Pirate Cove','#3a2412','#2f8088','#f2c14e','Galleons and sloops on a turquoise sea.'),
 ('Arcade','#0a0014','#1a0638','#39ff14','Neon grids and pixel ships. Insert coin.')]
wl=''.join(f'<div class="bw" style="--b:{b};--s:{s};--a:{a}"><div class="bwg">{"".join("<i></i>" for _ in range(10))}</div><div class="d">{n}</div><p>{d}</p></div>' for n,b,s,a,d in WORLDS)
RULES=[('Classic','One shot a turn. Sink the whole fleet.'),('Salvo','One shot for every ship you still have afloat. Lose ships, lose firepower.'),
 ('Hot Streak','Every hit earns another shot.'),('Drift','Every three rounds, untouched ships slide a square. Old misses go stale.'),
 ('Fog of War','Your miss markers fade after three turns. Remember where you shot.'),('Minefield','Four hidden mines in each sea. Hit one and it blasts your own fleet.'),
 ('Big Sea','A 14 by 14 ocean and seven ships per side.'),('Mayhem','Every three rounds an event hits both fleets: meteor storms, spy planes, riptides, supply drops.')]
rl=''.join(f'<div class="row" style="align-items:flex-start"><span class="n">{i+1:02d}</span><span class="tx"><b style="display:block">{n}</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a4a47;display:block;margin-top:4px">{d}</span></span></div>' for i,(n,d) in enumerate(RULES))
SHOTS=[('lobby','var(--orange)','Pick your setup','Opponent, world, rules and weapons on one screen.'),
 ('place','var(--yellow)','Hide your fleet','Tap to place, rotate, or shuffle.'),
 ('battle','var(--orange)','Fire away','Bursts, splashes and sunk ships.'),
 ('space','var(--yellow)','Deep Space','Same war, among the stars.'),
 ('pirate','var(--orange)','Pirate Cove','Cannons and plunder.'),
 ('arcade','var(--yellow)','Arcade','Neon grids, pixel ships.')]
sh=''.join(f'<figure class="shot" style="background:{bg}"><img src="img/{f}.jpg" width="390" height="800" loading="lazy" alt="Broadside: {t}"><figcaption><b class="d">{t}</b><span>{d}</span></figcaption></figure>' for f,bg,t,d in SHOTS)

h=head('Broadside · fantasyapp.io','Battleship with eight twist modes, special weapons, four worlds and three CPU captains. Pass and play or go solo. Free in your browser.',p)
h+=nav(p)
h+=f'''<section class="panel hero" style="min-height:560px;padding-bottom:56px"><div class="strip topo" style="width:200px" aria-hidden="true"></div>
<div class="eb" style="color:var(--mute)"><a class="o" href="{p}">All games</a> / Board games / Broadside</div>
<h1 class="d" style="font-size:clamp(64px,13vw,170px);margin-top:22px">Broad<br><span class="o">side.</span></h1>
<p style="margin:26px 0 0;max-width:440px;font-size:18px;line-height:1.6;color:var(--mute);font-weight:500;position:relative;z-index:1">The fleet battle you grew up with, plus eight ways to break it. Drifting ships, hidden mines, sonar and airstrikes. Free in your browser, one device, no account.</p>
<div style="margin-top:30px;position:relative;z-index:3;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><a class="btn" href="play/">▶ Play now</a><span class="cir" style="background:var(--cream)" aria-hidden="true">↗</span></div>
<div class="hide-s bsb" aria-hidden="true"><div class="bsg">{cells}</div></div>
<span class="sticker hide-s" style="position:absolute;right:100px;top:440px;z-index:4">2 PLAYERS OR SOLO</span></section>
<div class="sec-h"><h2 class="d">Same fleet.<br>New tricks<span class="o">.</span></h2><p>Call your shots like always. Then the specials come out.</p></div>
<section class="bench">{feat('01','Special weapons','Sonar counts the ship squares in a 3 by 3. Airstrikes hit three in a line, clusters hit a plus, and torpedoes run a row until they find something.','var(--orange)','var(--ink)')}{feat('02','Four worlds','Navy, deep space, pirates and arcade, each with its own ships, colors and lettering.','var(--ink)','var(--cream)','margin-top:34px;')}{feat('03','Three captains','Ensign Pip guesses. Captain Reyes hunts. Admiral Kraken plays the odds. Your record against each stays on your device.','var(--yellow)','var(--ink)')}</section>
<div class="sec-h"><h2 class="d">Eight ways<br>to play<span class="o">.</span></h2><p>Mix any rules with any world, with or without special weapons.</p></div>
<section style="padding:0 14px"><div class="rows">{rl}</div></section>
<div class="sec-h"><h2 class="d">Pick a<br>world<span class="o">.</span></h2><p>Every world names its own fleet, from the Carrier to the Dinghy.</p></div>
<section class="bws">{wl}</section>
<div class="sec-h"><h2 class="d">Look under<br>the hood<span class="o">.</span></h2><p>Real screens from the game. Swipe through.</p></div>
<section class="shots">{sh}</section>
<section class="panel" style="margin-top:36px;background:var(--ink);color:var(--cream);padding:44px 56px"><div class="eb o">Pass and play</div><h2 class="d" style="font-size:clamp(40px,5.5vw,72px);margin:10px 0 14px">One phone.<br>No peeking<span class="o">.</span></h2>
<p style="max-width:620px;font-size:17px;line-height:1.65;font-weight:500;margin:0 0 22px">Hand the device across the couch. A cover screen hides each fleet between turns, and Mayhem events show up on the handoff card so both captains see what just hit them.</p>
<a class="btn" href="play/">▶ Play now</a></section>
<div class="sec-h" style="padding-bottom:0"><h2 class="d" style="font-size:clamp(48px,6vw,72px)">Other projects</h2></div>
<section class="more"><a class="d" style="background:#1f4fd8;color:#fff" href="{p}drop-four/">Drop Four</a><a class="d topo-k" style="color:var(--cream)" href="{p}marquee/">Marquee Grid</a><a class="d" style="background:var(--card);border:2px solid var(--ink)" href="{p}#games">All games →</a></section>'''
h+=foot(p)
h+='''<style>
.bsb{position:absolute;right:110px;top:70px;width:340px;z-index:2;transform:rotate(5deg);background:#0d3354;border-radius:22px;padding:12px;box-shadow:0 12px 0 #082238,0 30px 50px rgba(0,0,0,.45)}
.bsg{display:grid;grid-template-columns:repeat(10,1fr);gap:3px}
.bsg i{aspect-ratio:1;border-radius:4px;background:#1b5c8e;position:relative}
.bsg i:nth-child(odd){background:#17507d}
.bsg i.s{background:#8796a8!important}
.bsg i.h{background:#7a3a3a!important}
.bsg i.h::after{content:"";position:absolute;inset:10%;border-radius:50%;background:radial-gradient(circle,#fff 0 14%,#ff4d3d 40%,transparent 72%)}
.bsg i.x{background:#5c1a14!important}
.bsg i.m::after{content:"";position:absolute;inset:34%;border-radius:50%;background:#d6ecff}
.bws{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;padding:0 14px}
.bw{border-radius:28px;padding:22px;background:var(--b);color:#fff;display:flex;flex-direction:column;gap:10px;min-height:220px}
.bw .d{font-size:34px;color:var(--a)}
.bw p{margin:0;font-size:15px;line-height:1.5;font-weight:600;opacity:.9}
.bwg{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:auto;max-width:150px}
.bwg i{aspect-ratio:1;border-radius:3px;background:var(--s)}
.bwg i:nth-child(2),.bwg i:nth-child(3),.bwg i:nth-child(4){background:var(--a);opacity:.8}
@media(max-width:900px){.bws{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.bws{grid-template-columns:1fr}.bw{min-height:0}}
</style>'''+end()
open('broadside/index.html','w').write(h)
