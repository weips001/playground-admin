import request from '@/utils/request';
import type { TableListParams, TableListItem } from './data';

export async function getTableList(params?: TableListParams) {
  return request('/aaa/finance', {
    params,
  });
}

export async function remove(id: string) {
  return request(`/aaa/finance/${id}`, {
    method: 'delete',
  });
}

export async function add(data: TableListItem) {
  return request('/aaa/finance', {
    method: 'POST',
    data,
  });
}

export async function update(data: any) {
  return request(`/aaa/finance/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function getFinanceByDate(data:any) {
  // endDate: "2021-12-19" 
  // startDate: "2021-12-01"
  return request(`/aaa/getFinanceByDate`, {
    method: 'POST',
    data,
  });
}

