export type ReworkStyleKey =
  | 'google'
  | 'hardware'
  | 'cyberpunk'
  | 'piscina'
  | 'nieve'
  | 'caramelos'
  | 'aurora'
  | 'blueprint'
  | 'antiguo'
  | 'japon'
  | 'voynich'
  | 'mixteca';

export interface ReworkThemeInfo {
  key: ReworkStyleKey;
  label: string;
  shortLabel: string;
  subtitle: string;
  category: 'tech' | 'nature' | 'culture' | 'fantasy';
  accent: string;
  secondary: string;
  bgPreview: string;
  isDark: boolean;
  pillClass: string;
  topBarGradient: string;
  svgIcon: string;
}

export function normalizeReworkStyle(raw?: string | null): ReworkStyleKey {
  if (!raw) return 'google';
  const clean = raw.trim().toLowerCase();
  if (clean === 'cyber') return 'hardware';
  const valid: ReworkStyleKey[] = [
    'google',
    'hardware',
    'cyberpunk',
    'piscina',
    'nieve',
    'caramelos',
    'aurora',
    'blueprint',
    'antiguo',
    'japon',
    'voynich',
    'mixteca',
  ];
  return (valid.includes(clean as ReworkStyleKey) ? clean : 'google') as ReworkStyleKey;
}

