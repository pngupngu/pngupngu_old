import {
  root, panel, select, button, slider, checkbox,
  multiSlider,
  addClass
} from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
// import { cube } from './cube';
// import { defaultParams } from './scenes/pbr'
import { wire } from './wire';
import { defaultParams } from './scenes/wire'

export const CONFIG: AppConfig = {

  events: handlers.events,
  effects: handlers.effects,

  domRoot: 'app',

  // rootComponent: cube,
  rootComponent: wire,

  initialState: {
    raf: false,
    params: defaultParams,
    orientation: [0, 0, 0],
  },

  views: {
    raf: 'raf',
    params: 'params',
    orientation: 'orientation',
    // angle: 'angle',
  },

  ui: {
    root, button, select, slider, checkbox,

    multiSlider3: multiSlider(3),
    multiSlider4: multiSlider(4),

    panel: addClass(panel, 'absolute w5', 'container'),

    cslider: addClass(slider, 'mr-2 ctrl', 'container'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
    orient: { class: 'absolute bottom-0 left-0 right-0 tc code f7' },
  }
};