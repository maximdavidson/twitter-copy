import { FC, useState } from 'react';
import bigline from '@/assets/BigLine.png';
import { Navigation } from '@/components/Navigation';
import { SearchTweets } from '@/components/Search';
import { HomeHeader } from '@/components/HomeHeader';
import { NewTweetInput } from '@/components/NewTweetInput';
import { AllUsersTweets } from '@/components/AllUsersTweets';
import style from './style.module.css';

export const HomeMain: FC = () => {
  const [refreshTweets, setRefreshTweets] = useState(false);

  const handleTweetAdded = () => {
    setRefreshTweets(!refreshTweets);
  };

  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <HomeHeader />
        <NewTweetInput onTweetAdded={handleTweetAdded} />
        <img className={style.bigline} src={bigline} alt="bigline" />
        <div className={style.main}>
          <AllUsersTweets key={refreshTweets.toString()} />
        </div>
      </div>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
