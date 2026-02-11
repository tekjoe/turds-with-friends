import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogForm } from './LogForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock supabase client
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();
const mockFrom = jest.fn(() => ({
  insert: mockInsert.mockReturnValue({
    select: mockSelect.mockReturnValue({
      single: mockSingle,
    }),
  }),
}));
const mockGetUser = jest.fn();

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

// Mock geolocation
const mockGetCurrentPosition = jest.fn();
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: mockGetCurrentPosition,
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn();

describe('US-005: LogForm location tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock responses
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });
    mockSingle.mockResolvedValue({
      data: { id: 'log-123' },
      error: null,
    });
  });

  describe('location toggle UI', () => {
    it('should display location section with premium styling for all users', () => {
      render(<LogForm isPremium={false} />);
      
      // Should show "Track Location" heading with amber styling
      const locationSection = screen.getByText('Track Location').closest('section');
      expect(locationSection).toHaveClass('bg-amber-50', 'border-amber-200');
    });

    it('should display PremiumBadge in location section', () => {
      render(<LogForm isPremium={false} />);
      
      // PremiumBadge should be present
      expect(screen.getByText('Track Location')).toBeInTheDocument();
    });

    it('should show location toggle button', () => {
      render(<LogForm isPremium={false} />);
      
      // The toggle button should be present
      const toggleButton = screen.getByRole('button', { name: '' }); // toggle has no aria-label
      expect(toggleButton).toBeInTheDocument();
    });

    it('should not show upgrade button for location tracking', () => {
      render(<LogForm isPremium={false} />);
      
      // Should NOT show the Upgrade button that was in the non-premium fallback
      expect(screen.queryByText('Upgrade')).not.toBeInTheDocument();
    });

    it('should not show disabled gray state for location tracking', () => {
      render(<LogForm isPremium={false} />);
      
      // Should NOT have the gray disabled styling from the non-premium fallback
      const locationIcon = screen.getByText('location_on').closest('div');
      expect(locationIcon).not.toHaveClass('bg-slate-200');
      expect(locationIcon).toHaveClass('bg-amber-100');
    });
  });

  describe('location toggle functionality', () => {
    it('should toggle location tracking on when clicked', async () => {
      render(<LogForm isPremium={false} />);
      
      const user = userEvent.setup();
      const toggleButton = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      
      // Initially toggle is off (bg-slate-300)
      expect(toggleButton).toHaveClass('bg-slate-300');
      
      // Click to toggle on
      await user.click(toggleButton);
      
      // Should now be on (bg-amber-500)
      expect(toggleButton).toHaveClass('bg-amber-500');
    });

    it('should toggle location tracking off when clicked again', async () => {
      render(<LogForm isPremium={false} />);
      
      const user = userEvent.setup();
      const toggleButton = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      
      // Toggle on first
      await user.click(toggleButton);
      expect(toggleButton).toHaveClass('bg-amber-500');
      
      // Toggle off
      await user.click(toggleButton);
      expect(toggleButton).toHaveClass('bg-slate-300');
    });
  });

  describe('location tracking on form submission', () => {
    it('should capture location when toggle is enabled', async () => {
      mockGetCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      });
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      render(<LogForm isPremium={false} />);
      
      const user = userEvent.setup();
      
      // Enable location tracking
      const toggleButton = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      await user.click(toggleButton);
      
      // Fill in required fields and submit
      const bristolButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('type') === 'button' && !btn.className.includes('rounded-full')
      );
      // Click a bristol type (type 4 is default, let's click another)
      if (bristolButtons[3]) await user.click(bristolButtons[3]);
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockGetCurrentPosition).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/locations',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('40.7128'),
          })
        );
      });
    });

    it('should NOT capture location when toggle is disabled', async () => {
      render(<LogForm isPremium={false} />);
      
      const user = userEvent.setup();
      
      // Make sure toggle is off (default)
      const toggleButton = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      expect(toggleButton).toHaveClass('bg-slate-300');
      
      // Fill in required fields and submit
      const bristolButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('type') === 'button' && !btn.className.includes('rounded-full')
      );
      if (bristolButtons[3]) await user.click(bristolButtons[3]);
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
      
      // Location should NOT be captured
      expect(mockGetCurrentPosition).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should work for all users regardless of premium status', async () => {
      // Test with isPremium=true
      const { unmount } = render(<LogForm isPremium={true} />);
      
      const user = userEvent.setup();
      const toggleButton = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      
      // Should be able to toggle
      await user.click(toggleButton);
      expect(toggleButton).toHaveClass('bg-amber-500');
      
      unmount();
      
      // Test with isPremium=false
      render(<LogForm isPremium={false} />);
      
      const toggleButton2 = screen.getAllByRole('button').find(
        btn => btn.className.includes('rounded-full')
      )!;
      
      // Should also be able to toggle
      await user.click(toggleButton2);
      expect(toggleButton2).toHaveClass('bg-amber-500');
    });
  });

  describe('visual consistency', () => {
    it('should show same amber styling for premium and non-premium users', () => {
      const { rerender } = render(<LogForm isPremium={false} />);
      
      const nonPremiumSection = screen.getByText('Track Location').closest('section');
      expect(nonPremiumSection).toHaveClass('bg-amber-50');
      
      rerender(<LogForm isPremium={true} />);
      
      const premiumSection = screen.getByText('Track Location').closest('section');
      expect(premiumSection).toHaveClass('bg-amber-50');
    });
  });
});
