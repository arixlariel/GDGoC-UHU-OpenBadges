/**
 * Vercel Edge Routing Middleware · GDGoC UHU
 *
 * Funciones principales:
 *  1. Reverse Proxy transparente para `/cybertrainer` y `/cybertrainer/*` contra
 *     `http://origin-ctf.gdguhu.com` (CTFd en Hetzner) con reescritura segura de rutas,
 *     cookies, redirecciones, CSS, HTML y JSON.
 *  2. Protección automática de caída/mantenimiento en `/cybertrainer/*`: ante timeout
 *     (>12s), error de red o 502/503/504 del origen, sirve la página de mantenimiento
 *     Cyber (HTTP 503) o JSON 503 para llamadas `/api/`.
 *  3. Modo mantenimiento global/por sección activable en segundos mediante la variable
 *     de entorno `MAINTENANCE_MODE` en Vercel (`all`, `hub`, `openbadges`, `cybertrainer`,
 *     o combinados separados por coma), respetando siempre los estilos y candados:
 *      - `/` → estilo Google fijo con candado (`/mantenimiento/`).
 *      - `/openbadges/*` → tema guardado del usuario o candado del certificado concreto (`/mantenimiento/openbadges/`).
 *      - `/cybertrainer/*` → estilo Cyber neón fijo (`/mantenimiento/cybertrainer/`).
 *
 * Los assets estáticos (`/_astro/*`, `/images/*`, `/vendor/*`, `/.well-known/*`,
 * `/api/badges/*`, `/mantenimiento/*`) NO pasan por este middleware (0 invocaciones).
 */

import { next } from '@vercel/functions';

const PREFIX = '/cybertrainer';
const UPSTREAM_ORIGIN = 'http://origin-ctf.gdguhu.com';
const UPSTREAM_HOSTS = new Set(['origin-ctf.gdguhu.com', '188.245.96.96']);
const UPSTREAM_TIMEOUT_MS = 12000;
const BEVY_COMMUNITY_URL = 'https://gdg.community.dev/gdg-on-campus-huelva-university-huelva-spain/';
const BEVY_UPCOMING_API_URL =
  'https://gdg.community.dev/api/event_slim/for_chapter/3520/' +
  '?page_size=4&status=Live&include_cohosted_events=true&visible_on_parent_chapter_only=true' +
  '&order=start_date&fields=title,start_date,end_date,url&page=1';

export const config = {
  matcher: [
    '/',
    '/evento',
    '/evento/',
    '/eventos',
    '/eventos/',
    '/openbadges',
    '/openbadges/:path*',
    '/cert/:path*',
    '/cybertrainer',
    '/cybertrainer/:path*',
  ],
};

async function redirectToNextBevyEvent() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  let targetUrl = BEVY_COMMUNITY_URL;

  try {
    const res = await fetch(BEVY_UPCOMING_API_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (res.ok) {
      const payload = await res.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      const now = Date.now();
      const upcoming = results
        .filter((ev) => {
          if (!ev || !ev.url) return false;
          const endTs = Date.parse(ev.end_date || ev.start_date || '');
          return !Number.isNaN(endTs) && endTs > now;
        })
        .sort((a, b) => Date.parse(a.start_date || '') - Date.parse(b.start_date || ''));
      if (upcoming[0]?.url) {
        targetUrl = String(upcoming[0].url).trim();
      }
    }
  } catch {
    // Fallback automático a la página oficial de la comunidad en Bevy
  } finally {
    clearTimeout(timer);
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: targetUrl,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Strict-Transport-Security': 'max-age=31536000',
    },
  });
}

function parseMaintenanceScopes() {
  const raw = (process.env.MAINTENANCE_MODE || '').trim().toLowerCase();
  if (!raw || raw === 'off' || raw === 'false' || raw === '0') {
    return new Set();
  }
  const scopes = new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
  if (scopes.has('true') || scopes.has('1') || scopes.has('on')) {
    scopes.add('all');
  }
  return scopes;
}

function hasMaintenanceBypass(request, url) {
  const key = (process.env.MAINTENANCE_BYPASS_KEY || '').trim();
  if (!key) return false;
  if (url.searchParams.get('bypass') === key) return true;
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').some((part) => part.trim() === `gdgoc_maint_bypass=${key}`);
}

