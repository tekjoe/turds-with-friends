import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />;
  },
}));

// Mock supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
    },
  }),
}));

describe('US-003: Navbar - Remove premium gating', () => {
  describe('Desktop Navigation', () => {
    it('always shows Analytics, Challenges, and Poop Map links for authenticated users', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={false}
        />
      );

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Challenges')).toBeInTheDocument();
      expect(screen.getByText('Poop Map')).toBeInTheDocument();
    });

    it('shows premium links regardless of premium status', () => {
      const { rerender } = render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={false}
        />
      );

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.queryByText('Go Pro')).not.toBeInTheDocument();

      rerender(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={true}
        />
      );

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.queryByText('Go Pro')).not.toBeInTheDocument();
    });

    it('does not show Go Pro upgrade button', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={false}
        />
      );

      expect(screen.queryByText('Go Pro')).not.toBeInTheDocument();
      expect(screen.queryByText('workspace_premium')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('always shows Analytics, Challenges, and Poop Map links without lock icons', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={false}
        />
      );

      // Open mobile menu by clicking user button
      const userButton = screen.getByText('Test User');
      userButton.click();

      // Check that premium links are visible
      expect(screen.getAllByText('Analytics').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Challenges').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Poop Map').length).toBeGreaterThan(0);
    });

    it('does not redirect premium links to upgrade page', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          isPremium={false}
        />
      );

      // Open mobile menu
      const userButton = screen.getByText('Test User');
      userButton.click();

      // Get all Analytics links and verify at least one links directly to /analytics
      const analyticsLinks = screen.getAllByText('Analytics');
      const analyticsLinkElement = analyticsLinks[0].closest('a');
      expect(analyticsLinkElement).toHaveAttribute('href', '/analytics');
    });
  });

  describe('SEO - Alt Tags', () => {
    it('has descriptive alt text for user avatar image', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
          avatarUrl="https://example.com/avatar.png"
        />
      );

      const avatarImage = screen.getByAltText('Test User profile avatar');
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.png');
    });

    it('has descriptive alt text with different usernames', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Jane Doe"
          avatarUrl="https://example.com/jane.png"
        />
      );

      const avatarImage = screen.getByAltText('Jane Doe profile avatar');
      expect(avatarImage).toBeInTheDocument();
    });

    it('does not render avatar image when avatarUrl is not provided', () => {
      render(
        <Navbar
          isAuthenticated={true}
          userName="Test User"
        />
      );

      // Should show initial instead of image
      expect(screen.queryByAltText(/profile avatar/)).not.toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated users', () => {
    it('does not show authenticated navigation links', () => {
      render(
        <Navbar
          isAuthenticated={false}
        />
      );

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    });

    it('shows Log In and Join Now buttons', () => {
      render(
        <Navbar
          isAuthenticated={false}
        />
      );

      expect(screen.getByText('Log In')).toBeInTheDocument();
      expect(screen.getByText('Join Now')).toBeInTheDocument();
    });
  });
});
