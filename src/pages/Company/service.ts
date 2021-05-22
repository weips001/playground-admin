import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/company', {
    params,
  });
}

export async function removeRule(deleteArr: string[]) {
  return request('/api/company', {
    method: 'delete',
    data: {
      deleteArr
    },
  });
}

export async function addRule(data: TableListItem) {
  return request('/api/company', {
    method: 'POST',
    data,
  });
}

export async function updateRule(data: TableListParams) {
  return request(`/api/company/${data.id}`, {
    method: 'PUT',
    data,
  });
}
