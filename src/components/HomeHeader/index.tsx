import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/themeSlice';
import exit from '@/assets/exit-arrow.png';
import switchOff from '@/assets/switchOff.png';
import switchOn from '@/assets/switchOn.png';
import { updateUserTheme } from '@/utils/updateUserTheme';
import style from './style.module.css';

export const HomeHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(toggleTheme());
    updateUserTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

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
        <div className={style.switch} onClick={handleToggleTheme}>
          <img
            src={theme === 'light' ? switchOff : switchOn}
            alt={`Switch ${theme === 'light' ? 'Off' : 'On'}`}
          />
        </div>
      </div>
    </header>
  );
};
