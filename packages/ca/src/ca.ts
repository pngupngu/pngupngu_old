import { getIn } from '@thi.ng/paths';
import { button } from '@thi.ng/hdom-components/button';
import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
import { filter } from "@thi.ng/transducers/xform/filter";

import canvas from '@pngu/core/components/canvas-webgl';
import { panel } from '@pngu/core/components/panel';
import { select } from '@pngu/core/components/select';
import { slider } from '@pngu/core/components/slider';

import { AppContext } from "./api";
import { ev } from "./events";
import { CA } from './scenes/ca';

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

const select_ = ({ ui }: AppContext, attrs: any, ...args: any[]) =>
  [select, { attribs: ui.select, ...attrs }, ...args];

const makeSlider = () => {
  const slider_ = slider();
  return ({ ui }: AppContext, args: any, value: number) =>
    [slider_, { attribs: ui.slider, ...args }, value];
};

export const ca = ({ ui, bus, views: { params, presetOpts, preset } }: AppContext) => {
  const app = new CA();
  const canvas_ = makeCanvas(app);

  const cbtn = button({ attribs: ui.cbutton });

  const setParam = name => val => bus.dispatch([ev.SET_PARAM, [name, val]]);

  const s1 = makeSlider();
  const s2 = makeSlider();
  const s3 = makeSlider();

  const setPreset = v => bus.dispatch([ev.SET_PRESET, v]);

  const paramSlider = (name, s) =>
    [name, [s, { min: 0, max: 8, step: 1, onchange: setParam(name) }, getIn(params.deref(), name)]];

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['param1', [cbtn, {}, 'fuck'], [cbtn, {}, 'You']],
        ['preset', [select_, { onchange: setPreset }, presetOpts.deref(), preset.deref()]],
        paramSlider('e1', s1),
        paramSlider('e2', s2),
        paramSlider('f1', s3)
      ]
    ];
};