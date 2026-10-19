export type PayrollItem = {
  name: string;
  amount: number;
};

export type Payroll = {
  yearMonth: string;
  jobName: string;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  grossPay: number;
  totalDeductions: number;
};