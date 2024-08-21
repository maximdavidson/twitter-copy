import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import style from './style.module.css';
import { Navigation } from '@/components/Navigation';
import { TweetSearchResult } from '@/components/TweetSearchResult';
import { SearchTweets } from '@/components/SearchTweets';
import { Header } from '@/components/Header';
import { Tweet, UserProfile } from '@/types';

export const Explore: FC = () => {
  const location = useLocation();
  const { profile, tweets: initialTweets }: { profile: UserProfile; tweets: Tweet[] } = location.state || {
    profile: null,
    tweets: [],
  };

  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <Header title="Posts" />
        {profile && initialTweets.length > 0 && (
          <TweetSearchResult tweets={initialTweets} profile={profile} />
        )}
      </div>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
