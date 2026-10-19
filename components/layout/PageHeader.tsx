'use client';

import Image from 'next/image';
import React from 'react';

interface PageHeaderProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  mascotSrc?: string;
  rightElement?: React.ReactNode;
}

export default function PageHeader({
  badgeText = '6학년 4반',
  title,
  subtitle,
  headline,
  mascotSrc,
  rightElement,
}: PageHeaderProps) {
  return (
    <header className="relative mb-6 flex flex-col gap-2">
      {/* 상단 뱃지 및 메인 타이틀 줄 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {badgeText && (
            <span className="inline-flex items-center rounded-full bg-[#075F46] px-3 py-1 text-xs font-semibold text-white tracking-tight">
              {badgeText}
            </span>
          )}

          {title && (
            <div className="flex items-center gap-2 text-base font-bold text-gray-800">
              <span>{title}</span>
              {subtitle && (
                <>
                  <span className="text-gray-300 font-normal">|</span>
                  <span className="text-sm font-normal text-gray-500">{subtitle}</span>
                </>
              )}
            </div>
          )}
        </div>

        {rightElement && <div>{rightElement}</div>}
      </div>

      {/* 헤드라인 및 캐릭터 마스코트 영역 (있을 경우) */}
      {(headline || mascotSrc) && (
        <div className="relative mt-2 flex items-center justify-between pr-4">
          {headline && (
            <h1 className="text-xl md:text-2xl font-extrabold leading-snug text-gray-900 whitespace-pre-line tracking-tight">
              {headline}
            </h1>
          )}

          {mascotSrc && (
            <div className="absolute right-0 -top-6 h-24 w-24 md:h-28 md:w-28 shrink-0 pointer-events-none">
              <Image
                src={mascotSrc}
                alt="마스코트"
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
