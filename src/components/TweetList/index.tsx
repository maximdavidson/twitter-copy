import { useEffect, useState, FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { deleteTweetFromFirestore } from '@/utils/deleteTweetFromFirestore';
import { convertToDate } from '@/utils/convertToDate';
import { useHandleLike } from '@/hooks/useHandleLike';
import { UserProfile } from '@/types';
import person from '@assets/person.png';
import more from '@assets/moreintweet.png';
import line from '@assets/line.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { Loader } from '@/components/Loader';
import style from './style.module.css';
import { fetchUserData } from '@/api/fetchUserData';

export const TweetList: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { tweets, setTweets, handleLike } = useHandleLike([], user?.uid || null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (index: number) => {
    setShowMenu(showMenu === index ? null : index);
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (user?.uid) {
      try {
        await deleteTweetFromFirestore(user.uid, tweetId);
        setShowMenu(null);
      } catch (error) {
        console.error('Error deleting tweet:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const unsubscribe = await fetchUserData(user.uid, setTweets, setProfile, setLoading);
        return () => unsubscribe();
      }
    };

    fetchData();
  }, [user, setTweets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMenu = (index: number) => () => {
    toggleMenu(index);
  };

  const handleDeleteClick = (tweetId: string) => () => {
    handleDeleteTweet(tweetId);
  };

  const handleLikeClick = (index: number) => () => {
    handleLike(index);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tweetList}>
      <div className={style.title_wrap}>
        <p className={style.title}>Tweets</p>
        <img src={line} alt="line" />
      </div>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <div key={tweet.id} className={style.tweet}>
            <div className={style.tweetHeader}>
              <span className={style.avatar_container}>
                <img className={style.avatar} src={profile?.avatar || person} alt="avatar" />
              </span>
              <div className={style.tweetInfo}>
                <span className={style.userName}>{profile?.displayName}</span>
                <span className={style.userNickname}>{profile?.telegram}</span>
                <span className={style.timestamp}>{convertToDate(tweet.timestamp).toLocaleDateString()}</span>
              </div>
              <div
                data-testid="more"
                className={style.more_container}
                onClick={handleToggleMenu(index)}
                ref={index === showMenu ? menuRef : null}
              >
                <img className={style.more} src={more} alt="more" />
                {showMenu === index && (
                  <div className={style.menu}>
                    <span
                      className={style.menuItem}
                      data-testid="delete"
                      onClick={handleDeleteClick(tweet.id)}
                    >
                      Delete
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p>{tweet.text}</p>
            {tweet.imageUrl && <img className={style.post_image} src={tweet.imageUrl} alt="tweet" />}
            <div className={style.likes_container}>
              <img
                className={style.likeIcon}
                src={
                  Array.isArray(tweet.likedBy) && tweet.likedBy.includes(user?.uid || '') ? activelike : like
                }
                alt="like"
                onClick={handleLikeClick(index)}
              />
              <span>{tweet.likes || 0}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No tweets available</p>
      )}
    </div>
  );
};
