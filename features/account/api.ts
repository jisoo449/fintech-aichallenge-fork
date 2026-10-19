import { apiFetch } from '@/lib/api/fetcher';
import type { AccountResponse } from './types';

export async function getAccounts(): Promise<AccountResponse[]> {
  const data = await apiFetch<unknown>('/api/v1/accounts');
  if (Array.isArray(data)) {
    return data as AccountResponse[];
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.accounts)) {
      return obj.accounts as AccountResponse[];
    }
    if (Array.isArray(obj.content)) {
      return obj.content as AccountResponse[];
    }
  }
  return [];
}