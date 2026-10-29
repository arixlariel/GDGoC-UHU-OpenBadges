export interface CertificatePdfData {
  assertionId: string;
  certUrl: string;
  recipientName: string;
  role: string;
  issueDate: string;
  badgeName: string;
  description?: string;
  badgeDescription?: string;
  narrative?: string;
  badgeNarrative?: string;
  badgeImageUrl?: string;
  badgeImage?: string;
  logoUrl?: string;
  logoImage?: string;
  tags: string[];
  qrSize: number;
  qrPath: string;
  style?: string;
}

interface ThemeColors {
  outerType: 'gradient' | 'stripes';
  outerStops: Array<[number, string]>;
  innerBg: [string, string];
  frame1Color: string;
  frame1Dash: number[];
  frame2Color: string;
  frame2Dash: number[];
  textPrimary: string;
  textSecondary: string;
  accentText: string;
  recipientStops: string[];
  borderColor: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  metaBg: string;
  metaBorder: string;
  fontMain: string;
  fontDisplay: string;
  cornerEmojis?: [string, string, string, string];
}

const THEMES: Record<string, ThemeColors> = {
  google: {
    outerType: 'gradient',
    outerStops: [
      [0, '#4285F4'],
      [0.33, '#EA4335'],
      [0.66, '#FBBC04'],
      [1, '#34A853'],
    ],
    innerBg: ['#FFFFFF', '#FFFFFF'],
    frame1Color: '#DADCE0',
    frame1Dash: [],
    frame2Color: '#E8EAED',
    frame2Dash: [18, 16],
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    accentText: '#1967D2',
    recipientStops: ['#202124', '#202124'],
    borderColor: '#DADCE0',
    pillBg: '#E8F0FE',
    pillBorder: '#D2E3FC',
    pillText: '#1967D2',
    metaBg: '#F8F9FA',
    metaBorder: '#DADCE0',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
  },
  cyber: {
    outerType: 'gradient',
    outerStops: [
      [0, '#00F0FF'],
      [0.33, '#FF007F'],
      [0.66, '#FFE600'],
      [1, '#00FF66'],
    ],
    innerBg: ['#070B19', '#070B19'],
    frame1Color: 'rgba(0, 240, 255, 0.42)',
    frame1Dash: [],
    frame2Color: 'rgba(255, 0, 127, 0.38)',
    frame2Dash: [18, 16],
    textPrimary: '#F0F9FF',
    textSecondary: '#94A3B8',
    accentText: '#00F0FF',
    recipientStops: ['#00F0FF', '#FF007F', '#00FF66'],
    borderColor: 'rgba(0, 240, 255, 0.35)',
    pillBg: 'rgba(0, 240, 255, 0.14)',
    pillBorder: '#00F0FF',
    pillText: '#00F0FF',
    metaBg: '#0C142C',
    metaBorder: 'rgba(0, 240, 255, 0.42)',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
  },
  piscina: {
    outerType: 'gradient',
    outerStops: [
      [0, '#00F2FE'],
      [0.33, '#4FACFE'],
      [0.66, '#00E5FF'],
      [1, '#0284C7'],
    ],
    innerBg: ['#FFFFFF', '#E0F7FA'],
    frame1Color: 'rgba(0, 188, 212, 0.55)',
    frame1Dash: [],
    frame2Color: 'rgba(2, 132, 199, 0.4)',
    frame2Dash: [18, 16],
    textPrimary: '#002B3D',
    textSecondary: '#00587A',
    accentText: '#0284C7',
    recipientStops: ['#0284C7', '#00B4DB', '#00897B'],
    borderColor: 'rgba(0, 188, 212, 0.5)',
    pillBg: '#E0F7FA',
    pillBorder: '#00BCD4',
    pillText: '#006064',
    metaBg: 'rgba(255, 255, 255, 0.9)',
    metaBorder: 'rgba(0, 188, 212, 0.5)',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    cornerEmojis: ['🌊', '💦', '🫧', '🌊'],
  },
  nieve: {
    outerType: 'gradient',
    outerStops: [
      [0, '#FFFFFF'],
      [0.33, '#7DD3FC'],
      [0.66, '#38BDF8'],
      [1, '#BAE6FD'],
    ],
    innerBg: ['#08182E', '#0F294A'],
    frame1Color: 'rgba(224, 242, 254, 0.55)',
    frame1Dash: [],
    frame2Color: 'rgba(125, 211, 252, 0.4)',
    frame2Dash: [18, 16],
    textPrimary: '#F0F9FF',
    textSecondary: '#BAE6FD',
    accentText: '#7DD3FC',
    recipientStops: ['#FFFFFF', '#7DD3FC', '#E0F2FE'],
    borderColor: 'rgba(186, 230, 253, 0.45)',
    pillBg: 'rgba(224, 242, 254, 0.18)',
    pillBorder: 'rgba(255, 255, 255, 0.7)',
    pillText: '#FFFFFF',
    metaBg: '#0E2442',
    metaBorder: 'rgba(186, 230, 253, 0.5)',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    cornerEmojis: ['❄️', '🌬️', '❆', '❄️'],
  },
  caramelos: {
    outerType: 'stripes',
    outerStops: [],
    innerBg: ['#FFF9FC', '#FFE4F2'],
    frame1Color: '#FF4D94',
    frame1Dash: [20, 14],
    frame2Color: '#FF85C0',
    frame2Dash: [6, 10],
    textPrimary: '#880E4F',
    textSecondary: '#C2185B',
    accentText: '#D81B60',
    recipientStops: ['#D81B60', '#FF1493', '#FF69B4'],
    borderColor: '#FF85C0',
    pillBg: '#FFE0F0',
    pillBorder: '#FF1493',
    pillText: '#AD1457',
    metaBg: '#FFE8F3',
    metaBorder: '#FF69B4',
    fontMain: '"Fredoka", "Google Sans", system-ui, sans-serif',
    fontDisplay: '"Fredoka", "Google Sans Display", system-ui, sans-serif',
    cornerEmojis: ['🧁', '🍬', '🍩', '🍰'],
  },
};

