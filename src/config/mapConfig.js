// 지도 설정 — 타일/스타일 제공사를 여기서만 바꾸면 전체가 교체됨.
// MapTiler 무료 키는 환경변수(VITE_MAPTILER_KEY)로 주입. (.env 에 설정)
const KEY = import.meta.env.VITE_MAPTILER_KEY || ''

// 래스터(이미지) 타일용 MapLibre 스타일 객체 생성기.
// 래스터는 벡터보다 호환성이 높아 배경 지도가 안정적으로 렌더됨.
function rasterStyle(tilesUrl, attribution, tileSize = 256) {
  return {
    version: 8,
    sources: {
      base: { type: 'raster', tiles: [tilesUrl], tileSize, attribution },
    },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  }
}

// 스타일(제공사) 목록 — 나중에 다른 제공사/테마로 교체하기 쉽게 한곳에 모음.
export const MAP_STYLES = {
  // ✅ 기본: MapTiler 래스터(이미지) 타일 — 배경 지도가 잘 뜸
  maptilerStreetsRaster: KEY
    ? rasterStyle(`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${KEY}`, '© MapTiler © OpenStreetMap contributors')
    : null,
  maptilerSatellite: KEY
    ? rasterStyle(`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${KEY}`, '© MapTiler © OpenStreetMap contributors')
    : null,

  // MapTiler 벡터 스타일(고화질, 단 일부 환경에서 렌더 안 될 수 있음)
  maptilerStreetsVector: KEY ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${KEY}` : null,

  // 게임풍 테마 — MapTiler Cloud에서 만든 커스텀 스타일 URL 넣기
  // game: KEY ? `https://api.maptiler.com/maps/<your-game-style-id>/style.json?key=${KEY}` : null,

  // 키 없을 때 폴백 — OSM 래스터 (키 불필요/무료)
  osmRaster: rasterStyle('https://tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap contributors'),
}

export const mapConfig = {
  // ↓ 이 한 줄만 바꾸면 지도 스타일(래스터/벡터/게임풍) 전체 교체
  // MapLibre 의 style 옵션은 URL 문자열 또는 스타일 객체 둘 다 허용.
  style: MAP_STYLES.maptilerStreetsRaster || MAP_STYLES.osmRaster,

  center: [127.13, 37.53], // [lng, lat] — 서울 강동 근처
  zoom: 10,
  minZoom: 3,
  maxZoom: 19,

  hasKey: Boolean(KEY),
  usingFallback: !KEY,
}
