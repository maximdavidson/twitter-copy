import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/database';

export const getUserTweetCount = (userId: string, callback: (count: number) => void) => {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(
    userRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const tweets = data.tweets || [];
        callback(tweets.length);
      } else {
        callback(0);
      }
    },
    (error) => {
      console.error('Error subscribing to user tweet count:', error);
      callback(0);
    },
  );
};
