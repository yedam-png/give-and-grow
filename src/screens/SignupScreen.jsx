import { useState } from 'react'

// ③ 회원가입 (Sign up page)
// - 제목 "Create your account" + 부제 "Let's make it official ✨"
// - 입력칸: First name / Last name / Email / Password / Confirm password
//   (Password, Confirm password 는 눈 아이콘으로 표시 토글)
// - 하단 버튼 → 캐릭터 선택 화면으로 (가이드라인 6장 ③)
export default function SignupScreen({ go }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div className="flex-1 w-full flex flex-col px-6 pt-12 pb-6 overflow-y-auto">
      {/* 제목 */}
      <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900">
        Create
        <br />
        your account
      </h1>
      <p className="mt-3 text-lg font-semibold text-gray-800">
        Let&apos;s make it official ✨
      </p>

      {/* 입력칸 */}
      <div className="mt-10 flex flex-col gap-4">
        <Field
          placeholder="First name"
          value={form.firstName}
          onChange={update('firstName')}
        />
        <Field
          placeholder="Last name"
          value={form.lastName}
          onChange={update('lastName')}
        />
        <Field
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={update('email')}
        />
        <Field
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={form.password}
          onChange={update('password')}
          toggle
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
        />
        <Field
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm password"
          value={form.confirm}
          onChange={update('confirm')}
          toggle
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />
      </div>

      {/* 회원가입 진행 버튼 → 캐릭터 선택 */}
      <button
        onClick={() => go('character')}
        style={{ backgroundColor: '#AC3B29' }}
        className="mt-8 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-md active:scale-[0.99] transition"
      >
        Let&apos;s go!
      </button>

      {/* 하단 링크 */}
      <p className="mt-5 text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => go('login')}
          className="font-bold text-grow-dark underline underline-offset-2"
        >
          Log in
        </button>
      </p>
    </div>
  )
}

// 입력 필드 (흰 카드 스타일). toggle=true 이면 오른쪽에 눈 아이콘 표시.
function Field({ type = 'text', placeholder, value, onChange, toggle, show, onToggle }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 rounded-xl bg-white border border-gray-200 shadow-sm px-4 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-grow"
      />
      {toggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
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
