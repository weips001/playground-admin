import request from '@/utils/request';
// import type { TableListParams, TableListItem } from './data.d';

export async function getAllNum() {
  return request('/api/getNotNum');
}

export async function getTodayMoney() {
  return request('/api/getTodayMoney');
}

export async function getTodayNum() {
  return request('/api/getTodayNum');
}
