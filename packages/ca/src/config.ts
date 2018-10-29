import { addClass } from '@pngu/core/components/api';

import { AppConfig } from './api';
import { handlers } from './events';
import { ca } from './ca';

// import { home } from '../../../src/components/home';
// import { testRoute } from '../../../src/components/testroute';
// import { uiRoute } from '../../../src/components/uiroute';

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

const styles = {
  panel: {
    container: { class: 'w5 bg-black-80 code f7' },
    label: { class: 'w-1 no-select nowrap white pa0 ph1' },
    content: { class: 'pv0 flex pa0' },
  },
  select: {
    container: { class: 'relative dib bg-gray h1 f6 hover-bg-mid-gray' },
    triangle: { class: 'absolute select-triangle' },
    dropdown: { class: 'outline-0 input-reset pointer br0 bn code f7 white bg-transparent pl1 pr3 w-100 tc tlc' }
  },
  button: {
    class: 'input-reset dib f7 code button-reset outline-0 tc pointer no-select ' +
      'ph1 bn white bg-gray hover-bg-mid-gray v-btm pv-2'
  },
  slider: {
    container: { class: 'dib h1 f6 w4 bg-near-black relative ew-resize v-btm' },
    handle: { class: 'bg-gray tr' },
    value: { class: 'f7 code absolute--fill no-select ph1 white' },
  }
};

export const CONFIG: AppConfig = {

  // router: {
  //   useFragment: true,
  //   defaultRouteID: routes.HOME.id,
  //   routes: [
  //     routes.HOME,
  //     routes.CA,
  //     routes.UI,
  //   ]
  // },

  events: handlers.events,
  effects: handlers.effects,

  // components: {
  //   [routes.HOME.id]: home,
  //   [routes.CA.id]: testRoute,
  //   [routes.UI.id]: uiRoute,
  // },

  domRoot: 'app',

  rootComponent: ca,

  initialState: {
    raf: false,
    value: 50
  },

  views: {
    raf: 'raf',
    value: 'value',
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },

    ...styles,

    panel: {
      ...styles.panel,
      container: addClass(styles.panel.container, 'absolute')
    },

    cbutton: addClass(styles.button, 'fg-1 mr-2 ctrl'),

    select: {
      ...styles.select,
      container: addClass(styles.select.container, 'fg-1 mr-2 ctrl')
    },

    slider: {
      ...styles.slider,
      container: addClass(styles.slider.container, 'fg-1 mr-2 ctrl')
    },

    control: { class: 'fg-1 mr-2 ctrl' },
    textControl: { class: 'mh1' },

    ca: { class: 'w-100 h-100 absolute' },
  }
};