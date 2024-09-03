import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/database';
import { User } from 'firebase/auth';

export const createUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      displayName: user.displayName || '',
      email: user.email || '',
      telegram: '',
      gender: '',
      info: '',
      avatar: '',
      background: '',
      tweets: [],
    });
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
  }
};
