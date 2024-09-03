import { doc, getDoc, arrayRemove } from 'firebase/firestore';
import { db } from '@/database';
import { updateUserTweets } from '@/utils/updateUsersTweets';
import { Tweet } from '@/types';

export const deleteTweetFromFirestore = async (userId: string, tweetId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      const tweets = data.tweets || [];
      const tweetToRemove = tweets.find((tweet: Tweet) => tweet.id === tweetId);
      if (tweetToRemove) {
        await updateUserTweets(userId, { tweets: arrayRemove(tweetToRemove) });
      }
    }
  } catch (error) {
    console.error('Error deleting tweet from Firestore:', error);
  }
};
