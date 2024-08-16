import { FC, useEffect, useState } from 'react';
import { db } from '@/database';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Tweet, UserProfile } from '@/types';
import person from '@assets/person.png';
import { Loader } from '../Loader';
import style from './style.module.css';

export const AllUsersTweets: FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        // Получаем все твиты
        const tweetsCollection = collection(db, 'tweets');
        const tweetsSnapshot = await getDocs(tweetsCollection);
        const allTweets = tweetsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Tweet);

        // Проверка содержимого allTweets
        console.log('Fetched tweets:', allTweets);

        setTweets(allTweets);

        // Получаем уникальные userId из твитов
        const userIds = Array.from(new Set(allTweets.map((tweet) => tweet.userId)));

        // Проверка содержимого userIds
        console.log('User IDs:', userIds);

        if (userIds.length > 0) {
          // Получаем профили пользователей
          const profilesCollection = collection(db, 'users');
          const profilesQuery = query(profilesCollection, where('userId', 'in', userIds));
          const profilesSnapshot = await getDocs(profilesQuery);

          const profilesData: Record<string, UserProfile> = {};
          profilesSnapshot.forEach((doc) => {
            const data = doc.data();
            profilesData[data.userId] = {
              displayName: data.displayName,
              avatar: data.avatar || person,
            };
          });

          // Проверка содержимого profilesData
          console.log('Fetched profiles:', profilesData);

          setProfiles(profilesData);
        } else {
          console.warn('No user IDs found. Skipping profiles fetch.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tweets or profiles:', error);
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tweetList}>
      {tweets.length > 0 ? (
        tweets.map((tweet) => {
          const profile = profiles[tweet.userId] || {
            displayName: 'Unknown User',
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
                  <span className={style.timestamp}>
                    {new Date(tweet.timestamp.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p>{tweet.text}</p>
              {tweet.imageUrl && <img src={tweet.imageUrl} alt="tweet" />}
              <div className={style.likes_container}>
                <span>{tweet.likes || 0} Likes</span>
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
