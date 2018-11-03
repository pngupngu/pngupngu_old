import { IObjectOf } from "@thi.ng/api/api";
import { EventDef, EffectDef, FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

export const ev: IObjectOf<string> = {
  SET_RAF: 'set-raf',
  SET_PARAM: 'set-param',
};

export const fx: IObjectOf<string> = {
};

type Handlers = {
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
}

export const handlers: Handlers = {
  events: {
    [ev.SET_RAF]: valueSetter('raf'),
    [ev.SET_PARAM]: (state, [_, [name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', name], v)
    })
  },

  effects: {
  }
};