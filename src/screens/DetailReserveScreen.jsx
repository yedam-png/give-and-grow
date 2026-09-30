// ⑥ 봉사 상세 · 예약 — 뼈대(제목 + 다음 버튼). 내용은 6장 단계에서 채움.
export default function DetailReserveScreen({ go }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-xl font-bold text-grow-dark">봉사 상세 · 예약 (Detail &amp; Reserve)</h1>
      <p className="text-gray-400 text-sm">⑥ 상세</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => go('confirm')}
          className="px-8 py-3 rounded-full bg-grow text-white font-semibold shadow"
        >
          예약하기 → 예약 완료
        </button>
        <button
          onClick={() => go('list')}
          className="px-8 py-3 rounded-full border border-grow text-grow-dark font-semibold"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  )
}
