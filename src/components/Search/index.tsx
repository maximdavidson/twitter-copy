import { useState, FC, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import search from '@assets/search.png';
import { searchTweets } from '@/services/searchTweets';

interface UserResult {
  displayName: string;
  nickname: string;
  avatar: string;
}

export const SearchTweets: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<UserResult[]>([]);
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
      const searchResults = await searchTweets(searchTerm);
      setResults(searchResults);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error searching tweets:', error);
    }
  };

  const handleResultClick = () => {
    navigate('/home');
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
          {results.map((user, index) => (
            <div key={index} className={style.resultItem} onClick={handleResultClick}>
              <img src={user.avatar} alt="avatar" className={style.avatar} />
              <div className={style.userInfo}>
                <span className={style.displayName}>{user.displayName}</span>
                <span className={style.nickname}>{user.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {checkNotFound() && <div className={style.notFound}>No results found</div>}
    </div>
  );
};
