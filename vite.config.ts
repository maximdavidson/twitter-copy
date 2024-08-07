// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env': {
      VITE_FIREBASE_API_KEY: '"AIzaSyAU3xiBKNKJh-HX23YKgEL8HytUDc225tE"',
      VITE_FIREBASE_AUTH_DOMAIN: '"modsentwitter.firebaseapp.com"',
      VITE_FIREBASE_DATABASE_URL: '"https://modsentwitter-default-rtdb.firebaseio.com"',
      VITE_FIREBASE_PROJECT_ID: '"modsentwitter"',
      VITE_FIREBASE_STORAGE_BUCKET: '"modsentwitter.appspot.com"',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '"357057773191"',
      VITE_FIREBASE_APP_ID: '"1:357057773191:web:212dc61b163865b3170222"',
    },
  },
  resolve: {
    alias: {
      components: resolve(__dirname, 'src/components'),
      pages: resolve(__dirname, 'src/pages'),
      assets: resolve(__dirname, 'src/assets'),
      validation: resolve(__dirname, 'src/validation'),
      hooks: resolve(__dirname, 'src/hooks'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
});
