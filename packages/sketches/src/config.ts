import {
  root, panel, select, button, slider, checkbox,
  multiSlider3, multiSlider4,
  addClass
} from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
import * as routes from './routes';

import { home } from './home';
import { pbr } from './pbr';
import { defaultParams as pbrParams } from './scenes/pbr'
import { wire } from './wire';
import { defaultParams as wireParams } from './scenes/wire'

export const CONFIG: AppConfig = {

  router: {
    useFragment: true,
    defaultRouteID: routes.HOME.id,
    routes: [
      routes.HOME,
      routes.WIRE,
      routes.PBR,
    ]
  },

  handlers,

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