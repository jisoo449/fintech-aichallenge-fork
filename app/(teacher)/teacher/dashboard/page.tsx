'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';
import { BottomGardenGraphic } from '@/components/common/FigmaGraphics';
import { useTeacherDashboard } from '@/features/teacher/hooks/useClassroomDashboard';
import { useLatestEconomicAnalysis } from '@/features/teacher/hooks/useEconomicAnalysis';

const CLASSROOM_ID = 1;
const statusName: Record<string, string> = {
  CONTRACTION: '경기 위축',
  EXPANSION: '경기 활성',
  STABLE: '정상',
  INFLATION: '인플레이션',
  DEFLATION: '디플레이션',
};
const percent = (value = 0) =>
  `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;

export default function TeacherDashboardPage() {
  const query = useTeacherDashboard(CLASSROOM_ID);
  const analysisQuery = useLatestEconomicAnalysis(CLASSROOM_ID);
  if (query.isLoading)
    return <StateMessage>학급 경제 데이터를 불러오는 중입니다...</StateMessage>;
  if (query.isError || !query.dashboard || !query.indicators)
    return (
      <StateMessage
        action={() => {
          void query.refetch();
        }}
      >
        학급 경제 데이터를 불러오지 못했습니다.
      </StateMessage>
    );

  const { kpis } = query.dashboard;
  const latest = query.indicators.latest;
  const students = query.students ?? [];
  const analysis = analysisQuery.data;
  const status = analysis?.economicStatus ?? 'STABLE';
  const isNormal = status === 'STABLE' || status === 'EXPANSION';
  const metrics = [
    [
      '총 소비액',
      `${kpis.totalConsumption.toLocaleString()} 미소`,
      percent(latest.consumptionChangeRate),
    ],
    [
      '거래량',
      `${kpis.transactionVolume.toLocaleString()}건`,
      percent(latest.transactionChangeRate),
    ],
    [
      '총 저축액',
      `${kpis.totalSavings.toLocaleString()} 미소`,
      percent(latest.savingRate),
    ],
    [
      '평균 소비',
      `${latest.averageConsumption.toLocaleString()} 미소`,
      '주간 기준',
    ],
    [
      '주간 거래량',
      `${latest.weeklyTransactionVolume.toLocaleString()}건`,
      '최근 측정',
    ],
    [
      '저축률',
      percent(latest.savingRate),
      `빈부격차 ${latest.wealthGap.toFixed(2)}`,
    ],
  ];

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <PageHeader
        badgeText="6학년 4반"
        title="학급 경제 대시보드"
        subtitle="교사"
      />
      <section
        className={`relative mb-4 overflow-hidden rounded-2xl p-6 text-white ${isNormal ? 'bg-hero-card' : 'bg-gradient-to-r from-[#ff6868] to-[#ffae91]'}`}
      >
        <p className="mb-2 text-xs text-white/85">학급 경제 대시보드</p>
        <h1 className="text-2xl font-extrabold">
          현재 우리반 경제상황은
          <br />
          <span
            className={`mt-2 inline-block rounded-lg bg-white px-3 py-1 text-lg ${isNormal ? 'text-[#0b654b]' : 'text-red-500'}`}
          >
            {statusName[status] ?? status}
          </span>{' '}
          입니다
        </h1>
        <p className="mt-3 max-w-xl text-xs leading-5 text-white/90">
          {analysis?.summary ??
            '최신 경제지표를 바탕으로 학급 경제상태를 모니터링하고 있습니다.'}
        </p>
        <div className="absolute right-5 top-4 hidden text-right sm:block">
          <span
            className={`rounded-lg bg-white px-3 py-1 text-xs font-bold ${isNormal ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {isNormal ? '상태 정상' : '상태 비정상'}
          </span>
          <Image
            src="/images/characters/sprout.svg"
            alt="SEED 캐릭터"
            width={145}
            height={100}
            className="mt-2 h-24 w-36 object-contain"
          />
        </div>
      </section>
      <Card className="relative mb-2 overflow-hidden p-5">
        <p className="font-extrabold">
          총 통화량{' '}
          <span className="ml-2 text-xs font-semibold text-emerald-500">
            최근 측정
          </span>
        </p>
        <Badge variant="green-pill" className="mt-3 px-4 py-1.5 font-bold">
          {kpis.moneySupply.toLocaleString()} 미소
        </Badge>
        <p className="mt-2 text-xs text-gray-400">
          학생 평균 보유액 {kpis.averageBalance.toLocaleString()} 미소
        </p>
        <BottomGardenGraphic className="absolute bottom-0 right-2 h-20 w-52" />
      </Card>
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(([label, value, change]) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between">
              <b className="text-sm">{label}</b>
              <span className="text-[11px] text-emerald-500">{change}</span>
            </div>
            <Badge variant="green-pill" className="mt-3">
              {value}
            </Badge>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-extrabold">학생 경제 현황 요약</h2>
          <span className="text-xs text-gray-400">총 {students.length}명</span>
        </div>
        <div className="grid gap-x-8 md:grid-cols-2">
          {students.slice(0, 10).map((student) => (
            <div
              key={student.studentId}
              className="flex items-center justify-between border-b border-gray-100 py-2.5 text-sm"
            >
              <span>
                <b>{student.name}</b>
                <span className="ml-2 rounded-md bg-sky-50 px-2 py-1 text-xs text-sky-600">
                  {student.jobName}
                </span>
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-400">
                {student.creditGrade}등급{' '}
                <Badge variant="green-pill">
                  {student.balance.toLocaleString()} 미소
                </Badge>
              </span>
            </div>
          ))}
        </div>
        {students.length > 10 && (
          <p className="mt-3 text-right text-xs text-gray-400">
            외 {students.length - 10}명
          </p>
        )}
      </Card>
      <Link href="/teacher/policy" className="mt-4 block">
        <Button fullWidth>학급 경제 분석 및 정책 제안 보기</Button>
      </Link>
    </div>
  );
}

function StateMessage({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-sm text-gray-500">
      <p>{children}</p>
      {action && (
        <Button variant="outline" onClick={action}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
