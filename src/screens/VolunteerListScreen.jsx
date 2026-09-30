import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import { volunteers } from '../data/mockData.js'

// ⑤ 봉사 목록 / 메인 (Main Page)
// - 상단 탭: ALL / Recommend
// - 봉사활동 카드 리스트 (mock 데이터) — 카드를 누르면 상세·예약 화면으로
// - 하단 네비게이션 바
export default function VolunteerListScreen({ go, reserved }) {
  const [tab, setTab] = useState('all') // 'all' | 'recommend'

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 탭 */}
        <div className="px-5 pt-6 pb-3">
          <div className="flex gap-2">
            <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
              ALL
            </TabButton>
            <TabButton active={tab === 'recommend'} onClick={() => setTab('recommend')}>
              Recommend
            </TabButton>
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
          {volunteers.map((v) => (
            <VolunteerCard key={v.id} v={v} onOpen={() => go('detail')} />
          ))}
        </div>
      </div>

      <BottomNav go={go} active="home" reserved={reserved} />
    </>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-2xl text-base font-bold transition ${
        active ? 'bg-gray-900 text-white shadow' : 'bg-gray-200 text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

function VolunteerCard({ v, onOpen }) {
  const recruiting = v.status === 'recruiting'
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-2xl p-4 shadow-sm active:scale-[0.99] transition"
      style={{ backgroundColor: '#F9A6A0' }}
    >
      <div className="flex gap-3">
        {/* 왼쪽: 활동 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{v.title}</h3>

          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#8B7DE8' }}>
            {v.location}
          </span>

          <p className="mt-2 text-[11px] text-gray-800">
            Service period: {v.period} / Service Time: {v.time}
          </p>
          <p className="text-[11px] text-gray-800">
            Recognized volunteer hours: {v.hours}
          </p>
        </div>

        {/* 오른쪽: 모집 상태 */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-2">
          {recruiting && <span className="text-xs text-gray-800">Recruiting</span>}

          {recruiting ? (
            v.deadlineToday && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold" style={{ backgroundColor: '#C4E7C0', color: '#2E7D32' }}>
                Deadline today
              </span>
            )
          ) : (
            <span className="px-4 py-1 rounded-md text-[11px] font-bold text-white" style={{ backgroundColor: '#8B8B8B' }}>
              Closed
            </span>
          )}

          <ReservedCheck />
        </div>
      </div>
    </button>
  )
}

// RESERVED 체크박스 — 카드 이동과 별개로 자체 토글 (클릭 전파 차단)
function ReservedCheck() {
  const [reserved, setReserved] = useState(false)
  return (
    <span
      role="checkbox"
      aria-checked={reserved}
      onClick={(e) => {
        e.stopPropagation()
        setReserved((r) => !r)
      }}
      className="flex items-center gap-1.5 text-[11px] text-gray-800 cursor-pointer"
    >
      <span className={`w-3.5 h-3.5 rounded-sm border border-gray-700 flex items-center justify-center ${reserved ? 'bg-gray-800' : 'bg-white/60'}`}>
        {reserved && <span className="text-white text-[9px] leading-none">✓</span>}
      </span>
      RESERVED
    </span>
  )
}
