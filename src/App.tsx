import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUpStart } from './pages/SignUpStart';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpStart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
