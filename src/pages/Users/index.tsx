import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { SearchUsers } from '@/components/SearchUsers';
import { Header } from '@/components/Header';
import { AnotherUserProfile } from '@/components/AnotherUserProfile';
import { UserProfile as UserProfileType, Tweet } from '@/types';
import style from './style.module.css';

export const Users: FC = () => {
  const location = useLocation();
  const profile = location.state?.profile as UserProfileType;
  const tweets = location.state?.tweets as Tweet[];

  return (
    <div className={style.container}>
      <nav className={style.navigation}>
        <Navigation />
      </nav>
      <div className={style.profile}>
        <header>
          <Header title="User Profile" />
        </header>
        <section className={style.main}>
          <AnotherUserProfile profile={profile} tweets={tweets} />
        </section>
      </div>
      <aside className={style.search}>
        <SearchUsers />
      </aside>
    </div>
  );
};
