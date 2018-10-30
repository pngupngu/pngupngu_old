import { CanvasHandlers } from "@thi.ng/hdom-components/canvas";
import fit from 'canvas-fit';

export default function({ init, update, release }: Partial<CanvasHandlers<WebGLRenderingContext>>, getContext) {
  let el, ctx, resize;
  let frame = 0;
  let time = 0;
  return {
    init(_el: HTMLCanvasElement, hctx: any, ...args: any[]) {
      el = _el;
      resize = fit(el);
      resize();

      ctx = getContext(el);
      time = Date.now();
      init && init(el, ctx, hctx, ...args);
      update && update(el, ctx, hctx, time, frame++, ...args);
    },
    render(hctx: any, ...args: any[]) {
      ctx && update && update(el, ctx, hctx, Date.now() - time, frame++, ...args);
      return ["canvas", args[0]];
    },
    release(hctx: any, ...args: any[]) {
      release && release(el, ctx, hctx, ...args);
    }
  };
}