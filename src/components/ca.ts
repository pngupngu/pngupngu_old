import { gestureStream, GestureType } from "@thi.ng/rstream-gestures";
import { filter } from "@thi.ng/transducers/xform/filter";

import { AppContext } from "../api";
import { ev } from "../events";
import canvas from './canvas-webgl';
import App from '../scenes/ca';

export const ca = () => {
  const app = new App();
  let sub;
  const canvas_ = canvas({
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
  return ({ ui }: AppContext) => [canvas_, ui.ca];
};