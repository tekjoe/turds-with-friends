/**
 * SEO Tests for Authenticated Layout
 * 
 * Tests WebPage structured data and robots meta tags
 * to ensure authenticated pages have proper SEO handling.
 */
import { render } from '@testing-library/react'
import AuthenticatedLayout, { metadata } from '../(authenticated)/layout'

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

import { headers } from 'next/headers'

describe('Authenticated Layout SEO', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Metadata', () => {
    it('should have robots meta set to noindex, nofollow', () => {
      expect(metadata.robots).toEqual({
        index: false,
        follow: false,
      })
    })
  })

  describe('WebPage Structured Data', () => {
    it('should render WebPage schema with @context', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Content</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      expect(scriptTag).toBeInTheDocument()
      
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema['@context']).toBe('https://schema.org')
    })

    it('should have @type set to WebPage', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Content</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema['@type']).toBe('WebPage')
    })

    it('should include name property', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Content</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema.name).toBeDefined()
      expect(typeof schema.name).toBe('string')
      expect(schema.name.length).toBeGreaterThan(0)
    })

    it('should include description property', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Content</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema.description).toBeDefined()
      expect(typeof schema.description).toBe('string')
      expect(schema.description.length).toBeGreaterThan(0)
    })

    it('should include isPartOf referencing WebSite schema', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Content</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      
      expect(schema.isPartOf).toBeDefined()
      expect(schema.isPartOf['@type']).toBe('WebSite')
      expect(schema.isPartOf.name).toBe('Bowel Buddies')
      expect(schema.isPartOf.url).toBe('https://bowelbuddies.app')
    })

    it('should render children content', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/dashboard']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test Child Content</div> })
      const { getByText } = render(Layout)
      
      expect(getByText('Test Child Content')).toBeInTheDocument()
    })
  })

  describe('Dynamic Schema by Route', () => {
    const testCases = [
      {
        path: '/dashboard',
        expectedName: 'Dashboard | Bowel Buddies',
        expectedDescription: 'View your digestive health dashboard, streaks, weight trends, and friend rankings.',
      },
      {
        path: '/log',
        expectedName: 'Log Movement | Bowel Buddies',
        expectedDescription: 'Record your bowel movement using the Bristol Stool Chart. Track type, time, and location.',
      },
      {
        path: '/analytics',
        expectedName: 'Analytics | Bowel Buddies',
        expectedDescription: 'View detailed analytics of your digestive health including monthly trends, time of day patterns, and Bristol type distribution.',
      },
      {
        path: '/map',
        expectedName: 'Poop Map | Bowel Buddies',
        expectedDescription: 'Explore your poop locations on an interactive map. See where you\'ve gone and discover patterns.',
      },
      {
        path: '/friends',
        expectedName: 'Friends | Bowel Buddies',
        expectedDescription: 'Connect with friends, view their activity, and share your digestive health journey.',
      },
      {
        path: '/challenges',
        expectedName: 'Challenges | Bowel Buddies',
        expectedDescription: 'Participate in digestive health challenges, earn XP, and compete with friends.',
      },
      {
        path: '/leaderboard',
        expectedName: 'Leaderboard | Bowel Buddies',
        expectedDescription: 'See how you rank against friends on the Bowel Buddies leaderboard. Compete for the top spot!',
      },
      {
        path: '/activity',
        expectedName: 'Activity | Bowel Buddies',
        expectedDescription: 'View your recent activity, friend requests, and comments on your bowel movements.',
      },
      {
        path: '/upgrade',
        expectedName: 'Upgrade | Bowel Buddies',
        expectedDescription: 'Upgrade to Bowel Buddies Premium for advanced analytics, unlimited history, and more features.',
      },
      {
        path: '/settings',
        expectedName: 'Settings | Bowel Buddies',
        expectedDescription: 'Manage your Bowel Buddies account settings, profile information, and preferences.',
      },
      {
        path: '/settings/privacy',
        expectedName: 'Privacy Settings | Bowel Buddies',
        expectedDescription: 'Control your privacy settings. Choose what information to share with friends and on the leaderboard.',
      },
    ]

    testCases.forEach(({ path, expectedName, expectedDescription }) => {
      it(`should have correct schema for ${path}`, async () => {
        (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', path]]))
        
        const Layout = await AuthenticatedLayout({ children: <div>Test</div> })
        const { container } = render(Layout)
        
        const scriptTag = container.querySelector('script[type="application/ld+json"]')
        const schema = JSON.parse(scriptTag?.textContent || '{}')
        
        expect(schema.name).toBe(expectedName)
        expect(schema.description).toBe(expectedDescription)
        expect(schema.url).toBe(`https://bowelbuddies.app${path}`)
      })
    })

    it('should fallback to dashboard schema for unknown routes', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/unknown-route']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      
      expect(schema.name).toBe('Dashboard | Bowel Buddies')
      expect(schema.url).toBe('https://bowelbuddies.app/unknown-route')
    })

    it('should fallback to parent route schema for nested paths', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-invoke-path', '/settings/account']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      
      expect(schema.name).toBe('Settings | Bowel Buddies')
    })

    it('should use x-matched-path when x-invoke-path is not available', async () => {
      (headers as jest.Mock).mockResolvedValue(new Map([['x-matched-path', '/log']]))
      
      const Layout = await AuthenticatedLayout({ children: <div>Test</div> })
      const { container } = render(Layout)
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      
      expect(schema.name).toBe('Log Movement | Bowel Buddies')
    })
  })
})
