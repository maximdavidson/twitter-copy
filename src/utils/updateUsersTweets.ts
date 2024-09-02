import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/database';

export const updateUserTweets = async (userId: string, tweetsUpdate: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, tweetsUpdate);
};
