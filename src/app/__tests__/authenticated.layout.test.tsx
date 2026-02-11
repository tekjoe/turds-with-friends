/**
 * SEO Tests for Authenticated Layout
 * 
 * Tests WebPage structured data and robots meta tags
 * to ensure authenticated pages have proper SEO handling.
 */
import { render } from '@testing-library/react'
import AuthenticatedLayout, { metadata } from '../(authenticated)/layout'

describe('Authenticated Layout SEO', () => {
  describe('Metadata', () => {
    it('should have robots meta set to noindex, nofollow', () => {
      expect(metadata.robots).toEqual({
        index: false,
        follow: false,
      })
    })
  })

  describe('WebPage Structured Data', () => {
    it('should render WebPage schema with @context', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      expect(scriptTag).toBeInTheDocument()
      
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema['@context']).toBe('https://schema.org')
    })

    it('should have @type set to WebPage', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema['@type']).toBe('WebPage')
    })

    it('should include name property', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema.name).toBeDefined()
      expect(typeof schema.name).toBe('string')
      expect(schema.name.length).toBeGreaterThan(0)
    })

    it('should include description property', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema.description).toBeDefined()
      expect(typeof schema.description).toBe('string')
      expect(schema.description.length).toBeGreaterThan(0)
    })

    it('should include url pointing to bowelbuddies.app', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      expect(schema.url).toBe('https://bowelbuddies.app')
    })

    it('should include isPartOf referencing WebSite schema', () => {
      const { container } = render(
        <AuthenticatedLayout>
          <div>Test Content</div>
        </AuthenticatedLayout>
      )
      
      const scriptTag = container.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(scriptTag?.textContent || '{}')
      
      expect(schema.isPartOf).toBeDefined()
      expect(schema.isPartOf['@type']).toBe('WebSite')
      expect(schema.isPartOf.name).toBe('Bowel Buddies')
      expect(schema.isPartOf.url).toBe('https://bowelbuddies.app')
    })

    it('should render children content', () => {
      const { getByText } = render(
        <AuthenticatedLayout>
          <div>Test Child Content</div>
        </AuthenticatedLayout>
      )
      
      expect(getByText('Test Child Content')).toBeInTheDocument()
    })
  })
})
