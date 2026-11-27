# Drop Four landing page. exec'd from build.py, so head/nav/foot/feat/end are in scope.
# The game itself lives in drop-four/play/index.html, copied from the Drop Four build.
import os
os.makedirs('drop-four',exist_ok=True)
p='../'
# a small board for the hero: X red, O yellow, the diagonal X wins
B=['.......','.......','...X...','..XO...','.XOO...','XOOXX..']
cells=''.join(f'<i class="{ {"X":"r","O":"y"}.get(ch,"") }"></i>' for row in B for ch in row)
WORLDS=[('Classic','#1f4fd8','#f0352b','#ffc61a','No twist. Just the board you grew up with.'),
 ('Deep Space','#131c44','#35c8ff','#ff4fd8','Black holes swallow the first disc dropped through them.'),
 ('Arcade','#3b1fa8','#ffd400','#ff3b8d','Fill the bottom row and it clears, Tetris style.'),
 ('Haunted','#2a2036','#ff8a1f','#dff7ea','Discs fade from sight a few turns after they land.'),
 ('Gridiron','#7a431f','#c8102e','#f2f4f8','Lines score touchdowns. First to three wins.'),
 ('Tabletop','#a56d38','#2a2c30','#ecebe6','Walnut and stone. No twist.')]
wl=''.join(f'<div class="dw" style="--b:{b};--p1:{a};--p2:{c}"><div class="dwb"><i class="a"></i><i class="b"></i><i class="a"></i><i class="b"></i></div><div class="d">{n}</div><p>{d}</p></div>' for n,b,a,c,d in WORLDS)
RULES=[('Classic','Line up four, across, down or diagonally.'),('Pop Out','Drop a disc, or pop one of yours out of the bottom row.'),
 ('Gravity Flip','Every sixth move the board turns upside down and everything falls.'),('Roadblocks','Five neutral stones start on the board.'),
 ('Five Alive','A bigger 9 by 7 board where you need five in a row.'),('Mayhem','Every fourth move the board deals a surprise: a quake, a meteor, a turncoat disc.')]
rl=''.join(f'<div class="row" style="align-items:flex-start"><span class="n">{i+1:02d}</span><span class="tx"><b style="display:block">{n}</b><span style="font-weight:500;font-size:16px;line-height:1.6;color:#4a4a47;display:block;margin-top:4px">{d}</span></span></div>' for i,(n,d) in enumerate(RULES))
SHOTS=[('lobby','var(--orange)','Pick your setup','Players, world, rules and match length, all on one screen.'),
 ('draft','var(--yellow)','Draft your powers','Bomb, Anvil, Freeze, Wild and more. Three each, taken in turns.'),
 ('classic','var(--orange)','Classic','The board you know, with powers in your hand.'),
 ('space','var(--yellow)','Deep Space','Planets for discs and black holes on the board.'),
 ('arcade','var(--orange)','Arcade','Pixel tiles, chiptune drops, rows that clear.'),
 ('haunt','var(--yellow)','Haunted','Pumpkins against ghosts, and discs that vanish.'),
 ('grid','var(--orange)','Gridiron','Helmets on the field. Score three touchdowns.'),
 ('wood','var(--yellow)','Tabletop','Slate and shell stones on a walnut board.')]
sh=''.join(f'<figure class="shot" style="background:{bg}"><img src="img/{f}.jpg" width="390" height="800" loading="lazy" alt="Drop Four: {t}"><figcaption><b class="d">{t}</b><span>{d}</span></figcaption></figure>' for f,bg,t,d in SHOTS)

