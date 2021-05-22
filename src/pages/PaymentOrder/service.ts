import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/paymentOrder', {
    params,
  });
}

export async function remove(deleteArr: string[]) {
  return request('/api/paymentOrder', {
    method: 'delete',
    data: {
      deleteArr
    },
  });
}

export async function getItemDetail(id: string) {
  return request(`/api/paymentOrder/${id}`, {
    method: 'get'
  });
}

export async function add(data: TableListItem) {
  return request('/api/paymentOrder', {
    method: 'POST',
    data,
  });
}

export async function update(data: TableListParams) {
  return request(`/api/paymentOrder/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function submit(id: string) {
  return request('/api/paymentOrder/submit', {
    method: 'POST',
    data: {
      id
    },
  });
}
