// Gentle partner notifications. Sends an EMPTY web push (no content at all),
// so nothing about feelings or topics can ever reach a lock screen.
import { verify, getDoc, json, partnerOf, bytesToB64u } from '../../lib/us_server.js';

export async function onRequestGet({ env }) { return json({ publicKey: env.VAPID_PUBLIC || null }); }

async function vapidAuth(endpoint, env) {
  const jwk = JSON.parse(env.VAPID_PRIVATE_JWK);
  const key = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, d: jwk.d }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const enc = o => bytesToB64u(new TextEncoder().encode(JSON.stringify(o)));
  const unsigned = enc({ typ: 'JWT', alg: 'ES256' }) + '.' + enc({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:hello@mail.fantasyapp.io' });
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(unsigned));
  return `vapid t=${unsigned}.${bytesToB64u(sig)}, k=${env.VAPID_PUBLIC}`;
}

export async function onRequestPost({ request, env }) {
  const who = await verify(request); if (!who) return json({ error: 'not_signed_in' }, 401);
  if (!env.VAPID_PUBLIC || !env.VAPID_PRIVATE_JWK) return json({ error: 'not_configured' }, 503);
  let doc; try { doc = await getDoc(who.token, 'us_push/' + partnerOf(who.email)); } catch (e) { return json({ error: 'read_failed' }, 502); }
  const subs = (doc && doc.subs) || [];
  let sent = 0;
  for (const s of subs) {
    if (!s || !/^https:\/\//.test(s.endpoint || '')) continue;
    try {
      const r = await fetch(s.endpoint, { method: 'POST', headers: { TTL: '86400', Urgency: 'normal', Authorization: await vapidAuth(s.endpoint, env), 'Content-Length': '0' } });
      if (r.ok) sent++;
    } catch (e) {}
  }
  return json({ sent });
}
