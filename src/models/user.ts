import type { Effect, Reducer } from 'umi';
import {SubscriptionsMapObject} from 'dva'
import {getUserAuth,getCurrentAllAuth,saveUserInfo} from '@/utils/utils'
import {setAuthority} from '@/utils/authority'
import { queryCurrent, query as queryUsers } from '@/services/user';

export type CurrentUser = {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
};

export type UserModelState = {
  currentUser?: CurrentUser;
  currentAllAuthList: any[]
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
  subscriptions: SubscriptionsMapObject
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    currentAllAuthList: []
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      const {auth = [], data = {}} = response
      const userInfo = {
        ...data,
        auth
      }
      saveUserInfo(userInfo)
      const allAuth = getUserAuth(data.role, auth)
      const currentAuthList = getCurrentAllAuth()
      setAuthority(allAuth)
      yield put({
        type: 'saveCurrentUser',
        payload: userInfo,
      });
      yield put({
        type: 'saveCurrentAuthList',
        payload: currentAuthList,
      });
    },
  },

  reducers: {
    saveCurrentAuthList(state, action) {
      return {
        ...state,
        currentAllAuthList: action.payload
      }
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
  subscriptions: {
    init({dispatch}) {
      console.log('in')
    }
  }
};

export default UserModel;
