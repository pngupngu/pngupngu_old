import { FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

import { Handlers } from './api';

export enum ev {
  SET_RAF,
  SET_PARAM,
  SET_ORIENTATION,
};

export enum fx {
};

export const handlers: Handlers = {
  events: {
    [ev.SET_RAF]: valueSetter('raf'),
    [ev.SET_ORIENTATION]: valueSetter('orientation'),
    [ev.SET_PARAM]: (state, [_, [name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', name], v)
    })
  },

  effects: {
  }
};