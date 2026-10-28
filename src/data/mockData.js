// 모든 가짜(mock) 데이터를 이 파일 한곳에 모음.
// 나중에 실제 서버 데이터로 교체하기 쉽게 하기 위함 (가이드라인 3장).

// 봉사활동 목록 — 실제 공고 데이터.
// src/data/volunteers.json 은 GitHub Actions가 매일 아침 9시(KST)에
// 1365 자원봉사포털(서울 지역, 최대 20건)에서 받아와 자동 갱신한다.
// (수동 갱신: `node scripts/fetch-volunteers.mjs`)
import volunteersData from './volunteers.json'

export const volunteers = volunteersData.items || []
// 데이터가 마지막으로 갱신된 시각/출처 (UI에 "오늘 오전 갱신" 등으로 표시 가능)
export const volunteersMeta = {
  updatedAt: volunteersData.updatedAt || null,
  region: volunteersData.region || '',
  source: volunteersData.source || '',
  count: volunteersData.count || (volunteersData.items ? volunteersData.items.length : 0),
}

// 캐릭터 (캐릭터 선택 화면) — 이미지는 각 화면에서 import 하여 사용
export const characters = ['A', 'B', 'C']

// 개인 프로필 (Personal Volunteer)
// 후원(Total Donations) 시스템 삭제됨. Karma Points → Coin 으로 변경.
export const profile = {
  username: 'SPROUT_GIRL01',
  rank: 'NOVICE HELPER',
  hours: 120, // Volunteer Hours
  jobs: 35, // Completed Tasks
  coin: 450, // Coin (구 Karma Points)
}

// 봉사활동 기록 (프로필 하단, 탭: Reserved / History)
// Reserved = 지금 예약/진행 중, History = 지금까지 완료한 봉사.
// img = 완성 카드 이미지(삽화+포인트 포함). title/status 는 카드 위에 깔끔한 텍스트로 표시.
export const activities = [
  { id: 'a1', title: 'Park Cleanup', status: 'History', img: 'activity1' },
  { id: 'a2', title: 'Animal Care', status: 'Reserved', img: 'activity2' },
  { id: 'a3', title: 'Senior Aid', status: 'History', img: 'activity3' },
  { id: 'a4', title: 'Cloth Sorting', status: 'Reserved', img: 'activity4' },
  { id: 'a5', title: 'Charity Drive', status: 'History', img: 'activity5' },
  { id: 'a6', title: 'Community Support', status: 'History', img: 'activity6' },
]

// 그룹챗 (Group Chat) — 프로필 화면의 'Group Chat' 탭
// avatar: 'A'|'B'|'C' = 캐릭터 이미지, 'me' = 내가 고른 캐릭터
export const chatGroup = { name: 'GREEN ECO VOLUNTEERS', members: 12 }
export const chatMessages = [
  { id: 'm1', sender: 'SPROUT_GIRL01', avatar: 'C', side: 'left', text: 'Are we still on for the Saturday park cleanup?', time: '10:35 AM' },
  { id: 'm2', sender: 'USER', avatar: 'me', side: 'right', text: 'Yes, count me in!', time: '10:36 AM' },
  { id: 'm3', sender: 'NAVY_CAP_BOY', avatar: 'B', side: 'left', text: 'Yes, same time!', time: '10:38 AM' },
  { id: 'm4', sender: 'USER', avatar: 'me', side: 'right', text: "Got it! Who's bringing extra bags?", time: '10:44 AM' },
  { id: 'm5', sender: 'SENIOR_AID', avatar: 'A', side: 'left', text: "I'll bring a few with me!", time: '10:55 AM' },
  { id: 'm6', sender: 'SPROUT_GIRL01', avatar: 'C', side: 'left', text: 'Great, see everyone Saturday! 🌳', time: '10:56 AM' },
  { id: 'm7', sender: 'NAVY_CAP_BOY', avatar: 'B', side: 'left', text: 'Yes, please bring your gloves too!', time: '10:57 AM' },
]

// 상점(Store) 아이템
// category: 'cloth' | 'gear'  (탭: All / Cloth / Gear)
// img = 완성 카드 이미지(삽화+가격+이름 포함, Market 그리드용).
export const storeItems = [
  { id: 'vest', name: 'Dungeon Explorer Vest', price: 90, category: 'cloth', img: 'item1' },
  { id: 'campers-hat', name: 'Compass Hat', price: 75, category: 'cloth', img: 'item2' },
  { id: 'ranger-cap', name: 'Compass Cap', price: 90, category: 'cloth', img: 'item3' },
  { id: 'special-tool', name: 'Special Tool', price: 75, category: 'gear', img: 'item4' },
  { id: 'boots', name: 'Boots Backpack', price: 75, category: 'cloth', img: 'item5' },
  { id: 'compass', name: 'Compass', price: 75, category: 'gear', img: 'item6' },
]
