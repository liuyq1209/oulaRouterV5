import { GlobalModelState } from './global';
import type { StateType } from './login';

export { GlobalModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    login?: boolean;
  };
};

export type ConnectState = {
  loading: Loading;
  global: GlobalModelState;
  login: StateType;
};

export type Route = {
  routes?: Route[];
};
