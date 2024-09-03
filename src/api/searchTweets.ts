import { db } from '@/database';
import { collection, getDocs } from 'firebase/firestore';

interface UserResult {
  displayName: string;
  nickname: string;
  avatar: string;
}

export const searchTweets = async (searchTerm: string): Promise<UserResult[]> => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);

  const results: UserResult[] = [];

  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    const tweets = userData.tweets || [];

    tweets.forEach((tweet: any) => {
      if (tweet.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          displayName: userData.displayName || '',
          nickname: userData.nickname || '',
          avatar: userData.avatar || '',
        });
        return;
      }
    });
  });

  return results;
};
