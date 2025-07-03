import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitQuestion, getQuestions, updateScore } from '@/lib/firebase-functions';

// Mock Firebase auth
const mockGetIdToken = vi.fn();
const mockUser = { getIdToken: mockGetIdToken };

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: mockUser,
  })),
}));

// Mock Firebase functions
const mockHttpsCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn(() => mockHttpsCallable),
}));

describe('Firebase Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIdToken.mockResolvedValue('mock-token');
  });

  describe('submitQuestion', () => {
    it('submits question with user token', async () => {
      mockHttpsCallable.mockResolvedValue({ data: { success: true, id: 'test-id' } });

      const result = await submitQuestion('Test question');

      expect(mockGetIdToken).toHaveBeenCalled();
      expect(mockHttpsCallable).toHaveBeenCalledWith({
        question: { text: 'Test question' },
        userToken: 'mock-token',
      });
      expect(result).toEqual({ success: true, id: 'test-id' });
    });

    it('throws error when user not authenticated', async () => {
      vi.mocked(vi.mocked(require('firebase/auth')).getAuth).mockReturnValue({
        currentUser: null,
      });

      await expect(submitQuestion('Test question')).rejects.toThrow('User not authenticated');
    });
  });

  describe('getQuestions', () => {
    it('fetches questions with user token', async () => {
      const mockQuestions = [{ id: '1', text: 'Test', accepted: true }];
      mockHttpsCallable.mockResolvedValue({ data: { questions: mockQuestions } });

      const result = await getQuestions();

      expect(mockGetIdToken).toHaveBeenCalled();
      expect(mockHttpsCallable).toHaveBeenCalledWith({ userToken: 'mock-token' });
      expect(result).toEqual(mockQuestions);
    });
  });

  describe('updateScore', () => {
    it('updates score with user token', async () => {
      mockHttpsCallable.mockResolvedValue({ data: { success: true } });

      const result = await updateScore(100);

      expect(mockGetIdToken).toHaveBeenCalled();
      expect(mockHttpsCallable).toHaveBeenCalledWith({
        score: 100,
        userToken: 'mock-token',
      });
      expect(result).toEqual({ success: true });
    });
  });
});
