'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { logoutApi } from '@/features/auth/api';
import { LogOut } from 'lucide-react';

interface UserProfileMenuProps {
  isOpen: boolean; // 사이드바 펼침 여부
}

export default function UserProfileMenu({ isOpen }: UserProfileMenuProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || (user?.role === 'TEACHER' ? '선생님' : '학생');
  const initialChar = user?.name?.trim()?.[0] || (user?.role === 'TEACHER' ? '선' : '학');
  const roleLabel = user?.role === 'TEACHER' ? '교사' : '학생';
  const roleBadgeColor =
    user?.role === 'TEACHER'
      ? 'bg-amber-400/20 text-amber-200 border-amber-300/30'
      : 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30';
  const avatarBgColor =
    user?.role === 'TEACHER'
      ? 'bg-[#D97706] text-white border-amber-300/40'
      : 'bg-[#2EB374] text-white border-emerald-300/40';
  const subInfo = user?.class || (user?.job ? user.job : roleLabel);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch {
      // 에러가 나도 logoutApi 내부에서 로컬 스토리지를 지우고 logout()을 수행함
    } finally {
      setIsMenuOpen(false);
      setIsLoggingOut(false);
      router.replace('/');
    }
  };

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* 1. 사이드바 프로필 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        title={!isOpen ? `${displayName} (${roleLabel})` : undefined}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
        className={`group flex w-full items-center rounded-2xl py-2.5 transition-all text-white/90 hover:bg-white/10 cursor-pointer ${
          isOpen
            ? 'gap-3 px-3 bg-white/5 border border-white/10'
            : 'justify-center px-0'
        } ${isMenuOpen ? 'ring-2 ring-emerald-400/40 bg-white/15' : ''}`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black border shadow-xs transition-transform group-hover:scale-105 select-none ${avatarBgColor}`}
        >
          {initialChar}
        </div>

        {isOpen && (
          <div className="flex flex-1 flex-col text-left overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-white tracking-tight">
                {displayName}
              </span>
              <span
                className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${roleBadgeColor}`}
              >
                {roleLabel}
              </span>
            </div>
            {subInfo && (
              <span className="truncate text-xs text-white/70">
                {subInfo}
              </span>
            )}
          </div>
        )}
      </button>

      {/* 2. 프로필 팝오버 메뉴 (사이드바 상단 드롭다운 / 접힘 시 우측 팝오버) */}
      {isMenuOpen && (
        <div
          role="menu"
          className={`absolute z-50 rounded-2xl bg-[#0B4D3B] border border-white/15 p-3 text-white shadow-2xl backdrop-blur-md transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isOpen
              ? 'top-full left-0 right-0 mt-2 min-w-[220px]'
              : 'top-0 left-16 min-w-[200px]'
          }`}
        >
          {/* 유저 기본 정보 헤더 */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black border shadow-sm select-none ${avatarBgColor}`}
            >
              {initialChar}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-white">
                  {displayName}
                </span>
                <span
                  className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${roleBadgeColor}`}
                >
                  {roleLabel}
                </span>
              </div>
              <span className="truncate text-xs text-white/75">
                {user?.class ? `${user.class} ` : ''}
                {user?.job ? `· ${user.job}` : ''}
              </span>
            </div>
          </div>

          {/* 로그아웃 액션 버튼 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/20 hover:text-red-100 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-300" />
              <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
