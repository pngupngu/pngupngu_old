import { gestureStream, GestureEvent, GestureType } from "@thi.ng/rstream-gestures";
import { Subscription } from "@thi.ng/rstream/subscription";
import { filter } from "@thi.ng/transducers/xform/filter";

import { canvas } from '@pngu/gl/canvas';
import { App } from '@pngu/scenes/ca';

import { Context, ev } from "../api";

export const ca = ({ ui, views, bus }: Context) => {
  const app = new App();
  const setParam = (name, value) => bus.dispatch([ev.SET_PARAM, ['ca', name, value]]);

  let sub: Subscription<any, GestureEvent>;
  const canvas_ = canvas(app, {
    init(el) {
      sub = gestureStream(el, { absZoom: false })
        .transform(filter(g => g[0] == GestureType.MOVE))
        .subscribe({
          next({ 1: {pos: [x, y]} }) {
            setParam('mouse', [x, el.clientHeight - y])
          }
        })

      bus.dispatch([ev.SET_RAF, true]);
    },
    release() {
      sub.unsubscribe();
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