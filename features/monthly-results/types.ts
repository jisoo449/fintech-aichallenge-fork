export type FinancialSummaryItem = {
  label: string;
  amount: number;
  type: 'INCOME' | 'DEDUCTION' | 'EXPENSE' | 'SAVINGS' | 'BALANCE';
  badgeText: string;
};

export type MonthlyResultsResponse = {
  yearMonth: string;
  monthlySalary: number;
  totalExpense: number;
  totalSavings: number;
  balance: number;
  totalAssets: number;
  assetChange: number;
  summaryItems?: FinancialSummaryItem[];
};
