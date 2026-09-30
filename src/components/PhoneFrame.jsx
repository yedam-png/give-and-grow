import bg from '../assets/Background.png'

// 아이폰 17 프로 맥스 화면 비율(440 x 956pt, 약 19.5:9)로 프레임을 잡고,
// 데스크톱에서도 가운데 정렬. 배경 이미지(Background.png)를 프레임 전체에 적용해
// 모든 화면이 공통 배경을 공유하도록 함.
export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-gray-200">
      <div
        className="relative w-full max-w-[440px] flex flex-col overflow-hidden bg-cover bg-center sm:rounded-[3rem] sm:shadow-2xl sm:border-[10px] sm:border-black"
        style={{
          aspectRatio: '440 / 956',
          maxHeight: '100vh',
          backgroundImage: `url(${bg})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
