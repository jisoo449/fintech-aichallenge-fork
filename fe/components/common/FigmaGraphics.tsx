import React from 'react';
import Image from 'next/image';

// 1. 3D Stacked Coins (초록색 원기둥 쌓인 동전)
export function CoinStackGraphic({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 바닥 동전 */}
      <ellipse cx="50" cy="74" rx="36" ry="14" fill="#2EB374" />
      <ellipse cx="50" cy="70" rx="36" ry="14" fill="#35C884" stroke="#4FE19E" strokeWidth="2.5" />
      <ellipse cx="50" cy="70" rx="28" ry="10" stroke="#6EF4B7" strokeWidth="1.5" />

      {/* 중간 동전 */}
      <ellipse cx="50" cy="56" rx="36" ry="14" fill="#2EB374" />
      <ellipse cx="50" cy="52" rx="36" ry="14" fill="#35C884" stroke="#4FE19E" strokeWidth="2.5" />
      <ellipse cx="50" cy="52" rx="28" ry="10" stroke="#6EF4B7" strokeWidth="1.5" />

      {/* 위쪽 기울어진 동전 */}
      <g transform="rotate(-15 50 32)">
        <ellipse cx="50" cy="34" rx="36" ry="14" fill="#2EB374" />
        <ellipse cx="50" cy="30" rx="36" ry="14" fill="#35C884" stroke="#4FE19E" strokeWidth="2.5" />
        <ellipse cx="50" cy="30" rx="28" ry="10" stroke="#6EF4B7" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 2. 두 잎 클로버 새싹
export function SproutCloverGraphic({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 메인 잎 */}
      <path
        d="M38 65C38 45 20 40 22 28C24 16 38 18 42 28C46 18 60 16 62 28C64 40 46 45 46 65"
        fill="url(#cloverGrad1)"
      />
      {/* 작은 잎 */}
      <path
        d="M52 65C52 50 40 46 42 36C44 26 54 28 58 36C62 28 72 26 74 36C76 46 60 50 60 65"
        fill="url(#cloverGrad2)"
        opacity="0.8"
      />
      <path d="M42 68V48" stroke="#35C884" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 68V54" stroke="#35C884" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="cloverGrad1" x1="22" y1="20" x2="62" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="cloverGrad2" x1="42" y1="28" x2="74" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A7F3D0" />
          <stop offset="1" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 3. 네잎 클로버 그래픽
export function FourLeafCloverGraphic({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="translate(40,36)">
        {/* 상단 잎 */}
        <path d="M0 0 C -12 -12 -12 -28 0 -24 C 12 -28 12 -12 0 0" fill="url(#fourLeafGrad)" />
        {/* 우측 잎 */}
        <path d="M0 0 C 12 -12 28 -12 24 0 C 28 12 12 12 0 0" fill="url(#fourLeafGrad)" />
        {/* 하단 잎 */}
        <path d="M0 0 C 12 12 12 28 0 24 C -12 28 -12 12 0 0" fill="url(#fourLeafGrad)" />
        {/* 좌측 잎 */}
        <path d="M0 0 C -12 12 -28 12 -24 0 C -28 -12 -12 -12 0 0" fill="url(#fourLeafGrad)" />
      </g>
      {/* 줄기 */}
      <path d="M40 40 Q40 68 45 74" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="fourLeafGrad" x1="-20" y1="-20" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 4. 세로 줄기 방울 새싹 그래픽 (Stem Sprout)
export function StemSproutGraphic({ className = 'w-14 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 85V15" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 85V30" stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round" />

      {/* 줄기 1 구슬들 */}
      {[20, 28, 36, 44, 52, 60, 68, 76].map((cy, idx) => (
        <circle key={`s1-${idx}`} cx="22" cy={cy} r="4" fill="#34D399" />
      ))}
      {/* 줄기 2 구슬들 */}
      {[35, 43, 51, 59, 67, 75].map((cy, idx) => (
        <circle key={`s2-${idx}`} cx="34" cy={cy} r="3.5" fill="#6EE7B7" />
      ))}
    </svg>
  );
}

// 5. MY JOB 클립보드 서류철 그래픽
export function JobClipboardGraphic({ className = 'w-24 h-28' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 클립보드 바인더 */}
      <rect x="18" y="15" width="66" height="95" rx="8" stroke="#9CA3AF" strokeWidth="2.5" fill="#FFFFFF" />
      <rect x="25" y="22" width="66" height="95" rx="8" stroke="#E5E7EB" strokeWidth="2" fill="#FAFAFA" />

      {/* 클립 */}
      <rect x="38" y="8" width="10" height="24" rx="5" stroke="#6B7280" strokeWidth="2.5" fill="none" />

      {/* MY JOB 글자 */}
      <text
        x="38"
        y="65"
        fill="#9CA3AF"
        fontSize="13"
        fontWeight="800"
        letterSpacing="0.5"
        fontFamily="sans-serif"
      >
        MY JOB
      </text>
    </svg>
  );
}

// 6. 소나무 숲 그래픽 (Green Trees)
export function GreenTreesGraphic({ className = 'w-32 h-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 왼쪽 나무 */}
      <polygon points="35,20 15,65 55,65" fill="#34D399" opacity="0.8" />
      <rect x="33" y="65" width="4" height="15" fill="#10B981" />

      {/* 중앙 큰 나무 */}
      <polygon points="65,10 40,65 90,65" fill="#10B981" />
      <rect x="63" y="65" width="5" height="18" fill="#047857" />

      {/* 오른쪽 나무 */}
      <polygon points="95,25 78,65 112,65" fill="#6EE7B7" opacity="0.9" />
      <rect x="93" y="65" width="4" height="14" fill="#10B981" />
    </svg>
  );
}

// 7. 구름과 지렁이 캐릭터 그래픽 (public/images/characters/sprout.svg 사용)
export function CloudCharacterGraphic({ className = 'w-24 h-20' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/images/characters/sprout.svg"
        alt="구름 캐릭터"
        width={120}
        height={90}
        priority
        className="h-full w-full object-contain"
      />
    </div>
  );
}

// 8. 폴라로이드 SEED 카드
export function PolaroidCardGraphic({ className = 'w-36 h-48' }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-between rounded-xl bg-white p-3 shadow-md border border-gray-200 rotate-6 ${className}`}
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-emerald-50/50 p-2 border border-emerald-100/60">
        <Image
          src="/images/characters/color-flower.svg"
          alt="꽃 캐릭터"
          width={80}
          height={80}
          className="h-20 w-20 object-contain"
        />
      </div>
      <div className="w-full text-center pb-1">
        <span className="text-xl font-black tracking-widest text-[#35C884]/80">SEED</span>
      </div>
    </div>
  );
}

// 9. 하단 정원 식물 장식 그래픽 (Bottom Garden Pattern)
export function BottomGardenGraphic({ className = 'w-full h-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 좌측 세로 구슬 줄기 */}
      <g transform="translate(60, 20)">
        <path d="M12 110V10" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
        {[15, 27, 39, 51, 63, 75, 87, 99].map((y, i) => (
          <circle key={`bg-s1-${i}`} cx="12" cy={y} r="6" fill="#34D399" />
        ))}
      </g>

      {/* 하트 클로버 1 */}
      <g transform="translate(130, 40) scale(1.1)">
        <path
          d="M30 75C30 55 12 50 14 36C16 22 30 24 34 34C38 24 52 22 54 36C56 50 38 55 38 75"
          fill="#6EE7B7"
          opacity="0.85"
        />
      </g>

      {/* 네잎클로버 1 */}
      <g transform="translate(230, 60)">
        <circle cx="20" cy="20" r="14" fill="#34D399" opacity="0.6" />
        <circle cx="36" cy="20" r="14" fill="#34D399" opacity="0.6" />
        <circle cx="28" cy="12" r="14" fill="#34D399" opacity="0.6" />
        <circle cx="28" cy="28" r="14" fill="#34D399" opacity="0.6" />
        <path d="M28 35V75" stroke="#10B981" strokeWidth="2.5" />
      </g>

      {/* 중앙 민들레 꽃 모양 1 */}
      <g transform="translate(370, 25)">
        <circle cx="40" cy="40" r="12" fill="#34D399" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <g key={`d1-${deg}`} transform={`rotate(${deg} 40 40)`}>
            <line x1="40" y1="20" x2="40" y2="10" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="8" r="3.5" fill="#34D399" />
          </g>
        ))}
        <path d="M40 54V110" stroke="#10B981" strokeWidth="3" />
      </g>

      {/* 네잎클로버 2 (중앙) */}
      <g transform="translate(520, 50) scale(1.2)">
        <path
          d="M20 20 C 10 10 10 -4 20 -1 C 30 -4 30 10 20 20"
          fill="#6EE7B7"
          opacity="0.75"
        />
        <path
          d="M20 20 C 30 10 44 10 41 20 C 44 30 30 30 20 20"
          fill="#6EE7B7"
          opacity="0.75"
        />
        <path
          d="M20 20 C 10 30 10 44 20 41 C 30 44 30 30 20 20"
          fill="#6EE7B7"
          opacity="0.75"
        />
        <path
          d="M20 20 C 10 30 -4 30 -1 20 C -4 10 10 10 20 20"
          fill="#6EE7B7"
          opacity="0.75"
        />
        <path d="M20 25 Q20 65 24 75" stroke="#34D399" strokeWidth="2.5" />
      </g>

      {/* 민들레 꽃 모양 2 */}
      <g transform="translate(680, 25)">
        <circle cx="40" cy="40" r="12" fill="#34D399" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <g key={`d2-${deg}`} transform={`rotate(${deg} 40 40)`}>
            <line x1="40" y1="20" x2="40" y2="10" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="8" r="3.5" fill="#34D399" />
          </g>
        ))}
        <path d="M40 54V110" stroke="#10B981" strokeWidth="3" />
      </g>

      {/* 하트 클로버 2 (우측) */}
      <g transform="translate(790, 40) scale(1.1)">
        <path
          d="M30 75C30 55 12 50 14 36C16 22 30 24 34 34C38 24 52 22 54 36C56 50 38 55 38 75"
          fill="#6EE7B7"
          opacity="0.85"
        />
      </g>

      {/* 우측 세로 구슬 줄기 */}
      <g transform="translate(900, 20)">
        <path d="M12 110V10" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
        {[15, 27, 39, 51, 63, 75, 87, 99].map((y, i) => (
          <circle key={`bg-s2-${i}`} cx="12" cy={y} r="6" fill="#34D399" />
        ))}
      </g>
    </svg>
  );
}
