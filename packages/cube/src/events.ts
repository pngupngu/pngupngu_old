import { IObjectOf } from "@thi.ng/api/api";
import { EventDef, EffectDef } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";

export const ev: IObjectOf<string> = {
  SET_RAF: 'set-raf',
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
  },

  effects: {
  }
};