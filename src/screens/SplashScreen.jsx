import { useEffect } from 'react'
import logo from '../assets/Mainlogo.png'

// ① 스플래시 — 로고를 3초간 보여준 뒤 자동으로 로그인 화면으로 이동.
// 화면을 탭하면 즉시 넘어감. 배경은 PhoneFrame의 공통 배경을 사용.
export default function SplashScreen({ go }) {
  useEffect(() => {
    const timer = setTimeout(() => go('login'), 3000)
    return () => clearTimeout(timer)
  }, [go])

  return (
    <button
      onClick={() => go('login')}
      className="flex-1 w-full flex flex-col items-center justify-center gap-6 p-6"
    >
      <img
        src={logo}
        alt="Give & Grow"
        className="w-56 max-w-[70%] drop-shadow-md animate-pulse"
        style={{ imageRendering: 'pixelated' }}
      />
    </button>
  )
}
