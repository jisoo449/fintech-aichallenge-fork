'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStudentDashboard } from '@/features/dashboard/hooks/useStudentDashboard';
import { useCreditScore } from '@/features/credit/hooks/useCreditScore';
import { useStudentStore } from '@/stores/useStudentStore';
import { useSavingsStore } from '@/stores/useSavingsStore';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  SproutCloverGraphic,
  FourLeafCloverGraphic,
  StemSproutGraphic,
} from '@/components/common/FigmaGraphics';
import ActivityLineChart from '@/features/dashboard/components/ActivityLineChart';

export default function DashboardPage() {
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentDashboard();
  const { data: creditScoreData } = useCreditScore();
  const student = useStudentStore((state) => state.student);
  const updateFromDashboard = useStudentStore(
    (state) => state.updateFromDashboard,
  );
  const setSavingsTab = useSavingsStore((state) => state.setTab);

  useEffect(() => {
    if (dashboard) {
      const jobName =
        typeof dashboard.job === 'object' && dashboard.job
          ? dashboard.job.name
          : String(dashboard.job || '');

      const rawGrade = creditScoreData?.grade ?? dashboard.credit?.grade;
      const creditGrade =
        typeof rawGrade === 'number'
          ? `${rawGrade}등급`
          : String(rawGrade || '보통');
      const creditScore =
        creditScoreData?.score ||
        (typeof dashboard.credit?.score === 'number'
          ? dashboard.credit.score
          : 688);

      updateFromDashboard({
        currentJob: jobName || undefined,
        creditGrade,
        creditScore,
      });
    }
  }, [dashboard, creditScoreData, updateFromDashboard]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-gray-400">대시보드 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError || !dashboard) {
    const errorMsg =
      error instanceof Error ? error.message : '서버와 통신할 수 없습니다.';

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 max-w-md w-full text-center space-y-2">
          <p className="text-red-600 font-bold text-base">
            대시보드 데이터를 불러오지 못했습니다
          </p>
          <p className="text-xs text-red-500 font-mono bg-white p-2.5 rounded-lg border border-red-100 text-left break-all">
            {errorMsg}
          </p>
          <p className="text-xs text-gray-500 pt-2">
            💡 .env.local 수정 후에는 개발 서버(npm run dev)를 재시작해야
            환경변수가 적용됩니다.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="px-6 py-2 text-xs font-bold"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  const rawGrade = creditScoreData?.grade ?? dashboard.credit?.grade;
  const currentGrade =
    typeof rawGrade === 'number'
      ? `${rawGrade}등급`
      : String(rawGrade || '2등급');

  const jobName =
    typeof dashboard.job === 'object' && dashboard.job !== null
      ? dashboard.job.name
      : String(dashboard.job || '칠판 관리인');

  const savingsRateDisplay =
    dashboard.savingsRate <= 1 && dashboard.savingsRate > 0
      ? `${(dashboard.savingsRate * 100).toFixed(1).replace(/\.0$/, '')}%`
      : `${Math.round(dashboard.savingsRate)}%`;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {/* 1. 상단 헤더 */}
      <PageHeader
        badgeText={student.classRoom}
        title="대시보드"
        subtitle={student.name}
      />

      {/* 2. 신용 등급 배너 */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-hero-card p-7 text-white shadow-sm">
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-sm font-medium text-white/90">
            나의 신용 등급
          </p>
          <div className="mb-4 flex flex-wrap items-center text-2xl md:text-3xl font-extrabold tracking-tight">
            <span>{student.name.split(' ')[0]}의 신용등급은</span>
            <span className="mx-2.5 inline-flex items-center rounded-xl bg-white px-3.5 py-0.5 text-xl md:text-2xl font-black text-[#0B654B] shadow-sm">
              {currentGrade}
            </span>
            <span>입니다</span>
          </div>
          <p className="text-sm md:text-base font-normal leading-relaxed text-white/95">
            현재 나의 신용 등급은 {currentGrade}입니다.
            <br />
            연체 없이 성실하게 저축을 실천해 높은 등급을 유지하고 있어요
          </p>
        </div>

        {/* 우측 상단 꽃 캐릭터 마스코트 */}
        <div className="absolute -right-4 -bottom-4 md:right-4 md:top-3 h-36 w-36 md:h-44 md:w-44 shrink-0 pointer-events-none">
          <Image
            src="/images/characters/flower.svg"
            alt="꽃 캐릭터"
            width={180}
            height={180}
            priority
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* 3. 중간 영역: 나의 현재 직업 / 8월 경제 활동 보기 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 나의 현재 직업 */}
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              나의 현재 직업은
            </h2>
            <span className="inline-flex rounded-full border border-[#35C884] bg-[#E8F8F0] px-4 py-1 text-sm font-bold text-[#0B654B]">
              {jobName}
            </span>
          </div>

          <div className="my-1 flex justify-center items-center py-2">
            <Image
              src="/objects/clean.svg"
              alt={jobName}
              width={200}
              height={200}
              priority
              className="h-36 w-36 md:h-44 md:w-44 object-contain transition-transform duration-300 hover:scale-105 drop-shadow-xs"
            />
          </div>

          <Link href="/payroll" className="w-full">
            <Button variant="primary" fullWidth className="py-3.5">
              급여 명세서
            </Button>
          </Link>
        </Card>

        {/* 8월 경제 활동 보기 */}
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              8월 경제 활동 보기
            </h2>
            <p className="text-sm text-gray-500">
              새로운 급여 수령과 직업 활동 기록이 업데이트 되었어요
            </p>
          </div>

          <div className="my-4">
            <ActivityLineChart
              income={dashboard.incomeThisMonth}
              expense={dashboard.expenseThisMonth}
              totalAssets={dashboard.totalAssets}
              period={dashboard.period || '8월'}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/credit-report" className="w-full">
              <Button
                variant="outline"
                fullWidth
                className="py-3 text-gray-700"
              >
                AI 신용평가 확인하기
              </Button>
            </Link>

            <Link href="/savings" className="w-full">
              <Button variant="primary" fullWidth className="py-3.5">
                경제생활 시작하기
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. 하단 영역: 이번 달 한눈에 보기 / 최근 거래 내역 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 왼쪽: 이번 달 한눈에 보기 */}
        <div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            이번 달 한눈에 보기
          </h2>
          <div className="flex flex-col gap-3.5">
            {/* 번 금액 */}
            <Card className="flex items-center justify-between p-5 hover:border-emerald-200 transition-colors">
              <div className="flex flex-col gap-2">
                <span className="text-base font-bold text-gray-800">
                  이번 달 번 금액
                </span>
                <Badge
                  variant="green-pill"
                  className="w-fit text-sm px-3.5 py-1 font-bold"
                >
                  {dashboard.incomeThisMonth.toLocaleString()} 미소
                </Badge>
              </div>
              <SproutCloverGraphic className="h-14 w-14" />
            </Card>

            {/* 총 자산 */}
            <Card className="flex items-center justify-between p-5 hover:border-emerald-200 transition-colors">
              <div className="flex flex-col gap-2">
                <span className="text-base font-bold text-gray-800">
                  총 자산
                </span>
                <Badge
                  variant="green-pill"
                  className="w-fit text-sm px-3.5 py-1 font-bold"
                >
                  {dashboard.totalAssets.toLocaleString()} 미소
                </Badge>
              </div>
              <FourLeafCloverGraphic className="h-14 w-14" />
            </Card>

            {/* 저축한 금액 */}
            <Card className="flex items-center justify-between p-5 hover:border-emerald-200 transition-colors">
              <div className="flex flex-col gap-2">
                <span className="text-base font-bold text-gray-800">
                  저축한 금액 ({savingsRateDisplay})
                </span>
                <Badge
                  variant="green-pill"
                  className="w-fit text-sm px-3.5 py-1 font-bold"
                >
                  {dashboard.savingsBalance.toLocaleString()} 미소
                </Badge>
              </div>
              <StemSproutGraphic className="h-14 w-10" />
            </Card>
          </div>
        </div>

        {/* 오른쪽: 최근 거래 내역 */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">최근 거래 내역</h2>
          </div>

          <Card className="flex flex-col justify-between p-6">
            <div>
              <p className="mb-4 text-sm font-bold text-gray-900">
                최근 거래내역은 5건까지 볼 수 있어요
              </p>

              <div className="flex flex-col divide-y divide-gray-100">
                {(dashboard.recentTransactions || []).map((tx) => {
                  const isPositive = tx.amount > 0;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span className="truncate font-medium text-gray-800">
                          {tx.description}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {tx.occurredAt?.includes('T')
                            ? `${tx.occurredAt.split('T')[0].slice(5)} ${tx.occurredAt.split('T')[1].slice(0, 5)}`
                            : tx.occurredAt}
                        </span>
                        <Badge
                          variant={isPositive ? 'green-pill' : 'danger-pill'}
                          className="font-bold text-xs"
                        >
                          {isPositive ? `+${tx.amount}` : tx.amount} 미소
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/savings"
                onClick={() => setSavingsTab('accounts')}
                className="w-full"
              >
                <Button variant="primary" fullWidth className="py-3.5">
                  내역 상세보기
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
