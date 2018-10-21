import { AppContext } from '../api';
import { ev } from '../events';

const comp = {
  init(_: HTMLElement, { bus, views: { modules } }: AppContext) {
    bus.dispatch([ev.LOAD_MODULE, modules.deref().ca]);
  },
  render({ ui, views: { ca }}: AppContext) {
    return ['div', ui.root, ca];
  },
  release({ bus, views: { modules} }: AppContext) {
    bus.dispatch([ev.UNLOAD_MODULE, modules.deref().ca]);
  }
};

export const testRoute = () => [comp];