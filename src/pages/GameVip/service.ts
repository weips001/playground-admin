import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/gameBi', {
    params,
  });
}

export async function remove(id: string) {
  return request(`/api/gameBi/${id}`, {
    method: 'delete',
  });
}

export async function add(data: TableListItem) {
  return request('/api/gameBi', {
    method: 'POST',
    data,
  });
}

export async function reduceGameBi(data: TableListParams) {
  return request(`/api/reduceGameBi/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function update(data: TableListParams) {
  return request(`/api/gameBi/${data.id}`, {
    method: 'PUT',
    data,
  });
}
