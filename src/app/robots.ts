import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bowelbuddies.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/log/', '/analytics/', '/activity/', '/friends/', '/leaderboard/', '/challenges/', '/map/', '/settings/', '/upgrade/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
