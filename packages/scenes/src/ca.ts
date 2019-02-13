import { IObjectOf } from "@thi.ng/api";
import { Vec } from '@thi.ng/vectors';
import { AttribPool, GLType } from '@thi.ng/vector-pools';
import { mapcat, pairs, transduce, map, assocObj, flatten } from "@thi.ng/transducers";
import { tessellate } from '@thi.ng/geom';
import { createFramebufferInfo } from 'twgl.js';

import { Application } from '@pngu/gl/application';
import { Scene } from '@pngu/gl/scene';
import { Mesh } from '@pngu/gl/mesh';
import { Material } from '@pngu/gl/material';
import { Command } from '@pngu/gl/command';
import { tessellate3, asPolygon3, Quad3 } from '@pngu/gl/geometry';
import { Texture } from '@pngu/gl/texture';
import { OrthoCamera } from '@pngu/gl/camera';

import vert from './shaders/ca/vert.glsl';
import ca from './shaders/ca/ca.frag';
import copy from './shaders/ca/copy.frag';
import google from './assets/images/google.png';
import nopro from './assets/images/no_pro.png';

export interface Params {
  e1: number;
  e2: number;
  f1: number;
  fade: number;
  mouse: number[];
}

type Presets = Record<'gol' | 'growth' | 'noise' | 'brush' | 'tim' | 'gus', Params>;

const defaults = {
  mouse: [0, 0],
  fade: 1.0
}

export const presets: Presets = {
  gol: { ...defaults, e1: 2, e2: 3, f1: 3 },
  growth: { ...defaults, e1: 2, e2: 5, f1: 3 },
  noise: { ...defaults, e1: 1, e2: 3, f1: 3 },
  brush: { ...defaults, e1: 2, e2: 7, f1: 4 },
  tim: { ...defaults, e1: 2, e2: 4, f1: 1 },
  gus: { ...defaults, e1: 2, e2: 5, f1: 0 }
};

export class App extends Application<Params> {
  cmd1: Command;
  cmd2: Command;

  frontTex: Texture;
  frontFbo: any;
  backTex: Texture;
  backFbo: any;
  isFront: boolean = true;

  stamps: IObjectOf<string> = { google, nopro };
  stampTexs: IObjectOf<Texture> = {};

  mat1: Material;
  mat2: Material;
  camera: OrthoCamera;

  set params(params: Params) {
    let uni = this.mat1.uniforms;
    uni.e1 = params.e1;
    uni.e2 = params.e2;
    uni.f1 = params.f1;
    uni.fade = params.fade;
    uni.mouse = [
      params.mouse[0] / this.gl.canvas.clientWidth,
      params.mouse[1] / this.gl.canvas.clientHeight
    ];
  }

  init(gl: WebGLRenderingContext) {
    super.init(gl);

    this.stampTexs = Object.keys(this.stamps).reduce((a, s) => {
      a[s] = new Texture(gl, { src: this.stamps[s], wrap: gl.CLAMP_TO_EDGE }, tex => {
        const uniforms = this.mat1.uniforms;
        uniforms.stamp = tex.texture;
        uniforms.stampSize = [tex.width, tex.height];
        uniforms.useStamp = 1;
      });
      return a;
    }, {});

    const quad = new Quad3([
      [-1, 1, 0],
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0]
    ]);
    const faces = tessellate(asPolygon3(quad), [tessellate3]);

    const plane = new AttribPool({
      num: 6,
      attribs: {
        position: { type: GLType.F32, size: 3, byteOffset: 0 },
        texcoord: { type: GLType.F32, size: 2, byteOffset: 12 }
      },
      mem: { size: 0x200 }
    });

    plane.setAttribValues('position', [...mapcat((f: Vec[]) => f, faces)]);
    plane.setAttribValues('texcoord', [[0, 1], [0, 0], [1, 0], [0, 1], [1, 0], [1, 1]]);

    const arraySpecs = transduce(
      map(([name, { size }]) => [name, { numComponents: size, data: [...flatten(plane.attribValues(name))] }]),
      assocObj(),
      pairs(plane.specs)
    );

    const scale = 1;
    const width = gl.canvas.clientWidth / scale;
    const height = gl.canvas.clientHeight / scale;

    this.camera = new OrthoCamera(width, height);

    const texOpts = { width, height, min: gl.LINEAR, mag: gl.NEAREST };
    this.frontTex = new Texture(gl, texOpts);
    this.backTex = new Texture(gl, texOpts);

    this.frontFbo = createFramebufferInfo(gl,
      [{ attachment: this.frontTex.texture }, { format: gl.DEPTH_STENCIL, }],
      width, height);
    this.backFbo = createFramebufferInfo(gl,
      [{ attachment: this.backTex.texture }, { format: gl.DEPTH_STENCIL, }],
      width, height);

    const scene1 = new Scene();
    this.mat1 = new Material(vert, ca, { useStamp: 0 });
    scene1.add(new Mesh(arraySpecs, this.mat1));
    this.cmd1 = new Command(gl, scene1);

    const scene2 = new Scene();
    this.mat2 = new Material(vert, copy);
    scene2.add(new Mesh(arraySpecs, this.mat2));
    this.cmd2 = new Command(gl, scene2);
  }

  render(time: number) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let rtt = this.isFront ? this.frontFbo : this.backFbo;
    let state = this.isFront ? this.backTex : this.frontTex;

    let uni1 = this.mat1.uniforms;
    uni1.state = state.texture;
    uni1.screen = [this.camera.width, this.camera.height];

    let uni2 = this.mat2.uniforms;
    uni2.state = rtt.attachments[0];

    this.cmd1.draw(time, this.camera, rtt);
    uni1.useStamp = 0;
    this.cmd2.draw(time, this.camera);

    this.isFront = !this.isFront;
  }

  randomize(gen) {
    let tex = this.isFront ? this.backTex : this.frontTex;
    tex.randomize(gen);
  }

  stamp(id) {
    const uniforms = this.mat1.uniforms;
    const tex = this.stampTexs[id];
    uniforms.stamp = tex.texture;
    uniforms.stampSize = [tex.width, tex.height];
    uniforms.useStamp = 1;
  }
}