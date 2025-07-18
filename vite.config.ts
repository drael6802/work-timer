import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 이 부분을 추가
  build: {
    outDir: 'docs', // 빌드 결과물이 생성될 폴더
  },
})
