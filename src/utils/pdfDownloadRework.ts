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
  dateGlow?: string;
  recipientStops: string[];
  borderColor: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  metaBg: string;
  metaBorder: string;
  fontMain: string;
  fontDisplay: string;
  barColors: [string, string, string, string];
}

const THEMES: Record<string, ThemeColors> = {
  google: {
    outerType: 'gradient',
    outerStops: [[0, '#4285F4'], [0.33, '#EA4335'], [0.66, '#FBBC04'], [1, '#34A853']],
    innerBg: ['#FFFFFF', '#F6F9FF'],
    frame1Color: '#DADCE0',
    frame1Dash: [],
    frame2Color: '#AECBFA',
    frame2Dash: [18, 14],
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    accentText: '#1967D2',
    recipientStops: ['#1967D2', '#202124', '#34A853'],
    borderColor: '#DADCE0',
    pillBg: '#E8F0FE',
    pillBorder: '#AECBFA',
    pillText: '#1967D2',
    metaBg: '#F8F9FA',
    metaBorder: '#DADCE0',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    barColors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
  },
  hardware: {
    outerType: 'gradient',
    outerStops: [[0, '#00E676'], [0.35, '#D4AF37'], [0.7, '#00BFA5'], [1, '#FFD54F']],
    innerBg: ['#04160E', '#072417'],
    frame1Color: 'rgba(212, 175, 55, 0.65)',
    frame1Dash: [],
    frame2Color: 'rgba(0, 230, 118, 0.5)',
    frame2Dash: [20, 12],
    textPrimary: '#ECFDF5',
    textSecondary: '#86EFAC',
    accentText: '#FFD54F',
    dateGlow: 'rgba(0, 230, 118, 0.75)',
    recipientStops: ['#00E676', '#FFD54F', '#00BFA5'],
    borderColor: 'rgba(212, 175, 55, 0.5)',
    pillBg: 'rgba(0, 230, 118, 0.16)',
    pillBorder: '#D4AF37',
    pillText: '#FFD54F',
    metaBg: 'rgba(6, 36, 22, 0.94)',
    metaBorder: 'rgba(212, 175, 55, 0.55)',
    fontMain: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Orbitron", "Space Grotesk", sans-serif',
    barColors: ['#00E676', '#D4AF37', '#00BFA5', '#FFD54F'],
  },
  cyberpunk: {
    outerType: 'gradient',
    outerStops: [[0, '#FCEE0A'], [0.5, '#FF0055'], [1, '#00F0FF']],
    innerBg: ['#07040E', '#110820'],
    frame1Color: '#FCEE0A',
    frame1Dash: [],
    frame2Color: '#FF0055',
    frame2Dash: [24, 10],
    textPrimary: '#FFFFFF',
    textSecondary: '#00F0FF',
    accentText: '#FCEE0A',
    dateGlow: 'rgba(255, 0, 85, 0.85)',
    recipientStops: ['#FCEE0A', '#FF0055', '#00F0FF'],
    borderColor: 'rgba(252, 238, 10, 0.65)',
    pillBg: '#FCEE0A',
    pillBorder: '#FF0055',
    pillText: '#07040E',
    metaBg: 'rgba(18, 9, 34, 0.94)',
    metaBorder: '#FF0055',
    fontMain: '"Chakra Petch", "Space Grotesk", sans-serif',
    fontDisplay: '"Orbitron", "Chakra Petch", sans-serif',
    barColors: ['#FCEE0A', '#FF0055', '#00F0FF', '#FCEE0A'],
  },
  piscina: {
    outerType: 'gradient',
    outerStops: [[0, '#00F2FE'], [0.33, '#4FACFE'], [0.66, '#00E5FF'], [1, '#0284C7']],
    innerBg: ['#FFFFFF', '#CCFBF1'],
    frame1Color: 'rgba(0, 188, 212, 0.65)',
    frame1Dash: [],
    frame2Color: 'rgba(2, 132, 199, 0.45)',
    frame2Dash: [18, 14],
    textPrimary: '#002B3D',
    textSecondary: '#00587A',
    accentText: '#0284C7',
    recipientStops: ['#0284C7', '#00B4DB', '#0D9488'],
    borderColor: 'rgba(0, 188, 212, 0.55)',
    pillBg: '#E0F7FA',
    pillBorder: '#00BCD4',
    pillText: '#006064',
    metaBg: 'rgba(255, 255, 255, 0.92)',
    metaBorder: 'rgba(0, 188, 212, 0.55)',
    fontMain: '"Plus Jakarta Sans", "Google Sans", sans-serif',
    fontDisplay: '"Google Sans Display", "Plus Jakarta Sans", sans-serif',
    barColors: ['#00F2FE', '#00B4DB', '#0284C7', '#0D9488'],
  },
  nieve: {
    outerType: 'gradient',
    outerStops: [[0, '#FFFFFF'], [0.33, '#7DD3FC'], [0.66, '#38BDF8'], [1, '#818CF8']],
    innerBg: ['#061326', '#0E2749'],
    frame1Color: 'rgba(224, 242, 254, 0.65)',
    frame1Dash: [],
    frame2Color: 'rgba(125, 211, 252, 0.48)',
    frame2Dash: [18, 14],
    textPrimary: '#F0F9FF',
    textSecondary: '#BAE6FD',
    accentText: '#7DD3FC',
    dateGlow: 'rgba(125, 211, 252, 0.7)',
    recipientStops: ['#FFFFFF', '#7DD3FC', '#E0F2FE'],
    borderColor: 'rgba(186, 230, 253, 0.5)',
    pillBg: 'rgba(224, 242, 254, 0.2)',
    pillBorder: 'rgba(255, 255, 255, 0.75)',
    pillText: '#FFFFFF',
    metaBg: 'rgba(12, 34, 62, 0.9)',
    metaBorder: 'rgba(186, 230, 253, 0.55)',
    fontMain: '"Plus Jakarta Sans", "Google Sans", sans-serif',
    fontDisplay: '"Google Sans Display", "Plus Jakarta Sans", sans-serif',
    barColors: ['#FFFFFF', '#7DD3FC', '#38BDF8', '#818CF8'],
  },
  caramelos: {
    outerType: 'stripes',
    outerStops: [[0, '#FF1493'], [0.25, '#FF8C00'], [0.5, '#FFD700'], [0.75, '#00E676'], [1, '#8B5CF6']],
    innerBg: ['#FFFDF9', '#FFE4F2'],
    frame1Color: '#EC4899',
    frame1Dash: [20, 14],
    frame2Color: '#F59E0B',
    frame2Dash: [8, 10],
    textPrimary: '#831843',
    textSecondary: '#BE185D',
    accentText: '#D97706',
    recipientStops: ['#EC4899', '#F59E0B', '#8B5CF6'],
    borderColor: '#F472B6',
    pillBg: '#FFF0F7',
    pillBorder: '#EC4899',
    pillText: '#9D174D',
    metaBg: 'rgba(255, 240, 248, 0.94)',
    metaBorder: '#F472B6',
    fontMain: '"Fredoka", "Plus Jakarta Sans", sans-serif',
    fontDisplay: '"Fredoka", "Google Sans Display", sans-serif',
    barColors: ['#FF1493', '#F59E0B', '#00E5FF', '#8B5CF6'],
  },
  aurora: {
    outerType: 'gradient',
    outerStops: [[0, '#00FFAA'], [0.35, '#38BDF8'], [0.7, '#A855F7'], [1, '#EC4899']],
    innerBg: ['#030614', '#09102C'],
    frame1Color: 'rgba(0, 255, 170, 0.6)',
    frame1Dash: [],
    frame2Color: 'rgba(168, 85, 247, 0.55)',
    frame2Dash: [18, 14],
    textPrimary: '#F8FAFC',
    textSecondary: '#A5F3FC',
    accentText: '#00FFAA',
    dateGlow: 'rgba(0, 255, 170, 0.75)',
    recipientStops: ['#00FFAA', '#38BDF8', '#C084FC'],
    borderColor: 'rgba(0, 255, 170, 0.45)',
    pillBg: 'rgba(0, 255, 170, 0.16)',
    pillBorder: '#00FFAA',
    pillText: '#00FFAA',
    metaBg: 'rgba(10, 16, 44, 0.92)',
    metaBorder: 'rgba(168, 85, 247, 0.55)',
    fontMain: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Space Grotesk", "Plus Jakarta Sans", sans-serif',
    barColors: ['#00FFAA', '#38BDF8', '#A855F7', '#EC4899'],
  },
  blueprint: {
    outerType: 'gradient',
    outerStops: [[0, '#1D4ED8'], [0.5, '#60A5FA'], [1, '#1E3A8A']],
    innerBg: ['#07193E', '#0D2B64'],
    frame1Color: '#93C5FD',
    frame1Dash: [],
    frame2Color: '#60A5FA',
    frame2Dash: [16, 10],
    textPrimary: '#FFFFFF',
    textSecondary: '#93C5FD',
    accentText: '#60A5FA',
    recipientStops: ['#FFFFFF', '#93C5FD', '#FFFFFF'],
    borderColor: 'rgba(147, 197, 253, 0.65)',
    pillBg: 'rgba(30, 64, 175, 0.65)',
    pillBorder: '#93C5FD',
    pillText: '#FFFFFF',
    metaBg: 'rgba(7, 25, 62, 0.92)',
    metaBorder: '#60A5FA',
    fontMain: '"Share Tech Mono", "JetBrains Mono", monospace',
    fontDisplay: '"Share Tech Mono", "JetBrains Mono", monospace',
    barColors: ['#60A5FA', '#EFF6FF', '#3B82F6', '#93C5FD'],
  },
  antiguo: {
    outerType: 'gradient',
    outerStops: [[0, '#1B365D'], [0.35, '#D4AF37'], [0.7, '#9A3412'], [1, '#D4AF37']],
    innerBg: ['#FAF5E8', '#EFE2C6'],
    frame1Color: '#B45309',
    frame1Dash: [],
    frame2Color: '#1B365D',
    frame2Dash: [16, 12],
    textPrimary: '#1C1610',
    textSecondary: '#5C4428',
    accentText: '#92400E',
    recipientStops: ['#1B365D', '#B45309', '#78350F'],
    borderColor: '#D4AF37',
    pillBg: '#FDF6E2',
    pillBorder: '#D4AF37',
    pillText: '#92400E',
    metaBg: 'rgba(253, 248, 235, 0.94)',
    metaBorder: '#D4AF37',
    fontMain: '"Plus Jakarta Sans", Georgia, serif',
    fontDisplay: '"Cinzel", Georgia, serif',
    barColors: ['#1B365D', '#D4AF37', '#9A3412', '#D4AF37'],
  },
  japon: {
    outerType: 'gradient',
    outerStops: [[0, '#C82829'], [0.5, '#D4AF37'], [1, '#1C1917']],
    innerBg: ['#FDFBF7', '#F5ECE0'],
    frame1Color: '#C82829',
    frame1Dash: [],
    frame2Color: '#D4AF37',
    frame2Dash: [18, 12],
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    accentText: '#C82829',
    recipientStops: ['#1C1917', '#C82829', '#78350F'],
    borderColor: 'rgba(200, 40, 41, 0.5)',
    pillBg: '#FFF1F2',
    pillBorder: '#C82829',
    pillText: '#9F1239',
    metaBg: 'rgba(255, 252, 247, 0.94)',
    metaBorder: 'rgba(200, 40, 41, 0.5)',
    fontMain: '"Plus Jakarta Sans", serif',
    fontDisplay: '"Shippori Mincho", Georgia, serif',
    barColors: ['#C82829', '#D4AF37', '#1C1917', '#FDA4AF'],
  },
  voynich: {
    outerType: 'gradient',
    outerStops: [[0, '#E11D48'], [0.33, '#F59E0B'], [0.66, '#10B981'], [1, '#6366F1']],
    innerBg: ['#110920', '#1E1038'],
    frame1Color: 'rgba(245, 158, 11, 0.7)',
    frame1Dash: [],
    frame2Color: 'rgba(244, 63, 94, 0.55)',
    frame2Dash: [16, 12],
    textPrimary: '#FFFBEB',
    textSecondary: '#FDE68A',
    accentText: '#FBBF24',
    dateGlow: 'rgba(245, 158, 11, 0.65)',
    recipientStops: ['#FBBF24', '#F43F5E', '#34D399'],
    borderColor: 'rgba(245, 158, 11, 0.55)',
    pillBg: 'rgba(245, 158, 11, 0.2)',
    pillBorder: '#FBBF24',
    pillText: '#FEF3C7',
    metaBg: 'rgba(24, 13, 44, 0.92)',
    metaBorder: 'rgba(245, 158, 11, 0.6)',
    fontMain: '"Plus Jakarta Sans", Georgia, serif',
    fontDisplay: '"Cormorant Garamond", "Cinzel", Georgia, serif',
    barColors: ['#E11D48', '#F59E0B', '#10B981', '#6366F1'],
  },
  mixteca: {
    outerType: 'gradient',
    outerStops: [[0, '#00A86B'], [0.33, '#F59E0B'], [0.66, '#C41E3A'], [1, '#2DD4BF']],
    innerBg: ['#061912', '#0D2E22'],
    frame1Color: '#F59E0B',
    frame1Dash: [],
    frame2Color: '#00A86B',
    frame2Dash: [18, 10],
    textPrimary: '#FEF3C7',
    textSecondary: '#6EE7B7',
    accentText: '#F59E0B',
    dateGlow: 'rgba(16, 185, 129, 0.65)',
    recipientStops: ['#34D399', '#FBBF24', '#2DD4BF'],
    borderColor: 'rgba(245, 158, 11, 0.6)',
    pillBg: 'rgba(0, 168, 107, 0.25)',
    pillBorder: '#F59E0B',
    pillText: '#FCD34D',
    metaBg: 'rgba(8, 32, 23, 0.94)',
    metaBorder: '#F59E0B',
    fontMain: '"Plus Jakarta Sans", sans-serif',
    fontDisplay: '"Plus Jakarta Sans", sans-serif',
    barColors: ['#00A86B', '#F59E0B', '#C41E3A', '#2DD4BF'],
  },
};

