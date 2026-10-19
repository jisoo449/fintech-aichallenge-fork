import { apiFetch } from '@/lib/api/fetcher';
import type {
  GetTransactionsParams,
  TransactionPageResponse,
  TransactionResponse,
} from './types';

export async function getTransactions(
  params: GetTransactionsParams = {}
): Promise<TransactionPageResponse> {
  const query = new URLSearchParams();

  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.type) query.set('type', params.type);
  if (params.accountId) query.set('accountId', params.accountId);

  // page는 1부터 시작 (백엔드 스펙)
  const page = params.page && params.page > 0 ? params.page : 1;
  const size = params.size && params.size > 0 ? params.size : 20;

  query.set('page', String(page));
  query.set('size', String(size));

  const queryString = query.toString();
  const url = `/api/v1/transactions${queryString ? `?${queryString}` : ''}`;

  const data = await apiFetch<unknown>(url);

  if (Array.isArray(data)) {
    return {
      items: data as TransactionResponse[],
      page,
      size,
      totalCount: data.length,
    };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;

    // 백엔드 표준 규격 { items: [...], page: 1, size: 20, totalCount: 24 }
    if (Array.isArray(obj.items)) {
      return {
        items: obj.items as TransactionResponse[],
        page: (obj.page as number) ?? page,
        size: (obj.size as number) ?? size,
        totalCount: (obj.totalCount as number) ?? (obj.items as unknown[]).length,
      };
    }

    // Spring Data Page 규격 { content: [...], number: 0, size: 20, totalElements: 24 }
    if (Array.isArray(obj.content)) {
      return {
        items: obj.content as TransactionResponse[],
        page: ((obj.number as number) ?? 0) + 1,
        size: (obj.size as number) ?? size,
        totalCount: (obj.totalElements as number) ?? obj.content.length,
      };
    }
  }

  return {
    items: [],
    page,
    size,
    totalCount: 0,
  };
}