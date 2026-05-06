import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

const SITE_NAME = 'ASF Criadores';
const DEFAULT_DESC = 'Plataforma de criadores de abelhas sem ferrão do Brasil. Encontre meliponicultores, espécies nativas e conecte-se com a comunidade.';
const DEFAULT_IMAGE = '/images/logo-asf.png';

export function useSEO({ title, description, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESC;
    const img = image || DEFAULT_IMAGE;
    const pageUrl = url || window.location.href;

    // Title
    document.title = fullTitle;

    // Helper para setar ou criar meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', desc);

    // Open Graph (WhatsApp, Facebook, LinkedIn)
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', img.startsWith('/') ? `${window.location.origin}${img}` : img);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img.startsWith('/') ? `${window.location.origin}${img}` : img);

    return () => { document.title = SITE_NAME; };
  }, [title, description, image, url, type]);
}
