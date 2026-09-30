import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' → 상대경로로 빌드해서 GitHub Pages(project 사이트, 하위 경로)에서도 그대로 열림.
// 이 앱은 URL 라우팅이 아니라 state 기반 화면 전환이라 상대경로로 문제 없음.
export default defineConfig({
  plugins: [react()],
  base: './',
})
