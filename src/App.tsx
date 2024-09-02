import { BrowserRouter as Router } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AppRouter } from './components/AppRouter';
import './App.css';

function App() {
  const { theme, isThemeLoaded } = useTheme();

  return <Router>{isThemeLoaded && <AppRouter />}</Router>;
}

export default App;
