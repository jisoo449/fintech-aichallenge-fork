export type CreditReportFactor = {
  type: string;
  label: string;
  impact?: string;
  content?: string;
  expectedEffect?: string;
};

export type BehaviorMetric = {
  key: string;
  label: string;
  value: number | string;
};

export type FinancialSummaryItem = {
  label: string;
  amount: number;
  type: 'INCOME' | 'DEDUCTION' | 'EXPENSE' | 'SAVINGS' | 'BALANCE';
  badgeText: string;
};

export type CreditReportFeatures = {
  homework_rate?: number;
  spending_trend?: number;
  attendance_rate?: number;
  [key: string]: number | undefined;
};

export type CreditReportResponse = {
  creditScore?: number;
  score?: number;
  credit?: { score?: number; grade?: string | number };
  grade?: string | number;
  creditGrade?: string | number;
  summary?: string;
  content?: string;
  expectedEffect?: string;
  features?: CreditReportFeatures;
  generatedAt?: string;
  yearMonth?: string;
  maxScore?: number;
  factors?: CreditReportFactor[];
  behaviorMetrics?: BehaviorMetric[];
  // 우리반 경제생활 핵심 지표
  monthlySalary?: number;
  totalExpense?: number;
  totalSavings?: number;
  balance?: number;
  totalAssets?: number;
  assetChange?: number;
  summaryItems?: FinancialSummaryItem[];
};

export type CreditScoreResponse = {
  score: number;
  grade: string | number;
};