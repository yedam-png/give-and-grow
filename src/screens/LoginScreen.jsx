import { useState } from 'react'
import logo from '../assets/Mainlogo.png'

// ② 로그인 (Entering page 2)
// - 상단 로고 + 제목
// - 소셜 로그인 3종(Google / Apple / X) — 디자인만(가이드라인상 동작 불필요)
// - 이메일 / 비밀번호 입력 (비밀번호 표시 토글)
// - Log in 버튼 → 봉사 목록으로
// - "Sign up" 링크 → 회원가입 화면으로
export default function LoginScreen({ go }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex-1 w-full flex flex-col px-6 pt-10 pb-6 overflow-y-auto">
      {/* 로고 */}
      <img
        src={logo}
        alt="Give & Grow"
        className="w-28 mx-auto"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* 제목 */}
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900 text-center">
        Log in to Give &amp; Grow
      </h1>

      {/* 소셜 로그인 3종 */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <SocialButton label="Google 계정으로 로그인">
          <GoogleIcon />
        </SocialButton>
        <SocialButton label="Apple 계정으로 로그인">
          <AppleIcon />
        </SocialButton>
        <SocialButton label="X 계정으로 로그인">
          <XIcon />
        </SocialButton>
      </div>

      {/* 구분선 */}
      <div className="mt-6 border-t border-gray-300" />

      {/* 이메일 / 비밀번호 */}
      <div className="mt-8 flex flex-col gap-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-transparent border-b border-gray-400 pb-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-grow"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border-b border-gray-400 pb-2 pr-8 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-grow"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-0 text-gray-500"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {/* Log in 버튼 → 메인 홈(지도) */}
      <button
        onClick={() => go('map')}
        style={{ backgroundColor: '#AC3B29' }}
        className="mt-10 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-md active:scale-[0.99] transition"
      >
        Log in
      </button>

      {/* 회원가입 링크 */}
      <p className="mt-6 text-center text-gray-600">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => go('signup')}
          className="font-bold text-grow-dark underline underline-offset-2"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}

// 소셜 로그인 버튼 껍데기 (흰 카드 + 아이콘)
function SocialButton({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center active:scale-95 transition"
    >
      {children}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-6 h-6">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 384 512" className="w-6 h-6" fill="#000">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}
