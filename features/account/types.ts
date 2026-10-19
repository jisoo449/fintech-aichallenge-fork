export type AccountResponse = {
  accountId: string;
  accountName: string;
  accountNumber?: string;
  accountType: string;
  balance: number;
  status?: string;
};