// Optional AI facilitator. Reads only answers that BOTH partners shared,
// only after BOTH agreed to let the facilitator read them. Never private notes.
import { verify, getDoc, json, PEOPLE, partnerOf } from '../../lib/us_server.js';

const MODEL = 'claude-sonnet-5-5';
const SYSTEM = `You are a neutral, warm facilitator inside "Us", a private app for one couple. Both partners chose to share the answers below with each other and agreed to let you read them.

How to respond:
- Stay neutral. Never take sides, assign blame, decide who is right, or score anyone.
- You are not a therapist and must not diagnose, label personalities or give clinical advice.
- Use their names. Plain, kind, specific language. Under 250 words.
- Use these short sections with bold labels: **What each of you seems to need**, **Common ground**, **Where you see it differently**, **Questions to ask each other** (2 or 3, open and curious), **One small next step** (optional, easy to say no to).
- Reflect only what they wrote. Don't invent facts, and don't quote or attribute anything to the Gottmans or any author.
- If either answer mentions violence, threats, feeling unsafe or afraid of a partner, self-harm, or a crisis: do not facilitate. Instead say briefly and gently that this sounds important to handle with real support, suggest taking a pause, and list: emergency 911; National Domestic Violence Hotline 1-800-799-7233 (or text START to 88788); 988 Suicide & Crisis Lifeline (call or text 988). Nothing else.`;

export async function onRequestGet({ env }) { return json({ configured: !!env.ANTHROPIC_API_KEY }); }

export async function onRequestPost({ request, env }) {
  const who = await verify(request); if (!who) return json({ error: 'not_signed_in' }, 401);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503);
  let body; try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
  const sid = String(body.sid || ''), labels = body.labels || {}, title = String(body.title || '').slice(0, 120);
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(sid)) return json({ error: 'bad_request' }, 400);
  const me = who.email, them = partnerOf(me);
  let sess, mine, theirs;
  try {
    sess = await getDoc(who.token, 'us_sessions/' + sid);
    if (!sess) return json({ error: 'not_found' }, 404);
    const sb = sess.sharedBy || [], ok = sess.aiOk || {};
    if (!sb.includes(me) || !sb.includes(them)) return json({ error: 'not_both_shared' }, 403);
    if (!ok[me] || !ok[them]) return json({ error: 'not_both_agreed' }, 403);
    mine = ((await getDoc(who.token, `us_sessions/${sid}/answers/${me}`)) || {}).answers || {};
    theirs = ((await getDoc(who.token, `us_sessions/${sid}/answers/${them}`)) || {}).answers || {};
  } catch (e) { return json({ error: 'read_failed' }, 502); }
  const block = (name, A) => `## ${name}\n` + Object.keys(labels).filter(k => typeof A[k] === 'string' && A[k].trim()).map(k => `${String(labels[k]).slice(0, 160)}\n${A[k].slice(0, 2000)}`).join('\n\n');
  const text = `Topic: ${title || sess.topic || 'A conversation'}\n\n${block(PEOPLE[me], mine)}\n\n${block(PEOPLE[them], theirs)}`;
  if (text.length < 60) return json({ error: 'nothing_to_read' }, 400);
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: env.ANTHROPIC_MODEL || MODEL, max_tokens: 900, system: SYSTEM, messages: [{ role: 'user', content: text }] }),
  });
  if (!r.ok) return json({ error: 'ai_failed', status: r.status }, 502);
  const j = await r.json();
  const out = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
  return json({ text: out });
}
