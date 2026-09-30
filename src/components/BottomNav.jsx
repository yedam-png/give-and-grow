// 하단 네비게이션 바 — 로그인 이후 메인 화면에 공통.
// 캐릭터/아이템과 같은 픽셀 스타일: 어두운 아웃라인 + 컬러 채움.

// 12x12 픽셀 격자 + 팔레트 ('.'=투명)
const ICONS = {
  home: {
    palette: { o: '#2f2a1a', r: '#c85a43', h: '#e58b6b', w: '#ecdcae', d: '#7a5230' },
    grid: [
      '.....oo.....',
      '....orro....',
      '...orrrro...',
      '..ohrrrrro..',
      '.ohrrrrrrro.',
      'orrrrrrrrrro',
      '.owwwwwwwwo.',
      '.owwwwwwwwo.',
      '.owwwddwwwo.',
      '.owwwddwwwo.',
      '.owwwddwwwo.',
      '.oooooooooo.',
    ],
  },
  store: {
    palette: { o: '#2f2618', b: '#bd8347', h: '#d9a568', d: '#8a5c2e' },
    grid: [
      '...o....o...',
      '..oo....oo..',
      '..o.o..o.o..',
      '.oobooooboo.',
      '.obhbbbbbbo.',
      '.obhbbbbbbo.',
      '.obbbbbbbbo.',
      '.obbbbbbbbo.',
      '.obbbbbbbbo.',
      '.obbbbbbbbo.',
      '.obbbbbbbdo.',
      '.oooooooooo.',
    ],
  },
  chat: {
    palette: { o: '#2b3a4a', p: '#8fc0e8', h: '#c3e0f5', d: '#5f93c2' },
    grid: [
      '..........oo',
      '........oopp',
      '......ooppph',
      '....ooppppph',
      '..ooppppppph',
      'oopppppppppp',
      'ooddppppppph',
      '..oodppppph.',
      '....ooddpph.',
      '..o...oodph.',
      '..oo....ooh.',
      '............',
    ],
  },
  profile: {
    palette: { o: '#2f2418', h: '#7a4a24', k: '#e6b98f', s: '#4e7a3a' },
    grid: [
      '....oooo....',
      '...ohhhho...',
      '..ohhhhhho..',
      '..ohkkkkho..',
      '..okkkkkko..',
      '..okkkkkko..',
      '...okkkko...',
      '..osssssso..',
      '.osssssssso.',
      '.osssssssso.',
      '.osssssssso.',
      '.oooooooooo.',
    ],
  },
}

function PixelIcon({ data, size = 26 }) {
  const { grid, palette } = data
  const rows = grid.length
  const cols = grid.reduce((m, r) => Math.max(m, r.length), 0)
  const rects = []
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.' || ch === ' ') continue
      const fill = palette[ch]
      if (!fill) continue
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.03} height={1.03} fill={fill} />)
    }
  })
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={(size * rows) / cols}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {rects}
    </svg>
  )
}

// 1단계에서는 홈/상점/프로필만 연결, '내 활동'은 디자인만(비활성).
const ITEMS = [
  { key: 'home', label: '홈', screen: 'map' },
  { key: 'store', label: '상점', screen: 'store' },
  { key: 'chat', label: '그룹챗', screen: 'chat' },
  { key: 'profile', label: '프로필', screen: 'profile' },
]

export default function BottomNav({ go, active = 'home', reserved = false }) {
  return (
    <nav className="border-t border-gray-200 bg-white flex justify-around items-center h-16 shrink-0">
      {ITEMS.map((item) => {
        const on = active === item.key
        const locked = item.key === 'chat' && !reserved
        return (
          <button
            key={item.key}
            onClick={() => item.screen && go(item.screen)}
            aria-label={locked ? `${item.label} (잠김)` : item.label}
            className="flex flex-col items-center"
          >
            <span
              className={`relative p-1.5 rounded-lg transition ${
                on ? 'bg-grow-light' : 'opacity-60'
              } ${locked ? 'opacity-40' : ''}`}
            >
              <PixelIcon data={ICONS[item.key]} />
              {locked && (
                <span className="absolute -top-1 -right-1 text-[11px] leading-none">🔒</span>
              )}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
