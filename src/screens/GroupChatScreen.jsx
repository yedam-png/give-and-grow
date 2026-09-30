import { useState, useEffect, useRef } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import { chatGroup, chatMessages } from '../data/mockData.js'
import { getApiKey, setApiKey, callGru, ruleReply } from '../gru.js'
import charA from '../assets/CharacterA.png'
import charB from '../assets/CharacterB.png'
import charC from '../assets/CharacterC.png'

const CHAR_IMG = { A: charA, B: charB, C: charC }

const nowTime = () => {
  const d = new Date()
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ap = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ap}`
}

// 그룹챗 (Group Chat) — 하단 네비 종이비행기 아이콘으로 진입
// 그루(AI 친구)가 내 메시지에 판단해서 응답. 키가 있으면 Claude API, 없으면 규칙기반.
export default function GroupChatScreen({ go, character, reserved }) {
  const avatarFor = (a) => {
    if (a === 'gru') return { emoji: '🌱', bg: '#DFF5E1' }
    const src = a === 'me' ? CHAR_IMG[character] || charC : CHAR_IMG[a]
    return { src }
  }

  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(null)
  const [input, setInput] = useState('')
  const [apiKey, setKey] = useState(getApiKey())
  const [showKey, setShowKey] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const bottomRef = useRef(null)
  const aiHistory = useRef([]) // Claude API용 대화 기록 [{role, content}]

  // 진입 시 대화가 실시간처럼 하나씩 재생 + 그루 인사 (예약된 경우에만)
  useEffect(() => {
    if (!reserved) return
    let cancelled = false
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    setMessages([])
    setTyping(null)
    aiHistory.current = []
    ;(async () => {
      for (const m of chatMessages) {
        if (cancelled) return
        if (m.side === 'left') {
          setTyping(m)
          await wait(800)
          if (cancelled) return
          setTyping(null)
        }
        setMessages((prev) => [...prev, m])
        await wait(m.side === 'left' ? 500 : 650)
      }
      // 그루 인사
      if (cancelled) return
      setTyping({ sender: '그루', avatar: 'gru', side: 'left' })
      await wait(900)
      if (cancelled) return
      setTyping(null)
      setMessages((prev) => [
        ...prev,
        {
          id: 'gru-hi',
          sender: '그루',
          avatar: 'gru',
          side: 'left',
          text: '얘들아 안녕! 나는 AI 친구 그루야 🌱 궁금한 거나 봉사 얘기 있으면 편하게 말 걸어줘!',
          time: nowTime(),
        },
      ])
    })()
    return () => {
      cancelled = true
    }
  }, [reserved])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: 'u' + Date.now(), sender: 'USER', avatar: 'me', side: 'right', text, time: nowTime() },
    ])

    const history = [...aiHistory.current, { role: 'user', content: text }]
    aiHistory.current = history

    setTyping({ sender: '그루', avatar: 'gru', side: 'left' })

    let reply
    try {
      if (apiKey) {
        reply = await callGru(apiKey, history)
      } else {
        await new Promise((r) => setTimeout(r, 800)) // 타이핑 느낌
        reply = ruleReply(text)
      }
    } catch {
      reply = ruleReply(text) // AI 호출 실패 시 규칙기반 폴백
    }
    if (!reply) reply = ruleReply(text)

    aiHistory.current = [...history, { role: 'assistant', content: reply }]
    setTyping(null)
    setMessages((prev) => [
      ...prev,
      { id: 'r' + Date.now(), sender: '그루', avatar: 'gru', side: 'left', text: reply, time: nowTime() },
    ])
  }

  const saveKey = () => {
    const k = keyDraft.trim()
    setApiKey(k)
    setKey(k)
    setShowKey(false)
    setKeyDraft('')
  }

  // 예약 전에는 잠금 화면 — 맵에서 봉사활동을 예약해야 그룹챗이 열림
  if (!reserved) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center text-5xl">
            🔒
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">그룹챗이 잠겨 있어요</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              맵에서 봉사활동을 <b className="text-grow-dark">예약</b>하면
              <br />
              같이 하는 친구들·AI 친구 <b className="text-grow-dark">그루</b>와 대화할 수 있어요 🌱
            </p>
          </div>
          <button
            onClick={() => go('map')}
            style={{ backgroundColor: '#AC3B29' }}
            className="mt-1 px-6 py-3 rounded-2xl text-white font-bold shadow active:scale-[0.98] transition"
          >
            봉사활동 찾으러 가기 →
          </button>
        </div>
        <BottomNav go={go} active="chat" reserved={reserved} />
      </>
    )
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 채팅방 헤더 */}
        <div className="mx-4 mt-4 flex items-center gap-3 bg-gray-200 rounded-2xl px-4 py-3 shrink-0">
          <span className="text-3xl">🌳</span>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 leading-tight tracking-wide">{chatGroup.name}</p>
            <p className="text-xs text-gray-600 font-bold">
              {apiKey ? 'AI 그루 연결됨 🌱' : `${chatGroup.members} MEMBERS`}
            </p>
          </div>
          <button
            onClick={() => setShowKey((v) => !v)}
            aria-label="AI 설정"
            className="text-lg shrink-0"
            title="AI(Claude) 키 설정"
          >
            {apiKey ? '🌱' : '🔑'}
          </button>
        </div>

        {/* AI 키 설정 패널 */}
        {showKey && (
          <div className="mx-4 mt-2 bg-white border border-gray-200 rounded-2xl px-3 py-3 shrink-0">
            <p className="text-xs text-gray-600 mb-2">
              Anthropic API 키를 넣으면 <b>진짜 Claude AI</b>로 그루가 대답해요. (키는 이 브라우저에만 저장돼요)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button onClick={saveKey} className="px-3 py-2 rounded-lg bg-grow text-white text-sm font-bold">
                저장
              </button>
            </div>
            {apiKey && (
              <button
                onClick={() => {
                  setApiKey('')
                  setKey('')
                }}
                className="mt-2 text-xs text-red-500 font-bold"
              >
                키 삭제 (규칙 모드로)
              </button>
            )}
          </div>
        )}

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messages.map((m) => (
            <Message key={m.id} m={m} avatar={avatarFor(m.avatar)} />
          ))}
          {typing && <TypingBubble sender={typing.sender} avatar={avatarFor(typing.avatar)} />}
          <div ref={bottomRef} />
        </div>

        {/* 채팅 입력 바 */}
        <div className="shrink-0 border-t border-gray-200 bg-white/80 px-3 py-2 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-grow/40"
          />
          <button
            onClick={send}
            aria-label="보내기"
            style={{ backgroundColor: '#AC3B29' }}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow active:scale-90 transition"
          >
            ➤
          </button>
        </div>
      </div>

      <BottomNav go={go} active="chat" reserved={reserved} />
    </>
  )
}

function Avatar({ avatar, alt }) {
  if (avatar.src) {
    return (
      <img
        src={avatar.src}
        alt={alt}
        className="w-10 h-10 rounded-xl bg-white border border-gray-200 object-contain shrink-0"
        style={{ imageRendering: 'pixelated' }}
      />
    )
  }
  return (
    <div
      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-xl shrink-0"
      style={{ backgroundColor: avatar.bg || '#DFF5E1' }}
    >
      {avatar.emoji}
    </div>
  )
}

function Message({ m, avatar }) {
  const right = m.side === 'right'
  const isGru = m.avatar === 'gru'
  return (
    <div className={`anim-msg-in flex items-start gap-2 ${right ? 'flex-row-reverse' : ''}`}>
      <Avatar avatar={avatar} alt={m.sender} />
      <div className={`flex flex-col max-w-[72%] ${right ? 'items-end' : 'items-start'}`}>
        <span className={`text-[11px] font-extrabold tracking-wide px-1 ${isGru ? 'text-grow-dark' : 'text-gray-700'}`}>
          {m.sender}
          {isGru && ' · AI'}
        </span>
        <div className={`mt-1 flex items-end gap-1.5 ${right ? 'flex-row-reverse' : ''}`}>
          <div
            className={`px-3 py-2 text-sm text-gray-900 shadow-sm border ${
              right
                ? 'bg-grow-light border-gray-300 rounded-2xl rounded-tr-sm'
                : isGru
                  ? 'bg-[#eefaef] border-grow/40 rounded-2xl rounded-tl-sm'
                  : 'bg-gray-100 border-gray-300 rounded-2xl rounded-tl-sm'
            }`}
          >
            {m.text}
          </div>
          <span className="text-[10px] text-gray-400 shrink-0 mb-0.5">{m.time}</span>
        </div>
      </div>
    </div>
  )
}

function TypingBubble({ sender, avatar }) {
  return (
    <div className="anim-msg-in flex items-start gap-2">
      <Avatar avatar={avatar} alt={sender} />
      <div className="flex flex-col">
        <span className="text-[11px] font-extrabold text-gray-700 tracking-wide px-1">{sender}</span>
        <div className="mt-1 bg-gray-100 border border-gray-300 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-500 gg-typing-dot" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-gray-500 gg-typing-dot" style={{ animationDelay: '0.15s' }} />
          <span className="w-2 h-2 rounded-full bg-gray-500 gg-typing-dot" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  )
}
