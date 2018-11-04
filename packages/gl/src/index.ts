import * as uuid from 'uuid/v4';
import { mat4, vec3, quat } from 'gl-matrix';
import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";

interface GeomAttrib {
  numComponents: number;
  data: number[]
}
type GeomAttribs = IObjectOf<number[] | GeomAttrib>;

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
  protected _rotation: quat = quat.identity(quat.create());
  protected _scale: vec3 = vec3.fromValues(1, 1, 1);

  protected _model: mat4 = mat4.identity(mat4.create());
  protected _modelDirty: boolean = true;

  parent: Node;
  children: Array<Node> = [];

  set position(val: vec3) { this._position = val; this._modelDirty = true; }
  get position() { return this._position; }
  set rotation(val: quat) { this._rotation = val; this._modelDirty = true; }
  get rotation() { return this._rotation; }
  set scale(val: vec3) { this._scale = val; this._modelDirty = true; }
  get scale() { return this._scale; }

  get model() {
    if (this._modelDirty) {
      mat4.fromRotationTranslationScale(this._model, this.rotation, this.position, this.scale);
      this._modelDirty = false;
    }
    return this._model;
  }

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
      const programInfo = this.getProgram(mesh.material);
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, mesh.geometry.attributes);
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

    // const viewProjection = m4.multiply(camera.projection, camera.view);

    this.objects.forEach(obj => {
      const { mesh: { material } } = obj;
      obj.uniforms = {
        ...material.uniforms,
        screen: [vw, vh],
        matModel: obj.model
      };
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