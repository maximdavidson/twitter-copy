import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/database';

export const fetchUserTheme = async (): Promise<'light' | 'dark'> => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data()?.theme || 'light';
  }
  return 'light';
};

export const updateUserTheme = async (theme: 'light' | 'dark') => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { theme });
    } catch (error) {
      console.error('Error updating user theme in Firestore:', error);
    }
  }
};
