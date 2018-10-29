import { IObjectOf } from "@thi.ng/api/api";
import { getIn, setIn } from '@thi.ng/paths';
import { EventDef, EffectDef, FX_DISPATCH_NOW, FX_STATE } from "@thi.ng/interceptors/api";
import { forwardSideFx, trace, valueSetter } from "@thi.ng/interceptors/interceptors";

export const ev: IObjectOf<string> = {
  ALERT: 'alert',
  COUNT: 'count',
  ERROR: 'error',
  ROUTE_TO: 'route-to',

  SET_RAF: 'set-raf',

  LOAD_MODULE: 'load-module',
  UNLOAD_MODULE: 'unload-module',
  SETUP_MODULE: 'loaded-module',

  SET_PRESET: 'set-preset',
  SET_PARAMS: 'set-params',
  SET_PARAM: 'set-param',
};

export const fx: IObjectOf<string> = {
  ALERT: 'alert',
  ROUTE_TO: 'route-to',
  LOAD_MODULE: 'load-module',
};

type Handlers = {
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
}

export const handlers: Handlers = {
  events: {
    [ev.ALERT]: [trace, forwardSideFx(fx.ALERT)],

    [ev.SET_RAF]: valueSetter('raf'),

    [ev.LOAD_MODULE]: forwardSideFx(fx.LOAD_MODULE),

    [ev.UNLOAD_MODULE]: (state, [_, { release }]) => release(state),

    [ev.SETUP_MODULE]: (state, [_, [init, val]]) => init(state, val),

    [ev.SET_PRESET]: (state, [_, preset]) => ({
      [FX_DISPATCH_NOW]: [ev.SET_PARAMS, getIn(state, ['app', 'presets', preset])]
    }),

    [ev.SET_PARAMS]: valueSetter('app.params'),

    [ev.SET_PARAM]: (state, [_, [name, value]]) => ({
      [FX_STATE]: setIn(state, ['app', 'params', name], value)
    })
  },

  effects: {
    [fx.ALERT]: (msg) => alert(msg),

    [fx.LOAD_MODULE]: ({ load, init }, bus) =>
      load()
        .then(m => bus.dispatch([ev.SETUP_MODULE, [init, m]]))
        .catch(e => bus.dispatch([ev.ERROR, e]))
  }
};