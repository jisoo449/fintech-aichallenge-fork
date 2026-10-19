'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

const onboardingSteps = [
  {
    title: '직업을 얻고 첫 소득을 일궈요',
    description: '직업을 가지고 월급을 받으며 나만의 경제생활을 시작해요',
    buttonText: '다음',
  },
  {
    title: '돈을 직접 관리해요',
    description: '쓰고, 모으고, 나만의 Seed를 키워 돈을 관리하는 방법을 배워요.',
    buttonText: '다음',
  },
  {
    title: '좋은 경제 습관을 키워요',
    description:
      '작은 선택이 모여 큰 성장으로! AI와 함께 나의 경제생활을 돌아보고 더 좋은 경제 습관을 만들어가요',
    buttonText: '다음',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const stepInfo = onboardingSteps[currentStep];

  return (
    <AuthGuard allowedRoles={['STUDENT']}>
      <main
        className="relative flex min-h-screen flex-col items-center justify-between bg-[#34C37D] px-4 py-8 md:py-12 bg-cover bg-center overflow-hidden select-none"
        style={{
          backgroundImage: "url('/backgrounds/green-pattern.svg')",
        }}
      >
        {/* 상단 건너뛰기 버튼 */}
        <div className="w-full max-w-2xl flex justify-end px-4">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 backdrop-blur-xs"
          >
            건너뛰기
          </Link>
        </div>

        {/* 중앙: 3장 부채꼴 카드 일러스트레이션 */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full max-w-xl">
          <div className="relative w-full max-w-[540px] drop-shadow-lg transition-transform duration-500">
            {/* 3단 카드 전환 표시 */}
            {currentStep === 0 && (
              <Image
                src="/objects/onboarding-card-1.svg"
                alt="직업과 소득"
                width={540}
                height={280}
                priority
                className="h-auto w-full object-contain animate-fade-in"
              />
            )}
            {currentStep === 1 && (
              <Image
                src="/objects/onboarding-card-2.svg"
                alt="자산 관리"
                width={540}
                height={280}
                priority
                className="h-auto w-full object-contain animate-fade-in"
              />
            )}
            {currentStep === 2 && (
              <Image
                src="/objects/onboarding-card-3.svg"
                alt="경제 성장"
                width={540}
                height={280}
                priority
                className="h-auto w-full object-contain animate-fade-in"
              />
            )}
          </div>

          {/* 스텝 인디케이터 (도트) */}
          <div className="my-6 flex items-center justify-center gap-2">
            {onboardingSteps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* 텍스트 영역 */}
          <div className="text-center max-w-md px-2">
            <h1 className="mb-2 text-xl md:text-2xl font-extrabold text-white tracking-tight animate-fade-in">
              {stepInfo.title}
            </h1>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
              {stepInfo.description}
            </p>
          </div>
        </div>

        {/* 하단 다음 / 시작 버튼 */}
        <div className="relative z-10 w-full max-w-sm px-4">
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-gray-900 shadow-md transition-all duration-150 hover:bg-gray-100 active:scale-[0.99] cursor-pointer text-center"
          >
            {stepInfo.buttonText}
          </button>
        </div>
      </main>
    </AuthGuard>
  );
}
