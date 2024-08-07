import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
      { find: '@pages', replacement: fileURLToPath(new URL('./src/pages', import.meta.url)) },
      { find: '@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) },
      { find: '@validation', replacement: fileURLToPath(new URL('./src/validation', import.meta.url)) },
      { find: '@hooks', replacement: fileURLToPath(new URL('./src/hooks', import.meta.url)) },
      { find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url)) },
    ],
  },
});
