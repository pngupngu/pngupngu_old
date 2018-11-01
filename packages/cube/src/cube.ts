// import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
// import { filter } from "@thi.ng/transducers/xform/filter";

import { getContext } from '@pngu/gl';
import { canvas } from '@pngu/ui/canvas-webgl';

import { AppContext } from "./api";
import { ev } from "./events";

import { App } from './scene';

const makeCanvas = app => {
  // let sub;
  return canvas({
    init(_: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      // sub = gestureStream(el)
      //   .transform(filter(g => g[0] == GestureType.MOVE))
      //   .subscribe({
      //     next({ 1: { pos: [x, y] } }) {
      //       app.move(x, el.clientHeight - y);
      //     }
      //   });

      app.init(gl);
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, ___: AppContext, time: number, ____: number) {
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      // sub.done();
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