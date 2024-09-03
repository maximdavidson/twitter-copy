import '@testing-library/jest-dom';

global.importMetaEnv = {
  VITE_FIREBASE_API_KEY: 'AIzaSyAU3xiBKNKJh-HX23YKgEL8HytUDc225tE',
};

Object.defineProperty(global, 'import.meta', {
  value: {
    env: global.importMetaEnv,
  },
});
