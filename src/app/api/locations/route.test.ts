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
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
}));

describe('US-002: Open premium API routes - Locations', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/locations', () => {
    it('should allow authenticated non-premium users to access locations', async () => {
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

    it('should allow authenticated premium users to access locations', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const response = await GET();

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('POST /api/locations', () => {
    it('should allow authenticated non-premium users to create locations', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations', {
        method: 'POST',
        body: JSON.stringify({
          movement_log_id: 'log-123',
          latitude: 40.7128,
          longitude: -74.0060,
          place_name: 'Test Location',
        }),
      });

      const response = await POST(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to create locations', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations', {
        method: 'POST',
        body: JSON.stringify({
          movement_log_id: 'log-456',
          latitude: 34.0522,
          longitude: -118.2437,
          place_name: 'Premium Location',
        }),
      });

      const response = await POST(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
