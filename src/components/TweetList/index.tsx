import { useEffect, useState, FC } from 'react';
import { db } from '@/database';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import style from './style.module.css';
import { Loader } from '@/components/Loader';
import person from '@assets/person.png';
import more from '@assets/moreintweet.png';
import line from '@assets/line.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { deleteTweetFromFirestore } from '@/services/tweetService';

interface Tweet {
  text: string;
  imageUrl?: string;
  timestamp: any;
  likes: number;
  likedBy: string[]; // Массив UID'ов пользователей, которые лайкнули твит
}

interface UserProfile {
  displayName: string;
  nickname: string;
  avatar: string;
}

export const TweetList: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    setShowMenu(showMenu === index ? null : index);
  };

  const handleDeleteTweet = async (tweetIndex: number) => {
    if (user?.uid) {
      try {
        const tweetToDelete = tweets[tweetIndex];
        await deleteTweetFromFirestore(user.uid, tweetToDelete);
        setShowMenu(null); // Закрыть меню после удаления
      } catch (error) {
        console.error('Error deleting tweet:', error);
      }
    }
  };

  const handleLike = async (index: number) => {
    if (user?.uid) {
      const tweet = tweets[index];
      const userRef = doc(db, 'users', user.uid);

      // Если массив likedBy отсутствует, создаем пустой массив
      const likedBy = Array.isArray(tweet.likedBy) ? tweet.likedBy : [];

      const alreadyLiked = likedBy.includes(user.uid);
      const updatedLikes = alreadyLiked ? tweet.likes - 1 : tweet.likes + 1;
      const updatedLikedBy = alreadyLiked
        ? likedBy.filter((uid) => uid !== user.uid)
        : [...likedBy, user.uid];

      const updatedTweet = { ...tweet, likes: updatedLikes, likedBy: updatedLikedBy };

      try {
        await updateDoc(userRef, {
          tweets: [...tweets.slice(0, index), updatedTweet, ...tweets.slice(index + 1)],
        });
      } catch (error) {
        console.error('Error liking/unliking tweet:', error);
      }
    } else {
      console.error('User ID is undefined');
    }
  };

  useEffect(() => {
    const fetchTweetsAndProfile = () => {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setTweets(data.tweets || []);
            setProfile({
              displayName: data.displayName || '',
              nickname: data.nickname || '',
              avatar: data.avatar || '',
            });
          } else {
            setTweets([]);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      }
    };

    fetchTweetsAndProfile();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tweetList}>
      <div className={style.title_wrap}>
        <p className={style.title}>Tweets</p>
        <img src={line} />
      </div>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <div key={index} className={style.tweet}>
            <div className={style.tweetHeader}>
              <div className={style.avatar_container}>
                <img className={style.avatar} src={profile?.avatar || person} alt="avatar" />
              </div>
              <div className={style.tweetInfo}>
                <span className={style.userName}>{profile?.displayName}</span>
                <span className={style.userNickname}>{profile?.nickname}</span>
                <span className={style.timestamp}>{tweet.timestamp.toDate().toLocaleDateString()}</span>
              </div>
              <div className={style.more_container} onClick={() => toggleMenu(index)}>
                <img className={style.more} src={more} alt="more" />
                {showMenu === index && (
                  <div className={style.menu}>
                    <span className={style.menuItem} onClick={() => handleDeleteTweet(index)}>
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
                } // Активная иконка если пользователь уже лайкнул
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
