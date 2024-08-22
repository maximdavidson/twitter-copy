import { FC, useState } from 'react';
import bigline from '@/assets/BigLine.png';
import { Navigation } from '@/components/Navigation';
import { SearchUsers } from '@/components/SearchUsers';
import { Header } from '@/components/Header';
import { NewTweetInput } from '@/components/NewTweetInput';
import { AllUsersTweets } from '@/components/AllUsersTweets';
import style from './style.module.css';

export const Home: FC = () => {
  const [refreshTweets, setRefreshTweets] = useState(false);

  const handleTweetAdded = () => {
    setRefreshTweets(!refreshTweets);
  };

  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <main className={style.profile}>
        <Header title="Home" />
        <NewTweetInput onTweetAdded={handleTweetAdded} />
        <img className={style.bigline} src={bigline} alt="bigline" />
        <div className={style.main}>
          <AllUsersTweets key={refreshTweets.toString()} />
        </div>
      </main>
      <div className={style.search}>
        <SearchUsers />
      </div>
    </div>
  );
};
