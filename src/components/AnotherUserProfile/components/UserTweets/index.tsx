import { FC, useEffect } from 'react';
import { Tweet, UserProfile } from '@/types';
import line from '@assets/line.png';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { useHandleLike } from '@/hooks/useHandleLike';
import style from './style.module.css';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface UserTweetsProps {
  tweets: Tweet[];
  profile: UserProfile;
}

export const UserTweets: FC<UserTweetsProps> = ({ tweets: initialTweets, profile }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { tweets, setTweets, handleLike } = useHandleLike([], user?.uid || null);

  useEffect(() => {
    setTweets(initialTweets);
  }, [initialTweets, profile, setTweets]);

  const sortedTweets = [...tweets].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

  return (
    <div className={style.container}>
      <div className={style.title_wrap}>
        <p className={style.title}>Tweets</p>
        <img src={line} alt="line" />
      </div>
      <div className={style.tweets}>
        {sortedTweets && sortedTweets.length > 0 ? (
          sortedTweets.map((tweet, index) => (
            <div key={tweet.id} className={style.tweet}>
              <div className={style.tweetHeader}>
                <span className={style.avatar_container}>
                  <img className={style.avatar} src={profile.avatar || person} alt="avatar" />
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
              <div className={style.likes_container}>
                <img
                  className={style.likeIcon}
                  src={
                    Array.isArray(tweet.likedBy) && tweet.likedBy.includes(user?.uid || '')
                      ? activelike
                      : like
                  }
                  alt="like"
                  onClick={() => handleLike(index)}
                />
                <span>{tweet.likes || 0}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No tweets found for this user.</p>
        )}
      </div>
    </div>
  );
};
