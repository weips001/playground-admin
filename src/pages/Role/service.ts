import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/role', {
    params,
  });
}

export async function add(data?: TableListParams) {
  return request('/api/role', {
    data,
    method: 'POST',
  });
}

export async function edit(data?: TableListParams) {
  return request(`/api/role/${data.id}`, {
    data,
    method: 'PUT',
  });
}

export async function remove(id: string) {
  return request(`/api/role/${id}`, {
    method: 'DELETE',
  });
}
