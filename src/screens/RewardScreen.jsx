import reward from '../assets/Reward.png'

// ④-b 첫 보상 컨펌 페이지 (Sign up confirm)
// - 캐릭터 선택 완료 후 표시되는 첫 번째 보상 안내 모달.
// - 핑크 카드 + 보상 코스튬 이미지 + 하단 "Create account" 버튼 → 봉사 목록으로.
export default function RewardScreen({ go }) {
  return (
    <div className="flex-1 w-full flex flex-col px-6 pb-8">
      {/* 핑크 컨펌 카드 */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="relative w-full rounded-3xl px-6 py-8 text-center shadow-lg"
          style={{ backgroundColor: '#F9A6A0' }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={() => go('map')}
            aria-label="닫기"
            className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-gray-700/70 text-gray-700 flex items-center justify-center active:scale-90 transition"
          >
            ✕
          </button>

          <h2 className="text-2xl font-black text-gray-900">Confirmation page</h2>

          <p className="mt-5 font-bold text-gray-900">가입해주셔서 감사해요!</p>
          <p className="mt-4 font-bold text-gray-900 leading-relaxed">
            첫번째 보상 코스튬을
            <br />
            선물로 드릴게요!
          </p>

          {/* 보상 코스튬 이미지 */}
          <img
            src={reward}
            alt="첫 보상 코스튬"
            className="mt-6 mx-auto w-48 anim-float"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* 완료 버튼 → 메인 홈(지도) */}
      <button
        onClick={() => go('map')}
        style={{ backgroundColor: '#AC3B29' }}
        className="mt-6 w-full py-4 rounded-2xl text-white text-lg font-bold shadow-md active:scale-[0.99] transition"
      >
        Create account
      </button>
    </div>
  )
}
