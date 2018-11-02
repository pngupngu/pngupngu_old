import { m4 } from 'twgl.js';
import * as bunny from 'bunny';
import { flatten } from '@thi.ng/iterators/flatten';

import {
  Application, Scene, Mesh, Material, Command,
  // Cube
} from '@pngu/gl';
import { Camera } from '@pngu/gl/camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export class App extends Application {
  mat: Material;
  cmd: Command;
  camera: Camera;

  init(gl) {
    super.init(gl);

    this.camera = new Camera();
    this.camera.fov = 30 * Math.PI / 180;
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.camera.near = 0.5;
    this.camera.far = 100;
    this.camera.position = [1, 4, -46];
    this.camera.target = [0, 0, 0];
    this.camera.up = [0, 1, 0];

    // const cube = new Cube(1);
    const cube = {
      attributes: {
        position: [...flatten(bunny.positions)],
        indices: [...flatten(bunny.cells)]
      }
    };
    this.mat = new Material(vert, frag, {
      model: m4.identity(),
      view: this.camera.view,
      proj: this.camera.projection
    });
    const scene = new Scene();
    scene.add(new Mesh(cube, this.mat));

    this.cmd = new Command(gl, scene);
  }

  render(time) {
    this.mat.uniforms.proj = this.camera.projection;
    this.mat.uniforms.view = this.camera.view;
    this.cmd.draw(time);
  }
}