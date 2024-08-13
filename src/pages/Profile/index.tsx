import { FC } from 'react';
import { Navigation } from '@/components/Navigation';
import { UserSpace } from '@/components/UserSpace';
import style from './style.module.css';
import { NewTweetInput } from '@/components/NewTweetInput';
import { TweetList } from '@/components/TweetList';
import { SearchTweets } from '@/components/Search';

export const Profile: FC = () => {
  return (
    <div className={style.container}>
      <div className={style.navigation}>
        <Navigation />
      </div>
      <div className={style.profile}>
        <UserSpace />
        <NewTweetInput />
        <TweetList />
      </div>
      <div className={style.search}>
        <SearchTweets />
      </div>
    </div>
  );
};
