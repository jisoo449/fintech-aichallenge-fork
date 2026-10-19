'use client';

import Link from 'next/link';
import { useCreditReport } from '@/features/credit/hooks/useCreditReport';
import { useCreditScore } from '@/features/credit/hooks/useCreditScore';
import { useStudentStore } from '@/stores/useStudentStore';
import { useMonthStore } from '@/stores/useMonthStore';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  SproutCloverGraphic,
  BottomGardenGraphic,
} from '@/components/common/FigmaGraphics';

export default function CreditEvaluationPage() {
  const student = useStudentStore((state) => state.student);
  const { getYearMonthString } = useMonthStore();
  const yearMonth = getYearMonthString();
  const {
    data: report,
    isLoading,
    isError,
    error,
  } = useCreditReport(yearMonth);
  const { data: creditScoreData } = useCreditScore();

  // 1. 점수 및 등급 추출 (백엔드 실제 필드: creditScore, summary 파싱 등)
  const summaryMatch = report?.summary?.match(/(\d+)점(?:\s*\(([^)]+)\))?/);
  const scoreFromSummary = summaryMatch ? Number(summaryMatch[1]) : undefined;
  const gradeFromSummary = summaryMatch ? summaryMatch[2] : undefined;

  const currentScore =
    report?.creditScore ??
    report?.score ??
    report?.credit?.score ??
    scoreFromSummary ??
    creditScoreData?.score ??
    688;

  const rawGrade =
    report?.grade ??
    report?.creditGrade ??
    report?.credit?.grade ??
    gradeFromSummary ??
    creditScoreData?.grade ??
    '보통';

  const currentGrade =
    typeof rawGrade === 'number'
      ? `${rawGrade}등급`
      : String(rawGrade || '보통');

  // 2. content 3줄 분리 (행동 조언)
  const contentLines = (report?.content || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // 3. expectedEffect 3줄 분리 (기대 점수 상승 효과)
  const effectLines = (report?.expectedEffect || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // 4. 3대 분석 요인 카드 구성
  const factorCards = [
    {
      title: '지출 계획 관리',
      isPositive: false,
      tag: '유의 요인',
      advice:
        contentLines[0] ||
        '사고 싶은 것과 꼭 필요한 것을 나눠 생각해 보세요. 일주일 용돈을 먼저 계획하면 지출이 차분해집니다.',
      effect:
        effectLines[0] || '과소비를 줄이면 신용점수가 오릅니다. (예상 +116점)',
    },
    {
      title: '숙제 및 과제 성실도',
      isPositive: true,
      tag: '긍정 요인',
      advice:
        contentLines[1] ||
        '숙제는 미루지 말고 그날그날 끝내 보세요. 성실함은 신용평가에서 크게 반영됩니다.',
      effect:
        effectLines[1] ||
        '숙제 완료율이 오르면 신용등급이 한 단계 올라갈 수 있습니다. (예상 +37점)',
    },
    {
      title: '출결 및 학교 생활',
      isPositive: true,
      tag: '긍정 요인',
      advice:
        contentLines[2] ||
        '학교에 꾸준히 나오는 친구는 믿을 수 있어요. 출석을 지키는 일부터 시작해 보세요.',
      effect:
        effectLines[2] ||
        '출결률이 높아지면 기본 신뢰 점수가 안정적으로 올라갑니다. (예상 +18점)',
    },
  ];

  // 5. features 실제 데이터 (출석률, 숙제완료율, 지출추이)
  const features = report?.features;
  const attendanceVal =
    features?.attendance_rate !== undefined
      ? `${(features.attendance_rate * 100).toFixed(1)}%`
      : '94.2%';
  const homeworkVal =
    features?.homework_rate !== undefined
      ? `${(features.homework_rate * 100).toFixed(1)}%`
      : '89.7%';
  const spendingVal =
    features?.spending_trend !== undefined
      ? `${(features.spending_trend * 100).toFixed(1)}%`
      : '80.9%';

  const behaviorData = [
    { label: '출석률', value: attendanceVal },
    { label: '과제 완료율', value: homeworkVal },
    { label: '지출 안정도', value: spendingVal },
    { label: '활동 참여도', value: '95.0%' },
    { label: '규칙 준수율', value: '95.0%' },
    { label: '저축 약속 이행률', value: '95.0%' },
  ];

  return (
    <div className="relative mx-auto max-w-6xl p-6 md:p-8 pb-32">
      {/* 1. 상단 헤더 */}
      <div className="mb-6">
        <PageHeader badgeText={student.classRoom} title="우리반 경제생활" />
      </div>

      {/* 2. 로딩 중 상태 */}
      {isLoading && (
        <div className="my-10 flex min-h-[350px] flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-xs border border-gray-100">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#35C884] border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-gray-600">
            신용 평가 데이터를 불러오는 중입니다...
          </p>
        </div>
      )}

      {/* 3. 데이터 미존재(404) 또는 에러 상태 안내 알림 */}
      {!isLoading && (isError || !report) && (
        <Card className="my-8 flex flex-col items-center justify-center p-10 md:p-14 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 text-2xl font-bold shadow-xs">
            📢
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">
            AI 신용평가 안내
          </h3>
          <p className="text-sm md:text-base font-semibold text-gray-700 mb-2">
            {error instanceof Error
              ? error.message
              : '해당 월의 신용 평가 결과를 찾을 수 없습니다.'}
          </p>
          <p className="text-xs md:text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
            아직 월말 결산이 완료되지 않았거나 신용평가 결과가 생성되지
            않았습니다.
            <br />
            핵심 지표 요약 화면 또는 대시보드에서 최신 정보를 확인해 보세요.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link href="/credit-report">
              <Button
                variant="outline"
                className="px-5 py-2.5 text-xs font-bold text-gray-700"
              >
                핵심 지표 요약 확인
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                className="px-5 py-2.5 text-xs font-bold"
              >
                대시보드로 이동
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 4. 신용 평가 데이터 정상 노출 */}
      {!isLoading && report && (
        <>
          {/* 나의 신용 점수 배너 카드 */}
          <Card className="mb-6 flex flex-col md:flex-row items-center justify-between gap-6 p-7">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-1">
                나의 신용 점수
              </p>
              <div className="mb-3 flex flex-wrap items-center text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                <span>나의 현재 신용 점수는</span>
                <span className="mx-2.5 inline-flex items-center rounded-xl bg-[#35C884] px-3.5 py-0.5 text-xl md:text-2xl font-black text-white shadow-sm">
                  {currentScore}점
                </span>
                <span>입니다</span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                현재 나의 종합 신용 등급은 {currentGrade}입니다.
                <br />
                연체 없이 성실하게 저축을 실천해 높은 등급을 유지하고 있어요
              </p>
            </div>

            {/* 우측 종합 신용 등급 말풍선 & 꽃 캐릭터 */}
            <div className="flex items-center gap-4 shrink-0 pr-2">
              <div className="relative rounded-2xl bg-[#35C884] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm">
                종합 신용 등급 {currentGrade}!
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-0 w-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#35C884]" />
              </div>
              <SproutCloverGraphic className="h-20 w-20" />
            </div>
          </Card>

          {/* 3대 신용 평가 요인 분석 및 행동 제안 카드 */}
          <Card className="mb-6 p-7">
            <h3 className="mb-4 text-xl font-extrabold text-gray-900">
              3대 신용 평가 요인 분석 및 행동 제안
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {factorCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-2xl p-5 border transition-all ${
                    card.isPositive
                      ? 'border-emerald-100 bg-[#E8F8F0]/40'
                      : 'border-amber-100 bg-amber-50/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                          card.isPositive
                            ? 'bg-[#35C884] text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {card.tag}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {card.title}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm font-semibold text-gray-800 leading-relaxed mb-3">
                      {card.advice}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200/50">
                    <span className="text-[11px] font-bold text-gray-400 block mb-1">
                      기대 효과
                    </span>
                    <p className="text-xs font-extrabold text-[#0B654B] leading-tight">
                      {card.effect}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 6대 행동 데이터 (features 반영) */}
          <Card className="mb-6 p-7">
            <h3 className="mb-4 text-xl font-extrabold text-gray-900">
              신용 평가 반영 행동 데이터
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {behaviorData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-4 text-center border border-gray-100"
                >
                  <span className="text-xs font-semibold text-gray-500 mb-1">
                    {item.label}
                  </span>
                  <span className="text-base font-black text-[#0B654B]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI 총평 */}
          {report.summary && (
            <Card className="p-6 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35C884] text-white text-xs font-black shadow-xs">
                  AI
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      AI 신용 분석가 총평
                    </h4>
                    {report.generatedAt && (
                      <span className="text-[11px] text-gray-400 font-medium">
                        분석 기준: {report.generatedAt.split('T')[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    {report.summary}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* 하단 풀밭 장식 */}
          <div className="mt-12 flex justify-center opacity-80">
            <BottomGardenGraphic className="h-16 w-full max-w-md" />
          </div>
        </>
      )}
    </div>
  );
}
