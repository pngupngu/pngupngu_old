export class Application<T> {
  gl: WebGLRenderingContext;
  set params(_: T) { }

  init(gl: WebGLRenderingContext) { this.gl = gl }
  render(_: number) { }
}