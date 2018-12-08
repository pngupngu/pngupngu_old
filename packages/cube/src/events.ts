import { IObjectOf } from "@thi.ng/api/api";
import { EventDef, EffectDef, FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

export enum ev {
  SET_RAF,
  SET_PARAM,
  SET_ORIENTATION,
  SET_ANGLE,
};

export enum fx {
};

type Handlers = {
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
}

export const handlers: Handlers = {
  events: {
    [ev.SET_RAF]: valueSetter('raf'),
    [ev.SET_ORIENTATION]: valueSetter('orientation'),
    [ev.SET_ANGLE]: valueSetter('angle'),
    [ev.SET_PARAM]: (state, [_, [name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', name], v)
    })
  },

  effects: {
  }
};