import { FC, useEffect, useState } from 'react';
import { db } from '@/database';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Tweet, UserProfile } from '@/types';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { Loader } from '../Loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import style from './style.module.css';

export const AllUsersTweets: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const allTweets: Tweet[] = [];
        const profilesData: Record<string, UserProfile> = {};

        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as UserProfile & { tweets: Tweet[] };
          const { displayName, telegram = 'No Telegram Info', avatar = person, tweets = [] } = userData;

          profilesData[doc.id] = {
            displayName,
            telegram,
            avatar,
          };

          tweets.forEach((tweet) => {
            allTweets.push({ ...tweet, userId: doc.id });
          });
        });

        allTweets.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        setTweets(allTweets);
        setProfiles(profilesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tweets or profiles:', error);
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handleLike = async (index: number) => {
    if (!user?.uid) return;

    // Найдите твит по его индексу
    const tweet = tweets[index];
    const userRef = doc(db, 'users', tweet.userId); // Получаем правильный документ пользователя
    const likedBy = Array.isArray(tweet.likedBy) ? tweet.likedBy : [];

    const alreadyLiked = likedBy.includes(user.uid);
    const updatedLikes = alreadyLiked ? tweet.likes - 1 : tweet.likes + 1;
    const updatedLikedBy = alreadyLiked ? likedBy.filter((uid) => uid !== user.uid) : [...likedBy, user.uid];

    const updatedTweet = { ...tweet, likes: updatedLikes, likedBy: updatedLikedBy };

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userTweets = userDoc.data()?.tweets || [];
        const updatedTweets = userTweets.map((t: Tweet) => (t.id === tweet.id ? updatedTweet : t));

        // Обновляем документ пользователя с новыми твитами
        await updateDoc(userRef, { tweets: updatedTweets });

        // Обновляем состояние локально
        setTweets((prevTweets) => prevTweets.map((t, i) => (i === index ? updatedTweet : t)));
      } else {
        console.error('User document does not exist.');
      }
    } catch (error) {
      console.error('Error liking/unliking tweet:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tweetList}>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => {
          const profile = profiles[tweet.userId] || {
            displayName: 'Unknown User',
            telegram: 'No Telegram Info',
            avatar: person,
          };
          return (
            <div key={tweet.id} className={style.tweet}>
              <div className={style.tweetHeader}>
                <div className={style.avatar_container}>
                  <img className={style.avatar} src={profile.avatar} alt="avatar" />
                </div>
                <div className={style.tweetInfo}>
                  <span className={style.userName}>{profile.displayName}</span>
                  <span className={style.userNickname}>{profile.telegram}</span>
                  <span className={style.timestamp}>
                    {new Date(tweet.timestamp.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p>{tweet.text}</p>
              {tweet.imageUrl && <img src={tweet.imageUrl} alt="tweet" />}
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
          );
        })
      ) : (
        <p>No tweets available</p>
      )}
    </div>
  );
};
