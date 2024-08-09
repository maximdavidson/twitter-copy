import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, updateProfile as firebaseUpdateProfile } from '@/database';
import { Loader } from '@/components/Loader';
import style from './style.module.css';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface LocationState {
  name?: string;
}

export const UserSpace: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const [userInfo, setUserInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const state = location.state as LocationState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'User');
        setUserNickname(user.displayName ? `@${user.displayName}` : '');
        setUserInfo('ABOUT YOU');
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
      try {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: name,
        });
        setUserName(name);
        setUserNickname(nickname);
        setUserInfo(info);
      } catch (error) {
        console.error('Error updating profile', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={style.container}>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        currentName={userName || ''}
        currentNickname={userNickname}
        currentInfo={userInfo}
      />
      <div>
        <h3 className={style.name}>{state?.name || userName}</h3>
        <p className={style.count}>tweets count</p>
        <div className={style.wrapper}>
          <img className={style.background} src={background} alt="Background image" />
          <img className={style.avatar} src={person} alt="Avatar" />
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
