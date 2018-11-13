import {
  root, panel, select, button, slider, checkbox,
  multiSlider,
  addClass
} from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
// import { cube } from './cube';
import { wire } from './wire';
import { defaultParams } from './scenes/pbr'

export const CONFIG: AppConfig = {

  events: handlers.events,
  effects: handlers.effects,

  domRoot: 'app',

  // rootComponent: cube,
  rootComponent: wire,

  initialState: {
    raf: false,
    params: defaultParams
  },

  views: {
    raf: 'raf',
    params: 'params'
  },

  ui: {
    root, button, select, slider, checkbox, multiSlider,

    panel: addClass(panel, 'absolute w5', 'container'),

    cslider: addClass(slider, 'mr-2 ctrl', 'container'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};