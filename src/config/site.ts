export interface IssuerConfig {
  id: string;
  name: string;
  url: string;
  email: string;
  description: string;
  image: string;
}

const siteUrl = process.env.SITE_URL || 'https://gdguhu.es';
const basePath = process.env.BASE_PATH || '';

export const siteConfig = {
  url: siteUrl.replace(/\/$/, ''),
  base: basePath,
  name: 'Certificados Digitales · GDG on Campus Universidad de Huelva',
  shortName: 'Certificados Digitales',
  description: 'Plataforma oficial de certificados digitales e insignias Open Badges de GDG on Campus Universidad de Huelva.',
  communityUrl: 'https://gdg.community.dev/gdg-on-campus-huelva-university-huelva-spain/',
  linkedinUrl: 'https://www.linkedin.com/company/gdg-huelva/?viewAsMember=true',
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