const imageCache = new Map<string, HTMLImageElement>();

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

async function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  if (!src) return null;
  const cached = imageCache.get(src);
  if (cached) return cached;

  try {
    if (src.endsWith('.svg') || src.includes('.svg?')) {
      const res = await fetch(src);
      if (res.ok) {
        let svgText = await res.text();
        if (!/\bwidth=/.test(svgText)) {
          svgText = svgText.replace('<svg', '<svg width="240" height="240"');
        }
        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const loadedSvg = await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(blobUrl);
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            resolve(null);
          };
          img.src = blobUrl;
        });
        if (loadedSvg) {
          imageCache.set(src, loadedSvg);
          return loadedSvg;
        }
      }
    }
  } catch {
    // Fallback to standard Image loading below
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Pre-carga las imágenes del certificado en memoria para que en móviles (iOS Safari / Android Chrome)
 * la generación del PDF al pulsar el botón sea prácticamente instantánea sin perder el gesto de usuario.
 */
export function preloadCertificateAssets(data: CertificatePdfData): void {
  const logoSrc = data.logoUrl || data.logoImage || '/images/gdgoc-uhu-logo.jpg';
  const badgeSrc = data.badgeImageUrl || data.badgeImage || '';
  void loadImageSafe(logoSrc);
  if (badgeSrc) {
    void loadImageSafe(badgeSrc);
  }
}

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const clean = (text || '').trim();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawThemeOrnaments(
  ctx: CanvasRenderingContext2D,
  themeKey: string,
  theme: ThemeColors,
  ix: number,
  iy: number,
  iw: number,
  ih: number
) {
  ctx.save();
  if (themeKey === 'google') {
    ctx.globalAlpha = 0.14;
    // Top-left rings
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 10;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(ix + 140, iy + 140, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.lineWidth = 7.5;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.arc(ix + 140, iy + 140, 138, 0, Math.PI * 2);
    ctx.stroke();

    // Bottom-right rings
    ctx.strokeStyle = '#34A853';
    ctx.lineWidth = 10;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(ix + iw - 140, iy + ih - 140, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC04';
    ctx.lineWidth = 7.5;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.arc(ix + iw - 140, iy + ih - 140, 138, 0, Math.PI * 2);
    ctx.stroke();
  } else if (themeKey === 'cyber') {
    ctx.globalAlpha = 0.25;
    // Top-left cyber geometry
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 14]);
    ctx.beginPath();
    ctx.arc(ix + 160, iy + 160, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FF007F';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ix - 80, iy + 360);
    ctx.lineTo(ix + 360, iy - 80);
    ctx.lineTo(ix + 510, iy + 510);
    ctx.closePath();
    ctx.stroke();

    // Bottom-right cyber geometry
    ctx.strokeStyle = '#00FF66';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 14]);
    ctx.beginPath();
    ctx.arc(ix + iw - 160, iy + ih - 160, 210, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ix + iw - 410, iy + ih - 410);
    ctx.lineTo(ix + iw + 80, iy + ih - 260);
    ctx.lineTo(ix + iw - 210, iy + ih + 80);
    ctx.closePath();
    ctx.stroke();
  } else if (theme.cornerEmojis) {
    ctx.globalAlpha = 0.9;
    ctx.font = '72px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textBaseline = 'middle';
    const padX = 115;
    const padY = 110;
    ctx.textAlign = 'left';
    ctx.fillText(theme.cornerEmojis[0], ix + padX, iy + padY);
    ctx.textAlign = 'right';
    ctx.fillText(theme.cornerEmojis[1], ix + iw - padX, iy + padY);
    ctx.textAlign = 'left';
    ctx.fillText(theme.cornerEmojis[2], ix + padX, iy + ih - padY);
    ctx.textAlign = 'right';
    ctx.fillText(theme.cornerEmojis[3], ix + iw - padX, iy + ih - padY);
  }
  ctx.restore();
}

