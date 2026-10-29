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
  sealPrimary: string;
  sealSecondary: string;
  sealBg: string;
  fontMain: string;
  fontDisplay: string;
  cornerEmojis?: [string, string, string, string];
  sideEmojis?: [string, string, string, string];
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
    innerBg: ['#FFFFFF', '#F8FAFF'],
    frame1Color: '#DADCE0',
    frame1Dash: [],
    frame2Color: '#D2E3FC',
    frame2Dash: [18, 14],
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    accentText: '#1967D2',
    recipientStops: ['#1967D2', '#202124', '#1967D2'],
    borderColor: '#DADCE0',
    pillBg: '#E8F0FE',
    pillBorder: '#AECBFA',
    pillText: '#1967D2',
    metaBg: '#F8F9FA',
    metaBorder: '#DADCE0',
    sealPrimary: '#1967D2',
    sealSecondary: '#34A853',
    sealBg: '#E8F0FE',
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
    innerBg: ['#060A17', '#0B132B'],
    frame1Color: 'rgba(0, 240, 255, 0.5)',
    frame1Dash: [],
    frame2Color: 'rgba(255, 0, 127, 0.45)',
    frame2Dash: [18, 14],
    textPrimary: '#F0F9FF',
    textSecondary: '#94A3B8',
    accentText: '#00F0FF',
    recipientStops: ['#00F0FF', '#FF007F', '#00FF66'],
    borderColor: 'rgba(0, 240, 255, 0.4)',
    pillBg: 'rgba(0, 240, 255, 0.15)',
    pillBorder: '#00F0FF',
    pillText: '#00F0FF',
    metaBg: 'rgba(12, 20, 44, 0.92)',
    metaBorder: 'rgba(0, 240, 255, 0.48)',
    sealPrimary: '#00F0FF',
    sealSecondary: '#FF007F',
    sealBg: 'rgba(0, 240, 255, 0.12)',
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
    innerBg: ['#FFFFFF', '#CCFBF1'],
    frame1Color: 'rgba(0, 188, 212, 0.65)',
    frame1Dash: [],
    frame2Color: 'rgba(2, 132, 199, 0.45)',
    frame2Dash: [18, 14],
    textPrimary: '#002B3D',
    textSecondary: '#00587A',
    accentText: '#0284C7',
    recipientStops: ['#0284C7', '#00B4DB', '#00897B'],
    borderColor: 'rgba(0, 188, 212, 0.55)',
    pillBg: '#E0F7FA',
    pillBorder: '#00BCD4',
    pillText: '#006064',
    metaBg: 'rgba(255, 255, 255, 0.92)',
    metaBorder: 'rgba(0, 188, 212, 0.55)',
    sealPrimary: '#0284C7',
    sealSecondary: '#00BCD4',
    sealBg: '#E0F7FA',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    cornerEmojis: ['🌊', '💦', '🫧', '🌊'],
    sideEmojis: ['🧊', '🛟', '💦', '🫧'],
  },
  nieve: {
    outerType: 'gradient',
    outerStops: [
      [0, '#FFFFFF'],
      [0.33, '#7DD3FC'],
      [0.66, '#38BDF8'],
      [1, '#BAE6FD'],
    ],
    innerBg: ['#071529', '#102C52'],
    frame1Color: 'rgba(224, 242, 254, 0.6)',
    frame1Dash: [],
    frame2Color: 'rgba(125, 211, 252, 0.45)',
    frame2Dash: [18, 14],
    textPrimary: '#F0F9FF',
    textSecondary: '#BAE6FD',
    accentText: '#7DD3FC',
    recipientStops: ['#FFFFFF', '#7DD3FC', '#E0F2FE'],
    borderColor: 'rgba(186, 230, 253, 0.5)',
    pillBg: 'rgba(224, 242, 254, 0.2)',
    pillBorder: 'rgba(255, 255, 255, 0.75)',
    pillText: '#FFFFFF',
    metaBg: 'rgba(14, 36, 66, 0.88)',
    metaBorder: 'rgba(186, 230, 253, 0.55)',
    sealPrimary: '#7DD3FC',
    sealSecondary: '#FFFFFF',
    sealBg: 'rgba(186, 230, 253, 0.16)',
    fontMain: '"Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    fontDisplay: '"Google Sans Display", "Google Sans", "Plus Jakarta Sans", system-ui, sans-serif',
    cornerEmojis: ['❄️', '🌬️', '❆', '❄️'],
    sideEmojis: ['❅', '🥶', '❄️', '❆'],
  },
  caramelos: {
    outerType: 'stripes',
    outerStops: [],
    innerBg: ['#FFF9FC', '#FFD6EB'],
    frame1Color: '#FF4D94',
    frame1Dash: [20, 14],
    frame2Color: '#FF85C0',
    frame2Dash: [8, 10],
    textPrimary: '#880E4F',
    textSecondary: '#C2185B',
    accentText: '#D81B60',
    recipientStops: ['#D81B60', '#FF1493', '#FF69B4'],
    borderColor: '#FF85C0',
    pillBg: '#FFE0F0',
    pillBorder: '#FF1493',
    pillText: '#AD1457',
    metaBg: 'rgba(255, 232, 243, 0.92)',
    metaBorder: '#FF69B4',
    sealPrimary: '#D81B60',
    sealSecondary: '#FF1493',
    sealBg: '#FFE0F0',
    fontMain: '"Fredoka", "Google Sans", system-ui, sans-serif',
    fontDisplay: '"Fredoka", "Google Sans Display", system-ui, sans-serif',
    cornerEmojis: ['🧁', '🍬', '🍩', '🍰'],
    sideEmojis: ['🍭', '🍦', '🍓', '🍒'],
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

/**
 * Dibuja toda la ambientación temática de fondo y márgenes laterales propia de cada uno de los 5 estilos
 * para que el diploma en PDF tenga una riqueza visual completa sin zonas vacías.
 */
function drawThemeAmbientAndOrnaments(
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
    // 1. Orbes suaves de los 4 colores oficiales de Google en las 4 esquinas
    const orbs: Array<[number, number, number, string]> = [
      [ix + 260, iy + 240, 520, 'rgba(66, 133, 244, 0.11)'],
      [ix + iw - 260, iy + 260, 520, 'rgba(234, 67, 53, 0.09)'],
      [ix + 280, iy + ih - 240, 520, 'rgba(251, 188, 4, 0.12)'],
      [ix + iw - 260, iy + ih - 240, 540, 'rgba(52, 168, 83, 0.11)'],
    ];
    for (const [ox, oy, r, col] of orbs) {
      const g = ctx.createRadialGradient(ox, oy, 10, ox, oy, r);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(ix, iy, iw, ih);
    }

    // 2. Patrón geométrico Google Developers (+ y puntos) en los márgenes izquierdo y derecho
    const gColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
    ctx.globalAlpha = 0.22;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 3; col++) {
        const yPos = iy + 360 + row * 195;
        const leftX = ix + 115 + col * 85;
        const rightX = ix + iw - 115 - col * 85;
        const color = gColors[(row + col) % 4];
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        if ((row + col) % 2 === 0) {
          ctx.beginPath();
          ctx.arc(leftX, yPos, 5.5, 0, Math.PI * 2);
          ctx.arc(rightX, yPos, 5.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const s = 8;
          ctx.beginPath();
          ctx.moveTo(leftX - s, yPos);
          ctx.lineTo(leftX + s, yPos);
          ctx.moveTo(leftX, yPos - s);
          ctx.lineTo(leftX, yPos + s);
          ctx.moveTo(rightX - s, yPos);
          ctx.lineTo(rightX + s, yPos);
          ctx.moveTo(rightX, yPos - s);
          ctx.lineTo(rightX, yPos + s);
          ctx.stroke();
        }
      }
    }

    // 3. Aros geométricos en las 4 esquinas
    ctx.globalAlpha = 0.2;
    // Top-left
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 11;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(ix + 110, iy + 110, 230, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#EA4335';
    ctx.lineWidth = 7.5;
    ctx.setLineDash([22, 18]);
    ctx.beginPath();
    ctx.arc(ix + 110, iy + 110, 160, 0, Math.PI * 2);
    ctx.stroke();

    // Top-right
    ctx.strokeStyle = '#EA4335';
    ctx.lineWidth = 9;
    ctx.setLineDash([26, 18]);
    ctx.beginPath();
    ctx.arc(ix + iw - 110, iy + 110, 210, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#FBBC04';
    ctx.lineWidth = 6;
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    ctx.arc(ix + iw - 110, iy + 110, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Bottom-left
    ctx.strokeStyle = '#FBBC04';
    ctx.lineWidth = 9;
    ctx.setLineDash([26, 18]);
    ctx.beginPath();
    ctx.arc(ix + 110, iy + ih - 110, 210, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 6;
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    ctx.arc(ix + 110, iy + ih - 110, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Bottom-right
    ctx.strokeStyle = '#34A853';
    ctx.lineWidth = 11;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(ix + iw - 110, iy + ih - 110, 230, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#FBBC04';
    ctx.lineWidth = 7.5;
    ctx.setLineDash([22, 18]);
    ctx.beginPath();
    ctx.arc(ix + iw - 110, iy + ih - 110, 160, 0, Math.PI * 2);
    ctx.stroke();
  } else if (themeKey === 'cyber') {
    // 1. Resplandores neón cian y magenta
    const g1 = ctx.createRadialGradient(ix + iw * 0.2, iy + 250, 20, ix + iw * 0.2, iy + 250, 750);
    g1.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
    g1.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(ix, iy, iw, ih);

    const g2 = ctx.createRadialGradient(ix + iw * 0.82, iy + ih - 250, 20, ix + iw * 0.82, iy + ih - 250, 750);
    g2.addColorStop(0, 'rgba(255, 0, 127, 0.15)');
    g2.addColorStop(1, 'rgba(255, 0, 127, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(ix, iy, iw, ih);

    // 2. Cuadrícula Cyber (Neon Grid) en todo el fondo
    ctx.save();
    ctx.lineWidth = 1.5;
    const gridStep = 85;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    for (let y = iy + gridStep; y < iy + ih; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(ix, y);
      ctx.lineTo(ix + iw, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.07)';
    for (let x = ix + gridStep; x < ix + iw; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, iy);
      ctx.lineTo(x, iy + ih);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Trazas de circuito tecnológico (PCB) en los márgenes izquierdo y derecho
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
    ctx.fillStyle = '#00F0FF';
    ctx.lineWidth = 3.5;
    const drawCircuit = (startX: number, dir: number) => {
      const ys = [420, 720, 1050, 1340];
      ys.forEach((yOffset, i) => {
        const y = iy + yOffset;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.32)' : 'rgba(255, 0, 127, 0.32)';
        ctx.fillStyle = i % 2 === 0 ? '#00F0FF' : '#FF007F';
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + dir * 120, y);
        ctx.lineTo(startX + dir * 165, y + (i % 2 === 0 ? -45 : 45));
        ctx.lineTo(startX + dir * 240, y + (i % 2 === 0 ? -45 : 45));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(startX + dir * 240, y + (i % 2 === 0 ? -45 : 45), 7, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    drawCircuit(ix + 50, 1);
    drawCircuit(ix + iw - 50, -1);
    ctx.restore();

    // 4. Geometría Cyber en las esquinas + HUD Tokens
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 14]);
    ctx.beginPath();
    ctx.arc(ix + 150, iy + 150, 220, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FF007F';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ix - 60, iy + 360);
    ctx.lineTo(ix + 360, iy - 60);
    ctx.lineTo(ix + 480, iy + 480);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = '#00FF66';
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 14]);
    ctx.beginPath();
    ctx.arc(ix + iw - 150, iy + ih - 150, 220, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ix + iw - 400, iy + ih - 400);
    ctx.lineTo(ix + iw + 60, iy + ih - 240);
    ctx.lineTo(ix + iw - 200, iy + ih + 60);
    ctx.closePath();
    ctx.stroke();

    // Tokens de telemetría Cyber
    ctx.globalAlpha = 0.48;
    ctx.font = '700 24px "Google Sans Mono", monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.textAlign = 'left';
    ctx.fillText('0xFA92_VERIFIED //⚡', ix + 95, iy + 310);
    ctx.fillStyle = '#00FF66';
    ctx.fillText('SHA256::ACTIVE', ix + 95, iy + ih - 320);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#FF007F';
    ctx.fillText('<OPEN_BADGES_2.0 />', ix + iw - 95, iy + 310);
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('[GDG_UHU::CYBER_NODE]', ix + iw - 95, iy + ih - 320);
    ctx.restore();
  } else if (themeKey === 'piscina') {
    // 1. Reflejo solar acuático superior + olas multicapa en la parte superior e inferior
    const sunGlow = ctx.createRadialGradient(ix + iw - 280, iy + 180, 20, ix + iw - 280, iy + 180, 720);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    sunGlow.addColorStop(0.5, 'rgba(128, 222, 234, 0.35)');
    sunGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(ix, iy, iw, ih);

    // Olas inferiores (2 capas suaves)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix, iy + ih - 260);
    ctx.bezierCurveTo(ix + iw * 0.25, iy + ih - 340, ix + iw * 0.55, iy + ih - 160, ix + iw, iy + ih - 280);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix, iy + ih - 170);
    ctx.bezierCurveTo(ix + iw * 0.35, iy + ih - 90, ix + iw * 0.7, iy + ih - 260, ix + iw, iy + ih - 150);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath();
    ctx.fill();

    // Ola superior suave
    ctx.fillStyle = 'rgba(0, 229, 255, 0.14)';
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(ix, iy + 190);
    ctx.bezierCurveTo(ix + iw * 0.3, iy + 270, ix + iw * 0.68, iy + 90, ix + iw, iy + 210);
    ctx.lineTo(ix + iw, iy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Burbujas cristalinas repartidas por los márgenes laterales
    const bubbles: Array<[number, number, number]> = [
      [ix + 150, iy + 460, 28],
      [ix + 250, iy + 630, 18],
      [ix + 130, iy + 860, 38],
      [ix + 230, iy + 1080, 22],
      [ix + 160, iy + 1310, 32],
      [ix + iw - 150, iy + 480, 34],
      [ix + iw - 250, iy + 690, 20],
      [ix + iw - 135, iy + 920, 40],
      [ix + iw - 235, iy + 1140, 24],
      [ix + iw - 155, iy + 1350, 30],
    ];
    ctx.save();
    for (const [bx, by, br] of bubbles) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.strokeStyle = 'rgba(0, 188, 212, 0.55)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Reflejo de la burbuja
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(bx - br * 0.28, by - br * 0.28, br * 0.35, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();
    }
    ctx.restore();
  } else if (themeKey === 'nieve') {
    // 1. Resplandor de Aurora Boreal superior e inferior
    const aurora = ctx.createRadialGradient(ix + iw / 2, iy + 120, 40, ix + iw / 2, iy + 120, 1100);
    aurora.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    aurora.addColorStop(0.5, 'rgba(129, 140, 248, 0.16)');
    aurora.addColorStop(1, 'rgba(16, 44, 82, 0)');
    ctx.fillStyle = aurora;
    ctx.fillRect(ix, iy, iw, ih);

    // 2. Rachas diagonales de viento helado y granizo en los laterales
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
    ctx.lineWidth = 3;
    const gusts: Array<[number, number, number]> = [
      [ix + 80, iy + 380, 340],
      [ix + 110, iy + 780, 290],
      [ix + 70, iy + 1180, 360],
      [ix + iw - 420, iy + 440, 340],
      [ix + iw - 390, iy + 860, 300],
      [ix + iw - 430, iy + 1240, 350],
    ];
    for (const [gx, gy, len] of gusts) {
      const gGrad = ctx.createLinearGradient(gx, gy, gx + len, gy + 40);
      gGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.38)');
      gGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = gGrad;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + len, gy + 40);
      ctx.stroke();
    }

    // Copos vectoriales de cristal de hielo en los márgenes
    const drawCrystal = (cxPos: number, cyPos: number, r: number) => {
      ctx.save();
      ctx.translate(cxPos, cyPos);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(-r * 0.25, -r * 0.8);
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(r * 0.25, -r * 0.8);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.restore();
    };
    drawCrystal(ix + 165, iy + 540, 34);
    drawCrystal(ix + 215, iy + 1020, 26);
    drawCrystal(ix + iw - 165, iy + 560, 34);
    drawCrystal(ix + iw - 215, iy + 1040, 26);
    ctx.restore();
  } else if (themeKey === 'caramelos') {
    // 1. Ondas dulces de glaseado rosa en la parte superior e inferior
    ctx.save();
    ctx.fillStyle = 'rgba(255, 105, 180, 0.14)';
    ctx.beginPath();
    ctx.moveTo(ix, iy);
    ctx.lineTo(ix, iy + 170);
    ctx.bezierCurveTo(ix + iw * 0.25, iy + 250, ix + iw * 0.75, iy + 80, ix + iw, iy + 190);
    ctx.lineTo(ix + iw, iy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 20, 147, 0.12)';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix, iy + ih - 190);
    ctx.bezierCurveTo(ix + iw * 0.3, iy + ih - 270, ix + iw * 0.7, iy + ih - 100, ix + iw, iy + ih - 210);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath();
    ctx.fill();

    // 2. Lluvia abundante de toppings / virutas de colores por los márgenes
    const sprinkleColors = ['#FF1493', '#00E5FF', '#FFD600', '#FF4081', '#7C4DFF', '#00E676'];
    const sprinkles: Array<[number, number, number, string]> = [
      [ix + 130, iy + 360, 0.4, sprinkleColors[0]],
      [ix + 250, iy + 470, -0.5, sprinkleColors[1]],
      [ix + 150, iy + 610, 0.8, sprinkleColors[2]],
      [ix + 280, iy + 760, -0.3, sprinkleColors[3]],
      [ix + 135, iy + 910, 0.5, sprinkleColors[4]],
      [ix + 245, iy + 1090, -0.7, sprinkleColors[5]],
      [ix + 155, iy + 1250, 0.3, sprinkleColors[0]],
      [ix + 265, iy + 1410, -0.4, sprinkleColors[2]],
      [ix + iw - 130, iy + 370, -0.4, sprinkleColors[1]],
      [ix + iw - 250, iy + 490, 0.6, sprinkleColors[3]],
      [ix + iw - 150, iy + 630, -0.7, sprinkleColors[4]],
      [ix + iw - 280, iy + 780, 0.3, sprinkleColors[5]],
      [ix + iw - 135, iy + 930, -0.5, sprinkleColors[0]],
      [ix + iw - 245, iy + 1110, 0.7, sprinkleColors[2]],
      [ix + iw - 155, iy + 1270, -0.3, sprinkleColors[1]],
      [ix + iw - 265, iy + 1420, 0.5, sprinkleColors[4]],
    ];
    ctx.globalAlpha = 0.75;
    for (const [sx, sy, angle, col] of sprinkles) {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      roundRectPath(ctx, -18, -6, 36, 12, 6);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // Emojis temáticos en las 4 esquinas y en los laterales (para Piscina, Nieve y Caramelos)
  if (theme.cornerEmojis) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.font = '96px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textBaseline = 'middle';
    const padX = 115;
    const padY = 120;
    ctx.textAlign = 'left';
    ctx.fillText(theme.cornerEmojis[0], ix + padX, iy + padY);
    ctx.textAlign = 'right';
    ctx.fillText(theme.cornerEmojis[1], ix + iw - padX, iy + padY);
    ctx.textAlign = 'left';
    ctx.fillText(theme.cornerEmojis[2], ix + padX, iy + ih - padY);
    ctx.textAlign = 'right';
    ctx.fillText(theme.cornerEmojis[3], ix + iw - padX, iy + ih - padY);

    if (theme.sideEmojis) {
      ctx.globalAlpha = 0.78;
      ctx.font = '68px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(theme.sideEmojis[0], ix + 105, iy + ih * 0.36);
      ctx.fillText(theme.sideEmojis[1], ix + 105, iy + ih * 0.66);
      ctx.textAlign = 'right';
      ctx.fillText(theme.sideEmojis[2], ix + iw - 105, iy + ih * 0.36);
      ctx.fillText(theme.sideEmojis[3], ix + iw - 105, iy + ih * 0.66);
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Dibuja las esquinas ornamentales diplomáticas y las columnas decorativas laterales
 * que enmarcan el bloque central del certificado.
 */
function drawDiplomaticFraming(
  ctx: CanvasRenderingContext2D,
  theme: ThemeColors,
  ix: number,
  iy: number,
  iw: number,
  ih: number
) {
  ctx.save();

  // Escuadras ornamentales dobles en las 4 esquinas interiores
  const inset = 74;
  const arm = 95;
  ctx.strokeStyle = theme.accentText;
  ctx.lineWidth = 4.5;
  ctx.globalAlpha = 0.55;

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

    // Rombo decorativo en el vértice
    ctx.fillStyle = theme.accentText;
    ctx.beginPath();
    ctx.moveTo(cxPos + dx * 18, cyPos + dy * 10);
    ctx.lineTo(cxPos + dx * 26, cyPos + dy * 18);
    ctx.lineTo(cxPos + dx * 18, cyPos + dy * 26);
    ctx.lineTo(cxPos + dx * 10, cyPos + dy * 18);
    ctx.closePath();
    ctx.fill();
  }

  // Pilares/filigranas verticales en los márgenes izquierdo y derecho a media altura
  const midY = iy + ih / 2 - 20;
  const sideOffset = 88;
  const gColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];

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

    // 4 puntos centrales del pilar lateral
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = gColors[i];
      ctx.beginPath();
      ctx.arc(sideX, midY - 27 + i * 18, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Dibuja el rosetón / sello oficial de verificación ("OPEN BADGES 2.0 · VERIFICADO")
 * en la zona superior derecha del diploma y un medallón institucional en la superior izquierda.
 */
function drawOfficialVerificationSeal(
  ctx: CanvasRenderingContext2D,
  theme: ThemeColors,
  x: number,
  y: number,
  radius: number
) {
  ctx.save();
  ctx.translate(x, y);

  // 1. Borde dentado de roseta (28 puntas)
  const teeth = 28;
  const outerR = radius;
  const innerToothR = radius - 10;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerToothR;
    const angle = (i * Math.PI) / teeth;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = theme.sealBg;
  ctx.fill();
  ctx.strokeStyle = theme.sealPrimary;
  ctx.lineWidth = 4;
  ctx.stroke();

  // 2. Anillo interior doble
  ctx.beginPath();
  ctx.arc(0, 0, radius - 22, 0, Math.PI * 2);
  ctx.strokeStyle = theme.sealPrimary;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius - 32, 0, Math.PI * 2);
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = theme.sealSecondary;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Textos del sello oficial
  ctx.fillStyle = theme.sealPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 18px ${theme.fontMain}`;
  ctx.fillText('OPEN BADGES 2.0', 0, -34);

  // Estrella / Check central
  ctx.fillStyle = '#34A853';
  ctx.beginPath();
  ctx.arc(0, 2, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, 2);
  ctx.lineTo(-2, 9);
  ctx.lineTo(11, -5);
  ctx.stroke();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `800 19px ${theme.fontMain}`;
  ctx.fillText('VERIFICADO', 0, 38);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 14px ${theme.fontMain}`;
  ctx.fillText('GDGoC UHU', 0, 58);

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
  const ox = 46;
  const oy = 46;
  const ow = W - 92;
  const oh = H - 92;
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

  // 5. Ambientación temática rica por estilo + Ornamentos de esquina y laterales
  drawThemeAmbientAndOrnaments(ctx, themeKey, theme, ix, iy, iw, ih);

  // 6. Marca de agua central institucional con anillos concéntricos estilo guilloché
  if (logoImg) {
    ctx.save();
    const wmRadius = 470;
    ctx.globalAlpha = 0.085;
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
      if ('filter' in ctx) {
        ctx.filter = 'grayscale(100%) contrast(125%)';
      }
    } catch {
      // Ignore on older mobile WebKit
    }
    ctx.drawImage(logoImg, cx - wmRadius + 18, H / 2 - wmRadius + 18, (wmRadius - 18) * 2, (wmRadius - 18) * 2);
    ctx.restore();
  }

  // 7. Inner Frames (.diploma-frame-1 & .diploma-frame-2) + Escuadras Diplomáticas
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

  // =========================================================================
  // 9. HEADER BLOCK (Separado del borde superior y desplazado hacia abajo)
  // =========================================================================
  let headerY = iy + 165;

  // Logos Row: [GDG Logo] [GDG on Campus / Universidad de Huelva] | [Badge Image con Halo]
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

  // GDG Logo Box
  ctx.save();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  roundRectPath(ctx, rowStartX, headerY, logoBoxSize, logoBoxSize, 34);
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
  ctx.font = `700 50px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus', textX, headerY + 74);

  ctx.fillStyle = theme.accentText;
  ctx.font = `600 38px ${theme.fontMain}`;
  ctx.fillText('Universidad de Huelva', textX, headerY + 126);

  // Vertical Separator
  const divX = textX + textColW + gapDivider;
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(divX, headerY + 18);
  ctx.lineTo(divX, headerY + logoBoxSize - 18);
  ctx.stroke();
  ctx.restore();

  // Badge Image con medallón / halo suave detrás
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

  if (badgeImg) {
    ctx.drawImage(badgeImg, badgeX, headerY - 4, badgeBoxSize, badgeBoxSize);
  }

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

  // Mayor separación entre el rol acreditado y el nombre de la badge
  headerY += rolePillH + 46;

  // Badge Title (H1)
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

  // Issue Date
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `500 42px ${theme.fontMain}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`Emitido el ${data.issueDate || ''}`, cx, headerY);
  headerY += 52;

  // =========================================================================
  // 10. FOOTER BLOCK (Fixed at bottom of inner diploma)
  // =========================================================================
  const footerTopY = iy + ih - 325;
  const footerContentCy = footerTopY + 140;

  // Top border line of footer
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ix + 110, footerTopY);
  ctx.lineTo(ix + iw - 110, footerTopY);
  ctx.stroke();
  ctx.restore();

  // Center QR Card
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

  // Left Footer Column (Institutional Signature)
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

  // Right Footer Column (Cryptographic ID)
  const rightColCx = qrCardX + qrCardSize + (ix + iw - 110 - (qrCardX + qrCardSize)) / 2;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `600 34px "Google Sans Mono", monospace`;
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

  // =========================================================================
  // 11. CENTRAL BODY BLOCK (Letras más grandes y llenado equilibrado del A4)
  // =========================================================================
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

  // Referencia de posición del cuerpo base (evita empujar hacia abajo el resto de componentes)
  const baselineHeaderEnd =
    iy +
    76 +
    logoBoxSize +
    30 +
    rolePillH +
    46 +
    titleLines.length * titleFontSize * 1.15 +
    8 +
    52;
  const baselineAvailableSpace = footerTopY - baselineHeaderEnd;
  if (totalBodyH > baselineAvailableSpace - 20) {
    const compress = Math.max(0.5, (baselineAvailableSpace - 20) / totalBodyH);
    gapIntroName = Math.round(gapIntroName * compress);
    gapNameDesc = Math.round(gapNameDesc * compress);
    gapMeta = Math.round(gapMeta * compress);
    gapTags = Math.round(gapTags * compress);
    totalBodyH =
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
  }

  // El cuerpo mantiene su cota vertical previa para no ser empujado hacia abajo
  const baselineBodyY = baselineHeaderEnd + Math.max(10, (baselineAvailableSpace - totalBodyH) / 2);
  let bodyY = Math.max(headerY + 36, baselineBodyY);

  // Intro line
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `italic 400 48px ${theme.fontMain}`;
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

  // Recipient Underline + 4-Color Google Bar + Ornamental Ends
  const underlineW = Math.max(1380, recipientWidth + 240);
  ctx.save();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - underlineW / 2, bodyY);
  ctx.lineTo(cx + underlineW / 2, bodyY);
  ctx.stroke();

  // Puntas ornamentales de la línea del nombre
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
  const gColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = gColors[i];
    ctx.fillRect(barX + (barW / 4) * i, barY, barW / 4 + 1, barH);
  }
  ctx.restore();

  bodyY += gapNameDesc;

  // Description
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `400 46px ${theme.fontMain}`;
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
    ctx.font = `400 39px ${theme.fontMain}`;
    for (const line of narrativeLines) {
      ctx.fillText(line, cx, bodyY);
      bodyY += narrativeLineH;
    }
  }

  bodyY += gapMeta;

  // Metadata 3-Column Box (.diploma-meta-box) — más grande y legible
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
  // Vertical dividers inside metadata box
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

  // Col 1: Rol Acreditado
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

  // Col 2: Entidad Emisora
  const col2Cx = metaX + colW * 1.5;
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `700 31px ${theme.fontMain}`;
  ctx.fillText('ENTIDAD EMISORA', col2Cx, labelY);

  ctx.fillStyle = theme.textPrimary;
  ctx.font = `700 42px ${theme.fontMain}`;
  ctx.fillText('GDG on Campus UHU', col2Cx, valY);

  // Col 3: Estándar Open Badges 2.0
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

  // Competency Tags
  if (hasTags) {
    bodyY += gapTags;
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
    `<< /Type /Annot /Subtype /Link /Rect [388 44 454 112] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${safeUri}) >> >>`
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
