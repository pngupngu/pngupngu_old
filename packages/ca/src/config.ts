import cx from 'classnames';
import { updateIn } from '@thi.ng/paths';
import { map } from "@thi.ng/transducers/xform/map";
import { keys } from "@thi.ng/transducers/iter/keys";

import { panel, select, button, slider } from '@pngu/ui';

import { AppConfig } from './api';
import { handlers } from './events';
import { ca } from './ca';
import { presets } from './scenes/ca';

// const modules = {
//   ca: {
//     load: () => import('./components/ca'),
//     init(state, { ca }) {
//       const rfn = reducer(() => state, (s, [p, v]) => setIn(s, p, v));
//       return { [FX_STATE]: reduce(rfn, [['ca', ca()]]) };
//     },
//     release: state => ({ [FX_STATE]: deleteIn(state, 'ca') })
//   }
// };

const styles = { panel, select, button, slider };

const addClass = klass => cls => cx(cls, klass);

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

    ...styles,

    panel: updateIn(styles.panel, 'container.class', addClass('absolute')),
    select: updateIn(styles.select, 'container.class', addClass('fg-1 mr-2 ctrl')),
    slider: updateIn(styles.slider, 'container.class', addClass('fg-1 mr-2 ctrl')),
    cbutton: updateIn(styles.button, 'class', addClass('fg-1 mr-2 ctrl')),

    textControl: { class: 'mh1' },

    ca: { class: 'w-100 h-100 absolute' },
  }
};