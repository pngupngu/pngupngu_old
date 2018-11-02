import { getIn } from '@thi.ng/paths';
import { button } from '@thi.ng/hdom-components/button';
import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
import { filter } from "@thi.ng/transducers/xform/filter";

import { getContext } from '@pngu/gl';
import { SelectArgs } from '@pngu/ui/api';
import { canvas } from '@pngu/ui/canvas-webgl';
import { panel } from '@pngu/ui/panel';
import { create as createSelect } from '@pngu/ui/select';
import { create as createSlider } from '@pngu/ui/slider';

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
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, { views }: AppContext, time: number, ____: number) {
      app.params = views.params.deref();
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      sub.done();
    }
  }, getContext());
};

export const ca = ({ ui, bus, views: { params, presetOpts, preset } }: AppContext) => {
  const app = new CA();
  const canvas_ = makeCanvas(app);

  const cbtn = button({ attribs: ui.cbutton });

  const setParam = name => val => bus.dispatch([ev.SET_PARAM, [name, val]]);
  const setPreset = v => bus.dispatch([ev.SET_PRESET, v]);
  const select = createSelect(ui.select);

  const paramSlider = name => {
    const slider = createSlider(ui.slider);
    const onchange = setParam(name);
    return () =>
      [name, [slider,
        { min: 0, max: 8, step: 1, onchange },
        getIn(params.deref(), name)]];
  };

  const e1 = paramSlider('e1');
  const e2 = paramSlider('e2');
  const f1 = paramSlider('f1');

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['param1', [cbtn, {}, 'fuck'], [cbtn, {}, 'You']],
        ['preset', [select, { onchange: setPreset }, presetOpts.deref(), preset.deref()]],
        e1(), e2(), f1()
      ]
    ];
};