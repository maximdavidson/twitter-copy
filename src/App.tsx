import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setTheme } from './store/themeSlice';
import { SignUpStart } from './pages/SignUpStart';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Explore } from './pages/Explore';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { fetchUserTheme } from './utils/updateUserTheme';
import './App.css';

function App() {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpStart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
