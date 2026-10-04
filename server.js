'use strict';
/**
 * Vidit — VPlus Studio
 * שרת Node בלי תלויות: מקבל כתובת של דף HTML, מוריד אותו, ומחזיר את כתובות הווידאו שבו.
 *
 * GET /                      → ממשק המשתמש (index.html)
 * GET /api/scrape?url=...    → JSON עם הכתובות שנמצאו
 *      &depth=1              → חיפוש גם בתוך נגני iframe (עד 3)
 *      &all=1                → כולל גם קישורים שלא זוהו כווידאו
 * GET /health                → בדיקת חיים
 *
 * משתני סביבה: PORT, ACCESS_KEY (אופציונלי), CORS_ORIGIN (ברירת מחדל *), ALLOW_PRIVATE=1 (לבדיקות מקומיות בלבד)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const net = require('net');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const ACCESS_KEY = process.env.ACCESS_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const ALLOW_PRIVATE = process.env.ALLOW_PRIVATE === '1';

const MAX_BYTES = 3 * 1024 * 1024; // 3MB לדף
const TIMEOUT_MS = 12000;
const MAX_REDIRECTS = 5;
const MAX_IFRAMES = 3;
const RATE_LIMIT = 30; // בקשות
const RATE_WINDOW_MS = 10 * 60 * 1000; // ל-10 דקות לכל IP

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';

/* ------------------------------------------------------------------ */
/* הגנת SSRF: אסור לשרת להתחבר לכתובות פנימיות                        */
/* ------------------------------------------------------------------ */

function isPrivateIPv4(ip) {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIp(ip) {
  if (ALLOW_PRIVATE) return false;
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    if (l === '::' || l === '::1') return true;
    if (l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe8') || l.startsWith('fe9') || l.startsWith('fea') || l.startsWith('feb')) return true;
    const mapped = l.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIPv4(mapped[1]);
    return false;
  }
  return true;
}

// lookup מותאם: בודק את הכתובת שאליה באמת מתחברים (מונע DNS rebinding)
function safeLookup(hostname, options, callback) {
  const opts = typeof options === 'function' ? {} : options || {};
  const cb = typeof options === 'function' ? options : callback;
  dns.lookup(hostname, { all: true }, (err, addrs) => {
    if (err) return cb(err);
    const ok = addrs.filter((a) => !isPrivateIp(a.address));
    if (!ok.length) return cb(new Error('הכתובת מצביעה על רשת פנימית – חסום'));
    if (opts.all) return cb(null, ok);
    cb(null, ok[0].address, ok[0].family);
  });
}

/* ------------------------------------------------------------------ */
/* הורדת דף                                                           */
/* ------------------------------------------------------------------ */

function decodeBody(buf, contentType) {
  let charset = 'utf-8';
  const m = /charset=([\w-]+)/i.exec(contentType || '');
  if (m) charset = m[1].toLowerCase();
  else {
    const head = buf.subarray(0, 4096).toString('latin1');
    const mm = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head);
    if (mm) charset = mm[1].toLowerCase();
  }
  try {
    return new TextDecoder(charset).decode(buf);
  } catch (e) {
    return buf.toString('utf8');
  }
}

