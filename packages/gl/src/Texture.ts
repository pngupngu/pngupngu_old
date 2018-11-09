import * as twgl from 'twgl.js';

// https://github.com/geon/mem/blob/master/src/types/twgl.js/index.d.ts
type TextureFunc = (gl: WebGLRenderingContext, options: TextureOptions) => FullTextureSrc;
type FullTextureSrc = number[] | ArrayBuffer | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string | string[] | TextureFunc;

interface TextureOptions {
  target: number;
  width: number;
  height: number;
  depth: number;
  min: number;
  mag: number;
  minMag: number;
  internalFormat: number;
  format: number;
  type: number;
  wrap: number;
  wrapS: number;
  wrapT: number;
  wrapR: number;
  minLod: number;
  maxLod: number;
  baseLevel: number;
  maxLevel: number;
  unpackAlignment: number;
  premultiplyAlpha: number;
  flipY: number;
  colorspaceConversion: number;
  color: number[] | ArrayBuffer;
  auto: boolean;
  cubeFaceOrder: number[];
  src: FullTextureSrc;
  crossOrigin: string;
}

const NOOP = _ => {};

export class Texture {
  width: number = 1;
  height: number = 1;
  texture: WebGLTexture;
  buffer: Uint8Array;
  ready: boolean;

  constructor(readonly gl: WebGLRenderingContext, options?: Partial<TextureOptions>, callback = NOOP) {
    this.texture = twgl.createTexture(gl, { flipY: true, ...options },
      (_, __, img) => {
        this.width = img.width;
        this.height = img.height;
        this.ready = true;
        callback(this);
      }
    );
    this.buffer = new Uint8Array(this.width * this.height * 4);
  }

  randomize(gen) {
    let { buffer, gl, texture, width, height } = this;
    for (let y = 0, i = 0; y < height; y++) {
      for (let x = 0; x < width; x++ , i++) {
        buffer[i * 4 + 3] = gen(x, y) ? 255 : 0
      }
    }
    twgl.setTextureFromArray(gl, texture, buffer, { width, height });
  }
}