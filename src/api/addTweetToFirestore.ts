import { v4 as uuidv4 } from 'uuid';
import { Timestamp, arrayUnion } from 'firebase/firestore';
import { Tweet } from '@/types';
import { uploadImage } from '@/utils/upLoadImage';
import { updateUserTweets } from '@/utils/updateUsersTweets';

export const addTweetToFirestore = async (userId: string, text: string, imageFile: File | null) => {
  try {
    const imageUrl = imageFile ? await uploadImage(userId, imageFile) : '';
    const newTweet: Tweet = {
      id: uuidv4(),
      text,
      imageUrl,
      timestamp: Timestamp.now(),
      likes: 0,
      likedBy: [],
      userId: userId,
    };
    await updateUserTweets(userId, { tweets: arrayUnion(newTweet) });
  } catch (error) {
    console.error('Error adding tweet to Firestore:', error);
  }
};
