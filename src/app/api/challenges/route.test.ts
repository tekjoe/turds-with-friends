import { NextRequest } from 'next/server';

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
    in: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 'challenge-123' } }),
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
  createAdminClient: jest.fn().mockImplementation(() => mockSupabaseClient),
}));

describe('US-002: Open premium API routes - Challenges', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/challenges', () => {
    it('should allow authenticated non-premium users to access challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const response = await GET();

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { GET } = await import('./route');
      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to access challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const response = await GET();

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('POST /api/challenges', () => {
    it('should allow authenticated non-premium users to create challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Challenge',
          challenge_type: 'most_logs',
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          friend_ids: [],
        }),
      });

      const response = await POST(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to create challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Premium Challenge',
          challenge_type: 'most_logs',
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          friend_ids: [],
        }),
      });

      const response = await POST(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