export const REWORK_THEMES: Record<ReworkStyleKey, ReworkThemeInfo> = {
  google: {
    key: 'google',
    label: 'Google Mesh',
    shortLabel: 'Google',
    subtitle: 'Gradient Mesh Fluido Ultra · Google Prismatic',
    category: 'tech',
    accent: '#4285F4',
    secondary: '#34A853',
    bgPreview: 'linear-gradient(135deg, #4285F4 0%, #EA4335 35%, #FBBC04 70%, #34A853 100%)',
    isDark: false,
    pillClass: 'bg-[#E8F0FE] text-[#1967D2] border border-[#AECBFA]',
    topBarGradient: 'linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC04 66%, #34A853 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><circle cx="7" cy="7" r="4" fill="#4285F4"/><circle cx="17" cy="7" r="4" fill="#EA4335"/><circle cx="7" cy="17" r="4" fill="#FBBC04"/><circle cx="17" cy="17" r="4" fill="#34A853"/></svg>`,
  },
  hardware: {
    key: 'hardware',
    label: 'Hardware PCB',
    shortLabel: 'Hardware',
    subtitle: 'Placa Base PCB Multicapa · Chips BGA, Vias & Pulsos Bus',
    category: 'tech',
    accent: '#00E676',
    secondary: '#FFD54F',
    bgPreview: 'linear-gradient(135deg, #041B11 0%, #0A3822 55%, #D4AF37 100%)',
    isDark: true,
    pillClass: 'bg-[#052316] text-[#00E676] border border-[#D4AF37]/60',
    topBarGradient: 'linear-gradient(90deg, #00E676 0%, #D4AF37 50%, #00BFA5 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-[#00E676]"><rect x="6" y="6" width="12" height="12" rx="2" stroke="#D4AF37"/><rect x="9" y="9" width="6" height="6" fill="#00E676"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="#00E676"/></svg>`,
  },
  cyberpunk: {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    shortLabel: 'Cyberpunk',
    subtitle: 'Night City Neo-Skyline · Rascacielos Neón, Glitch & Kanji',
    category: 'tech',
    accent: '#FCEE0A',
    secondary: '#FF0055',
    bgPreview: 'linear-gradient(135deg, #FCEE0A 0%, #FF0055 55%, #00F0FF 100%)',
    isDark: true,
    pillClass: 'bg-[#140718] text-[#FCEE0A] border border-[#FF0055]',
    topBarGradient: 'linear-gradient(90deg, #FCEE0A 0%, #FF0055 50%, #00F0FF 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FCEE0A" stroke="#FF0055" stroke-width="1.5"/></svg>`,
  },
  blueprint: {
    key: 'blueprint',
    label: 'Blueprint CAD',
    shortLabel: 'Blueprint',
    subtitle: 'Plano Técnico CAD Ensamblajes · Isométricas & Cotas ISO',
    category: 'tech',
    accent: '#60A5FA',
    secondary: '#FFFFFF',
    bgPreview: 'linear-gradient(135deg, #07193F 0%, #103478 55%, #3B82F6 100%)',
    isDark: true,
    pillClass: 'bg-[#0B2559] text-[#93C5FD] border border-[#60A5FA]',
    topBarGradient: 'linear-gradient(90deg, #3B82F6 0%, #93C5FD 50%, #1D4ED8 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2" class="w-4 h-4"><circle cx="12" cy="5" r="2"/><path d="M10.5 7L5 21M13.5 7L19 21M7 15h10M12 3v2"/></svg>`,
  },
  piscina: {
    key: 'piscina',
    label: 'Verano & Oleaje',
    shortLabel: 'Verano',
    subtitle: 'Oleaje Rompiente en Pantalla · Salpicaduras 3D & Cáusticas',
    category: 'nature',
    accent: '#0284C7',
    secondary: '#00E5FF',
    bgPreview: 'linear-gradient(135deg, #00F2FE 0%, #00B4DB 50%, #0284C7 100%)',
    isDark: false,
    pillClass: 'bg-[#E0F7FA] text-[#006064] border border-[#00BCD4]',
    topBarGradient: 'linear-gradient(90deg, #00F2FE 0%, #00E5FF 45%, #0284C7 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" class="w-4 h-4"><path d="M2 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/><path d="M2 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" stroke="#00B4DB"/></svg>`,
  },
  nieve: {
    key: 'nieve',
    label: 'Tormenta Invernal',
    shortLabel: 'Invierno',
    subtitle: 'Ventisca Ártica · Nubes de Tormenta, Rayos & Escarcha',
    category: 'nature',
    accent: '#7DD3FC',
    secondary: '#E0F2FE',
    bgPreview: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #7DD3FC 100%)',
    isDark: true,
    pillClass: 'bg-[#0C223B] text-[#7DD3FC] border border-[#7DD3FC]/60',
    topBarGradient: 'linear-gradient(90deg, #E0F2FE 0%, #38BDF8 50%, #818CF8 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" class="w-4 h-4"><path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93"/></svg>`,
  },
  aurora: {
    key: 'aurora',
    label: 'Aurora & Cosmos',
    shortLabel: 'Aurora',
    subtitle: 'Cielo Estrellado Cósmico · Cortinas de Aurora & Bosque Alpino',
    category: 'nature',
    accent: '#00FFAA',
    secondary: '#A855F7',
    bgPreview: 'linear-gradient(135deg, #040716 0%, #00FFAA 50%, #9333EA 100%)',
    isDark: true,
    pillClass: 'bg-[#090D24] text-[#00FFAA] border border-[#A855F7]/70',
    topBarGradient: 'linear-gradient(90deg, #00FFAA 0%, #38BDF8 50%, #A855F7 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M3 17c3-6 6-9 9-3s6 3 9-5" stroke="#00FFAA" stroke-width="2.2" stroke-linecap="round"/><path d="M3 12c3-5 6-7 9-2s6 2 9-4" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="5" r="1.3" fill="#FFF"/></svg>`,
  },
  caramelos: {
    key: 'caramelos',
    label: 'Fantasía Dulce',
    shortLabel: 'Caramelos',
    subtitle: 'Arcoíris Brillante · Unicornios, Caldero de Oro & Dulces',
    category: 'fantasy',
    accent: '#EC4899',
    secondary: '#F59E0B',
    bgPreview: 'linear-gradient(135deg, #FF4D94 0%, #FBBF24 45%, #38BDF8 100%)',
    isDark: false,
    pillClass: 'bg-[#FFF0F7] text-[#BE185D] border border-[#F472B6]',
    topBarGradient: 'linear-gradient(90deg, #FF1493 0%, #FF8C00 25%, #FFD700 50%, #00E676 75%, #8B5CF6 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M4 16a8 8 0 0 1 16 0" stroke="#FF1493" stroke-width="2.2" stroke-linecap="round"/><path d="M6.5 16a5.5 5.5 0 0 1 11 0" stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round"/><path d="M9 16a3 3 0 0 1 6 0" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/><circle cx="18" cy="17" r="3" fill="#F59E0B"/></svg>`,
  },
  antiguo: {
    key: 'antiguo',
    label: 'Grecia & Egipto',
    shortLabel: 'Antiguo',
    subtitle: 'Partenón de Atenas & Pirámides de Giza · Oro & Lapislázuli',
    category: 'culture',
    accent: '#B45309',
    secondary: '#1D4ED8',
    bgPreview: 'linear-gradient(135deg, #1B365D 0%, #D4AF37 55%, #F5EFE0 100%)',
    isDark: false,
    pillClass: 'bg-[#FDF6E2] text-[#92400E] border border-[#D4AF37]',
    topBarGradient: 'linear-gradient(90deg, #1B365D 0%, #D4AF37 35%, #C2410C 70%, #D4AF37 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><polygon points="12 3 22 20 2 20" fill="#D4AF37" fill-opacity="0.3" stroke="#B45309" stroke-width="2"/><circle cx="12" cy="13" r="2.2" fill="#1B365D"/></svg>`,
  },
  japon: {
    key: 'japon',
    label: 'Japón & Dongba',
    shortLabel: 'Japón',
    subtitle: 'Monte Fuji, Pagodas & Torii · Lluvia de Sakura & Dongba',
    category: 'culture',
    accent: '#C82829',
    secondary: '#D4AF37',
    bgPreview: 'linear-gradient(135deg, #FAF5EC 0%, #E11D48 50%, #1C1917 100%)',
    isDark: false,
    pillClass: 'bg-[#FFF1F2] text-[#9F1239] border border-[#FDA4AF]',
    topBarGradient: 'linear-gradient(90deg, #C82829 0%, #F472B6 50%, #D4AF37 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#C82829" stroke-width="2" class="w-4 h-4"><path d="M3 6h18M5 10h14M7 6v15M17 6v15"/></svg>`,
  },
  voynich: {
    key: 'voynich',
    label: 'Manuscrito Voynich',
    shortLabel: 'Voynich',
    subtitle: 'Códice Botánico Medieval · Pergamino Arcano & Zodíaco',
    category: 'culture',
    accent: '#78350F',
    secondary: '#15803D',
    bgPreview: 'linear-gradient(135deg, #FDF6E2 0%, #D97706 50%, #451A03 100%)',
    isDark: false,
    pillClass: 'bg-[#FDF6E2] text-[#78350F] border border-[#B45309]/60',
    topBarGradient: 'linear-gradient(90deg, #78350F 0%, #B45309 35%, #15803D 70%, #D97706 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#78350F" stroke-width="2" class="w-4 h-4"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 6v12M8 10c2-2 6-2 8 0M8 14c2-2 6-2 8 0" stroke="#15803D"/></svg>`,
  },
  mixteca: {
    key: 'mixteca',
    label: 'Amazonia Mixteca',
    shortLabel: 'Mixteca',
    subtitle: 'Códice Mesoamericano · Serpiente Emplumada & Jade Solar',
    category: 'culture',
    accent: '#10B981',
    secondary: '#F59E0B',
    bgPreview: 'linear-gradient(135deg, #064E3B 0%, #10B981 45%, #D97706 75%, #BE123C 100%)',
    isDark: true,
    pillClass: 'bg-[#052E24] text-[#34D399] border border-[#F59E0B]/60',
    topBarGradient: 'linear-gradient(90deg, #00A86B 0%, #F59E0B 35%, #C41E3A 70%, #2DD4BF 100%)',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" class="w-4 h-4"><path d="M3 18h4v-4h4v-4h4V6h6" stroke="#F59E0B"/><path d="M3 12h4V8h4V4" stroke="#10B981"/></svg>`,
  },
};

export const REWORK_STYLE_ORDER: ReworkStyleKey[] = [
  'google',
  'hardware',
  'cyberpunk',
  'piscina',
  'nieve',
  'caramelos',
  'aurora',
  'blueprint',
  'antiguo',
  'japon',
  'voynich',
  'mixteca',
];

