import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import { volunteers, volunteersMeta } from '../data/mockData.js'
import { getMyLocation, distanceKm, SEOUL_CENTER } from '../utils/geo.js'

// 이 거리(km) 안이면 '근처'로 표시
const NEARBY_KM = 15

// 갱신 시각을 "오늘 오전 9:00" 같은 짧은 문구로
function updatedLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const day = sameDay ? '오늘' : `${d.getMonth() + 1}.${d.getDate()}`
  return `${day} ${hh}:${mm} 갱신`
}

// ⑤ 봉사 목록 / 메인 (Main Page)
// - 상단 탭: ALL(전체) / Recommend(내 주변 · 모집 중인 활동만, 가까운 순)
// - 내 위치(GPS) 기준으로 거리 계산. GPS 거부/실패 시 서울 기준.
export default function VolunteerListScreen({ go, reserved, reservedIds, setReservedIds, setPendingId }) {
  const [tab, setTab] = useState('all') // 'all' | 'recommend'
  const [myLoc, setMyLoc] = useState(SEOUL_CENTER)

  // 진입 시 현재 위치(GPS) 요청 — 성공하면 주변순 정렬이 내 위치 기준으로 갱신됨
  useEffect(() => {
    let alive = true
    getMyLocation().then((loc) => alive && setMyLoc(loc))
    return () => {
      alive = false
    }
  }, [])

  // 목록에서 바로 예약/해제 토글 (여러 개 동시 예약 가능)
  const toggleReserve = (id) =>
    setReservedIds?.((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // 각 활동에 내 위치로부터의 거리 부착
  const withDistance = volunteers.map((v) => ({ ...v, dist: distanceKm(myLoc, v) }))

  // Recommend: 모집 중(open)인 활동만, 가까운 순으로 정렬
  const list =
    tab === 'recommend'
      ? withDistance.filter((v) => v.status === 'recruiting').sort((a, b) => a.dist - b.dist)
      : withDistance

  const upd = updatedLabel(volunteersMeta.updatedAt)

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 탭 */}
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <TabButton active={tab === 'all'} onClick={() => setTab('all')}>
                ALL
              </TabButton>
              <TabButton active={tab === 'recommend'} onClick={() => setTab('recommend')}>
                Recommend
              </TabButton>
            </div>
            {upd && (
              <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                {volunteersMeta.region} · {upd}
              </span>
            )}
          </div>
          {tab === 'recommend' && (
            <p className="mt-2 text-xs font-semibold text-grow-dark">
              📍 {myLoc.isGps ? '내 위치' : '서울'} 주변 · 지금 모집 중인 활동만 (가까운 순)
              {!myLoc.isGps && <span className="text-gray-400 font-normal"> · 위치 허용 시 내 주변순</span>}
            </p>
          )}
        </div>

        {/* 카드 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
          {list.length === 0 ? (
            <p className="mt-10 text-center text-sm text-gray-400">
              주변에 모집 중인 활동이 없어요. ALL 탭에서 전체를 둘러보세요!
            </p>
          ) : (
            list.map((v) => (
              <VolunteerCard
                key={v.id}
                v={v}
                showDistance={tab === 'recommend'}
                nearby={v.dist <= NEARBY_KM}
                isReserved={!!reservedIds?.has(v.id)}
                onToggleReserve={() => toggleReserve(v.id)}
                onOpen={() => {
                  setPendingId?.(v.id)
                  go('detail')
                }}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav go={go} active="home" reserved={reserved} />
    </>
  )
}

// 출처 뱃지 (1365 / e청소년)
export function SourceBadge({ source }) {
  const is1365 = source === '1365'
  return (
    <span
      className="inline-block px-2 py-1 rounded-full text-[11px] font-bold text-white"
      style={{ backgroundColor: is1365 ? '#2E7D32' : '#1E6FD9' }}
    >
      {is1365 ? '1365' : 'e청소년'}
    </span>
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

function VolunteerCard({ v, onOpen, showDistance, nearby, isReserved, onToggleReserve }) {
  const recruiting = v.status === 'recruiting'
  return (
    <button
      onClick={onOpen}
      className={`text-left rounded-2xl p-4 shadow-sm active:scale-[0.99] transition ${
        isReserved ? 'ring-2 ring-grow' : ''
      }`}
      style={{ backgroundColor: '#F9A6A0' }}
    >
      <div className="flex gap-3">
        {/* 왼쪽: 활동 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isReserved && (
              <span className="px-2 py-0.5 rounded-md bg-grow text-white text-[10px] font-bold shrink-0">
                ✓ 예약됨
              </span>
            )}
            <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{v.title}</h3>
          </div>

          {v.org && <p className="mt-1 text-[12px] font-semibold text-gray-700">{v.org}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#8B7DE8' }}>
              {v.location}
            </span>
            {v.source && <SourceBadge source={v.source} />}
            {showDistance && typeof v.dist === 'number' && (
              <span
                className="inline-block px-2 py-1 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: nearby ? '#C4E7C0' : '#eee', color: nearby ? '#2E7D32' : '#666' }}
              >
                📍 {v.dist < 1 ? '1km 이내' : `${Math.round(v.dist)}km`}{nearby ? ' · 근처' : ''}
              </span>
            )}
          </div>

          <p className="mt-2 text-[11px] text-gray-800">
            봉사기간: {v.period} / 봉사시간: {v.time}
          </p>
          <p className="text-[11px] text-gray-800">
            인정 봉사시간: {v.hours}
            {v.field ? ` · ${v.field}` : ''}
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

          {recruiting && (
            <span
              role="checkbox"
              aria-checked={isReserved}
              onClick={(e) => {
                e.stopPropagation()
                onToggleReserve?.()
              }}
              className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800 cursor-pointer"
            >
              <span
                className={`w-3.5 h-3.5 rounded-sm border border-gray-700 flex items-center justify-center ${
                  isReserved ? 'bg-grow border-grow' : 'bg-white/60'
                }`}
              >
                {isReserved && <span className="text-white text-[9px] leading-none">✓</span>}
              </span>
              {isReserved ? '예약됨' : '예약'}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
