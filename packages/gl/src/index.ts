import * as uuid from 'uuid/v4';
import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";

import { Geometry } from './geom';
import { Node } from './Node';
import Camera from './Camera';
import { Texture } from './Texture';

type Uniforms = IObjectOf<any>;

export class Material {
  id: string = uuid();

  constructor(
    readonly vert: String,
    readonly frag: String,
    readonly uniforms: Uniforms = {}) { }
}

export class Mesh extends Node {
  constructor(readonly geometry: Geometry, readonly material: Material) {
    super();
  }
}

export class Scene extends Node {
  width: number;
  height: number;

  update() { };

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Command {
  scene: Scene;
  programInfos: { [key: string]: any } = {};
  objects: Array<any> = [];

  constructor(readonly gl: WebGLRenderingContext, scene) {
    scene.children.forEach((mesh: Mesh) => {
      const { geometry, material: { id, vert, frag } } = mesh;
      let programInfo = this.programInfos[id];
      if (programInfo == undefined) {
        programInfo = twgl.createProgramInfo(gl, [vert, frag]);
        this.programInfos[id] = programInfo;
      }

      let bufferInfo = twgl.createBufferInfoFromArrays(gl, geometry.attributes);
      let vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

      this.objects.push({ programInfo, vertexArrayInfo, mesh });
    });
  }

  draw(_, vw, vh, fbo = null) {
    const gl = this.gl;
    gl.viewport(0, 0, vw, vh);

    twgl.bindFramebufferInfo(gl, fbo);

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const viewProjection = m4.multiply(camera.projection, camera.view);

    this.objects.forEach(obj => {
      const { mesh: { material } } = obj;
      obj.uniforms = {
        ...material.uniforms,
        screen: [vw, vh]
      };
      // uniforms.u_worldViewProjection = m4.multiply(viewProjection, mesh.model);
    });

    twgl.drawObjectList(gl, this.objects);
  }
}

export class Application {
  gl: WebGLRenderingContext;

  init(gl) { this.gl = gl }
  render(_) { }
}

export { Camera, Texture };

export const getContext = (opts?: any) => (el: HTMLCanvasElement) => twgl.getContext(el, opts);