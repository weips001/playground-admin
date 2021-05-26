import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/payRecord', {
    params,
  });
}

export async function remove(deleteArr: string[]) {
  return request('/api/payRecord', {
    method: 'delete',
    data: {
      deleteArr
    },
  });
}

export async function removeAll() {
  return request('/api/payRecord/removeAll', {
    method: 'delete'
  });
}

export async function add(data: TableListItem) {
  return request('/api/payRecord', {
    method: 'POST',
    data,
  });
}

export async function update(data: TableListParams) {
  return request(`/api/payRecord/${data.id}`, {
    method: 'PUT',
    data,
  });
}
