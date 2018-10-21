import { IObjectOf } from "@thi.ng/api/api";
import { EventDef, EffectDef, FX_STATE } from "@thi.ng/interceptors/api";
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

  SET_VALUE: 'set-value',
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

    [ev.LOAD_MODULE]: (state, [__, mod]) => ({
      [fx.LOAD_MODULE]: mod.value || mod,
      [FX_STATE]: mod.value ? mod.init(state, mod.value) : null
    }),

    [ev.UNLOAD_MODULE]: (state, [_, { release }]) => release(state),

    [ev.SETUP_MODULE]: (state, [_, [init, val]]) => init(state, val),

    [ev.SET_VALUE]: valueSetter('value'),
  },

  effects: {
    [fx.ALERT]: (msg) => alert(msg),

    [fx.LOAD_MODULE]: ({ load, init }, bus) =>
      load()
        .then(m => bus.dispatch([ev.SETUP_MODULE, [init, m]]))
        .catch(e => bus.dispatch([ev.ERROR, e]))
  }
};