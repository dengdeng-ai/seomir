var ALLOW = ['https://xn--2w2b19b12g.love', 'https://dengdeng-ai.github.io'];
var MODEL = 'claude-haiku-5-5';
var MAX_TOKENS = 700;
var MAX_MSGS = 40;
var MAX_CHARS = 14000;
var PER_MIN = 12;
var DAILY = 1500;
var authMode = null;
var hits = {}, day = { d: '', n: 0 };

function cors(o) {
  return {
    'access-control-allow-origin': o,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'vary': 'origin'
  };
}
function out(body, status, o) {
  return new Response(JSON.stringify(body), { status: status, headers: Object.assign({ 'content-type': 'application/json' }, cors(o)) });
}

export default {
  async fetch(req, env) {
    var o = req.headers.get('origin') || '';
    if (ALLOW.indexOf(o) < 0) return new Response('no', { status: 403 });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(o) });
    if (req.method !== 'POST') return out({ error: 'method' }, 405, o);

    var ip = req.headers.get('cf-connecting-ip') || 'x', now = Date.now(), today = new Date().toISOString().slice(0, 10);
    if (day.d !== today) day = { d: today, n: 0 };
    if (++day.n > DAILY) return out({ error: 'daily' }, 429, o);
    var h = (hits[ip] = (hits[ip] || []).filter(function (t) { return now - t < 60000 }));
    if (h.length >= PER_MIN) return out({ error: 'rate' }, 429, o);
    h.push(now);

    var b;
    try { b = await req.json() } catch (e) { return out({ error: 'json' }, 400, o) }
    var m = b && b.messages;
    if (!Array.isArray(m) || !m.length || m.length > MAX_MSGS) return out({ error: 'messages' }, 400, o);
    var size = 0;
    for (var i = 0; i < m.length; i++) {
      if (!m[i] || (m[i].role !== 'user' && m[i].role !== 'assistant') || typeof m[i].content !== 'string') return out({ error: 'messages' }, 400, o);
      size += m[i].content.length;
    }
    if (size > MAX_CHARS || m[m.length - 1].role !== 'user') return out({ error: 'size' }, 400, o);

    var body = JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages: m });
    function call(auth) {
      var hd = { 'content-type': 'application/json', 'anthropic-version': '2023-06-01' };
      if (auth) hd['authorization'] = 'Bearer ' + env.ANTHROPIC_API_KEY; else hd['x-api-key'] = env.ANTHROPIC_API_KEY;
      return fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: hd, body: body });
    }
    var r = await call(authMode === true);
    if (r.status === 401) { r = await call(authMode !== true); if (r.status !== 401) authMode = (authMode !== true); }
    if (!r.ok) return out({ error: 'upstream', status: r.status, detail: (await r.text()).slice(0, 300) }, 502, o);
    var j = await r.json();
    var t = (j.content || []).map(function (c) { return c.text || '' }).join('');
    if (j.stop_reason === 'max_tokens') {
      var e = Math.max(t.lastIndexOf('.'), t.lastIndexOf('?'), t.lastIndexOf('!'));
      if (e > t.indexOf('\n') + 10) t = t.slice(0, e + 1);
    }
    return out({ text: t, stop: j.stop_reason || '' }, 200, o);
  }
};
