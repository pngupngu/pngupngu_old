import { updateIn } from '@thi.ng/paths';
import { map } from "@thi.ng/transducers/xform/map";
import { keys } from "@thi.ng/transducers/iter/keys";

import { panel, select, button, slider, addClass } from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
import { ca } from './ca';
import { presets } from './scenes/ca';

export const CONFIG: AppConfig = {

  events: handlers.events,
  effects: handlers.effects,

  domRoot: 'app',

  rootComponent: ca,

  initialState: {
    raf: false,
    app: {
      presets: presets,
      preset: 'growth',
      params: presets.growth
    }
  },

  views: {
    raf: 'raf',

    preset: 'app.preset',
    presetOpts: ['app.presets', vs => [...map(x => [x, x], keys(vs))]],
    params: 'app.params'
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },

    button,

    panel: updateIn(panel, 'container.class', addClass('absolute')),
    select: updateIn(select, 'container.class', addClass('fg-1 mr-2 ctrl')),
    slider: updateIn(slider, 'container.class', addClass('fg-1 mr-2 ctrl')),
    cbutton: updateIn(button, 'class', addClass('fg-1 mr-2 ctrl')),

    textControl: { class: 'mh1' },

    ca: { class: 'w-100 h-100 absolute' },
  }
};