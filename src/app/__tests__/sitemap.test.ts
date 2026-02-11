import sitemap from '../sitemap'

describe('sitemap.ts', () => {
  const sitemapResult = sitemap()

  it('should return an array of sitemap entries', () => {
    expect(Array.isArray(sitemapResult)).toBe(true)
    expect(sitemapResult.length).toBeGreaterThan(0)
  })

  it('should include homepage with priority 1.0', () => {
    const homepage = sitemapResult.find(entry => 
      entry.url === 'https://bowel-buddies.com' || entry.url.endsWith('/')
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

  it('should include /onboarding route with priority 0.5', () => {
    const onboardingPage = sitemapResult.find(entry => 
      entry.url.includes('/onboarding')
    )
    expect(onboardingPage).toBeDefined()
    expect(onboardingPage?.priority).toBe(0.5)
    expect(onboardingPage?.changeFrequency).toBe('monthly')
  })

  it('should have lastModified dates for all entries', () => {
    sitemapResult.forEach(entry => {
      expect(entry.lastModified).toBeInstanceOf(Date)
    })
  })

  it('should only include specified public routes', () => {
    const expectedRoutes = ['/', '/login', '/onboarding']
    expect(sitemapResult.length).toBe(expectedRoutes.length)
    
    expectedRoutes.forEach(route => {
      const hasRoute = sitemapResult.some(entry => 
        entry.url.endsWith(route) || (route === '/' && entry.url === 'https://bowel-buddies.com')
      )
      expect(hasRoute).toBe(true)
    })
  })
})
