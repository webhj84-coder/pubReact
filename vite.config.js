import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pubReact/', // 이 줄을 반드시 추가해 주세요.
})
