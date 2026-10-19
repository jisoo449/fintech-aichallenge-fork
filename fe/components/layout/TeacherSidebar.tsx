'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import UserProfileMenu from './UserProfileMenu';

const teacherMenuItems = [
  {
    label: '학급 대시보드',
    href: '/teacher/dashboard',
    icon: '/buttons/home.svg',
    selectedIcon: '/buttons/home_select.svg',
  },
  {
    label: '정책 시뮬레이션',
    href: '/teacher/policy',
    icon: '/buttons/consumtion.svg',
    selectedIcon: '/buttons/consumtion_select.svg',
  },
  {
    label: '시뮬레이션 결과',
    href: '/teacher/policy/result',
    icon: '/buttons/report.svg',
    selectedIcon: '/buttons/report_select.svg',
  },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`flex min-h-screen shrink-0 flex-col bg-[#075F46] py-6 text-white transition-all duration-300 select-none z-20 ${
        isOpen ? 'w-56 px-5' : 'w-20 px-3'
      }`}
    >
      {/* 1. 상단 SEED 로고 및 접기/펼치기 */}
      <div
        className={`mb-5 flex items-center ${
          isOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        {isOpen ? (
          <Link href="/teacher/dashboard" className="flex items-center">
            <Image
              src="/images/icons/logo.svg"
              alt="SEED"
              width={96}
              height={36}
              priority
              className="h-auto w-24"
            />
          </Link>
        ) : (
          <Link href="/teacher/dashboard" className="flex items-center">
            <span className="text-xl font-black tracking-wider text-[#E3FFC2]">
              S
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <span
            className={`text-lg transition-transform duration-300 ${
              isOpen ? '' : 'rotate-180'
            }`}
          >
            ‹
          </span>
        </button>
      </div>

      {/* 2. 상단 교사 프로필 메뉴 (로고 바로 밑) */}
      <div className="mb-6 pb-5 border-b border-white/10">
        <UserProfileMenu isOpen={isOpen} />
      </div>

      {/* 3. 교사 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-2">
        {teacherMenuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isOpen ? item.label : undefined}
              className={`flex items-center rounded-xl py-3 transition-colors ${
                isOpen ? 'gap-3 px-3' : 'justify-center px-0'
              } ${
                isActive
                  ? 'bg-white/12 text-[#E3FFC2] font-bold'
                  : 'text-white/75 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                <Image
                  src={isActive ? item.selectedIcon : item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>

              {isOpen && (
                <span className="text-sm tracking-tight">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
