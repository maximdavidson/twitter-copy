import { db, storage } from '@/database';
import { doc, updateDoc, arrayUnion, Timestamp, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Tweet {
  text: string;
  imageUrl?: string;
  timestamp: any;
  likes: number;
  likedBy: string[];
}

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
        likes: 0,
      }),
    });
  } catch (error) {
    console.error('Error adding tweet to Firestore:', error);
  }
};

export const deleteTweetFromFirestore = async (userId: string, tweet: Tweet) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      tweets: arrayRemove(tweet),
    });
  } catch (error) {
    console.error('Error deleting tweet from Firestore:', error);
  }
};
