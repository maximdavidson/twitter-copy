import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { TweetSearchResult } from '@/components/TweetSearchResult';
import { SearchTweets } from '@/components/SearchTweets';
import { Header } from '@/components/Header';
import { Tweet, UserProfile } from '@/types';
import style from './style.module.css';

export const PostList: FC = () => {
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
      <main className={style.profile}>
        <Header title="Posts" />
        {profile && initialTweets.length > 0 && (
          <TweetSearchResult tweets={initialTweets} profile={profile} />
        )}
      </main>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
