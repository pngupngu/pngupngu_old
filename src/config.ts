import { setIn, deleteIn } from "@thi.ng/paths";
import { FX_STATE } from "@thi.ng/interceptors/api";
import { reduce, reducer } from "@thi.ng/transducers/reduce";

import { AppConfig } from './api';
import { handlers } from './events';
import * as routes from './routes';
import { home } from './components/home';
import { testRoute } from './components/testroute';
import { uiRoute } from './components/uiroute';

const modules = {
  ca: {
    load: () => import('./components/ca'),
    init(state, { ca }) {
      const rfn = reducer(() => state, (s, [p, v]) => setIn(s, p, v));
      return { [FX_STATE]: reduce(rfn, [['ca', ca()]]) };
    },
    release: state => ({ [FX_STATE]: deleteIn(state, 'ca') })
  }
};

export const CONFIG: AppConfig = {

  router: {
    useFragment: true,
    defaultRouteID: routes.HOME.id,
    routes: [
      routes.HOME,
      routes.CA,
      routes.UI,
    ]
  },

  events: handlers.events,
  effects: handlers.effects,

  components: {
    [routes.HOME.id]: home,
    [routes.CA.id]: testRoute,
    [routes.UI.id]: uiRoute(),
  },

  domRoot: 'app',

  initialState: {
    raf: false,
    modules: modules,
    value: 50
  },

  views: {
    raf: 'raf',
    modules: 'modules',
    ca: ['ca', v => v || ['div', 'loading']],
    value: 'value'
  },

  ui: {
    root: { class: 'wv-100 hv-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' },
    state: { class: 'pa3 ma0 code f7 absolute right-0 top-0 bg-black-05' },
    header: { class: 'h5 pa4 tc bg-dark-gray white' },
    nav: { class: 'list ma0 pa0' },
    link: { class: 'pointer link red' },
    logo: { class: 'br-100 w3 h3' },
    title: { class: 'f1 fw4' },

    button: {
      class: 'input-reset dib f7 code button-reset outline-0 pointer no-select ' +
        'ph1 bn white bg-gray hover-bg-mid-gray v-btm pv-2'
    },

    select: { class: 'relative dib bg-gray pr2 h1 f6' },
    selectTriangle: { class: 'absolute select-triangle' },
    dropdown: { class: 'outline-0 input-reset pointer br0 bn code f7 white bg-gray ph1' },

    sliderContainer: { class: 'dib h1 f6 w4 bg-near-black relative ew-resize v-btm' },
    sliderHandle: { class: 'h-100 absolute bg-gray tr' },
    sliderValue: { class: 'f7 code absolute--fill no-select ph1 white' },

    ca: { class: 'w-100 h-100 absolute' },

    panel: { class: 'w-50 bg-black-80 code f7 collapse' },
    panelLabel: { class: 'w-1 no-select nowrap white' },
    panelControl: { class: 'pv0' },
  }
};