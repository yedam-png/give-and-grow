// 픽셀 스타일 아이템 스프라이트 (SVG 격자) — 입체 음영 버전
// 광원은 왼쪽 위. 각 재질마다 하이라이트(밝음) / 베이스 / 섀도(어두움) / 아웃라인 4~5톤을 써서
// 둥근 볼륨감을 표현. 실제 픽셀 아트 PNG가 생기면 여기만 교체하면 됨.

function PixelSprite({ data, size = 48, className, style }) {
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
      className={className}
      style={{ shapeRendering: 'crispEdges', ...style }}
    >
      {rects}
    </svg>
  )
}

// ===== 아이템 픽셀 데이터 (입체 음영) =====
// 공통 톤 키: o=아웃라인, s=섀도(어두움), d=중간섀도, b/v/g=베이스, h=하이라이트, g/w=최고광
// (아이템마다 팔레트는 조금씩 다름)

const campersHat = {
  palette: {
    o: '#2a1d12', s: '#4a3420', d: '#6b4d2c', b: '#8f6838', h: '#b89058', g: '#dcbb80',
  },
  grid: [
    '.....ooooo....',
    '...oogghhbddo.',
    '..oghhhbbbdddo',
    '.oghhbbbbbdddo',
    'oghhbbbbbbddso',
    'oghbbbbbbbddso',
    'ogbbbbbbbbddso',
    '.osssssssssddo',
    '..ooddddddooo.',
    '....osssssoo..',
  ],
}

const rangerCap = {
  palette: {
    o: '#18220f', d: '#2c471f', s: '#233c1a', g: '#4e7a3a', h: '#6fa050', l: '#93c26c', w: '#eef2e2',
  },
  grid: [
    '....oooooo....',
    '..oohhhlllgdo.',
    '.ohhhllgggddo.',
    'ohhhlgwwgggddo',
    'ohhlggwwggsddo',
    'ohlgggggggsddo',
    'olgggggggssdoo',
    '.osddddddddso.',
    'oohhhhllllllddo',
    '.osddddddddso.',
  ],
}

const vest = {
  palette: {
    o: '#22200f', s: '#3a4019', d: '#4a5222', v: '#6f7a34', h: '#93a04c', p: '#3a2f1c', z: '#cbb26f', c: '#26251a',
  },
  grid: [
    '.oo.......oo.',
    '.oho.....odo.',
    '.ohvo...ovdo.',
    'ohhvvc.cvvddo',
    'ohvvhc.cdvvdo',
    'ohvvhc.cdvvdo',
    'ohvhvc.cvdvdo',
    'ohdzvc.cvzddo',
    'ohdppc.cppddo',
    'ohdppc.cppddo',
    'ohdzvc.cvzddo',
    '.ohvvc.cvvdo.',
    '..ohsc.csdo..',
  ],
}

const specialTool = {
  palette: {
    o: '#33383f', s: '#5c626a', m: '#9aa0a8', l: '#d2d7dd', h: '#a06a38', hs: '#5c3d20', hd: '#3d2814',
  },
  grid: [
    'hhs.........ll',
    'hhhs.......lmm',
    '.hhhs.....lmms',
    '..hhhs...lmmso',
    '...hhhs.lmmso.',
    '....hlmmmso...',
    '....slmmho....',
    '...lmmsohhs...',
    '..lmmso.hhhs..',
    '.lmmso...hhhs.',
    'lmmso.....hhhs',
    'mso........hhs',
  ],
}

const boots = {
  palette: {
    o: '#241a10', s: '#1a120a', d: '#4a3420', b: '#7a5a34', h: '#9c7a48', l: '#c39a5e',
  },
  grid: [
    '.ooo.....ooo.',
    '.ohbd....ohbd',
    '.ohbd....ohbd',
    '.ohbbd...ohbb',
    'oohbbd..oohbb',
    'ohlbbd..ohlbb',
    'ohlbbbd.ohlbb',
    'ohhbbbbdohhbb',
    'osssssbdossss',
    '.ooooood.oooo',
  ],
}

const compass = {
  palette: {
    o: '#241f14', gd: '#8f6f2c', g: '#caa24a', gh: '#ecd082', f: '#efe7d2', fs: '#cfc6ab', r: '#c0392b', k: '#2c3e50', p: '#7a6a3a',
  },
  grid: [
    '......pp......',
    '.....p..p.....',
    '.....oooo.....',
    '...ooghhggoo..',
    '..oghhfffgggo.',
    '.oghfffrffgddo',
    'oghffffrfffgds',
    'oghfffrrrffgds',
    'oghffffkfffgds',
    'oghfffkkkffgds',
    '.oghfffkffgddo',
    '..oggfffsgdso.',
    '...ooggggdoo..',
    '.....oddso....',
  ],
}

const ITEM_DATA = {
  'campers-hat': campersHat,
  'ranger-cap': rangerCap,
  vest,
  'special-tool': specialTool,
  boots,
  compass,
}

export default function PixelItem({ id, size = 48, className, style }) {
  const data = ITEM_DATA[id]
  if (!data) return null
  return <PixelSprite data={data} size={size} className={className} style={style} />
}
