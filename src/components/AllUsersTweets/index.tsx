import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Tweet, UserProfile } from '@/types';
import { Loader } from '../Loader';
import { useHandleLike } from '@/hooks/useHandleLike';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import style from './style.module.css';
import { fetchAllUsersTweets } from '@/api/fetchAllUsersTweets';

export const AllUsersTweets: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { tweets, setTweets, handleLike } = useHandleLike([], user?.uid || null);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsersTweets(setTweets, setProfiles, setLoading);
  }, [setTweets]);

  const handleLikeClick = (index: number) => () => {
    handleLike(index);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tweetList}>
      {tweets.length > 0 ? (
        tweets.map((tweet: Tweet, index: number) => {
          const profile = profiles[tweet.userId || ''] || {
            displayName: 'Unknown User',
            telegram: 'No Telegram Info',
            avatar: person,
          };
          return (
            <div key={tweet.id} className={style.tweet} data-testid="tweet">
              <div className={style.tweetHeader}>
                <span className={style.avatar_container}>
                  <img className={style.avatar} src={profile.avatar} alt="avatar" />
                </span>
                <div className={style.tweetInfo}>
                  <span className={style.userName}>{profile.displayName}</span>
                  <span className={style.userNickname}>{profile.telegram}</span>
                  <span className={style.timestamp}>
                    {new Date(tweet.timestamp.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p>{tweet.text}</p>
              {tweet.imageUrl && <img className={style.post_image} src={tweet.imageUrl} alt="tweet" />}
              <div data-testid="likes_container" className={style.likes_container}>
                <img
                  data-testid="like"
                  className={style.likeIcon}
                  src={
                    Array.isArray(tweet.likedBy) && tweet.likedBy.includes(user?.uid || '')
                      ? activelike
                      : like
                  }
                  alt="like"
                  onClick={handleLikeClick(index)}
                />
                <span>{tweet.likes || 0}</span>
              </div>
            </div>
          );
        })
      ) : (
        <p>No tweets available</p>
      )}
    </div>
  );
};
