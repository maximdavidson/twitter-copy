import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { SearchUsers } from '@/components/SearchUsers';
import { Header } from '@/components/Header';
import { AnotherUserProfile } from '@/components/AnotherUserProfile';
import style from './style.module.css';
import { UserProfile as UserProfileType, Tweet } from '@/types';

export const Users: FC = () => {
  const location = useLocation();
  const profile = location.state?.profile as UserProfileType;
  const tweets = location.state?.tweets as Tweet[];

  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <Header title="User Profile" />
        <div className={style.main}>
          <AnotherUserProfile profile={profile} tweets={tweets} />
        </div>
      </div>
      <div className={style.search}>
        <SearchUsers />
      </div>
    </div>
  );
};
