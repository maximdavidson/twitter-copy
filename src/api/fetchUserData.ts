import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/database';
import { Tweet, UserProfile } from '@/types';

export const fetchUserData = async (
  userId: string,
  setTweets: (tweets: Tweet[]) => void,
  setProfile: (profile: UserProfile | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  const userRef = doc(db, 'users', userId);

  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const sortedTweets = (data.tweets || []).sort(
        (a: Tweet, b: Tweet) =>
          new Date(b.timestamp.seconds * 1000).getTime() - new Date(a.timestamp.seconds * 1000).getTime(),
      );
      setTweets(sortedTweets);
      setProfile({
        displayName: data.displayName || '',
        telegram: data.telegram || '',
        avatar: data.avatar || '',
        gender: '',
      });
    } else {
      setTweets([]);
    }
    setLoading(false);
  });

  return unsubscribe;
};
