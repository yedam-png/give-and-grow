import { useState, useEffect } from 'react'
import PhoneFrame from './components/PhoneFrame.jsx'
import { playClick } from './utils/sound.js'

import SplashScreen from './screens/SplashScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import SignupScreen from './screens/SignupScreen.jsx'
import CharacterScreen from './screens/CharacterScreen.jsx'
import RewardScreen from './screens/RewardScreen.jsx'
import VolunteerListScreen from './screens/VolunteerListScreen.jsx'
import MapScreen from './screens/MapScreen.jsx'
import StoreScreen from './screens/StoreScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import GroupChatScreen from './screens/GroupChatScreen.jsx'
import DetailReserveScreen from './screens/DetailReserveScreen.jsx'
import ConfirmScreen from './screens/ConfirmScreen.jsx'

// 화면 이름(키)과 컴포넌트 매핑. state 기반 전환.
const SCREENS = {
  splash: SplashScreen,
  login: LoginScreen,
  signup: SignupScreen,
  character: CharacterScreen,
  reward: RewardScreen,
  map: MapScreen,
  list: VolunteerListScreen,
  store: StoreScreen,
  profile: ProfileScreen,
  chat: GroupChatScreen,
  detail: DetailReserveScreen,
  confirm: ConfirmScreen,
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  // 선택한 캐릭터 id를 앱 전역 상태로 저장 → 이후 프로필/상점에서 사용 (가이드라인 4장).
  const [character, setCharacter] = useState('C')
  // 상점 보유/착용 상태 — 상점을 벗어났다 돌아와도 유지되도록 전역 보관
  // equipped = 현재 착용한 아이템 id 하나 (또는 null). 각 캐릭터 착용 이미지가 아이템 1개 기준이라 단일 선택.
  const [owned, setOwned] = useState(() => new Set())
  const [equipped, setEquipped] = useState(null)
  // 예약한 봉사활동 id들의 집합 — 여러 개를 동시에 예약 가능.
  const [reservedIds, setReservedIds] = useState(() => new Set())
  // 지금 상세·예약 화면에서 다루는 봉사 id (맵/목록 → 상세 → 완료로 전달)
  const [pendingId, setPendingId] = useState(null)
  // 그룹챗은 예약이 하나라도 있으면 열림
  const reserved = reservedIds.size > 0

  // 버튼/인터랙션 클릭 시 전역 효과음 재생
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest('button, [role="checkbox"], .gg-marker')
      if (el && !el.disabled) playClick()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // 각 화면에 넘겨줄 이동 함수. go('login') 처럼 호출.
  const go = (name) => setScreen(name)

  const Current = SCREENS[screen]

  return (
    <PhoneFrame>
      <Current
        go={go}
        character={character}
        setCharacter={setCharacter}
        owned={owned}
        setOwned={setOwned}
        equipped={equipped}
        setEquipped={setEquipped}
        reserved={reserved}
        reservedIds={reservedIds}
        setReservedIds={setReservedIds}
        pendingId={pendingId}
        setPendingId={setPendingId}
      />
    </PhoneFrame>
  )
}
