import { updateUserTweets } from '@/utils/updateUsersTweets';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/database';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('@/database', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

describe('updateUserTweets', () => {
  it('should update user tweets', async () => {
    const userId = 'testUserId';
    const tweetsUpdate = { tweet: 'Hello World' };
    const userRef = {};

    (doc as jest.Mock).mockReturnValue(userRef);

    await updateUserTweets(userId, tweetsUpdate);

    expect(doc).toHaveBeenCalledWith(db, 'users', userId);
    expect(updateDoc).toHaveBeenCalledWith(userRef, tweetsUpdate);
  });
});
