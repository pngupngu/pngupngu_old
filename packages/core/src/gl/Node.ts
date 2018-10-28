import { mat4, vec3 } from 'gl-matrix';

export default class Node {
  protected _position: vec3 = vec3.create();

  children: Array<Node> = [];
  model: mat4 = mat4.create();

  set position(val: vec3) { this._position = val; }
  get position() { return this._position; }

  add(node) {
    this.children.push(node);
  }
}