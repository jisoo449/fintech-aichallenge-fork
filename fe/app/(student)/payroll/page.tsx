'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePayroll } from '@/features/payroll/hooks/usePayroll';
import { useStudentStore } from '@/stores/useStudentStore';
import { useMonthStore } from '@/stores/useMonthStore';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  CoinStackGraphic,
  SproutCloverGraphic,
} from '@/components/common/FigmaGraphics';

const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function PayrollPage() {
  const student = useStudentStore((state) => state.student);
  const { selectedMonth, setMonth, getYearMonthString } = useMonthStore();
  const yearMonth = getYearMonthString();
  const { data: payroll, isLoading, isError, error } = usePayroll(yearMonth);

  const netPay = payroll ? payroll.grossPay - payroll.totalDeductions : 0;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      {/* 1. 상단 헤더 & 월 선택 바 (어떤 상태에서도 항상 노출되어 다른 월 이동 가능) */}
      <PageHeader
        badgeText={student.classRoom}
        title="급여 확인 및 정산"
        rightElement={
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm border border-gray-100 overflow-x-auto">
            {months.map((m) => {
              const isSelected = m === selectedMonth;
              return (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'border border-[#35C884] bg-white text-[#0B654B] shadow-xs'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {m}월
                </button>
              );
            })}
          </div>
        }
      />

      {/* 2. 로딩 중 상태 */}
      {isLoading && (
        <div className="my-10 flex min-h-[350px] flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-xs border border-gray-100">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#35C884] border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-gray-600">
            {selectedMonth}월 급여 명세 데이터를 불러오는 중입니다...
          </p>
        </div>
      )}

      {/* 3. 데이터 미존재(404) 또는 에러 상태: 알림 안내 카드 */}
      {!isLoading && (isError || !payroll) && (
        <Card className="my-8 flex flex-col items-center justify-center p-10 md:p-14 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 text-2xl font-bold shadow-xs">
            📢
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">
            {selectedMonth}월 급여 명세서 안내
          </h3>
          <p className="text-sm md:text-base font-semibold text-gray-700 mb-2">
            {error instanceof Error
              ? error.message
              : '해당 월의 급여 내역을 찾을 수 없습니다.'}
          </p>
          <p className="text-xs md:text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
            아직 이번 달 급여가 정산되지 않았거나 등록된 명세 내역이 없습니다.
            <br />
            상단의 월 선택 바를 눌러 다른 월의 급여 명세서를 확인해 보세요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="px-5 py-2.5 text-xs font-bold text-gray-700"
              >
                대시보드로 이동
              </Button>
            </Link>
            <Link href="/savings">
              <Button
                variant="primary"
                className="px-5 py-2.5 text-xs font-bold"
              >
                저축하러 가기
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 4. 급여 명세 데이터 정상 노출 */}
      {!isLoading && payroll && (
        <>
          {/* 메인 급여 명세서 배너 카드 */}
          <Card className="relative mb-8 flex flex-col md:flex-row items-center justify-between gap-6 p-7">
            <div className="flex items-center gap-5">
              <CoinStackGraphic className="h-20 w-20 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  {selectedMonth}월 급여 명세서
                </p>
                <div className="mb-2 flex flex-wrap items-center text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  <span>이번 달 실수령액은</span>
                  <span className="mx-2.5 inline-flex items-center rounded-xl bg-[#35C884] px-3.5 py-0.5 text-xl md:text-2xl font-black text-white shadow-sm">
                    {netPay.toLocaleString()} 미소
                  </span>
                  <span>입니다</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  기본급에서 정해진 소득세와 기금 의무 공제액을 제한 실
                  수령액입니다.
                </p>
              </div>
            </div>

            <div className="hidden md:block shrink-0 pr-4">
              <SproutCloverGraphic className="h-20 w-20" />
            </div>
          </Card>

          {/* 세부 명세 내역 */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              세부 명세 내역
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 지급 항목 */}
              <Card className="flex flex-col justify-between">
                <div>
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    지급 항목
                  </h3>
                  <div className="flex flex-col divide-y divide-gray-50">
                    {payroll.earnings.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <Badge variant="green-pill" className="font-bold">
                          {item.amount.toLocaleString()} 미소
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="rounded-xl border border-[#35C884] bg-[#E8F8F0]/40 py-3 text-center text-sm font-extrabold text-[#0B654B]">
                    총 {payroll.grossPay.toLocaleString()} 미소
                  </div>
                </div>
              </Card>

              {/* 공제 항목 */}
              <Card className="flex flex-col justify-between">
                <div>
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    공제 항목
                  </h3>
                  <div className="flex flex-col divide-y divide-gray-50">
                    {payroll.deductions.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <Badge variant="danger-pill" className="font-bold">
                          {item.amount.toLocaleString()} 미소
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="rounded-xl border border-[#FFA4A4] bg-[#FFE5E5]/40 py-3 text-center text-sm font-extrabold text-[#FF5D5D]">
                    총 {payroll.totalDeductions.toLocaleString()} 미소
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 실수령액 계산 & 포토카드 */}
          <Card className="mb-6">
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              실수령액 계산
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* 계산 항목 리스트 */}
              <div className="w-full flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between py-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="font-semibold text-gray-800">
                      기본월급 (세전)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {payroll.jobName || '기본 직업'} 수입
                    </span>
                    <Badge variant="green-pill" className="font-bold">
                      {payroll.grossPay.toLocaleString()} 미소
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="font-semibold text-gray-800">
                      공제 합계
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      세금 및 의무 저축
                    </span>
                    <Badge variant="danger-pill" className="font-bold">
                      -{payroll.totalDeductions.toLocaleString()} 미소
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="font-semibold text-gray-800">
                      실 수령액 (세후)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      실제 사용 가능 금액
                    </span>
                    <Badge variant="success" className="font-bold px-3 py-1">
                      {netPay.toLocaleString()} 미소
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#35C884] bg-[#E8F8F0]/30 py-3 text-center text-base font-extrabold text-[#0B654B]">
                  {netPay.toLocaleString()} 미소
                </div>
              </div>

              {/* 우측 폴라로이드 카드 */}
              <div className="flex justify-center shrink-0 pr-6">
                <Image
                  src="/objects/flower_card.svg"
                  alt="SEED 꽃 포토카드"
                  width={176}
                  height={224}
                  className="h-56 w-44 object-contain"
                />
              </div>
            </div>
          </Card>

          {/* 하단 저축하러 가기 버튼 */}
          <Link href="/savings" className="block w-full">
            <Button variant="primary" fullWidth className="py-4 text-base">
              저축하러 가기
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
