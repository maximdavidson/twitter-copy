import { useState, useEffect, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth, onAuthStateChanged, updateProfile as firebaseUpdateProfile } from '@/database';
import { Loader } from '@/components/Loader';
import style from './style.module.css';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface LocationState {
  name?: string;
}

export const UserSpace: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const [userInfo, setUserInfo] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>(person);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(background);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const state = location.state as LocationState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        const userData = docSnap.data();

        setUserName(user.displayName || 'User');
        setUserNickname(userData?.nickname || '');
        setUserInfo(userData?.info || '');
        setAvatarUrl(userData?.avatar || person);
        setBackgroundUrl(userData?.background || background);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (name: string, nickname: string, info: string) => {
    if (auth.currentUser) {
      setIsSaving(true);

      try {
        await firebaseUpdateProfile(auth.currentUser, { displayName: name });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(
          userRef,
          {
            displayName: name,
            email: auth.currentUser.email || '',
            nickname: nickname,
            info: info,
          },
          { merge: true },
        );

        setUserName(name);
        setUserNickname(nickname);
        setUserInfo(info);

        const user = auth.currentUser;
        if (user) {
          await user.reload();
          setUserName(user.displayName || name);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${auth.currentUser?.uid}`);

      setIsSaving(true);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userRef, { avatar: downloadURL }, { merge: true });

          setAvatarUrl(downloadURL);
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `backgrounds/${auth.currentUser?.uid}`);

      setIsSaving(true);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userRef, { background: downloadURL }, { merge: true });

          setBackgroundUrl(downloadURL);
        }
      } catch (error) {
        console.error('Error uploading background:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading || isSaving) {
    return <Loader />;
  }

  return (
    <div className={style.container}>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
        currentName={userName || ''}
        currentNickname={userNickname}
        currentInfo={userInfo}
      />
      <div>
        <h3 className={style.name}>{state?.name || userName}</h3>
        <p className={style.count}>tweets count</p>
        <div className={style.wrapper}>
          <label className={style.background_label}>
            <input type="file" onChange={handleBackgroundChange} className={style.background_input} />
            <div className={style.background_container}>
              <img className={style.background} src={backgroundUrl} alt="Background" />
            </div>
          </label>
          <label className={style.avatar_label}>
            <input type="file" onChange={handleAvatarChange} className={style.avatar_input} />
            <div className={style.avatar_container}>
              <img className={style.avatar} src={avatarUrl} alt="Avatar" />
            </div>
          </label>
        </div>
        <h2 className={style.name}>{state?.name || userName}</h2>
        <p className={`${style.email} ${style.count}`}>{userNickname}</p>
        <p className={style.info}>{userInfo}</p>
      </div>
      <div>
        <button className={style.btn_edit} onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};
