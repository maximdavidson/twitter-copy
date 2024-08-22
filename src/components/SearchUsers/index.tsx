import { FC, useState, ChangeEvent, MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/database';
import { collection, getDocs } from 'firebase/firestore';
import { UserProfile } from '@/types';
import { debounce } from '@/utils/debounceSearch';
import search from '@assets/search.png';
import style from './style.module.css';

export const SearchUsers: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value === '') {
      setResults([]);
      setSearchPerformed(false);
    }
  };

  const performSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      setSearchPerformed(false);
      setIsSearching(false);
      return;
    }
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const searchResults: UserProfile[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;

        const matchesSearchTerm =
          userData.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userData.telegram.toLowerCase().includes(searchTerm.toLowerCase());

        if (matchesSearchTerm) {
          searchResults.push(userData);
        }
      });

      setResults(searchResults);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(performSearch, 500), [searchTerm]);

  const handleSearch = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsSearching(true);
    debouncedSearch();
  };

  const handleResultClick = (profile: UserProfile) => {
    setResults([]);
    setSearchPerformed(false);
    setSearchTerm('');
    navigate('/users', { state: { profile, tweets: profile.tweets } });
  };

  const handleResultClickWrapper = (profile: UserProfile) => () => {
    handleResultClick(profile);
  };

  const checkNotFound = () => {
    return searchPerformed && results.length === 0;
  };

  return (
    <div className={style.container}>
      <div className={style.inputContainer}>
        <button data-testid="search" className={style.searchButton} onClick={handleSearch}>
          <img src={search} alt="search" className={style.searchIcon} />
        </button>
        <input
          className={style.input}
          type="text"
          placeholder="Search Users"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {isSearching && <div className={style.searching}>Searching...</div>}
      {results.length > 0 && (
        <div className={style.resultsContainer}>
          <h3 className={style.title}>Search results</h3>
          {results.map((profile, index) => (
            <div
              data-testid="result"
              key={index}
              className={style.resultItem}
              onClick={handleResultClickWrapper(profile)}
            >
              <img src={profile.avatar} alt="avatar" className={style.avatar} />
              <div className={style.userInfo}>
                <span className={style.displayName}>{profile.displayName}</span>
                <span className={style.nickname}>{profile.telegram}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {checkNotFound() && <div className={style.notFound}>No results found</div>}
    </div>
  );
};
