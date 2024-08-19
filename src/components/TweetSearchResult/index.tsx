import { FC } from 'react';
import style from './style.module.css';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { useNavigate } from 'react-router-dom';
import { Tweet, UserProfile } from '@/types';

interface TweetSearchResultProps {
  tweets: Tweet[];
  profile: UserProfile;
  onLikeTweet: (index: number) => void;
}

export const TweetSearchResult: FC<TweetSearchResultProps> = ({ tweets, profile, onLikeTweet }) => {
  const navigate = useNavigate();

  return (
    <div className={style.tweetList}>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <div key={tweet.id} className={style.tweet}>
            <div className={style.tweetHeader}>
              <div className={style.avatar_container} onClick={() => navigate('/profile')}>
                <img className={style.avatar} src={profile.avatar || person} alt="avatar" />
              </div>
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
            {tweet.imageUrl && <img src={tweet.imageUrl} alt="tweet" className={style.tweetImage} />}
            <div className={style.likes_container} onClick={() => onLikeTweet(index)}>
              <img
                className={style.likeIcon}
                src={
                  Array.isArray(tweet.likedBy) && tweet.likedBy.includes(profile.telegram) ? activelike : like
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
