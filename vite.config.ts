import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 避免中文文件名在 CDN 上产生兼容性问题
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
})
