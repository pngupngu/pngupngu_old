import { mat3, mat4, vec3, quat } from 'gl-matrix';

export class Node {
  protected _position: vec3 = vec3.create();
  protected _rotation: quat = quat.identity(quat.create());
  protected _scale: vec3 = vec3.fromValues(1, 1, 1);

  protected _model: mat4 = mat4.identity(mat4.create());
  protected _modelDirty: boolean = true;

  modelView: mat4 = mat4.create();
  normal: mat3 = mat3.create();

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

  updateMatrices(view: mat4) {
    mat4.multiply(this.modelView, view, this.model);
    mat3.normalFromMat4(this.normal, this.modelView);
  }

  add(node) {
    node.parent = this;
    this.children.push(node);
  }
}