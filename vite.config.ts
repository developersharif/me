import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// Deployed to GitHub Pages at https://developersharif.github.io/me/
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/me/' : '/',
  server: { port: 5173 },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          motion: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'lenis'],
        },
      },
    },
  },
}));
