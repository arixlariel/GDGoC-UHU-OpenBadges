export interface IssuerConfig {
  id: string;
  name: string;
  url: string;
  email: string;
  description: string;
  image: string;
}

const siteUrl = process.env.SITE_URL || 'https://gdguhu.com';
const basePath = process.env.BASE_PATH || '';

export const siteConfig = {
  url: siteUrl.replace(/\/$/, ''),
  base: basePath,
  name: 'Certificados Digitales · GDG on Campus Universidad de Huelva',
  shortName: 'Certificados Digitales',
  description: 'Plataforma oficial de certificados digitales e insignias Open Badges de GDG on Campus Universidad de Huelva.',
  communityUrl: 'https://gdg.community.dev/gdg-on-campus-huelva-university-huelva-spain/',
  linkedinUrl: 'https://www.linkedin.com/company/gdgoc-huelva',
  instagramUrl: 'https://www.instagram.com/gdgoc.huelva/',
};

export function getFullUrl(path: string): string {
  const base = (siteConfig.base && siteConfig.base !== '/')
    ? (siteConfig.base.startsWith('/') ? siteConfig.base : `/${siteConfig.base}`).replace(/\/$/, '')
    : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${base}${cleanPath}`;
}

export function getAssetUrl(path: string): string {
  const base = (siteConfig.base && siteConfig.base !== '/')
    ? (siteConfig.base.startsWith('/') ? siteConfig.base : `/${siteConfig.base}`).replace(/\/$/, '')
    : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export const issuerConfig: IssuerConfig = {
  id: getFullUrl('/api/badges/issuer.json'),
  name: 'GDG on Campus Universidad de Huelva',
  url: 'https://gdg.community.dev/gdg-on-campus-huelva-university-huelva-spain/',
  email: 'gdgoc.huelva@gmail.com',
  description: 'Comunidad universitaria oficial de Google Developer Groups on Campus en la Universidad de Huelva (UHU).',
  image: getFullUrl('/images/gdgoc-uhu-logo.jpg'),
};

// Organizadores autorizados cuyos certificados rotan en la portada (y se indexan en sitemap.xml).
// El resto de certificados de asistentes permanecen privados (accesibles solo por su URL/ID y con noindex).
const ORGANIZER_SHOWCASE_IDENTITIES = new Set<string>([
  'sha256$f7e6009252f61e6b4647bc3af8fa49125bf027f65d5c456be2ad9a41457647d0', // Carmen Gutiérrez Sánchez
  'sha256$0c9b7406c923055cf0278f4912cbe0fee459a1ba90d5618cee09650983f26e5e', // Jesús Páez Porquera
  'sha256$69cff131499945e507211c3171d2a74e50910d495a98632e36b00f57fbc4bffd', // Miguel Ángel Rodríguez Romero
  'sha256$5c472b6a7e73f99aae9d8d9423ff3ace906898ce2e14f50849998ca2080b0c09', // Ariel Bustillo León
]);

const ORGANIZER_SHOWCASE_NAMES = new Set<string>([
  'carmen gutierrez sanchez',
  'jesus paez porquera',
  'miguel angel rodriguez romero',
  'ariel bustillo leon',
]);

function normalizePersonName(name: string): string {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function isShowcaseAssertion(assertion: {
  data: {
    recipient: { name: string; identity: string };
    showcase?: boolean;
  };
}): boolean {
  if (typeof assertion.data.showcase === 'boolean') {
    return assertion.data.showcase;
  }
  const identity = String(assertion.data.recipient?.identity || '').trim();
  if (ORGANIZER_SHOWCASE_IDENTITIES.has(identity)) {
    return true;
  }
  const normalizedName = normalizePersonName(assertion.data.recipient?.name || '');
  return ORGANIZER_SHOWCASE_NAMES.has(normalizedName);
}
