import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/database';

export const updateAvatar = async (user: User, file: File, setLocalAvatarUrl: (url: string) => void) => {
  const storage = getStorage();
  const storageRef = ref(storage, `avatars/${user.uid}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { avatar: downloadURL }, { merge: true });

    setLocalAvatarUrl(downloadURL);
  } catch (error) {
    console.error('Error uploading avatar:', error);
  }
};
