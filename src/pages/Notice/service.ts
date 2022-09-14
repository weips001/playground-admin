import request from '@/utils/request';
import React from 'react';
import type { TableListParams, TableListItem } from './data.d';

export async function getTableList(params?: TableListParams) {
  return request('/api/getSendMsgList', {
    params,
  });
}

export async function sendMsg(ids: React.Key[]) {
  return request(`/api/sendMsgByIds`, {
    method: 'POST',
    data: {
      ids
    }
  });
}

export async function add(data: TableListItem) {
  return request('/api/vip', {
    method: 'POST',
    data,
  });
}

export async function remove(id: string) {
  return request(`/api/sendMsg/${id}`, {
    method: 'delete',
  });
}

export async function update(data: TableListParams) {
  return request(`/api/vip/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function syncUserInfo() {
  return request(`/api/syncUserInfo`, {
    method: 'GET',
  });
}
