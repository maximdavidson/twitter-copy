import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth, onAuthStateChanged, updateProfile as firebaseUpdateProfile } from '@/database';
import { Loader } from '@/components/Loader';
import style from './style.module.css';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { User } from 'firebase/auth'; // Импортируйте тип User из firebase/auth
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Загрузите данные из Firestore, если это необходимо
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        const userData = docSnap.data();
        
        setUserName(user.displayName || 'User');
        setUserNickname(userData?.nickname || '');
        setUserInfo(userData?.info || '');
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
      } catch (error) {
        console.error('Error updating profile:', error);
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
