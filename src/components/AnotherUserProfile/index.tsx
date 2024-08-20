import { FC } from 'react';
import { UserProfile as UserProfileType, Tweet } from '@/types';
import style from './style.module.css';
import { UserInfo } from './components/UserInfo';
import { UserTweets } from './components/UserTweets';

interface AnotherUserProfileProps {
  profile: UserProfileType;
  tweets: Tweet[];
}

export const AnotherUserProfile: FC<AnotherUserProfileProps> = ({ profile, tweets }) => {
  return (
    <div className={style.container}>
      <UserInfo profile={profile} />
      <UserTweets tweets={tweets} profile={profile} />
    </div>
  );
};
