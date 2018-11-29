// import { rad } from "@thi.ng/math/angle";
// import { Mat44 } from '@thi.ng/vectors/mat44';
import { Vec3 } from '@thi.ng/vectors/vec3';
import { mapcat } from "@thi.ng/transducers/xform/mapcat";
import { flatten } from "@thi.ng/transducers/xform/flatten";

import { Application } from '@pngu/gl/application';
import { Scene } from '@pngu/gl/scene';
import { Mesh } from '@pngu/gl/mesh';
import { Material } from '@pngu/gl/material';
import { Command } from '@pngu/gl/command';
import {
  Quad3, Geometry, tessellate3,
} from '@pngu/gl/geometry';
import { OrthoCamera } from '@pngu/gl/Camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export class App extends Application {
  cmd: Command;
  camera: OrthoCamera;
  mat: Material;

  init(gl) {
    super.init(gl);

    const pts = [
      new Vec3([-1, 1, 0]),
      new Vec3([-1, -1, 0]),
      new Vec3([1, -1, 0]),
      new Vec3([1, 1, 0])
    ];
    const faces = new Quad3(pts).tessellate(tessellate3);
    const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), mapcat((f: Vec3[]) => f, faces));
    const plane = new Geometry({
      position,
      texcoord: [...flatten([[0, 1], [0, 0], [1, 0], [0, 1], [1, 0], [1, 1]])],
    });

    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeightp;

    this.camera = new OrthoCamera(width, height);

    this.mat = new Material(vert, frag);

    const scene = new Scene();
    scene.add(new Mesh(plane, this.mat));
    this.cmd = new Command(gl, scene);
  }

  render(time) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.cmd.draw(time, this.camera);
  }
}