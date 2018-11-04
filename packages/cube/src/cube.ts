import { Vec3 } from '@thi.ng/vectors/vec3';

import { panel } from '@pngu/ui/panel';
import { getContext } from '@pngu/gl';
import { CameraUI } from '@pngu/gl/camera-ui';
import { canvas } from '@pngu/ui/canvas-webgl';
import { create as createSlider } from '@pngu/ui/slider';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scene';

const multiSlider = (name, attribs, opts) => {
  const s1 = createSlider(attribs);
  const s2 = createSlider(attribs);
  const s3 = createSlider(attribs);
  const onchange = (n, bus, value) => v => bus.dispatch([ev.SET_PARAM, [name, (value[n] = v, value)]]);
  return ({ ui, bus }: AppContext, value: Vec3) =>
    ['div', ui.container,
      [s1, { ...opts, onchange: onchange(0, bus, value) }, value.x],
      [s2, { ...opts, onchange: onchange(1, bus, value) }, value.y],
      [s3, { ...opts, onchange: onchange(2, bus, value) }, value.z],
    ];
};

const makeCanvas = app => {
  let camUI: CameraUI;
  return canvas({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);

      camUI = new CameraUI(el, app.camera);
      camUI.speed = 3;
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, ___: AppContext, time: number, ____: number) {
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      camUI.release();
    }
  }, getContext());
};

export const cube = ({ ui, views }: AppContext) => {
  const app = new App(views.params.deref());
  const canvas_ = makeCanvas(app);

  const msF0 = multiSlider('f0', ui.cslider, { min: 0, max: 1, step: 0.01 });
  const msLIghtPos = multiSlider('lightPos', ui.cslider, { min: -2, max: 2, step: 0.01 });

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['f0', [msF0, views.params.deref().f0]],
        ['lightPos', [msLIghtPos, views.params.deref().lightPos]],
      ]];
};