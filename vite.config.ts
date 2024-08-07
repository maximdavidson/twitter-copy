import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
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
