import { float } from '@thi.ng/strings/float';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/wire';
import { canvas, controls } from './components/wire';

export const wire = ({ ui, views, bus }: AppContext) => {
  const canvas_ = canvas(new App(), {
    init: () => bus.dispatch([ev.SET_RAF, true]),
    release: () => bus.dispatch([ev.SET_RAF, false])
  });
  const panel_ = controls({
    panel: ui.panel,
    slider: ui.cslider,
    checkbox: ui.checkbox,
    multislider: ui.multiSlider4
  }, (name, value) => bus.dispatch([ev.SET_PARAM, [name, value]]));

  const fmt = float(2);

  return () => {
    const params = views.params.deref();
    const orient = views.orientation.deref();
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [panel_, params],
      ['div', ui.orient, `${fmt(orient[0])}, ${fmt(orient[1])}, ${fmt(orient[2])}`],
    ];
  };
}