import { db, storage } from '@/database';
import { doc, updateDoc, arrayUnion, Timestamp, arrayRemove, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface Tweet {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: Timestamp;
  likes: number;
  likedBy: string[];
}

const uploadImage = async (userId: string, imageFile: File): Promise<string> => {
  const storageRef = ref(storage, `tweets/${userId}/${Date.now()}_${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  return await getDownloadURL(storageRef);
};

const updateUserTweets = async (userId: string, tweetsUpdate: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, tweetsUpdate);
};

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
    };
    await updateUserTweets(userId, { tweets: arrayUnion(newTweet) });
  } catch (error) {
    console.error('Error adding tweet to Firestore:', error);
  }
};

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
