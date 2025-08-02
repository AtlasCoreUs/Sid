import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/editor/',
          '/analytics/',
        ],
      },
    ],
    sitemap: 'https://sid-hud.com/sitemap.xml',
  }
}