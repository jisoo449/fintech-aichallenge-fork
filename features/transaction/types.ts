export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionResponse = {
  id: number | string;
  accountId: string;
  occurredAt: string;
  type: TransactionType | string;
  description: string;
  amount: number;
  balanceAfter?: number;
};

export type TransactionPageResponse = {
  items: TransactionResponse[];
  page: number;
  size: number;
  totalCount: number;
};

export type GetTransactionsParams = {
  from?: string;
  to?: string;
  type?: TransactionType | string;
  accountId?: string;
  page?: number;
  size?: number;
};