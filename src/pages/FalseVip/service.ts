import request from '@/utils/request';
import type { TableListParams } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/falseVip', {
    params,
  });
}

export async function recoveryVip(id: string) {
  return request(`/api/recovery/${id}`);
}
