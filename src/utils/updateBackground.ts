import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/database';

export const updateBackground = async (user: User, file: File, setBackgroundUrl: (url: string) => void) => {
  const storage = getStorage();
  const storageRef = ref(storage, `backgrounds/${user.uid}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { background: downloadURL }, { merge: true });

    setBackgroundUrl(downloadURL);
  } catch (error) {
    console.error('Error uploading background:', error);
  }
};
