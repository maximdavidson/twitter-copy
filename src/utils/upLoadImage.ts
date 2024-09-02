import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/database';

export const uploadImage = async (userId: string, imageFile: File): Promise<string> => {
  const storageRef = ref(storage, `tweets/${userId}/${Date.now()}_${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  return await getDownloadURL(storageRef);
};