export async function renderCertificateCanvas(
  data: CertificatePdfData,
  themeKey: string
): Promise<HTMLCanvasElement> {
  if (document.fonts && document.fonts.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);
    } catch {
      // Ignore font readiness timeout on mobile browsers
    }
  }

  const logoSrc = data.logoUrl || data.logoImage || '/images/gdgoc-uhu-logo.jpg';
  const badgeSrc = data.badgeImageUrl || data.badgeImage || '';
  const descriptionText = data.description || data.badgeDescription || '';
  const narrativeText = data.narrative || data.badgeNarrative || '';

  const theme = THEMES[themeKey] || THEMES.google;
  const W = 2970;
  const H = 2100;
  const cx = W / 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Page White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // 2. Load images in parallel (instant if preloaded)
  const [logoImg, badgeImg] = await Promise.all([
    loadImageSafe(logoSrc),
    loadImageSafe(badgeSrc),
  ]);

  // 3. Outer Diploma Border (.diploma-outer)
  const ox = 60;
  const oy = 60;
  const ow = W - 120;
  const oh = H - 120;
  const or = 56;

  ctx.save();
  roundRectPath(ctx, ox, oy, ow, oh, or);
  ctx.clip();

  if (theme.outerType === 'stripes') {
    const stripeCanvas = document.createElement('canvas');
    stripeCanvas.width = 120;
    stripeCanvas.height = 120;
    const sctx = stripeCanvas.getContext('2d')!;
    sctx.fillStyle = '#FFF0F6';
    sctx.fillRect(0, 0, 120, 120);
    sctx.save();
    sctx.translate(60, 60);
    sctx.rotate(-Math.PI / 4);
    const colors = ['#FF1493', '#FF85C0', '#FFF0F6'];
    const band = 40;
    for (let i = -6; i <= 6; i++) {
      sctx.fillStyle = colors[((i % 3) + 3) % 3];
      sctx.fillRect(-200, i * band, 400, band);
    }
    sctx.restore();
    const pattern = ctx.createPattern(stripeCanvas, 'repeat');
    ctx.fillStyle = pattern || '#FF1493';
    ctx.fillRect(ox, oy, ow, oh);
  } else {
    const outerGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
    for (const [stop, color] of theme.outerStops) {
      outerGrad.addColorStop(stop, color);
    }
    ctx.fillStyle = outerGrad;
    ctx.fillRect(ox, oy, ow, oh);
  }
  ctx.restore();

  // 4. Inner Diploma Card (.diploma-inner)
  const borderThickness = 16;
  const ix = ox + borderThickness;
  const iy = oy + borderThickness;
  const iw = ow - borderThickness * 2;
  const ih = oh - borderThickness * 2;
  const ir = 42;

  ctx.save();
  roundRectPath(ctx, ix, iy, iw, ih, ir);
  ctx.clip();

  const innerGrad = ctx.createLinearGradient(ix, iy, ix, iy + ih);
  innerGrad.addColorStop(0, theme.innerBg[0]);
  innerGrad.addColorStop(1, theme.innerBg[1]);
  ctx.fillStyle = innerGrad;
  ctx.fillRect(ix, iy, iw, ih);

  // 5. Institutional Watermark in Center (compatible with iOS Safari without relying on ctx.filter)
  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.055;
    const wmRadius = 420;
    ctx.beginPath();
    ctx.arc(cx, H / 2, wmRadius, 0, Math.PI * 2);
    ctx.strokeStyle = theme.textPrimary;
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, H / 2, wmRadius - 18, 0, Math.PI * 2);
    ctx.clip();
    try {
      if ('filter' in ctx) {
        ctx.filter = 'grayscale(100%) contrast(125%)';
      }
    } catch {
      // Ignore on older mobile WebKit
    }
    ctx.drawImage(logoImg, cx - wmRadius + 18, H / 2 - wmRadius + 18, (wmRadius - 18) * 2, (wmRadius - 18) * 2);
    ctx.restore();
  }

  // 6. Theme Corner Ornaments
  drawThemeOrnaments(ctx, themeKey, theme, ix, iy, iw, ih);

  // 7. Inner Frames (.diploma-frame-1 & .diploma-frame-2)
  ctx.save();
  ctx.strokeStyle = theme.frame1Color;
  ctx.lineWidth = 5;
  ctx.setLineDash(theme.frame1Dash);
  roundRectPath(ctx, ix + 34, iy + 34, iw - 68, ih - 68, 30);
  ctx.stroke();

  ctx.strokeStyle = theme.frame2Color;
  ctx.lineWidth = 3.8;
  ctx.setLineDash(theme.frame2Dash);
  roundRectPath(ctx, ix + 48, iy + 48, iw - 96, ih - 96, 22);
  ctx.stroke();
  ctx.restore();

  // =========================================================================
  // 8. HEADER BLOCK
  // =========================================================================
  let headerY = iy + 96;

  // Logos Row: [GDG Logo] [GDG on Campus / Universidad de Huelva] | [Badge Image]
  const logoBoxSize = 132;
  const badgeBoxSize = 136;
  ctx.font = `700 38px ${theme.fontMain}`;
  const gdgTitleW = ctx.measureText('GDG on Campus').width;
  ctx.font = `600 29px ${theme.fontMain}`;
  const gdgSubW = ctx.measureText('Universidad de Huelva').width;
  const textColW = Math.max(gdgTitleW, gdgSubW);

  const gapLogoText = 28;
  const gapDivider = 48;
  const totalLogosRowW = logoBoxSize + gapLogoText + textColW + gapDivider * 2 + 4 + badgeBoxSize;
  const rowStartX = cx - totalLogosRowW / 2;

  // GDG Logo Box
  ctx.save();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 28);
  ctx.clip();
  if (logoImg) {
    ctx.drawImage(logoImg, rowStartX, headerY, logoBoxSize, logoBoxSize);
  }
  ctx.restore();

  // GDG Text
  const textX = rowStartX + logoBoxSize + gapLogoText;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 38px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus', textX, headerY + 60);

  ctx.fillStyle = theme.accentText;
  ctx.font = `600 29px ${theme.fontMain}`;
  ctx.fillText('Universidad de Huelva', textX, headerY + 100);

  // Vertical Separator
  const divX = textX + textColW + gapDivider;
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(divX, headerY + 18);
  ctx.lineTo(divX, headerY + logoBoxSize - 18);
  ctx.stroke();
  ctx.restore();

  // Badge Image
  const badgeX = divX + gapDivider;
  if (badgeImg) {
    ctx.drawImage(badgeImg, badgeX, headerY - 2, badgeBoxSize, badgeBoxSize);
  }

  headerY += logoBoxSize + 36;

  // Role Pill
  const roleText = (data.role || '').trim().toUpperCase();
  ctx.font = `700 26px ${theme.fontMain}`;
  const roleTextW = ctx.measureText(roleText).width + roleText.length * 1.8;
  const rolePillW = roleTextW + 76;
  const rolePillH = 58;
  ctx.save();
  roundRectPath(ctx, cx - rolePillW / 2, headerY, rolePillW, rolePillH, rolePillH / 2);
  ctx.fillStyle = theme.pillBg;
  ctx.fill();
  ctx.strokeStyle = theme.pillBorder;
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.fillStyle = theme.pillText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(roleText, cx, headerY + rolePillH / 2 + 1);
  ctx.restore();

  headerY += rolePillH + 26;

  // Badge Title (H1)
  const titleUpper = (data.badgeName || '').toUpperCase();
  let titleFontSize = 62;
  ctx.font = `700 ${titleFontSize}px ${theme.fontDisplay}`;
  while (ctx.measureText(titleUpper).width > 2350 && titleFontSize > 42) {
    titleFontSize -= 2;
    ctx.font = `700 ${titleFontSize}px ${theme.fontDisplay}`;
  }
  const titleLines = wrapTextLines(ctx, titleUpper, 2350);
  ctx.fillStyle = theme.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const line of titleLines) {
    ctx.fillText(line, cx, headerY);
    headerY += titleFontSize * 1.18;
  }

  headerY += 8;

  // Issue Date
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 32px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(data.issueDate || '', cx, headerY);
  headerY += 42;

  // =========================================================================
  // 9. FOOTER BLOCK (Fixed at bottom of inner diploma)
  // =========================================================================
  const footerTopY = iy + ih - 295;
  const footerContentCy = footerTopY + 125;

  // Top border line of footer
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ix + 115, footerTopY);
  ctx.lineTo(ix + iw - 115, footerTopY);
  ctx.stroke();
  ctx.restore();

  // Center QR Card
  const qrCardSize = 186;
  const qrCardX = cx - qrCardSize / 2;
  const qrCardY = footerContentCy - qrCardSize / 2;
  ctx.save();
  roundRectPath(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.stroke();

  const qrPad = 16;
  const qrInnerSize = qrCardSize - qrPad * 2;
  const qrTotalModules = (data.qrSize || 33) + 2;
  const scale = qrInnerSize / qrTotalModules;
  ctx.translate(qrCardX + qrPad, qrCardY + qrPad);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, qrTotalModules, qrTotalModules);
  ctx.translate(1, 1);
  ctx.fillStyle = '#111827';
  ctx.fill(new Path2D(data.qrPath));
  ctx.restore();

  // Left Footer Column (Institutional Signature)
  const leftColCx = ix + (cx - qrCardSize / 2 - ix) / 2 + 25;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = theme.accentText;
  ctx.font = `700 28px ${theme.fontMain}`;
  ctx.fillText('GDG ON CAMPUS UHU', leftColCx, footerContentCy - 34);

  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(leftColCx - 210, footerContentCy - 12);
  ctx.lineTo(leftColCx + 210, footerContentCy - 12);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 28px ${theme.fontMain}`;
  ctx.fillText('Universidad de Huelva', leftColCx, footerContentCy + 28);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 25px ${theme.fontMain}`;
  ctx.fillText('Comunidad Oficial de Desarrolladores', leftColCx, footerContentCy + 64);

  // Right Footer Column (Cryptographic ID)
  const rightColCx = cx + qrCardSize / 2 + (ix + iw - (cx + qrCardSize / 2)) / 2 - 25;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `600 27px "Google Sans Mono", monospace`;
  ctx.fillText(data.assertionId || '', rightColCx, footerContentCy - 34);

  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(rightColCx - 210, footerContentCy - 12);
  ctx.lineTo(rightColCx + 210, footerContentCy - 12);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 28px ${theme.fontMain}`;
  ctx.fillText('Credencial Criptográfica', rightColCx, footerContentCy + 28);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 25px ${theme.fontMain}`;
  ctx.fillText('Verificación SHA-256', rightColCx, footerContentCy + 64);

  // =========================================================================
  // 10. CENTRAL BODY BLOCK (Vertically centered between Header & Footer)
  // =========================================================================
  const recipientName = data.recipientName || '';
  let recipientFontSize = 90;
  ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  while (ctx.measureText(recipientName).width > 2200 && recipientFontSize > 52) {
    recipientFontSize -= 2;
    ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  }
  const recipientWidth = ctx.measureText(recipientName).width;

  ctx.font = `400 35px ${theme.fontMain}`;
  const descLines = wrapTextLines(ctx, descriptionText, 1780);
  const descLineH = 50;

  ctx.font = `400 30px ${theme.fontMain}`;
  const narrativeLines = narrativeText ? wrapTextLines(ctx, narrativeText, 1620) : [];
  const narrativeLineH = 44;

  const hasTags = Array.isArray(data.tags) && data.tags.length > 0;
  const metaBoxH = 162;
  const tagsRowH = hasTags ? 56 : 0;

  const introH = 42;
  const gapIntroName = 20;
  const nameBoxH = recipientFontSize + 28;
  const gapNameDesc = 34;
  const descBlockH = descLines.length * descLineH;
  const narrativeBlockH = narrativeLines.length > 0 ? 16 + narrativeLines.length * narrativeLineH : 0;
  const gapMeta = 36;
  const gapTags = hasTags ? 32 : 0;

  const totalBodyH =
    introH +
    gapIntroName +
    nameBoxH +
    gapNameDesc +
    descBlockH +
    narrativeBlockH +
    gapMeta +
    metaBoxH +
    gapTags +
    tagsRowH;

  const availableSpace = footerTopY - headerY;
  let bodyY = headerY + Math.max(16, (availableSpace - totalBodyH) / 2);

  // Intro line
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `italic 400 36px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Este certificado digital se otorga a', cx, bodyY);
  bodyY += introH + gapIntroName;

  // Recipient Name with Theme Gradient
  ctx.save();
  ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  if (theme.recipientStops.length > 1 && theme.recipientStops[0] !== theme.recipientStops[1]) {
    const nameGrad = ctx.createLinearGradient(cx - recipientWidth / 2, bodyY, cx + recipientWidth / 2, bodyY);
    theme.recipientStops.forEach((col, idx) => {
      nameGrad.addColorStop(idx / (theme.recipientStops.length - 1), col);
    });
    ctx.fillStyle = nameGrad;
  } else {
    ctx.fillStyle = theme.recipientStops[0];
  }
  ctx.fillText(recipientName, cx, bodyY);
  ctx.restore();

  bodyY += recipientFontSize + 24;

  // Recipient Underline + 4-Color Google Bar
  const underlineW = Math.max(1020, recipientWidth + 180);
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(cx - underlineW / 2, bodyY);
  ctx.lineTo(cx + underlineW / 2, bodyY);
  ctx.stroke();

  const barW = 310;
  const barH = 10;
  const barX = cx - barW / 2;
  const barY = bodyY - barH / 2;
  roundRectPath(ctx, barX, barY, barW, barH, 5);
  ctx.clip();
  const gColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = gColors[i];
    ctx.fillRect(barX + (barW / 4) * i, barY, barW / 4 + 1, barH);
  }
  ctx.restore();

  bodyY += gapNameDesc;

  // Description
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `400 35px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const line of descLines) {
    ctx.fillText(line, cx, bodyY);
    bodyY += descLineH;
  }

  // Criteria Narrative
  if (narrativeLines.length > 0) {
    bodyY += 16;
    ctx.fillStyle = theme.textSecondary;
    ctx.font = `400 30px ${theme.fontMain}`;
    for (const line of narrativeLines) {
      ctx.fillText(line, cx, bodyY);
      bodyY += narrativeLineH;
    }
  }

  bodyY += gapMeta;

  // Metadata 3-Column Box (.diploma-meta-box)
  const metaW = 1620;
  const metaX = cx - metaW / 2;
  ctx.save();
  roundRectPath(ctx, metaX, bodyY, metaW, metaBoxH, 36);
  ctx.fillStyle = theme.metaBg;
  ctx.fill();
  ctx.strokeStyle = theme.metaBorder;
  ctx.lineWidth = 4.5;
  ctx.stroke();

  const colW = metaW / 3;
  // Vertical dividers inside metadata box
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(metaX + colW, bodyY + 30);
  ctx.lineTo(metaX + colW, bodyY + metaBoxH - 30);
  ctx.moveTo(metaX + colW * 2, bodyY + 30);
  ctx.lineTo(metaX + colW * 2, bodyY + metaBoxH - 30);
  ctx.stroke();

  const labelY = bodyY + 42;
  const valY = bodyY + 92;

  // Col 1: Rol Acreditado
  const col1Cx = metaX + colW * 0.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 24px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('ROL ACREDITADO', col1Cx, labelY);

  let roleMetaFontSize = 32;
  ctx.font = `700 ${roleMetaFontSize}px ${theme.fontMain}`;
  while (ctx.measureText(data.role || '').width > colW - 44 && roleMetaFontSize > 20) {
    roleMetaFontSize -= 1;
    ctx.font = `700 ${roleMetaFontSize}px ${theme.fontMain}`;
  }
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(data.role || '', col1Cx, valY);

  // Col 2: Entidad Emisora
  const col2Cx = metaX + colW * 1.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 24px ${theme.fontMain}`;
  ctx.fillText('ENTIDAD EMISORA', col2Cx, labelY);

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 32px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus UHU', col2Cx, valY);

  // Col 3: Estándar Open Badges 2.0
  const col3Cx = metaX + colW * 2.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 24px ${theme.fontMain}`;
  ctx.fillText('ESTÁNDAR', col3Cx, labelY);

  ctx.font = `700 32px ${theme.fontMain}`;
  const stdText = 'Open Badges 2.0';
  const stdTextW = ctx.measureText(stdText).width;
  const iconR = 16;
  const totalStdW = iconR * 2 + 14 + stdTextW;
  const stdStartX = col3Cx - totalStdW / 2;

  ctx.fillStyle = '#34A853';
  ctx.beginPath();
  ctx.arc(stdStartX + iconR, valY + 18, iconR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(stdStartX + iconR - 7, valY + 18);
  ctx.lineTo(stdStartX + iconR - 2, valY + 24);
  ctx.lineTo(stdStartX + iconR + 8, valY + 12);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#34A853';
  ctx.fillText(stdText, stdStartX + iconR * 2 + 14, valY);
  ctx.restore();

  bodyY += metaBoxH;

  // Competency Tags
  if (hasTags) {
    bodyY += gapTags;
    ctx.font = `600 26px ${theme.fontMain}`;
    const tagGap = 18;
    const tagPadX = 32;
    const tagH = 54;
    const tagItems = data.tags.map((t) => {
      const label = `#${t}`;
      const w = ctx.measureText(label).width + tagPadX * 2;
      return { label, w };
    });
    const totalTagsW = tagItems.reduce((acc, item) => acc + item.w, 0) + tagGap * (tagItems.length - 1);
    let curTagX = cx - totalTagsW / 2;

    for (const item of tagItems) {
      ctx.save();
      roundRectPath(ctx, curTagX, bodyY, item.w, tagH, tagH / 2);
      ctx.fillStyle = theme.pillBg;
      ctx.fill();
      ctx.strokeStyle = theme.pillBorder;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = theme.pillText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, curTagX + item.w / 2, bodyY + tagH / 2 + 1);
      ctx.restore();
      curTagX += item.w + tagGap;
    }
  }

  ctx.restore(); // end .diploma-inner clip
  return canvas;
}

