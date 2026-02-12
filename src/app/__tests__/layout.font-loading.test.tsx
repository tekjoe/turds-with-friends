/**
 * Regression test for material icons loading bug
 * 
 * Bug: Material icons don't load on initial page load because the font
 * was loaded with display=optional, which tells browsers to skip loading
 * the font on uncached initial page loads.
 * 
 * Fix: Changed display=optional to display=swap so browsers show a
 * fallback immediately and swap in the Material Symbols font once loaded.
 */
import fs from 'fs'
import path from 'path'

describe('layout.tsx font loading', () => {
  const layoutPath = path.join(__dirname, '../layout.tsx')
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

  it('should use display=swap for Material Symbols font (not display=optional)', () => {
    // The font URL should contain display=swap
    expect(layoutContent).toContain('display=swap')
    
    // The font URL should NOT contain display=optional
    expect(layoutContent).not.toContain('display=optional')
  })

  it('should load Material Symbols font from Google Fonts', () => {
    expect(layoutContent).toContain('fonts.googleapis.com/css2?family=Material+Symbols+Rounded')
  })
})
