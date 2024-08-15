import { useState, useEffect, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth, onAuthStateChanged } from '@/database';
import { Loader } from '@/components/Loader';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { RootState } from '@/store';
import { setAvatarUrl, setUser, setUserName, setUserNickname } from '@/store/userSlice';
import style from './style.module.css';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { updateProfile } from '@/utils/updateProfile';
import { updateAvatar } from '@/utils/updateAvatar';
import { updateBackground } from '@/utils/updateBackground';
import { getUserTweetCount } from '@/utils/getUserTweetCount';

interface LocationState {
  name?: string;
}

export const UserSpace: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userName, userNickname } = useSelector((state: RootState) => state.user);
  const [userInfo, setUserInfo] = useState<string>('');
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(person);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(background);
  const [tweetCount, setTweetCount] = useState<number>(0);
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

        dispatch(setUser(user));
        dispatch(setUserName(user.displayName || 'User'));
        dispatch(setUserNickname(userData?.nickname || ''));
        dispatch(setAvatarUrl(userData?.avatar || person));

        setUserInfo(userData?.info || '');
        setLocalAvatarUrl(userData?.avatar || person);
        setBackgroundUrl(userData?.background || background);

        const count = await getUserTweetCount(user.uid, (count) => {
          setTweetCount(count);
        });
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

  const handleSaveProfile = async (name: string, nickname: string, info: string) => {
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, name, nickname, info, dispatch);
        setUserInfo(info);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
        currentNickname={userNickname}
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
            </div>
          </label>
          <label className={style.avatar_label}>
            <input type="file" onChange={handleAvatarChange} className={style.avatar_input} />
            <div className={style.avatar_container}>
              <img className={style.avatar} src={localAvatarUrl} alt="Avatar" />
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
