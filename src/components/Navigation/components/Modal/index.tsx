import React, { useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addTweetToFirestore } from '@/utils/addTweetToFirestore';
import { Loader } from '@/components/Loader';
import person from '@assets/person.png';
import galary from '@assets/changePic.png';
import style from './style.module.css';

interface TweetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TweetModal: FC<TweetModalProps> = ({ isOpen, onClose }) => {
  const { avatarUrl, user } = useSelector((state: RootState) => state.user);
  const [tweetText, setTweetText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTweet = async () => {
    if (tweetText.trim() && user?.uid) {
      setIsLoading(true);
      try {
        await addTweetToFirestore(user.uid, tweetText, imageFile);
        setTweetText('');
        setImageFile(null);
        setImageSelected(false);
        onClose();
      } catch (error) {
        console.error('Error posting tweet:', error);
      } finally {
        setIsLoading(false);
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

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={handleModalClick}>
        <div className={style.container_input}>
          <img className={style.avatar} src={avatarUrl || person} alt="person" />
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
        {isLoading && <Loader />}
      </div>
    </div>
  );
};
