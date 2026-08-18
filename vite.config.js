import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  // ถ้าเว็บอยู่ที่ http://domain.com/
base: '/udvc-research/',


  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})