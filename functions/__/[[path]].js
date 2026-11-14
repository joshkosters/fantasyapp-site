// Proxies Firebase Auth's helper pages (/__/auth/*, /__/firebase/*) for the budget app,
// so Google sign-in runs on fantasyapp.io itself. Browsers block sign-in that hops to
// another site and back (third-party storage), which made the sign-in loop.
const UPSTREAM = 'https://our-budget-josh.firebaseapp.com';

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  headers.delete('host');
  const res = await fetch(UPSTREAM + url.pathname + url.search, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'manual',
  });
  return new Response(res.body, res);
}
