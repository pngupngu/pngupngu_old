import { Vec3 } from '@thi.ng/vectors/vec3';

import { root, panel, select, button, slider, addClass } from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
import { cube } from './cube';

export const CONFIG: AppConfig = {

  events: handlers.events,
  effects: handlers.effects,

  domRoot: 'app',

  rootComponent: cube,

  initialState: {
    raf: false,
    params: {
      lightPos: new Vec3([0, 1, 0]),
      f0: new Vec3([0.04, 0.04, 0.04]),
      metalic: 0.0
    }
  },

  views: {
    raf: 'raf',
    params: 'params'
  },

  ui: {
    root, button, select, slider,

    panel: addClass(panel, 'absolute w5', 'container'),

    container: { class: 'dg gtc3' },
    cslider: addClass(slider, 'mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};