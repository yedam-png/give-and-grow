import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' → 상대경로로 빌드해서 GitHub Pages(하위 경로)에서도, 로컬 파일로 열어도 동작.
// 이 앱은 URL 라우팅이 아니라 state 기반 화면 전환이라 상대경로로 문제 없음.
//
// SINGLEFILE=1 로 빌드하면 모든 JS/CSS/이미지를 index.html 하나에 인라인(base64)해서
// 더블클릭으로 바로 열리는 단일 HTML 파일을 만든다. (npm run build:single)
const single = process.env.SINGLEFILE === '1'

export default defineConfig({
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  base: './',
  build: single
    ? {
        assetsInlineLimit: 100000000, // 모든 에셋(이미지 등)을 data URI로 인라인
        chunkSizeWarningLimit: 100000,
        cssCodeSplit: false,
      }
    : {},
})