THEMES.cyber = THEMES.hardware;

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
          svgText = svgText.replace('<svg', '<svg width="280" height="280"');
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
    // Fallback below
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

export function preloadCertificateAssets(data: CertificatePdfData): void {
  const logoSrc = data.logoUrl || data.logoImage || '/images/gdgoc-uhu-logo.jpg';
  const badgeSrc = data.badgeImageUrl || data.badgeImage || '';
  void loadImageSafe(logoSrc);
  if (badgeSrc) void loadImageSafe(badgeSrc);
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

function drawBespokeThemeCanvasArt(
  ctx: CanvasRenderingContext2D,
  rawKey: string,
  theme: ThemeColors,
  ix: number,
  iy: number,
  iw: number,
  ih: number
) {
  const key = rawKey === 'cyber' ? 'hardware' : rawKey;
  ctx.save();

  if (key === 'google') {
    const orbs: Array<[number, number, number, string]> = [
      [ix + 320, iy + 280, 620, 'rgba(66, 133, 244, 0.14)'],
      [ix + iw - 320, iy + 280, 620, 'rgba(234, 67, 53, 0.12)'],
      [ix + 340, iy + ih - 260, 620, 'rgba(251, 188, 4, 0.14)'],
      [ix + iw - 320, iy + ih - 260, 640, 'rgba(52, 168, 83, 0.14)'],
    ];
    for (const [ox, oy, r, col] of orbs) {
      const g = ctx.createRadialGradient(ox, oy, 10, ox, oy, r);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(ix, iy, iw, ih);
    }
    ctx.globalAlpha = 0.22;
    for (const [cxPos, cyPos, c1, c2] of [
      [ix + 120, iy + 120, '#4285F4', '#EA4335'],
      [ix + iw - 120, iy + 120, '#EA4335', '#FBBC04'],
      [ix + 120, iy + ih - 120, '#FBBC04', '#4285F4'],
      [ix + iw - 120, iy + ih - 120, '#34A853', '#FBBC04'],
    ] as Array<[number, number, string, string]>) {
      ctx.strokeStyle = c1;
      ctx.lineWidth = 10;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, 210, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = c2;
      ctx.lineWidth = 6;
      ctx.setLineDash([20, 16]);
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, 145, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (key === 'hardware') {
    // PCB Grid & Gold/Emerald Circuit Traces + IC Chip
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = ix + 80; x < ix + iw; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, iy); ctx.lineTo(x, iy + ih); ctx.stroke();
    }
    for (let y = iy + 80; y < iy + ih; y += 80) {
      ctx.beginPath(); ctx.moveTo(ix, y); ctx.lineTo(ix + iw, y); ctx.stroke();
    }
    const drawTraces = (startX: number, dir: number) => {
      [380, 680, 1020, 1360].forEach((yo, i) => {
        const y = iy + yo;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(0, 230, 118, 0.42)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + dir * 140, y);
        ctx.lineTo(startX + dir * 200, y + (i % 2 === 0 ? -55 : 55));
        ctx.lineTo(startX + dir * 290, y + (i % 2 === 0 ? -55 : 55));
        ctx.stroke();
        ctx.fillStyle = '#04160E';
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(startX + dir * 290, y + (i % 2 === 0 ? -55 : 55), 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    };
    drawTraces(ix + 50, 1);
    drawTraces(ix + iw - 50, -1);
  } else if (key === 'cyberpunk') {
    // Edgerunners Diagonal Hazard Stripes & HUD Reticles
    ctx.fillStyle = 'rgba(252, 238, 10, 0.12)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(ix + 60 + i * 36, iy + 60);
      ctx.lineTo(ix + 78 + i * 36, iy + 60);
      ctx.lineTo(ix + 58 + i * 36, iy + 96);
      ctx.lineTo(ix + 40 + i * 36, iy + 96);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 5;
    ctx.setLineDash([28, 12, 8, 12]);
    ctx.beginPath();
    ctx.arc(ix + 160, iy + ih - 160, 190, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
    ctx.beginPath();
    ctx.arc(ix + iw - 160, iy + 160, 190, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (key === 'piscina') {
    // Multi-layered rolling ocean waves + water splash crowns
    ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix, iy + ih - 250);
    ctx.bezierCurveTo(ix + iw * 0.28, iy + ih - 350, ix + iw * 0.62, iy + ih - 140, ix + iw, iy + ih - 270);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(2, 132, 199, 0.14)';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix, iy + ih - 165);
    ctx.bezierCurveTo(ix + iw * 0.35, iy + ih - 80, ix + iw * 0.72, iy + ih - 250, ix + iw, iy + ih - 150);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath();
    ctx.fill();

    // Vector Water Droplets & Bubbles
    for (const [bx, by, br] of [
      [ix + 160, iy + 520, 32], [ix + 230, iy + 860, 22], [ix + 150, iy + 1220, 36],
      [ix + iw - 160, iy + 520, 32], [ix + iw - 230, iy + 860, 22], [ix + iw - 150, iy + 1220, 36],
    ]) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.strokeStyle = 'rgba(0, 188, 212, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (key === 'nieve') {
    // Storm clouds, lightning bolts & crystalline frost fractals
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)';
    ctx.lineWidth = 4.5;
    // Left & right lightning bolts in background
    ctx.beginPath();
    ctx.moveTo(ix + 210, iy + 90);
    ctx.lineTo(ix + 155, iy + 270);
    ctx.lineTo(ix + 215, iy + 280);
    ctx.lineTo(ix + 135, iy + 510);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ix + iw - 210, iy + 90);
    ctx.lineTo(ix + iw - 155, iy + 270);
    ctx.lineTo(ix + iw - 215, iy + 280);
    ctx.lineTo(ix + iw - 135, iy + 510);
    ctx.stroke();

    const drawCrystal = (cxPos: number, cyPos: number, r: number) => {
      ctx.save();
      ctx.translate(cxPos, cyPos);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.42)';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -r);
        ctx.moveTo(0, -r * 0.6); ctx.lineTo(-r * 0.25, -r * 0.82);
        ctx.moveTo(0, -r * 0.6); ctx.lineTo(r * 0.25, -r * 0.82);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.restore();
    };
    drawCrystal(ix + 175, iy + 980, 48);
    drawCrystal(ix + iw - 175, iy + 980, 48);
  } else if (key === 'caramelos') {
    // Sweeping Rainbow Arcs + Golden Cauldron Coins in Corners
    const rColors = ['#FF1493', '#FF8C00', '#FFD700', '#00E676', '#00E5FF', '#8B5CF6'];
    ctx.globalAlpha = 0.28;
    rColors.forEach((col, idx) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(ix + 120, iy + ih - 100, 280 - idx * 16, -Math.PI * 0.5, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ix + iw - 120, iy + ih - 100, 280 - idx * 16, Math.PI, Math.PI * 1.5);
      ctx.stroke();
    });
  } else if (key === 'aurora') {
    // Aurora Borealis Glow + Star Constellations
    const g1 = ctx.createRadialGradient(ix + iw * 0.25, iy + 240, 20, ix + iw * 0.25, iy + 240, 850);
    g1.addColorStop(0, 'rgba(0, 255, 170, 0.22)');
    g1.addColorStop(0.5, 'rgba(56, 189, 248, 0.14)');
    g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(ix, iy, iw, ih);

    const g2 = ctx.createRadialGradient(ix + iw * 0.78, iy + ih - 260, 20, ix + iw * 0.78, iy + ih - 260, 850);
    g2.addColorStop(0, 'rgba(168, 85, 247, 0.24)');
    g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(ix, iy, iw, ih);

    ctx.strokeStyle = 'rgba(0, 255, 170, 0.38)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(ix + 120, iy + 320);
    ctx.lineTo(ix + 210, iy + 240);
    ctx.lineTo(ix + 260, iy + 360);
    ctx.lineTo(ix + 170, iy + 460);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (key === 'blueprint') {
    // Millimeter & Centimeter Engineering CAD Grid + Dimension Arrows
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.14)';
    ctx.lineWidth = 1.5;
    for (let x = ix + 60; x < ix + iw; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, iy); ctx.lineTo(x, iy + ih); ctx.stroke();
    }
    for (let y = iy + 60; y < iy + ih; y += 60) {
      ctx.beginPath(); ctx.moveTo(ix, y); ctx.lineTo(ix + iw, y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(147, 197, 253, 0.65)';
    ctx.font = '600 24px "Share Tech Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ISO 2768-m // SCALE 1:1 // A4 LANDSCAPE (297 x 210 mm)', ix + 95, iy + 110);
    ctx.textAlign = 'right';
    ctx.fillText('DWG: GDGOC-UHU-CAD-REV2', ix + iw - 95, iy + 110);
  } else if (key === 'antiguo') {
    // Pyramids & Greek Geometric Columns
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.32)';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.16)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ix + 80, iy + ih - 140);
    ctx.lineTo(ix + 210, iy + ih - 360);
    ctx.lineTo(ix + 340, iy + ih - 140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ix + iw - 340, iy + ih - 140);
    ctx.lineTo(ix + iw - 210, iy + ih - 360);
    ctx.lineTo(ix + iw - 80, iy + ih - 140);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (key === 'japon') {
    // Crimson Rising Sun Circle & Traditional Seigaiha Waves in Corners
    ctx.fillStyle = 'rgba(200, 40, 41, 0.1)';
    ctx.beginPath();
    ctx.arc(ix + iw - 240, iy + 260, 160, 0, Math.PI * 2);
    ctx.fill();

    // Torii silhouette on left margin
    ctx.fillStyle = 'rgba(200, 40, 41, 0.25)';
    ctx.fillRect(ix + 100, iy + 480, 170, 14);
    ctx.fillRect(ix + 118, iy + 510, 134, 10);
    ctx.fillRect(ix + 132, iy + 490, 14, 150);
    ctx.fillRect(ix + 224, iy + 490, 14, 150);
  } else if (key === 'voynich') {
    // Stained-Glass Rose Window & Voynich Astrolabe Rings
    for (const cxPos of [ix + 190, ix + iw - 190]) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.38)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cxPos, iy + ih / 2, 145, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.beginPath();
      ctx.arc(cxPos, iy + ih / 2, 98, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (key === 'mixteca') {
    // Pre-Columbian Step-Fret (Greca) & Jade Solar Rings
    for (const cxPos of [ix + 185, ix + iw - 185]) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cxPos, iy + ih / 2, 135, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 168, 107, 0.5)';
      ctx.beginPath();
      ctx.arc(cxPos, iy + ih / 2, 92, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawDiplomaticFraming(
  ctx: CanvasRenderingContext2D,
  theme: ThemeColors,
  ix: number,
  iy: number,
  iw: number,
  ih: number
) {
  ctx.save();
  const inset = 74;
  const arm = 95;
  ctx.strokeStyle = theme.accentText;
  ctx.lineWidth = 4.5;
  ctx.globalAlpha = 0.6;

  const corners: Array<[number, number, number, number]> = [
    [ix + inset, iy + inset, 1, 1],
    [ix + iw - inset, iy + inset, -1, 1],
    [ix + inset, iy + ih - inset, 1, -1],
    [ix + iw - inset, iy + ih - inset, -1, -1],
  ];

  for (const [cxPos, cyPos, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cxPos, cyPos + dy * arm);
    ctx.lineTo(cxPos, cyPos);
    ctx.lineTo(cxPos + dx * arm, cyPos);
    ctx.stroke();

    ctx.fillStyle = theme.accentText;
    ctx.beginPath();
    ctx.moveTo(cxPos + dx * 18, cyPos + dy * 10);
    ctx.lineTo(cxPos + dx * 26, cyPos + dy * 18);
    ctx.lineTo(cxPos + dx * 18, cyPos + dy * 26);
    ctx.lineTo(cxPos + dx * 10, cyPos + dy * 18);
    ctx.closePath();
    ctx.fill();
  }

  const midY = iy + ih / 2 - 20;
  const sideOffset = 88;
  for (const sideX of [ix + sideOffset, ix + iw - sideOffset]) {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sideX, midY - 220);
    ctx.lineTo(sideX, midY - 45);
    ctx.moveTo(sideX, midY + 45);
    ctx.lineTo(sideX, midY + 220);
    ctx.stroke();

    ctx.globalAlpha = 0.85;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = theme.barColors[i];
      ctx.beginPath();
      ctx.arc(sideX, midY - 27 + i * 18, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
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
      // Ignore font timeout
    }
  }

  const logoSrc = data.logoUrl || data.logoImage || '/images/gdgoc-uhu-logo.jpg';
  const badgeSrc = data.badgeImageUrl || data.badgeImage || '';
  const descriptionText = data.description || data.badgeDescription || '';
  const narrativeText = data.narrative || data.badgeNarrative || '';

  const normalizedKey = themeKey === 'cyber' ? 'hardware' : themeKey;
  const theme = THEMES[normalizedKey] || THEMES.google;
  const W = 2970;
  const H = 2100;
  const cx = W / 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  const [logoImg, badgeImg] = await Promise.all([
    loadImageSafe(logoSrc),
    loadImageSafe(badgeSrc),
  ]);

  const ox = 46;
  const oy = 46;
  const ow = W - 92;
  const oh = H - 92;
  const or = 56;

  ctx.save();
  roundRectPath(ctx, ox, oy, ow, oh, or);
  ctx.clip();

  const outerGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
  for (const [stop, color] of theme.outerStops) {
    outerGrad.addColorStop(stop, color);
  }
  ctx.fillStyle = outerGrad;
  ctx.fillRect(ox, oy, ow, oh);
  ctx.restore();

  const borderThickness = 18;
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

  drawBespokeThemeCanvasArt(ctx, normalizedKey, theme, ix, iy, iw, ih);

  if (logoImg) {
    ctx.save();
    const wmRadius = 470;
    ctx.globalAlpha = 0.075;
    ctx.strokeStyle = theme.accentText;
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.arc(cx, H / 2, wmRadius + 46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = theme.textPrimary;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, H / 2, wmRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, H / 2, wmRadius - 18, 0, Math.PI * 2);
    ctx.clip();
    try {
      if ('filter' in ctx) ctx.filter = 'grayscale(100%) contrast(125%)';
    } catch {
      // Ignore
    }
    ctx.drawImage(logoImg, cx - wmRadius + 18, H / 2 - wmRadius + 18, (wmRadius - 18) * 2, (wmRadius - 18) * 2);
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = theme.frame1Color;
  ctx.lineWidth = 5.5;
  ctx.setLineDash(theme.frame1Dash);
  roundRectPath(ctx, ix + 34, iy + 34, iw - 68, ih - 68, 30);
  ctx.stroke();

  ctx.strokeStyle = theme.frame2Color;
  ctx.lineWidth = 4;
  ctx.setLineDash(theme.frame2Dash);
  roundRectPath(ctx, ix + 50, iy + 50, iw - 100, ih - 100, 22);
  ctx.stroke();
  ctx.restore();

  drawDiplomaticFraming(ctx, theme, ix, iy, iw, ih);

  // HEADER BLOCK
  let headerY = iy + 165;
  const logoBoxSize = 164;
  const badgeBoxSize = 172;
  ctx.font = `700 50px ${theme.fontMain}`;
  const gdgTitleW = ctx.measureText('GDG on Campus').width;
  ctx.font = `600 38px ${theme.fontMain}`;
  const gdgSubW = ctx.measureText('Universidad de Huelva').width;
  const textColW = Math.max(gdgTitleW, gdgSubW);

  const gapLogoText = 34;
  const gapDivider = 56;
  const totalLogosRowW = logoBoxSize + gapLogoText + textColW + gapDivider * 2 + 4 + badgeBoxSize;
  const rowStartX = cx - totalLogosRowW / 2;

  ctx.save();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 34);
  ctx.clip();
  if (logoImg) ctx.drawImage(logoImg, rowStartX, headerY, logoBoxSize, logoBoxSize);
  ctx.restore();

  const textX = rowStartX + logoBoxSize + gapLogoText;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 50px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus', textX, headerY + 74);

  ctx.fillStyle = theme.accentText;
  ctx.font = `600 38px ${theme.fontMain}`;
  ctx.fillText('Universidad de Huelva', textX, headerY + 126);

  const divX = textX + textColW + gapDivider;
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(divX, headerY + 18);
  ctx.lineTo(divX, headerY + logoBoxSize - 18);
  ctx.stroke();
  ctx.restore();

  const badgeX = divX + gapDivider;
  ctx.save();
  ctx.fillStyle = theme.pillBg;
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(badgeX + badgeBoxSize / 2, headerY + logoBoxSize / 2, badgeBoxSize / 2 + 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  if (badgeImg) ctx.drawImage(badgeImg, badgeX, headerY - 4, badgeBoxSize, badgeBoxSize);

  headerY += logoBoxSize + 30;

  // Role Pill
  const roleText = (data.role || '').trim().toUpperCase();
  ctx.font = `700 35px ${theme.fontMain}`;
  const roleTextW = ctx.measureText(roleText).width + roleText.length * 2.2;
  const rolePillW = roleTextW + 104;
  const rolePillH = 74;
  ctx.save();
  roundRectPath(ctx, cx - rolePillW / 2, headerY, rolePillW, rolePillH, rolePillH / 2);
  ctx.fillStyle = theme.pillBg;
  ctx.fill();
  ctx.strokeStyle = theme.pillBorder;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = theme.pillText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(roleText, cx, headerY + rolePillH / 2 + 2);
  ctx.restore();

  headerY += rolePillH + 46;

  // Badge Title
  const titleUpper = (data.badgeName || '').toUpperCase();
  let titleFontSize = 84;
  ctx.font = `700 ${titleFontSize}px ${theme.fontDisplay}`;
  while (ctx.measureText(titleUpper).width > 2420 && titleFontSize > 52) {
    titleFontSize -= 2;
    ctx.font = `700 ${titleFontSize}px ${theme.fontDisplay}`;
  }
  const titleLines = wrapTextLines(ctx, titleUpper, 2420);
  ctx.fillStyle = theme.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const line of titleLines) {
    ctx.fillText(line, cx, headerY);
    headerY += titleFontSize * 1.15;
  }

  headerY += 8;

  // Issue Date (Distinctive styling & glow)
  ctx.save();
  ctx.fillStyle = theme.accentText;
  ctx.font = `600 38px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  if (theme.dateGlow) {
    ctx.shadowColor = theme.dateGlow;
    ctx.shadowBlur = 18;
  }
  ctx.fillText(`Emitido el ${data.issueDate || ''}`, cx, headerY);
  ctx.restore();
  headerY += 52;

  // FOOTER BLOCK
  const footerTopY = iy + ih - 325;
  const footerContentCy = footerTopY + 140;

  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ix + 110, footerTopY);
  ctx.lineTo(ix + iw - 110, footerTopY);
  ctx.stroke();
  ctx.restore();

  const qrCardSize = 216;
  const qrCardX = cx - qrCardSize / 2;
  const qrCardY = footerContentCy - qrCardSize / 2;
  ctx.save();
  roundRectPath(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 32);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 5;
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

  const leftColCx = ix + 110 + (qrCardX - (ix + 110)) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = theme.accentText;
  ctx.font = `700 36px ${theme.fontMain}`;
  ctx.fillText('GDG ON CAMPUS', leftColCx, footerContentCy - 38);

  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(leftColCx - 290, footerContentCy - 12);
  ctx.lineTo(leftColCx + 290, footerContentCy - 12);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 36px ${theme.fontMain}`;
  ctx.fillText('Universidad de Huelva', leftColCx, footerContentCy + 34);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 32px ${theme.fontMain}`;
  ctx.fillText('Comunidad de Desarrolladores', leftColCx, footerContentCy + 78);

  const rightColCx = qrCardX + qrCardSize + (ix + iw - 110 - (qrCardX + qrCardSize)) / 2;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `600 34px "JetBrains Mono", monospace`;
  ctx.fillText(data.assertionId || '', rightColCx, footerContentCy - 38);

  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(rightColCx - 290, footerContentCy - 12);
  ctx.lineTo(rightColCx + 290, footerContentCy - 12);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 36px ${theme.fontMain}`;
  ctx.fillText('Credencial Criptográfica', rightColCx, footerContentCy + 34);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 32px ${theme.fontMain}`;
  ctx.fillText('Verificación SHA-256', rightColCx, footerContentCy + 78);

  // CENTRAL BODY BLOCK
  const recipientName = data.recipientName || '';
  let recipientFontSize = 124;
  ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  while (ctx.measureText(recipientName).width > 2350 && recipientFontSize > 64) {
    recipientFontSize -= 2;
    ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  }
  const recipientWidth = ctx.measureText(recipientName).width;

  ctx.font = `400 46px ${theme.fontMain}`;
  const descLines = wrapTextLines(ctx, descriptionText, 2180);
  const descLineH = 62;

  ctx.font = `400 39px ${theme.fontMain}`;
  const narrativeLines = narrativeText ? wrapTextLines(ctx, narrativeText, 2040) : [];
  const narrativeLineH = 52;

  const hasTags = Array.isArray(data.tags) && data.tags.length > 0;
  const metaBoxH = 204;
  const tagsRowH = hasTags ? 70 : 0;

  const introH = 54;
  let gapIntroName = 18;
  const nameBoxH = recipientFontSize + 28;
  let gapNameDesc = 34;
  const descBlockH = descLines.length * descLineH;
  const narrativeBlockH = narrativeLines.length > 0 ? 16 + narrativeLines.length * narrativeLineH : 0;
  let gapMeta = 36;
  let gapTags = hasTags ? 30 : 0;

  let totalBodyH =
    introH + gapIntroName + nameBoxH + gapNameDesc + descBlockH + narrativeBlockH + gapMeta + metaBoxH + gapTags + tagsRowH;

  const baselineHeaderEnd =
    iy + 76 + logoBoxSize + 30 + rolePillH + 46 + titleLines.length * titleFontSize * 1.15 + 8 + 52;
  const baselineAvailableSpace = footerTopY - baselineHeaderEnd;
  if (totalBodyH > baselineAvailableSpace - 20) {
    const compress = Math.max(0.5, (baselineAvailableSpace - 20) / totalBodyH);
    gapIntroName = Math.round(gapIntroName * compress);
    gapNameDesc = Math.round(gapNameDesc * compress);
    gapMeta = Math.round(gapMeta * compress);
    gapTags = Math.round(gapTags * compress);
    totalBodyH =
      introH + gapIntroName + nameBoxH + gapNameDesc + descBlockH + narrativeBlockH + gapMeta + metaBoxH + gapTags + tagsRowH;
  }

  const baselineBodyY = baselineHeaderEnd + Math.max(10, (baselineAvailableSpace - totalBodyH) / 2);
  let bodyY = Math.max(headerY + 36, baselineBodyY);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `italic 400 48px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Este certificado digital se otorga a', cx, bodyY);
  bodyY += introH + gapIntroName;

  ctx.save();
  ctx.font = `700 ${recipientFontSize}px ${theme.fontDisplay}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  if (theme.recipientStops.length > 1) {
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

  const underlineW = Math.max(1380, recipientWidth + 240);
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - underlineW / 2, bodyY);
  ctx.lineTo(cx + underlineW / 2, bodyY);
  ctx.stroke();

  ctx.fillStyle = theme.accentText;
  for (const endX of [cx - underlineW / 2, cx + underlineW / 2]) {
    ctx.beginPath();
    ctx.arc(endX, bodyY, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const barW = 480;
  const barH = 14;
  const barX = cx - barW / 2;
  const barY = bodyY - barH / 2;
  roundRectPath(ctx, barX, barY, barW, barH, 7);
  ctx.clip();
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = theme.barColors[i];
    ctx.fillRect(barX + (barW / 4) * i, barY, barW / 4 + 1, barH);
  }
  ctx.restore();

  bodyY += gapNameDesc;

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `400 46px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const line of descLines) {
    ctx.fillText(line, cx, bodyY);
    bodyY += descLineH;
  }

  if (narrativeLines.length > 0) {
    bodyY += 16;
    ctx.fillStyle = theme.textSecondary;
    ctx.font = `400 39px ${theme.fontMain}`;
    for (const line of narrativeLines) {
      ctx.fillText(line, cx, bodyY);
      bodyY += narrativeLineH;
    }
  }

  bodyY += gapMeta;

  // Metadata Box
  const metaW = 2160;
  const metaX = cx - metaW / 2;
  ctx.save();
  roundRectPath(ctx, metaX, bodyY, metaW, metaBoxH, 42);
  ctx.fillStyle = theme.metaBg;
  ctx.fill();
  ctx.strokeStyle = theme.metaBorder;
  ctx.lineWidth = 4.5;
  ctx.stroke();

  const colW = metaW / 3;
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(metaX + colW, bodyY + 34);
  ctx.lineTo(metaX + colW, bodyY + metaBoxH - 34);
  ctx.moveTo(metaX + colW * 2, bodyY + 34);
  ctx.lineTo(metaX + colW * 2, bodyY + metaBoxH - 34);
  ctx.stroke();

  const labelY = bodyY + 46;
  const valY = bodyY + 108;

  const col1Cx = metaX + colW * 0.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 31px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('ROL ACREDITADO', col1Cx, labelY);

  let roleMetaFontSize = 42;
  ctx.font = `700 ${roleMetaFontSize}px ${theme.fontMain}`;
  while (ctx.measureText(data.role || '').width > colW - 48 && roleMetaFontSize > 24) {
    roleMetaFontSize -= 1;
    ctx.font = `700 ${roleMetaFontSize}px ${theme.fontMain}`;
  }
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(data.role || '', col1Cx, valY);

  const col2Cx = metaX + colW * 1.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 31px ${theme.fontMain}`;
  ctx.fillText('ENTIDAD EMISORA', col2Cx, labelY);
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 42px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus UHU', col2Cx, valY);

  const col3Cx = metaX + colW * 2.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 31px ${theme.fontMain}`;
  ctx.fillText('ESTÁNDAR OFICIAL', col3Cx, labelY);

  ctx.font = `700 42px ${theme.fontMain}`;
  const stdText = 'Open Badges 2.0';
  const stdTextW = ctx.measureText(stdText).width;
  const iconR = 21;
  const totalStdW = iconR * 2 + 18 + stdTextW;
  const stdStartX = col3Cx - totalStdW / 2;

  ctx.fillStyle = '#34A853';
  ctx.beginPath();
  ctx.arc(stdStartX + iconR, valY + 23, iconR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(stdStartX + iconR - 9, valY + 23);
  ctx.lineTo(stdStartX + iconR - 2, valY + 30);
  ctx.lineTo(stdStartX + iconR + 10, valY + 16);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#34A853';
  ctx.fillText(stdText, stdStartX + iconR * 2 + 18, valY);
  ctx.restore();

  bodyY += metaBoxH;

  if (hasTags) {
    bodyY += gapTags + 36;
    ctx.font = `600 34px ${theme.fontMain}`;
    const tagGap = 22;
    const tagPadX = 44;
    const tagH = 70;
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
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = theme.pillText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, curTagX + item.w / 2, bodyY + tagH / 2 + 2);
      ctx.restore();
      curTagX += item.w + tagGap;
    }
  }

  ctx.restore();
  return canvas;
}

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

  const pageW = 841.89;
  const pageH = 595.28;
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
  const endObj = () => pushStr('\nendobj\n');

  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');
  startObj(1); pushStr('<< /Type /Catalog /Pages 2 0 R >>'); endObj();
  startObj(2); pushStr('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'); endObj();
  startObj(3);
  pushStr(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R /Annots [6 0 R] >>`);
  endObj();
  startObj(4);
  pushStr(`<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  pushBytes(jpegBytes);
  pushStr('\nendstream');
  endObj();
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  startObj(5);
  pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream`);
  endObj();
  const safeUri = (certUrl || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  startObj(6);
  pushStr(`<< /Type /Annot /Subtype /Link /Rect [388 44 454 112] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${safeUri}) >> >>`);
  endObj();

  const xrefOffset = byteLength;
  const totalObjs = 7;
  pushStr(`xref\n0 ${totalObjs}\n0000000000 65535 f \n`);
  for (let i = 1; i < totalObjs; i++) {
    pushStr(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  pushStr(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const out = new Uint8Array(byteLength);
  let pos = 0;
  for (const chunk of chunks) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  return out;
}

export async function downloadCertificatePdfRework(data: CertificatePdfData, themeKey: string): Promise<void> {
  const canvas = await renderCertificateCanvas(data, themeKey);
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.96);
  const pdfBytes = buildPdfFromJpegDataUrl(jpegDataUrl, canvas.width, canvas.height, data.certUrl);

  const cleanName = (data.recipientName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const filename = `Certificado-GDGoC-UHU-${cleanName || data.assertionId}-${themeKey}.pdf`;

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
    if (link.parentNode) document.body.removeChild(link);
  }, 500);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
