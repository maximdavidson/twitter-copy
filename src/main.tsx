import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './globalStyles.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Loader } from './components/Loader/index.tsx';
import { store, persistor } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
