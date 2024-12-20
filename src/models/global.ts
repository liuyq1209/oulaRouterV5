import type { Reducer, ImmerReducer, Effect } from '@oula/oula';

export type GlobalModelState = {
  collapsed: boolean;
};

export type GlobalModelType = {
  namespace: 'global';
  state: GlobalModelState;
  effects: Record<string, Effect>;
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    demoReducer: ImmerReducer<GlobalModelState>;
  };
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {},

  reducers: {
    changeLayoutCollapsed(
      state = { collapsed: true },
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    demoReducer(state): GlobalModelState {
      return {
        ...state,
      };
    },
  },
};

export default GlobalModel;
