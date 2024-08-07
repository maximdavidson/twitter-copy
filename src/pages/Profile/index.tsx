import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../../database';
import { Navigation } from '../../components/Navigation';
import s from './style.module.css';

interface LocationState {
  name?: string;
}

export const Profile: FC = () => {
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
    return <div>Loading...</div>;
  }

  return (
    <div className={s.container}>
      <Navigation />
      <div className={s.content}>
        <h1>Hello, {state?.name || userName}!</h1>
      </div>
    </div>
  );
};
