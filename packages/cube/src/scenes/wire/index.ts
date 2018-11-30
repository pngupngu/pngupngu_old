import { Vec3 } from '@thi.ng/vectors/vec3';
import { mapcat } from "@thi.ng/transducers/xform/mapcat";
import { flatten } from "@thi.ng/transducers/xform/flatten";
import { map } from "@thi.ng/transducers/xform/map";
import { push } from '@thi.ng/transducers/rfn/push';
import { comp } from "@thi.ng/transducers/func/comp";
import { transduce } from '@thi.ng/transducers/transduce';
import { repeat } from '@thi.ng/transducers/iter/repeat';

import { Application } from '@pngu/gl/application';
import { Scene } from '@pngu/gl/scene';
import { Mesh } from '@pngu/gl/mesh';
import { Material } from '@pngu/gl/material';
import { Command } from '@pngu/gl/command';
import {
  // Quad3,
  AABB,
  Geometry, tessellate3
} from '@pngu/gl/geometry';
// import { OrthoCamera } from '@pngu/gl/Camera';
import { PerspectiveCamera } from '@pngu/gl/Camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export interface Params {
  width: number;
  feather: number;
  squeezeMin: number;
  squeezeMax: number;
  dashOffset: number;
  dashRepeat: number;
  dashLength: number;
}

export const defaultParams: Params = {
  width: 1.0,
  feather: 0.1,
  squeezeMin: 1.0,
  squeezeMax: 1.0,
  dashOffset: 0.0,
  dashRepeat: 1,
  dashLength: 0.5,
};

export class App extends Application {
  cmd: Command;
  camera: PerspectiveCamera;
  mat: Material;

  set params(params: Params) {
    const uniforms = this.mat.uniforms;

    uniforms.width = params.width;
    uniforms.feather = params.feather;
    uniforms.squeezeMin = params.squeezeMin;
    uniforms.squeezeMax = params.squeezeMax;
    uniforms.dashOffset = params.dashOffset;
    uniforms.dashRepeat = params.dashRepeat;
    uniforms.dashLength = params.dashLength;
  }

  init(gl) {
    super.init(gl);

    const faces = new AABB().toPolygon().tessellate(tessellate3);

    // const faceNormals = [
    //   [+1, 0, 0],
    //   [-1, 0, 0],
    //   [0, +1, 0],
    //   [0, -1, 0],
    //   [0, 0, +1],
    //   [0, 0, -1],
    // ];

    const points = transduce(
      comp(mapcat((f: Vec3[]) => f), map(v => v.subNewN(0.5))),
      push(),
      faces);
    const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), points);

    const geom = new Geometry({
      position,
      texcoord: [...flatten(repeat([[1, 0], [0, 0], [0, 1], [1, 0], [0, 1], [1, 1]], 6))],
      // normal: [...flatten(mapcat(n => repeat(n, 6), faceNormals))],
      barycentric: {
        data: [...flatten(repeat([
          [0, 1], [0, 0], [1, 0],
          [1, 0], [0, 0], [0, 1]
        ], 6))],
        numComponents: 2
      }
    });

    // const pts = [
    //   new Vec3([-1, 1, 0]),
    //   new Vec3([-1, -1, 0]),
    //   new Vec3([1, -1, 0]),
    //   new Vec3([1, 1, 0])
    // ];
    // const faces = new Quad3(pts.map(p => p.mulN(0.5))).tessellate(tessellate3);
    // const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), mapcat((f: Vec3[]) => f, faces));
    // const plane = new Geometry({
    //   position,
    //   texcoord: [...flatten([[0, 1], [0, 0], [1, 0], [0, 1], [1, 0], [1, 1]])],
    //   barycentric: {
    //     data: [...flatten([
    //       [0, 1], [0, 0], [1, 0],
    //       [1, 0], [0, 0], [0, 1]])],
    //     numComponents: 2
    //   }
    // });

    // this.camera = new OrthoCamera(gl.canvas.clientWidth, gl.canvas.clientHeight);
    this.camera = new PerspectiveCamera(gl.canvas.clientWidth, gl.canvas.clientHeight);
    this.camera.position = new Vec3([1, 4, 10]);

    this.mat = new Material(vert, frag);

    const scene = new Scene();
    scene.add(new Mesh(geom, this.mat));
    this.cmd = new Command(gl, scene);
  }

  render(time) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.cmd.draw(time, this.camera);
  }
}