// 모든 가짜(mock) 데이터를 이 파일 한곳에 모음.
// 나중에 실제 서버 데이터로 교체하기 쉽게 하기 위함 (가이드라인 3장).

// 봉사활동 목록 (메인 페이지 카드)
export const volunteers = [
  {
    id: 1,
    title: '[HappyWorld] Free meal volunteer (Apply by phone call)',
    location: 'Gangdong-gu, Seoul',
    lng: 127.1237,
    lat: 37.5301,
    period: '2026.04.09~2026.07.09',
    time: '9:00 ~ 12:00',
    hours: 'Up to 3 hours',
    status: 'recruiting', // 'recruiting' | 'closed'
    deadlineToday: true,
  },
  {
    id: 2,
    title: 'Environmental Cleanup at Inhu Youth Center After-School Academy',
    location: 'Jeonju-si, Jeonbuk State',
    lng: 127.148,
    lat: 35.8242,
    period: '2026.04.08~2026.07.08',
    time: '14:00 ~ 17:00',
    hours: 'Up to 3 hours',
    status: 'recruiting',
    deadlineToday: true,
  },
  {
    id: 3,
    title: 'Assisting with activity programs and meal services for senior residents at House of Low Voices',
    location: 'Hanam City',
    lng: 127.205,
    lat: 37.5392,
    period: '2026.05.09~2026.07.08',
    time: '9:00 ~ 17:00',
    hours: 'Up to 8 hours',
    status: 'recruiting',
    deadlineToday: true,
  },
  {
    id: 4,
    title: 'Senior Companion, Meal Service, and Cleaning Volunteer (Weekend/Holiday, Morning Shift Optional)',
    location: 'Gangdong-gu, Seoul',
    lng: 127.129,
    lat: 37.525,
    period: '2026.06.29~2026.07.28',
    time: '10:00 ~ 14:00',
    hours: 'Up to 4 hours',
    status: 'closed',
    deadlineToday: false,
  },
]

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
// category: 'avatar' | 'cloth' | 'gear'  (탭: All / Avatar / Cloth, gear는 All에서만 노출)
// icon 은 이모지 placeholder. 실제 아트가 생기면 { img } 로 교체 예정.
// crew 는 캐릭터 이미지를 재사용 (charKey: 'A'|'B'|'C')
// img = 완성 카드 이미지(삽화+가격+이름 포함, Market 그리드용).
// icon/charKey 는 Customize에서 캐릭터에 입힐 때 쓰는 픽셀 스프라이트 식별자.
export const storeItems = [
  { id: 'vest', name: 'Dungeon Explorer Vest', price: 90, category: 'cloth', img: 'item1' },
  { id: 'campers-hat', name: 'Compass Hat', price: 75, category: 'cloth', img: 'item2' },
  { id: 'ranger-cap', name: 'Compass Cap', price: 90, category: 'cloth', img: 'item3' },
  { id: 'special-tool', name: 'Special Tool', price: 75, category: 'gear', img: 'item4' },
  { id: 'boots', name: 'Boots Backpack', price: 75, category: 'cloth', img: 'item5' },
  { id: 'compass', name: 'Compass', price: 75, category: 'gear', img: 'item6' },
  { id: 'crew-a', name: 'Original Crew', price: 120, category: 'avatar', img: 'item7', charKey: 'A' },
  { id: 'crew-c', name: 'Original Crew', price: 120, category: 'avatar', img: 'item8', charKey: 'C' },
  { id: 'crew-b', name: 'Original Crew', price: 120, category: 'avatar', img: 'item9', charKey: 'B' },
]
