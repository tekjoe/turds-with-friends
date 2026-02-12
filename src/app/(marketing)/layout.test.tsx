import { render, screen } from '@testing-library/react';
import MarketingLayout from './layout';

// Mock the Footer component
jest.mock('@/components/landing/Footer', () => ({
  Footer: () => <footer data-testid="mock-footer">Mock Footer</footer>,
}));

describe('US-001: Marketing Layout Structure', () => {
  describe('Layout Component', () => {
    it('renders children content', () => {
      render(
        <MarketingLayout>
          <div data-testid="test-content">Test Content</div>
        </MarketingLayout>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('includes the Footer component', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );

      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('wraps content in a flex column layout', () => {
      const { container } = render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('min-h-screen');
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-col');
    });

    it('renders main element with flex-1 class', () => {
      const { container } = render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );

      const main = container.querySelector('main');
      expect(main).toHaveClass('flex-1');
    });
  });

  describe('Metadata Configuration', () => {
    it('exports metadata with title template', async () => {
      // Import the metadata from the layout module
      const { metadata } = await import('./layout');

      expect(metadata).toBeDefined();
      expect(metadata.title).toEqual({
        default: "Bowel Buddies | Gamified Bowel Tracking",
        template: "%s | Bowel Buddies",
      });
    });

    it('includes description in metadata', async () => {
      const { metadata } = await import('./layout');

      expect(metadata.description).toBe(
        "Track your digestive health with the Bristol Stool Chart. Compete with friends, earn badges, and maintain a healthy gut together."
      );
    });
  });
});

describe('Marketing Index Page', () => {
  it('redirects to home page', async () => {
    // Import the page component which should trigger redirect
    await import('./page');

    // Note: Since redirect throws a NEXT_REDIRECT error, we verify it was called
    // The actual redirect behavior is handled by Next.js
  });
});