function inlineCyberMaintenanceHtml() {
  return (
    '<!doctype html><html lang="es" data-theme="cyber"><head>' +
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex,nofollow">' +
    '<title>Mantenimiento · GDGoC UHU Cyber Trainer</title>' +
    '<style>' +
    '*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:#05070F;color:#E2F1FF;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.strip{height:6px;background:linear-gradient(90deg,#00F0FF,#FF007F,#FFE600,#00FF66)}' +
    'main{flex:1;display:grid;place-items:center;padding:28px 16px}' +
    '.card{position:relative;max-width:580px;width:100%;border-radius:24px;padding:36px 28px;text-align:center;background:rgba(11,17,36,.92);border:1.5px solid rgba(0,240,255,.4);box-shadow:0 0 42px rgba(0,240,255,.16);overflow:hidden}' +
    '.code{font-family:ui-monospace,monospace;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#94A3B8;margin-bottom:10px}' +
    'h1{margin:0 0 12px;font-size:clamp(1.5rem,4vw,2rem);color:#F0F9FF}' +
    'p{margin:0 auto 24px;max-width:460px;line-height:1.6;color:#94A3B8;font-size:.95rem}' +
    '.actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}' +
    '.btn{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 22px;border-radius:999px;font-weight:700;font-size:.88rem;text-decoration:none;cursor:pointer;border:1.5px solid rgba(0,240,255,.4);color:#E2F1FF;background:rgba(8,12,28,.9)}' +
    '.btn-primary{background:linear-gradient(90deg,#00F0FF,#FF007F);color:#05070F;border:none}' +
    '</style></head><body>' +
    '<div class="strip"></div><main><div class="card">' +
    '<div class="code">HTTP 503 · Servicio temporalmente en pausa</div>' +
    '<h1>Cyber Trainer en mantenimiento</h1>' +
    '<p>El servidor de retos CTF se encuentra temporalmente en mantenimiento o reiniciándose. Tu progreso y tus flags están a salvo; volveremos en unos minutos</p>' +
    '<div class="actions">' +
    '<button class="btn btn-primary" onclick="location.reload()">Reintentar ahora</button>' +
    '<a class="btn" href="https://www.linkedin.com/company/gdgoc-huelva" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
    '<a class="btn" href="https://www.instagram.com/gdgoc.huelva/" target="_blank" rel="noopener noreferrer">Instagram</a>' +
    '</div></div></main></body></html>'
  );
}

