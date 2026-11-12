"""Builds the no-sign-in demo of Fantasy NASCAR from fantasy-nascar/index.html.
Swaps the three Firebase script tags for an in-memory fake + made-up seed data.
Run from the repo root:  python3 nascarsrc/make_demo.py
Writes site/nascar/demo/play/index.html"""
import os, re

src = open('fantasy-nascar/index.html', encoding='utf8').read()

SHIM = r"""<script>
// ===== DEMO MODE: in-memory fake of Firebase + made-up data. Nothing is saved or sent anywhere. =====
(function () {
  const ME = 'jordan@demo.test', H = 3600e3, store = {}, listeners = [];
  const clone = o => JSON.parse(JSON.stringify(o)), colOf = p => p.split('/')[0];
  const snapCol = c => { const docs = Object.keys(store).filter(p => colOf(p) === c).map(p => ({ id: p.split('/').slice(1).join('/'), data: () => clone(store[p]) })); return { forEach: f => docs.forEach(f) }; };
  const snapDoc = p => ({ exists: p in store, id: p, data: () => (p in store ? clone(store[p]) : undefined) });
  const notify = p => listeners.forEach(l => { if (l.kind === 'col' && l.path === colOf(p)) l.cb(snapCol(l.path)); if (l.kind === 'doc' && l.path === p) l.cb(snapDoc(p)); });
  const write = (p, d, o) => { store[p] = (o && (o.merge || o.mergeFields)) ? Object.assign(store[p] || {}, clone(d)) : clone(d); };
  const docRef = p => ({ path: p, set: async (d, o) => { write(p, d, o); notify(p); }, onSnapshot: cb => { listeners.push({ kind: 'doc', path: p, cb }); setTimeout(() => cb(snapDoc(p)), 0); } });
  const db = {
    doc: docRef,
    collection: c => ({ onSnapshot: cb => { listeners.push({ kind: 'col', path: c, cb }); setTimeout(() => cb(snapCol(c)), 0); } }),
    batch: () => { const ops = []; return { set: (r, d, o) => ops.push([r.path, d, o]), commit: async () => { ops.forEach(([p, d, o]) => { write(p, d, o); notify(p); }); } }; },
    runTransaction: async fn => { const ops = []; await fn({ get: async r => snapDoc(r.path), set: (r, d) => ops.push([r.path, d]) }); ops.forEach(([p, d]) => { write(p, d); notify(p); }); }
  };
  const auth = { onAuthStateChanged: cb => setTimeout(() => cb({ email: ME }), 0), signInWithPopup: async () => {} };
  window.firebase = { initializeApp() {}, firestore: () => db, auth: Object.assign(() => auth, { GoogleAuthProvider: function () {} }) };

  // ---------- made-up league ----------
  let seed = 7; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const P = { 'maya@demo.test': 'Maya', 'dre@demo.test': 'Dre', [ME]: 'Jordan', 'priya@demo.test': 'Priya' };
  Object.entries(P).forEach(([e, name]) => store['members/' + e] = { name });
  const NAMES = ['Cole Ransom', 'Tyler Voss', 'Mason Pike', 'Jace Holloway', 'Rex Calder', 'Wade Brennan', 'Colt Maddox', 'Nash Delaney', 'Reid Sutter', 'Beau Garrison', 'Clay Whitlock', 'Dane Foster',
    'Heath Merrick', 'Troy Ellison', 'Grant Pruitt', 'Luke Danner', 'Kyle Brandt', 'Owen Tackett', 'Shane Redding', 'Cade Winslow', 'Brock Hadley', 'Levi Carrow', 'Zane Mercer', 'Eli Thornton',
    'Pat Lindqvist', 'Hank Rowley', 'Ray Kessler', 'Dale Penrose', 'Gus Halvorsen', 'Moe Tillman', 'Ned Calloway', 'Walt Sterling', 'Abe Fontaine', 'Vic Navarro', 'Roy Ketchum', 'Sam Okafor'];
  const NUMS = [4, 7, 9, 11, 12, 15, 17, 19, 20, 21, 22, 23, 24, 34, 38, 41, 42, 43, 45, 47, 48, 51, 54, 60, 6, 8, 10, 14, 16, 31, 35, 50, 66, 71, 77, 88];
  const CLR = ['#e5484d', '#3e9bff', '#ffcc00', '#46c37b', '#b07cff', '#ff8a3d', '#2dd4bf', '#f472b6', '#94a3b8', '#84cc16', '#fb7185', '#60a5fa'];
  const drivers = NAMES.map((name, i) => ({ id: String(NUMS[i]), num: String(NUMS[i]), name, team: 'Demo Racing', color: CLR[(i * 5) % CLR.length],
    seasonPts: i < 12 ? 600 - i * 18 : i < 24 ? 380 - (i - 12) * 9 : 250 - (i - 24) * 8, wins: i < 4 ? 4 - i : 0 }));
  drivers.forEach(d => store['drivers/' + d.id] = d);
  const tiers = {}; drivers.forEach((d, i) => tiers[d.id] = i < 12 ? 'A' : i < 24 ? 'B' : 'C');

  function draftSim(seq, upto) {
    const picks = [], taken = new Set(), had = {};
    seq.slice(0, upto).forEach((e, k) => {
      const need = ['A', 'B', 'C'].filter(t => !(had[e] || []).includes(t)), t = need[Math.floor(rnd() * need.length)];
      const pool = drivers.filter(d => tiers[d.id] === t && !taken.has(d.id)), d = pool[Math.floor(rnd() * rnd() * pool.length)];
      taken.add(d.id); (had[e] = had[e] || []).push(t); picks.push({ email: e, driverId: d.id, auto: false, at: Date.now() - (upto - k) * H });
    });
    return picks;
  }
  const first = { 1: ['dre@demo.test', ME, 'maya@demo.test', 'priya@demo.test'], 2: ['priya@demo.test', 'maya@demo.test', ME, 'dre@demo.test'],
    3: ['maya@demo.test', 'dre@demo.test', 'priya@demo.test', ME], 4: ['dre@demo.test', 'priya@demo.test', ME, 'maya@demo.test'] };
  const races = { 1: 'Lakeside 400', 2: 'Riverbend 300', 3: 'Summit 500', 4: 'Harbor City 400' };
  const seqOf = n => { const f = first[n]; return [...f, ...f.slice().reverse(), ...f]; };
  [1, 2, 3].forEach(n => {
    const seq = seqOf(n), picks = draftSim(seq, 12);
    const order = drivers.slice().sort((a, b) => (b.seasonPts / 12 + rnd() * 30) - (a.seasonPts / 12 + rnd() * 30)).map(d => d.id);
    const pts = {}; order.forEach((id, i) => pts[id] = i === 0 ? 40 : Math.max(1, 37 - (i + 1)));
    const qual = drivers.slice().sort((a, b) => (b.seasonPts / 15 + rnd() * 25) - (a.seasonPts / 15 + rnd() * 25)).slice(0, 12).map(d => d.id);
    const led = {}; [order[0], order[1], order[Math.floor(rnd() * 6) + 2]].forEach((id, i) => led[id] = [120, 62, 18][i]);
    store['weeks/w' + n] = { n, race: races[n], status: 'scored', lockAt: Date.now() - (5 - n) * 24 * H, tiers, seq, picks, deadline: Date.now(), openedAt: Date.now() - 6 * 24 * H };
    store['scores/w' + n] = { pts, order, qual, led, t: Date.now() };
  });
  const seq4 = seqOf(4);
  store['weeks/w4'] = { n: 4, race: races[4], status: 'open', lockAt: Date.now() + 3 * 24 * H, tiers, seq: seq4, picks: draftSim(seq4, 2), deadline: Date.now() + 9 * H + 25 * 60000, openedAt: Date.now() - 3 * H };
  store['config/league'] = { currentWeek: 4 };
})();
</script>"""

BANNER = '<div style="background:#ffcc00;color:#111;text-align:center;font-size:12px;font-weight:700;padding:5px 8px">DEMO · made-up players and drivers · nothing is saved</div>'

out = re.sub(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*', '', src)
out = out.replace('<script>\n// ====== PASTE', SHIM + '\n<script>\n// ====== PASTE', 1)
out = out.replace('const COMMISH = "you@example.com";', 'const COMMISH = "jordan@demo.test";')
out = out.replace('<title>Fantasy NASCAR</title>', '<title>Fantasy NASCAR (demo)</title>')
out = out.replace('<body>\n', '<body>\n' + BANNER + '\n', 1)
# no real car badges next to made-up drivers: force the "#number" fallback
out = out.replace('https://cf.nascar.com/data/images/carbadges/1/', 'data:,')
assert 'firebasejs' not in out and 'DEMO MODE' in out and 'jordan@demo.test' in out
os.makedirs('site/nascar/demo/play', exist_ok=True)
open('site/nascar/demo/play/index.html', 'w', encoding='utf8').write(out)
print('wrote site/nascar/demo/play/index.html', len(out))
