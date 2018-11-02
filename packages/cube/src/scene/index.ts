import { mat3, mat4 } from 'gl-matrix';
import createTorusMesh from 'primitive-torus';
import { flatten } from '@thi.ng/iterators/flatten';

import { Application, Scene, Mesh, Material, Command, Geometry } from '@pngu/gl';
import { Camera } from '@pngu/gl/camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export class App extends Application {
  mat: Material;
  cmd: Command;
  camera: Camera;

  matModel: mat4 = mat4.identity(mat4.create());
  matViewModel: mat4 = mat4.create();
  matNormal: mat3 = mat3.create();

  init(gl) {
    super.init(gl);

    this.camera = new Camera();
    this.camera.fov = 30 * Math.PI / 180;
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.camera.near = 0.5;
    this.camera.far = 100;
    this.camera.position = [1, 4, -10];
    this.camera.target = [0, 0, 0];
    this.camera.up = [0, 1, 0];

    const attribs = createTorusMesh();
    const cube = new Geometry({
      position: [...flatten(attribs.positions)],
      indices: [...flatten(attribs.cells)],
      uv: {
        numComponents: 2,
        data: [...flatten(attribs.uvs)]
      },
      normal: [...flatten(attribs.normals)]
    });
    this.mat = new Material(vert, frag, {
      matModel: this.matModel,
      matView: this.camera.view,
      matProj: this.camera.projection,
      lightPos: [0, 1, 0],
      f0: [0.04, 0.04, 0.04],
      albedo: [0.9, 0.9, 0.9],
      roughness: 0.1,
      metallic: 0.0,
      ambColor: [0.03, 0.03, 0.03],
      lightColor: [1, 1, 1],
    });
    const scene = new Scene();
    scene.add(new Mesh(cube, this.mat));

    this.cmd = new Command(gl, scene);
  }

  render(time) {
    mat3.normalFromMat4(this.matNormal, mat4.multiply(this.matViewModel, this.camera.view, this.matModel));
    this.mat.uniforms.matView = this.camera.view;
    this.mat.uniforms.matProj = this.camera.projection;
    this.mat.uniforms.matViewModel = this.matViewModel;
    this.mat.uniforms.matNormal = this.matNormal;

    this.cmd.draw(time);
  }
}