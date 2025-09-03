import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  const base = process.env.GH_PAGES_BASE || '/'
  return {
    plugins: [vue()],
    server: { port: 5173, open: true },
    base,
  }
})
