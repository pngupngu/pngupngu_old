import { mat4 } from 'gl-matrix';
import { rad } from "@thi.ng/math/angle";

import { Application } from '@pngu/gl/application';
import { Scene } from '@pngu/gl/scene';
import { Mesh } from '@pngu/gl/mesh';
import { Material } from '@pngu/gl/material';
import { Command } from '@pngu/gl/command';
import { Plane } from '@pngu/gl/geometry';
import { OrthoCamera } from '@pngu/gl/Camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export class App extends Application {
  cmd: Command;
  camera: OrthoCamera;
  mat: Material;

  init(gl) {
    super.init(gl);

    const plane = new Plane(2, 2, 1, 1, mat4.fromXRotation(mat4.create(), rad(90)));

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