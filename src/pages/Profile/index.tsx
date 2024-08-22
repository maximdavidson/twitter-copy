import { FC } from 'react';
import { Navigation } from '@/components/Navigation';
import { UserSpace } from '@/components/UserSpace';
import { NewTweetInput } from '@/components/NewTweetInput';
import { TweetList } from '@/components/TweetList';
import { SearchTweets } from '@/components/SearchTweets';
import style from './style.module.css';

export const Profile: FC = () => {
  return (
    <div className={style.container}>
      <header className={style.navigation}>
        <Navigation />
      </header>
      <main className={style.profile}>
        <section className={style.userSpace}>
          <UserSpace />
        </section>
        <section className={style.newTweet}>
          <NewTweetInput />
        </section>
        <section className={style.tweetList}>
          <TweetList />
        </section>
      </main>
      <aside className={style.search}>
        <SearchTweets />
      </aside>
    </div>
  );
};
