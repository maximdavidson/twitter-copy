import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tweet, UserProfile } from '@/types';
import { useHandleLike } from '@/hooks/useHandleLike';
import { RootState } from '@/store';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { ROUTES } from '@/constants/routes';
import style from './style.module.css';

interface TweetSearchResultProps {
  tweets: Tweet[];
  profile: UserProfile;
}

export const TweetSearchResult: FC<TweetSearchResultProps> = ({ tweets: initialTweets, profile }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { tweets, setTweets, handleLike } = useHandleLike(initialTweets, user?.uid || null);

  useEffect(() => {
    setTweets(initialTweets);
  }, [initialTweets, setTweets]);

  const handleLikeClick = (index: number) => () => {
    handleLike(index);
  };

  const handleAvatarClick = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className={style.tweetList}>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <div key={tweet.id} className={style.tweet}>
            <div className={style.tweetHeader}>
              <span className={style.avatar_container} onClick={handleAvatarClick}>
                <img className={style.avatar} src={profile.avatar || person} alt="avatar" />
              </span>
              <div className={style.tweetInfo}>
                <span className={style.userName}>{profile.displayName}</span>
                <span className={style.userNickname}>{profile.telegram}</span>
                <span className={style.timestamp}>
                  {tweet.timestamp instanceof Date
                    ? tweet.timestamp.toLocaleDateString()
                    : new Date(tweet.timestamp.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p>{tweet.text}</p>
            {tweet.imageUrl && <img className={style.post_image} src={tweet.imageUrl} alt="tweet" />}
            <div className={style.likes_container} onClick={handleLikeClick(index)}>
              <img
                className={style.likeIcon}
                src={
                  Array.isArray(tweet.likedBy) && tweet.likedBy.includes(user?.uid || '') ? activelike : like
                }
                alt="like"
              />
              <span>{tweet.likes}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No tweets found</p>
      )}
    </div>
  );
};
