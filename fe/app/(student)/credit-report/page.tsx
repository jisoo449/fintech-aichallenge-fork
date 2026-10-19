'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCreditReport } from '@/features/credit/hooks/useCreditReport';
import { useStudentStore } from '@/stores/useStudentStore';
import { useMonthStore } from '@/stores/useMonthStore';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function CreditReportPage() {
  const student = useStudentStore((state) => state.student);
  const { getYearMonthString } = useMonthStore();
  const yearMonth = getYearMonthString();
  const { data: report, isLoading: isReportLoading } =
    useCreditReport(yearMonth);

  if (isReportLoading && !report) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-gray-400">리포트 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  const monthlySalary = report?.monthlySalary ?? 127500;
  const totalExpense = report?.totalExpense ?? 45000;
  const totalSavings = report?.totalSavings ?? 30000;
  const balance = report?.balance ?? 52500;
  const totalAssets = report?.totalAssets ?? 82500;
  const assetChange = report?.assetChange ?? 12500;

  const metrics = [
    {
      title: '월급 / 실수령액',
      value: `${monthlySalary.toLocaleString()} 미소`,
      isNegative: false,
    },
    {
      title: '총 소비',
      value: `${totalExpense.toLocaleString()} 미소`,
      isNegative: true,
    },
    {
      title: '총 저축',
      value: `${totalSavings.toLocaleString()} 미소`,
      isNegative: false,
    },
    {
      title: '잔액',
      value: `${balance.toLocaleString()} 미소`,
      isNegative: false,
    },
    {
      title: '총자산',
      value: `${totalAssets.toLocaleString()} 미소`,
      isNegative: false,
    },
    {
      title: '자산 변화',
      value: `+${assetChange.toLocaleString()}`,
      isNegative: false,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {/* 1. 상단 헤더 & 헤드라인 */}
      <div className="relative mb-8">
        <PageHeader badgeText={student.classRoom} title="우리반 경제생활" />

        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight whitespace-pre-line mt-2 max-w-xl">
          이번 달 활동에 따른&#10;핵심 지표를 한눈에 확인하세요!
        </h1>
      </div>

      {/* 2. 6개 핵심 지표 카드 그리드 (3x2) & 상단에 손을 얹은 꽃 캐릭터 */}
      <div className="relative mb-8">
        {/* 꽃 - 가장 뒤 */}
        <div className="hidden sm:block absolute right-4 md:right-8 -top-[115px] md:-top-[135px] z-0 pointer-events-none">
          <div className="relative h-32 w-32 md:h-40 md:w-40">
            <Image
              src="/images/characters/flower.svg"
              alt="꽃 캐릭터"
              width={160}
              height={160}
              priority
              className="h-full w-full object-contain translate-y-[20px] md:translate-y-[25px]"
            />
          </div>
        </div>

        {/* 손 - 가장 앞 */}
        <div className="hidden sm:block absolute right-4 md:right-8 -top-[115px] md:-top-[135px] z-30 pointer-events-none">
          <div className="relative h-32 w-32 md:h-40 md:w-40">
            <div className="absolute bottom-[6px] md:bottom-[8px] left-1/2 -translate-x-1/2 w-[42px] md:w-[60px] flex justify-between">
              {/* 왼손 */}
              <div className="h-6 w-6 md:h-7 md:w-7 relative -rotate-6">
                <Image
                  src="/images/characters/hand.svg"
                  alt="왼손"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain drop-shadow-xs"
                />
              </div>

              {/* 오른손 */}
              <div className="h-6 w-6 md:h-7 md:w-7 relative rotate-6">
                <Image
                  src="/images/characters/hand.svg"
                  alt="오른손"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain drop-shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-0">
          {metrics.map((item, idx) => (
            <Card key={idx} className="flex flex-col justify-between p-6">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {item.title}
              </h3>
              <div>
                <span
                  className={`inline-flex rounded-full border px-4 py-1 text-sm font-extrabold ${
                    item.isNegative
                      ? 'border-[#FF5D5D] bg-white text-[#FF5D5D]'
                      : 'border-[#35C884] bg-white text-[#0B654B]'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. 월별 경제활동 결과 요약 카드 */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900">
            월별 경제활동 결과 요약
          </h3>
          <span className="text-xs text-gray-400">최근 5건 기준</span>
        </div>

        <div className="flex flex-col gap-3">
          {(
            report?.summaryItems || [
              {
                label: '기본급 (3월)',
                amount: 100000,
                type: 'INCOME',
                badgeText: '수입',
              },
              {
                label: '청소 도우미 수당',
                amount: 27500,
                type: 'INCOME',
                badgeText: '수입',
              },
              {
                label: '학급 매점 이용',
                amount: -25000,
                type: 'EXPENSE',
                badgeText: '지출',
              },
              {
                label: '체육대회 준비물 구매',
                amount: -20000,
                type: 'EXPENSE',
                badgeText: '지출',
              },
              {
                label: '의무 저축 자동 이체',
                amount: 30000,
                type: 'SAVINGS',
                badgeText: '저축',
              },
              {
                label: '잔액',
                amount: 52500,
                type: 'BALANCE',
                badgeText: '잔액',
              },
            ]
          ).map((item, idx) => {
            const isBalance = item.type === 'BALANCE';
            const isPositive = item.amount > 0;

            return (
              <div key={idx}>
                {isBalance && (
                  <div className="my-3 border-t border-dashed border-gray-200" />
                )}

                <div className="flex items-center justify-between py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="font-semibold text-gray-800">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isBalance ? (
                      <span className="inline-flex rounded-full bg-[#35C884] px-4 py-1 text-sm font-black text-white shadow-xs">
                        {item.amount.toLocaleString()} 미소
                      </span>
                    ) : (
                      <Badge
                        variant={isPositive ? 'green-pill' : 'danger-pill'}
                        className="font-bold min-w-[90px] text-center"
                      >
                        {isPositive
                          ? `+${item.amount.toLocaleString()}`
                          : item.amount.toLocaleString()}{' '}
                        미소
                      </Badge>
                    )}

                    <Badge
                      variant={
                        item.type === 'INCOME'
                          ? 'blue-pill'
                          : item.type === 'SAVINGS'
                            ? 'purple-pill'
                            : 'gray-pill'
                      }
                      className="font-bold min-w-[68px] text-center"
                    >
                      {item.badgeText}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. 하단 버튼 2개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/credit-report/evaluation" className="block w-full">
          <Button variant="primary" fullWidth className="py-4 text-base">
            AI 신용평가 보기
          </Button>
        </Link>

        <Link href="/dashboard" className="block w-full">
          <Button variant="outline" fullWidth className="py-4 text-base">
            대시보드로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
