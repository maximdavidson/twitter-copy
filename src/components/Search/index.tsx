// components/SearchTweets.tsx
import { FC, useState, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import search from '@assets/search.png';
import { db } from '@/database';
import { collection, getDocs } from 'firebase/firestore';
import { Tweet, UserProfile } from '@/types';

interface SearchResult {
  profile: UserProfile;
  tweets: Tweet[];
}

export const SearchTweets: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value === '') {
      setResults([]);
    }
  };

  const handleSearch = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (searchTerm.trim() === '') {
      setResults([]);
      setSearchPerformed(true);
      return;
    }
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const searchResults: SearchResult[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const tweets = userData.tweets || [];

        const matchingTweets = tweets.filter((tweet: any) =>
          tweet.text.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (matchingTweets.length > 0) {
          searchResults.push({
            profile: {
              displayName: userData.displayName || '',
              nickname: userData.nickname || '',
              avatar: userData.avatar || '',
            },
            tweets: matchingTweets,
          });
        }
      });

      setResults(searchResults);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error searching tweets:', error);
    }
  };

  const handleResultClick = (profile: UserProfile, tweets: Tweet[]) => {
    navigate('/home', { state: { profile, tweets } });
  };

  const checkNotFound = () => {
    return searchPerformed && searchTerm.trim() !== '' && results.length === 0;
  };

  return (
    <div className={style.container}>
      <div className={style.inputContainer}>
        <button className={style.searchButton} onClick={handleSearch}>
          <img src={search} alt="search" className={style.searchIcon} />
        </button>
        <input
          className={style.input}
          type="text"
          placeholder="Search Tweets"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {results.length > 0 && (
        <div className={style.resultsContainer}>
          <h3 className={style.title}>Search results</h3>
          {results.map((result, index) => (
            <div
              key={index}
              className={style.resultItem}
              onClick={() => handleResultClick(result.profile, result.tweets)}
            >
              <img src={result.profile.avatar} alt="avatar" className={style.avatar} />
              <div className={style.userInfo}>
                <span className={style.displayName}>{result.profile.displayName}</span>
                <span className={style.nickname}>{result.profile.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {checkNotFound() && <div className={style.notFound}>No results found</div>}
    </div>
  );
};
