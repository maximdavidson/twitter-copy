import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTheme } from '../store/themeSlice';
import { fetchUserTheme } from '../utils/updateUserTheme';

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      let savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

      if (!savedTheme) {
        savedTheme = await fetchUserTheme();
        localStorage.setItem('theme', savedTheme);
      }

      dispatch(setTheme(savedTheme));
      setIsThemeLoaded(true);
    };

    loadTheme();
  }, [dispatch]);

  useEffect(() => {
    if (isThemeLoaded) {
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme, isThemeLoaded]);

  return { theme, isThemeLoaded };
};