async function renderMaintenanceResponse(url, scope, isApiRequest = false) {
  if (isApiRequest) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'maintenance',
        message: 'GDGoC UHU se encuentra temporalmente en mantenimiento. Inténtalo de nuevo en unos minutos.',
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': '120',
          'Strict-Transport-Security': 'max-age=31536000',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  const staticPath =
    scope === 'cybertrainer'
      ? '/mantenimiento/cybertrainer/'
      : scope === 'openbadges'
        ? '/mantenimiento/openbadges/'
        : '/mantenimiento/';

  try {
    const pageResp = await fetch(`${url.origin}${staticPath}`, {
      headers: { Accept: 'text/html' },
    });
    if (pageResp.ok) {
      const html = await pageResp.text();
      return new Response(html, {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': '120',
          'X-Robots-Tag': 'noindex, nofollow',
          'Strict-Transport-Security': 'max-age=31536000',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      });
    }
  } catch {
    // Fallback inline si el fetch interno falla
  }

  return new Response(inlineCyberMaintenanceHtml(), {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': '120',
      'X-Robots-Tag': 'noindex, nofollow',
      'Strict-Transport-Security': 'max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function shouldPrefixPath(raw) {
  if (!raw || typeof raw !== 'string') return false;
  if (!raw.startsWith('/') || raw.startsWith('//')) return false;
  if (raw === PREFIX || raw.startsWith(PREFIX + '/')) return false;
  if (raw === '/openbadges' || raw.startsWith('/openbadges/')) return false;
  return true;
}

function prefixAttrValue(val) {
  return shouldPrefixPath(val) ? PREFIX + val : val;
}

function rewriteMetaRefresh(content) {
  if (!content) return content;
  return content.replace(/(url\s*=\s*['"]?)(\/[^'"\s;]+)/i, (_, lead, path) => lead + prefixAttrValue(path));
}

function rewriteInlineHtmlSnippet(html) {
  if (!html || typeof html !== 'string') return html;
  return html.replace(
    /\b(href|src|action|formaction)=(["'])(\/[^"']*)\2/gi,
    (full, attr, quote, val) => (shouldPrefixPath(val) ? `${attr}=${quote}${PREFIX}${val}${quote}` : full)
  );
}

function rewriteCssUrls(css) {
  if (!css || typeof css !== 'string') return css;
  return css.replace(
    /url\(\s*(['"]?)(\/(?:themes|files|static)\/[^)'"]+)\1\s*\)/gi,
    (_, quote, path) => `url(${quote}${PREFIX}${path}${quote})`
  );
}

function rewriteApiJsonValue(node) {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = rewriteApiJsonValue(node[i]);
    return node;
  }
  for (const key of Object.keys(node)) {
    const val = node[key];
    if (key === 'account_url' && typeof val === 'string') {
      node[key] = prefixAttrValue(val);
    } else if (key === 'files' && Array.isArray(val)) {
      node[key] = val.map((item) => {
        if (typeof item === 'string') return prefixAttrValue(item);
        if (item && typeof item === 'object' && typeof item.location === 'string') {
          return { ...item, location: prefixAttrValue(item.location) };
        }
        return item;
      });
    } else if (key === 'view' && typeof val === 'string') {
      node[key] = rewriteInlineHtmlSnippet(val);
    } else if (val && typeof val === 'object') {
      rewriteApiJsonValue(val);
    }
  }
  return node;
}

function rewriteSetCookie(rawCookie) {
  const parts = rawCookie.split(';').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return rawCookie;
  const nameValue = parts[0];
  const attrs = [];
  let hasPath = false;
  let hasSecure = false;
  let hasSameSite = false;
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    const lower = p.toLowerCase();
    if (lower.startsWith('domain=')) continue;
    if (lower.startsWith('path=')) {
      attrs.push('Path=/');
      hasPath = true;
      continue;
    }
    if (lower === 'secure') {
      hasSecure = true;
      attrs.push('Secure');
      continue;
    }
    if (lower.startsWith('samesite=')) {
      hasSameSite = true;
      attrs.push(p);
      continue;
    }
    attrs.push(p);
  }
  if (!hasPath) attrs.push('Path=/');
  if (!hasSecure) attrs.push('Secure');
  if (!hasSameSite) attrs.push('SameSite=Lax');
  return [nameValue, ...attrs].join('; ');
}

function rewriteLocationHeader(rawLocation, publicUrl) {
  if (!rawLocation) return rawLocation;
  try {
    const resolved = new URL(rawLocation, UPSTREAM_ORIGIN);
    if (UPSTREAM_HOSTS.has(resolved.hostname) || resolved.hostname === publicUrl.hostname) {
      const nextParam = resolved.searchParams.get('next');
      if (nextParam && (nextParam === PREFIX || nextParam.startsWith(PREFIX + '/'))) {
        resolved.searchParams.set('next', nextParam.slice(PREFIX.length) || '/');
      }
      const newPath = shouldPrefixPath(resolved.pathname) ? PREFIX + resolved.pathname : resolved.pathname;
      return `https://${publicUrl.host}${newPath}${resolved.search}${resolved.hash}`;
    }
  } catch {
    if (shouldPrefixPath(rawLocation)) return PREFIX + rawLocation;
  }
  return rawLocation;
}

function detectCookieLang(cookieHeader) {
  if (!cookieHeader) return 'es';
  const m = cookieHeader.match(/(?:^|;\s*)language=([a-zA-Z]{2}(?:[-_][a-zA-Z]{2})?)/);
  return m ? m[1].replace('_', '-') : 'es';
}

function rewriteHtmlSegment(seg, lang, canonical, state) {
  let out = seg;

  if (!state.langDone && /<html\b/i.test(out)) {
    state.langDone = true;
    out = out.replace(/<html\b([^>]*)>/i, (full, attrs) =>
      /\blang\s*=/i.test(attrs) ? full : `<html lang="${lang}"${attrs}>`
    );
  }

  if (!state.canonicalDone && /<\/head>/i.test(out)) {
    state.canonicalDone = true;
    out = out.replace(/<\/head>/i, `<link rel="canonical" href="${canonical}"></head>`);
  }

  out = out.replace(
    /\b(href|src|action|formaction)=(["'])(\/[^"']*)\2/gi,
    (full, attr, quote, val) => (shouldPrefixPath(val) ? `${attr}=${quote}${PREFIX}${val}${quote}` : full)
  );

  out = out.replace(
    /<meta\b([^>]*\bhttp-equiv\s*=\s*["']?refresh["']?[^>]*)>/gi,
    (full, attrs) =>
      `<meta${attrs.replace(/\bcontent=(["'])([^"']*)\1/i, (_, q, val) => `content=${q}${rewriteMetaRefresh(val)}${q}`)}>`
  );

  return out;
}

function rewriteHtml(html, lang, canonical) {
  const parts = html.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/gi);
  const state = { langDone: false, canonicalDone: false };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if (/^<script\b/i.test(part)) {
      const m = part.match(/^(<script\b[^>]*>)([\s\S]*?)(<\/script>)$/i);
      if (!m) continue;
      let openTag = m[1];
      let body = m[2];
      const closeTag = m[3];

      const srcMatch = openTag.match(/\bsrc=(["'])([^"']*)\1/i);
      if (srcMatch) {
        if (srcMatch[2].includes('color_mode_switcher.')) {
          parts[i] = '';
          continue;
        }
        if (shouldPrefixPath(srcMatch[2])) {
          openTag = openTag.replace(
            /\bsrc=(["'])([^"']*)\1/i,
            (_, q, val) => `src=${q}${PREFIX}${val}${q}`
          );
        }
      } else if (body) {
        body = body.replace(/(['"])urlRoot\1\s*:\s*""/g, `'urlRoot': "${PREFIX}"`);
      }

      parts[i] = openTag + body + closeTag;
    } else if (/^<style\b/i.test(part)) {
      const m = part.match(/^(<style\b[^>]*>)([\s\S]*?)(<\/style>)$/i);
      if (m) {
        parts[i] = m[1] + rewriteCssUrls(m[2]) + m[3];
      }
    } else {
      parts[i] = rewriteHtmlSegment(part, lang, canonical, state);
    }
  }

  return parts.join('');
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const cleanPath = url.pathname.replace(/\/+$/, '') || '/';

  // Redirección inteligente /evento y /eventos -> próximo evento activo en Bevy (o comunidad si no hay ninguno)
  if (cleanPath === '/evento' || cleanPath === '/eventos') {
    return redirectToNextBevyEvent();
  }

  const isCyber = url.pathname === PREFIX || url.pathname.startsWith(PREFIX + '/');
  const isOpenBadges =
    url.pathname === '/openbadges' ||
    url.pathname.startsWith('/openbadges/') ||
    url.pathname.startsWith('/cert/');
  const isHub = url.pathname === '/';

  // 1. Modo mantenimiento global o por sección (variable MAINTENANCE_MODE en Vercel)
  const maintScopes = parseMaintenanceScopes();
  if (maintScopes.size > 0 && !hasMaintenanceBypass(request, url)) {
    const allMaint = maintScopes.has('all');
    if (isCyber && (allMaint || maintScopes.has('cybertrainer'))) {
      const isApi = url.pathname.startsWith(PREFIX + '/api/');
      return renderMaintenanceResponse(url, 'cybertrainer', isApi);
    }
    if (isOpenBadges && (allMaint || maintScopes.has('openbadges'))) {
      return renderMaintenanceResponse(url, 'openbadges', false);
    }
    if (isHub && (allMaint || maintScopes.has('hub'))) {
      return renderMaintenanceResponse(url, 'hub', false);
    }
  }

  // Las rutas estáticas del hub y Open Badges pasan directamente al CDN
  if (!isCyber) {
    return next();
  }

  if (url.pathname === PREFIX && (request.method === 'GET' || request.method === 'HEAD')) {
    return Response.redirect(`https://${url.host}${PREFIX}/${url.search}`, 301);
  }

  const upstreamPath = url.pathname.startsWith(PREFIX)
    ? url.pathname.slice(PREFIX.length) || '/'
    : url.pathname;
  const isApiCall = upstreamPath.startsWith('/api/');

  const upstreamUrl = new URL(upstreamPath + url.search, UPSTREAM_ORIGIN);
  const nextParam = upstreamUrl.searchParams.get('next');
  if (nextParam && (nextParam === PREFIX || nextParam.startsWith(PREFIX + '/'))) {
    upstreamUrl.searchParams.set('next', nextParam.slice(PREFIX.length) || '/');
  }

  const reqHeaders = new Headers(request.headers);
  reqHeaders.delete('host');
  reqHeaders.delete('x-vercel-id');
  reqHeaders.delete('x-vercel-deployment-url');
  reqHeaders.delete('x-vercel-forwarded-for');
  reqHeaders.delete('x-vercel-proxied-for');
  reqHeaders.set('X-Forwarded-Proto', 'https');
  reqHeaders.set('X-Forwarded-Host', url.host);
  reqHeaders.set('X-Forwarded-Prefix', PREFIX);

  const referer = reqHeaders.get('referer');
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (refUrl.hostname === url.hostname && refUrl.pathname.startsWith(PREFIX)) {
        const strippedRef = refUrl.pathname.slice(PREFIX.length) || '/';
        reqHeaders.set('Referer', `${UPSTREAM_ORIGIN}${strippedRef}${refUrl.search}`);
      }
    } catch {}
  }

  const origin = reqHeaders.get('origin');
  if (origin && origin === `https://${url.host}`) {
    reqHeaders.set('Origin', UPSTREAM_ORIGIN);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  const init = {
    method: request.method,
    headers: reqHeaders,
    redirect: 'manual',
    signal: controller.signal,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const bodyBuf = await request.arrayBuffer();
    if (bodyBuf.byteLength > 0) {
      init.body = bodyBuf;
    }
  }

  let upstreamResp;
  try {
    upstreamResp = await fetch(upstreamUrl.toString(), init);
  } catch {
    clearTimeout(timeoutId);
    return renderMaintenanceResponse(url, 'cybertrainer', isApiCall);
  } finally {
    clearTimeout(timeoutId);
  }

  // Intercepción automática si el servidor CTFd origen devuelve 502 / 503 / 504
  if (upstreamResp.status === 502 || upstreamResp.status === 503 || upstreamResp.status === 504) {
    return renderMaintenanceResponse(url, 'cybertrainer', isApiCall);
  }

  const respHeaders = new Headers(upstreamResp.headers);
  const setCookies =
    typeof upstreamResp.headers.getSetCookie === 'function'
      ? upstreamResp.headers.getSetCookie()
      : upstreamResp.headers.get('set-cookie')
        ? [upstreamResp.headers.get('set-cookie')]
        : [];
  if (setCookies.length > 0) {
    respHeaders.delete('set-cookie');
    for (const cookie of setCookies) {
      respHeaders.append('Set-Cookie', rewriteSetCookie(cookie));
    }
  }

  const location = respHeaders.get('location');
  if (location) {
    respHeaders.set('Location', rewriteLocationHeader(location, url));
  }

  // Cabeceras de seguridad consistentes en todo gdguhu.com
  respHeaders.set('Strict-Transport-Security', 'max-age=31536000');
  respHeaders.set('X-Content-Type-Options', 'nosniff');
  respHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  const contentType = (respHeaders.get('content-type') || '').toLowerCase();

  if (contentType.includes('text/event-stream') || upstreamPath === '/events') {
    respHeaders.set('Cache-Control', 'no-cache, no-transform');
    return new Response(upstreamResp.body, {
      status: upstreamResp.status,
      statusText: upstreamResp.statusText,
      headers: respHeaders,
    });
  }

  if (contentType.includes('text/html')) {
    const rawHtml = await upstreamResp.text();
    respHeaders.delete('content-length');
    respHeaders.delete('content-encoding');
    const lang = detectCookieLang(request.headers.get('cookie') || '');
    const canonical = `https://gdguhu.com${url.pathname}`;
    return new Response(rewriteHtml(rawHtml, lang, canonical), {
      status: upstreamResp.status,
      statusText: upstreamResp.statusText,
      headers: respHeaders,
    });
  }

  if (contentType.includes('text/css')) {
    const cssText = await upstreamResp.text();
    respHeaders.delete('content-length');
    respHeaders.delete('content-encoding');
    if (upstreamPath.startsWith('/themes/') && !respHeaders.get('cache-control')) {
      respHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
    }
    return new Response(rewriteCssUrls(cssText), {
      status: upstreamResp.status,
      statusText: upstreamResp.statusText,
      headers: respHeaders,
    });
  }

  if (contentType.includes('application/json') && isApiCall) {
    const rawJson = await upstreamResp.text();
    respHeaders.delete('content-length');
    respHeaders.delete('content-encoding');
    try {
      return new Response(JSON.stringify(rewriteApiJsonValue(JSON.parse(rawJson))), {
        status: upstreamResp.status,
        statusText: upstreamResp.statusText,
        headers: respHeaders,
      });
    } catch {
      return new Response(rawJson, {
        status: upstreamResp.status,
        statusText: upstreamResp.statusText,
        headers: respHeaders,
      });
    }
  }

  // Caché agresivo en Edge CDN para assets estáticos de CTFd (JS, fuentes, iconos)
  if (upstreamPath.startsWith('/themes/') && upstreamResp.ok) {
    respHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  }

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: respHeaders,
  });
}
