import { canvas } from '@pngu/gl/canvas';
import { App } from '@pngu/sketches/ca';

import { Context, ev } from "../api";

export const ca = ({ ui, views, bus }: Context) => {
  const app = new App();
  // const setParam = (name, value) => bus.dispatch([ev.SET_PARAM, ['pbr', name, value]]);
  const canvas_ = canvas(app, {
    init() {
      bus.dispatch([ev.SET_RAF, true]);
    },
    release() {
      bus.dispatch([ev.SET_RAF, false]);
    }
  });

  return () => {
    const params = views.params.deref().ca;
    return ['div', ui.root,
      [canvas_, ui.ca, params],
    ];
  };
};