import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUpStart } from './pages/SignUpStart';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpStart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
