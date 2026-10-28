import { volunteers } from '../data/mockData.js'
import { SourceBadge } from './VolunteerListScreen.jsx'

// ⑥ 봉사 상세 · 예약 — 예약 중인 활동 정보 표시 + 예약 확정 + 원본 공고 링크
export default function DetailReserveScreen({ go, pendingId }) {
  const v = volunteers.find((x) => x.id === pendingId)

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6">
      <h1 className="text-xl font-extrabold text-grow-dark text-center">봉사 상세 · 예약</h1>

      {v ? (
        <div className="mt-6 rounded-2xl p-5 shadow-sm" style={{ backgroundColor: '#F9A6A0' }}>
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {v.source && <SourceBadge source={v.source} />}
          </div>
          <h2 className="font-bold text-gray-900 text-base leading-snug">{v.title}</h2>
          {v.org && <p className="mt-1 text-sm font-semibold text-gray-700">{v.org}</p>}
          <span
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: '#8B7DE8' }}
          >
            📍 {v.location}
          </span>
          <div className="mt-3 text-sm text-gray-800 space-y-1">
            <p>봉사기간: {v.period}</p>
            <p>봉사시간: {v.time}</p>
            <p>인정 봉사시간: {v.hours}</p>
            {v.field && <p>봉사분야: {v.field}</p>}
            {v.target && <p>참여대상: {v.target}</p>}
          </div>

          {v.url && (
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white/80 text-grow-dark font-bold text-sm active:scale-[0.99] transition"
            >
              해당 사이트에서 자세히 보기 ↗
            </a>
          )}
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-400 text-sm">선택된 활동이 없어요. 목록에서 활동을 골라주세요.</p>
      )}

      <p className="mt-4 text-center text-xs text-gray-500">
        예약해도 다른 활동을 계속 예약할 수 있어요. 여러 봉사를 동시에 예약해 보세요!
      </p>

      <div className="mt-auto pt-6 flex flex-col gap-3">
        <button
          onClick={() => go('confirm')}
          style={{ backgroundColor: '#AC3B29' }}
          className="w-full py-3.5 rounded-2xl text-white font-bold shadow active:scale-[0.99] transition"
        >
          예약하기 → 예약 완료
        </button>
        <button
          onClick={() => go('list')}
          className="w-full py-3 rounded-2xl border border-grow text-grow-dark font-bold active:scale-[0.99] transition"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  )
}
