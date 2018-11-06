import { IObjectOf } from "@thi.ng/api/api";
import { EventDef, EffectDef } from "@thi.ng/interceptors/api";
import { forwardSideFx, valueSetter, trace } from "@thi.ng/interceptors/interceptors";

export const ev: IObjectOf<string> = {
  ALERT: 'alert',
  SET_VALUE: 'set-value',
  SET_CHECKED: 'set-checked',
};

export const fx: IObjectOf<string> = {
  ALERT: 'alert',
  ROUTE_TO: 'route-to',
};

type Handlers = {
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
}

export const handlers: Handlers = {
  events: {
    [ev.ALERT]: forwardSideFx(fx.ALERT),
    [ev.SET_VALUE]: valueSetter('value'),
    [ev.SET_CHECKED]: [trace, valueSetter('checked')]
  },

  effects: {
    [fx.ALERT]: (msg) => alert(msg),

    // [fx.LOAD_MODULE]: ({ load, init }, bus) =>
    //   load()
    //     .then(m => bus.dispatch([ev.SETUP_MODULE, [init, m]]))
    //     .catch(e => bus.dispatch([ev.ERROR, e]))
  }
};