import { getContext } from '@pngu/gl';
import { CameraUI } from '@pngu/gl/camera-ui';
import { canvas } from '@pngu/ui/canvas-webgl';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scene';

const makeCanvas = app => {
  let camUI: CameraUI;
  return canvas({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);

      camUI = new CameraUI(el, app.camera);
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

export const cube = ({ ui }: AppContext) => {
  const app = new App();
  const canvas_ = makeCanvas(app);
  return () =>
    ['div', ui.root,
      [canvas_, ui.ca]];
};