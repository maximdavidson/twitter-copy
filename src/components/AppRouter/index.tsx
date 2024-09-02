import { Routes, Route } from 'react-router-dom';
import { SignUpStart } from '@/pages/SignUpStart';
import { SignUp } from '@/pages/SignUp';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { PostList } from '@/pages/PostList';
import { Home } from '@/pages/Home';
import { Users } from '@/pages/Users';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUpStart />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/postlist" element={<PostList />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};
