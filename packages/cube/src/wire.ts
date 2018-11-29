import { canvas } from '@pngu/ui/canvas-webgl';
import { getContext } from '@pngu/gl/application';
import { panel } from '@pngu/ui/panel';
import { create as createSlider } from '@pngu/ui/slider';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/wire';

const makeCanvas = app => {
  return canvas({
    init(_: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, { views }: AppContext, time: number, ____: number) {
      app.params = views.params.deref();
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
    }
  }, getContext());
};

export const wire = ({ ui, views, bus }: AppContext) => {
  const canvas_ = makeCanvas(new App());
  const onchange = name => v => bus.dispatch([ev.SET_PARAM, [name, v]])

  const sWidth = createSlider(ui.cslider);
  const sFeather = createSlider(ui.cslider);
  const sSqueezeMin = createSlider(ui.cslider);
  const sSqueezeMax = createSlider(ui.cslider);

  return () => {
    const params = views.params.deref();
    return ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['width', [sWidth, { min: 0, max: 10, step: 0.01, onchange: onchange('width') }, params.width]],
        ['feather', [sFeather, { min: 0, max: 1, step: 0.01, onchange: onchange('feather') }, params.feather]],
        ['squeezeMin', [sSqueezeMin, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMin') }, params.squeezeMin]],
        ['squeezeMax', [sSqueezeMax, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMax') }, params.squeezeMax]],
      ]
    ];
  };
}