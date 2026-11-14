// Shared helpers for the Us app's Cloudflare functions.
// Every request is checked against a Firebase ID token, and Firestore is read
// *as the signed-in person*, so the database's own privacy rules still apply.
export const PROJECT = 'our-budget-josh';
export const PEOPLE = { 'joshkosters@gmail.com': 'Josh', 'tlturner9@gmail.com': 'T' };
export const partnerOf = em => Object.keys(PEOPLE).find(e => e !== em);

const b64uToBytes = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
export const bytesToB64u = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

let jwks = null, jwksAt = 0;
async function getKey(kid) {
  if (!jwks || Date.now() - jwksAt > 3600e3) {
    const r = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
    jwks = (await r.json()).keys || []; jwksAt = Date.now();
  }
  const k = jwks.find(x => x.kid === kid);
  return k ? crypto.subtle.importKey('jwk', k, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']) : null;
}
// Returns { email, token } or null.
export async function verify(request) {
  const auth = request.headers.get('authorization') || '', token = auth.replace(/^Bearer\s+/i, '');
  const parts = token.split('.'); if (parts.length !== 3) return null;
  try {
    const head = JSON.parse(new TextDecoder().decode(b64uToBytes(parts[0])));
    const body = JSON.parse(new TextDecoder().decode(b64uToBytes(parts[1])));
    const key = await getKey(head.kid); if (!key || head.alg !== 'RS256') return null;
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64uToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    const now = Date.now() / 1000;
    if (!ok || body.aud !== PROJECT || body.iss !== 'https://securetoken.google.com/' + PROJECT || body.exp < now || !body.email_verified) return null;
    const email = (body.email || '').toLowerCase();
    return PEOPLE[email] ? { email, token } : null;
  } catch (e) { return null; }
}

// Firestore REST, read as the user (security rules apply).
const val = v => {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  return null;
};
const fields = f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, val(v)]));
export async function getDoc(token, path) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${path.split('/').map(encodeURIComponent).join('/')}`, { headers: { Authorization: 'Bearer ' + token } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('firestore ' + r.status);
  return fields((await r.json()).fields || {});
}
