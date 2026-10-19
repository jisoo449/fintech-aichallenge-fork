'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { loginApi } from '../api';

export default function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, user, token, isHydrated } = useAuthStore();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 사용자는 해당 대시보드로 자동 이동
  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated && token && user) {
      if (user.role?.toUpperCase() === 'TEACHER') {
        router.replace('/teacher/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, token, isHydrated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedId = id.trim();
    const trimmedPw = password.trim();

    if (!trimmedId) {
      setErrorMessage('아이디를 입력해 주세요.');
      return;
    }

    if (!trimmedPw) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // 1. 백엔드 로그인 API 호출
      const res = await loginApi({
        loginId: trimmedId,
        password: trimmedPw,
      });

      if (res && res.accessToken && res.user) {
        if (res.user.role?.toUpperCase() === 'TEACHER') {
          router.push('/teacher/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.name === 'TimeoutError'
            ? '서버 응답이 지연되고 있습니다. 잠시 후 다시 로그인해 주세요.'
            : err.message
          : '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[440px] rounded-3xl bg-white p-7 shadow-2xl transition-all"
    >
      {/* 1. 상단 일러스트레이션 배너 */}
      <div className="relative mb-5 overflow-hidden rounded-2xl">
        <Image
          src="/objects/login_Illustration.svg"
          alt="SEED 캐릭터 일러스트"
          width={518}
          height={235}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      {/* 2. 타이틀 */}
      <div className="mb-6 text-center">
        <h2 className="text-base md:text-lg font-extrabold leading-snug text-gray-900">
          학급이 함께 심고 키우는
          <br />
          우리반 경제 시뮬레이션 서비스 Seed
        </h2>
      </div>

      {/* 3. 에러 메시지 */}
      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-500 border border-red-100">
          {errorMessage}
        </div>
      )}

      {/* 4. 입력 폼 */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="아이디 (교사: teacher01, 학생: student01)"
          disabled={isLoading}
          className="w-full rounded-xl border border-transparent bg-[#F4F6F8] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#35C884] focus:bg-white focus:ring-2 focus:ring-[#35C884]/20 disabled:opacity-50"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          disabled={isLoading}
          className="w-full rounded-xl border border-transparent bg-[#F4F6F8] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#35C884] focus:bg-white focus:ring-2 focus:ring-[#35C884]/20 disabled:opacity-50"
        />

        <p className="my-1 text-center text-[11px] leading-relaxed text-gray-400">
          로그인 시 서비스 약관에 동의하고
          <br />
          개인정보처리방침에 동의하는 것으로 간주합니다.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#2A303C] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#1E232B] active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>
  );
}
