import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // Copy manifest.json
        copyFileSync('public/manifest.json', 'dist/manifest.json');
        
        // Copy icons if they exist
        if (existsSync('public/icons')) {
          if (!existsSync('dist/icons')) {
            mkdirSync('dist/icons', { recursive: true });
          }
          if (existsSync('public/icons/icon16.png')) {
            copyFileSync('public/icons/icon16.png', 'dist/icons/icon16.png');
          }
          if (existsSync('public/icons/icon48.png')) {
            copyFileSync('public/icons/icon48.png', 'dist/icons/icon48.png');
          }
          if (existsSync('public/icons/icon128.png')) {
            copyFileSync('public/icons/icon128.png', 'dist/icons/icon128.png');
          }
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content/index.jsx'),
        background: resolve(__dirname, 'src/background/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});