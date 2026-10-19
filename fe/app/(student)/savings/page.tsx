'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSavingsSummary } from '@/features/savings/hooks/useSavingsSummary';
import { useSavingsGoal } from '@/features/savings/hooks/useSavingsGoal';
import { useSavingsTrends } from '@/features/savings/hooks/useSavingsTrends';
import { useSavingsRecommendations } from '@/features/savings/hooks/useSavingsRecommendations';
import { useSavingsTransfer } from '@/features/savings/hooks/useSavingsTransfer';
import { useAccounts } from '@/features/account/hooks/useAccounts';
import { useTransactions } from '@/features/transaction/hooks/useTransactions';
import { useStudentStore } from '@/stores/useStudentStore';
import { useSavingsStore } from '@/stores/useSavingsStore';
import { useMonthStore } from '@/stores/useMonthStore';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  CoinStackGraphic,
  SproutCloverGraphic,
  FourLeafCloverGraphic,
  StemSproutGraphic,
  GreenTreesGraphic,
  CloudCharacterGraphic,
} from '@/components/common/FigmaGraphics';

export default function SavingsPage() {
  const student = useStudentStore((state) => state.student);
  const { currentTab, setTab } = useSavingsStore();
  const { selectedYear, selectedMonth } = useMonthStore();

  const [selectedTxType, setSelectedTxType] = useState<string | undefined>(
    undefined,
  );
  const [txPage, setTxPage] = useState(1);

  const { data: summary } = useSavingsSummary();
  const { data: goalData } = useSavingsGoal();
  const { data: trendsData } = useSavingsTrends();
  const { data: recommendations } = useSavingsRecommendations();
  const { data: accountsData } = useAccounts();

  // 계좌 및 목표 DTO 매핑
  const fromAccount =
    accountsData?.find((acc) => acc.accountType === 'CHECKING') ||
    accountsData?.[0];
  const toAccount =
    accountsData?.find(
      (acc) =>
        acc.accountType === 'SAVINGS' ||
        acc.accountId !== fromAccount?.accountId,
    ) || accountsData?.[1];

  const fromAccountId = fromAccount?.accountId || 'ACC-CHECKING-001';
  const toAccountId = toAccount?.accountId || 'ACC-SAVINGS-001';
  const goalId = goalData?.goalId || goalData?.id || 'GOAL-001';

  // 현재 저축액 및 목표 수치 계산
  const totalSavings = summary?.totalSavings ?? 15200;
  const targetAmount = goalData?.targetAmount || 30000;
  const currentGoalAmount = goalData?.currentAmount ?? totalSavings;
  const progressPercent =
    goalData?.progressPercent ??
    (targetAmount > 0
      ? Math.min(Math.round((currentGoalAmount / targetAmount) * 100), 100)
      : 0);
  const goalTitle = goalData?.title || '30,000미소 저금';
  const goalPeriod = goalData?.period || '2026.05.15';

  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const fromDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
  const toDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const mainAccountId = accountsData?.[0]?.accountId || 'CHK-s3101';

  const { data: transactionsData, isLoading: isTxLoading } = useTransactions({
    from: fromDate,
    to: toDate,
    type: selectedTxType,
    accountId: mainAccountId,
    page: txPage,
    size: 20,
  });

  // 모달 상태 (저축하기 / 목표 추가 등 인터랙션용)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const transferMutation = useSavingsTransfer();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState('');
  const [depositErrorMsg, setDepositErrorMsg] = useState('');

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      setDepositErrorMsg('저축할 금액을 1 이상 입력해 주세요.');
      return;
    }

    if (
      fromAccount &&
      fromAccount.balance !== undefined &&
      amount > fromAccount.balance
    ) {
      setDepositErrorMsg(
        `출금 가능 잔액(${fromAccount.balance.toLocaleString()} 미소)을 초과했습니다.`,
      );
      return;
    }

    setDepositErrorMsg('');
    transferMutation.mutate(
      {
        fromAccountId,
        toAccountId,
        amount,
        goalId,
      },
      {
        onSuccess: (res) => {
          const successText =
            res?.toAccountBalance !== undefined
              ? `${res.amount.toLocaleString()} 미소가 성공적으로 저축되었습니다! (저축 잔액: ${res.toAccountBalance.toLocaleString()} 미소)`
              : `${amount.toLocaleString()} 미소가 성공적으로 저축되었습니다!`;
          setDepositSuccessMsg(successText);
          setTimeout(() => {
            setDepositSuccessMsg('');
            setIsDepositModalOpen(false);
            setDepositAmount('');
          }, 1800);
        },
        onError: (err: unknown) => {
          const msg =
            err instanceof Error
              ? err.message
              : '저축 이체 중 오류가 발생했습니다.';
          setDepositErrorMsg(msg);
        },
      },
    );
  };

  const trends = trendsData?.trends || [
    { yearMonth: '10월', amount: 1200 },
    { yearMonth: '11월', amount: 1500 },
    { yearMonth: '12월', amount: 1800 },
    { yearMonth: '1월', amount: 2000 },
    { yearMonth: '2월', amount: 2200 },
    { yearMonth: '3월', amount: 2500 },
  ];

  const maxTrend = Math.max(...trends.map((t) => t.amount), 3000);
  const averageTrend = trends.length
    ? Math.round(
        trends.reduce((sum, trend) => sum + trend.amount, 0) / trends.length,
      )
    : 0;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {/* 1. 상단 헤더 */}
      <div className="mb-2">
        <PageHeader
          badgeText={student.classRoom}
          title={currentTab === 'saving' ? '저축하기' : '내 통장 확인'}
        />
      </div>

      {/* 헤드라인 */}
      <div className="relative mb-8">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight whitespace-pre-line max-w-xl mt-2">
          {currentTab === 'saving'
            ? 'AI와 함께 목표를 세우고\n학급 전용 화폐인 미소를 똑똑하게 저축해 보세요!'
            : 'AI가 분석한 나의 계좌 현황과\n실시간 거래 내역을 실시간으로 확인할 수 있어요'}
        </h1>
      </div>

      {/* ======================================================== */}
      {/* 탭 1: 저축하기 (피그마 3번 화면) */}
      {/* ======================================================== */}
      {currentTab === 'saving' && (
        <div className="space-y-6 relative">
          {/* 화분 - 카드 뒤 */}
          <div className="hidden sm:block absolute right-6 md:right-10 -top-[125px] md:-top-[135px] z-0 pointer-events-none">
            <div className="relative h-28 w-28 md:h-36 md:w-36">
              <Image
                src="/images/characters/pot.svg"
                alt="화분 마스코트"
                width={144}
                height={144}
                priority
                className="h-full w-full object-contain translate-y-[22px]"
              />
            </div>
          </div>

          {/* 카드 */}
          <div className="relative z-10">{/* 카드 내용 */}</div>

          {/* 손 - 카드 앞 */}
          <div className="hidden sm:flex absolute right-6 md:right-10 -top-[125px] md:-top-[135px] z-20 pointer-events-none">
            <div className="relative h-28 w-28 md:h-36 md:w-36">
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[85px] md:w-[95px] flex justify-between">
                <div className="h-6 w-6 md:h-7 md:w-7 relative -rotate-6">
                  <Image
                    src="/images/characters/hand.svg"
                    alt="왼손"
                    width={28}
                    height={28}
                    className="h-full w-full object-contain drop-shadow-xs"
                  />
                </div>

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

          {/* 나의 총 저축 금액 배너 */}
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-7 relative z-0">
            <div className="flex items-center gap-5">
              <CoinStackGraphic className="h-20 w-20 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  나의 총 저축 금액
                </p>
                <div className="mb-2 flex flex-wrap items-center text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  <span>나의 총 저축액은</span>
                  <span className="mx-2.5 inline-flex items-center rounded-xl bg-[#35C884] px-3.5 py-0.5 text-xl md:text-2xl font-black text-white shadow-sm">
                    {totalSavings.toLocaleString()} 미소
                  </span>
                  <span>입니다</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  열심히 모았네요! 정원이 부쩍 자랐어요
                </p>
              </div>
            </div>

            {/* 우측 버튼 3개 */}
            <div className="flex flex-col gap-2.5 w-full md:w-44 shrink-0">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setIsDepositModalOpen(true)}
                className="py-2.5"
              >
                저축하기
              </Button>
              <Button variant="outline" fullWidth className="py-2.5 text-xs">
                목표 수정
              </Button>
              <Button variant="outline" fullWidth className="py-2.5 text-xs">
                목표 추가
              </Button>
            </div>
          </Card>

          {/* 월간 통계 3종 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 이번 달 저축 */}
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  이번 달 저축
                </p>
                <Badge
                  variant="green-pill"
                  className="text-sm px-3 py-1 font-bold"
                >
                  +{(summary?.monthlySavings || 2500).toLocaleString()} 미소
                </Badge>
              </div>
              <SproutCloverGraphic className="h-14 w-14" />
            </Card>

            {/* 월 평균 저축 */}
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  월 평균 저축
                </p>
                <Badge
                  variant="green-pill"
                  className="text-sm px-3 py-1 font-bold"
                >
                  {(summary?.averageSavings || 1800).toLocaleString()} 미소
                </Badge>
              </div>
              <FourLeafCloverGraphic className="h-14 w-14" />
            </Card>

            {/* 저축률 */}
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="text-lg font-bold text-gray-800 mb-2">저축률</p>
                <Badge
                  variant="green-pill"
                  className="text-sm px-3 py-1 font-bold"
                >
                  {summary?.savingsRate || 32}%
                </Badge>
              </div>
              <StemSproutGraphic className="h-14 w-10" />
            </Card>
          </div>

          {/* 중간 영역: 나의 저축 목표 목록 & 월별 저축 추이 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 나의 저축 목표 목록 */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    나의 저축 목표 목록
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-400">
                    예상 달성일: {goalPeriod}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="inline-flex rounded-lg bg-[#35C884] text-white text-xs font-bold px-3 py-1">
                    {goalTitle}
                  </span>
                </div>

                {/* 프로그레스 바 & 말풍선 */}
                <div className="relative pt-6 pb-2">
                  <div
                    className="absolute -top-1 font-bold text-xs bg-emerald-100 text-[#0B654B] px-2 py-0.5 rounded-md shadow-xs transition-all duration-300"
                    style={{
                      left: `clamp(0%, ${Math.max(progressPercent - 4, 0)}%, 88%)`,
                    }}
                  >
                    {progressPercent}%
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#35C884] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold mt-2">
                  <span className="text-[#0B654B]">
                    현재 {currentGoalAmount.toLocaleString()} 미소
                  </span>
                  <span className="text-[#35C884]">
                    목표 {targetAmount.toLocaleString()} 미소
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {progressPercent >= 100 ? (
                    <span className="font-bold text-[#0B654B]">
                      목표를 달성했어요! 축하합니다 🎉
                    </span>
                  ) : (
                    <>
                      현재 속도를 유지하면 목표일보다{' '}
                      <span className="font-bold text-[#0B654B]">2주 일찍</span>{' '}
                      달성 가능해요!
                    </>
                  )}
                </p>
              </div>
            </Card>

            {/* 월별 저축 추이 */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="relative h-28">
                  <div className="relative z-20">
                    <h3 className="text-xl font-bold text-gray-900">
                      월별 저축 추이
                    </h3>
                    <p className="mt-1 text-[11px] text-gray-400">
                      최근 6개월 기준
                    </p>
                    <span className="mt-2 inline-flex rounded-lg bg-[#35C884] px-3 py-1 text-xs font-bold text-white">
                      평균 {averageTrend.toLocaleString()} 미소
                    </span>
                  </div>
                  <CloudCharacterGraphic className="pointer-events-none absolute bottom-[25px] left-[74%] z-0 h-36 w-52 -translate-x-1/2 sm:bottom-[70px] sm:h-30 sm:w-56" />
                </div>

                {/* 막대 차트 영역 */}
                <div className="relative z-10">
                  <div className="grid h-40 grid-cols-6 items-end gap-2 rounded-2xl bg-[#EBF9F2] px-3 pb-3 pt-5">
                    {trends.map((item, idx) => {
                      const heightPercent = Math.round(
                        (item.amount / maxTrend) * 100,
                      );
                      return (
                        <div
                          key={idx}
                          className="group flex h-full min-w-0 flex-col items-center justify-end gap-1.5"
                        >
                          <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[#0B654B] shadow-xs whitespace-nowrap">
                            {item.amount.toLocaleString()}
                          </span>
                          <div className="flex h-24 w-full items-end justify-center">
                            <div
                              className="w-full max-w-[38px] rounded-t-lg bg-[#35C884] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all group-hover:bg-[#2EB374]"
                              style={{
                                height: `${Math.max(heightPercent, 8)}%`,
                              }}
                              title={`${item.yearMonth}: ${item.amount.toLocaleString()} 미소`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI 맞춤 제안 */}
          <div className="relative rounded-2xl border border-[#35C884]/40 bg-[#E8F8F0]/40 p-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-[#0B654B] mb-2">
                AI 맞춤 제안
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed mb-4">
                현재 저축 패턴을 분석한 결과, 매주 수요일에 가장 많이 저축하는
                경향이 있습니다.
                <br />
                자동 저축을 수요일에 설정하면 목표 달성률이{' '}
                <span className="font-bold text-[#0B654B]">25%</span> 향상됩니다
              </p>

              <div className="rounded-xl bg-white/90 border border-emerald-200/80 p-3 text-xs text-gray-700 font-medium">
                {recommendations?.recommendations[0]?.expectedEffect ||
                  "팁: 매주 수요일 간식 구독료(약 120 미소)를 '수학여행 저금'에 자동이체 해보세요."}
              </div>
            </div>

            <div className="absolute right-4 top-4 h-24 w-24 md:h-28 md:w-28 shrink-0 pointer-events-none">
              <Image
                src="/images/characters/color-flower.svg"
                alt="꽃 마스코트"
                width={100}
                height={100}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 탭 2: 내 통장 확인 (피그마 4번 화면) */}
      {/* ======================================================== */}
      {currentTab === 'accounts' && (
        <div className="space-y-6 relative">
          {/* 오른쪽 위: 카드 상단 테두리에 손을 얹고 올라타 있는 화분 캐릭터 */}
          <div className="hidden sm:flex absolute right-6 md:right-10 -top-[115px] md:-top-[135px] z-10 pointer-events-none flex-col items-center">
            <div className="relative h-28 w-28 md:h-36 md:w-36">
              <Image
                src="/images/characters/pot.svg"
                alt="화분 마스코트"
                width={144}
                height={144}
                priority
                className="h-full w-full object-contain"
              />
              {/* 두 손 (hand.svg) - 카드의 상단 테두리를 쥐고 있는 효과 */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[68px] md:w-[78px] flex justify-between z-20">
                <div className="h-6 w-6 md:h-7 md:w-7 relative -rotate-6">
                  <Image
                    src="/images/characters/hand.svg"
                    alt="왼손"
                    width={28}
                    height={28}
                    className="h-full w-full object-contain drop-shadow-xs"
                  />
                </div>
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

          {/* 나의 총 자산 합계 배너 */}
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-7 relative z-0">
            <div className="flex items-center gap-5">
              <CoinStackGraphic className="h-20 w-20 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  3월 급여 명세서
                </p>
                <div className="mb-2 flex flex-wrap items-center text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  <span>나의 총 자산 합계는</span>
                  <span className="mx-2.5 inline-flex items-center rounded-xl bg-[#35C884] px-3.5 py-0.5 text-xl md:text-2xl font-black text-white shadow-sm">
                    16,045,000 미소
                  </span>
                  <span>입니다</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  열심히 모았네요! 정원이 부쩍 자랐어요
                </p>
              </div>
            </div>

            <div className="hidden md:block shrink-0 pr-4">
              <GreenTreesGraphic className="h-20 w-28" />
            </div>
          </Card>

          {/* 계좌 카드 2종 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 주 거래 통장 */}
            <Card className="flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {accountsData?.[0]?.accountName || '주 거래 통장'}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {accountsData?.[0]?.accountNumber || '110-***-4568'}
                  </p>
                  <Badge variant="success" className="font-bold">
                    {accountsData?.[0]?.status || '정상거래 가능'}
                  </Badge>
                </div>
                <FourLeafCloverGraphic className="h-16 w-16" />
              </div>

              <div className="mt-6 rounded-xl border border-[#35C884] bg-white py-3 text-center text-base font-extrabold text-[#0B654B]">
                ₩{(accountsData?.[0]?.balance || 3245000).toLocaleString()} 미소
              </div>
            </Card>

            {/* 홍길동의 적금 통장 */}
            <Card className="flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {accountsData?.[1]?.accountName || '홍길동의 적금 통장'}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {accountsData?.[1]?.accountNumber || '110-***-4568'}
                  </p>
                  <Badge variant="success" className="font-bold">
                    {accountsData?.[1]?.status || '정상거래 가능'}
                  </Badge>
                </div>
                <StemSproutGraphic className="h-16 w-12" />
              </div>

              <div className="mt-6 rounded-xl border border-[#35C884] bg-white py-3 text-center text-base font-extrabold text-[#0B654B]">
                ₩{(accountsData?.[1]?.balance || 12800000).toLocaleString()}{' '}
                미소
              </div>
            </Card>
          </div>

          {/* AI 분석 박스 */}
          <div className="relative rounded-2xl border border-[#35C884]/40 bg-[#E8F8F0]/40 p-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-[#0B654B] mb-2">AI 분석</h3>
              <p className="text-sm text-gray-800 leading-relaxed">
                이달 소비 추세로 볼 때, 25일에 월급이 들어오면{' '}
                <span className="font-bold text-[#0B654B]">₩850,000</span> 저축
                가능합니다.
                <br />
                신한 통장에서 카카오 세이프박스로 자동이체를 설정하면 목표
                달성률이 <span className="font-bold text-[#0B654B]">
                  15%
                </span>{' '}
                향상됩니다
              </p>
            </div>

            <div className="absolute right-4 top-4 h-20 w-20 shrink-0 pointer-events-none">
              <Image
                src="/images/characters/color-flower.svg"
                alt="꽃 마스코트"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 하단 공통 영역: 거래 내역 (미소 화폐) 표 카드 */}
      {/* 저축하기 / 내 통장 확인 탭 상관없이 항상 노출 */}
      {/* ======================================================== */}
      <div className="mt-8 space-y-6">
        {/* 거래 내역 (미소 화폐) 표 카드 */}
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">
                거래 내역 (미소 화폐)
              </h3>
              <span className="text-xs text-gray-400">
                총{' '}
                {transactionsData?.totalCount ??
                  transactionsData?.items.length ??
                  0}
                건
              </span>
            </div>

            {/* 필터 탭: 전체 / 지출 / 수입 */}
            <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setSelectedTxType(undefined);
                  setTxPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  selectedTxType === undefined
                    ? 'bg-white font-bold text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => {
                  setSelectedTxType('EXPENSE');
                  setTxPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  selectedTxType === 'EXPENSE'
                    ? 'bg-white font-bold text-red-600 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                지출
              </button>
              <button
                onClick={() => {
                  setSelectedTxType('INCOME');
                  setTxPage(1);
                }}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  selectedTxType === 'INCOME'
                    ? 'bg-white font-bold text-emerald-600 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                수입
              </button>
            </div>
          </div>

          {isTxLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              거래 내역을 불러오는 중입니다...
            </div>
          ) : !transactionsData?.items ||
            transactionsData.items.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              해당 기간의 거래 내역이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {(transactionsData.items || []).map((tx) => {
                const isPositive = tx.amount > 0 || tx.type === 'INCOME';
                return (
                  <div
                    key={tx.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-sm"
                  >
                    {/* 항목명 및 날짜 */}
                    <div className="flex items-center gap-3 min-w-[200px] flex-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <span className="font-semibold text-gray-800 truncate">
                        {tx.description}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {tx.occurredAt?.includes('T')
                          ? `${tx.occurredAt.split('T')[0].slice(5)} ${tx.occurredAt.split('T')[1].slice(0, 5)}`
                          : tx.occurredAt}
                      </span>
                    </div>

                    {/* 잔액, 금액, 구분 배지 */}
                    <div className="flex items-center gap-4 shrink-0">
                      {tx.balanceAfter !== undefined && (
                        <span className="text-xs text-gray-500 font-medium">
                          {tx.balanceAfter.toLocaleString()} 미소
                        </span>
                      )}

                      <Badge
                        variant={isPositive ? 'green-pill' : 'danger-pill'}
                        className="font-bold min-w-[80px] text-center"
                      >
                        {isPositive ? `+${Math.abs(tx.amount)}` : tx.amount}{' '}
                        미소
                      </Badge>

                      <Badge
                        variant={isPositive ? 'blue-pill' : 'gray-pill'}
                        className="font-bold w-12 text-center"
                      >
                        {isPositive ? '수입' : '지출'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 페이징 네비게이션 */}
          {transactionsData && transactionsData.totalCount > 20 && (
            <div className="mt-4 flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
              <button
                disabled={txPage <= 1}
                onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold disabled:opacity-30 cursor-pointer"
              >
                이전
              </button>
              <span className="text-xs text-gray-500 font-medium">
                {txPage} / {Math.ceil(transactionsData.totalCount / 20)}
              </span>
              <button
                disabled={txPage >= Math.ceil(transactionsData.totalCount / 20)}
                onClick={() => setTxPage((p) => p + 1)}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold disabled:opacity-30 cursor-pointer"
              >
                다음
              </button>
            </div>
          )}
        </Card>

        {/* 하단 액션 버튼 2개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setTab('saving')}
            className="py-3.5 text-base"
          >
            저축하러 가기
          </Button>

          <Link href="/credit-report" className="block w-full">
            <Button variant="primary" fullWidth className="py-3.5 text-base">
              계좌별 AI 상세 분석 시작하기
            </Button>
          </Link>
        </div>
      </div>

      {/* 저축하기 모달 */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-gray-900 mb-2">저축하기</h3>
            <p className="text-xs text-gray-500 mb-4">
              출금 계좌에서 목표 저축 계좌로 미소를 이체합니다.
            </p>

            {depositSuccessMsg ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm font-bold text-[#0B654B] leading-relaxed">
                {depositSuccessMsg}
              </div>
            ) : (
              <div className="space-y-4">
                {depositErrorMsg && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-xs font-semibold text-red-500">
                    {depositErrorMsg}
                  </div>
                )}

                {/* 계좌 요약 카드 */}
                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>출금 계좌</span>
                    <span className="font-bold text-gray-800">
                      {fromAccount?.accountName || '보통 예금'}
                      {fromAccount?.balance !== undefined && (
                        <span className="text-gray-500 font-normal ml-1">
                          (잔액: {fromAccount.balance.toLocaleString()} 미소)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>입금 계좌</span>
                    <span className="font-bold text-[#0B654B]">
                      {toAccount?.accountName || '저축 목표 통장'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>저축 목표</span>
                    <span className="font-semibold text-gray-700">
                      {goalTitle}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-600">
                      저축 금액 (미소)
                    </label>
                    {fromAccount?.balance !== undefined && (
                      <span className="text-[11px] text-gray-400">
                        최대 {fromAccount.balance.toLocaleString()} 미소
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="예: 5000"
                    disabled={transferMutation.isPending}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#35C884] focus:ring-2 focus:ring-[#35C884]/20 disabled:opacity-50"
                  />

                  {/* 퀵 금액 버튼 */}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[1000, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(String(amt))}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 hover:border-emerald-300 transition-colors cursor-pointer"
                      >
                        +{amt.toLocaleString()}
                      </button>
                    ))}
                    {fromAccount?.balance !== undefined && fromAccount.balance > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setDepositAmount(String(fromAccount.balance))
                        }
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#0B654B] hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        전액
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    fullWidth
                    disabled={transferMutation.isPending}
                    onClick={() => {
                      setDepositErrorMsg('');
                      setIsDepositModalOpen(false);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={transferMutation.isPending}
                    onClick={handleDeposit}
                  >
                    {transferMutation.isPending ? '처리 중...' : '저축 완료'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
