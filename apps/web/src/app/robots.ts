import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://theraflow.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/showcase',
          '/login',
          '/register',
          '/onboarding',
          '/portal',
          '/*/book',
        ],
        disallow: [
          '/api/*',
          '/dashboard/*',
          '/clinical/*',
          '/billing/*',
          '/crisis/*',
          '/settings/*',
          '/telehealth/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
