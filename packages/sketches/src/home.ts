import { appLink } from '@thi.ng/hdom-components/link';

import { AppContext } from "./api";
import { ev } from './events';
import routes from './routes';

export const home = ({ ui, bus }: AppContext) => {
  const routeTo = ([id, params]) => () => bus.dispatch([ev.ROUTE_TO, [id, params]]);

  return ['div', ui.root,
    ['ul', ui.nav,
      ['li', [appLink, ui.link, routeTo([routes.WIRE.id, {}]), 'wire']],
      ['li', [appLink, ui.link, routeTo([routes.PBR.id, {}]), 'pbr']],
    ]
  ];
}