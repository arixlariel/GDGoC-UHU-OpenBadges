#!/usr/bin/env node
/**
 * Generador automático de tarjetas Open Graph (1200x630 PNG) para GDGoC UHU Open Badges:
 *  - Portal Open Badges -> public/og/openbadges.png
 *  - Cada certificado emitido -> public/og/cert/<id>.png (en el estilo exacto del diploma)
 *
 * Usa Satori + @resvg/resvg-js + @fontsource/plus-jakarta-sans (100 % offline y determinista).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const ogDir = path.join(publicDir, 'og');
const ogCertDir = path.join(ogDir, 'cert');
const badgesDir = path.join(rootDir, 'src', 'content', 'badges');
const assertionsDir = path.join(rootDir, 'src', 'content', 'assertions');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const THEMES = {
  google: {
    outerBg: 'linear-gradient(135deg, #4285F4 0%, #EA4335 33%, #FBBC04 66%, #34A853 100%)',
    innerBgColor: '#FFFFFF',
    innerBgImage: null,
    frameBorder: '#DADCE0',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    accent: '#1967D2',
    nameColor: '#202124',
    pillBg: '#E8F0FE',
    pillBorder: '#D2E3FC',
    pillText: '#1967D2',
    verifiedBg: '#E6F4EA',
    verifiedBorder: '#CEEAD6',
    verifiedText: '#137333',
    badgeBoxBg: '#F8F9FA',
    badgeBoxBorder: '#DADCE0',
    tagBg: '#F1F3F4',
    tagText: '#3C4043',
    stripColors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
  },
  cyber: {
    outerBg: 'linear-gradient(135deg, #00F0FF 0%, #FF007F 42%, #FFE600 72%, #00FF66 100%)',
    innerBgColor: '#070B19',
    innerBgImage: 'linear-gradient(155deg, #091026 0%, #060914 60%, #0D142E 100%)',
    frameBorder: 'rgba(0, 240, 255, 0.45)',
    textPrimary: '#F0F9FF',
    textSecondary: '#A8BBD0',
    accent: '#00F0FF',
    nameColor: '#00F0FF',
    pillBg: 'rgba(0, 240, 255, 0.16)',
    pillBorder: 'rgba(0, 240, 255, 0.5)',
    pillText: '#00F0FF',
    verifiedBg: 'rgba(0, 255, 102, 0.14)',
    verifiedBorder: 'rgba(0, 255, 102, 0.5)',
    verifiedText: '#00FF66',
    badgeBoxBg: 'rgba(13, 22, 48, 0.94)',
    badgeBoxBorder: 'rgba(0, 240, 255, 0.52)',
    tagBg: 'rgba(255, 0, 127, 0.14)',
    tagText: '#FF70B8',
    stripColors: ['#00F0FF', '#FF007F', '#FFE600', '#00FF66'],
  },
  piscina: {
    outerBg: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 45%, #00E5FF 75%, #0284C7 100%)',
    innerBgColor: '#FFFFFF',
    innerBgImage: 'linear-gradient(180deg, #FFFFFF 0%, #E0F7FA 100%)',
    frameBorder: 'rgba(0, 188, 212, 0.5)',
    textPrimary: '#0C4A6E',
    textSecondary: '#0E7490',
    accent: '#0284C7',
    nameColor: '#0284C7',
    pillBg: '#CCFBF1',
    pillBorder: '#2DD4BF',
    pillText: '#0F766E',
    verifiedBg: '#ECFDF5',
    verifiedBorder: '#6EE7B7',
    verifiedText: '#047857',
    badgeBoxBg: 'rgba(255, 255, 255, 0.94)',
    badgeBoxBorder: 'rgba(0, 188, 212, 0.55)',
    tagBg: 'rgba(2, 132, 199, 0.1)',
    tagText: '#0369A1',
    stripColors: ['#00F2FE', '#4FACFE', '#00E5FF', '#0284C7'],
  },
  nieve: {
    outerBg: 'linear-gradient(135deg, #FFFFFF 0%, #7DD3FC 40%, #38BDF8 75%, #BAE6FD 100%)',
    innerBgColor: '#08182E',
    innerBgImage: 'linear-gradient(180deg, #08182E 0%, #0F294A 100%)',
    frameBorder: 'rgba(224, 242, 254, 0.48)',
    textPrimary: '#F0F9FF',
    textSecondary: '#BAE6FD',
    accent: '#7DD3FC',
    nameColor: '#E0F2FE',
    pillBg: 'rgba(125, 211, 252, 0.18)',
    pillBorder: 'rgba(186, 230, 253, 0.48)',
    pillText: '#E0F2FE',
    verifiedBg: 'rgba(167, 243, 208, 0.14)',
    verifiedBorder: 'rgba(110, 231, 183, 0.45)',
    verifiedText: '#A7F3D0',
    badgeBoxBg: 'rgba(14, 36, 66, 0.9)',
    badgeBoxBorder: 'rgba(186, 230, 253, 0.52)',
    tagBg: 'rgba(125, 211, 252, 0.15)',
    tagText: '#BAE6FD',
    stripColors: ['#FFFFFF', '#7DD3FC', '#38BDF8', '#BAE6FD'],
  },
  caramelos: {
    outerBg: 'linear-gradient(135deg, #FF1493 0%, #FF85C0 48%, #FF69B4 100%)',
    innerBgColor: '#FFF9FC',
    innerBgImage: 'linear-gradient(180deg, #FFF9FC 0%, #FFE4F2 100%)',
    frameBorder: '#FF69B4',
    textPrimary: '#831843',
    textSecondary: '#9D174D',
    accent: '#D81B60',
    nameColor: '#D81B60',
    pillBg: '#FCE7F3',
    pillBorder: '#F472B6',
    pillText: '#BE185D',
    verifiedBg: '#ECFDF5',
    verifiedBorder: '#6EE7B7',
    verifiedText: '#047857',
    badgeBoxBg: 'rgba(255, 255, 255, 0.95)',
    badgeBoxBorder: '#FF69B4',
    tagBg: 'rgba(255, 20, 147, 0.1)',
    tagText: '#BE185D',
    stripColors: ['#FF1493', '#FF85C0', '#FFD600', '#FF69B4'],
  },
};

function h(type, props, ...children) {
  const flat = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  return {
    type,
    props: {
      ...(props || {}),
      ...(flat.length === 1 ? { children: flat[0] } : flat.length > 1 ? { children: flat } : {}),
    },
  };
}

function loadFonts() {
  const fontDir = path.join(rootDir, 'node_modules', '@fontsource', 'plus-jakarta-sans', 'files');
  return [400, 600, 700, 800].map((weight) => ({
    name: 'Plus Jakarta Sans',
    data: fs.readFileSync(path.join(fontDir, `plus-jakarta-sans-latin-${weight}-normal.woff`)),
    weight,
    style: 'normal',
  }));
}

let sharpModule = null;
async function loadSharp() {
  if (sharpModule !== null) return sharpModule;
  try {
    const mod = await import('sharp');
    sharpModule = mod.default || mod;
  } catch {
    sharpModule = false;
  }
  return sharpModule;
}

const dataUriCache = new Map();
async function imageToDataUri(absPath, maxSize = 300) {
  const cacheKey = `${absPath}@${maxSize}`;
  if (dataUriCache.has(cacheKey)) return dataUriCache.get(cacheKey);
  if (!fs.existsSync(absPath)) return null;

  const sharp = await loadSharp();
  let buf;
  let mime = 'image/png';
  if (sharp) {
    buf = await sharp(absPath)
      .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 8 })
      .toBuffer();
  } else {
    buf = fs.readFileSync(absPath);
    mime = /\.jpe?g$/i.test(absPath) ? 'image/jpeg' : 'image/png';
  }
  const uri = `data:${mime};base64,${buf.toString('base64')}`;
  dataUriCache.set(cacheKey, uri);
  return uri;
}

function walkJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) results.push(full);
  }
  return results;
}

function formatDateEs(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Madrid',
  });
}

async function renderPng(vnode, fonts, outPath) {
  const svg = await satori(vnode, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } });
  fs.writeFileSync(outPath, resvg.render().asPng());
}

function buildOpenBadgesPortalCard(logoUri) {
  const t = THEMES.google;
  return h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: t.outerBg,
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    h(
      'div',
      {
        style: {
          width: 1168,
          height: 598,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.innerBgColor,
          borderRadius: 26,
          border: `2px solid ${t.frameBorder}`,
        },
      },
      h(
        'div',
        {
          style: {
            width: 1084,
            height: 526,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' } },
          h(
            'div',
            {
              style: {
                display: 'flex',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: t.pillBg,
                border: `1.5px solid ${t.pillBorder}`,
                color: t.pillText,
                fontSize: '20px',
                fontWeight: 800,
              },
            },
            'Open Badges 2.0 & 3.0'
          ),
          h(
            'div',
            { style: { display: 'flex', fontSize: '23px', fontWeight: 800, color: t.accent } },
            'gdguhu.com/openbadges'
          )
        ),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '46px', width: '100%' } },
          logoUri
            ? h(
                'div',
                {
                  style: {
                    display: 'flex',
                    width: '224px',
                    height: '224px',
                    borderRadius: '38px',
                    overflow: 'hidden',
                    border: `2px solid ${t.frameBorder}`,
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0,
                  },
                },
                h('img', { src: logoUri, width: 224, height: 224, style: { width: '224px', height: '224px', objectFit: 'cover' } })
              )
            : null,
          h(
            'div',
            { style: { display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' } },
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  fontSize: '68px',
                  fontWeight: 800,
                  color: t.textPrimary,
                  lineHeight: 1.08,
                  letterSpacing: '-0.025em',
                },
              },
              'Certificados Digitales'
            ),
            h(
              'div',
              { style: { display: 'flex', fontSize: '29px', fontWeight: 600, color: t.textSecondary, lineHeight: 1.35 } },
              'Acreditaciones oficiales verificables de GDG on Campus Universidad de Huelva'
            )
          )
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: `2px solid ${t.frameBorder}`,
              paddingTop: '22px',
            },
          },
          h(
            'div',
            { style: { display: 'flex', gap: '14px', alignItems: 'center' } },
            ...['Firma Ed25519', 'did:web:gdguhu.com', 'Compatible LinkedIn'].map((label) =>
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    padding: '9px 18px',
                    borderRadius: '999px',
                    backgroundColor: '#F8F9FA',
                    border: `1.5px solid ${t.frameBorder}`,
                    color: t.textPrimary,
                    fontSize: '19px',
                    fontWeight: 700,
                  },
                },
                label
              )
            )
          ),
          h(
            'div',
            { style: { display: 'flex', gap: '10px', alignItems: 'center' } },
            ...t.stripColors.map((col) =>
              h('div', { style: { width: '16px', height: '16px', borderRadius: '999px', backgroundColor: col } })
            )
          )
        )
      )
    )
  );
}

function buildCertificateCard({ recipientName, role, badgeName, tags, issueDate, assertionId, styleKey, logoUri, badgeUri }) {
  const t = THEMES[styleKey] || THEMES.google;
  const nameLen = recipientName.length;
  const nameFontSize = nameLen > 32 ? 44 : nameLen > 24 ? 54 : 62;
  const titleLen = badgeName.length;
  const titleFontSize = titleLen > 42 ? 31 : 37;
  const shownTags = Array.isArray(tags) ? tags.map((x) => String(x).trim()).filter(Boolean).slice(0, 3) : [];

  return h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: t.outerBg,
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    h(
      'div',
      {
        style: {
          width: 1168,
          height: 598,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.innerBgColor,
          ...(t.innerBgImage ? { backgroundImage: t.innerBgImage } : {}),
          borderRadius: 26,
          border: `2px solid ${t.frameBorder}`,
        },
      },
      h(
        'div',
        {
          style: {
            width: 1088,
            height: 530,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        },
        // Header institucional ampliado
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' } },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
            logoUri
              ? h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      width: '68px',
                      height: '68px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: `2px solid ${t.frameBorder}`,
                      backgroundColor: '#FFFFFF',
                    },
                  },
                  h('img', { src: logoUri, width: 68, height: 68, style: { width: '68px', height: '68px', objectFit: 'cover' } })
                )
              : null,
            h(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
              h('div', { style: { display: 'flex', fontSize: '26px', fontWeight: 800, color: t.textPrimary } }, 'GDG on Campus'),
              h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: t.accent } }, 'Universidad de Huelva')
            )
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: t.verifiedBg,
                border: `1.5px solid ${t.verifiedBorder}`,
                color: t.verifiedText,
                fontSize: '18px',
                fontWeight: 800,
              },
            },
            'Open Badges 3.0 · Ed25519'
          )
        ),
        // Bloque central protagonista (tipografía y medalla ampliadas para llenar el lienzo)
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', width: '100%' } },
          h(
            'div',
            { style: { display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' } },
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    padding: '7px 18px',
                    borderRadius: '999px',
                    backgroundColor: t.pillBg,
                    border: `1.5px solid ${t.pillBorder}`,
                    color: t.pillText,
                    fontSize: '17px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  },
                },
                role
              ),
              issueDate
                ? h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 600, color: t.textSecondary } }, issueDate)
                : null
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  fontSize: `${titleFontSize}px`,
                  fontWeight: 800,
                  color: t.textPrimary,
                  lineHeight: 1.14,
                  marginTop: '2px',
                },
              },
              badgeName
            ),
            h(
              'div',
              { style: { display: 'flex', fontSize: '21px', fontWeight: 600, color: t.textSecondary, marginTop: '6px' } },
              'Certificado digital oficial otorgado a'
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  fontSize: `${nameFontSize}px`,
                  fontWeight: 800,
                  color: t.nameColor,
                  lineHeight: 1.18,
                  paddingTop: '2px',
                  paddingBottom: '4px',
                },
              },
              recipientName
            ),
            // Barra de acento + etiquetas de competencia
            h(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' } },
              h(
                'div',
                { style: { display: 'flex', width: '96px', height: '6px', borderRadius: '999px', overflow: 'hidden' } },
                ...t.stripColors.map((col) => h('div', { style: { flex: 1, height: '6px', backgroundColor: col } }))
              ),
              ...shownTags.map((tag) =>
                h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      padding: '5px 13px',
                      borderRadius: '999px',
                      backgroundColor: t.tagBg,
                      color: t.tagText,
                      fontSize: '15px',
                      fontWeight: 700,
                    },
                  },
                  `#${tag}`
                )
              )
            )
          ),
          badgeUri
            ? h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '286px',
                    height: '286px',
                    borderRadius: '36px',
                    backgroundColor: t.badgeBoxBg,
                    border: `2.5px solid ${t.badgeBoxBorder}`,
                    padding: '22px',
                    flexShrink: 0,
                  },
                },
                h('img', { src: badgeUri, width: 242, height: 242, style: { width: '242px', height: '242px', objectFit: 'contain' } })
              )
            : null
        ),
        // Pie verificable
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: `2px solid ${t.frameBorder}`,
              paddingTop: '18px',
            },
          },
          h('div', { style: { display: 'flex', fontSize: '19px', fontWeight: 700, color: t.textSecondary } }, `Credencial verificable · ID ${assertionId}`),
          h('div', { style: { display: 'flex', fontSize: '21px', fontWeight: 800, color: t.accent } }, 'gdguhu.com/openbadges')
        )
      )
    )
  );
}

async function main() {
  fs.mkdirSync(ogCertDir, { recursive: true });
  const fonts = loadFonts();
  const logoUri = await imageToDataUri(path.join(publicDir, 'images', 'gdgoc-uhu-logo.jpg'), 280);

  await renderPng(buildOpenBadgesPortalCard(logoUri), fonts, path.join(ogDir, 'openbadges.png'));

  const badgesById = new Map();
  for (const filePath of walkJsonFiles(badgesDir)) {
    const id = path.basename(filePath, '.json');
    try {
      badgesById.set(id, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    } catch {}
  }

  let certCount = 0;
  for (const filePath of walkJsonFiles(assertionsDir)) {
    const assertionId = path.basename(filePath, '.json');
    let assertion;
    try {
      assertion = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      continue;
    }

    const badge = badgesById.get(assertion.badgeId);
    if (!badge) continue;

    const styleKey = assertion.styleOverride || badge.style || 'google';
    const badgeImgRel = String(badge.image || '').replace(/^\/+/, '');
    const badgeUri = badgeImgRel ? await imageToDataUri(path.join(publicDir, badgeImgRel), 300) : null;

    await renderPng(
      buildCertificateCard({
        recipientName: String(assertion.recipient?.name || '').trim(),
        role: String(assertion.role || 'Participante').trim(),
        badgeName: String(badge.name || '').trim(),
        tags: badge.tags || [],
        issueDate: formatDateEs(assertion.issuedOn),
        assertionId,
        styleKey,
        logoUri,
        badgeUri,
      }),
      fonts,
      path.join(ogCertDir, `${assertionId}.png`)
    );
    certCount += 1;
  }

  console.log(`[og] Generadas tarjetas Open Graph 1200x630: openbadges.png y ${certCount} certificados.`);
}

main().catch((err) => {
  console.error('[og] Error generando tarjetas Open Graph:', err);
  process.exit(1);
});
