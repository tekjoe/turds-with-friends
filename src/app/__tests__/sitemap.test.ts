import sitemap from '../sitemap'

describe('sitemap.ts', () => {
  const sitemapResult = sitemap()

  it('should return an array of sitemap entries', () => {
    expect(Array.isArray(sitemapResult)).toBe(true)
    expect(sitemapResult.length).toBeGreaterThan(0)
  })

  it('should include homepage with priority 1.0', () => {
    const homepage = sitemapResult.find(entry =>
      entry.url === 'https://bowelbuddies.app' || entry.url.endsWith('/')
    )
    expect(homepage).toBeDefined()
    expect(homepage?.priority).toBe(1.0)
    expect(homepage?.changeFrequency).toBe('weekly')
  })

  it('should include /login route with priority 0.5', () => {
    const loginPage = sitemapResult.find(entry =>
      entry.url.includes('/login')
    )
    expect(loginPage).toBeDefined()
    expect(loginPage?.priority).toBe(0.5)
    expect(loginPage?.changeFrequency).toBe('monthly')
  })

  it('should include marketing pages', () => {
    const features = sitemapResult.find(entry => entry.url.includes('/features'))
    expect(features).toBeDefined()
    expect(features?.priority).toBe(0.8)

    const premium = sitemapResult.find(entry => entry.url.includes('/premium'))
    expect(premium).toBeDefined()
    expect(premium?.priority).toBe(0.7)
  })

  it('should include blog pages', () => {
    const blogIndex = sitemapResult.find(entry => entry.url.endsWith('/blog'))
    expect(blogIndex).toBeDefined()
    expect(blogIndex?.changeFrequency).toBe('weekly')

    const bristolGuide = sitemapResult.find(entry =>
      entry.url.includes('/blog/bristol-stool-chart-guide')
    )
    expect(bristolGuide).toBeDefined()
    expect(bristolGuide?.priority).toBe(0.9)
  })

  it('should include quiz page', () => {
    const quiz = sitemapResult.find(entry => entry.url.includes('/quiz'))
    expect(quiz).toBeDefined()
    expect(quiz?.priority).toBe(0.9)
  })

  it('should have lastModified dates for all entries', () => {
    sitemapResult.forEach(entry => {
      expect(entry.lastModified).toBeInstanceOf(Date)
    })
  })

  it('should include privacy and legal pages', () => {
    const privacyPage = sitemapResult.find(entry =>
      entry.url.includes('/privacy-first')
    )
    expect(privacyPage).toBeDefined()
    expect(privacyPage?.priority).toBe(0.3)
    expect(privacyPage?.changeFrequency).toBe('yearly')

    const terms = sitemapResult.find(entry => entry.url.includes('/terms'))
    expect(terms).toBeDefined()

    const disclaimer = sitemapResult.find(entry => entry.url.includes('/medical-disclaimer'))
    expect(disclaimer).toBeDefined()
  })

  it('should not include authenticated routes', () => {
    const authenticatedPaths = ['/dashboard', '/analytics', '/settings', '/leaderboard']
    authenticatedPaths.forEach(path => {
      const hasRoute = sitemapResult.some(entry => entry.url.includes(path))
      expect(hasRoute).toBe(false)
    })
  })
})
