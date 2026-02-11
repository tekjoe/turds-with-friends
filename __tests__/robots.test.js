const fs = require('fs')
const path = require('path')

describe('robots.txt', () => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
  let robotsContent

  beforeAll(() => {
    robotsContent = fs.readFileSync(robotsPath, 'utf-8')
  })

  it('exists in the public folder', () => {
    expect(fs.existsSync(robotsPath)).toBe(true)
  })

  it('allows all user-agents', () => {
    expect(robotsContent).toContain('User-agent: *')
    expect(robotsContent).toContain('Allow: /')
  })

  it('disallows authenticated routes', () => {
    const disallowedRoutes = [
      '/dashboard',
      '/analytics',
      '/map',
      '/log',
      '/friends',
      '/challenges',
      '/leaderboard',
      '/activity',
      '/settings',
      '/upgrade',
    ]

    disallowedRoutes.forEach((route) => {
      expect(robotsContent).toContain(`Disallow: ${route}`)
    })
  })

  it('disallows API and auth routes', () => {
    expect(robotsContent).toContain('Disallow: /api/')
    expect(robotsContent).toContain('Disallow: /auth/')
  })

  it('includes sitemap directive', () => {
    expect(robotsContent).toContain('Sitemap: https://bowelbuddies.app/sitemap.xml')
  })
})
