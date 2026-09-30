import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import { profile, activities } from '../data/mockData.js'
import { costumeImg } from '../costume.js'
import activity1 from '../assets/activity1.png'
import activity2 from '../assets/activity2.png'
import activity3 from '../assets/activity3.png'
import activity4 from '../assets/activity4.png'
import activity5 from '../assets/activity5.png'
import activity6 from '../assets/activity6.png'

const ACT_IMG = { activity1, activity2, activity3, activity4, activity5, activity6 }

// My Page (프로필) — 하단 네비 사람 아이콘으로 진입
// - "My Page" 제목 + 프로필 카드(원본 이미지 + 하단 스탯만 Coin으로 교체) + 탭 + 활동 카드 2열
export default function ProfileScreen({ go, character, equipped, reserved }) {
  const [tab, setTab] = useState('History') // 'History' | 'Reserved'
  const list = activities.filter((a) => a.status === tab)

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          <h1 className="text-center text-2xl font-extrabold text-gray-900 mb-3">My Page</h1>

          {/* 프로필 카드 (HTML) — 아바타 = 착용 코스튬 캐릭터 */}
          <div className="rounded-3xl overflow-hidden shadow-lg" style={{ backgroundColor: '#f1f0ec' }}>
            <div className="px-4 py-2.5" style={{ backgroundColor: '#e3dfd4' }}>
              <h2 className="text-lg font-extrabold text-gray-900 tracking-wide">PERSONAL VOLUNTEER</h2>
            </div>

            <div className="px-4 py-4 flex items-center gap-4">
              {/* 코스튬 아바타 (전신, 구매·착용 반영) */}
              <div className="w-28 h-32 rounded-xl bg-white border-2 border-[#3a352b] overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={costumeImg(character, equipped)}
                  alt="내 코스튬"
                  className="w-full h-full object-contain p-1"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-gray-900 tracking-wide truncate">{profile.username}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-[#e3dfd4] border border-[#c9c2af] rounded-lg px-2 py-1">
                  <span className="text-amber-500">🛡️</span>
                  <span className="text-xs font-bold text-gray-800 leading-tight">{profile.rank}</span>
                </div>
              </div>
            </div>

            {/* 스탯 3종 */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2.5">
              <Stat icon="⏰" label="Volunteer Hours" value={`${profile.hours} hrs`} />
              <Stat icon="📋" label="Completed Tasks" value={`${profile.jobs} jobs`} />
              <Stat icon="🪙" label="Coin" value={`${profile.coin} c`} span />
            </div>
          </div>

          {/* 탭: History(완료) / Reserved(진행 중) */}
          <div className="mt-4 flex gap-2">
            <Tab active={tab === 'History'} onClick={() => setTab('History')}>History</Tab>
            <Tab active={tab === 'Reserved'} onClick={() => setTab('Reserved')}>Reserved</Tab>
          </div>

          {/* 활동 카드 2열 — 삽화는 이미지, 하단 제목/상태는 깔끔한 텍스트로 덮음 */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {list.map((a) => (
              <div key={a.id} className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <img src={ACT_IMG[a.img]} alt={a.title} className="w-full block" />
                <div className="absolute bottom-0 inset-x-0 h-[26%] bg-[#e9e8e4] border-t border-gray-200 flex flex-col items-center justify-center px-1 text-center">
                  <p className="font-extrabold text-gray-900 text-[13px] leading-tight tracking-tight">
                    {a.title}
                  </p>
                  <p className="text-[11px] font-semibold text-gray-500 leading-tight">({a.status})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav go={go} active="profile" reserved={reserved} />
    </>
  )
}

function Stat({ icon, label, value, span }) {
  return (
    <div
      className={`rounded-lg border-2 border-[#3a352b] px-3 py-2 flex items-center gap-2 ${span ? 'col-span-2' : ''}`}
      style={{ backgroundColor: '#e3dfd4' }}
    >
      <span className="text-xl leading-none">{icon}</span>
      <div className="min-w-0 leading-none">
        <p className="text-[10px] text-gray-600 font-bold mb-0.5 truncate">{label}</p>
        <p className="text-base font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-xl text-sm font-bold transition ${
        active ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}
