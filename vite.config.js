import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  // Set base path for GitHub Pages deployment
  const base = process.env.NODE_ENV === 'production' ? '/me/' : '/'
  
  return {
    plugins: [vue()],
    server: { port: 5173, open: true },
    base,
  }
})
