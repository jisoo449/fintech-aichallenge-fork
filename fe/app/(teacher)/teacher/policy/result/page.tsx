'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';
import { CoinStackGraphic } from '@/components/common/FigmaGraphics';
import type { PolicyStateSnapshot } from '@/features/teacher/types';
import { useTeacherStore } from '@/stores/useTeacherStore';

const statusName: Record<string, string> = {
  CONTRACTION: '수축 국면',
  EXPANSION: '확장 국면',
  STABLE: '안정 국면',
  INFLATION: '물가 상승 국면',
  DEFLATION: '물가 하락 국면',
};

function formatSimulationChange(change: string) {
  return change
    .replace(/경제\s*상태가/g, '경제 상황이')
    .replace(
      /\b(CONTRACTION|EXPANSION|STABLE|INFLATION|DEFLATION)\b(으?로)?/g,
      (_, status: string, particle: string | undefined) =>
        `${statusName[status]}${particle ? '으로' : ''}`,
    )
    .replace(/-?\d+\.\d+/g, (value) => Number(value).toFixed(2));
}

export default function PolicyResultPage() {
  const { selectedProposal, simulation, resetPolicy } = useTeacherStore();
  if (!selectedProposal || !simulation)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-sm text-gray-500">
        <p>표시할 정책 시뮬레이션 결과가 없습니다.</p>
        <Link href="/teacher/policy">
          <Button>정책 선택으로 이동</Button>
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <PageHeader badgeText="6학년 4반" title="대시보드" subtitle="교사" />
      <Card className="mb-3 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CoinStackGraphic className="h-24 w-24" />
            <div>
              <p className="text-xs text-gray-500">
                정책 적용 전 시뮬레이션 결과
              </p>
              <h1 className="mt-2 text-xl font-extrabold">
                선택한 정책은
                <br />
                <span className="mt-2 inline-block rounded-lg bg-emerald-500 px-3 py-1 text-base text-white">
                  {selectedProposal.title}
                </span>{' '}
                입니다
              </h1>
              <p className="mt-3 text-xs text-gray-500">
                {selectedProposal.description}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="rounded-lg bg-gray-700 px-3 py-1 text-xs font-bold text-white">
              시뮬레이션 완료
            </span>
            <Image
              src="/images/characters/sprout.svg"
              alt="SEED 캐릭터"
              width={120}
              height={90}
              className="mt-2 h-20 w-28 object-contain"
            />
          </div>
        </div>
      </Card>
      <div className="mb-3 grid gap-3 md:grid-cols-2">
        <Snapshot title="적용 전" data={simulation.before} />
        <Snapshot title="적용 후" data={simulation.after} />
      </div>
      <Card className="mb-3 p-5">
        <h2 className="font-extrabold">경제 상황이</h2>
        <p className="mt-3 text-lg font-bold">
          <Badge
            variant={
              simulation.before.economicStatus === 'STABLE' ||
              simulation.before.economicStatus === 'EXPANSION'
                ? 'green-pill'
                : 'danger-pill'
            }
          >
            {statusName[simulation.before.economicStatus] ??
              simulation.before.economicStatus}
          </Badge>
          <span className="mx-2">에서</span>
          <Badge
            variant={
              simulation.after.economicStatus === 'STABLE' ||
              simulation.after.economicStatus === 'EXPANSION'
                ? 'green-pill'
                : 'danger-pill'
            }
          >
            {statusName[simulation.after.economicStatus] ??
              simulation.after.economicStatus}
          </Badge>
          <span className="ml-2">
            {simulation.before.economicStatus ===
            simulation.after.economicStatus
              ? '으로 유지될 것으로 예측됩니다.'
              : '으로 변화할 것으로 예측됩니다.'}
          </span>
        </p>
      </Card>
      <Card className="mb-4 p-5">
        <h2 className="mb-4 font-extrabold">
          AI 시뮬레이션 주요 변화 요약입니다
        </h2>
        <div className="flex flex-wrap gap-2">
          {simulation.changes.map((change) => (
            <span
              key={change}
              className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
            >
              {formatSimulationChange(change)}
            </span>
          ))}
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/teacher/policy" onClick={resetPolicy}>
          <Button variant="outline" fullWidth>
            다른 정책 비교
          </Button>
        </Link>
        <Link href="/teacher/dashboard">
          <Button fullWidth>학급 경제 대시보드로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}

function Snapshot({
  title,
  data,
}: {
  title: string;
  data: PolicyStateSnapshot;
}) {
  const rows = [
    ['총 통화량', `${data.moneySupply.toLocaleString()} 미소`],
    ['총 소비액', `${data.totalConsumption.toLocaleString()} 미소`],
    [
      '물가 상승률',
      data.inflationRate == null ? '0%' : `${data.inflationRate.toFixed(2)}%`,
    ],
    [
      '소비 증가율',
      data.consumptionGrowthRate == null
        ? '0%'
        : `${data.consumptionGrowthRate.toFixed(2)}%`,
    ],
  ];
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-extrabold">{title}</h2>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between border-b border-gray-100 py-2.5 text-sm"
        >
          <span className="text-gray-500">• {label}</span>
          <Badge variant="green-pill">{value}</Badge>
        </div>
      ))}
    </Card>
  );
}
