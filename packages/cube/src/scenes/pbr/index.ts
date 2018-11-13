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
import { Texture } from '@pngu/gl/texture';

import vert from './vert.glsl';
import frag from './frag.glsl';
import brickDiffuse from '../../assets/images/brick-diffuse.jpg';
import brickNormal from '../../assets/images/brick-normal.jpg';
import brickSpecular from '../../assets/images/brick-specular.jpg';

export enum DistTypes { BlinnPhong, GGX, Beckmann, }
export enum GeometryTypes { Implicit, Schlick, GGX, CookTorrance, }
export enum DiffuseTypes { Default, Disney, NormalizedDisney, OrenNayar, }

export interface Params {
  f0: Vec3;
  albedo: Vec3;
  lightPos: Vec3;
  metalic: number;
  roughness: number;
  ambColor: Vec3;
  lightColor: Vec3;
  useTexNormal: boolean;
  useTexDiff: boolean;
  useGamma: boolean;
  distributionType: DistTypes;
  geometryType: GeometryTypes;
  diffuseType: DiffuseTypes;
  showNormal: boolean;
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
      useTexNormal: this.params.useTexNormal,
      useTexDiff: this.params.useTexDiff,
      useGamma: this.params.useGamma,
      distributionType: this.params.distributionType,
      geometryType: this.params.geometryType,
      diffuseType: this.params.diffuseType,
      showNormal: this.params.showNormal,
    });

    new Texture(gl, { src: brickDiffuse }, tex => { this.mat.uniforms.texDiffuse = tex; });
    new Texture(gl, { src: brickNormal }, tex => { this.mat.uniforms.texNormal = tex; });
    new Texture(gl, { src: brickSpecular }, tex => { this.mat.uniforms.texSpecular = tex; });

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

    const uniforms = this.mat.uniforms;

    uniforms.albedo = this.params.albedo;
    uniforms.f0 = this.params.f0;
    uniforms.lightPos = this.params.lightPos;
    uniforms.metalic = this.params.metalic;
    uniforms.roughness = this.params.roughness;
    uniforms.ambColor = this.params.ambColor;
    uniforms.lightColor = this.params.lightColor;
    uniforms.useTexNormal = this.params.useTexNormal;
    uniforms.useTexDiff = this.params.useTexDiff;
    uniforms.useGamma = this.params.useGamma;
    uniforms.distributionType = this.params.distributionType;
    uniforms.geometryType = this.params.geometryType;
    uniforms.diffuseType = this.params.diffuseType;
    uniforms.showNormal = this.params.showNormal;

    this.cmd.draw(time, this.camera);
  }
}