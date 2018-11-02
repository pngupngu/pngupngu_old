import * as uuid from 'uuid/v4';
import { mat4, vec3 } from 'gl-matrix';
import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";

type GeomAttribs = IObjectOf<number[]>;

export class Geometry {
  attributes: GeomAttribs;

  constructor(attribs: GeomAttribs) {
    this.attributes = attribs;
  }
}

export class Cube extends Geometry {
  constructor(size) {
    super(twgl.primitives.createCubeVertices(size));
  }
}

export class Plane extends Geometry {
  constructor(width, depth, subdivWidth = 1, subdivDepth = 1, matrix?) {
    super(twgl.primitives.createPlaneVertices(width, depth, subdivWidth, subdivDepth, matrix));
  }
}

type Uniforms = IObjectOf<any>;

export class Material {
  id: string = uuid();

  constructor(
    readonly vert: String,
    readonly frag: String,
    readonly uniforms: Uniforms = {}) { }
}

export class Node {
  protected _position: vec3 = vec3.create();

  children: Array<Node> = [];
  model: mat4 = mat4.create();

  set position(val: vec3) { this._position = val; }
  get position() { return this._position; }

  add(node) {
    this.children.push(node);
  }
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
  programInfos: IObjectOf<any> = {};
  objects: Array<any> = [];

  constructor(readonly gl: WebGLRenderingContext, scene: Scene) {
    scene.children.forEach((mesh: Mesh) => {
      const { geometry, material } = mesh;
      const programInfo = this.getProgram(material);
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, geometry.attributes);
      const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

      this.objects.push({ programInfo, vertexArrayInfo, mesh });
    });
  }

  draw(_,
    vw = this.gl.canvas.width,
    vh = this.gl.canvas.height,
    fbo = null) {
    const gl = this.gl;
    gl.viewport(0, 0, vw, vh);

    twgl.bindFramebufferInfo(gl, fbo);

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // const viewProjection = m4.multiply(camera.projection, camera.view);

    this.objects.forEach(obj => {
      const { mesh: { material } } = obj;
      obj.uniforms = { ...material.uniforms, screen: [vw, vh] };
      // uniforms.u_worldViewProjection = m4.multiply(viewProjection, mesh.model);
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

export class Application {
  gl: WebGLRenderingContext;

  init(gl) { this.gl = gl }
  render(_) { }
}

export const getContext = (opts?: any) => (el: HTMLCanvasElement) => twgl.getContext(el, opts);