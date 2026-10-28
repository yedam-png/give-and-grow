// 1365 자원봉사포털 → 서울 지역 시간인증봉사 공고를 최대 20건 가져와 JSON으로 저장.
// 매일 GitHub Actions(아침 9시 KST)가 실행해서 src/data/volunteers.json 을 갱신한다.
//   - 서버사이드 fetch (브라우저/크롬 불필요, CORS 무관)
//   - 좌표는 서울 자치구 중심값으로 매핑 (지도 마커 + GPS 거리계산용)
// 사용: node scripts/fetch-volunteers.mjs

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/volunteers.json')

const LIST_URL = 'https://www.1365.go.kr/vols/1572247904127/partcptn/timeCptn.do'
const SEOUL_CODE = '6110000' // searchHopeArea1 (서울특별시)
const MAX_ITEMS = 20

// 서울 25개 자치구 중심 좌표 (lng, lat)
const SEOUL_GU = {
  종로구: [126.979, 37.573], 중구: [126.997, 37.564], 용산구: [126.99, 37.532],
  성동구: [127.037, 37.563], 광진구: [127.082, 37.538], 동대문구: [127.04, 37.574],
  중랑구: [127.093, 37.606], 성북구: [127.017, 37.589], 강북구: [127.025, 37.64],
  도봉구: [127.047, 37.669], 노원구: [127.056, 37.654], 은평구: [126.929, 37.603],
  서대문구: [126.936, 37.579], 마포구: [126.908, 37.566], 양천구: [126.866, 37.517],
  강서구: [126.85, 37.551], 구로구: [126.887, 37.495], 금천구: [126.896, 37.457],
  영등포구: [126.896, 37.526], 동작구: [126.939, 37.512], 관악구: [126.952, 37.478],
  서초구: [127.033, 37.484], 강남구: [127.047, 37.517], 송파구: [127.106, 37.515],
  강동구: [127.124, 37.53],
}
const SEOUL_CENTER = [126.978, 37.5665] // 서울시청 (fallback)

const clean = (s) =>
  (s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const after = (block, label) => {
  const m = block.match(new RegExp(label + '\\s*<\\/p>\\s*<span>([\\s\\S]*?)<\\/span>'))
  return m ? clean(m[1]) : ''
}

const FIELD_SKIP = new Set(['시간인증', '활동인증', '오프라인', '온라인', '비대면', '혼합형', '혼합'])

function coordsFor(location) {
  // "서울 송파구" 같은 문자열에서 자치구명 추출 (한글은 \b가 안 먹어 사용하지 않음)
  for (const gu of Object.keys(SEOUL_GU)) {
    if (location.includes(gu)) return SEOUL_GU[gu]
  }
  return SEOUL_CENTER
}

function parseItems(html) {
  const blocks = html.split('<input type="hidden" id="progrmRegistNo_').slice(1)
  const out = []
  for (const b of blocks) {
    const no = (b.match(/^(\d+)/) || [])[1]
    if (!no) continue
    const title = clean((b.match(/tit_board_list"[^>]*>([\s\S]*?)<\/div>/) || [])[1])
    if (!title) continue

    // 지역 / 모집기관
    const locBlock = (b.match(/vols-location"([\s\S]*?)<\/div>\s*<\/div>/) || [])[1] || ''
    const spans = [...locBlock.matchAll(/<span>\s*([\s\S]*?)\s*<\/span>/g)].map((m) => clean(m[1])).filter(Boolean)
    const location = spans[0] || '서울특별시'
    const org = spans[1] || ''

    // 봉사분야 (태그 ul에서 비-유형 항목)
    const tagUl = (b.match(/ing blue"[\s\S]*?<ul>([\s\S]*?)<\/ul>/) || [])[1] || ''
    const tags = [...tagUl.matchAll(/<li>\s*([\s\S]*?)\s*<\/li>/g)].map((m) => clean(m[1]))
    const field = tags.find((t) => t && !FIELD_SKIP.has(t)) || ''

    const period = after(b, '봉사기간').replace(/\s*~\s*/, ' ~ ')
    const time = after(b, '봉사시간').replace(/\s*:\s*/g, ':').replace(/\s*~\s*/, ' ~ ')
    const hours = after(b, '인정시간')
    const target = after(b, '신청대상') || after(b, '신청대상') || '성인·청소년'

    const status = /class="end">\s*모집완료/.test(b) ? 'closed' : 'recruiting'
    const deadlineToday = /금일\s*(<br\s*\/?>)?\s*마감/.test(b)

    const [lng, lat] = coordsFor(location)

    out.push({
      id: Number(no),
      title,
      org,
      location: location.replace('특별시', '').trim() || location, // "서울 송파구"
      field,
      target,
      lng,
      lat,
      period,
      time,
      hours,
      status,
      deadlineToday,
      source: '1365',
      url: `${LIST_URL}?type=show&progrmRegistNo=${no}`,
    })
    if (out.length >= MAX_ITEMS) break
  }
  return out
}

async function fetchPage(cPage) {
  const url = `${LIST_URL}?searchHopeArea1=${SEOUL_CODE}&cPage=${cPage}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GiveGrowBot/1.0)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} on page ${cPage}`)
  return res.text()
}

async function main() {
  const all = []
  for (let page = 1; page <= 3 && all.length < MAX_ITEMS; page++) {
    const html = await fetchPage(page)
    const items = parseItems(html)
    for (const it of items) {
      if (all.find((x) => x.id === it.id)) continue
      all.push(it)
      if (all.length >= MAX_ITEMS) break
    }
    if (items.length === 0) break
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    region: '서울',
    source: '1365 자원봉사포털',
    count: all.length,
    items: all,
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`✓ ${all.length}건 저장 → ${OUT}`)
  if (all[0]) console.log(`  예: ${all[0].location} / ${all[0].title}`)
}

main().catch((e) => {
  console.error('✗ 수집 실패:', e.message)
  process.exit(1)
})
