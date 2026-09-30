// 버튼 클릭 효과음 — Web Audio API로 짧은 '팝' 소리를 생성 (사운드 파일 불필요).
// 브라우저 자동재생 정책상 AudioContext는 첫 사용자 클릭(제스처) 때 생성/재개됨.

let ctx = null
let muted = false

function getCtx() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// 'Tick' — 짧고 산뜻한 딸깍음 (1500Hz 사인, 빠른 감쇠)
export function playClick() {
  if (muted) return
  const ac = getCtx()
  if (!ac) return
  try {
    const t = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1500, t)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    osc.connect(gain).connect(ac.destination)
    osc.start(t)
    osc.stop(t + 0.06)
  } catch {
    /* 무시 */
  }
}

export function setMuted(v) {
  muted = v
}
export function isMuted() {
  return muted
}
export function toggleMuted() {
  muted = !muted
  return muted
}
