#!/usr/bin/env node
/**
 * Generador automático de tarjetas Open Graph (1200x630 PNG) para:
 *  - Portada oficial gdguhu.com -> public/og/hub.png
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
    stripColors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
  },
  cyber: {
    outerBg: 'linear-gradient(135deg, #00F0FF 0%, #FF007F 42%, #FFE600 72%, #00FF66 100%)',
    innerBgColor: '#070B19',
    innerBgImage: null,
    frameBorder: 'rgba(0, 240, 255, 0.42)',
    textPrimary: '#F0F9FF',
    textSecondary: '#94A3B8',
    accent: '#00F0FF',
    nameColor: '#00F0FF',
    pillBg: 'rgba(0, 240, 255, 0.14)',
    pillBorder: 'rgba(0, 240, 255, 0.45)',
    pillText: '#00F0FF',
    verifiedBg: 'rgba(0, 255, 102, 0.12)',
    verifiedBorder: 'rgba(0, 255, 102, 0.45)',
    verifiedText: '#00FF66',
    badgeBoxBg: 'rgba(12, 20, 44, 0.92)',
    badgeBoxBorder: 'rgba(0, 240, 255, 0.45)',
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
    badgeBoxBg: 'rgba(255, 255, 255, 0.92)',
    badgeBoxBorder: 'rgba(0, 188, 212, 0.5)',
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
    pillBg: 'rgba(125, 211, 252, 0.16)',
    pillBorder: 'rgba(186, 230, 253, 0.45)',
    pillText: '#E0F2FE',
    verifiedBg: 'rgba(167, 243, 208, 0.14)',
    verifiedBorder: 'rgba(110, 231, 183, 0.45)',
    verifiedText: '#A7F3D0',
    badgeBoxBg: 'rgba(14, 36, 66, 0.88)',
    badgeBoxBorder: 'rgba(186, 230, 253, 0.48)',
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
    badgeBoxBg: 'rgba(255, 255, 255, 0.94)',
    badgeBoxBorder: '#FF69B4',
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
  const weights = [400, 600, 700, 800];
  return weights.map((weight) => ({
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
async function imageToDataUri(absPath, maxSize = 260) {
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
    mime = 'image/png';
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
    if (entry.isDirectory()) {
      results.push(...walkJsonFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(full);
    }
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
  const svg = await satori(vnode, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
  });
  const pngBuffer = resvg.render().asPng();
  fs.writeFileSync(outPath, pngBuffer);
}

function buildBrandCard({ title, subtitle, pill, chips, logoUri }) {
  const t = THEMES.google;
  return h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        padding: '14px',
        backgroundImage: t.outerBg,
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    h(
      'div',
      {
        style: {
          width: '1172px',
          height: '602px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: t.innerBgColor,
          borderRadius: '26px',
          padding: '44px 54px',
          border: `2px solid ${t.frameBorder}`,
        },
      },
      // Header row
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          },
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: t.pillBg,
                border: `1.5px solid ${t.pillBorder}`,
                color: t.pillText,
                fontSize: '18px',
                fontWeight: 700,
              },
            },
            pill
          )
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: '20px',
              fontWeight: 700,
              color: t.textSecondary,
            },
          },
          'gdguhu.com'
        )
      ),
      // Main center row
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '44px',
            width: '100%',
          },
        },
        logoUri
          ? h(
              'div',
              {
                style: {
                  display: 'flex',
                  width: '186px',
                  height: '186px',
                  borderRadius: '34px',
                  overflow: 'hidden',
                  border: `2px solid ${t.frameBorder}`,
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0,
                },
              },
              h('img', {
                src: logoUri,
                width: 186,
                height: 186,
                style: { width: '186px', height: '186px', objectFit: 'cover' },
              })
            )
          : null,
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '12px',
            },
          },
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: '60px',
                fontWeight: 800,
                color: t.textPrimary,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
              },
            },
            title
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: '26px',
                fontWeight: 600,
                color: t.textSecondary,
                lineHeight: 1.38,
              },
            },
            subtitle
          )
        )
      ),
      // Footer chips
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
          { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
          ...chips.map((label) =>
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  padding: '7px 16px',
                  borderRadius: '999px',
                  backgroundColor: '#F8F9FA',
                  border: `1.5px solid ${t.frameBorder}`,
                  color: t.textPrimary,
                  fontSize: '17px',
                  fontWeight: 700,
                },
              },
              label
            )
          )
        ),
        h(
          'div',
          { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          ...t.stripColors.map((col) =>
            h('div', {
              style: {
                width: '14px',
                height: '14px',
                borderRadius: '999px',
                backgroundColor: col,
              },
            })
          )
        )
      )
    )
  );
}

function buildCertificateCard({ recipientName, role, badgeName, issueDate, assertionId, styleKey, logoUri, badgeUri }) {
  const t = THEMES[styleKey] || THEMES.google;
  const nameLen = recipientName.length;
  const nameFontSize = nameLen > 34 ? 38 : nameLen > 26 ? 45 : 52;
  const titleLen = badgeName.length;
  const titleFontSize = titleLen > 44 ? 26 : 31;

  return h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        padding: '14px',
        backgroundImage: t.outerBg,
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    h(
      'div',
      {
        style: {
          width: '1172px',
          height: '602px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: t.innerBgColor,
          ...(t.innerBgImage ? { backgroundImage: t.innerBgImage } : {}),
          borderRadius: '26px',
          padding: '36px 48px',
          border: `2px solid ${t.frameBorder}`,
        },
      },
      // Top institutional header
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          },
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          logoUri
            ? h(
                'div',
                {
                  style: {
                    display: 'flex',
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: `2px solid ${t.frameBorder}`,
                    backgroundColor: '#FFFFFF',
                  },
                },
                h('img', {
                  src: logoUri,
                  width: 60,
                  height: 60,
                  style: { width: '60px', height: '60px', objectFit: 'cover' },
                })
              )
            : null,
          h(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
            h(
              'div',
              { style: { display: 'flex', fontSize: '23px', fontWeight: 800, color: t.textPrimary } },
              'GDG on Campus'
            ),
            h(
              'div',
              { style: { display: 'flex', fontSize: '17px', fontWeight: 700, color: t.accent } },
              'Universidad de Huelva'
            )
          )
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: t.verifiedBg,
              border: `1.5px solid ${t.verifiedBorder}`,
              color: t.verifiedText,
              fontSize: '16px',
              fontWeight: 700,
            },
          },
          'Open Badges 3.0 · Ed25519'
        )
      ),
      // Main content row (Left details + Right badge art)
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '38px',
            width: '100%',
          },
        },
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '10px',
            },
          },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  backgroundColor: t.pillBg,
                  border: `1.5px solid ${t.pillBorder}`,
                  color: t.pillText,
                  fontSize: '15px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                },
              },
              role
            ),
            issueDate
              ? h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      fontSize: '17px',
                      fontWeight: 600,
                      color: t.textSecondary,
                    },
                  },
                  issueDate
                )
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
                lineHeight: 1.18,
                marginTop: '4px',
              },
            },
            badgeName
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: '18px',
                fontWeight: 600,
                color: t.textSecondary,
                marginTop: '8px',
              },
            },
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
                lineHeight: 1.24,
                paddingTop: '4px',
                paddingBottom: '4px',
              },
            },
            recipientName
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
                  width: '236px',
                  height: '236px',
                  borderRadius: '32px',
                  backgroundColor: t.badgeBoxBg,
                  border: `2px solid ${t.badgeBoxBorder}`,
                  padding: '22px',
                  flexShrink: 0,
                },
              },
              h('img', {
                src: badgeUri,
                width: 192,
                height: 192,
                style: { width: '192px', height: '192px', objectFit: 'contain' },
              })
            )
          : null
      ),
      // Bottom verification strip
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
        h(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: '17px',
              fontWeight: 700,
              color: t.textSecondary,
            },
          },
          `Credencial verificable · ID ${assertionId}`
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: '18px',
              fontWeight: 800,
              color: t.accent,
            },
          },
          'gdguhu.com/openbadges'
        )
      )
    )
  );
}

async function main() {
  fs.mkdirSync(ogCertDir, { recursive: true });
  const fonts = loadFonts();
  const logoUri = await imageToDataUri(path.join(publicDir, 'images', 'gdgoc-uhu-logo.jpg'), 240);

  // 1. Hub OG card
  await renderPng(
    buildBrandCard({
      title: 'GDGoC UHU',
      subtitle: 'Google Developer Group on Campus · Universidad de Huelva',
      pill: 'Portal Oficial',
      chips: ['Cyber Trainer', 'Open Badges', 'Eventos y Talleres'],
      logoUri,
    }),
    fonts,
    path.join(ogDir, 'hub.png')
  );

  // 2. Open Badges portal OG card
  await renderPng(
    buildBrandCard({
      title: 'Certificados Digitales',
      subtitle: 'Acreditaciones oficiales verificables de GDG on Campus Universidad de Huelva',
      pill: 'Open Badges 2.0 & 3.0',
      chips: ['Firma Ed25519', 'did:web:gdguhu.com', 'Compatible LinkedIn'],
      logoUri,
    }),
    fonts,
    path.join(ogDir, 'openbadges.png')
  );

  // 3. Per-certificate OG cards
  const badgesById = new Map();
  for (const filePath of walkJsonFiles(badgesDir)) {
    const id = path.basename(filePath, '.json');
    try {
      badgesById.set(id, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    } catch {
      // ignore invalid badge json
    }
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
    const badgeUri = badgeImgRel ? await imageToDataUri(path.join(publicDir, badgeImgRel), 240) : null;

    await renderPng(
      buildCertificateCard({
        recipientName: String(assertion.recipient?.name || '').trim(),
        role: String(assertion.role || 'Participante').trim(),
        badgeName: String(badge.name || '').trim(),
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

  console.log(`[og] Generadas tarjetas Open Graph 1200x630: hub.png, openbadges.png y ${certCount} certificados.`);
}

main().catch((err) => {
  console.error('[og] Error generando tarjetas Open Graph:', err);
  process.exit(1);
});
