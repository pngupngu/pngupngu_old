import { FX_STATE } from "@thi.ng/interceptors/api";
import { forwardSideFx, valueSetter, trace } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

import { Handlers } from './api';

export enum ev {
  ALERT,
  ROUTE_TO,
  SET_RAF,
  SET_VALUE,
  SET_CHECKED,
  SET_PARAM,
  SET_LOCATION,
};

export enum fx {
  ALERT = '1',
  ROUTE_TO = '2',
};

export const handlers: Handlers = {
  events: {
    [ev.SET_RAF]: valueSetter('raf'),
    [ev.ALERT]: forwardSideFx(fx.ALERT),
    [ev.SET_VALUE]: valueSetter('value'),
    [ev.SET_CHECKED]: [trace, valueSetter('checked')],
    [ev.SET_LOCATION]: valueSetter('location'),
    [ev.SET_PARAM]: (state, [_, [name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', name], v)
    })
  },

  effects: {
    [fx.ALERT]: (msg) => alert(msg),

    // [fx.LOAD_MODULE]: ({ load, init }, bus) =>
    //   load()
    //     .then(m => bus.dispatch([ev.SETUP_MODULE, [init, m]]))
    //     .catch(e => bus.dispatch([ev.ERROR, e]))
  }
};