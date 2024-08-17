import { FC, useEffect, useState } from 'react';
import { db } from '@/database';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Tweet, UserProfile } from '@/types';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { Loader } from '../Loader';
import style from './style.module.css';

export const AllUsersTweets: FC = () => {
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
          const { displayName, avatar = person, telegram, tweets = [] } = userData;

          profilesData[doc.id] = {
            displayName,
            telegram, // Добавляем telegram в профиль
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

  const handleLike = async (tweetId: string, userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const tweetIndex = tweets.findIndex((tweet) => tweet.id === tweetId);
      const tweet = tweets[tweetIndex];

      if (!tweet || !userId) return;

      const alreadyLiked = tweet.likedBy.includes(userId);
      const updatedLikes = alreadyLiked ? tweet.likes - 1 : tweet.likes + 1;
      const updatedLikedBy = alreadyLiked
        ? tweet.likedBy.filter((uid) => uid !== userId)
        : [...tweet.likedBy, userId];

      const updatedTweet = {
        ...tweet,
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      };

      const updatedTweets = [...tweets];
      updatedTweets[tweetIndex] = updatedTweet;

      await updateDoc(userRef, {
        tweets: updatedTweets,
      });

      setTweets(updatedTweets);
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
        tweets.map((tweet) => {
          const profile = profiles[tweet.userId] || {
            displayName: 'Unknown User',
            telegram: '',
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
                  src={tweet.likedBy.includes(tweet.userId) ? activelike : like}
                  alt="like"
                  onClick={() => handleLike(tweet.id, tweet.userId)}
                />
                <span>{tweet.likes || 0} </span>
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
