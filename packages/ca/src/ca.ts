import { button } from '@thi.ng/hdom-components/button';
import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
import { filter } from "@thi.ng/transducers/xform/filter";

import canvas from '@pngu/core/components/canvas-webgl';
import { panel } from '@pngu/core/components/panel';
import { select } from '@pngu/core/components/select';
import { slider } from '@pngu/core/components/slider';

import { AppContext } from "./api";
import { ev } from "./events";
import App from './scenes/ca';

const makeCanvas = app => {
  let sub;
  return canvas({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      sub = gestureStream(el)
        .transform(filter(g => g[0] == GestureType.MOVE))
        .subscribe({
          next({ 1: { pos: [x, y] } }) {
            app.move(x, el.clientHeight - y);
          }
        });

      app.init(gl);
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, ___: AppContext, time: number, ____: number) {
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      sub.done();
    }
  }, {});
};

const cselect = ({ ui }: AppContext, ...args: any[]) =>
  [select, { attribs: ui.select }, ...args];

const makeSlider = () => {
  const slider_ = slider();
  return ({ ui }: AppContext, args: any, value: number) =>
    [slider_, { attribs: ui.slider, ...args }, value];
};

export const ca = ({ ui, bus, views }: AppContext) => {
  const app = new App();
  const canvas_ = makeCanvas(app);

  const btn = button({ attribs: ui.button });

  const cbtn = button({ attribs: ui.cbutton });
  const cslider = makeSlider();

  const options = [[1, 'fuck'], [2, 'hello 100 you']];
  const setValue = n => bus.dispatch([ev.SET_VALUE, n]);

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['param1', [cbtn, {}, 'fuck'], [cbtn, {}, 'You']],
        ['param2', [cbtn, {}, 'Fuck']],
        ['param3', [cbtn, {}, 'cao'], [btn, {}, 'B']],
        ['param4', [cselect, options, 1]],
        ['param3', [cbtn, {}, 'caoB']],
        ['param5', [cslider, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()]],
        ['param3', [cbtn, {}, 'caoB']]
      ]
    ];
};