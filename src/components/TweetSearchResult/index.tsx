import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import exit from '@/assets/exit-arrow.png';
import switchOff from '@/assets/switchOff.png';
import switchOn from '@/assets/switchOn.png';

export const SearchingResult: FC = () => {
  const navigate = useNavigate();

  const handleArrowClick = () => {
    navigate('/profile');
  };

  return (
    <header className={style.container}>
      <div className={style.wrapper}>
        <div className={style.wrap} onClick={handleArrowClick}>
          <img className={style.arrow} src={exit} alt="Exit Arrow" />
          <p className={style.title}>Home</p>
        </div>
        <div className={style.switch}>
          <img src={switchOff} alt="Switch Off" />
        </div>
      </div>
    </header>
  );
};
