export interface IssuerConfig {
  id: string;
  name: string;
  url: string;
  email: string;
  description: string;
  image: string;
}

const siteUrl = process.env.SITE_URL || 'https://arixlariel.github.io';
const basePath = process.env.BASE_PATH || '';

export const siteConfig = {
  url: siteUrl.replace(/\/$/, ''),
  base: basePath,
  name: 'GDG on Campus Universidad de Huelva - Certificados',
  description: 'Sistema oficial de verificación de credenciales e insignias digitales Open Badges para GDG on Campus UHU.',
};

export function getFullUrl(path: string): string {
  const base = (siteConfig.base && siteConfig.base !== '/')
    ? (siteConfig.base.startsWith('/') ? siteConfig.base : `/${siteConfig.base}`).replace(/\/$/, '')
    : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${base}${cleanPath}`;
}

export const issuerConfig: IssuerConfig = {
  id: getFullUrl('/api/badges/issuer.json'),
  name: 'GDG on Campus Universidad de Huelva',
  url: 'https://gdg.community.dev/gdg-on-campus-universidad-de-huelva-huelva-spain/',
  email: 'gdgoc.uhu@gmail.com',
  description: 'Comunidad universitaria oficial de Google Developer Groups en la Universidad de Huelva (UHU), dedicada al aprendizaje, innovación y desarrollo de tecnología.',
  image: getFullUrl('/images/gdgoc-uhu-logo.svg'),
};
