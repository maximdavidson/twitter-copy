import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup, googleProvider } from '@/database';
import { db } from '@/database';
import { doc, getDoc } from 'firebase/firestore';
import { createUserProfile } from '@/utils/createUserProfile';
import { ROUTES } from '@/constants/routes';

export const useGoogleSignIn = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await createUserProfile(user);
      }

      navigate(ROUTES.PROFILE, { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return { signInWithGoogle };
};
