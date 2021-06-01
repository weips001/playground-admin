import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/user', {
    params,
  });
}

export async function removeRule(id: string) {
  return request(`/api/user/${id}`, {
    method: 'delete'
  });
}

export async function addRule(data: TableListItem) {
  return request('/api/user', {
    method: 'POST',
    data,
  });
}

export async function updateRule(data: TableListParams) {
  return request(`/api/user/${data.id}`, {
    method: 'PUT',
    data,
  });
}
