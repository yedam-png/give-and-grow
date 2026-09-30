// 캐릭터 착용 이미지 공용 모듈 (상점 Customize / 프로필 아바타에서 공유)
const charAssets = import.meta.glob('./assets/char/*.png', { eager: true, import: 'default' })

// 아이템 id → 착용 이미지 키
export const ITEM_TO_KEY = {
  vest: 'vest',
  'campers-hat': 'hat1',
  'ranger-cap': 'hat2',
  'special-tool': 'tool',
  boots: 'boots',
  compass: 'compass',
}

export function charImg(letter, key = 'base') {
  return (
    charAssets[`./assets/char/${letter}_${key}.png`] ||
    charAssets[`./assets/char/${letter}_base.png`]
  )
}

// 선택 캐릭터 + 착용 아이템 → 착용 완성 이미지
export function costumeImg(character, equipped) {
  const key = equipped ? ITEM_TO_KEY[equipped] || 'base' : 'base'
  return charImg(character || 'C', key)
}