function fetchPage(urlStr, opts = {}, hops = 0) {
  return new Promise((resolve, reject) => {
    let u;
    try {
      u = new URL(urlStr);
    } catch (e) {
      return reject(new Error('כתובת לא תקינה'));
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return reject(new Error('נתמכות רק כתובות http/https'));
    if (!ALLOW_PRIVATE && u.port && u.port !== '80' && u.port !== '443') return reject(new Error('פורט לא מורשה'));
    if (net.isIP(u.hostname.replace(/^\[|\]$/g, '')) && isPrivateIp(u.hostname.replace(/^\[|\]$/g, ''))) {
      return reject(new Error('הכתובת מצביעה על רשת פנימית – חסום'));
    }

    const lib = u.protocol === 'https:' ? https : http;
    const headers = {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'he-IL,he;q=0.9,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
    };
    if (opts.referer) headers.Referer = opts.referer;

    const req = lib.request(u, { method: 'GET', headers, lookup: safeLookup, timeout: TIMEOUT_MS }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if (hops >= MAX_REDIRECTS) return reject(new Error('יותר מדי הפניות'));
        let next;
        try {
          next = new URL(res.headers.location, u).toString();
        } catch (e) {
          return reject(new Error('הפניה לא תקינה'));
        }
        return fetchPage(next, opts, hops + 1).then(resolve, reject);
      }

      let stream = res;
      const enc = String(res.headers['content-encoding'] || '').toLowerCase();
      if (enc === 'gzip') stream = res.pipe(zlib.createGunzip());
      else if (enc === 'deflate') stream = res.pipe(zlib.createInflate());
      else if (enc === 'br') stream = res.pipe(zlib.createBrotliDecompress());

      const chunks = [];
      let size = 0;
      let done = false;
      stream.on('data', (c) => {
        if (done) return;
        size += c.length;
        if (size > MAX_BYTES) {
          done = true;
          req.destroy();
          return reject(new Error('הדף גדול מדי'));
        }
        chunks.push(c);
      });
      stream.on('end', () => {
        if (done) return;
        done = true;
        const buf = Buffer.concat(chunks);
        resolve({
          finalUrl: u.toString(),
          status: res.statusCode,
          contentType: res.headers['content-type'] || '',
          body: decodeBody(buf, res.headers['content-type']),
          bytes: size,
        });
      });
      stream.on('error', (e) => {
        if (!done) {
          done = true;
          reject(e);
        }
      });
    });
    req.on('timeout', () => req.destroy(new Error('האתר לא הגיב בזמן')));
    req.on('error', reject);
    req.end();
  });
}

/* ------------------------------------------------------------------ */
/* חילוץ כתובות וידאו מתוך HTML                                       */
/* ------------------------------------------------------------------ */

