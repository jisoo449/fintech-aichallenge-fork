'use client';

import { useState } from 'react';

interface ActivityLineChartProps {
  income?: number;
  expense?: number;
  totalAssets?: number;
  period?: string;
}

export default function ActivityLineChart({
  income = 4800,
  expense = 1200,
  period = '8월',
}: ActivityLineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 주차별 활동 추이 데이터 (수입/저축 흐름 기반)
  const netGrowth = Math.max(income - expense, 1500);
  const points = [
    { week: '1주차', value: Math.round(netGrowth * 0.25), label: '활동 시작' },
    { week: '2주차', value: Math.round(netGrowth * 0.45), label: '소비 조절' },
    { week: '3주차', value: Math.round(netGrowth * 0.72), label: '급여 수령' },
    { week: '4주차', value: netGrowth, label: '목표 저축' },
  ];

  // SVG 좌표 계산 (너비 360, 높이 90)
  const width = 360;
  const height = 90;
  const paddingX = 28;
  const paddingTop = 18;
  const paddingBottom = 22;

  const minVal = Math.min(...points.map((p) => p.value)) * 0.8;
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.15;
  const range = maxVal - minVal || 1;

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingBottom -
      ((p.value - minVal) / range) * (height - paddingTop - paddingBottom);
    return { ...p, x, y };
  });

  // 부드러운 Bezier 곡선 생성
  const linePath = coords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${
    height - paddingBottom + 6
  } L ${coords[0].x} ${height - paddingBottom + 6} Z`;

  return (
    <div className="relative w-full rounded-2xl bg-[#F6FAF7] border border-[#35C884]/25 p-3.5 select-none transition-all">
      {/* 상단 요약 바 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#35C884] animate-pulse" />
          <span className="text-xs font-extrabold text-gray-800">
            {period} 자산 성장 곡선
          </span>
        </div>
        <span className="rounded-full bg-emerald-100/90 border border-emerald-300/40 px-2 py-0.5 text-[10px] font-bold text-[#0B654B]">
          +{netGrowth.toLocaleString()} 미소 상승
        </span>
      </div>

      {/* SVG 라인 차트 영역 */}
      <div className="relative h-24 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="activityGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#35C884" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#35C884" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#35C884" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#35C884"
                floodOpacity="0.35"
              />
            </filter>
          </defs>

          {/* 배경 격자선 */}
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#E2EDE6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* 그라디언트 영역 */}
          <path d={areaPath} fill="url(#activityGradient)" />

          {/* 메인 라인 */}
          <path
            d={linePath}
            fill="none"
            stroke="#2EB374"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* 포인트 점들 */}
          {coords.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const isLast = idx === coords.length - 1;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* 터치/호버 타겟 영역 확장 */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                {/* 마지막 포인트 펄스 효과 */}
                {isLast && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="#35C884"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* 중심 원 */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#2EB374"
                  strokeWidth={isHovered ? '3' : '2.5'}
                  className="transition-all duration-150"
                />

                {/* X축 라벨 */}
                <text
                  x={pt.x}
                  y={height - 4}
                  textAnchor="middle"
                  className={`text-[10px] font-bold ${
                    isHovered
                      ? 'fill-[#0B654B] font-extrabold'
                      : 'fill-gray-400'
                  }`}
                >
                  {pt.week}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 인터랙티브 툴팁 */}
        {hoveredIdx !== null && (
          <div
            className="pointer-events-none absolute -top-3 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-gray-900/90 px-2 py-1 text-center text-[10px] font-bold text-white shadow-lg backdrop-blur-xs transition-all duration-150 animate-in fade-in zoom-in-90"
            style={{
              left: `${(coords[hoveredIdx].x / width) * 100}%`,
            }}
          >
            <span className="block text-[#70EEB0]">
              {coords[hoveredIdx].label}
            </span>
            <span>+{coords[hoveredIdx].value.toLocaleString()} 미소</span>
          </div>
        )}
      </div>
    </div>
  );
}
