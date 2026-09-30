import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import { storeItems } from '../data/mockData.js'
import charA from '../assets/CharacterA.png'
import charB from '../assets/CharacterB.png'
import charC from '../assets/CharacterC.png'
import item1 from '../assets/item1.png'
import item2 from '../assets/item2.png'
import item3 from '../assets/item3.png'
import item4 from '../assets/item4.png'
import item5 from '../assets/item5.png'
import item6 from '../assets/item6.png'
import item7 from '../assets/item7.png'
import item8 from '../assets/item8.png'
import item9 from '../assets/item9.png'

const ITEM_IMG = { item1, item2, item3, item4, item5, item6, item7, item8, item9 }
const CHAR_ORDER = ['A', 'C', 'B']

// 캐릭터별 착용 완성 이미지 (assets/char/{A|B|C}_{base|vest|hat1|hat2|tool|boots|compass}.png)
const charAssets = import.meta.glob('../assets/char/*.png', { eager: true, import: 'default' })
const charImg = (letter, key = 'base') =>
  charAssets[`../assets/char/${letter}_${key}.png`] || charAssets[`../assets/char/${letter}_base.png`]

// 아이템 id → 착용 이미지 키
const ITEM_TO_KEY = {
  vest: 'vest',
  'campers-hat': 'hat1',
  'ranger-cap': 'hat2',
  'special-tool': 'tool',
  boots: 'boots',
  compass: 'compass',
}

const STAGE_BG = '#fdfdfd' // 착용 이미지의 흰 배경과 맞춘 무대색

// 상점 (Store) — 하단 네비 '상점' 아이콘으로 진입
export default function StoreScreen({ go, character, setCharacter, owned, setOwned, equipped, setEquipped, reserved }) {
  const [topTab, setTopTab] = useState('market') // 'market' | 'customize'
  const [selectedItem, setSelectedItem] = useState(null)
  const [showBundle, setShowBundle] = useState(false)

  const buyItem = (item) => setOwned((prev) => new Set(prev).add(item.id))

  // 아이템 장착/해제 (단일 착용) 또는 아바타 변신
  const toggleEquip = (item) => {
    if (item.category === 'avatar') {
      setCharacter?.(item.charKey)
      return
    }
    setEquipped((prev) => (prev === item.id ? null : item.id))
  }

  const isEquipped = (item) =>
    item.category === 'avatar' ? character === item.charKey : equipped === item.id

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="px-5 pt-6 pb-3 flex justify-center gap-2">
          <TopTab active={topTab === 'market'} onClick={() => setTopTab('market')}>
            Market Place
          </TopTab>
          <TopTab active={topTab === 'customize'} onClick={() => setTopTab('customize')}>
            Customize
          </TopTab>
        </div>

        {topTab === 'market' ? (
          <MarketView
            owned={owned}
            onSelectItem={setSelectedItem}
            onOpenBundle={() => setShowBundle(true)}
          />
        ) : (
          <CustomizeView character={character} equipped={equipped} setEquipped={setEquipped} />
        )}

        {selectedItem && (
          <ItemDetailSheet
            item={selectedItem}
            character={character}
            owned={owned.has(selectedItem.id)}
            equipped={isEquipped(selectedItem)}
            onBuy={() => buyItem(selectedItem)}
            onToggleEquip={() => toggleEquip(selectedItem)}
            onGoCustomize={() => {
              setSelectedItem(null)
              setTopTab('customize')
            }}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {showBundle && <BundleDetailSheet onClose={() => setShowBundle(false)} />}
      </div>

      <BottomNav go={go} active="store" reserved={reserved} />
    </>
  )
}

// ===== Market Place =====
function MarketView({ owned, onSelectItem, onOpenBundle }) {
  const [category, setCategory] = useState('all')
  const items = storeItems.filter((it) =>
    category === 'all' ? true : it.category === category,
  )

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <BundleBanner onClick={onOpenBundle} />

      <div className="mt-5 flex gap-2">
        <CatTab active={category === 'all'} onClick={() => setCategory('all')}>All</CatTab>
        <CatTab active={category === 'avatar'} onClick={() => setCategory('avatar')}>Avatar</CatTab>
        <CatTab active={category === 'cloth'} onClick={() => setCategory('cloth')}>Cloth</CatTab>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {items.map((it) => (
          <ItemTile key={it.id} item={it} owned={owned.has(it.id)} onClick={() => onSelectItem(it)} />
        ))}
      </div>
    </div>
  )
}

