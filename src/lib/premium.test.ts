import { isPremium } from './premium';

describe('US-004: isPremium function', () => {
  describe('universal premium access', () => {
    it('should return true for any userId', async () => {
      const result = await isPremium('user-123');
      expect(result).toBe(true);
    });

    it('should return true for empty string userId', async () => {
      const result = await isPremium('');
      expect(result).toBe(true);
    });

    it('should return true for UUID format userId', async () => {
      const result = await isPremium('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toBe(true);
    });

    it('should return true for random string userId', async () => {
      const result = await isPremium('some-random-string-123');
      expect(result).toBe(true);
    });
  });

  describe('API compatibility', () => {
    it('should maintain async function signature', async () => {
      // Verify the function is async and returns a Promise
      const result = isPremium('test-user');
      expect(result).toBeInstanceOf(Promise);
      
      const resolved = await result;
      expect(typeof resolved).toBe('boolean');
    });

    it('should accept a string parameter', async () => {
      // This test ensures the function signature remains compatible
      const testUserId = 'test-user-id';
      await expect(isPremium(testUserId)).resolves.toBe(true);
    });
  });
});
