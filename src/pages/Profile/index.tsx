import { FC } from 'react';
import { Navigation } from '@/components/Navigation';
import { UserSpace } from '@/components/UserSpace';
import style from './style.module.css';
import { NewTweetInput } from '@/components/NewTweetInput';
import { TweetList } from '@/components/TweetList';

export const Profile: FC = () => {
  return (
    <div className={style.container}>
      <div>
        <Navigation />
      </div>
      <div className={style.content}>
        <UserSpace />
        <NewTweetInput />
        <TweetList />
      </div>
    </div>
  );
};
