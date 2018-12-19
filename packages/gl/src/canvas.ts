import { addExtensionsToContext } from 'twgl.js';
import fit from 'canvas-fit';
import { canvasWebGL, CanvasHandlers } from "@thi.ng/hdom-components/canvas";

import { Application } from './application';

export function canvas<T>(app: Application<T>, { init, update, release }: Partial<CanvasHandlers<WebGLRenderingContext>>) {
  let resize;
  return canvasWebGL({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any) {
      addExtensionsToContext(gl);
      resize = fit(el);
      resize();

      app.init(gl);

      init && init(el, gl);
    },
    update(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any, time: number, __: number, ___: any, params: T) {
      app.params = params;
      app.render(time);

      update && update(el, gl);
    },
    release(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any) {
      release && release(el, gl);
    }
  });
};