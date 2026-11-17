// Tandem Read: offline support. Network first for the page, cache fallback.
const C = 'tandem-v1';
const CORE = ['/tandem/', '/tandem/manifest.webmanifest', '/tandem/icon-192.png?v=1', '/tandem/icon-180.png?v=1'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== C) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  const mine = u.pathname.startsWith('/tandem/'), font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!mine && !font) return;
  e.respondWith((async () => {
    const cache = await caches.open(C);
    if (font) { const hit = await cache.match(req); if (hit) return hit; }
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return (await cache.match(req)) || (await cache.match('/tandem/'));
    }
  })());
});
