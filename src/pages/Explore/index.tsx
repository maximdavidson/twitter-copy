import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import style from './style.module.css';
import { Navigation } from '@/components/Navigation';
import { TweetSearchResult } from '@/components/TweetSearchResult';
import { SearchTweets } from '@/components/Search';
import { Header } from '@/components/Header';
import { Tweet, UserProfile } from '@/types';

export const Explore: FC = () => {
  const location = useLocation();
  const { profile, tweets }: { profile: UserProfile; tweets: Tweet[] } = location.state || {
    profile: null,
    tweets: [],
  };

  const handleLikeTweet = () => {
    // Логика лайка твита
  };

  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <Header title="Explore" />
        {profile && tweets && (
          <TweetSearchResult tweets={tweets} profile={profile} onLikeTweet={handleLikeTweet} />
        )}
      </div>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
