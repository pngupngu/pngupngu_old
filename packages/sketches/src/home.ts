import { appLink } from '@thi.ng/hdom-components/link';

import { Context, ev } from "./api";
import * as routes from './routes';

export const home = ({ ui, bus }: Context) => {
  const routeTo = route => () => bus.dispatch([ev.ROUTE_TO, route]);

  return ['div', ui.root,
    ['ul', ui.nav,
      ['li', [appLink, ui.link, routeTo([routes.WIRE.id, {}]), 'wire']],
      ['li', [appLink, ui.link, routeTo([routes.PBR.id, {}]), 'pbr']],
    ]
  ];
}