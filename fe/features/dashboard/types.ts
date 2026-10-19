export type DashboardCredit = {
  score: number;
  grade: string | number;
  percentile?: number;
};

export type DashboardRecentTransaction = {
  id: string | number;
  occurredAt: string;
  type?: string;
  category?: string;
  description: string;
  amount: number;
  balanceAfter?: number;
};

export type StudentDashboardResponse = {
  period: string;
  job: string | { id?: string; name: string };
  incomeThisMonth: number;
  expenseThisMonth: number;
  totalAssets: number;
  savingsBalance: number;
  savingsRate: number;
  credit: DashboardCredit;
  recentTransactions: DashboardRecentTransaction[];
  notices?: unknown[];
};