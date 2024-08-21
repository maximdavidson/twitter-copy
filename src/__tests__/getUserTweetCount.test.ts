import { onSnapshot, doc } from 'firebase/firestore';
import { getUserTweetCount } from '@/utils/getUserTweetCount';

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('@/database', () => ({
  db: {},
}));

describe('getUserTweetCount', () => {
  const userId = 'testUserId';
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupMockOnSnapshot = (exists: boolean, data = {}) => {
    (doc as jest.Mock).mockReturnValue({});
    (onSnapshot as jest.Mock).mockImplementation((docRef, onNext, onError) => {
      onNext({ exists: () => exists, data: () => data });
      return jest.fn();
    });
  };

  it('should call callback with the tweet count when document exists', () => {
    setupMockOnSnapshot(true, { tweets: ['tweet1', 'tweet2'] });

    getUserTweetCount(userId, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(2);
  });

  it('should call callback with 0 when document does not exist', () => {
    setupMockOnSnapshot(false);

    getUserTweetCount(userId, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(0);
  });

  it('should call callback with 0 and log an error when an error occurs', () => {
    const mockError = new Error('Test error');
    (doc as jest.Mock).mockReturnValue({});
    (onSnapshot as jest.Mock).mockImplementation((docRef, onNext, onError) => {
      onError(mockError);
      return jest.fn();
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    getUserTweetCount(userId, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith(0);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error subscribing to user tweet count:', mockError);

    consoleErrorSpy.mockRestore();
  });
});
