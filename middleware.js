/**
 * Vercel Edge Routing Middleware · GDGoC UHU Cyber Trainer Reverse Proxy
 *
 * Intercepta únicamente `/cybertrainer` y `/cybertrainer/*` (0 invocaciones en
 * `/`, `/openbadges/*`, imágenes o APIs Open Badges estáticas) y hace proxy
 * transparente contra `http://origin-ctf.gdguhu.com` (CTFd en Hetzner) con
 * reescritura segura de rutas, cookies, redirecciones, CSS, HTML y JSON.
 */

const PREFIX = '/cybertrainer';
const UPSTREAM_ORIGIN = 'http://origin-ctf.gdguhu.com';
const UPSTREAM_HOSTS = new Set(['origin-ctf.gdguhu.com', '188.245.96.96']);

export const config = {
  matcher: ['/cybertrainer', '/cybertrainer/:path*'],
};

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

  if (url.pathname === PREFIX && (request.method === 'GET' || request.method === 'HEAD')) {
    return Response.redirect(`https://${url.host}${PREFIX}/${url.search}`, 301);
  }

  const upstreamPath = url.pathname.startsWith(PREFIX)
    ? url.pathname.slice(PREFIX.length) || '/'
    : url.pathname;

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

  const init = {
    method: request.method,
    headers: reqHeaders,
    redirect: 'manual',
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
    return new Response(
      `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cyber Trainer · Servicio temporalmente no disponible</title></head>` +
        `<body style="background:#05070F;color:#E2F1FF;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center">` +
        `<div style="max-width:520px;border:1px solid rgba(0,240,255,.35);border-radius:20px;padding:32px;background:#0B1124">` +
        `<h1 style="margin:0 0 12px;font-size:1.5rem;color:#00F0FF">GDGoC UHU Cyber Trainer</h1>` +
        `<p style="margin:0 0 20px;color:#94A3B8">No se ha podido conectar con el servidor de retos en este momento. Inténtalo de nuevo en unos segundos.</p>` +
        `<a href="https://gdguhu.com/" style="display:inline-block;padding:10px 22px;border-radius:999px;background:#00F0FF;color:#05070F;font-weight:700;text-decoration:none">Volver a gdguhu.com</a>` +
        `</div></body></html>`,
      {
        status: 502,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    );
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

  if (contentType.includes('application/json') && upstreamPath.startsWith('/api/')) {
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
