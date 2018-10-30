import { updateIn } from '@thi.ng/paths';
import { panel, select, button, slider, addClass } from '@pngu/ui/styles';

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
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },
    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },

    button, panel,

    tbutton: updateIn(button, 'class', addClass('mh1')),
    tslider: updateIn(slider, 'container.class', addClass('mh1')),
    tselect: updateIn(select, 'container.class', addClass('mh1')),
  }
};