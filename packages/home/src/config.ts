import {
  root,
  panel, select, button, slider, checkbox,
  inlineButton, inlineSelect, inlineSlider, inlineCheckbox,
  addClass
} from '@pngu/ui/styles';
import { defaultParams } from '@pngu/sketches/wire';

import { AppConfig } from './api';
import { handlers } from './events';
import * as routes from './routes';
import { home } from './components/home';
import { uiRoute } from './components/uiroute';
import { orientRoute } from './components/orient-route';

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
      routes.ORIENT,
    ]
  },

  events: handlers.events,
  effects: handlers.effects,

  components: {
    [routes.HOME.id]: home,
    [routes.UI.id]: uiRoute,
    [routes.ORIENT.id]: orientRoute,
  },

  domRoot: 'app',

  initialState: {
    raf: false,
    value: 50,
    checked: false,
    params: defaultParams,
    location: [0, 0, 0],
  },

  views: {
    raf: 'raf',
    value: 'value',
    checked: 'checked',
    params: 'params',
    location: 'location'
  },

  ui: {
    root,
    logo: { class: 'absolute red center-child' },
    logoBr: { class: 'absolute red bottom-1 right-1' },

    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },

    button, checkbox, select, slider,
    inlineButton, inlineSelect, inlineSlider, inlineCheckbox,

    panel: addClass(panel, 'w5', 'container'),

    container2: { class: 'dg gtc2' },

    cbutton: addClass(button, 'db mr-2 ctrl'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),
    cslider: addClass(slider, 'mr-2 ctrl', 'container'),

    orient: { class: 'absolute off-center tc code f7' },
  }
};