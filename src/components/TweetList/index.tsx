import { useEffect, useState, FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import person from '@assets/person.png';
import more from '@assets/moreintweet.png';
import line from '@assets/line.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { Loader } from '@/components/Loader';
import { db } from '@/database';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { deleteTweetFromFirestore } from '@/utils/addTweet';
import { convertToDate } from '@/utils/convertToDate';
import { Tweet, UserProfile } from '@/types';
import style from './style.module.css';

export const TweetList: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [tweets, setTweets] = useState<Tweet[]>([]);
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

  const handleLike = async (index: number) => {
    if (user?.uid) {
      const tweet = tweets[index];
      const userRef = doc(db, 'users', user.uid);
      const likedBy = Array.isArray(tweet.likedBy) ? tweet.likedBy : [];

      const alreadyLiked = likedBy.includes(user.uid);
      const updatedLikes = alreadyLiked ? tweet.likes - 1 : tweet.likes + 1;
      const updatedLikedBy = alreadyLiked
        ? likedBy.filter((uid) => uid !== user.uid)
        : [...likedBy, user.uid];

      const updatedTweet = { ...tweet, likes: updatedLikes, likedBy: updatedLikedBy };

      try {
        await updateDoc(userRef, {
          tweets: tweets.map((t, i) => (i === index ? updatedTweet : t)),
        });
      } catch (error) {
        console.error('Error liking/unliking tweet:', error);
      }
    } else {
      console.error('User ID is undefined');
    }
  };

  useEffect(() => {
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTweets(data.tweets || []);
          setProfile({
            displayName: data.displayName || '',
            telegram: data.telegram || '',
            avatar: data.avatar || '',
            gender: '',
          });
        } else {
          setTweets([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

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
              <div className={style.avatar_container}>
                <img className={style.avatar} src={profile?.avatar || person} alt="avatar" />
              </div>
              <div className={style.tweetInfo}>
                <span className={style.userName}>{profile?.displayName}</span>
                <span className={style.userNickname}>{profile?.telegram}</span>
                <span className={style.timestamp}>{convertToDate(tweet.timestamp).toLocaleDateString()}</span>
              </div>
              <div
                className={style.more_container}
                onClick={() => toggleMenu(index)}
                ref={index === showMenu ? menuRef : null}
              >
                <img className={style.more} src={more} alt="more" />
                {showMenu === index && (
                  <div className={style.menu}>
                    <span className={style.menuItem} onClick={() => handleDeleteTweet(tweet.id)}>
                      Delete
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p>{tweet.text}</p>
            {tweet.imageUrl && <img src={tweet.imageUrl} alt="tweet" />}
            <div className={style.likes_container}>
              <img
                className={style.likeIcon}
                src={
                  Array.isArray(tweet.likedBy) && tweet.likedBy.includes(user?.uid || '') ? activelike : like
                }
                alt="like"
                onClick={() => handleLike(index)}
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
