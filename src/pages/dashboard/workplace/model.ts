import type { Effect, Reducer } from '@oula/oula';
import type { ActivitiesType, NoticeType } from './data.d';
import { fakeChartData, queryActivities, queryProjectNotice } from './service';

export interface ModalState {
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchProjectNotice: Effect;
    fetchActivitiesList: Effect;
  };
}

const Model: ModelType = {
  namespace: 'dashboard',
  state: {
    projectNotice: [],
    activities: [],
  },
  effects: {
    *init(_, { put }) {
      yield put({ type: 'fetchUserCurrent' });
      yield put({ type: 'fetchProjectNotice' });
      yield put({ type: 'fetchActivitiesList' });
    },
    *fetchProjectNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response?.notice) ? response.notice : [],
        },
      });
    },
    *fetchActivitiesList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response?.activities)
            ? response.activities
            : [],
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        projectNotice: [],
        activities: [],
      };
    },
  },
};

export default Model;
