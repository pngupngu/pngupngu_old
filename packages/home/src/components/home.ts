import { AppContext } from '../api';
import { ev } from '../events';

import { appState } from './appstate';
import { eventLink } from './event-link';
import { routeLink } from './route-link';

export function home(ctx: AppContext) {
  const ui = ctx.ui;
  return ['div', ui.root,
    ['ul', ui.nav,
      ['li', [routeLink, ui.link, 'ca', { id: 1 }, 'ca']],
      ['li', [routeLink, ui.link, 'ui', {}, 'ui']],
      ['li', [eventLink, ui.link, [ev.ALERT, 'it works'], 'test alert']],
    ],
    appState
  ];
}