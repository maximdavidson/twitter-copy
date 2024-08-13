import { db, storage } from '@/database';
import { doc, updateDoc, arrayUnion, Timestamp, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Tweet {
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

export const deleteTweetFromFirestore = async (userId: string, tweet: Tweet) => {
  try {
    await updateUserTweets(userId, { tweets: arrayRemove(tweet) });
  } catch (error) {
    console.error('Error deleting tweet from Firestore:', error);
  }
};
