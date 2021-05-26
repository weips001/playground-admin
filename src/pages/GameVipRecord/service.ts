import request from '@/utils/request';
import type { TableListParams } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/payList', {
    params,
  });
}
