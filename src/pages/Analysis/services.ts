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

export async function getYearData(data:any) {
  return request('/aaa/getFinanceByYear', {
    method: 'POST',
    data
  })
}

export async function getFinanceByDate(data:any) {
  // endDate: "2021-12-19" 
  // startDate: "2021-12-01"
  return request(`/aaa/getFinanceByDate`, {
    method: 'POST',
    data,
  });
}