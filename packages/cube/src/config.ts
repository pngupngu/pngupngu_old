import { Vec3 } from '@thi.ng/vectors/vec3';

import { panel, select, button, slider, addClass } from '@pngu/ui/styles';

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
      f0: new Vec3([0.04, 0.04, 0.04])
    }
  },

  views: {
    raf: 'raf',
    params: 'params'
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },

    button, select, slider,

    panel: addClass(panel, 'absolute', 'container'),
    // select: addClass(select, 'fg-1 mr-2 ctrl', 'container'),
    // slider: addClass(slider, 'fg-1 mr-2 ctrl', 'container'),
    // cbutton: addClass(button, 'fg-1 mr-2 ctrl'),

    container: { class: 'flex' },
    cslider: addClass(slider, 'fg-1 mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};