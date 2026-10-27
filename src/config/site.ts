export interface IssuerConfig {
  id: string;
  name: string;
  url: string;
  email: string;
  description: string;
  image: string;
}

export const siteConfig = {
  // Ajusta SITE_URL al dominio de tu GitHub Pages o dominio propio:
  // Ej: https://arixlariel.github.io/gdgoc-uhu-badges
  url: process.env.SITE_URL || 'https://arixlariel.github.io/gdgoc-uhu-badges',
  base: process.env.BASE_PATH || '',
  name: 'GDG on Campus Universidad de Huelva - Certificados',
  description: 'Sistema oficial de verificación de credenciales e insignias digitales Open Badges para GDG on Campus UHU.',
};

export const issuerConfig: IssuerConfig = {
  id: `${siteConfig.url}/api/badges/issuer.json`,
  name: 'GDG on Campus Universidad de Huelva',
  url: 'https://gdg.community.dev/gdg-on-campus-universidad-de-huelva-huelva-spain/',
  email: 'gdgoc.uhu@gmail.com',
  description: 'Comunidad universitaria oficial de Google Developer Groups en la Universidad de Huelva (UHU), dedicada al aprendizaje, innovación y desarrollo de tecnología.',
  image: `${siteConfig.url}/images/gdgoc-uhu-logo.svg`,
};

export function getFullUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

