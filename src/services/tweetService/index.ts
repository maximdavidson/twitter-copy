import { db, storage } from '@/database';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const addTweetToFirestore = async (userId: string, text: string, imageFile: File | null) => {
  try {
    let imageUrl = '';
    if (imageFile) {
      const storageRef = ref(storage, `tweets/${userId}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      tweets: arrayUnion({
        text,
        imageUrl,
        timestamp: Timestamp.now(),
      }),
    });
  } catch (error) {
    console.error('Error adding tweet to Firestore:', error);
  }
};
