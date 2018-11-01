// import { IObjectOf } from "@thi.ng/api/api";
// import { rad } from "@thi.ng/math/angle";
import { m4 } from 'twgl.js';
// import { vec2 } from 'gl-matrix';

import { Application, Scene, Mesh, Material, Command, Cube } from '@pngu/gl';
import { Camera } from '@pngu/gl/camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export class App extends Application {
  mat: Material;
  cmd: Command;

  width: number;
  height: number;

  init(gl) {
    super.init(gl);

    this.width = gl.canvas.clientWidth;
    this.height = gl.canvas.clientHeight;

    const camera = new Camera();
    camera.fov = 30 * Math.PI / 180;
    camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    camera.near = 0.5;
    camera.far = 10;
    camera.position = [1, 4, -6];
    camera.target = [0, 0, 0];
    camera.up = [0, 1, 0];

    const cube = new Cube(1);
    this.mat = new Material(vert, frag, {
      model: m4.identity(),
      view: camera.view,
      proj: camera.projection
    });
    const scene = new Scene();
    scene.add(new Mesh(cube, this.mat))

    this.cmd = new Command(gl, scene);
  }

  render(time) {
    this.cmd.draw(time, this.width, this.height);
  }
}