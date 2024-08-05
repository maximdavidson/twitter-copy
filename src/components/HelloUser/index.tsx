import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../database';

interface LocationState {
  name?: string;
}

export const HelloUser: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем тип состояния
  const state = location.state as LocationState;

  useEffect(() => {
    // Проверяем аутентификацию пользователя
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Hello, {state?.name || 'User'}!</h1>
    </div>
  );
};
