import { mat4, vec3 } from 'gl-matrix';

import Node from './Node';

export default class Camera extends Node {
  isPerspective: boolean = true;

  private _fov: number = Math.PI / 6;
  private _aspect: number = 1.0;
  private _near: number = 0.01;
  private _far: number = 1000;
  private _projectionCached: boolean = false;

  private _target: any = vec3.fromValues(0, 0, 0);
  private _up: any = vec3.fromValues(0, 1, 0);
  private _viewCached: boolean = false;

  private _view: any = mat4.create();
  private _projection: any = mat4.create();

  set fov(val: number) {
    this._fov = val;
    this._projectionCached = false;
  }
  get fov() { return this._fov; }

  set aspect(val: number) {
    this._aspect = val;
    this._projectionCached = false;
  }
  get aspect() { return this._aspect; }

  set near(val: number) {
    this._near = val;
    this._projectionCached = false;
  }
  get near() { return this._near; }

  set far(val: number) {
    this._far = val;
    this._projectionCached = false;
  }
  get far() { return this._far; }

  set position(val: any) {
    this._position = val;
    this._viewCached = false;
  }
  get position() { return this._position; }

  set target(val: any) {
    this._target = val;
    this._viewCached = false;
  }
  get target() { return this._target; }

  set up(val: any) {
    this._up = val;
    this._viewCached = false;
  }
  get up() { return this._up; }

  get projection() {
    if (!this._projectionCached) {
      mat4.perspective(this._projection, this.fov, this.aspect, this.near, this.far);
      this._projectionCached = true;
    }
    return this._projection;
  }

  get view() {
    if (!this._viewCached) {
      mat4.lookAt(this._view, this.position, this.target, this.up);
      this._viewCached = true;
    }
    return this._view;
  }
}