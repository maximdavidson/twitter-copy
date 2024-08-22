import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, auth, onAuthStateChanged } from '@/database';
import { useProfileHandler } from '@/hooks/useProfileHandler';
import { useAvatarHandler } from '@/hooks/useAvatarHandler';
import { useBackgroundHandler } from '@/hooks/useBackgroundHandler';
import { getUserTweetCount } from '@/utils/getUserTweetCount';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { Loader } from '@/components/Loader';
import { RootState } from '@/store';
import { setAvatarUrl, setUser, setUserName, setUserTelegram, setGender } from '@/store/userSlice';
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

  const state = location.state as LocationState;

  const { handleSaveProfile, isSaving: isSavingProfile } = useProfileHandler();
  const {
    handleAvatarChange,
    isSaving: isSavingAvatar,
    error: avatarError,
  } = useAvatarHandler(setLocalAvatarUrl);
  const {
    handleBackgroundChange,
    isSaving: isSavingBackground,
    error: backgroundError,
  } = useBackgroundHandler(setBackgroundUrl);

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

  if (isLoading || isSavingProfile || isSavingAvatar || isSavingBackground) {
    return <Loader />;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfileClick = (name: string, telegram: string, gender: string, info: string) => {
    handleSaveProfile(name, telegram, gender, info, setUserInfo, setIsModalOpen);
  };

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={style.container}>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfileClick}
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
        {(avatarError || backgroundError) && <p className={style.error}>{avatarError || backgroundError}</p>}
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
            <button className={style.btn_edit} onClick={handleEditProfileClick}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
