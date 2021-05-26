import type { Effect } from 'umi';
import { message } from 'antd';
import {  edit, remove } from './service'

export type StateType = {
  tableList: any[]
};

export type RecordModelType = {
  namespace: 'payRecord';
  state: StateType;
  effects: {
    edit: Effect;
    remove: Effect
  };
  reducers: {};
};
const state = {
  tableList: [],
}
const Model: RecordModelType = {
  namespace: 'payRecord',
  state,
  effects: {
    *edit({ payload }, { call }) {
      const { msg } = yield call(edit, payload);
      message.success(msg)
    },
    *remove({ payload }, { call }) {
      const { msg } = yield call(remove, payload.id);
      message.success(msg)
    },
  },

  reducers: {},
};

export default Model;
