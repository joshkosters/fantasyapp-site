// Us service worker: shows a generic notification. Pushes carry no content.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  e.waitUntil(self.registration.showNotification('Us', {
    body: 'Something new is waiting for you.',
    icon: '/us/icon-192.png?v=2', badge: '/us/icon-192.png?v=2', tag: 'us-new', renotify: true,
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = all.find(c => c.url.includes('/us/'));
    if (open) return open.focus();
    return self.clients.openWindow('/us/');
  })());
});
