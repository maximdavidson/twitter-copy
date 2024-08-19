import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { db, auth, onAuthStateChanged } from '@/database';
import { doc, getDoc } from 'firebase/firestore';
import { Loader } from '@/components/Loader';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { RootState } from '@/store';
import { setAvatarUrl, setUser, setUserName, setUserTelegram, setGender } from '@/store/userSlice';
import { updateProfile } from '@/utils/updateProfile';
import { updateAvatar } from '@/utils/updateAvatar';
import { updateBackground } from '@/utils/updateBackground';
import { getUserTweetCount } from '@/utils/getUserTweetCount';
import { validateImage } from '@/validation';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';

import style from './style.module.css';

interface LocationState {
  name?: string;
}

export const UserSpace: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userName, userTelegram, gender } = useSelector((state: RootState) => state.user);
  const [userInfo, setUserInfo] = useState<string>('');
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(person);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(background);
  const [tweetCount, setTweetCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(null); // Состояние для хранения ID таймера

  const state = location.state as LocationState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        const userData = docSnap.data();

        dispatch(setUser(user));
        dispatch(setUserName(user.displayName || 'User'));
        dispatch(setUserTelegram(userData?.telegram || ''));
        dispatch(setAvatarUrl(userData?.avatar || person));
        dispatch(setGender(userData?.gender || ''));

        setUserInfo(userData?.info || '');
        setLocalAvatarUrl(userData?.avatar || person);
        setBackgroundUrl(userData?.background || background);

        await getUserTweetCount(user.uid, setTweetCount);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (name: string, telegram: string, gender: string, info: string) => {
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, name, telegram, gender, info, dispatch);

        dispatch(setUserName(name));
        dispatch(setUserTelegram(telegram));
        dispatch(setGender(gender));
        setUserInfo(info);
      }
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);

        if (errorTimeoutId) clearTimeout(errorTimeoutId);

        const timeoutId = setTimeout(() => {
          setError(null);
        }, 3000);

        setErrorTimeoutId(timeoutId);
        return;
      }

      setIsSaving(true);
      try {
        if (auth.currentUser) {
          await updateAvatar(auth.currentUser, file, setLocalAvatarUrl);
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);

        if (errorTimeoutId) clearTimeout(errorTimeoutId);

        const timeoutId = setTimeout(() => {
          setError(null);
        }, 3000);

        setErrorTimeoutId(timeoutId);
        return;
      }

      setIsSaving(true);
      try {
        if (auth.currentUser) {
          await updateBackground(auth.currentUser, file, setBackgroundUrl);
        }
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
        currentTelegram={userTelegram}
        currentGender={gender || ''}
        currentInfo={userInfo}
      />
      <div>
        <h3 className={style.name}>{state?.name || userName}</h3>
        <p className={style.count}>{tweetCount} tweets</p>
        <div className={style.wrapper}>
          <label className={style.background_label}>
            <input type="file" onChange={handleBackgroundChange} className={style.background_input} />
            <div className={style.background_container}>
              <img className={style.background} src={backgroundUrl} alt="Background" />
              <div className={style.replacement_icon} />
            </div>
          </label>
          <label className={style.avatar_label}>
            <input type="file" onChange={handleAvatarChange} className={style.avatar_input} />
            <div className={style.avatar_container}>
              <img className={style.avatar} src={localAvatarUrl} alt="Avatar" />
              <div className={style.replacement_icon} />
            </div>
          </label>
        </div>
        {error && <p className={style.error}>{error}</p>}
        <div className={style.main}>
          <div className={style.userInfo}>
            <h2 className={style.name}>{state?.name || userName}</h2>
            <p className={style.gender}>{gender || ''}</p>
            <p className={`${style.telegram} ${style.count}`}>{userTelegram}</p>
            <div className={style.user_input}>
              <p className={style.info}>{userInfo}</p>
            </div>
          </div>
          <div>
            <button className={style.btn_edit} onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
