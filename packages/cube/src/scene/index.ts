import createTorusMesh from 'primitive-torus';
import { flatten } from '@thi.ng/iterators/flatten';
import { Vec3 } from '@thi.ng/vectors/vec3';

import { Application, Scene, Mesh, Material, Command, Geometry } from '@pngu/gl';
import { Camera } from '@pngu/gl/camera';

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
  camera: Camera;

  params: Params;

  mesh: Mesh;

  constructor(params: Params) {
    super();
    this.params = params;
  }

  init(gl) {
    super.init(gl);

    this.camera = new Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);
    this.camera.fov = 30 * Math.PI / 180;
    this.camera.near = 0.5;
    this.camera.far = 100;
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
    this.mesh = new Mesh(geom, this.mat);
    scene.add(this.mesh);

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