const VIDEO_EXT = /\.(m3u8|mpd|mp4|webm|m4v|mov|mkv|ogv|f4m)(?=$|[?#])/i;
const STREAM_EXT = /\.(m3u8|mpd|f4m)(?=$|[?#])/i;
const NOT_VIDEO_EXT = /\.(jpe?g|png|gif|webp|svg|ico|css|js|mjs|json|woff2?|ttf|otf|eot|map|html?|xml|txt|avif|bmp)(?=$|[?#])/i;
const VIDEO_HOSTS = /(youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com|dailymotion\.com|jwplatform\.com|jwpcdn\.com|brightcove|wistia|streamable|twitch\.tv|facebook\.com\/plugins\/video|akamaihd\.net|akamaized\.net|mako-vod|kaltura|mediadelivery|vimeocdn|cloudflarestream|mux\.com)/i;
const VIDEO_PATH = /(\/embed\/|\/player|\/vod\/|\/video|\/hls\/|\/dash\/|manifest|playlist|\/stream)/i;

function normalize(t) {
  return t
    .replace(/\\u002f/gi, '/')
    .replace(/\\u0026/gi, '&')
    .replace(/\\u003d/gi, '=')
    .replace(/\\u003a/gi, ':')
    .replace(/\\u003f/gi, '?')
    .replace(/\\\//g, '/')
    .replace(/&amp;/gi, '&')
    .replace(/&#x2f;/gi, '/')
    .replace(/&#47;/g, '/')
    .replace(/&#x3a;/gi, ':')
    .replace(/&#58;/g, ':');
}

function cleanUrl(u) {
  return u.replace(/\\+$/g, '').replace(/[.,;:!?'")\]}>]+$/g, '');
}

function classify(url) {
  if (STREAM_EXT.test(url)) return 'stream';
  if (VIDEO_EXT.test(url)) return 'file';
  if (/\/embed\/|\/plugins\/video|player\./i.test(url) || /\/player/i.test(url)) return 'embed';
  if (VIDEO_HOSTS.test(url) || VIDEO_PATH.test(url)) return 'embed';
  return 'other';
}

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function walkJsonLd(node, cb) {
  if (Array.isArray(node)) return node.forEach((n) => walkJsonLd(n, cb));
  if (node && typeof node === 'object') {
    if (typeof node.contentUrl === 'string') cb(node.contentUrl, 'file');
    if (typeof node.embedUrl === 'string') cb(node.embedUrl, 'embed');
    Object.keys(node).forEach((k) => walkJsonLd(node[k], cb));
  }
}

function extractFromHtml(html, baseUrl) {
  const map = new Map();
  const text = normalize(html);

  const add = (raw, source, force) => {
    const u = cleanUrl(String(raw || '').trim());
    if (!u) return;
    let abs;
    try {
      abs = new URL(u.startsWith('//') ? 'https:' + u : u, baseUrl).href;
    } catch (e) {
      return;
    }
    if (!/^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+(?::\d+)?(?:[\/?#]|$)/i.test(abs)) return;
    if (map.has(abs)) return;
    let kind = force || classify(abs);
    if (!force && kind !== 'other' && NOT_VIDEO_EXT.test(abs) && !VIDEO_EXT.test(abs)) kind = 'other';
    // תגית <video>/<source> בלי סיומת ברורה – עדיין קובץ וידאו
    if (force === 'file' && NOT_VIDEO_EXT.test(abs) && !VIDEO_EXT.test(abs)) kind = 'other';
    map.set(abs, { url: abs, kind, source });
  };

  // 1. תגיות מובנות
  const tagRe = /<(iframe|video|source|embed|meta)\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(text))) {
    const tag = m[0];
    const name = m[1].toLowerCase();
    if (name === 'meta' && !/(og:video|twitter:player|["']video["'])/i.test(tag)) continue;
    const attrRe = /([\w:-]+)\s*=\s*["']([^"']+)["']/g;
    let a;
    while ((a = attrRe.exec(tag))) {
      const key = a[1].toLowerCase();
      const ok = name === 'meta' ? key === 'content' : /^(src|data-src|data-url|data-video-url|data-video|data-hls|data-mp4|data-stream)$/.test(key);
      if (!ok) continue;
      if (name === 'iframe') add(a[2], 'iframe', 'embed');
      else if (name === 'meta') add(a[2], 'meta', undefined);
      else add(a[2], name, 'file');
    }
  }

  // 2. JSON-LD (VideoObject)
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = ldRe.exec(html))) {
    try {
      walkJsonLd(JSON.parse(m[1].trim()), (u, k) => add(u, 'JSON-LD', k === 'file' ? undefined : k));
    } catch (e) {
      /* ignore */
    }
  }

  // 3. קישורים יחסיים לקבצי וידאו (href/src/data-*)
  const relRe = /(?:href|src|data-[\w-]+)\s*=\s*["']([^"']+?\.(?:mp4|m3u8|webm|mpd|m4v|mov)(?:[?#][^"']*)?)["']/gi;
  while ((m = relRe.exec(text))) add(m[1], 'קישור בדף');

  // 4. כל כתובת מוחלטת בטקסט (כולל בתוך סקריפטים)
  const urlRe = /(?:https?:)?\/\/[^\s"'<>\\`]+/gi;
  while ((m = urlRe.exec(text))) {
    if (!/^(?:https?:)?\/\/[a-z0-9-]+\.[a-z]{2,}/i.test(m[0])) continue;
    add(m[0], 'קישור בקוד');
  }

  // 5. כתובות מקודדות
  const encRe = /https?%3A%2F%2F[^\s"'<>&\\]+/gi;
  while ((m = encRe.exec(text))) {
    try {
      add(decodeURIComponent(m[0]), 'מקודד');
    } catch (e) {
      /* ignore */
    }
  }

  // 6. מזהי יוטיוב בהגדרות נגן
  const ytRe = /["']?(?:youtube_?id|yt_?id|video_?id|videoId)["']?\s*[:=]\s*["']([A-Za-z0-9_-]{11})["']/gi;
  while ((m = ytRe.exec(text))) add('https://www.youtube.com/watch?v=' + m[1], 'מזהה יוטיוב', 'embed');

  const rank = { stream: 0, file: 1, embed: 2, other: 3 };
  const results = Array.from(map.values()).sort((a, b) => rank[a.kind] - rank[b.kind]);

  const metaContent = (re) => {
    const mm = re.exec(html);
    return mm ? decodeEntities(mm[1]) : '';
  };
  const title =
    metaContent(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
    metaContent(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i) ||
    metaContent(/<title[^>]*>([\s\S]*?)<\/title>/i);
  let poster =
    metaContent(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ||
    metaContent(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  if (poster) {
    try {
      poster = new URL(poster, baseUrl).href;
    } catch (e) {
      poster = '';
    }
  }
  return { results, title, poster };
}

/* ------------------------------------------------------------------ */
/* API                                                                */
/* ------------------------------------------------------------------ */

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) hits.delete(k);
  return arr.length > RATE_LIMIT;
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Headers': 'x-key',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

async function scrape(target, { depth = 0, all = false } = {}) {
  const page = await fetchPage(target);
  const { results, title, poster } = extractFromHtml(page.body, page.finalUrl);
  const seen = new Set(results.map((r) => r.url));
  const notes = [];

  if (depth >= 1) {
    const iframes = results.filter((r) => r.kind === 'embed' && r.source === 'iframe').slice(0, MAX_IFRAMES);
    for (const f of iframes) {
      try {
        const sub = await fetchPage(f.url, { referer: page.finalUrl });
        const inner = extractFromHtml(sub.body, sub.finalUrl);
        for (const r of inner.results) {
          if (seen.has(r.url)) continue;
          seen.add(r.url);
          results.push({ ...r, source: 'בתוך נגן: ' + new URL(f.url).hostname });
        }
      } catch (e) {
        notes.push('לא הצלחתי לפתוח את הנגן ' + f.url + ' (' + e.message + ')');
      }
    }
    const rank = { stream: 0, file: 1, embed: 2, other: 3 };
    results.sort((a, b) => rank[a.kind] - rank[b.kind]);
  }

  const videos = results.filter((r) => r.kind !== 'other');
  if (!videos.length) {
    notes.push('לא נמצאה כתובת וידאו ב-HTML של הדף. ייתכן שהנגן נטען בעזרת JavaScript אחרי שהדף נפתח.');
  }
  return {
    ok: true,
    pageUrl: target,
    finalUrl: page.finalUrl,
    status: page.status,
    title,
    poster,
    bytes: page.bytes,
    results: all ? results : videos,
    hiddenOthers: all ? 0 : results.length - videos.length,
    notes,
  };
}

const INDEX_PATH = path.join(__dirname, 'index.html');

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Headers': 'x-key',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    return res.end();
  }

  if (u.pathname === '/health') return send(res, 200, { ok: true });

  if (u.pathname === '/api/scrape') {
    if (ACCESS_KEY && (req.headers['x-key'] || u.searchParams.get('key')) !== ACCESS_KEY) {
      return send(res, 401, { ok: false, error: 'נדרש מפתח גישה' });
    }
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (rateLimited(ip)) return send(res, 429, { ok: false, error: 'יותר מדי בקשות, נסה שוב בעוד כמה דקות' });

    let target = (u.searchParams.get('url') || '').trim();
    if (!target) return send(res, 400, { ok: false, error: 'חסר פרמטר url' });
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(target)) target = 'https://' + target;
    try {
      const out = await scrape(target, {
        depth: Number(u.searchParams.get('depth')) || 0,
        all: u.searchParams.get('all') === '1',
      });
      return send(res, 200, out);
    } catch (e) {
      return send(res, 502, { ok: false, error: e.message || 'שגיאה בהורדת הדף' });
    }
  }

  if (u.pathname === '/' || u.pathname === '/index.html') {
    fs.readFile(INDEX_PATH, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('index.html missing');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

if (require.main === module) {
  server.listen(PORT, () => console.log('Vidit listening on :' + PORT));
}

module.exports = { extractFromHtml, scrape, fetchPage, isPrivateIp, server };
