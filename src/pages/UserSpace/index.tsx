import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../../database';
import { Loader } from '../../components/Loader';
import s from './style.module.css';
import background from '@assets/profile-back.webp';
import person from '@assets/person.png';

interface LocationState {
  name?: string;
}

export const UserSpace: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const state = location.state as LocationState;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'User');
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={s.container}>
      <div>
        <h3 className={s.name}>{state?.name || userName}</h3>
        <p className={s.count}>tweets count</p>
        <div className={s.wrapper}>
          <img className={s.background} src={background} alt="Background image" />
          <img className={s.avatar} src={person} alt="Avatar" />
        </div>
        <h2 className={s.name}>{state?.name || userName}</h2>
        <p className={`${s.email} ${s.count}`}>@email</p>
        <p className={s.info}>USER INFO FROM USER TEXT</p>
      </div>
      <div>
        <button className={s.btn_edit}>Edit Profile</button>
      </div>
    </div>
  );
};
