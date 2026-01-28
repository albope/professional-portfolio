import { MetadataRoute } from 'next';
import { i18n } from '../../i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://albertobort.com';

  const routes: MetadataRoute.Sitemap = [];

  // Página principal para cada idioma
  for (const locale of i18n.locales) {
    routes.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          es: `${siteUrl}/es`,
          en: `${siteUrl}/en`,
        },
      },
    });
  }

  return routes;
}
