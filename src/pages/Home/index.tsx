import { FC } from 'react';
import { Navigation } from '@/components/Navigation';
import style from './style.module.css';
import { SearchingResult } from '@/components/TweetSearchResult';
import { SearchTweets } from '@/components/Search';

export const Home: FC = () => {
  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <SearchingResult />
      </div>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
