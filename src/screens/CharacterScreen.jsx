import charA from '../assets/CharacterA.png'
import charB from '../assets/CharacterB.png'
import charC from '../assets/CharacterC.png'

// ④ 캐릭터 선택 (Choose your character)
// - 캐릭터 3종을 좌우 화살표로 넘기며 선택 (선택값은 App 전역 상태에 저장).
// - 선택된(가운데) 캐릭터마다 다른 idle 애니메이션 + 주변 반짝임(별) + 전환 시 팝 등장.
// - "Create account" 버튼 → 봉사 목록 화면으로.
// 목업 순서(왼→오): A(핑크) · C(초록) · B(보라), 초기 선택은 가운데(C).
const CHARACTERS = [
  {
    id: 'A',
    img: charA,
    color: '#F98A8A',
    anim: 'anim-sway', // 탐험가: 좌우로 살랑
    sparkles: [
      { e: '✨', top: '8%', left: '10%', d: '0s' },
      { e: '⭐', top: '20%', left: '74%', d: '0.5s' },
    ],
  },
  {
    id: 'C',
    img: charC,
    color: '#54D06A',
    anim: 'anim-float', // 새싹: 둥실둥실
    sparkles: [
      { e: '⭐', top: '3%', left: '54%', d: '0s' },
      { e: '✨', top: '12%', left: '80%', d: '0.4s' },
      { e: '✨', top: '22%', left: '8%', d: '0.8s' },
    ],
  },
  {
    id: 'B',
    img: charB,
    color: '#8B7DE8',
    anim: 'anim-bounce', // 삽: 통통 튀기
    sparkles: [
      { e: '✨', top: '8%', left: '70%', d: '0s' },
      { e: '💫', top: '24%', left: '10%', d: '0.5s' },
    ],
  },
]

export default function CharacterScreen({ go, character, setCharacter }) {
  const n = CHARACTERS.length
  const index = Math.max(0, CHARACTERS.findIndex((c) => c.id === character))

  const prev = CHARACTERS[(index - 1 + n) % n]
  const current = CHARACTERS[index]
  const next = CHARACTERS[(index + 1) % n]

  const goPrev = () => setCharacter(CHARACTERS[(index - 1 + n) % n].id)
  const goNext = () => setCharacter(CHARACTERS[(index + 1) % n].id)

  return (
    <div className="flex-1 w-full flex flex-col px-6 pt-12 pb-8">
      {/* 제목 */}
      <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900">
        Choose
        <br />
        your character
      </h1>
      <p className="mt-3 text-lg font-semibold text-gray-800">
        Find the one that&apos;s you!
      </p>

      {/* 캐러셀 */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <CharacterCard data={prev} variant="side" />
          {/* key=id → 선택이 바뀔 때마다 다시 마운트되어 팝 등장 애니메이션 재생 */}
          <CharacterCard key={current.id} data={current} variant="main" />
          <CharacterCard data={next} variant="side" />
        </div>

        {/* 좌우 화살표 */}
        <button
          onClick={goPrev}
          aria-label="이전 캐릭터"
          className="absolute left-1 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 text-gray-700 text-xl shadow active:scale-90 transition"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          aria-label="다음 캐릭터"
          className="absolute right-1 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 text-gray-700 text-xl shadow active:scale-90 transition"
        >
          ›
        </button>
      </div>

      {/* 완료 버튼 → 첫 보상 컨펌 페이지 */}
      <button
        onClick={() => go('reward')}
        style={{ backgroundColor: '#AC3B29' }}
        className="mt-6 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-md active:scale-[0.99] transition"
      >
        Create account
      </button>
    </div>
  )
}

// 캐릭터 카드. main=가운데 크게(애니메이션+반짝임), side=양옆 작게(정적).
function CharacterCard({ data, variant }) {
  const isMain = variant === 'main'
  return (
    <div
      className={`relative shrink-0 rounded-2xl flex items-end justify-center overflow-hidden shadow-md ${
        isMain ? 'w-44 h-72 z-10 anim-pop' : 'w-28 h-56 opacity-80'
      }`}
      style={{ backgroundColor: data.color }}
    >
      {/* 반짝임(별) 오버레이 — 선택된 캐릭터에만 */}
      {isMain &&
        data.sparkles.map((s, i) => (
          <span
            key={i}
            className="absolute anim-twinkle pointer-events-none select-none"
            style={{ top: s.top, left: s.left, fontSize: '1.4rem', animationDelay: s.d }}
          >
            {s.e}
          </span>
        ))}

      <img
        src={data.img}
        alt=""
        className={`w-full h-full object-contain p-2 ${isMain ? data.anim : ''}`}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
