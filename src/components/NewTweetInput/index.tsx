import React, { useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addTweetToFirestore } from '@/utils/addTweet';
import style from './style.module.css';
import person from '@assets/person.png';
import galary from '@assets/changePic.png';

interface NewTweetInputProps {
  onTweetAdded?: () => void;
}

export const NewTweetInput: FC<NewTweetInputProps> = ({ onTweetAdded }) => {
  const { avatarUrl, user } = useSelector((state: RootState) => state.user);
  const [tweetText, setTweetText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSelected, setImageSelected] = useState(false);

  const handleTweet = async () => {
    if (tweetText.trim() && user?.uid) {
      try {
        await addTweetToFirestore(user.uid, tweetText, imageFile);
        setTweetText('');
        setImageFile(null);
        setImageSelected(false);
        if (onTweetAdded) {
          onTweetAdded();
        }
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageSelected(true);
    } else {
      setImageSelected(false);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.container_input}>
        <img className={style.image} src={avatarUrl || person} alt="person" />
        <input
          className={style.input}
          type="text"
          placeholder="What's happening?"
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
        />
      </div>
      <div className={style.container_change}>
        <label htmlFor="imageUpload" className={style.imageLabel}>
          <img src={galary} alt="gallery" className={imageSelected ? style.imageSelected : ''} />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button className={style.btn} onClick={handleTweet}>
          Tweet
        </button>
      </div>
    </div>
  );
};
