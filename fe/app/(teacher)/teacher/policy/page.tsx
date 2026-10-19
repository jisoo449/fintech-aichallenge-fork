'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import { CoinStackGraphic } from '@/components/common/FigmaGraphics';
import {
  useCreateEconomicAnalysis,
  useLatestEconomicAnalysis,
  usePolicyProposals,
} from '@/features/teacher/hooks/useEconomicAnalysis';
import { usePolicySimulation } from '@/features/teacher/hooks/usePolicyMutations';
import { useTeacherStore } from '@/stores/useTeacherStore';

const CLASSROOM_ID = 1;
const statusName: Record<string, string> = {
  CONTRACTION: '경기 위축',
  EXPANSION: '경기 활성',
  STABLE: '정상',
  INFLATION: '인플레이션',
  DEFLATION: '디플레이션',
};
const statusColor: Record<string, string> = {
  CONTRACTION: 'bg-red-500',
  EXPANSION: 'bg-emerald-500',
  STABLE: 'bg-emerald-500',
  INFLATION: 'bg-red-500',
  DEFLATION: 'bg-red-500',
};

export default function TeacherPolicyPage() {
  const router = useRouter();
  const latest = useLatestEconomicAnalysis(CLASSROOM_ID);
  const createAnalysis = useCreateEconomicAnalysis(CLASSROOM_ID);
  const proposals = usePolicyProposals(CLASSROOM_ID);
  const simulate = usePolicySimulation(CLASSROOM_ID);
  const { selectedProposal, setSelectedProposal, setSimulation } =
    useTeacherStore();
  const analysis = createAnalysis.data ?? latest.data;

  useEffect(() => {
    if (!selectedProposal && proposals.data?.[0])
      setSelectedProposal(proposals.data[0]);
  }, [proposals.data, selectedProposal, setSelectedProposal]);

  const runSimulation = async () => {
    if (!selectedProposal) return;
    const result = await simulate.mutateAsync({
      proposalId: selectedProposal.proposalId,
      parameters: { incomeTaxRate: 0 },
    });
    setSimulation(result);
    router.push('/teacher/policy/result');
  };

  if (latest.isLoading || proposals.isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        경제 분석을 불러오는 중입니다...
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <PageHeader badgeText="6학년 4반" title="대시보드" subtitle="교사" />
      <Card className="mb-3 p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <CoinStackGraphic className="h-24 w-24 shrink-0" />
            <div>
              <p className="mb-2 text-xs text-gray-500">AI 학급 경제 분석</p>
              <h1 className="text-xl font-extrabold">
                인공지능 거시 경제 상태 판정 결과
                <br />
                <span
                  className={`mt-2 inline-block rounded-lg px-3 py-1 text-base text-white ${statusColor[analysis?.economicStatus ?? ''] ?? 'bg-gray-500'}`}
                >
                  {statusName[analysis?.economicStatus ?? ''] ??
                    analysis?.economicStatus ??
                    '분석 전'}
                </span>{' '}
                입니다
              </h1>
              <p className="mt-3 text-xs leading-5 text-gray-500">
                {analysis?.summary ??
                  '분석 생성 버튼을 눌러 최신 경제지표를 분석해 보세요.'}
              </p>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <span className="rounded-lg bg-gray-700 px-3 py-1 text-xs font-bold text-white">
              {analysis?.economicStatus === 'STABLE' ||
              analysis?.economicStatus === 'EXPANSION'
                ? '양호'
                : analysis?.economicStatus &&
                    statusColor[analysis.economicStatus]
                  ? '주의 요함'
                  : '분석 확인 필요'}
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
        <Card className="p-5">
          <h2 className="mb-4 font-extrabold">주요 원인</h2>
          <div className="flex flex-wrap gap-2">
            {(analysis?.mainFactors ?? ['최신 분석을 생성해 주세요.']).map(
              (factor) => (
                <span
                  key={factor}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500"
                >
                  {factor.replace(/(-?\d+(?:\.\d+)?)(?:\s*%)?/g, (_, value) =>
                    `${Number(value).toFixed(2)}%`,
                  )}
                </span>
              ),
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-2 font-extrabold">SEED AI의 분석을 확인해보세요</h2>
          <p className="text-xs leading-5 text-gray-500">
            최신 경제지표를 기반으로 소비와 거래 흐름, 저축률 및 빈부격차를
            분석합니다.
          </p>
          <Button
            variant="outline"
            className="mt-3 text-xs"
            disabled={createAnalysis.isPending}
            onClick={() => createAnalysis.mutate()}
          >
            {createAnalysis.isPending ? '분석 중...' : '최신 분석 다시 생성'}
          </Button>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="mb-4 font-extrabold">Seed가 제안하는 정책 제안입니다</h2>
        {proposals.isError && (
          <p className="text-sm text-red-500">
            정책 제안을 불러오지 못했습니다.
          </p>
        )}
        <div className="space-y-3">
          {proposals.data?.map((proposal) => {
            const active = selectedProposal?.proposalId === proposal.proposalId;
            return (
              <button
                type="button"
                key={proposal.proposalId}
                onClick={() => setSelectedProposal(proposal)}
                className={`w-full rounded-xl p-4 text-left transition ${active ? 'border border-emerald-400 bg-emerald-50' : 'border border-gray-100 bg-gray-50 hover:border-emerald-200'}`}
              >
                <div className="flex justify-between gap-3">
                  <b>{proposal.title}</b>
                  <span className="text-xs font-semibold text-emerald-600">
                    {proposal.purpose}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {proposal.description}
                </p>
              </button>
            );
          })}
        </div>
      </Card>
      {simulate.isError && (
        <p className="mt-3 text-center text-sm text-red-500">
          시뮬레이션에 실패했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push('/teacher/dashboard')}
        >
          정책 미적용
        </Button>
        <Button
          fullWidth
          disabled={!selectedProposal || simulate.isPending}
          onClick={() => void runSimulation()}
        >
          {simulate.isPending ? '시뮬레이션 중...' : '선택 정책 시뮬레이션'}
        </Button>
      </div>
    </div>
  );
}
