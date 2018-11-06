import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";

import { Camera } from './camera';
import { Scene } from './scene';
import { Mesh } from './mesh';
import { Material } from './material';

export class Command {
  scene: Scene;
  programInfos: IObjectOf<any> = {};
  objects: Array<any> = [];

  constructor(readonly gl: WebGLRenderingContext, scene: Scene) {
    scene.children.forEach(node => {
      const mesh = <Mesh>node;
      const programInfo = this.getProgram(mesh.material);
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, mesh.geometry.attributes);
      const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

      this.objects.push({ programInfo, vertexArrayInfo, mesh });
    });
  }

  draw(_, camera: Camera, fbo = null) {
    const gl = this.gl;
    gl.viewport(0, 0, camera.width, camera.height);

    twgl.bindFramebufferInfo(gl, fbo);

    this.objects.forEach(obj => {
      const { mesh } = obj;
      mesh.updateMatrices(camera.view);
      obj.uniforms = {
        ...mesh.material.uniforms,
        screen: [camera.width, camera.height],
        matModel: mesh.model,
        matView: camera.view,
        matProj: camera.projection,
        matModelView: mesh.modelView,
        matNormal: mesh.normal,
      };
    });

    twgl.drawObjectList(gl, this.objects);
  }

  getProgram({ id, vert, frag }: Material) {
    if (!this.programInfos[id]) {
      this.programInfos[id] = twgl.createProgramInfo(this.gl, [vert, frag]);
    }
    return this.programInfos[id];
  }
}