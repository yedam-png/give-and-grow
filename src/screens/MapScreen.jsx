import { useEffect, useRef, useState } from 'react'
import { Map as MLMap, Marker, NavigationControl, LngLatBounds } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import BottomNav from '../components/BottomNav.jsx'
import { volunteers } from '../data/mockData.js'
import { mapConfig } from '../config/mapConfig.js'
import { SourceBadge } from './VolunteerListScreen.jsx'
import { getMyLocation } from '../utils/geo.js'

// 메인 홈 — MapLibre GL 전체화면 지도
// - data 폴더의 봉사활동 장소를 커스텀 아이콘 마커로 표시
// - 마커 탭 시 하단 바텀시트에 장소 정보
// - mapConfig.styleUrl 만 바꾸면 게임풍 테마로 교체 가능
export default function MapScreen({ go, reserved, reservedIds, setReservedIds, setPendingId }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerEls = useRef({}) // 봉사 id → 마커 DOM (예약 표시 갱신용)
  const [selected, setSelected] = useState(null)

  const isReserved = (v) => !!(v && reservedIds?.has(v.id))
  const cancelReserve = (id) =>
    setReservedIds?.((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new MLMap({
      container: containerRef.current,
      style: mapConfig.style,
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
      attributionControl: { compact: true },
      preserveDrawingBuffer: true, // 스크린샷 캡처 가능하도록
    })
    mapRef.current = map

    map.addControl(new NavigationControl({ showCompass: false }), 'top-left')

    // 마커에 좌표가 있는 봉사활동만 표시
    const places = volunteers.filter((v) => typeof v.lng === 'number' && typeof v.lat === 'number')
    const bounds = new LngLatBounds()

    places.forEach((v) => {
      const el = document.createElement('div')
      el.className = 'gg-marker'
      const color = v.status === 'closed' ? '#8B8B8B' : '#4CAF50'
      el.innerHTML = `<div class="gg-marker-pin" style="background:${color}"><span>🌱</span></div>`
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelected(v)
        map.flyTo({ center: [v.lng, v.lat], zoom: Math.max(map.getZoom(), 12), speed: 0.8 })
      })

      markerEls.current[v.id] = el

      new Marker({ element: el, anchor: 'bottom' })
        .setLngLat([v.lng, v.lat])
        .addTo(map)

      bounds.extend([v.lng, v.lat])
    })

    // 모든 마커가 보이도록 맞춤
    map.on('load', () => {
      map.resize()
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 0 })
      }

      // 현재 위치(GPS) 마커 — 허용 시 파란 점 표시 (지도 중심은 전체 마커 유지)
      getMyLocation().then((loc) => {
        if (!loc.isGps || !mapRef.current) return
        const me = document.createElement('div')
        me.className = 'gg-me-marker'
        me.innerHTML =
          '<div style="width:18px;height:18px;border-radius:50%;background:#2E7DFF;border:3px solid #fff;box-shadow:0 0 0 4px rgba(46,125,255,.3)"></div>'
        new Marker({ element: me, anchor: 'center' }).setLngLat([loc.lng, loc.lat]).addTo(map)
      })
    })

    // 빈 지도 클릭 시 바텀시트 닫기
    map.on('click', () => setSelected(null))

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 예약 상태가 바뀌면 해당 마커에 ✓ 표시 갱신 (지도 재생성 없이)
  useEffect(() => {
    Object.entries(markerEls.current).forEach(([id, el]) => {
      const on = reservedIds?.has(Number(id))
      const pin = el.querySelector('.gg-marker-pin')
      if (pin) pin.style.boxShadow = on ? '0 0 0 3px #AC3B29' : ''
      let badge = el.querySelector('.gg-marker-check')
      if (on && !badge) {
        badge = document.createElement('span')
        badge.className = 'gg-marker-check'
        badge.textContent = '✓'
        badge.style.cssText =
          'position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#AC3B29;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.3)'
        el.style.position = 'relative'
        el.appendChild(badge)
      } else if (!on && badge) {
        badge.remove()
      }
    })
  }, [reservedIds])

  return (
    <>
      <div className="flex-1 relative overflow-hidden">
        {/* 지도 */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* 상단: 목록 보기 토글 + 키 안내 */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
          <button
            onClick={() => go('list')}
            className="px-3 py-2 rounded-xl bg-white/90 shadow text-sm font-bold text-grow-dark active:scale-95 transition"
          >
            ☰ 목록
          </button>
          {mapConfig.usingFallback && (
            <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] max-w-[180px] text-right leading-tight">
              MapTiler 키 없음 — 무료 폴백 스타일 사용 중
            </span>
          )}
        </div>

        {/* 바텀시트 — 마커 탭 시 */}
        {selected && (
          <div className="absolute inset-x-0 bottom-0 z-20 anim-sheet-up">
            <div className="bg-white rounded-t-3xl shadow-2xl px-5 pt-3 pb-5">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {selected.source && <SourceBadge source={selected.source} />}
                  <h3 className="mt-1 font-bold text-gray-900 text-base leading-snug">{selected.title}</h3>
                  {selected.org && <p className="mt-0.5 text-sm font-semibold text-gray-600">{selected.org}</p>}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="닫기"
                  className="shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <span
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: '#8B7DE8' }}
              >
                📍 {selected.location}
              </span>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>봉사기간: {selected.period}</p>
                <p>봉사시간: {selected.time}</p>
                <p>인정 봉사시간: {selected.hours}</p>
                {selected.field && <p>봉사분야: {selected.field}</p>}
                <p>
                  상태:{' '}
                  <span className={selected.status === 'closed' ? 'text-gray-500' : 'text-grow-dark font-bold'}>
                    {selected.status === 'closed' ? '모집완료' : '모집중'}
                  </span>
                </p>
              </div>

              {selected.url && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gray-100 text-grow-dark font-bold text-sm active:scale-[0.99] transition"
                >
                  해당 사이트에서 자세히 보기 ↗
                </a>
              )}

              {isReserved(selected) ? (
                <div className="mt-4 space-y-2">
                  <div className="w-full py-3 rounded-2xl bg-grow-light text-grow-dark font-bold text-center">
                    ✓ 예약 완료된 활동이에요
                  </div>
                  <button
                    onClick={() => cancelReserve(selected.id)}
                    className="w-full py-2.5 rounded-2xl border border-gray-300 text-gray-600 font-bold active:scale-[0.99] transition"
                  >
                    예약 취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPendingId?.(selected.id)
                    go('detail')
                  }}
                  disabled={selected.status === 'closed'}
                  style={{ backgroundColor: selected.status === 'closed' ? '#B9B9B9' : '#AC3B29' }}
                  className="mt-4 w-full py-3 rounded-2xl text-white font-bold shadow active:scale-[0.99] transition disabled:active:scale-100"
                >
                  {selected.status === 'closed' ? '모집 마감된 활동' : '상세 · 예약하기'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav go={go} active="home" reserved={reserved} />
    </>
  )
}
