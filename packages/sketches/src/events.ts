import { FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { EVENT_ROUTE_CHANGED } from "@thi.ng/router/api";
import { setIn } from '@thi.ng/paths';

import { Handlers } from './api';

export enum ev {
  ROUTE_TO,
  SET_RAF,
  SET_PARAM,
};

export enum fx {
  ROUTE_TO = '1'
};

export const handlers: Handlers = {
  events: {
    [EVENT_ROUTE_CHANGED]: valueSetter("route"),
    [ev.ROUTE_TO]: (_, [__, route]) => ({ [fx.ROUTE_TO]: route }),

    [ev.SET_RAF]: valueSetter('raf'),
    [ev.SET_PARAM]: (state, [_, [sketch, name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', sketch, name], v)
    })
  },

  effects: {
  }
};