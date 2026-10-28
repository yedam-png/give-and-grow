// 위치/거리 유틸 — GPS 현재 위치 기준 '주변 봉사활동' 정렬에 사용.

// 기본값(폴백): 서울 중심. GPS 거부/실패 시 서울 기준으로 동작.
export const SEOUL_CENTER = { lng: 126.978, lat: 37.5665, label: '서울', isGps: false }

// 두 좌표 사이 거리(km) — Haversine
export function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

// 브라우저 GPS로 현재 위치 받기. 성공 시 {lng,lat,label:'내 위치',isGps:true},
// 실패/거부/미지원 시 서울 중심으로 폴백. (HTTPS 또는 localhost에서만 동작)
export function getMyLocation(timeout = 8000) {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(SEOUL_CENTER)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
          label: '내 위치',
          isGps: true,
        })
      },
      () => resolve(SEOUL_CENTER), // 거부/오류 → 서울 폴백
      { enableHighAccuracy: false, timeout, maximumAge: 300000 },
    )
  })
}
