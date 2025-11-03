import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/pricing',
          '/about',
          '/contact',
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
          '/_next',
        ],
        crawlDelay: 0,
      },
      // Specific rules for common search engines
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/features',
          '/pricing',
          '/about',
          '/contact',
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
          '/features',
          '/pricing',
          '/about',
          '/contact',
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
    host: baseUrl,
  };
}
