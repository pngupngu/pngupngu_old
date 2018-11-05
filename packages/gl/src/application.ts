import * as twgl from 'twgl.js';

export class Application {
  gl: WebGLRenderingContext;

  init(gl: WebGLRenderingContext) { this.gl = gl }
  render(_) { }
}

export const getContext = (opts?: any) => (el: HTMLCanvasElement) => twgl.getContext(el, opts);