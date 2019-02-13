import {
  createBufferInfoFromArrays, createVertexArrayInfo, bindFramebufferInfo,
  drawObjectList, createProgramInfo
} from 'twgl.js';
import { IObjectOf } from "@thi.ng/api";

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
      const bufferInfo = createBufferInfoFromArrays(gl, mesh.attribs);
      const vertexArrayInfo = createVertexArrayInfo(gl, programInfo, bufferInfo);

      this.objects.push({
        programInfo, vertexArrayInfo, mesh,
        type: mesh.type
       });
    });
  }

  draw(_: number, camera: Camera, fbo = null) {
    const gl = this.gl;
    gl.viewport(0, 0, camera.width, camera.height);

    bindFramebufferInfo(gl, fbo);

    this.objects.forEach(obj => {
      const { mesh } = obj;
      mesh.updateMatrices(camera.view);
      obj.uniforms = {
        ...mesh.material.uniforms,
        matModel: mesh.model,
        matView: camera.view,
        matProj: camera.projection,
        matModelView: mesh.modelView,
        matNormal: mesh.normal,
      };
    });

    drawObjectList(gl, this.objects);
  }

  getProgram({ id, vert, frag }: Material) {
    if (!this.programInfos[id]) {
      this.programInfos[id] = createProgramInfo(this.gl, [vert, frag]);
    }
    return this.programInfos[id];
  }
}