import { redirect } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock supabase server client
const mockGetUser = jest.fn();
const mockSupabaseClient = {
  auth: {
    getUser: mockGetUser,
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
  createAdminClient: jest.fn().mockImplementation(() => mockSupabaseClient),
}));

// Mock isPremium
const mockIsPremium = jest.fn();
jest.mock('@/lib/premium', () => ({
  isPremium: mockIsPremium,
}));

// Mock chart components
jest.mock('@/components/analytics/MonthlyTrendsChart', () => ({
  MonthlyTrendsChart: () => null,
}));
jest.mock('@/components/analytics/TimeOfDayChart', () => ({
  TimeOfDayChart: () => null,
}));
jest.mock('@/components/analytics/BristolTrendsChart', () => ({
  BristolTrendsChart: () => null,
}));
jest.mock('@/components/challenges/ChallengeList', () => ({
  ChallengeList: () => null,
}));
jest.mock('@/components/map/PoopMap', () => ({
  PoopMap: () => null,
}));
jest.mock('@/components/upgrade/UpgradeClient', () => ({
  UpgradeClient: () => null,
}));

describe('US-001: Open premium pages - Page Access', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
    redirect.mockImplementation((path) => {
      throw new Error(`REDIRECT:${path}`);
    });
  });

  describe('Analytics Page', () => {
    it('should allow non-premium users to access analytics page without redirect', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(false);

      const { default: AnalyticsPage } = await import('./page');
      
      // Should not throw redirect
      await expect(AnalyticsPage()).resolves.not.toThrow();
      
      // Verify redirect was NOT called for /upgrade
      const upgradeRedirects = redirect.mock.calls.filter(call => call[0] === '/upgrade');
      expect(upgradeRedirects).toHaveLength(0);
      
      // Verify isPremium was still called
      expect(mockIsPremium).toHaveBeenCalledWith('user-123');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { default: AnalyticsPage } = await import('./page');
      
      await expect(AnalyticsPage()).rejects.toThrow('REDIRECT:/login');
    });

    it('should allow premium users to access analytics page', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(true);

      const { default: AnalyticsPage } = await import('./page');
      
      // Should not throw
      await expect(AnalyticsPage()).resolves.not.toThrow();
      
      // Verify no redirects at all
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('Challenges Page', () => {
    it('should allow non-premium users to access challenges page without redirect', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(false);

      const { default: ChallengesPage } = await import('../challenges/page');
      
      // Should not throw redirect
      await expect(ChallengesPage()).resolves.not.toThrow();
      
      // Verify redirect was NOT called for /upgrade
      const upgradeRedirects = redirect.mock.calls.filter(call => call[0] === '/upgrade');
      expect(upgradeRedirects).toHaveLength(0);
      
      // Verify isPremium was still called
      expect(mockIsPremium).toHaveBeenCalledWith('user-123');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { default: ChallengesPage } = await import('../challenges/page');
      
      await expect(ChallengesPage()).rejects.toThrow('REDIRECT:/login');
    });

    it('should allow premium users to access challenges page', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(true);

      const { default: ChallengesPage } = await import('../challenges/page');
      
      await expect(ChallengesPage()).resolves.not.toThrow();
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('Map Page', () => {
    it('should allow non-premium users to access map page without redirect', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(false);

      const { default: MapPage } = await import('../map/page');
      
      // Should not throw redirect
      await expect(MapPage()).resolves.not.toThrow();
      
      // Verify redirect was NOT called for /upgrade
      const upgradeRedirects = redirect.mock.calls.filter(call => call[0] === '/upgrade');
      expect(upgradeRedirects).toHaveLength(0);
      
      // Verify isPremium was still called
      expect(mockIsPremium).toHaveBeenCalledWith('user-123');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { default: MapPage } = await import('../map/page');
      
      await expect(MapPage()).rejects.toThrow('REDIRECT:/login');
    });

    it('should allow premium users to access map page', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(true);

      const { default: MapPage } = await import('../map/page');
      
      await expect(MapPage()).resolves.not.toThrow();
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe('Upgrade Page', () => {
    it('should allow premium users to access upgrade page without redirect', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(true);

      const { default: UpgradePage } = await import('../upgrade/page');
      
      // Should not throw redirect to dashboard
      await expect(UpgradePage()).resolves.not.toThrow();
      
      // Verify redirect was NOT called for dashboard with already_premium
      const dashboardRedirects = redirect.mock.calls.filter(call => call[0]?.includes('already_premium'));
      expect(dashboardRedirects).toHaveLength(0);
      
      // Verify isPremium was still called
      expect(mockIsPremium).toHaveBeenCalledWith('user-123');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { default: UpgradePage } = await import('../upgrade/page');
      
      await expect(UpgradePage()).rejects.toThrow('REDIRECT:/login');
    });

    it('should allow non-premium users to access upgrade page', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });
      mockIsPremium.mockResolvedValue(false);

      const { default: UpgradePage } = await import('../upgrade/page');
      
      await expect(UpgradePage()).resolves.not.toThrow();
      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
