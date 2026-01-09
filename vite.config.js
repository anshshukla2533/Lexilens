import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      closeBundle() {
        // Copy manifest.json
        copyFileSync('public/manifest.json', 'dist/manifest.json');
        
        // Copy content.css if it exists
        if (existsSync('src/content/content.css')) {
          copyFileSync('src/content/content.css', 'dist/content.css');
        }

        // Ensure built global.css is available at dist/global.css (Chrome expects root path)
        if (existsSync('dist/assets/global.css') && !existsSync('dist/global.css')) {
          copyFileSync('dist/assets/global.css', 'dist/global.css');
        }
        
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
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content/index.jsx'),
        background: resolve(__dirname, 'src/background/background.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return `${chunkInfo.name}.js`;
        },
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.css') return 'popup.css';
          if (assetInfo.name === 'content.css') return 'content.css';
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});