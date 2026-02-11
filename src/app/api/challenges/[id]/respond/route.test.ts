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
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
  createAdminClient: jest.fn().mockImplementation(() => mockSupabaseClient),
}));

describe('US-002: Open premium API routes - Challenge Respond', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH /api/challenges/[id]/respond', () => {
    it('should allow authenticated non-premium users to respond to challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { PATCH } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges/123/respond', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'accepted' }),
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { PATCH } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges/123/respond', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'accepted' }),
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to respond to challenges', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { PATCH } = await import('./route');
      const request = new NextRequest('http://localhost/api/challenges/123/respond', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'accepted' }),
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
