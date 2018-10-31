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
    raf: false
  },

  views: {
    raf: 'raf',
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },

    button,

    panel: addClass(panel, 'absolute', 'container'),
    select: addClass(select, 'fg-1 mr-2 ctrl', 'container'),
    slider: addClass(slider, 'fg-1 mr-2 ctrl', 'container'),
    cbutton: addClass(button, 'fg-1 mr-2 ctrl'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};