import { useEffect } from 'react'

// ⑦ 예약 완료 (Confirmation) — 애니메이션 체크마크
// 예약이 완료되면 그룹챗 게이팅 해제 (reserved=true).
export default function ConfirmScreen({ go, setReserved }) {
  useEffect(() => {
    setReserved?.(true)
  }, [setReserved])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
      {/* 애니메이션 체크마크: 원이 팝 → 체크선 그려짐 → 링 퍼짐 */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-grow/30 gg-check-burst" />
        <svg viewBox="0 0 100 100" className="w-28 h-28 gg-check-badge">
          <circle cx="50" cy="50" r="46" fill="#4CAF50" />
          <path
            d="M28 52 L44 68 L74 34"
            fill="none"
            stroke="#fff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="gg-check-mark"
          />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-grow-dark anim-fade-up">예약이 완료되었습니다</h1>
      <p className="text-gray-400 text-sm anim-fade-up">⑦ 예약 완료 (Confirmation)</p>
      <button
        onClick={() => go('map')}
        className="px-8 py-3 rounded-full bg-grow text-white font-semibold shadow anim-fade-up"
      >
        확인 → 메인 홈으로
      </button>
    </div>
  )
}
