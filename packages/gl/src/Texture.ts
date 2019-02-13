import {
  TextureOptions, createTexture,
  // setTextureFromArray
} from 'twgl.js';

const NOOP = _ => {};

export class Texture {
  width: number = 1;
  height: number = 1;
  texture: WebGLTexture;
  buffer: Uint8Array;
  ready: boolean;

  constructor(readonly gl: WebGLRenderingContext, options?: Partial<TextureOptions>, callback = NOOP) {
    this.texture = createTexture(gl, { flipY: 1, ...options },
      (_, __, ___) => {
        this.ready = true;
        callback(this);
      }
    );
    this.buffer = new Uint8Array(this.width * this.height * 4);
  }

  randomize(_) {
    // let { buffer, gl, texture, width, height } = this;
    // for (let y = 0, i = 0; y < height; y++) {
    //   for (let x = 0; x < width; x++ , i++) {
    //     buffer[i * 4 + 3] = gen(x, y) ? 255 : 0
    //   }
    // }
    // setTextureFromArray(gl, texture, buffer, { width, height });
  }
}