/**
 * Empaqueta un Canvas JPEG en un documento PDF 1.4 válido en formato A4 Horizontal (841.89 x 595.28 pt)
 * con enlace interactivo de verificación sobre el código QR.
 */
function buildPdfFromJpegDataUrl(
  jpegDataUrl: string,
  imgWidth: number,
  imgHeight: number,
  certUrl: string
): Uint8Array {
  const base64 = jpegDataUrl.split(',')[1];
  const binaryStr = atob(base64);
  const jpegBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    jpegBytes[i] = binaryStr.charCodeAt(i);
  }

  const pageW = 841.89; // 297mm en puntos PDF (72 pt/in)
  const pageH = 595.28; // 210mm en puntos PDF

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushStr = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const startObj = (id: number) => {
    offsets[id] = byteLength;
    pushStr(`${id} 0 obj\n`);
  };

  const endObj = () => {
    pushStr('\nendobj\n');
  };

  // Header PDF 1.4 con comentario binario
  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // 1 0 obj: Catalog
  startObj(1);
  pushStr('<< /Type /Catalog /Pages 2 0 R >>');
  endObj();

  // 2 0 obj: Pages
  startObj(2);
  pushStr('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  endObj();

  // 3 0 obj: Page (A4 Landscape + Link Annotation sobre el QR)
  startObj(3);
  pushStr(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R /Annots [6 0 R] >>`
  );
  endObj();

  // 4 0 obj: XObject Image (DCTDecode = JPEG nativo)
  startObj(4);
  pushStr(
    `<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushStr('\nendstream');
  endObj();

  // 5 0 obj: Content Stream para dibujar la imagen a página completa
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  startObj(5);
  pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream`);
  endObj();

  // 6 0 obj: Anotación de enlace clicable sobre el código QR en el pie del diploma
  const safeUri = (certUrl || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  startObj(6);
  pushStr(
    `<< /Type /Annot /Subtype /Link /Rect [390 48 452 110] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${safeUri}) >> >>`
  );
  endObj();

  // Tabla XREF
  const xrefOffset = byteLength;
  const totalObjs = 7;
  pushStr(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let i = 1; i < totalObjs; i++) {
    const off = String(offsets[i]).padStart(10, '0');
    pushStr(`${off} 00000 n \n`);
  }

  // Trailer
  pushStr(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const out = new Uint8Array(byteLength);
  let pos = 0;
  for (const chunk of chunks) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  return out;
}

export async function downloadCertificatePdf(data: CertificatePdfData, themeKey: string): Promise<void> {
  const canvas = await renderCertificateCanvas(data, themeKey);
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.96);
  const pdfBytes = buildPdfFromJpegDataUrl(jpegDataUrl, canvas.width, canvas.height, data.certUrl);

  const cleanName = (data.recipientName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const filename = `Certificado-GDGoC-UHU-${cleanName || data.assertionId}.pdf`;

  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (link.parentNode) {
      document.body.removeChild(link);
    }
  }, 500);

  // En móviles (iOS Safari / Android Chrome) el sistema muestra un diálogo de confirmación
  // antes de leer el Blob URL; mantenemos la URL viva 60s para que nunca falle la descarga en móvil.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