// 캐릭터가 아이템을 착용한 완성 그림 미리보기
function WearPreview({ character, item }) {
  const isAvatar = item.category === 'avatar'
  const c = isAvatar ? item.charKey : character || 'C'
  const key = isAvatar ? 'base' : ITEM_TO_KEY[item.id]
  const src = charImg(c, key)

  return (
    <div
      className="relative mx-auto w-52 h-64 rounded-3xl shadow-md overflow-hidden flex items-end justify-center"
      style={{ backgroundColor: STAGE_BG }}
    >
      <img
        src={src}
        alt="미리보기"
        className="w-full h-full object-contain p-2"
        style={{ imageRendering: 'pixelated' }}
      />
      <span className="absolute top-4 left-4 anim-twinkle">✨</span>
      <span className="absolute top-8 right-5 anim-twinkle" style={{ animationDelay: '0.6s' }}>✨</span>
    </div>
  )
}

function ItemDetailSheet({ item, character, owned, equipped, onBuy, onToggleEquip, onGoCustomize, onClose }) {
  const isAvatar = item.category === 'avatar'

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl px-5 pt-3 pb-6 anim-sheet-up max-h-full overflow-y-auto">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
        >
          ✕
        </button>

        <WearPreview character={character} item={item} />

        <p className="mt-3 text-center text-xs text-gray-500">
          {isAvatar ? '이 캐릭터로 변신할 수 있어요' : '내 캐릭터가 착용한 모습이에요'}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            {item.name}
            {owned && (
              <span className="px-2 py-0.5 rounded-full bg-grow-light text-grow-dark text-[10px] font-bold">
                보유 중
              </span>
            )}
          </h3>
          <Coin value={item.price} />
        </div>

        {!owned ? (
          <button
            onClick={onBuy}
            style={{ backgroundColor: '#AC3B29' }}
            className="mt-4 w-full py-3.5 rounded-2xl text-white font-bold shadow active:scale-[0.99] transition"
          >
            구매하기
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {isAvatar ? (
              equipped ? (
                <div className="w-full py-3 rounded-2xl bg-grow-light text-grow-dark font-bold text-center">
                  ✓ 장착됨
                </div>
              ) : (
                <button
                  onClick={onToggleEquip}
                  className="w-full py-3.5 rounded-2xl bg-grow text-white font-bold shadow active:scale-[0.99] transition"
                >
                  바로 장착하기
                </button>
              )
            ) : (
              <button
                onClick={onToggleEquip}
                className={`w-full py-3.5 rounded-2xl font-bold shadow active:scale-[0.99] transition ${
                  equipped ? 'bg-gray-200 text-gray-700' : 'bg-grow text-white'
                }`}
              >
                {equipped ? '장착 해제' : '바로 장착하기'}
              </button>
            )}
            <button onClick={onGoCustomize} className="w-full py-2 text-sm font-bold text-grow-dark">
              Customize에서 보기 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function BundleDetailSheet({ onClose }) {
  const [bought, setBought] = useState(false)
  const gearImgs = [
    storeItems.find((i) => i.id === 'vest'),
    storeItems.find((i) => i.id === 'campers-hat'),
    storeItems.find((i) => i.id === 'boots'),
    storeItems.find((i) => i.id === 'compass'),
  ].filter(Boolean)

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl px-5 pt-3 pb-6 anim-sheet-up max-h-full overflow-y-auto">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="rounded-2xl overflow-hidden p-4 text-white bg-gradient-to-br from-slate-600 to-slate-800">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md bg-white/25 text-[10px] font-bold">Limited Edition</span>
            <Coin value={360} dark />
          </div>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">NEW EXPLORER BUNDLE</h2>
          <div className="mt-2 flex items-end justify-center gap-1">
            <img src={charA} alt="" className="w-16 drop-shadow" style={{ imageRendering: 'pixelated' }} />
            <img src={charC} alt="" className="w-20 drop-shadow" style={{ imageRendering: 'pixelated' }} />
            <img src={charB} alt="" className="w-16 drop-shadow" style={{ imageRendering: 'pixelated' }} />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          탐험가 3종 캐릭터와 탐험 장비 세트(조끼·모자·부츠·나침반)를 한 번에 담은
          한정판 번들이에요. 낱개 구매보다 훨씬 이득!
        </p>

        <p className="mt-4 text-xs font-bold text-gray-500">포함 아이템</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {['A', 'C', 'B'].map((k) => (
            <div key={k} className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={charImg(k, 'base')} alt="" className="h-14 object-contain" style={{ imageRendering: 'pixelated' }} />
            </div>
          ))}
          {gearImgs.map((it) => (
            <div key={it.id} className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center p-1">
              <img src={ITEM_IMG[it.img]} alt={it.name} className="max-h-full object-contain" style={{ imageRendering: 'pixelated' }} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500 line-through">© 690 상당</span>
          <span className="font-bold text-gray-900 text-base flex items-center gap-1">
            번들가 <Coin value={360} />
          </span>
        </div>

        {bought ? (
          <div className="mt-4 w-full py-3 rounded-2xl bg-grow-light text-grow-dark font-bold text-center">
            ✓ 번들 구매 완료!
          </div>
        ) : (
          <button
            onClick={() => setBought(true)}
            style={{ backgroundColor: '#AC3B29' }}
            className="mt-4 w-full py-3.5 rounded-2xl text-white font-bold shadow active:scale-[0.99] transition"
          >
            번들 구매하기
          </button>
        )}
      </div>
    </div>
  )
}

// ===== Customize =====
function CustomizeView({ character, equipped, setEquipped }) {
  const [previewChar, setPreviewChar] = useState(character)
  const wornKey = equipped ? ITEM_TO_KEY[equipped] : 'base'
  const src = charImg(previewChar, wornKey)
  const wearables = storeItems.filter((it) => it.category !== 'avatar')

  const toggle = (item) => setEquipped((prev) => (prev === item.id ? null : item.id))
  const isOn = (item) => equipped === item.id

  const cycle = (dir) => {
    const i = CHAR_ORDER.indexOf(previewChar)
    setPreviewChar(CHAR_ORDER[(i + dir + CHAR_ORDER.length) % CHAR_ORDER.length])
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      {/* 캐릭터 무대 (착용 완성 그림) + 미리보기 전환 */}
      <div className="relative mx-auto mt-4 w-52">
        <div
          className="relative w-52 h-72 rounded-3xl shadow-md overflow-hidden flex items-end justify-center"
          style={{ backgroundColor: STAGE_BG }}
        >
          <img
            src={src}
            alt="내 캐릭터"
            className="w-full h-full object-contain p-2"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="absolute top-4 left-4 anim-twinkle">✨</span>
          <span className="absolute top-8 right-5 anim-twinkle" style={{ animationDelay: '0.6s' }}>✨</span>
        </div>

        <button
          onClick={() => cycle(-1)}
          aria-label="이전 캐릭터"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow text-gray-700 text-lg flex items-center justify-center active:scale-90"
        >
          ‹
        </button>
        <button
          onClick={() => cycle(1)}
          aria-label="다음 캐릭터"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-white shadow text-gray-700 text-lg flex items-center justify-center active:scale-90"
        >
          ›
        </button>
      </div>

      <p className="mt-5 text-sm font-bold text-gray-800">아이템을 탭해서 착용하세요</p>

      {/* 착용 가능한 아이템 팔레트 (원본 아이템 그림) */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {wearables.map((it) => {
          const on = isOn(it)
          return (
            <button
              key={it.id}
              onClick={() => toggle(it)}
              className={`rounded-xl p-2.5 flex flex-col items-center shadow-sm border-2 transition ${
                on ? 'border-grow' : 'border-gray-300'
              }`}
              style={{ backgroundColor: '#d3d4d1' }}
            >
              <div className="h-24 flex items-center justify-center">
                <img
                  src={ITEM_IMG[it.img]}
                  alt={it.name}
                  className="h-24 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <span className={`mt-1 text-[11px] font-bold ${on ? 'text-grow-dark' : 'text-gray-500'}`}>
                {on ? '착용중' : '착용'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ===== 공통 컴포넌트 =====
function Coin({ value, dark }) {
  return (
    <span className="inline-flex items-center gap-1 font-bold">
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] ${
          dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
        }`}
      >
        C
      </span>
      {value}
    </span>
  )
}

function TopTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
        active ? 'bg-gray-300 text-gray-900' : 'text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

function CatTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
        active ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

function BundleBanner({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left rounded-2xl overflow-hidden p-4 text-white shadow-md bg-gradient-to-br from-slate-600 to-slate-800 active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] opacity-80">Preview · 눌러서 자세히</span>
        <Coin value={360} dark />
      </div>

      <h2 className="mt-1 text-xl font-extrabold tracking-tight">NEW EXPLORER BUNDLE</h2>

      <div className="mt-2 flex items-end justify-center gap-1">
        <img src={charA} alt="" className="w-16 drop-shadow" style={{ imageRendering: 'pixelated' }} />
        <img src={charC} alt="" className="w-20 drop-shadow" style={{ imageRendering: 'pixelated' }} />
        <img src={charB} alt="" className="w-16 drop-shadow" style={{ imageRendering: 'pixelated' }} />
      </div>

      <div className="flex justify-end">
        <span className="px-2 py-0.5 rounded-md bg-white/25 text-[10px] font-bold">Limited Edition</span>
      </div>

      <span className="absolute top-10 left-4 anim-twinkle">✨</span>
      <span className="absolute top-16 right-6 anim-twinkle" style={{ animationDelay: '0.5s' }}>✨</span>
    </button>
  )
}

function ItemTile({ item, owned, onClick }) {
  return (
    <button onClick={onClick} className="relative active:scale-[0.97] transition">
      <img
        src={ITEM_IMG[item.img]}
        alt={item.name}
        className="w-full rounded-xl shadow-sm"
        style={{ imageRendering: 'pixelated' }}
      />
      {owned && (
        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-grow text-white text-[9px] font-bold shadow">
          보유중
        </span>
      )}
    </button>
  )
}
