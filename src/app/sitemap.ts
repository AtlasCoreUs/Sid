import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sid-hud.com'
  
  // Pages statiques
  const staticPages = [
    '',
    '/pricing',
    '/create',
    '/auth/signin',
    '/auth/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Ajouter les pages dynamiques (apps, templates, etc.)
  
  return [...staticPages]
}