import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './globalStyles.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Provider } from 'react-redux';
import { store } from '@/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
);
