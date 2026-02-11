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
    in: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ 
      data: { user_id: 'owner-123', place_name: 'Test Place' } 
    }),
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
  createAdminClient: jest.fn().mockImplementation(() => mockSupabaseClient),
}));

describe('US-002: Open premium API routes - Location Comments', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/locations/[id]/comments', () => {
    it('should allow authenticated non-premium users to access comments', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments');
      const response = await GET(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments');
      const response = await GET(request, { params: Promise.resolve({ id: '123' }) });
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to access comments', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments');
      const response = await GET(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe('POST /api/locations/[id]/comments', () => {
    it('should allow authenticated non-premium users to create comments', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments', {
        method: 'POST',
        body: JSON.stringify({ body: 'Test comment' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments', {
        method: 'POST',
        body: JSON.stringify({ body: 'Test comment' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: '123' }) });
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to create comments', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/locations/123/comments', {
        method: 'POST',
        body: JSON.stringify({ body: 'Premium comment' }),
      });

      const response = await POST(request, { params: Promise.resolve({ id: '123' }) });

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
