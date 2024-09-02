import React, { useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addTweetToFirestore } from '@/utils/addTweetToFirestore';
import { validateImage } from '@/validation';
import { Loader } from '../Loader';
import person from '@assets/person.png';
import gallare from '@assets/changePic.png';
import style from './style.module.css';

interface NewTweetInputProps {
  onTweetAdded?: () => void;
}

export const NewTweetInput: FC<NewTweetInputProps> = ({ onTweetAdded }) => {
  const { avatarUrl, user } = useSelector((state: RootState) => state.user);
  const [tweetText, setTweetText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTweet = async () => {
    if (tweetText.trim() && user?.uid) {
      setIsLoading(true);
      try {
        await addTweetToFirestore(user.uid, tweetText, imageFile);
        setTweetText('');
        setImageFile(null);
        setImageSelected(false);
        setError(null);
        if (onTweetAdded) {
          onTweetAdded();
        }
      } catch (error) {
        console.error('Error posting tweet:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        setImageSelected(false);
        return;
      }

      setImageFile(file);
      setImageSelected(true);
      setError(null);
    } else {
      setImageSelected(false);
    }
  };

  const handleTweetTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweetText(e.target.value);
  };

  return (
    <div className={style.wrapper}>
      {isLoading && <Loader />}
      <div className={style.container_input}>
        <img className={style.image} src={avatarUrl || person} alt="person" />
        <input
          className={style.input}
          type="text"
          placeholder="What's happening?"
          value={tweetText}
          onChange={handleTweetTextChange}
          disabled={isLoading}
        />
      </div>
      <div className={style.container_change}>
        <label htmlFor="imageUpload" className={style.imageLabel}>
          <img src={gallare} alt="gallery" className={imageSelected ? style.imageSelected : ''} />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          disabled={isLoading}
          className={style.gallare_change}
        />
        <button
          data-testid="tweet-button"
          className={style.btn}
          onClick={handleTweet}
          disabled={isLoading || !!error}
        >
          Tweet
        </button>
      </div>
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
};
