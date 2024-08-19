import { FC, useEffect, useState } from 'react';
import { db } from '@/database';
import { collection, getDocs } from 'firebase/firestore';
import { Tweet, UserProfile } from '@/types';
// import { FixedSizeList as List } from 'react-window';
import person from '@assets/person.png';
import like from '@assets/like.png';
import activelike from '@assets/ActiveLike.png';
import { Loader } from '../Loader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import style from './style.module.css';
import { useHandleLike } from '@/hooks/useHandleLike';

export const AllUsersTweets: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { tweets, setTweets, handleLike } = useHandleLike([], user?.uid || null);
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
  }, [setTweets]);

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
