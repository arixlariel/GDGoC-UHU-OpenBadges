/**
 * Generador ligero de códigos QR en formato SVG vectorial (ISO/IEC 18004)
 * Sin dependencias externas, optimizado para URLs de certificados Open Badges.
 */

const VERSIONS = [
  { version: 1, total: 26, data: 19, ec: 7, align: [] as number[] },
  { version: 2, total: 44, data: 34, ec: 10, align: [6, 18] },
  { version: 3, total: 70, data: 55, ec: 15, align: [6, 22] },
  { version: 4, total: 100, data: 80, ec: 20, align: [6, 26] },
  { version: 5, total: 134, data: 108, ec: 26, align: [6, 30] },
];

// Tablas GF(256) con polinomio primitivo 0x11D
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    EXP[i] = EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function getGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomon(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = getGeneratorPoly(ecLen);
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

function encodeData(text: string) {
  const bytes = new TextEncoder().encode(text);
  const spec = VERSIONS.find((v) => v.data - 2 >= bytes.length);
  if (!spec) {
    throw new Error(`El texto a codificar es demasiado largo (${bytes.length} bytes). El generador QR integrado soporta un máximo de ${VERSIONS[VERSIONS.length - 1].data - 2} bytes.`);
  }

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Modo Byte (0100)
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (const b of bytes) {
    pushBits(b, 8);
  }

  // Terminador (hasta 4 ceros)
  const maxBits = spec.data * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) {
    bits.push(0);
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataBytes = new Uint8Array(spec.data);
  const byteLen = bits.length / 8;
  for (let i = 0; i < byteLen; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  // Bytes de relleno alternos 0xEC y 0x11
  const pads = [0xec, 0x11];
  for (let i = byteLen; i < spec.data; i++) {
    dataBytes[i] = pads[(i - byteLen) % 2];
  }

  const ecBytes = computeReedSolomon(dataBytes, spec.ec);
  const codewords = new Uint8Array(spec.total);
  codewords.set(dataBytes, 0);
  codewords.set(ecBytes, spec.data);

  return { spec, codewords };
}

export function generateQrSvgPath(text: string): { size: number; path: string } {
  const { spec, codewords } = encodeData(text);
  const size = 17 + spec.version * 4;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunc: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunctionModule = (r: number, c: number, dark: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = dark;
      isFunc[r][c] = true;
    }
  };

  // Patrones de búsqueda (7x7 + separador)
  const drawFinder = (row: number, col: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && (dc === 0 || dc === 6);
        const inTopBot = dc >= 0 && dc <= 6 && (dr === 0 || dr === 6);
        const inCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunctionModule(r, c, inOuter || inTopBot || inCenter);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Patrones de alineamiento (5x5)
  if (spec.align.length > 1) {
    const center = spec.align[spec.align.length - 1];
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const dist = Math.max(Math.abs(dr), Math.abs(dc));
        setFunctionModule(center + dr, center + dc, dist !== 1);
      }
    }
  }

  // Patrones de sincronización (Timing)
  for (let i = 8; i < size - 8; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Módulo oscuro fijo y reserva de áreas de formato
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isFunc[8][i] = true;
      isFunc[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunc[8][size - 1 - i] = true;
    isFunc[size - 1 - i][8] = true;
  }
  setFunctionModule(4 * spec.version + 9, 8, true);

  // Colocación de bits en zig-zag
  let bitIdx = 0;
  const totalBits = codewords.length * 8;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!isFunc[r][c]) {
          let dark = false;
          if (bitIdx < totalBits) {
            dark = ((codewords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          // Máscara 0: (r + c) % 2 === 0
          if ((r + c) % 2 === 0) dark = !dark;
          modules[r][c] = dark;
        }
      }
    }
    upward = !upward;
  }

  // Información de formato para Nivel L (01) + Máscara 0 (000) -> data = 0b01000
  const dataBits = (0b01 << 3) | 0;
  let rem = dataBits << 10;
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
  }
  const formatBits = ((dataBits << 10) | rem) ^ 0x5412;
  const getBit = (i: number) => ((formatBits >> i) & 1) === 1;

  // Superior izquierda
  for (let i = 0; i <= 5; i++) modules[8][i] = getBit(14 - i);
  modules[8][7] = getBit(8);
  modules[8][8] = getBit(7);
  modules[7][8] = getBit(6);
  for (let i = 0; i <= 5; i++) modules[5 - i][8] = getBit(5 - i);

  // Inferior izquierda y superior derecha
  for (let i = 0; i <= 6; i++) modules[size - 1 - i][8] = getBit(14 - i);
  for (let i = 0; i <= 7; i++) modules[8][size - 8 + i] = getBit(7 - i);

  // Construir path SVG compacto
  let path = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        path += `M${c},${r}h1v1h-1z`;
      }
    }
  }

  return { size, path };
}

