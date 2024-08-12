import { useEffect, useState, FC } from 'react';
import { db } from '@/database';
import { doc, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import style from './style.module.css';
import { Loader } from '@/components/Loader';
import person from '@assets/person.png';
import more from '@assets/moreintweet.png';

interface Tweet {
  text: string;
  imageUrl?: string;
  timestamp: any;
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
              <div className={style.more_container}>
                <img className={style.more} src={more} alt="more" />
              </div>
            </div>
            <p>{tweet.text}</p>
            {tweet.imageUrl && <img src={tweet.imageUrl} alt="tweet" />}
          </div>
        ))
      ) : (
        <p>No tweets available</p>
      )}
    </div>
  );
};
