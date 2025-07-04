import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token'),
    },
  })),
}));

// Mock Firebase functions
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn(() => vi.fn()),
}));

import { submitQuestion, getQuestions, updateScore } from '@/lib/firebase-functions';
import { getAuth } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

describe('Firebase Functions', () => {
  const mockHttpsCallable = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(httpsCallable).mockReturnValue(mockHttpsCallable);

    // Reset getAuth to return authenticated user by default
    vi.mocked(getAuth).mockReturnValue({
      currentUser: {
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
      },
    } as any);
  });

  describe('submitQuestion', () => {
    it('submits question with user token', async () => {
      mockHttpsCallable.mockResolvedValue({ data: { success: true, id: 'test-id' } });

      const result = await submitQuestion('Test question');

      expect(mockHttpsCallable).toHaveBeenCalledWith({
        question: { text: 'Test question' },
        userToken: 'mock-token',
      });
      expect(result).toEqual({ success: true, id: 'test-id' });
    });

    it('throws error when user not authenticated', async () => {
      vi.mocked(getAuth).mockReturnValue({
        currentUser: null,
      } as any);

      await expect(submitQuestion('Test question')).rejects.toThrow('User not authenticated');
    });
  });

  describe('getQuestions', () => {
    it('fetches questions with user token', async () => {
      const mockQuestions = [{ id: '1', text: 'Test', accepted: true }];
      mockHttpsCallable.mockResolvedValue({ data: { questions: mockQuestions } });

      const result = await getQuestions();

      expect(mockHttpsCallable).toHaveBeenCalledWith({ userToken: 'mock-token' });
      expect(result).toEqual(mockQuestions);
    });
  });

  describe('updateScore', () => {
    it('updates score with user token', async () => {
      mockHttpsCallable.mockResolvedValue({ data: { success: true } });

      const result = await updateScore(100);

      expect(mockHttpsCallable).toHaveBeenCalledWith({
        score: 100,
        userToken: 'mock-token',
      });
      expect(result).toEqual({ success: true });
    });
  });
});