h=head('Drop Four · fantasyapp.io','Four in a row with power discs, six worlds and a CPU ladder. Pass and play with a friend or go solo. Free in your browser.',p)
h+=nav(p)
h+=f'''<section class="panel hero" style="min-height:560px;padding-bottom:56px"><div class="strip topo" style="width:200px" aria-hidden="true"></div>
<div class="eb" style="color:var(--mute)"><a class="o" href="{p}">All games</a> / Board games / Drop Four</div>
<h1 class="d" style="font-size:clamp(70px,14.5vw,190px);margin-top:22px">Drop<br><span class="o">Four.</span></h1>
<p style="margin:26px 0 0;max-width:440px;font-size:18px;line-height:1.6;color:var(--mute);font-weight:500;position:relative;z-index:1">Four in a row, with a few new tricks. Draft power discs, pick a world with its own twist, and line up four before your friend does. Free in your browser, one device, no account.</p>
<div style="margin-top:30px;position:relative;z-index:3;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><a class="btn" href="play/">▶ Play now</a><span class="cir" style="background:var(--cream)" aria-hidden="true">↗</span></div>
<div class="hide-s dfb" aria-hidden="true"><div class="dfg">{cells}</div><span class="dfl"></span><span class="dfl"></span></div>
<span class="sticker hide-s" style="position:absolute;right:100px;top:420px;z-index:4">2 PLAYERS OR SOLO</span></section>
<div class="sec-h"><h2 class="d">Same board.<br>New tricks<span class="o">.</span></h2><p>Everything you know about four in a row still works. Then the powers come out.</p></div>
<section class="bench">{feat('01','Power discs','Before each game you draft three powers each. A bomb that clears a hole, an anvil that flattens a column, a wild that counts for both of you.','var(--orange)','var(--ink)')}{feat('02','Six worlds','Each world has its own discs, board, sound and an optional rule twist. Or design your own.','var(--ink)','var(--cream)','margin-top:34px;')}{feat('03','A CPU to beat','Five opponents, from Dot to Quad, each with their own style and something to say. Beat them to unlock worlds.','var(--yellow)','var(--ink)')}</section>
<div class="sec-h"><h2 class="d">Pick a<br>world<span class="o">.</span></h2><p>The look is only half of it. Turn on a world's twist and the rules change too.</p></div>
<section class="dws">{wl}</section>
<div class="sec-h"><h2 class="d">Six ways<br>to play<span class="o">.</span></h2><p>Mix any rules with any world. In a best of three or five, the loser picks the next rules.</p></div>
<section style="padding:0 14px"><div class="rows">{rl}</div></section>
<div class="sec-h"><h2 class="d">Look under<br>the hood<span class="o">.</span></h2><p>Real screens from the game. Swipe through.</p></div>
<section class="shots">{sh}</section>
<section class="panel" style="margin-top:36px;background:var(--ink);color:var(--cream);padding:44px 56px"><div class="eb o">No one to play?</div><h2 class="d" style="font-size:clamp(40px,5.5vw,72px);margin:10px 0 14px">A puzzle a day.<br>Or two minutes of rush<span class="o">.</span></h2>
<p style="max-width:620px;font-size:17px;line-height:1.65;font-weight:500;margin:0 0 22px">The daily puzzle gives everyone the same board: find the move that forces a win. Keep your streak going and copy your result to send a friend. Puzzle rush gives you two minutes and three lives to solve as many as you can. Badges, stats and your rivalry record stay on your device.</p>
<a class="btn" href="play/">▶ Play now</a></section>
<div class="sec-h" style="padding-bottom:0"><h2 class="d" style="font-size:clamp(48px,6vw,72px)">Other projects</h2></div>
<section class="more"><a class="d topo-k" style="color:var(--cream)" href="{p}marquee/">Marquee Grid</a><a class="d" style="background:var(--orange)" href="{p}cfb/">Fantasy CFB</a><a class="d" style="background:var(--card);border:2px solid var(--ink)" href="{p}#games">All games →</a></section>'''
h+=foot(p)
h+='''<style>
.dfb{position:absolute;right:110px;top:76px;width:330px;z-index:2;transform:rotate(5deg);background:#1f4fd8;border-radius:24px;padding:14px;box-shadow:0 12px 0 #163aa6,0 30px 50px rgba(0,0,0,.45)}
.dfg{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.dfg i{aspect-ratio:1;border-radius:50%;background:#e3eaff;box-shadow:inset 0 3px 4px rgba(0,0,0,.35)}
.dfg i.r{background:radial-gradient(circle at 36% 30%,#ff9a8f,#f0352b 55%,#951c15);box-shadow:none}
.dfg i.y{background:radial-gradient(circle at 36% 30%,#ffe9a1,#ffc61a 55%,#a07500);box-shadow:none}
.dfl{position:absolute;bottom:-26px;left:9%;width:15%;height:16px;background:#163aa6;border-radius:0 0 10px 10px;z-index:-1}
.dfl+.dfl{left:auto;right:9%}
.dws{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:0 14px}
.dw{border-radius:28px;padding:22px;background:var(--b);color:#fff;display:flex;flex-direction:column;gap:10px;min-height:220px}
.dw .d{font-size:38px}
.dw p{margin:0;font-size:15px;line-height:1.5;font-weight:600;opacity:.9}
.dwb{display:flex;gap:8px;margin-bottom:auto}
.dwb i{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 36% 30%,color-mix(in srgb,var(--p1) 55%,#fff),var(--p1) 58%,color-mix(in srgb,var(--p1) 62%,#000));box-shadow:0 3px 0 rgba(0,0,0,.3)}
.dwb i.b{background:radial-gradient(circle at 36% 30%,color-mix(in srgb,var(--p2) 55%,#fff),var(--p2) 58%,color-mix(in srgb,var(--p2) 62%,#000))}
@media(max-width:900px){.dws{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.dws{grid-template-columns:1fr}.dw{min-height:0}}
</style>'''+end()
open('drop-four/index.html','w').write(h)
