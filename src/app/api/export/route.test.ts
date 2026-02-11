import { NextRequest } from 'next/server';

// Mock jspdf - must be before any imports
jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      text: jest.fn(),
      output: jest.fn().mockReturnValue(new ArrayBuffer(8)),
    })),
  };
});

jest.mock('jspdf-autotable', () => jest.fn());

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
  }),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => Promise.resolve(mockSupabaseClient)),
}));

describe('US-002: Open premium API routes - Export', () => {
  const mockUser = { id: 'user-123', user_metadata: {} };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/export', () => {
    it('should allow authenticated non-premium users to export data', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/export');
      const response = await GET(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/export');
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    it('should allow authenticated premium users to export data', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/export');
      const response = await GET(request);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should allow CSV export for authenticated non-premium users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/export?format=csv');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/csv');
    });

    it('should allow PDF export for authenticated non-premium users', async () => {
      mockGetUser.mockResolvedValue({ data: { user: mockUser } });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/export?format=pdf');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/pdf');
    });
  });
});
