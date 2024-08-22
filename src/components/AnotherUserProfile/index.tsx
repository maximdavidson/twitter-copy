import { FC } from 'react';
import { UserProfile as UserProfileType, Tweet } from '@/types';
import { UserInfo } from './components/UserInfo';
import { UserTweets } from './components/UserTweets';

interface AnotherUserProfileProps {
  profile: UserProfileType;
  tweets: Tweet[];
}

export const AnotherUserProfile: FC<AnotherUserProfileProps> = ({ profile, tweets }) => {
  return (
    <>
      <UserInfo profile={profile} />
      <UserTweets tweets={tweets} profile={profile} />
    </>
  );
};
