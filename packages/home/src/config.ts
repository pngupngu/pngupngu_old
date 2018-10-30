
import { AppConfig } from './api';
import { handlers } from './events';
import * as routes from './routes';

import { home } from './components/home';
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
    [routes.HOME.id]: home
    // [routes.UI.id]: uiRoute,
  },

  domRoot: 'app',

  initialState: {
    raf: false,
  },

  views: {
    raf: 'raf',
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },
    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },
  }
};