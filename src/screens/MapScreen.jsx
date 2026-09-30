import { useEffect, useRef, useState } from 'react'
import { Map as MLMap, Marker, NavigationControl, LngLatBounds } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import BottomNav from '../components/BottomNav.jsx'
import { volunteers } from '../data/mockData.js'
import { mapConfig } from '../config/mapConfig.js'

// 메인 홈 — MapLibre GL 전체화면 지도
// - data 폴더의 봉사활동 장소를 커스텀 아이콘 마커로 표시
// - 마커 탭 시 하단 바텀시트에 장소 정보
// - mapConfig.styleUrl 만 바꾸면 게임풍 테마로 교체 가능
export default function MapScreen({ go, reserved }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [selected, setSelected] = useState(null)

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
    })

    // 빈 지도 클릭 시 바텀시트 닫기
    map.on('click', () => setSelected(null))

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

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
                <h3 className="font-bold text-gray-900 text-base leading-snug flex-1">{selected.title}</h3>
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
                <p>기간: {selected.period}</p>
                <p>시간: {selected.time}</p>
                <p>인정 봉사시간: {selected.hours}</p>
                <p>
                  상태:{' '}
                  <span className={selected.status === 'closed' ? 'text-gray-500' : 'text-grow-dark font-bold'}>
                    {selected.status === 'closed' ? 'Closed' : 'Recruiting'}
                  </span>
                </p>
              </div>

              <button
                onClick={() => go('detail')}
                style={{ backgroundColor: '#AC3B29' }}
                className="mt-4 w-full py-3 rounded-2xl text-white font-bold shadow active:scale-[0.99] transition"
              >
                상세 · 예약하기
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav go={go} active="home" reserved={reserved} />
    </>
  )
}
