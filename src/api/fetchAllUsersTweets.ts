import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/database';
import { Tweet, UserProfile } from '@/types';
import person from '@assets/person.png';

export const fetchAllUsersTweets = async (
  setTweets: (tweets: Tweet[]) => void,
  setProfiles: (profiles: Record<string, UserProfile>) => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const allTweets: Tweet[] = [];
    const profilesData: Record<string, UserProfile> = {};

    usersSnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile & { tweets: Tweet[] };
      const { displayName, telegram = 'No Telegram Info', avatar = person, tweets = [] } = userData;

      profilesData[doc.id] = {
        displayName,
        telegram,
        avatar,
      };

      tweets.forEach((tweet: Tweet) => {
        allTweets.push({ ...tweet, userId: doc.id });
      });
    });

    allTweets.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    setTweets(allTweets);
    setProfiles(profilesData);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching tweets or profiles:', error);
    setLoading(false);
  }
};
