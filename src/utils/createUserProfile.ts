import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/database';
import { User } from 'firebase/auth';

export const createUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const displayName = user.displayName || '';
    const defaultNickname = `@${displayName.toLowerCase().replace(/\s/g, '').slice(0, 10)}`;
    await setDoc(userRef, {
      displayName: user.displayName || '',
      email: user.email || '',
      nickname: defaultNickname,
      info: '',
      avatar: '',
      background: '',
      tweets: [],
    });
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
  }
};
