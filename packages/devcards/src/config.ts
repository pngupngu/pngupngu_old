import { vals } from '@thi.ng/transducers/iter/vals';
import { EVENT_ROUTE_CHANGED } from "@thi.ng/router/api";
import { FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

import {
  root, panel, select, button, slider, checkbox,
  multiSlider3, multiSlider4,
  addClass
} from '@pngu/ui/styles';
import { defaultParams as pbrParams } from '@pngu/sketches/pbr';
import { defaultParams as wireParams } from '@pngu/sketches/wire';

import { Config, ev, fx } from './api';
import * as routes from './routes';

import { home } from './components/home';
import { pbr } from './components/pbr';
import { wire } from './components/wire';

export const CONFIG: Config = {

  router: {
    useFragment: true,
    defaultRouteID: routes.HOME.id,
    routes: [...vals(routes)]
  },

  events: {
    [EVENT_ROUTE_CHANGED]: valueSetter("route"),
    [ev.ROUTE_TO]: (_, [__, route]) => ({ [fx.ROUTE_TO]: route }),

    [ev.SET_RAF]: valueSetter('raf'),
    [ev.SET_PARAM]: (state, [_, [sketch, name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', sketch, name], v)
    })
  },

  effects: {
  },

  domRoot: 'app',

  components: {
    [routes.HOME.id]: home,
    [routes.WIRE.id]: wire,
    [routes.PBR.id]: pbr,
  },

  initialState: {
    raf: false,
    params: {
      wire: wireParams,
      pbr: pbrParams
    },
  },

  views: {
    raf: 'raf',
    route: 'route',
    params: 'params',
  },

  ui: {
    root, button, select, slider, checkbox,
    multiSlider3, multiSlider4,

    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },

    panel: addClass(panel, 'absolute w5', 'container'),

    cslider: addClass(slider, 'mr-2 ctrl', 'container'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};