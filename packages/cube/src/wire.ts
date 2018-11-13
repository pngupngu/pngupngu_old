import { canvas } from '@pngu/ui/canvas-webgl';
import { getContext } from '@pngu/gl/application';

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

export const wire = ({ ui }: AppContext) => {
  const canvas_ = makeCanvas(new App());

  return () => ['div', ui.root, [canvas_, ui.ca]];
}