/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Give & Grow 브랜드 — 밝고 친근한 새싹 그린
        grow: {
          light: '#DFF5E1',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
      },
      fontFamily: {
        // 픽셀아트 톤은 이후 단계에서 픽셀 폰트로 교체 예정
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
