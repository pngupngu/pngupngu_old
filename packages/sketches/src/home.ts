import { AppContext } from "./api";
import { ev } from './events';
import { WIRE, PBR } from './routes';

const routeLink = ({ bus, ui }: AppContext, routeId: PropertyKey, routeParams: any, body: any) =>
  ['a', {
    ...ui.link,
    onclick(e: MouseEvent) {
      e.preventDefault();
      bus.dispatch([ev.ROUTE_TO, [routeId, routeParams]])
    }
  },
    body];

export const home = ({ ui }: AppContext) => {
  return ['div', ui.root,
    ['ul', ui.nav,
      ['li', [routeLink, WIRE.id, {}, 'wire']],
      ['li', [routeLink, PBR.id, {}, 'pbr']]
    ]
  ];
}