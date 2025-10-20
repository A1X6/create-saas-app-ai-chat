import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/auth',
          '/auth/*',
          '/setup',
          '/setup/*',
          '/api',
          '/api/*',
        ],
      },
      // Specific rules for common bots
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/auth',
          '/setup',
          '/api',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/pricing',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/auth',
          '/setup',
          '/api',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
