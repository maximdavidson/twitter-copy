import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, updateProfile as firebaseUpdateProfile } from '@/database';
import { AppDispatch } from '@/store';
import { setUserName, setUserNickname } from '@/store/userSlice';

export const updateProfile = async (
  user: User,
  name: string,
  nickname: string,
  info: string,
  dispatch: AppDispatch,
) => {
  try {
    await firebaseUpdateProfile(user, { displayName: name });

    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        displayName: name,
        email: user.email || '',
        nickname: nickname,
        info: info,
      },
      { merge: true },
    );

    dispatch(setUserName(name));
    dispatch(setUserNickname(nickname));
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
