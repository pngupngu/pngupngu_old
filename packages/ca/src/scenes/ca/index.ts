import { IObjectOf } from "@thi.ng/api/api";
import { rad } from "@thi.ng/math/angle";
import { createFramebufferInfo, m4 } from 'twgl.js';
import { vec2 } from 'gl-matrix';

import { Application, Scene, Mesh, Material, Command, Plane } from '@pngu/gl';
import { Texture } from '@pngu/gl/texture';

import { Presets, Params } from './api';
import vert from './vert.glsl';
import ca from './ca.frag';
import copy from './copy.frag';
import google from '../../assets/images/google.png';
import nopro from '../../assets/images/no_pro.png';

export const presets: Presets = {
  gol: { e1: 2, e2: 3, f1: 3 },
  growth: { e1: 2, e2: 5, f1: 3 },
  noise: { e1: 1, e2: 3, f1: 3 },
  brush: { e1: 2, e2: 7, f1: 4 },
  tim: { e1: 2, e2: 4, f1: 1 },
  gus: { e1: 2, e2: 5, f1: 0 }
};

export class CA extends Application {
  cmd1: Command;
  cmd2: Command;

  frontTex: Texture;
  frontFbo: any;
  backTex: Texture;
  backFbo: any;
  isFront: boolean = true;

  width: number;
  height: number;

  params: Params;

  fade: number = 1.0;

  stamps: IObjectOf<string> = { google, nopro };
  stampTexs: IObjectOf<Texture> = {};

  mat1: Material;
  mat2: Material;

  constructor(params: Params = presets.growth) {
    super();
    this.params = params;
  }

  init(gl) {
    super.init(gl);

    this.stampTexs = Object.keys(this.stamps).reduce((a, s) => {
      a[s] = new Texture(gl, { src: this.stamps[s], wrap: gl.CLAMP_TO_EDGE }, tex => {
        const uniforms = this.mat1.uniforms;
        uniforms.stamp = tex.texture;
        uniforms.stampSize = vec2.fromValues(tex.width, tex.height);
        uniforms.useStamp = 1;
      });
      return a;
    }, {});

    const plane = new Plane(2, 2, 1, 1, m4.rotationX(rad(90)));

    const scale = 1;
    this.width = gl.canvas.clientWidth / scale;
    this.height = gl.canvas.clientHeight / scale;

    const texOpts = {
      width: this.width, height: this.height,
      min: gl.LINEAR, mag: gl.NEAREST
    };
    this.frontTex = new Texture(gl, texOpts);
    this.backTex = new Texture(gl, texOpts);

    this.frontFbo = createFramebufferInfo(gl,
      [{ attachment: this.frontTex.texture }, { format: gl.DEPTH_STENCIL, }],
      this.width, this.height);
    this.backFbo = createFramebufferInfo(gl,
      [{ attachment: this.backTex.texture }, { format: gl.DEPTH_STENCIL, }],
      this.width, this.height);

    const scene1 = new Scene();
    this.mat1 = new Material(vert, ca, {
      e1: this.params.e1, e2: this.params.e2, f1: this.params.f1,
      fade: this.fade,
      useStamp: 0
      // stamp: this.stampTexs[0].texture,
      // stampSize: vec2.fromValues(this.stampTexs[0].width, this.stampTexs[0].height)
    });
    scene1.add(new Mesh(plane, this.mat1));
    this.cmd1 = new Command(gl, scene1);

    const scene2 = new Scene();
    this.mat2 = new Material(vert, copy);
    scene2.add(new Mesh(plane, this.mat2));
    this.cmd2 = new Command(gl, scene2);
  }

  render(time) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);

    let rtt = this.isFront ? this.frontFbo : this.backFbo;
    let state = this.isFront ? this.backTex : this.frontTex;

    let uni1 = this.mat1.uniforms;
    uni1.state = state.texture;
    uni1.e1 = this.params.e1;
    uni1.e2 = this.params.e2;
    uni1.f1 = this.params.f1;
    uni1.fade = this.fade;

    let uni2 = this.mat2.uniforms;
    uni2.state = rtt.attachments[0];

    this.cmd1.draw(time, this.width, this.height, rtt);
    uni1.useStamp = 0;
    this.cmd2.draw(time);

    this.isFront = !this.isFront;
  }

  move(ox, oy) {
    const v = vec2.fromValues(ox, oy);
    vec2.divide(v, v, vec2.fromValues(this.width, this.height));
    this.mat1.uniforms.mouse = v;
  }

  randomize(gen) {
    let tex = this.isFront ? this.backTex : this.frontTex;
    tex.randomize(gen);
  }

  stamp(id) {
    const uniforms = this.mat1.uniforms;
    const tex = this.stampTexs[id];
    uniforms.stamp = tex.texture;
    uniforms.stampSize = vec2.fromValues(tex.width, tex.height);
    uniforms.useStamp = 1;
  }
}