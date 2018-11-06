import createTorusMesh from 'primitive-torus';
import { flatten } from '@thi.ng/iterators/flatten';
import { Vec3 } from '@thi.ng/vectors/vec3';

import { Application } from '@pngu/gl/application';
import { Scene } from '@pngu/gl/scene';
import { Mesh } from '@pngu/gl/mesh';
import { Material } from '@pngu/gl/material';
import { Command } from '@pngu/gl/command';
import { Geometry } from '@pngu/gl/geometry';
import { PerspectiveCamera } from '@pngu/gl/Camera';

import vert from './vert.glsl';
import frag from './frag.glsl';

export interface Params {
  f0: Vec3;
  albedo: Vec3;
  lightPos: Vec3;
  metalic: number;
  roughness: number;
  ambColor: Vec3;
  lightColor: Vec3;
}

export class App extends Application {
  mat: Material;
  cmd: Command;
  camera: PerspectiveCamera;

  params: Params;

  constructor(params: Params) {
    super();
    this.params = params;
  }

  init(gl) {
    super.init(gl);

    this.camera = new PerspectiveCamera(gl.canvas.clientWidth, gl.canvas.clientHeight);
    this.camera.position = [1, 4, 10];
    this.camera.target = [0, 0, 0];
    this.camera.up = [0, 1, 0];

    const attribs = createTorusMesh();
    const geom = new Geometry({
      position: [...flatten(attribs.positions)],
      indices: [...flatten(attribs.cells)],
      uv: { numComponents: 2, data: [...flatten(attribs.uvs)] },
      normal: [...flatten(attribs.normals)]
    });
    this.mat = new Material(vert, frag, {
      lightPos: this.params.lightPos,
      f0: this.params.f0,
      metallic: this.params.metalic,
      albedo: this.params.albedo,
      roughness: this.params.roughness,
      ambColor: this.params.ambColor,
      lightColor: this.params.lightColor,
    });
    const scene = new Scene();
    scene.add(new Mesh(geom, this.mat));

    this.cmd = new Command(gl, scene);
  }

  render(time) {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.mat.uniforms.albedo = this.params.albedo;
    this.mat.uniforms.f0 = this.params.f0;
    this.mat.uniforms.lightPos = this.params.lightPos;
    this.mat.uniforms.metalic = this.params.metalic;
    this.mat.uniforms.roughness = this.params.roughness;
    this.mat.uniforms.ambColor = this.params.ambColor;
    this.mat.uniforms.lightColor = this.params.lightColor;

    this.cmd.draw(time, this.camera);
  }
}