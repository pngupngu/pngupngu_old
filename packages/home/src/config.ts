import {
  root,
  panel, select, button, slider,
  inlineButton, inlineSelect, inlineSlider,
  addClass
} from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
import * as routes from './routes';

import { home } from './components/home';
import { uiRoute } from './components/uiroute';

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

export const CONFIG: AppConfig = {

  router: {
    useFragment: true,
    defaultRouteID: routes.HOME.id,
    routes: [
      routes.HOME,
      routes.UI,
    ]
  },

  events: handlers.events,
  effects: handlers.effects,

  components: {
    [routes.HOME.id]: home,
    [routes.UI.id]: uiRoute,
  },

  domRoot: 'app',

  initialState: {
    raf: false,
    value: 50,
  },

  views: {
    raf: 'raf',
    value: 'value'
  },

  ui: {
    root,

    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },

    button,
    inlineButton, inlineSelect, inlineSlider,

    panel: addClass(panel, 'w5', 'container'),

    container2: { class: 'dg gtc2' },

    cbutton: addClass(button, 'db mr-2 ctrl'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),
    cslider: addClass(slider, 'mr-2 ctrl', 'container'),
  }
};