export type SavingsSummaryResponse = {
  totalSavings: number;
  monthlySavings: number;
  averageSavings: number;
  savingsRate: number;
};

export type SavingsGoal = {
  id?: string;
  goalId?: string;
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  progressPercent?: number;
  period?: string;
};

export type MonthlySaving = {
  yearMonth: string;
  amount: number;
};

export type SavingsTrendsResponse = {
  trends: MonthlySaving[];
};

export type SavingsTransferRequest = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  goalId: string;
};

export type SavingsTransferResponse = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  fromAccountBalance: number;
  toAccountBalance: number;
};

export type SavingsRecommendation = {
  id: number;
  type: string;
  content: string;
  expectedEffect: string;
  isApplied: boolean;
};

export type SavingsRecommendationResponse = {
  recommendations: SavingsRecommendation[];
};