import { useState } from 'react';
import { db } from '@/database';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Tweet } from '@/types';

export const useHandleLike = (initialTweets: Tweet[], userId: string | null) => {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);

  const handleLike = async (index: number) => {
    if (!userId) return;

    const tweet = tweets[index];
    const userRef = doc(db, 'users', tweet.userId);
    const likedBy = Array.isArray(tweet.likedBy) ? tweet.likedBy : [];

    const alreadyLiked = likedBy.includes(userId);
    const updatedLikes = alreadyLiked ? tweet.likes - 1 : tweet.likes + 1;
    const updatedLikedBy = alreadyLiked ? likedBy.filter((uid) => uid !== userId) : [...likedBy, userId];

    const updatedTweet = { ...tweet, likes: updatedLikes, likedBy: updatedLikedBy };

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userTweets = userDoc.data()?.tweets || [];
        const updatedTweets = userTweets.map((t: Tweet) => (t.id === tweet.id ? updatedTweet : t));

        await updateDoc(userRef, { tweets: updatedTweets });

        setTweets((prevTweets) => prevTweets.map((t, i) => (i === index ? updatedTweet : t)));
      } else {
        console.error('User document does not exist.');
      }
    } catch (error) {
      console.error('Error liking/unliking tweet:', error);
    }
  };

  return { tweets, setTweets, handleLike };
};
